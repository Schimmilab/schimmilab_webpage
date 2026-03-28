/*
 * SCHIMMILAB – Infrastruktur Page
 * Design: Deep Space Lab – architecture docs with diagrams and tech stack
 * Features: Architecture overview, Docker Compose snippets, cost comparison
 */

import { useState } from "react";
import { Server, Container, Shield, DollarSign, GitBranch, Network, HardDrive, Cpu, ChevronRight, CheckCircle2, Clock, AlertCircle, Tag, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import { infraItems } from "@/data/infrastructure";

const STATUS_ICONS: Record<string, React.ElementType> = {
  active:      CheckCircle2,
  in_progress: Clock,
  planned:     AlertCircle,
  inactive:    AlertCircle,
  archived:    AlertCircle,
};

const techStack = [
  {
    category: "Hosting",
    icon: Server,
    color: "#00d4ff",
    items: [
      { name: "Hetzner Cloud", desc: "CX21 – 2 vCPU, 4GB RAM, 40GB SSD", cost: "~5€/Monat" },
      { name: "Hetzner Storage Box", desc: "100GB Backup-Storage", cost: "~3€/Monat" },
    ],
  },
  {
    category: "Container & Orchestrierung",
    icon: Container,
    color: "#00d4ff",
    items: [
      { name: "Docker Engine", desc: "Container Runtime, v26.x", cost: "Free" },
      { name: "Docker Compose", desc: "Multi-Service Orchestrierung", cost: "Free" },
      { name: "Portainer CE", desc: "Container Management UI", cost: "Free" },
    ],
  },
  {
    category: "Networking",
    icon: Network,
    color: "#f59e0b",
    items: [
      { name: "Traefik v3", desc: "Reverse Proxy, Auto-TLS via ACME", cost: "Free" },
      { name: "Cloudflare", desc: "DNS, DDoS-Schutz, CDN", cost: "Free Tier" },
      { name: "WireGuard", desc: "VPN für Admin-Zugriff", cost: "Free" },
    ],
  },
  {
    category: "Sicherheit",
    icon: Shield,
    color: "#f59e0b",
    items: [
      { name: "Fail2Ban", desc: "Brute-Force-Schutz", cost: "Free" },
      { name: "UFW", desc: "Firewall, nur Port 80/443/51820 offen", cost: "Free" },
      { name: "Authelia", desc: "2FA für alle Services", cost: "Free" },
    ],
  },
  {
    category: "CI/CD",
    icon: GitBranch,
    color: "#00d4ff",
    items: [
      { name: "GitHub Actions", desc: "Build, Test, Deploy Pipelines", cost: "Free Tier" },
      { name: "Self-hosted Runner", desc: "Für interne Deployments", cost: "Free" },
      { name: "Watchtower", desc: "Automatische Container-Updates", cost: "Free" },
    ],
  },
  {
    category: "Storage & Backup",
    icon: HardDrive,
    color: "#f59e0b",
    items: [
      { name: "Restic", desc: "Inkrementelle Backups zu Hetzner", cost: "Free" },
      { name: "MinIO", desc: "S3-kompatibler lokaler Storage", cost: "Free" },
    ],
  },
];

const architectureLayers = [
  {
    layer: "L1 – Internet",
    color: "#00d4ff",
    components: ["Cloudflare DNS", "DDoS Protection", "CDN"],
  },
  {
    layer: "L2 – Edge",
    color: "#00d4ff",
    components: ["Traefik Reverse Proxy", "Auto-TLS (ACME)", "Rate Limiting", "Auth Middleware"],
  },
  {
    layer: "L3 – Services",
    color: "#f59e0b",
    components: ["Schimmilab Web", "Portainer", "Authelia", "Ollama", "n8n", "Home Assistant"],
  },
  {
    layer: "L4 – Data",
    color: "#f59e0b",
    components: ["PostgreSQL", "Redis", "MinIO", "Prometheus", "Grafana"],
  },
  {
    layer: "L5 – Infrastructure",
    color: "#00d4ff",
    components: ["Hetzner CX21", "Ubuntu 24.04 LTS", "Docker Engine", "WireGuard VPN"],
  },
];

const dockerComposeSnippet = `version: "3.8"

services:
  traefik:
    image: traefik:v3
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.le.acme.email=\${ACME_EMAIL}"
      - "--certificatesresolvers.le.acme.storage=/certs/acme.json"
      - "--certificatesresolvers.le.acme.tlschallenge=true"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./certs:/certs
    labels:
      - "traefik.enable=true"
    restart: unless-stopped`;

export default function Infrastruktur() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Infrastruktur – Schimmilab</title>
      <meta name="description" content="Die Infrastruktur hinter Schimmilab: Hetzner VPS, Docker Compose, Traefik, GitHub Actions CI/CD und self-hosted Services." />
      <Navigation />
      <main id="main-content">

      {/* Page Header */}
      <section
        className="pt-32 pb-16 border-b border-border relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative z-10 container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // 02 — Infrastruktur
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Viele reden.
            <br />
            <span className="text-[#00d4ff]">Ich dokumentiere.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Architekturdiagramme, Docker Compose Files, Security-Überlegungen und Kostenvergleiche.
            Transparenz als Prinzip.
          </p>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // Architektur-Übersicht
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Stack-Architektur
          </h2>

          <div className="space-y-2">
            {architectureLayers.map((layer, i) => (
              <div
                key={layer.layer}
                className="border border-border bg-card p-4 flex items-start gap-4 hover:border-[#00d4ff]/30 transition-colors"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0 w-32">
                  <span
                    className="text-xs font-semibold"
                    style={{ fontFamily: "var(--font-mono)", color: layer.color }}
                  >
                    {layer.layer}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((comp) => (
                    <span
                      key={comp}
                      className="text-xs px-2 py-1 bg-secondary text-muted-foreground border border-border"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dokumentierte Dienste – dynamic from infrastructure.ts */}
      {infraItems.length > 0 && (
        <section className="py-16 border-b border-border">
          <div className="container">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              // Dokumentierte Dienste
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Was läuft – und wie
            </h2>
            <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: "var(--font-body)" }}>
              // {infraItems.length} Dienste aus Anytype synchronisiert
            </p>

            <div className="space-y-3">
              {infraItems.map((item, i) => {
                const isExpanded = expandedId === item.id;
                const StatusIcon = STATUS_ICONS[item.status] ?? CheckCircle2;
                const sections = [
                  { label: "Überblick",   content: item.overview,     color: "#00d4ff" },
                  { label: "Stack",       content: item.stack,        color: "#a78bfa" },
                  { label: "Architektur", content: item.architecture, color: "#f59e0b" },
                  { label: "Setup",       content: item.setup,        color: "#34d399" },
                  { label: "Kosten",      content: item.costs,        color: "#f59e0b" },
                  { label: "Sicherheit",  content: item.security,     color: "#ff4d4d" },
                  { label: "Code",        content: item.code,         color: "#a78bfa" },
                  { label: "Learnings",   content: item.learnings,    color: "#00d4ff" },
                ].filter((s) => s.content?.trim());

                return (
                  <article
                    key={item.id}
                    className={`border transition-all duration-300 overflow-hidden bg-card ${
                      isExpanded
                        ? "border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.08)]"
                        : "border-border hover:border-[#00d4ff]/30"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="w-full text-left p-5 flex items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-xs text-[#00d4ff]" style={{ fontFamily: "var(--font-mono)" }}>
                            {item.category}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span
                            className={`text-xs flex items-center gap-1 ${item.statusColor}`}
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {item.statusLabel}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                          {item.title}
                        </h3>
                        {!isExpanded && item.excerpt && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-300 ${
                          isExpanded ? "rotate-90 text-[#00d4ff]" : ""
                        }`}
                      />
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-border">
                        <div className="space-y-6 mt-5">
                          {sections.map((sec) => (
                            <div key={sec.label}>
                              <p
                                className="text-xs uppercase tracking-wider mb-2"
                                style={{ fontFamily: "var(--font-mono)", color: sec.color }}
                              >
                                // {sec.label}
                              </p>
                              <MarkdownContent
                                content={sec.content!}
                                accentColor={sec.color}
                              />
                            </div>
                          ))}
                        </div>

                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
                            <Tag className="w-3 h-3 text-muted-foreground mt-0.5" />
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground"
                                style={{ fontFamily: "var(--font-mono)" }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack Details */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // Tech Stack
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Was läuft wo und warum
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((section) => (
              <div key={section.category} className="border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-4 h-4" style={{ color: section.color }} />
                  <h3
                    className="text-sm font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.category}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                          {item.desc}
                        </p>
                      </div>
                      <span
                        className={`text-xs flex-shrink-0 px-1.5 py-0.5 ${
                          item.cost === "Free" || item.cost === "Free Tier"
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-[#f59e0b] bg-[#f59e0b]/10"
                        }`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item.cost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Docker Compose Snippet */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                // Code-Beispiel
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Traefik Docker Compose
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Das ist das Herzstück der Infrastruktur. Traefik als Reverse Proxy mit automatischer
                TLS-Zertifikatsverwaltung via Let's Encrypt. Jeder neue Service braucht nur Labels –
                keine Nginx-Config mehr.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span>Automatische TLS-Zertifikate für alle Services</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span>Docker-Socket Read-Only gemountet (Security)</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span>Neuer Service = nur Labels hinzufügen</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="border border-[#00d4ff]/30 bg-card overflow-hidden">
                {/* Code header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2" style={{ fontFamily: "var(--font-mono)" }}>
                    docker-compose.yml
                  </span>
                </div>
                <pre
                  className="p-4 text-xs text-muted-foreground overflow-x-auto leading-relaxed"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <code>{dockerComposeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Overview */}
      <section className="py-16">
        <div className="container">
          <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // Kostenübersicht
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10" style={{ fontFamily: "var(--font-display)" }}>
            Was kostet das alles?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Monatliche Serverkosten", value: "~8€", desc: "Hetzner CX21 + Storage Box", icon: DollarSign, color: "#f59e0b" },
              { label: "Software-Kosten", value: "0€", desc: "Alles Open Source", icon: Cpu, color: "#00d4ff" },
              { label: "Jährliche Gesamtkosten", value: "~96€", desc: "Vollständige Self-Hosted Infrastruktur", icon: Server, color: "#f59e0b" },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-card p-6">
                <item.icon className="w-5 h-5 mb-3" style={{ color: item.color }} />
                <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: item.color }}>
                  {item.value}
                </p>
                <p className="text-sm font-medium text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
