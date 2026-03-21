# schimmilab.de

**Experimente zwischen Code, KI und Erkenntnis.**

Die persönliche Lab-Website von Schimmilab — ein Ort für dokumentierte Experimente, Infrastruktur-Doku und Gedanken zu Technik, KI und Systemdenken.

→ **[schimmilab.de](https://schimmilab.de)**

---

## Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui (New York) |
| Routing | wouter |
| Animationen | Framer Motion |
| Backend | Express.js (Static File Serving) |
| Container | Docker (nginx:alpine) |
| Deployment | Hetzner VPS, Traefik, Let's Encrypt |
| CMS | [Anytype](https://anytype.io) (headless, via REST API) |
| CI/CD | GitHub Actions + GHCR |

## Content-Pipeline

Inhalte werden in **Anytype** gepflegt und automatisch alle 6 Stunden via GitHub Actions synchronisiert:

```
Anytype Space
    ↓  REST API  (sync-anytype.py)
client/src/data/
  ├── experiments.ts      ← Typ "Experimente"
  ├── thoughts.ts         ← Typ "Gedankenraum"
  └── infrastructure.ts   ← Typ "Infrastruktur"
    ↓  pnpm build  (Vite)
Docker Image → Hetzner → schimmilab.de
```

Inhalte werden **build-time statisch** ins Bundle kompiliert — kein Runtime-API-Call zur Website.

## Lokale Entwicklung

```bash
pnpm install
pnpm dev          # Dev-Server auf http://localhost:3000
```

Weitere Befehle:

```bash
pnpm build        # Frontend (Vite) + Server (esbuild)
pnpm start        # Produktions-Server starten
pnpm check        # TypeScript type checking
pnpm format       # Prettier auto-format
```

## Content-Sync lokal ausführen

```bash
export ANYTYPE_API_TOKEN="<dein-token>"
export ANYTYPE_API_BASE_URL="<anytype-api-url>"
export ANYTYPE_SPACE_ID="<space-id>"

python3 scripts/sync-anytype.py
```

> **Hinweis:** Die generierten Dateien in `client/src/data/` nie manuell bearbeiten — sie werden beim nächsten Sync überschrieben.

## Deployment

Jeder Push auf `main` triggert automatisch:
1. Docker Image Build (multi-arch: amd64 + arm64)
2. Push zu GitHub Container Registry (GHCR)
3. SSH-Deploy auf Hetzner VPS via docker compose

### Benötigte GitHub Secrets

| Secret | Beschreibung |
|--------|--------------|
| `ANYTYPE_API_TOKEN` | Bearer Token für die Anytype REST API |
| `ANYTYPE_API_BASE_URL` | Base-URL der Anytype API |
| `ANYTYPE_SPACE_ID` | ID des Anytype-Space |
| `GH_PAT` | GitHub PAT (für Commits durch den Sync-Bot + GHCR Pull auf VPS) |
| `HETZNER_HOST` | IP/Hostname des Hetzner VPS |
| `HETZNER_USER` | SSH-Benutzername auf dem VPS |
| `HETZNER_SSH_KEY` | Privater SSH-Key für den VPS |

## Anytype Content-Struktur

Damit der Sync korrekt funktioniert, müssen Anytype-Einträge diese Heading-Struktur verwenden:

**Experimente:**
```
## 🎯 Problem / ## 💡 Hypothese / ## ⚙️ Umsetzung / ## Ergebnis / ## 🧠 Learnings
```

**Infrastruktur:**
```
## Überblick / ## Stack / ## Architektur / ## Setup / ## Kosten / ## Sicherheit / ## Code / ## Learnings
```

## Lizenz

MIT — siehe [LICENSE](LICENSE)
