/*
 * SCHIMMILAB – Impressum
 * Design: Deep Space Lab – legal page with minimal styling
 */

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Impressum – Schimmilab</title>
      <meta name="description" content="Impressum von Schimmilab – Angaben gemäß § 5 TMG." />
      <Navigation />

      <section className="pt-32 pb-16 border-b border-border">
        <div className="container">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-[#00d4ff] transition-colors mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft className="w-3 h-3" />
            zurück
          </Link>
          <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-mono)" }}>
            // Rechtliches
          </p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Impressum
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-2xl space-y-10">

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Angaben gemäß § 5 TMG
            </p>
            <div className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-foreground font-semibold">Jürgen Schilling</p>
              <p>Seilerstr. 25</p>
              <p>71144 Steinenbronn</p>
              <p>Deutschland</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Kontakt
            </p>
            <div className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:schimmi@schimmilab.de"
                  className="text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
                >
                  schimmi@schimmilab.de
                </a>
              </p>
              <p>Telefon: +49 152 33565803</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)
            </p>
            <div className="text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-foreground font-semibold">Jürgen Schilling</p>
              <p>Seilerstr. 25</p>
              <p>71144 Steinenbronn</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Haftungsausschluss
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
              </p>
              <p>
                Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
                Bekanntwerden von entsprechenden Rechtsverletzungen werde ich diese Inhalte umgehend
                entfernen.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Haftung für Links
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
                Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
                der Seiten verantwortlich.
              </p>
              <p>
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                Rechtsverletzungen werde ich derartige Links umgehend entfernen.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // Urheberrecht
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p>
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
                gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden
                die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
                gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
                werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
