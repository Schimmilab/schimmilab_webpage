/*
 * SCHIMMILAB – YouTubeEmbed
 *
 * Zwei-Klick-Lösung: Es wird KEINE Verbindung zu Google aufgebaut, solange der
 * Besucher nicht aktiv auf Play klickt. Vorher ist nur ein lokal gehostetes
 * Vorschaubild zu sehen.
 *
 * Warum so und nicht als einfacher iframe:
 *  - Die Datenschutzerklärung dieser Seite sagt zu, dass keine Tracking-Cookies
 *    gesetzt werden und nennt Google Fonts als einzigen Drittanbieter. Ein beim
 *    Seitenaufruf ladender iframe würde Google bei JEDEM Besuch die IP mitteilen
 *    und diese Zusage aushöhlen.
 *  - So gilt: wer nicht klickt, hat keinen Drittanbieter-Kontakt. Wer klickt,
 *    wird vorher darüber informiert.
 *
 * Technisch nötig (sonst bleibt die Fläche in Produktion leer):
 *  - `nginx.conf` braucht `frame-src https://www.youtube-nocookie.com` in der CSP.
 *    Ohne das greift `default-src 'self'` und der iframe wird blockiert.
 */

import { useState } from "react";
import { Play } from "lucide-react";

type Props = {
  /** YouTube-Video-ID, z. B. "og_ThEfZ-Fc" */
  videoId: string;
  /** Sichtbarer Titel — wird auch fürs aria-label des Play-Buttons genutzt */
  title: string;
  /** Lokal gehostetes Vorschaubild, z. B. "/medien/….webp" */
  poster: string;
  /** Optionale Laufzeit-Angabe, z. B. "2:44" */
  duration?: string;
};

export default function YouTubeEmbed({ videoId, title, poster, duration }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="m-0">
      <div className="relative aspect-video overflow-hidden border border-border bg-card">
        {loaded ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            /* nocookie-Domain + autoplay, weil der Klick die Absicht schon ausdrückt */
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Video „${title}" von YouTube laden und abspielen`}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
          >
            <img
              src={poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-background/25 transition-colors group-hover:bg-background/10" />

            {/* Play-Fläche */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00d4ff]/60 bg-background/70 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-[#00d4ff] group-hover:bg-background/85">
                <Play className="ml-0.5 h-6 w-6 text-[#00d4ff]" fill="currentColor" />
              </span>
            </span>

            {duration && (
              <span
                className="absolute bottom-3 right-3 bg-background/85 px-2 py-1 text-xs text-foreground"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {duration}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Transparenz-Hinweis — Teil der Zwei-Klick-Logik, nicht Deko */}
      {!loaded && (
        <figcaption
          className="mt-2 text-xs leading-relaxed text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Mit dem Klick wird das Video von YouTube geladen. Dabei wird deine IP-Adresse an
          Google übermittelt. Vorher besteht keine Verbindung.{" "}
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] underline decoration-[#00d4ff]/40 underline-offset-2 hover:decoration-[#00d4ff]"
          >
            Direkt auf YouTube ansehen
          </a>
        </figcaption>
      )}
    </figure>
  );
}
