#!/usr/bin/env python3
"""
sync-anytype.py
Syncs Anytype Schimmilab Space objects to TypeScript data files.
- Type "Experimente" -> client/src/data/experiments.ts
- Type "Gedankenraum" -> client/src/data/thoughts.ts

Usage:
  ANYTYPE_API_TOKEN=<token> python3 scripts/sync-anytype.py

Environment variables:
  ANYTYPE_API_TOKEN    - Bearer token for Anytype REST API
  ANYTYPE_API_BASE_URL - Base URL of Anytype API (default: https://anytype-api.schimmi-n8n.de)
  ANYTYPE_SPACE_ID     - Space ID (default: Schimmilab space)
"""
import os, sys, json, re, requests
from pathlib import Path
from datetime import datetime

# ── Configuration ──────────────────────────────────────────────────────────────
API_TOKEN = os.environ.get("ANYTYPE_API_TOKEN", "")
API_BASE  = os.environ.get("ANYTYPE_API_BASE_URL", "https://anytype-api.schimmi-n8n.de")
SPACE_ID  = os.environ.get("ANYTYPE_SPACE_ID",
    "ANYTYPE_SPACE_ID_REDACTED")

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Anytype-Version": "2025-11-08",
    "Content-Type": "application/json",
}

PROJECT_DIR      = Path(__file__).parent.parent
EXPERIMENTS_FILE = PROJECT_DIR / "client/src/data/experiments.ts"
THOUGHTS_FILE    = PROJECT_DIR / "client/src/data/thoughts.ts"

# ── Helpers ────────────────────────────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[äöüÄÖÜß]',
        lambda m: {'ä':'ae','ö':'oe','ü':'ue','Ä':'ae','Ö':'oe','Ü':'ue','ß':'ss'}[m.group()], text)
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text[:50].strip('-') or "item"

def escape_ts(text: str) -> str:
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def extract_section(content: str, heading: str) -> str:
    """Extract content under a markdown heading (handles emojis before heading)."""
    pattern = rf'#{1,3}[^\n]*{re.escape(heading)}[^\n]*\n(.*?)(?=\n#{1,3}|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if match:
        section = match.group(1).strip()
        # Remove italic placeholder lines like *Beschreibe...*
        section = re.sub(r'^\*[^*\n]+\*\s*$', '', section, flags=re.MULTILINE).strip()
        return section
    return ""

def clean_excerpt(text: str, max_len: int = 160) -> str:
    text = re.sub(r'[#*`_\[\]()]', '', text).strip()
    text = re.sub(r'\s+', ' ', text)
    if len(text) > max_len:
        return text[:max_len].rsplit(' ', 1)[0] + '...'
    return text

def get_prop(props: list, key: str):
    for p in props:
        if p.get("key") == key:
            return p
    return {}

# ── Parsers ────────────────────────────────────────────────────────────────────
def parse_experiment(obj: dict) -> dict | None:
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None

    snippet = obj.get("snippet", "") or ""
    props   = obj.get("properties", [])

    # Date
    date_prop = get_prop(props, "created_date")
    date_str  = (date_prop.get("date") or "")[:10] or datetime.now().strftime("%Y-%m-%d")

    # Tags
    tag_prop = get_prop(props, "tag")
    tags = [t.get("name", "") for t in (tag_prop.get("multi_select") or []) if t.get("name")]

    # Status
    status_prop = get_prop(props, "status")
    status_raw  = (status_prop.get("select") or {}).get("name", "Abgeschlossen")
    status_map  = {
        "Abgeschlossen": ("completed", "text-emerald-400", "Abgeschlossen"),
        "In Arbeit":     ("in_progress", "text-amber-400", "In Arbeit"),
        "Geplant":       ("planned", "text-cyan-400", "Geplant"),
        "Archiviert":    ("archived", "text-gray-400", "Archiviert"),
    }
    status, status_color, status_label = status_map.get(status_raw, status_map["Abgeschlossen"])

    # Sections
    problem   = extract_section(snippet, "Problem")
    hypothese = extract_section(snippet, "Hypothese")
    umsetzung = extract_section(snippet, "Umsetzung")
    ergebnis  = extract_section(snippet, "Ergebnis")
    learnings = extract_section(snippet, "Learnings")

    if not problem and not hypothese:
        problem = snippet[:500] if snippet else f"Experiment: {name}"

    excerpt = clean_excerpt(problem or snippet)
    if not excerpt:
        excerpt = f"Experiment: {name}"

    # Auto-category
    combined = (name + " " + snippet).lower()
    if any(k in combined for k in ["docker","traefik","hetzner","server","infrastruktur","hosting","nginx"]):
        category = "Infrastruktur"
    elif any(k in combined for k in ["ki","ai","mcp","llm","gpt","claude","n8n","copilot"]):
        category = "KI & ML"
    elif any(k in combined for k in ["devops","jenkins","github","ci/cd","pipeline","deploy"]):
        category = "DevOps"
    elif any(k in combined for k in ["3d","druck","elektronik","hardware","arduino","raspberry","esp"]):
        category = "Hardware"
    else:
        category = tags[0] if tags else "Allgemein"

    return {
        "id":          slugify(name),
        "anytype_id":  obj.get("id", ""),
        "title":       name,
        "category":    category,
        "tags":        tags or [category],
        "date":        date_str,
        "status":      status,
        "statusColor": status_color,
        "statusLabel": status_label,
        "excerpt":     excerpt,
        "problem":     problem,
        "hypothese":   hypothese,
        "umsetzung":   umsetzung,
        "ergebnis":    ergebnis,
        "learnings":   learnings,
    }

def parse_thought(obj: dict) -> dict | None:
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None

    snippet = obj.get("snippet", "") or ""
    props   = obj.get("properties", [])

    date_prop = get_prop(props, "created_date")
    date_str  = (date_prop.get("date") or "")[:10] or datetime.now().strftime("%Y-%m-%d")

    tag_prop = get_prop(props, "tag")
    tags = [t.get("name", "") for t in (tag_prop.get("multi_select") or []) if t.get("name")]

    excerpt = clean_excerpt(snippet) or f"Ein Gedanke über {name}."
    word_count = len(snippet.split()) if snippet else 50
    read_time  = max(1, word_count // 200)

    return {
        "id":       slugify(name),
        "title":    name,
        "tags":     tags or ["Gedanke"],
        "date":     date_str,
        "readTime": read_time,
        "excerpt":  excerpt,
        "content":  snippet,
    }

# ── TypeScript Generators ──────────────────────────────────────────────────────
def gen_experiments_ts(experiments: list) -> str:
    lines = [
        "// AUTO-GENERATED by scripts/sync-anytype.py",
        f"// Last sync: {datetime.now().isoformat()}",
        "// DO NOT EDIT MANUALLY – edit in Anytype Schimmilab Space instead",
        "",
        "export interface Experiment {",
        "  id: string;",
        "  anytype_id?: string;",
        "  title: string;",
        "  category: string;",
        "  tags: string[];",
        "  date: string;",
        "  status: string;",
        "  statusColor: string;",
        "  statusLabel: string;",
        "  excerpt: string;",
        "  problem: string;",
        "  hypothese: string;",
        "  umsetzung: string;",
        "  ergebnis: string;",
        "  learnings: string;",
        "}",
        "",
        "export const experiments: Experiment[] = [",
    ]
    for e in experiments:
        lines += [
            "  {",
            f'    id: "{escape_ts(e["id"])}",',
            f'    anytype_id: "{escape_ts(e["anytype_id"])}",',
            f'    title: `{escape_ts(e["title"])}`,',
            f'    category: `{escape_ts(e["category"])}`,',
            f'    tags: [{", ".join(json.dumps(t) for t in e["tags"])}],',
            f'    date: "{e["date"]}",',
            f'    status: "{e["status"]}",',
            f'    statusColor: "{e["statusColor"]}",',
            f'    statusLabel: "{e["statusLabel"]}",',
            f'    excerpt: `{escape_ts(e["excerpt"])}`,',
            f'    problem: `{escape_ts(e["problem"])}`,',
            f'    hypothese: `{escape_ts(e["hypothese"])}`,',
            f'    umsetzung: `{escape_ts(e["umsetzung"])}`,',
            f'    ergebnis: `{escape_ts(e["ergebnis"])}`,',
            f'    learnings: `{escape_ts(e["learnings"])}`,',
            "  },",
        ]
    lines += [
        "];",
        "",
        "export const getExperimentById = (id: string): Experiment | undefined =>",
        "  experiments.find((e) => e.id === id);",
        "",
        "export const getExperimentsByCategory = (category: string): Experiment[] =>",
        "  experiments.filter((e) => e.category === category);",
        "",
    ]
    return "\n".join(lines)

def gen_thoughts_ts(thoughts: list) -> str:
    lines = [
        "// AUTO-GENERATED by scripts/sync-anytype.py",
        f"// Last sync: {datetime.now().isoformat()}",
        "// DO NOT EDIT MANUALLY – edit in Anytype Schimmilab Space instead",
        "",
        "export interface Thought {",
        "  id: string;",
        "  title: string;",
        "  tags: string[];",
        "  date: string;",
        "  readTime: number;",
        "  excerpt: string;",
        "  content: string;",
        "}",
        "",
        "export const thoughts: Thought[] = [",
    ]
    for t in thoughts:
        lines += [
            "  {",
            f'    id: "{escape_ts(t["id"])}",',
            f'    title: `{escape_ts(t["title"])}`,',
            f'    tags: [{", ".join(json.dumps(tag) for tag in t["tags"])}],',
            f'    date: "{t["date"]}",',
            f'    readTime: {t["readTime"]},',
            f'    excerpt: `{escape_ts(t["excerpt"])}`,',
            f'    content: `{escape_ts(t["content"])}`,',
            "  },",
        ]
    lines += [
        "];",
        "",
        "export const getThoughtById = (id: string): Thought | undefined =>",
        "  thoughts.find((t) => t.id === id);",
        "",
    ]
    return "\n".join(lines)

# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    if not API_TOKEN:
        print("ERROR: ANYTYPE_API_TOKEN not set", file=sys.stderr)
        sys.exit(1)

    print(f"🔄 Anytype Sync gestartet: {datetime.now().isoformat()}")
    print(f"   API: {API_BASE}")
    print(f"   Space: {SPACE_ID[:40]}...")

    # Search all objects
    resp = requests.post(
        f"{API_BASE}/v1/spaces/{SPACE_ID}/search",
        headers=HEADERS,
        json={"query": "", "limit": 200},
        timeout=30,
    )
    resp.raise_for_status()
    objects = resp.json().get("data", [])
    print(f"📦 {len(objects)} Objekte gefunden")

    experiments, thoughts = [], []

    for obj in objects:
        type_name = obj.get("type", {}).get("name", "")
        type_key  = obj.get("type", {}).get("key", "")

        if type_name == "Experimente" or type_key == "experimente":
            exp = parse_experiment(obj)
            if exp:
                experiments.append(exp)
                print(f"  🔬 Experiment: {exp['title']}")

        elif type_name == "Gedankenraum" or type_key == "gedankenraum":
            thought = parse_thought(obj)
            if thought:
                thoughts.append(thought)
                print(f"  🧠 Gedanke: {thought['title']}")

    # Sort newest first
    experiments.sort(key=lambda x: x["date"], reverse=True)
    thoughts.sort(key=lambda x: x["date"], reverse=True)

    # Write files
    EXPERIMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    EXPERIMENTS_FILE.write_text(gen_experiments_ts(experiments), encoding="utf-8")
    print(f"\n✅ {len(experiments)} Experimente → {EXPERIMENTS_FILE}")

    THOUGHTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    THOUGHTS_FILE.write_text(gen_thoughts_ts(thoughts), encoding="utf-8")
    print(f"✅ {len(thoughts)} Gedanken → {THOUGHTS_FILE}")

    print("\n🚀 Sync abgeschlossen!")

if __name__ == "__main__":
    main()
