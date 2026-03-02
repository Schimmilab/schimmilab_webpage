/*
 * SCHIMMILAB – Experimente Page
 * Design: Deep Space Lab – experiment log with status, hypothesis, learnings
 * Features: Category filter, status badges, structured experiment cards
 */

import { useState } from "react";
import { FlaskConical, ChevronRight, Tag, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const categories = ["Alle", "KI / MCP", "Self-Hosting", "Hardware", "DevOps", "Elektronik"];

const experiments = [
  {
    id: "exp-001",
    date: "2026-02-28",
    category: "KI / MCP",
    title: "Model Context Protocol in der Praxis",
    problem: "KI-Modelle sind isoliert – sie können nicht direkt auf externe Tools und Daten zugreifen, ohne aufwändige Integrationen.",
    hypothesis: "MCP als standardisierter Protokoll-Layer könnte die Tool-Integration erheblich vereinfachen und KI-Workflows in DevOps-Pipelines ermöglichen.",
    result: "MCP funktioniert hervorragend für strukturierte Tool-Calls. Die Integration mit n8n und bestehenden Workflows war überraschend reibungslos.",
    learnings: "Der echte Mehrwert liegt nicht im einzelnen Tool-Call, sondern in der Kompositionsfähigkeit. MCP + n8n = mächtiger Automatisierungsstack.",
    tags: ["MCP", "n8n", "KI", "Automatisierung"],
    status: "Abgeschlossen",
    statusIcon: CheckCircle2,
    statusColor: "emerald",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp",
  },
  {
    id: "exp-002",
    date: "2026-02-15",
    category: "Self-Hosting",
    title: "Traefik als Reverse Proxy auf Hetzner",
    problem: "Nginx-Konfigurationen werden bei wachsender Service-Anzahl schnell unübersichtlich. Let's Encrypt-Zertifikate manuell zu verwalten kostet Zeit.",
    hypothesis: "Traefik mit Docker-Labels könnte die gesamte Proxy-Konfiguration auf Service-Ebene verlagern und Zertifikate automatisch verwalten.",
    result: "Traefik v3 mit Docker Provider funktioniert exzellent. Automatische TLS-Zertifikate via ACME in unter 5 Minuten konfiguriert.",
    learnings: "Die Middleware-Konzepte in Traefik sind mächtig aber erfordern Einarbeitung. Rate-Limiting und Auth-Middleware sind Gold wert.",
    tags: ["Traefik", "Docker", "Hetzner", "TLS", "Reverse Proxy"],
    status: "Abgeschlossen",
    statusIcon: CheckCircle2,
    statusColor: "emerald",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/experiments-bg-AWqnQoBzzykG4TYMzsRmPC.webp",
  },
  {
    id: "exp-003",
    date: "2026-02-01",
    category: "Hardware",
    title: "3D-Druck: Gehäuse für Raspberry Pi Cluster",
    problem: "Vier Raspberry Pi 4 auf dem Schreibtisch – kein Platz, keine Ordnung, Kabelchaos. Ein Rack-Gehäuse wäre ideal, aber teuer.",
    hypothesis: "Ein selbst gedrucktes Stapelgehäuse aus PETG könnte Platz sparen, Kühlung verbessern und dabei weniger als 5€ Filament kosten.",
    result: "Druck läuft noch. Erste Ebene sieht vielversprechend aus. Kühlungskonzept mit 40mm-Lüftern muss noch validiert werden.",
    learnings: "Noch in Arbeit. Erste Erkenntnis: PETG bei 240°C drucken, nicht 230°C. Bridging-Performance ist besser als erwartet.",
    tags: ["3D-Druck", "Raspberry Pi", "Hardware", "PETG"],
    status: "In Arbeit",
    statusIcon: Clock,
    statusColor: "amber",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/experiments-bg-AWqnQoBzzykG4TYMzsRmPC.webp",
  },
  {
    id: "exp-004",
    date: "2026-01-20",
    category: "DevOps",
    title: "Jenkins zu GitHub Actions Migration",
    problem: "Jenkins-Installation ist über Jahre gewachsen, kaum dokumentiert, und die Wartung kostet mehr Zeit als die eigentliche CI/CD.",
    hypothesis: "GitHub Actions mit reusable Workflows könnte 80% der Jenkins-Pipelines ersetzen und dabei wartbarer und transparenter sein.",
    result: "Migration von 12 Pipelines abgeschlossen. Build-Zeiten um 30% reduziert durch bessere Parallelisierung. Secrets-Management deutlich einfacher.",
    learnings: "Composite Actions sind das Äquivalent zu Jenkins Shared Libraries – aber viel einfacher zu versionieren. Self-hosted Runner für interne Builds unverzichtbar.",
    tags: ["Jenkins", "GitHub Actions", "CI/CD", "Migration"],
    status: "Abgeschlossen",
    statusIcon: CheckCircle2,
    statusColor: "emerald",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp",
  },
  {
    id: "exp-005",
    date: "2026-01-05",
    category: "Elektronik",
    title: "ESP32 als MQTT-Gateway für Sensordaten",
    problem: "Temperatursensoren im Keller sollen Daten an Home Assistant senden, ohne proprietäre Cloud-Dienste zu nutzen.",
    hypothesis: "ESP32 mit ESPHome und lokalem MQTT-Broker könnte eine vollständig lokale, datenschutzfreundliche Lösung bieten.",
    result: "Funktioniert perfekt. Latenz unter 100ms, Stromverbrauch im Deep-Sleep-Modus bei ~20µA. Batterielaufzeit voraussichtlich 2 Jahre.",
    learnings: "ESPHome ist unglaublich mächtig für IoT-Projekte. YAML-Konfiguration ist deutlich angenehmer als Arduino-Code. OTA-Updates sind ein Muss.",
    tags: ["ESP32", "MQTT", "ESPHome", "IoT", "Home Assistant"],
    status: "Abgeschlossen",
    statusIcon: CheckCircle2,
    statusColor: "emerald",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/experiments-bg-AWqnQoBzzykG4TYMzsRmPC.webp",
  },
  {
    id: "exp-006",
    date: "2025-12-15",
    category: "KI / MCP",
    title: "Lokales LLM mit Ollama und Open WebUI",
    problem: "Cloud-KI-Dienste sind teuer, datenschutzrechtlich problematisch und bei Internetausfall nutzlos.",
    hypothesis: "Ollama auf einem lokalen Server mit ausreichend VRAM könnte für viele Use-Cases Cloud-KI ersetzen.",
    result: "Llama 3.1 8B auf einem RTX 3080 läuft flüssig. Für Code-Completion und Dokumentation vollständig ausreichend. GPT-4-Niveau nicht erreichbar, aber für 90% der Aufgaben irrelevant.",
    learnings: "Quantisierung (Q4_K_M) ist der Sweet-Spot zwischen Qualität und Geschwindigkeit. Open WebUI macht das Ganze deutlich benutzbarer.",
    tags: ["Ollama", "LLM", "Self-Hosting", "KI", "Datenschutz"],
    status: "Abgeschlossen",
    statusIcon: CheckCircle2,
    statusColor: "emerald",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/infra-bg-aNMWyyF7gfCfazL44jFPMY.webp",
  },
];

export default function Experimente() {
  const [activeCategory, setActiveCategory] = useState("Alle");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === "Alle"
    ? experiments
    : experiments.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Page Header */}
      <section
        className="pt-32 pb-16 border-b border-border relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/experiments-bg-AWqnQoBzzykG4TYMzsRmPC.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative z-10 container">
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // 01 — Experimente
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Das Labor
            <br />
            <span className="text-[#00d4ff]">ist offen.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Nicht nur "so geht's", sondern: Problem → Hypothese → Umsetzung → Ergebnis → Learnings.
            Systemisches Denken, sichtbar gemacht.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
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
            <span className="ml-auto text-xs text-muted-foreground flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
              {filtered.length} Experimente
            </span>
          </div>
        </div>
      </section>

      {/* Experiments List */}
      <section className="py-12">
        <div className="container">
          <div className="space-y-4">
            {filtered.map((exp, i) => {
              const isExpanded = expandedId === exp.id;
              const StatusIcon = exp.statusIcon;

              return (
                <article
                  key={exp.id}
                  className={`border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.08)]"
                      : "border-border hover:border-[#00d4ff]/30"
                  } bg-card`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Card Header (always visible) */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="w-full text-left p-6 flex items-start gap-4"
                  >
                    {/* Experiment number */}
                    <span
                      className="text-xs text-muted-foreground flex-shrink-0 mt-1 w-12"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {exp.id}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs text-[#00d4ff]" style={{ fontFamily: "var(--font-mono)" }}>
                          {exp.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                          <Calendar className="w-3 h-3" />
                          {exp.date}
                        </span>
                        <span
                          className={`text-xs flex items-center gap-1 ${
                            exp.statusColor === "emerald" ? "text-emerald-400" : "text-amber-400"
                          }`}
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {exp.status}
                        </span>
                      </div>
                      <h2
                        className="text-lg font-semibold text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {exp.title}
                      </h2>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-300 ${
                        isExpanded ? "rotate-90 text-[#00d4ff]" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-border">
                      {/* Image */}
                      <div
                        className="h-40 my-4 border border-border overflow-hidden"
                        style={{
                          backgroundImage: `url(${exp.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="h-full bg-background/40" />
                      </div>

                      {/* Structured content */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {[
                          { label: "Problem", content: exp.problem, color: "text-red-400" },
                          { label: "Hypothese", content: exp.hypothesis, color: "text-[#f59e0b]" },
                          { label: "Ergebnis", content: exp.result, color: "text-emerald-400" },
                          { label: "Learnings", content: exp.learnings, color: "text-[#00d4ff]" },
                        ].map((section) => (
                          <div key={section.label}>
                            <p
                              className={`text-xs uppercase tracking-wider mb-2 ${section.color}`}
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              // {section.label}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        <Tag className="w-3 h-3 text-muted-foreground mt-0.5" />
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
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
