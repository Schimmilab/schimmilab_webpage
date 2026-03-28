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

function patchHtml(html: string, title: string, description: string): string {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeAttr(description)}"`
    );
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

const STATIC_ROUTES = [
  {
    path: "/experimente",
    title: "Experimente – Schimmilab",
    description:
      "Dokumentierte Experimente mit DevOps, KI, Self-Hosting, Raspberry Pi und mehr. Hypothesen, Umsetzungen, Ergebnisse.",
  },
  {
    path: "/infrastruktur",
    title: "Infrastruktur – Schimmilab",
    description:
      "Die technische Infrastruktur von Schimmilab: Homelab, Server, Dienste und Self-Hosted-Stack im Detail.",
  },
  {
    path: "/gedankenraum",
    title: "Gedankenraum – Schimmilab",
    description:
      "Artikel und Reflexionen wo Technik auf Bewusstsein trifft: KI, Systemdenken, Self-Hosting-Philosophie und mehr.",
  },
  {
    path: "/medien",
    title: "Medien – Schimmilab",
    description:
      "Empfohlene Bücher, Podcasts und Videos aus dem Schimmilab-Universum: Technik, KI und Bewusstsein.",
  },
  {
    path: "/impressum",
    title: "Impressum – Schimmilab",
    description: "Impressum von Schimmilab gemäß § 5 TMG.",
  },
  {
    path: "/datenschutz",
    title: "Datenschutzerklärung – Schimmilab",
    description: "Datenschutzerklärung von Schimmilab gemäß DSGVO.",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────

const index = readIndex();
console.log("Generating per-route HTML with patched meta tags...");

for (const route of STATIC_ROUTES) {
  const html = patchHtml(index, route.title, route.description);
  writeRoute(route.path, html);
}

// Dynamic experiment routes
const experiments = parseDataFile(
  join(ROOT, "client/src/data/experiments.ts")
);
for (const exp of experiments) {
  const title = `${exp.title} – Schimmilab`;
  const description = exp.excerpt.slice(0, 160);
  const html = patchHtml(index, title, description);
  writeRoute(`/experimente/${exp.id}`, html);
}

// Dynamic thought routes
const thoughts = parseDataFile(join(ROOT, "client/src/data/thoughts.ts"));
for (const thought of thoughts) {
  const title = `${thought.title} – Schimmilab`;
  const description = thought.excerpt.slice(0, 160);
  const html = patchHtml(index, title, description);
  writeRoute(`/gedankenraum/${thought.id}`, html);
}

console.log(
  `Done. Generated ${STATIC_ROUTES.length + experiments.length + thoughts.length} route(s).`
);
