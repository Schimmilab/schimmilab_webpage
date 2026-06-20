/**
 * Post-build script: generate per-route HTML files with correct <title> and <meta description>.
 *
 * The SPA serves a single index.html for all routes. This script copies that file for each
 * known route and patches the title/description so web crawlers see the right metadata
 * even without executing JavaScript.
 *
 * Run after `vite build` via the postbuild npm script.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist/public");

// ── Helpers ────────────────────────────────────────────────────────────────

function readIndex(): string {
  return readFileSync(join(DIST, "index.html"), "utf-8");
}

function patchHtml(html: string, title: string, description: string, h1: string): string {
  // Inject static skeleton inside #root so crawlers without JS see:
  // - a skip link  → fixes a11y/skip-link
  // - a <main> landmark → fixes a11y/landmark-one-main
  // - an <h1>  → fixes core/h1
  // - the description as visible text → improves content/word-count
  // React replaces #root content entirely on first render, so no hydration conflict.
  // Site-wide nav links so crawlers without JS see internal links + the legally
  // required Impressum/Datenschutz links on every page. Trailing slashes match
  // the pre-rendered directory URLs and avoid 301 redirect chains.
  const nav =
    `<nav aria-label="Hauptnavigation"><a href="/">Schimmilab Startseite</a><a href="/experimente/">Experimente</a>` +
    `<a href="/infrastruktur/">Infrastruktur</a><a href="/gedankenraum/">Gedankenraum</a>` +
    `<a href="/medien/">Medien</a><a href="/impressum/">Impressum</a>` +
    `<a href="/datenschutz/">Datenschutz</a></nav>`;
  const skeleton = `<div id="root"><a href="#main-content" style="position:absolute;left:-9999px;top:0">Zum Inhalt springen</a>${nav}<main id="main-content"><h1>${escapeHtml(h1)}</h1><p>${escapeHtml(description)}</p></main></div>`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeAttr(description)}"`
    )
    .replace(/<div id="root"><\/div>/, skeleton);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function writeRoute(routePath: string, html: string): void {
  const dir = join(DIST, routePath.replace(/^\//, ""));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
  console.log(`  ✓ ${routePath}`);
}

// ── Read data files (plain text, no TS execution needed) ───────────────────

function extractStringField(src: string, field: string): string | null {
  // Matches: field: `...` or field: "..."
  const m = src.match(new RegExp(`\\b${field}:\\s*[\`"]([\\s\\S]*?)[\`"]`));
  return m ? m[1].replace(/\\n/g, " ").trim() : null;
}

interface PageData {
  id: string;
  title: string;
  excerpt: string;
}

function parseDataFile(filePath: string): PageData[] {
  const src = readFileSync(filePath, "utf-8");
  const results: PageData[] = [];
  // Split on object literals in the array
  const objectPattern = /\{\s*id:\s*[`"]([^`"]+)[`"][^}]*title:\s*[`"]([\s\S]*?)[`"][^}]*excerpt:\s*[`"]([\s\S]*?)[`"]/g;
  let m: RegExpExecArray | null;
  while ((m = objectPattern.exec(src)) !== null) {
    results.push({
      id: m[1],
      title: m[2].replace(/\\n/g, " ").trim(),
      excerpt: m[3].replace(/\\n/g, " ").trim(),
    });
  }
  return results;
}

// ── Static routes ──────────────────────────────────────────────────────────

interface StaticRoute {
  path: string;
  title: string;
  h1: string;
  description: string;
}

const STATIC_ROUTES: StaticRoute[] = [
  {
    path: "/experimente",
    title: "Experimente – Schimmilab | DevOps, KI & Self-Hosting",
    h1: "Experimente",
    description:
      "Dokumentierte Experimente rund um DevOps, KI, Self-Hosting und Raspberry Pi. Hypothesen, Umsetzungen und ehrliche Ergebnisse aus dem Lab.",
  },
  {
    path: "/infrastruktur",
    title: "Infrastruktur – Schimmilab | Homelab & Self-Hosted Stack",
    h1: "Infrastruktur",
    description:
      "Die technische Infrastruktur von Schimmilab: Hetzner VPS, Docker, Traefik, Self-Hosted-Dienste und Homelab-Aufbau im Detail dokumentiert.",
  },
  {
    path: "/gedankenraum",
    title: "Gedankenraum – Schimmilab | KI, Technik & Reflexion",
    h1: "Gedankenraum",
    description:
      "Artikel und Reflexionen wo Technik auf Bewusstsein trifft: KI als Werkzeug, Systemdenken, Self-Hosting-Philosophie und digitale Autonomie.",
  },
  {
    path: "/medien",
    title: "Medien – Schimmilab | Empfehlungen für Tech & KI",
    h1: "Medien",
    description:
      "Kuratierte Empfehlungen aus dem Schimmilab-Universum: Bücher, Podcasts und Videos zu Technik, KI, DevOps und Bewusstsein.",
  },
  {
    path: "/impressum",
    title: "Impressum – Schimmilab | Angaben gemäß § 5 TMG",
    h1: "Impressum",
    description:
      "Impressum von Schimmilab gemäß § 5 TMG. Angaben zum Verantwortlichen und Kontaktinformationen.",
  },
  {
    path: "/datenschutz",
    title: "Datenschutzerklärung – Schimmilab | DSGVO",
    h1: "Datenschutzerklärung",
    description:
      "Datenschutzerklärung von Schimmilab gemäß DSGVO. Informationen zur Verarbeitung personenbezogener Daten und zu Betroffenenrechten.",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────

const index = readIndex();
console.log("Generating per-route HTML with patched meta tags...");

// Homepage: patch the root index.html in place so crawlers and social
// scrapers see an <h1>, a <main> landmark and visible copy without running JS.
const homeHtml = patchHtml(
  index,
  "Schimmilab – Experimente zwischen Code, KI und Erkenntnis",
  "Schimmilab ist ein offenes Labor für DevOps, KI, Self-Hosting, Bastelprojekte und Bewusstseins-Experimente. Dokumentierte Neugier von Schimmi.",
  "Schimmilab – Experimente zwischen Code, KI und Erkenntnis"
);
writeFileSync(join(DIST, "index.html"), homeHtml, "utf-8");
console.log("  ✓ / (homepage)");

for (const route of STATIC_ROUTES) {
  const html = patchHtml(index, route.title, route.description, route.h1);
  writeRoute(route.path, html);
}

// Dynamic experiment routes
const experiments = parseDataFile(
  join(ROOT, "client/src/data/experiments.ts")
);
for (const exp of experiments) {
  const title = `${exp.title} – Schimmilab`;
  const description = exp.excerpt.slice(0, 160);
  const html = patchHtml(index, title, description, exp.title);
  writeRoute(`/experimente/${exp.id}`, html);
}

// Dynamic thought routes
const thoughts = parseDataFile(join(ROOT, "client/src/data/thoughts.ts"));
for (const thought of thoughts) {
  const title = `${thought.title} – Schimmilab`;
  const description = thought.excerpt.slice(0, 160);
  const html = patchHtml(index, title, description, thought.title);
  writeRoute(`/gedankenraum/${thought.id}`, html);
}

console.log(
  `Done. Generated ${STATIC_ROUTES.length + experiments.length + thoughts.length} route(s).`
);
