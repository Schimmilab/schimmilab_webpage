/*
 * SCHIMMILAB – Medien Page
 * Design: Deep Space Lab – media grid with video embeds and project showcases
 * Features: YouTube embeds, project cards, podcast section
 */

import { Youtube, Mic, Cpu, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Medien() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Page Header */}
      <section
        className="pt-32 pb-16 border-b border-border relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/thoughts-bg-LqCLYtcTf6MaX6zos3HLHG.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative z-10 container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // 04 — Medien
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Schimmilab
            <br />
            <span className="text-[#00d4ff]">in Bewegung.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Videos, Podcasts und KI-Projekte. Die technische Schwester von Arcanara —
            wo Philosophie auf Code trifft.
          </p>
        </div>
      </section>

      {/* Coming Soon Cards */}
      <section className="py-16">
        <div className="container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            // In Vorbereitung
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Videos */}
            <div className="border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded border border-[#00d4ff]/30 flex items-center justify-center bg-[#00d4ff]/5">
                <Youtube className="w-5 h-5 text-[#00d4ff]/50" />
              </div>
              <div>
                <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                  // Videos
                </p>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Dokumentierte Experimente als Video — DevOps, Self-Hosting, KI. Kommt bald.
                </p>
              </div>
            </div>

            {/* Podcasts */}
            <div className="border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded border border-[#f59e0b]/30 flex items-center justify-center bg-[#f59e0b]/5">
                <Mic className="w-5 h-5 text-[#f59e0b]/50" />
              </div>
              <div>
                <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                  // Podcasts
                </p>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Gespräche über Technik, KI und Systemdenken — gemeinsam mit Radio HFR1 und Arcanara.
                </p>
              </div>
            </div>

            {/* KI-Projekte */}
            <div className="border border-border bg-card p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded border border-[#00d4ff]/30 flex items-center justify-center bg-[#00d4ff]/5">
                <Cpu className="w-5 h-5 text-[#00d4ff]/50" />
              </div>
              <div>
                <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                  // KI-Projekte
                </p>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Praktische KI-Anwendungen aus dem Lab — Automatisierungen, Workflows, Experimente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arcanara Connection */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 items-center border border-border bg-card p-8">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // Partner-Projekt
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Radio HFR1 & Arcanara
              </h3>
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Schimmilab ist die technische Schwester von Arcanara. Gemeinsame Podcasts und Projekte
                verbinden Technik mit Philosophie. Radio HFR1 ist der Sender für den gesunden Mix.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="https://arcanara.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border border-[#f59e0b]/40 text-[#f59e0b] text-sm hover:bg-[#f59e0b]/10 transition-all duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <ExternalLink className="w-4 h-4" />
                arcanara.de
              </a>
              <a
                href="https://hfr1.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] text-sm hover:bg-[#00d4ff]/10 transition-all duration-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <ExternalLink className="w-4 h-4" />
                hfr1.de
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
