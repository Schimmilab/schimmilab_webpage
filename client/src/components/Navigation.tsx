/*
 * SCHIMMILAB – Navigation Component
 * Design: Deep Space Lab – asymmetric top nav with glowing active state
 * Features: Sticky header, mobile menu, active route highlighting
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, FlaskConical } from "lucide-react";

const navLinks = [
  { href: "/", label: "Start", prefix: "00" },
  { href: "/experimente", label: "Experimente", prefix: "01" },
  { href: "/infrastruktur", label: "Infrastruktur", prefix: "02" },
  { href: "/gedankenraum", label: "Gedankenraum", prefix: "03" },
  { href: "/medien", label: "Medien", prefix: "04" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded border border-[#00d4ff]/40 group-hover:border-[#00d4ff]/80 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]" />
              <FlaskConical className="w-4 h-4 md:w-5 md:h-5 text-[#00d4ff]" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-base md:text-lg font-bold text-foreground tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                schimmi<span className="text-[#00d4ff]">lab</span>
              </span>
              <span
                className="text-[10px] text-muted-foreground tracking-widest uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                v2.0.26
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-sm transition-all duration-200 group flex items-center gap-2 ${
                      isActive
                        ? "text-[#00d4ff]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span
                      className="text-[10px] font-mono opacity-40 group-hover:opacity-70 transition-opacity"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {link.prefix}
                    </span>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-px bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span>ONLINE</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Menü öffnen"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <ul className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-all duration-200 ${
                      isActive
                        ? "text-[#00d4ff] bg-[#00d4ff]/5 border-l-2 border-[#00d4ff]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      {link.prefix}
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
