/*
 * SCHIMMILAB – Experiment Detail Page
 * Design: Deep Space Lab – structured article with section timeline
 * Uses flat field structure from experiments.ts (problem, hypothese, umsetzung, ergebnis, learnings)
 */

import { useParams, Link, useLocation } from "wouter";
import { useEffect, useMemo } from "react";
import { ArrowLeft, Clock, Tag, FlaskConical, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import { getExperimentById, experiments } from "@/data/experiments";

// Section configuration: maps flat field keys to display properties
const SECTIONS = [
  { key: "problem",   heading: "Problem",   color: "#ff4d4d", prefix: "01" },
  { key: "hypothese", heading: "Hypothese", color: "#00d4ff", prefix: "02" },
  { key: "umsetzung", heading: "Umsetzung", color: "#a78bfa", prefix: "03" },
  { key: "ergebnis",  heading: "Ergebnis",  color: "#34d399", prefix: "04" },
  { key: "learnings", heading: "Learnings", color: "#f59e0b", prefix: "05" },
] as const;

export default function ExperimentDetail() {
  const { id } = useParams<{ id: string }>();
  const [location] = useLocation();
  const experiment = useMemo(() => getExperimentById(id), [id]);

  // Scroll to top whenever the experiment id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, location]);

  if (!experiment) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main id="main-content">
        <div className="container pt-40 pb-20 text-center">
          <p className="text-muted-foreground font-mono text-sm mb-4">// 404 — Experiment nicht gefunden</p>
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Dieses Experiment existiert nicht.
          </h1>
          <Link href="/experimente" className="inline-flex items-center gap-2 text-[#00d4ff] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Zurück zu den Experimenten
          </Link>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Build active sections (only those with non-empty content)
  const activeSections = SECTIONS.filter((s) => {
    const val = experiment[s.key as keyof typeof experiment] as string;
    return val && val.trim().length > 0;
  });

  // Estimated read time based on word count
  const wordCount = SECTIONS.reduce((acc, s) => {
    const val = experiment[s.key as keyof typeof experiment] as string;
    return acc + (val ? val.split(/\s+/).length : 0);
  }, 0);
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  // Other experiments for "Weitere Experimente" section
  const others = experiments.filter((e) => e.id !== experiment.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>{experiment.title} – Schimmilab</title>
      <meta name="description" content={experiment.excerpt} />
      <Navigation />
      <main id="main-content">

      {/* ─── HEADER ─── */}
      <section className="pt-32 pb-12 border-b border-border">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            <Link href="/" className="hover:text-[#00d4ff] transition-colors">Start</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/experimente" className="hover:text-[#00d4ff] transition-colors">Experimente</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{experiment.id}</span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span
              className="text-xs text-[#00d4ff] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {experiment.category}
            </span>
            <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              {experiment.date}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              <Clock className="w-3 h-3" />
              {readTime} Lesezeit
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                experiment.statusColor === "emerald"
                  ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                  : experiment.statusColor === "amber"
                  ? "text-amber-400 border-amber-400/30 bg-amber-400/5"
                  : "text-blue-400 border-blue-400/30 bg-blue-400/5"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {experiment.status}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {experiment.title}
          </h1>

          {/* Excerpt */}
          <p
            className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {experiment.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {experiment.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-3 py-1 bg-secondary text-muted-foreground border border-border"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Image Gallery */}
          {experiment.images && experiment.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {experiment.images.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden border border-border hover:border-[#00d4ff]/50 transition-colors">
                  <img
                    src={src}
                    alt={`${experiment.title} – Bild ${i + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 max-w-5xl">

            {/* Main content */}
            <div className="space-y-12">
              {activeSections.map((sec) => {
                const content = experiment[sec.key as keyof typeof experiment] as string;
                return (
                  <article key={sec.key} id={sec.key} className="group">
                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs font-bold"
                        style={{ color: sec.color, fontFamily: "var(--font-mono)" }}
                      >
                        {sec.prefix}
                      </span>
                      <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: sec.color, opacity: 0.4 }} />
                      <h2
                        className="text-xl md:text-2xl font-bold"
                        style={{ fontFamily: "var(--font-display)", color: sec.color }}
                      >
                        {sec.heading}
                      </h2>
                    </div>

                    {/* Content block */}
                    <div
                      className="border-l-2 pl-6 py-2"
                      style={{ borderColor: `${sec.color}30` }}
                    >
                      <MarkdownContent content={content} accentColor={sec.color} />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Navigation */}
              <div className="border border-border bg-card p-5 sticky top-24">
                <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                  // Inhalt
                </p>
                <nav className="space-y-2">
                  {activeSections.map((sec) => (
                    <a
                      key={sec.key}
                      href={`#${sec.key}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: sec.color }} />
                      {sec.heading}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <Link
                    href="/experimente"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Alle Experimente
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── WEITERE EXPERIMENTE ─── */}
      {others.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="container">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              // Weitere Experimente
            </p>
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
              Was sonst noch im Labor passiert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {others.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/experimente/${exp.id}`}
                  className="group border border-border bg-card hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] p-5 flex flex-col gap-3"
                >
                  <p className="text-xs text-[#00d4ff]" style={{ fontFamily: "var(--font-mono)" }}>
                    {exp.category}
                  </p>
                  <h3
                    className="font-semibold text-foreground group-hover:text-[#00d4ff] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {exp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    {exp.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-[#00d4ff] mt-auto" style={{ fontFamily: "var(--font-mono)" }}>
                    <FlaskConical className="w-3 h-3" />
                    Lesen
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      </main>
      <Footer />
    </div>
  );
}
