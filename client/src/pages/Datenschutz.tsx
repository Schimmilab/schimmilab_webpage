/*
 * SCHIMMILAB – Datenschutzerklärung
 * Design: Deep Space Lab – legal page with minimal styling
 */

import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>Datenschutzerklärung – Schimmilab</title>
      <meta name="description" content="Datenschutzerklärung von Schimmilab gemäß DSGVO." />
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
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-2xl space-y-10">

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 1. Verantwortlicher
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-foreground font-semibold">Jürgen Schilling</p>
              <p>Seilerstr. 25, 71144 Steinenbronn</p>
              <p>
                E-Mail:{" "}
                <a href="mailto:schimmi@schimmilab.de" className="text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors">
                  schimmi@schimmilab.de
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 2. Allgemeines zur Datenverarbeitung
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Diese Website verarbeitet personenbezogene Daten nur im technisch notwendigen Umfang.
                Es werden keine Nutzerdaten an Dritte zu Werbezwecken weitergegeben. Die Verarbeitung
                erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb
                einer öffentlich zugänglichen Website).
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 3. Hosting
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Diese Website wird auf einem Server der <strong className="text-foreground">Hetzner Online GmbH</strong>,
                Industriestr. 25, 91710 Gunzenhausen, Deutschland, gehostet. Beim Aufruf der Website
                werden automatisch folgende Daten verarbeitet:
              </p>
              <ul className="list-none space-y-1 pl-4 border-l border-border">
                <li>IP-Adresse (anonymisiert)</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Aufgerufene URL</li>
                <li>HTTP-Statuscode</li>
                <li>Übertragene Datenmenge</li>
                <li>Referrer-URL (soweit übermittelt)</li>
                <li>Browser und Betriebssystem (User-Agent)</li>
              </ul>
              <p>
                Diese Daten sind technisch notwendig zur Auslieferung der Website und werden nicht
                dauerhaft gespeichert. Hetzner ist nach Art. 28 DSGVO als Auftragsverarbeiter tätig.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 4. Cookies
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Diese Website verwendet keine Cookies für Tracking oder Marketing. Es werden lediglich
                technisch notwendige Mechanismen verwendet (z. B. Theme-Präferenz via localStorage),
                die ausschließlich lokal im Browser gespeichert werden und nicht an Server übertragen werden.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 5. Analyse & Tracking
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Diese Website verwendet <strong className="text-foreground">Umami Analytics</strong> — eine
                datenschutzfreundliche, selbstgehostete Analysesoftware. Umami sammelt keine
                personenbezogenen Daten, setzt keine Cookies und ist vollständig DSGVO-konform.
                Es werden ausschließlich anonymisierte Seitenaufrufe gezählt (Seitenbesuche,
                Referrer-Domain, Gerätekategorie) — ohne IP-Speicherung oder Fingerprinting.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 6. Kontaktaufnahme
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Wenn Sie per E-Mail Kontakt aufnehmen, werden die von Ihnen übermittelten Daten
                (Name, E-Mail-Adresse, Nachrichteninhalt) zur Bearbeitung Ihrer Anfrage gespeichert.
                Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben und nach Abschluss der
                Kommunikation gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 7. Externe Inhalte & Schriften
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                <strong className="text-foreground">Google Fonts:</strong> Diese Website lädt Schriftarten
                (DM Sans, Space Grotesk, JetBrains Mono) von Google Fonts. Dabei wird Ihre IP-Adresse
                an Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA übermittelt.
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einheitlicher
                Darstellung). Weitere Informationen:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
                >
                  Google Datenschutzerklärung
                </a>
                .
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 8. Ihre Rechte
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3" style={{ fontFamily: "var(--font-body)" }}>
              <p>Sie haben jederzeit das Recht auf:</p>
              <ul className="list-none space-y-1 pl-4 border-l border-border">
                <li><strong className="text-foreground">Auskunft</strong> über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
                <li><strong className="text-foreground">Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
                <li><strong className="text-foreground">Löschung</strong> Ihrer Daten (Art. 17 DSGVO)</li>
                <li><strong className="text-foreground">Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
                <li><strong className="text-foreground">Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                <li><strong className="text-foreground">Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p>
                Zur Ausübung dieser Rechte wenden Sie sich bitte an:{" "}
                <a href="mailto:schimmi@schimmilab.de" className="text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors">
                  schimmi@schimmilab.de
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 9. Beschwerderecht
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
                Die zuständige Aufsichtsbehörde für Baden-Württemberg ist der{" "}
                <strong className="text-foreground">Landesbeauftragte für den Datenschutz und die Informationsfreiheit
                Baden-Württemberg</strong>, Lautenschlagerstr. 20, 70173 Stuttgart.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#00d4ff] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              // 10. Aktualität
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und datiert vom März 2026.
                Durch die Weiterentwicklung dieser Website oder aufgrund geänderter gesetzlicher
                bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung
                zu ändern.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
