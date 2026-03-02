/*
 * SCHIMMILAB – Medien Page
 * Design: Deep Space Lab – media grid with video embeds and project showcases
 * Features: YouTube embeds, project cards, podcast section
 */

import { useState } from "react";
import { Play, Youtube, Mic, Cpu, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const mediaCategories = ["Alle", "Videos", "Podcasts", "KI-Projekte"];

const videos = [
  {
    id: "vid-001",
    type: "Videos",
    title: "Traefik Setup von Null auf Produktiv",
    description: "In 45 Minuten von einer frischen Hetzner-VM zu einem vollständig konfigurierten Reverse Proxy mit Auto-TLS.",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp",
    duration: "45:12",
    date: "2026-02-20",
    youtubeId: null,
  },
  {
    id: "vid-002",
    type: "Videos",
    title: "MCP + n8n: KI-Workflows automatisieren",
    description: "Wie ich mit Model Context Protocol und n8n einen vollautomatischen Dokumentations-Workflow gebaut habe.",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/experiments-bg-AWqnQoBzzykG4TYMzsRmPC.webp",
    duration: "32:07",
    date: "2026-02-05",
    youtubeId: null,
  },
  {
    id: "vid-003",
    type: "Videos",
    title: "Raspberry Pi Cluster: Aufbau und Konfiguration",
    description: "Vier Raspberry Pi 4 zu einem kleinen Kubernetes-Cluster verbinden – Schritt für Schritt dokumentiert.",
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/hero-bg-AqSVmeujdSvtnemd8XEap4.webp",
    duration: "58:43",
    date: "2026-01-15",
    youtubeId: null,
  },
];

const podcasts = [
  {
    id: "pod-001",
    type: "Podcasts",
    title: "DevOps-Philosophie: Warum Prozesse wichtiger sind als Tools",
    description: "Eine ehrliche Analyse: Warum die meisten DevOps-Transformationen scheitern – und was wirklich hilft.",
    duration: "1:12:00",
    date: "2026-02-18",
    platform: "Radio HFR1 / Arcanara",
  },
  {
    id: "pod-002",
    type: "Podcasts",
    title: "KI in der Embedded-Entwicklung: Hype vs. Realität",
    description: "Was KI-Tools wirklich für Embedded DevOps leisten können – und wo sie versagen.",
    duration: "48:30",
    date: "2026-01-22",
    platform: "Radio HFR1 / Arcanara",
  },
];

const aiProjects = [
  {
    id: "ai-001",
    type: "KI-Projekte",
    title: "Automatische Dokumentationsgenerierung",
    description: "Ein n8n-Workflow, der Git-Commits analysiert und automatisch Changelog-Einträge generiert – mit lokalem LLM.",
    tech: ["Ollama", "n8n", "Git", "Markdown"],
    status: "Produktiv",
    statusColor: "emerald",
  },
  {
    id: "ai-002",
    type: "KI-Projekte",
    title: "Code-Review-Assistent",
    description: "GitHub Actions Workflow, der Pull Requests automatisch auf häufige Fehler und Best-Practice-Verletzungen prüft.",
    tech: ["GitHub Actions", "Claude API", "Python"],
    status: "Beta",
    statusColor: "amber",
  },
  {
    id: "ai-003",
    type: "KI-Projekte",
    title: "Infrastruktur-Anomalie-Detektion",
    description: "Prometheus-Metriken werden von einem lokalen LLM analysiert, das bei ungewöhnlichen Mustern Alerts generiert.",
    tech: ["Prometheus", "Ollama", "Python", "Grafana"],
    status: "Experimentell",
    statusColor: "blue",
  },
];

const allMedia = [...videos, ...podcasts, ...aiProjects];

export default function Medien() {
  const [activeCategory, setActiveCategory] = useState("Alle");

  const filtered = activeCategory === "Alle"
    ? allMedia
    : allMedia.filter((m) => m.type === activeCategory);

  const handleVideoPlay = () => {
    toast.info("Videos werden bald verfügbar sein. Abonniere den YouTube-Kanal für Updates.");
  };

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
            Videos, Podcasts und KI-generierte Projekte. Die technische Schwester von Arcanara –
            wo Philosophie auf Code trifft.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {mediaCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 text-xs transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#00d4ff] text-background font-semibold"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-[#00d4ff]/40"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => {
              // Video card
              if (item.type === "Videos") {
                const video = item as typeof videos[0];
                return (
                  <article
                    key={item.id}
                    className="group border border-border bg-card hover:border-[#00d4ff]/40 transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative h-44 overflow-hidden"
                      style={{
                        backgroundImage: `url(${video.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-all duration-300" />
                      <button
                        onClick={handleVideoPlay}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center bg-background/60 group-hover:bg-[#00d4ff]/20 group-hover:border-[#00d4ff] transition-all duration-300">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </button>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-background/80 text-xs text-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-background/80">
                        <Youtube className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>Video</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                        {video.date}
                      </p>
                      <h3
                        className="font-semibold text-foreground group-hover:text-[#00d4ff] transition-colors mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {video.description}
                      </p>
                    </div>
                  </article>
                );
              }

              // Podcast card
              if (item.type === "Podcasts") {
                const podcast = item as typeof podcasts[0];
                return (
                  <article
                    key={item.id}
                    className="group border border-border bg-card hover:border-[#f59e0b]/40 transition-all duration-300 p-5 flex flex-col gap-4"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-[#f59e0b]/40 flex items-center justify-center bg-[#f59e0b]/10 flex-shrink-0">
                        <Mic className="w-4 h-4 text-[#f59e0b]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#f59e0b]" style={{ fontFamily: "var(--font-mono)" }}>
                          Podcast
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                          {podcast.platform}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                        <span>{podcast.date}</span>
                        <span>{podcast.duration}</span>
                      </div>
                      <h3
                        className="font-semibold text-foreground group-hover:text-[#f59e0b] transition-colors mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {podcast.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {podcast.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toast.info("Podcast-Links folgen bald.")}
                      className="flex items-center gap-2 text-xs text-[#f59e0b] hover:text-[#f59e0b]/80 transition-colors mt-auto"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Anhören (coming soon)
                    </button>
                  </article>
                );
              }

              // AI Project card
              if (item.type === "KI-Projekte") {
                const project = item as typeof aiProjects[0];
                return (
                  <article
                    key={item.id}
                    className="group border border-border bg-card hover:border-[#00d4ff]/40 transition-all duration-300 p-5 flex flex-col gap-4"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#00d4ff]" />
                        <span className="text-xs text-[#00d4ff]" style={{ fontFamily: "var(--font-mono)" }}>
                          KI-Projekt
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          project.statusColor === "emerald"
                            ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                            : project.statusColor === "amber"
                            ? "text-amber-400 border-amber-400/30 bg-amber-400/5"
                            : "text-blue-400 border-blue-400/30 bg-blue-400/5"
                        }`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-foreground group-hover:text-[#00d4ff] transition-colors mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              }

              return null;
            })}
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
            <a
              href="https://www.arcanara.de"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-[#f59e0b]/40 text-[#f59e0b] text-sm hover:bg-[#f59e0b]/10 transition-all duration-200 flex-shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <ExternalLink className="w-4 h-4" />
              Arcanara besuchen
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
