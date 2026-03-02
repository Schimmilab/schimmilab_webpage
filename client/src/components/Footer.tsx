/*
 * SCHIMMILAB – Footer Component
 * Design: Deep Space Lab – minimal dark footer with tech annotations
 */

import { Link } from "wouter";
import { FlaskConical, Github, Youtube, Terminal } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded border border-[#00d4ff]/40 group-hover:border-[#00d4ff]/70 transition-all duration-300" />
                <FlaskConical className="w-4 h-4 text-[#00d4ff]" />
              </div>
              <span className="text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>
                schimmi<span className="text-[#00d4ff]">lab</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
              Ein offenes Labor für DevOps, KI, Self-Hosting und dokumentierte Neugier.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-[#00d4ff] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-[#00d4ff] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4
              className="text-xs uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/experimente", label: "Experimente" },
                { href: "/infrastruktur", label: "Infrastruktur" },
                { href: "/gedankenraum", label: "Gedankenraum" },
                { href: "/medien", label: "Medien" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-[#00d4ff] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status */}
          <div className="space-y-4">
            <h4
              className="text-xs uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // System
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>Status: ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                <span>Stack: React + Vite</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-50">$</span>
                <span>lab.version: 2.0.{year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            © {year} schimmilab – Dokumentierte Neugier
          </p>
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="text-[#00d4ff]/60">// </span>
            Kein Marketing. Kein Influencer. Nur Experimente.
          </p>
        </div>
      </div>
    </footer>
  );
}
