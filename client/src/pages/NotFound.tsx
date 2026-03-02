/*
 * SCHIMMILAB – 404 Not Found Page
 * Design: Deep Space Lab – terminal-style 404 with humor
 */

import { Link } from "wouter";
import { Terminal, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg px-4">
          {/* Terminal icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border border-[#00d4ff]/40 flex items-center justify-center">
              <Terminal className="w-8 h-8 text-[#00d4ff]" />
            </div>
          </div>

          {/* Error code */}
          <p
            className="text-xs text-[#00d4ff] uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // Error 404
          </p>

          <h1
            className="text-6xl md:text-8xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </h1>

          {/* Terminal output */}
          <div className="border border-border bg-card p-4 mb-8 text-left">
            <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-[#00d4ff]">$</span> find / -name "requested-page" 2&gt;/dev/null
            </p>
            <p className="text-xs text-red-400 mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              find: No such file or directory
            </p>
            <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-[#00d4ff]">$</span> echo "Experiment fehlgeschlagen."
            </p>
            <p className="text-xs text-[#f59e0b]" style={{ fontFamily: "var(--font-mono)" }}>
              Experiment fehlgeschlagen.
            </p>
            <p className="text-xs text-muted-foreground mt-2" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-[#00d4ff]">$</span>{" "}
              <span className="animate-pulse">_</span>
            </p>
          </div>

          <p
            className="text-muted-foreground mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Diese Seite existiert nicht – oder das Experiment ist noch nicht dokumentiert.
            Zurück ins Labor?
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4ff] text-background font-semibold text-sm hover:bg-[#00d4ff]/90 transition-all duration-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Labor
          </Link>
        </div>
      </div>
    </div>
  );
}
