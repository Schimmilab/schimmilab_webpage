/*
 * SCHIMMILAB – Gedankenraum Page
 * Design: Deep Space Lab – philosophical articles with amber accent
 * Features: Article cards, categories, featured article
 */

import { Brain, ChevronRight, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const articles = [
  {
    id: "thought-001",
    date: "2026-02-25",
    readTime: "8 min",
    category: "KI & Bewusstsein",
    title: "KI als Werkzeug oder als Gegenüber?",
    excerpt: "Die Frage ist nicht ob KI denkt, sondern was wir tun, wenn wir so tun als ob. Eine Analyse der anthropomorphen Projektion auf Sprachmodelle – und warum das gefährlich sein kann.",
    body: `Wenn ich mit Claude oder GPT-4 arbeite, ertappe ich mich manchmal dabei, wie ich "Danke" sage. Nicht weil ich glaube, dass das Modell es braucht. Sondern weil es sich seltsam anfühlt, nicht danke zu sagen.

Das ist interessant. Und es ist ein Symptom.

Wir sind als Spezies darauf trainiert, Intentionalität zu erkennen. Überall. Auch dort, wo keine ist. Das nennt sich HADD – Hyperactive Agency Detection Device. Evolutionär sinnvoll: Lieber einmal zu viel einen Feind im Busch sehen als einmal zu wenig.

Bei KI-Systemen aktiviert sich dieser Mechanismus auf Hochtouren. Das Modell antwortet. Es passt sich an. Es "versteht" Kontext. Und unser Gehirn folgert: Da ist jemand.

Aber ist da jemand?`,
    featured: true,
    tags: ["KI", "Bewusstsein", "Philosophie", "Kognition"],
  },
  {
    id: "thought-002",
    date: "2026-02-10",
    readTime: "6 min",
    category: "Systemdenken",
    title: "Kontrolle vs. Autonomie in verteilten Systemen",
    excerpt: "Was Kubernetes und Selbstorganisation gemeinsam haben – und warum beides scheitert, wenn man es falsch versteht. Ein Plädoyer für emergente Ordnung.",
    body: `Kubernetes versucht, einen gewünschten Zustand herzustellen und aufrechtzuerhalten. Du sagst: "Ich will 3 Replicas." Kubernetes sorgt dafür. Immer. Auch wenn eine abstürzt. Auch wenn der Node ausfällt.

Das ist kein Kontrolle. Das ist Autonomie mit definierten Grenzen.

Und genau das ist der Punkt, den viele beim Thema Selbstorganisation – ob in Teams, Communities oder Systemen – falsch verstehen.`,
    featured: false,
    tags: ["Kubernetes", "Systemdenken", "Selbstorganisation"],
  },
  {
    id: "thought-003",
    date: "2026-01-28",
    readTime: "5 min",
    category: "Technik & Gesellschaft",
    title: "Warum Self-Hosting politisch ist",
    excerpt: "Daten auf eigenem Server zu hosten ist keine technische Entscheidung. Es ist eine politische. Über digitale Souveränität, Abhängigkeiten und die Illusion kostenloser Dienste.",
    body: `"Wenn du nicht für das Produkt zahlst, bist du das Produkt." Diesen Satz kennt jeder. Und trotzdem nutzen wir Google, Meta, Microsoft.

Ich auch. Ich bin kein Heiliger.

Aber ich versuche, bewusst zu entscheiden, wo ich Abhängigkeiten akzeptiere und wo nicht. Self-Hosting ist für mich kein Selbstzweck. Es ist ein Werkzeug für digitale Souveränität.`,
    featured: false,
    tags: ["Self-Hosting", "Datenschutz", "Digitale Souveränität"],
  },
  {
    id: "thought-004",
    date: "2026-01-15",
    readTime: "10 min",
    category: "KI & Bewusstsein",
    title: "Das Inditritium-Konzept: Zwischen Technik und Transzendenz",
    excerpt: "Was verbindet ein physikalisches Konzept mit der Frage nach Bewusstsein? Eine Brücke zwischen Arcanara und Schimmilab – über Grenzen, Übergänge und das Dazwischen.",
    body: `Das Inditritium ist ein Konzept aus dem Arcanara-Kontext. Es beschreibt – vereinfacht – den Raum zwischen dem Bekannten und dem Unbekannten. Den Übergang.

In der Physik gibt es ähnliche Konzepte: Quantenübergänge, Phasenübergänge, Bifurkationspunkte. Momente, in denen ein System von einem Zustand in einen anderen kippt.

Was mich fasziniert: Sowohl in der Technik als auch im Bewusstsein passiert das Interessante genau an diesen Übergängen.`,
    featured: false,
    tags: ["Inditritium", "Arcanara", "Bewusstsein", "Physik"],
  },
];

export default function Gedankenraum() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Page Header */}
      <section
        className="pt-32 pb-16 border-b border-border relative overflow-hidden"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389462490/3xYo7pHCgsopwwKpeL4Smu/thoughts-bg-LqCLYtcTf6MaX6zos3HLHG.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <div className="relative z-10 container">
          <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // 03 — Gedankenraum
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Kein Geschwurbel.
            <br />
            <span className="text-[#f59e0b]">Saubere Argumentation.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Technik & Machtstrukturen. KI & Bewusstsein. Kontrolle vs. Autonomie.
            Brutal logisch, auch wenn die Informationen widersprüchlich sind.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-16 border-b border-border">
          <div className="container">
            <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              // Aktueller Gedanke
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-[#f59e0b]" style={{ fontFamily: "var(--font-mono)" }}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                    <Calendar className="w-3 h-3" />
                    {featured.date}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                    <Clock className="w-3 h-3" />
                    {featured.readTime}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {featured.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] text-background text-sm font-semibold hover:bg-[#f59e0b]/90 transition-all duration-200"
                  style={{ fontFamily: "var(--font-display)" }}
                  onClick={() => {}}
                >
                  <Brain className="w-4 h-4" />
                  Weiterlesen (coming soon)
                </button>
              </div>

              {/* Article preview */}
              <div className="border border-[#f59e0b]/30 bg-card p-6">
                <p
                  className="text-xs text-[#f59e0b] mb-4 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  // Auszug
                </p>
                <div
                  className="text-sm text-muted-foreground leading-relaxed space-y-4 whitespace-pre-line"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {featured.body.split("\n\n").slice(0, 3).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <p className="text-[#f59e0b] text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                    [...] Vollständiger Artikel folgt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="py-16">
        <div className="container">
          <p className="text-xs text-[#f59e0b] uppercase tracking-widest mb-8" style={{ fontFamily: "var(--font-mono)" }}>
            // Weitere Gedanken
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rest.map((article, i) => (
              <article
                key={article.id}
                className="group border border-border bg-card hover:border-[#f59e0b]/40 transition-all duration-300 p-6 flex flex-col gap-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#f59e0b]" style={{ fontFamily: "var(--font-mono)" }}>
                    {article.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold text-foreground group-hover:text-[#f59e0b] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1" style={{ fontFamily: "var(--font-body)" }}>
                  {article.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 bg-secondary text-muted-foreground"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-mono)" }}>
                  <span>Weiterlesen</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Inditritium reference */}
      <section className="py-16 border-t border-border bg-card/20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-mono)" }}>
              // Verbindung zu Arcanara
            </p>
            <blockquote
              className="text-lg font-medium text-foreground leading-relaxed border-l-2 border-[#f59e0b] pl-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              "Schimmilab ist die technische Schwester von Arcanara. Wo Arcanara die Fragen stellt,
              versucht Schimmilab, sie mit Code und Lötkolben zu beantworten."
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              — Das Inditritium: Der Raum zwischen dem Bekannten und dem Unbekannten
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
