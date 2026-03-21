# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Build frontend (Vite) + server bundle (esbuild)
pnpm start        # Run production server (NODE_ENV=production)
pnpm check        # TypeScript type checking (tsc --noEmit)
pnpm format       # Auto-format with Prettier
```

No test runner is configured.

## Architecture

**Tech stack:** React 19 + Vite 7 + TypeScript, Express backend, Tailwind CSS v4, shadcn/ui (New York style), wouter for routing, Framer Motion for animations.

**Deployment:** Docker (nginx:alpine) on Hetzner VPS via Traefik reverse proxy with Let's Encrypt. Images are pushed to GHCR on every push to `main`.

### Project Structure

```
client/src/
├── pages/          # Route components (Home, Experimente, Gedankenraum, Infrastruktur, Medien)
├── components/     # UI components + shadcn/ui components in components/ui/
├── data/           # Auto-generated TypeScript data files (DO NOT EDIT MANUALLY)
├── hooks/          # Custom React hooks
├── contexts/       # ThemeProvider
└── lib/            # Utilities (cn, etc.)

server/index.ts     # Express server serving static files
shared/             # Shared types and constants
scripts/            # Python sync script
```

### Content Management

Content lives in **Anytype** and is synced automatically every 6 hours via GitHub Actions (`.github/workflows/sync-anytype.yml`). The script `scripts/sync-anytype.py` fetches three object types and generates TypeScript data files:

- Anytype "Experimente" → `client/src/data/experiments.ts`
- Anytype "Gedankenraum" → `client/src/data/thoughts.ts`
- Anytype "Infrastruktur" → `client/src/data/infrastructure.ts`

**Never manually edit files in `client/src/data/`** — they are overwritten on each sync.

### Design System

The site uses a "Deep Space Lab" aesthetic: dark navy-black backgrounds, neon cyan accents, warm amber highlights. Key CSS variables are defined in `client/src/index.css`. Typography: DM Sans (body), Space Grotesk (display), JetBrains Mono (code).

### Path Aliases

- `@` → `client/src`
- `@shared` → `shared`
- `@assets` → `attached_assets`
