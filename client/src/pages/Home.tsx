/*
 * SCHIMMILAB – Home Page
 * Design: Deep Space Lab – Hero with typewriter, asymmetric sections, card grid
 * Sections: Hero, Letzte Experimente, Gedanken & Erkenntnisse, Infrastruktur, Medien
 */

import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, FlaskConical, Brain, Server, Video, ChevronRight, Terminal, Cpu, GitBranch, Layers } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { experiments as allExperiments } from "@/data/experiments";

// Typewriter hook
function useTypewriter(text: string, speed = 60, startDelay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const start = () => {
      timeout = setTimeout(() => {
        const interval = setInterval(() => {
          if (i < text.length) {
            setDisplayed(text.slice(0, ++i));
          } else {
            clearInterval(interval);
            setDone(true);
          }
        }, speed);
        return () => clearInterval(interval);
      }, startDelay);
    };

    start();
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// Intersection observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Latest experiments – use first 3 from shared data
const latestExperiments = allExperiments.slice(0, 3);

// Thoughts data
const thoughts = [
  {
    id: "thought-001",
    date: "2026-02-25",
    title: "KI als Werkzeug oder als Gegenüber?",
    excerpt: "Die Frage ist nicht ob KI denkt, sondern was wir tun, wenn wir so tun als ob.",
    category: "KI & Bewusstsein",
  },
  {
    id: "thought-002",
    date: "2026-02-10",
    title: "Kontrolle vs. Autonomie in verteilten Systemen",
    excerpt: "Was Kubernetes und Selbstorganisation gemeinsam haben – und warum beides scheitert, wenn man es falsch versteht.",
    category: "Systemdenken",
  },
];

// Infrastructure highlights
const infraHighlights = [
  { icon: Layers, label: "Docker Compose", desc: "Multi-Service Setups" },
  { icon: GitBranch, label: "GitHub Actions", desc: "CI/CD Pipelines" },
  { icon: Server, label: "Hetzner Cloud", desc: "Self-Hosted Infrastructure" },
  { icon: Cpu, label: "Jenkins", desc: "Build Automation" },
];

export default function Home() {
  const { displayed: heroText, done: heroDone } = useTypewriter(
    "Experimente zwischen Code, KI und Erkenntnis.",
    45,
    800
  );
  const experimentsSection = useInView();
  const thoughtsSection = useInView();
  const infraSection = useInView();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00d4ff] focus:text-background focus:font-semibold"
      >
        Zum Hauptinhalt springen
      </a>
      <Navigation />

      <title>Schimmilab – Experimente zwischen Code, KI und Erkenntnis</title>
      <meta name="description" content="Schimmilab ist ein offenes Labor für DevOps, KI, Self-Hosting, Bastelprojekte und Bewusstseins-Experimente. Dokumentierte Neugier von Schimmi." />

      {/* ─── MAIN CONTENT ─── */}
      <main id="main-content">

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/hero-bg-AqSVmeujdSvtnemd8XEap4.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/75" />
        {/* Hex pattern overlay */}
        <div className="absolute inset-0 hex-pattern opacity-30" />
        {/* Gradient fade to bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 container pt-24 pb-16">
          <div className="max-w-4xl">
            {/* Pre-title annotation */}
            <div
              className="flex items-center gap-3 mb-6 animate-slide-up"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-[#00d4ff] text-sm">$</span>
              <span className="text-muted-foreground text-sm">init schimmilab --mode=public</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse ml-2" />
            </div>

            {/* Main headline */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6 animate-slide-up-delay-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="block text-foreground">Schimmi</span>
              <span className="block text-[#00d4ff]">Lab</span>
            </h1>

            {/* Typewriter subtitle */}
            <p
              className="text-xl md:text-2xl text-muted-foreground mb-8 min-h-[2rem] animate-slide-up-delay-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {heroText}
              {!heroDone && (
                <span className="inline-block w-0.5 h-6 bg-[#00d4ff] ml-1 animate-pulse align-middle" />
              )}
            </p>

            {/* Description */}
            <p
              className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10 animate-slide-up-delay-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ein offenes Labor für DevOps, KI, Self-Hosting und Bastelprojekte.
              Kein Marketing. Kein Influencer. Nur dokumentierte Neugier.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-slide-up-delay-4">
              <Link
                href="/experimente"
                className="flex items-center gap-2 px-6 py-3 bg-[#00d4ff] text-background font-semibold text-sm hover:bg-[#00d4ff]/90 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <FlaskConical className="w-4 h-4" />
                Experimente erkunden
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/infrastruktur"
                className="flex items-center gap-2 px-6 py-3 border border-[#00d4ff]/40 text-[#00d4ff] text-sm font-semibold hover:bg-[#00d4ff]/10 transition-all duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Server className="w-4 h-4" />
                Infrastruktur
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-[#00d4ff]/60 to-transparent animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]/60" />
        </div>
      </section>

      {/* ─── IDENTITY STRIP ─── */}
      <section className="border-y border-border bg-card/30 py-6 overflow-hidden">
        <div className="container">
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            {[
              { label: "DevOps-Stratege", icon: "⚙️" },
              { label: "Self-Hosting Architekt", icon: "🏗️" },
              { label: "KI-Explorer", icon: "🧠" },
              { label: "Bastler", icon: "🔧" },
              { label: "Systemdenker", icon: "🔬" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LETZTE EXPERIMENTE ─── */}
      <section className="py-20 md:py-28">
        <div
          ref={experimentsSection.ref}
          className={`container transition-all duration-700 ${experimentsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // 01 — Letzte Experimente
              </p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Im Labor passiert
                <br />
                <span className="text-[#00d4ff]">gerade Folgendes</span>
              </h2>
            </div>
            <Link
              href="/experimente"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Alle Experimente
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Experiment cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestExperiments.map((exp, i) => (
              <Link
                key={exp.id}
                href={`/experimente/${exp.id}`}
                className="group relative border border-border bg-card hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,212,255,0.12)] hover:-translate-y-1 p-6 flex flex-col gap-4 cursor-pointer"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {exp.date}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      exp.statusColor === "emerald"
                        ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                        : "text-amber-400 border-amber-400/30 bg-amber-400/5"
                    }`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {exp.status}
                  </span>
                </div>

                {/* Category */}
                <p className="text-xs text-[#00d4ff] uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  {exp.category}
                </p>

                {/* Title */}
                <h3
                  className="text-lg font-semibold text-foreground group-hover:text-[#00d4ff] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {exp.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>
                  {exp.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Mehr lesen link */}
                <div className="flex items-center gap-1 text-xs text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-mono)" }}>
                  <span>Mehr lesen</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/experimente"
              className="flex items-center gap-2 text-sm text-[#00d4ff]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Alle Experimente
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── GEDANKEN & INFRASTRUKTUR (2-column) ─── */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Gedanken */}
            <div
              ref={thoughtsSection.ref}
              className={`transition-all duration-700 ${thoughtsSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // 02 — Gedanken & Erkenntnisse
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Wenn Technik auf
                <br />
                <span className="text-[#f59e0b]">Bewusstsein trifft</span>
              </h2>

              <div className="space-y-4">
                {thoughts.map((thought) => (
                  <article
                    key={thought.id}
                    className="group border border-border bg-card hover:border-[#f59e0b]/40 transition-all duration-300 p-5 flex gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-[#f59e0b]" style={{ fontFamily: "var(--font-mono)" }}>
                          {thought.category}
                        </span>
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                          {thought.date}
                        </span>
                      </div>
                      <h3
                        className="font-semibold text-foreground group-hover:text-[#f59e0b] transition-colors mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {thought.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {thought.excerpt}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#f59e0b] transition-colors flex-shrink-0 mt-1" />
                  </article>
                ))}
              </div>

              <Link
                href="/gedankenraum"
                className="mt-6 flex items-center gap-2 text-sm text-[#f59e0b] hover:text-[#f59e0b]/80 transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Alle Gedanken
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Infrastruktur */}
            <div
              ref={infraSection.ref}
              className={`transition-all duration-700 delay-200 ${infraSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // 03 — Infrastruktur
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Viele reden.
                <br />
                <span className="text-[#00d4ff]">Ich dokumentiere.</span>
              </h2>

              {/* Infra image */}
              <div
                className="relative h-48 mb-6 overflow-hidden border border-border"
                style={{
                  backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-background/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Terminal className="w-8 h-8 text-[#00d4ff] mx-auto mb-2" />
                    <p className="text-sm text-[#00d4ff]" style={{ fontFamily: "var(--font-mono)" }}>
                      $ docker ps --all
                    </p>
                  </div>
                </div>
              </div>

              {/* Infra highlights grid */}
              <div className="grid grid-cols-2 gap-3">
                {infraHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="border border-border bg-card p-4 flex items-start gap-3 hover:border-[#00d4ff]/40 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/infrastruktur"
                className="mt-6 flex items-center gap-2 text-sm text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Architektur erkunden
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEDIEN TEASER ─── */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Image */}
            <div
              className="w-full md:w-1/2 h-64 md:h-80 relative overflow-hidden border border-border flex-shrink-0"
              style={{
                backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/thoughts-bg-LqCLYtcTf6MaX6zos3HLHG.webp)`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            >
              <div className="absolute inset-0 bg-background/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#00d4ff] flex items-center justify-center bg-background/60 hover:bg-[#00d4ff]/20 transition-colors cursor-pointer">
                  <Video className="w-6 h-6 text-[#00d4ff] ml-1" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // 04 — Medien
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Schimmilab als
                <br />
                <span className="text-[#00d4ff]">technische Schwester</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                YouTube-Einbettungen, B-Roll Experimente, Podcast-Zerlegungen und KI-generierte Projekte.
                Wo Arcanara philosophisch wird, wird Schimmilab technisch.
              </p>
              <Link
                href="/medien"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] text-sm hover:bg-[#00d4ff]/10 transition-all duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Video className="w-4 h-4" />
                Medien ansehen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT STRIP ─── */}
      <section className="py-16 border-t border-border bg-card/20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              // Was ist Schimmilab?
            </p>
            <blockquote
              className="text-xl md:text-2xl font-medium text-foreground leading-relaxed border-l-2 border-[#00d4ff] pl-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              "Schimmilab ist mein öffentliches Experimentierfeld. Technik + KI + Basteln + Erkenntnisarbeit.
              Nicht Marketing. Nicht Influencer. Sondern{" "}
              <span className="text-[#00d4ff]">dokumentierte Neugier</span>."
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              — Schimmi, Senior Embedded DevOps Specialist
            </p>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
