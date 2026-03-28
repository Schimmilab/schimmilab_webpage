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
      <title>Medien – Schimmilab</title>
      <meta name="description" content="Videos, Podcasts und Medienprojekte von Schimmilab: YouTube-Einbettungen, B-Roll Experimente und KI-generierte Inhalte." />
      <Navigation />
      <main id="main-content">

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

      {/* Partner-Projekte */}
      <section className="py-16 border-t border-border">
        <div className="container">
          <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            // Partner-Projekte
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Arcanara */}
            <div className="border border-[#f59e0b]/30 bg-card p-6 flex flex-col gap-4 hover:border-[#f59e0b]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
              <p className="text-xs text-[#f59e0b] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                // Philosophie & Reflexion
              </p>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Arcanara
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Die philosophische Schwester von Schimmilab. Wo Schimmilab mit Code antwortet, stellt Arcanara die großen Fragen — über Bewusstsein, Systeme und das Unbekannte.
                </p>
              </div>
              <a
                href="https://arcanara.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#f59e0b] hover:text-[#f59e0b]/80 transition-colors mt-auto"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <ExternalLink className="w-3 h-3" />
                arcanara.de
              </a>
            </div>

            {/* HFR1 */}
            <div className="border border-[#00d4ff]/30 bg-card p-6 flex flex-col gap-4 hover:border-[#00d4ff]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)]">
              <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                // Radio & Audio
              </p>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Radio HFR1
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Der Sender für den gesunden Mix. Gemeinsame Podcasts und Audio-Formate, die Technik und Kultur verbinden.
                </p>
              </div>
              <a
                href="https://hfr1.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors mt-auto"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <ExternalLink className="w-3 h-3" />
                hfr1.de
              </a>
            </div>

            {/* Inditritium */}
            <div className="border border-border bg-card p-6 flex flex-col gap-4 hover:border-[#f59e0b]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)]">
              <p className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                // Der Raum dazwischen
              </p>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Inditritium
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Der Raum zwischen dem Bekannten und dem Unbekannten. Wo Schimmilab und Arcanara sich treffen und neue Ideen entstehen.
                </p>
              </div>
              <a
                href="https://inditritium.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-[#f59e0b] transition-colors mt-auto"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <ExternalLink className="w-3 h-3" />
                inditritium.de
              </a>
            </div>

          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
