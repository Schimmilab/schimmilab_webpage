#!/usr/bin/env python3
"""
sync-anytype.py
Syncs Anytype Schimmilab Space objects to TypeScript data files.
- Type "Experimente"  -> client/src/data/experiments.ts
- Type "Gedankenraum" -> client/src/data/thoughts.ts
- Type "Infrastruktur"-> client/src/data/infrastructure.ts

Usage:
  ANYTYPE_API_TOKEN=<token> python3 scripts/sync-anytype.py

Environment variables (all required):
  ANYTYPE_API_TOKEN    - Bearer token for Anytype REST API
  ANYTYPE_API_BASE_URL - Base URL of Anytype API (e.g. https://anytype-api.example.com)
  ANYTYPE_SPACE_ID     - Space ID of the Anytype space to sync
"""
import os, sys, json, re, requests
from pathlib import Path
from datetime import datetime

# ── Configuration ──────────────────────────────────────────────────────────────
API_TOKEN = os.environ.get("ANYTYPE_API_TOKEN", "")
API_BASE  = os.environ.get("ANYTYPE_API_BASE_URL", "")
SPACE_ID  = os.environ.get("ANYTYPE_SPACE_ID", "")

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Anytype-Version": "2025-11-08",
    "Content-Type": "application/json",
}

PROJECT_DIR         = Path(__file__).parent.parent
EXPERIMENTS_FILE    = PROJECT_DIR / "client/src/data/experiments.ts"
THOUGHTS_FILE       = PROJECT_DIR / "client/src/data/thoughts.ts"
INFRASTRUCTURE_FILE = PROJECT_DIR / "client/src/data/infrastructure.ts"
SITEMAP_FILE        = PROJECT_DIR / "client/public/sitemap.xml"
BASE_URL            = "https://schimmilab.de"

# Section heading keywords used as boundaries in extraction
_EXP_HEADINGS   = ["Problem", "Hypothese", "Umsetzung", "Ergebnis", "Learnings"]
_INFRA_HEADINGS = ["Überblick", "Stack", "Architektur", "Setup", "Kosten", "Sicherheit", "Code", "Learnings"]

# ── API helpers ────────────────────────────────────────────────────────────────
def fetch_object_markdown(object_id: str) -> str:
    """Fetch full object content as Markdown via get-object endpoint."""
    resp = requests.get(
        f"{API_BASE}/v1/spaces/{SPACE_ID}/objects/{object_id}",
        headers=HEADERS,
        timeout=30,
    )
    if resp.status_code != 200:
        print(f"    ⚠️  Objekt {object_id[:24]}… HTTP {resp.status_code}", file=sys.stderr)
        return ""
    return resp.json().get("object", {}).get("markdown", "") or ""

# ── Text helpers ───────────────────────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[äöüÄÖÜß]',
        lambda m: {'ä':'ae','ö':'oe','ü':'ue','Ä':'ae','Ö':'oe','Ü':'ue','ß':'ss'}[m.group()], text)
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text[:50].strip('-') or "item"

def escape_ts(text: str) -> str:
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def extract_section(content: str, heading: str, all_headings: list) -> str:
    """Extract content under a Markdown heading.

    Anytype exports headings as '## 🎯 Problem', '## 💡 Hypothese', etc.
    The search snippet strips the '##', so we also handle plain-text labels
    as a fallback (e.g. '🎯 Problem\\n…').
    """
    # 1. Standard Markdown heading: ## [emoji] Heading
    pattern = rf'#{1,3}[^\n]*\b{re.escape(heading)}\b[^\n]*\n(.*?)(?=\n#{1,3}|\Z)'
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if match:
        section = match.group(1).strip()
        section = re.sub(r'^\*[^*\n]+\*\s*$', '', section, flags=re.MULTILINE).strip()
        return section

    # 2. Fallback: plain-text / emoji-prefixed label on its own line
    boundary = "|".join(re.escape(k) for k in all_headings)
    pat = (
        rf'(?m)^[^\n]*\b{re.escape(heading)}\b[^\n]*\n'
        rf'(.*?)'
        rf'(?=^[^\n]*\b(?:{boundary})\b[^\n]*\n|\Z)'
    )
    match2 = re.search(pat, content, re.DOTALL | re.IGNORECASE)
    if match2:
        section = match2.group(1).strip()
        section = re.sub(r'^\*[^*\n]+\*\s*$', '', section, flags=re.MULTILINE).strip()
        return section
    return ""

def clean_excerpt(text: str, max_len: int = 160) -> str:
    """Strip Markdown syntax and return a short plain-text excerpt."""
    text = re.sub(r'#{1,6}\s*', '', text)                      # headings
    text = re.sub(r'\*{1,3}([^*\n]+)\*{1,3}', r'\1', text)    # bold/italic
    text = re.sub(r'`{1,3}[^`]*`{1,3}', '', text)             # code
    text = re.sub(r'^[-*+]\s+', '', text, flags=re.MULTILINE)  # list markers
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)       # links
    text = re.sub(r'[_\[\]()]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > max_len:
        return text[:max_len].rsplit(' ', 1)[0] + '...'
    return text

def get_prop(props: list, key: str) -> dict:
    for p in props:
        if p.get("key") == key:
            return p
    return {}

# ── Parsers ────────────────────────────────────────────────────────────────────
def parse_experiment(obj: dict, markdown: str) -> dict | None:
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None

    props = obj.get("properties", [])

    # Date
    date_prop = get_prop(props, "created_date")
    date_str  = (date_prop.get("date") or "")[:10] or datetime.now().strftime("%Y-%m-%d")

    # Tags
    tag_prop = get_prop(props, "tag")
    tags = [t.get("name", "") for t in (tag_prop.get("multi_select") or []) if t.get("name")]

    # Status – stored as text in "experiment_status" property
    status_prop = get_prop(props, "experiment_status")
    status_raw  = (status_prop.get("text") or "").strip() or "Abgeschlossen"
    status_map  = {
        "Abgeschlossen": ("completed",   "text-emerald-400", "Abgeschlossen"),
        "In Arbeit":     ("in_progress", "text-amber-400",   "In Arbeit"),
        "Laufend":       ("in_progress", "text-amber-400",   "Laufend"),
        "Geplant":       ("planned",     "text-cyan-400",    "Geplant"),
        "Archiviert":    ("archived",    "text-gray-400",    "Archiviert"),
    }
    status, status_color, status_label = {k.lower(): v for k, v in status_map.items()}.get(status_raw.lower(), status_map["Abgeschlossen"])

    # Category – use explicit "kategorie" property first, then auto-detect
    kategorie_prop = get_prop(props, "kategorie")
    kategorie      = (kategorie_prop.get("text") or "").strip()

    # Images: extract public https:// image URLs embedded in the markdown
    images = re.findall(r'!\[[^\]]*\]\((https://[^)]+)\)', markdown)

    # Repo-hosted header image: client/public/experiments/<slug>.webp.
    # Anytype does not persist external image URLs in object markdown, so
    # curated images live in the repo keyed by experiment slug instead.
    slug = slugify(name)
    local_img = PROJECT_DIR / "client" / "public" / "experiments" / f"{slug}.webp"
    if local_img.exists():
        rel = f"/experiments/{slug}.webp"
        if rel not in images:
            images.insert(0, rel)

    # Sections from full Markdown content
    problem   = extract_section(markdown, "Problem",   _EXP_HEADINGS)
    hypothese = extract_section(markdown, "Hypothese", _EXP_HEADINGS)
    umsetzung = extract_section(markdown, "Umsetzung", _EXP_HEADINGS)
    ergebnis  = extract_section(markdown, "Ergebnis",  _EXP_HEADINGS)
    learnings = extract_section(markdown, "Learnings", _EXP_HEADINGS)

    # Fallback: use full markdown as problem text when no sections found
    if not problem and not hypothese:
        problem = markdown[:800] if markdown else f"Experiment: {name}"

    excerpt = clean_excerpt(problem or markdown)
    if not excerpt:
        excerpt = f"Experiment: {name}"

    # Auto-category if not explicitly set
    if kategorie:
        category = kategorie
    else:
        combined = (name + " " + markdown).lower()
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
        "images":      images,
        "problem":     problem,
        "hypothese":   hypothese,
        "umsetzung":   umsetzung,
        "ergebnis":    ergebnis,
        "learnings":   learnings,
    }


def parse_thought(obj: dict, markdown: str) -> dict | None:
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None

    props = obj.get("properties", [])

    date_prop = get_prop(props, "created_date")
    date_str  = (date_prop.get("date") or "")[:10] or datetime.now().strftime("%Y-%m-%d")

    tag_prop = get_prop(props, "tag")
    tags = [t.get("name", "") for t in (tag_prop.get("multi_select") or []) if t.get("name")]

    excerpt    = clean_excerpt(markdown) or f"Ein Gedanke über {name}."
    word_count = len(markdown.split()) if markdown else 50
    read_time  = max(1, word_count // 200)

    return {
        "id":       slugify(name),
        "title":    name,
        "tags":     tags or ["Gedanke"],
        "date":     date_str,
        "readTime": read_time,
        "excerpt":  excerpt,
        "content":  markdown,
    }


def parse_infrastructure(obj: dict, markdown: str) -> dict | None:
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None

    props = obj.get("properties", [])

    date_prop = get_prop(props, "created_date")
    date_str  = (date_prop.get("date") or "")[:10] or datetime.now().strftime("%Y-%m-%d")

    tag_prop = get_prop(props, "tag")
    tags = [t.get("name", "") for t in (tag_prop.get("multi_select") or []) if t.get("name")]

    # Infrastruktur objects have no dedicated status property → default Aktiv
    status_map = {
        "Aktiv":      ("active",      "text-emerald-400", "Aktiv"),
        "In Arbeit":  ("in_progress", "text-amber-400",   "In Arbeit"),
        "Geplant":    ("planned",     "text-cyan-400",    "Geplant"),
        "Inaktiv":    ("inactive",    "text-gray-400",    "Inaktiv"),
        "Archiviert": ("archived",    "text-gray-400",    "Archiviert"),
    }
    status_prop = get_prop(props, "status")
    status_raw  = (status_prop.get("text") or status_prop.get("select", {}).get("name") or "Aktiv").strip()
    status, status_color, status_label = status_map.get(status_raw, status_map["Aktiv"])

    overview     = extract_section(markdown, "Überblick",   _INFRA_HEADINGS)
    stack        = extract_section(markdown, "Stack",       _INFRA_HEADINGS)
    architecture = extract_section(markdown, "Architektur", _INFRA_HEADINGS)
    setup        = extract_section(markdown, "Setup",       _INFRA_HEADINGS)
    costs        = extract_section(markdown, "Kosten",      _INFRA_HEADINGS)
    security     = extract_section(markdown, "Sicherheit",  _INFRA_HEADINGS)
    code         = extract_section(markdown, "Code",        _INFRA_HEADINGS)
    learnings    = extract_section(markdown, "Learnings",   _INFRA_HEADINGS)

    # Fallback: use full markdown as overview when no structured sections found
    if not overview and not stack:
        overview = markdown[:800] if markdown else f"Infrastruktur-Dokumentation: {name}"

    excerpt = clean_excerpt(overview or markdown) or f"Infrastruktur: {name}"

    # Auto-category
    combined = (name + " " + markdown).lower()
    if any(k in combined for k in ["backup", "restic", "storage", "minio", "s3"]):
        category = "Storage"
    elif any(k in combined for k in ["traefik", "nginx", "proxy", "vpn", "wireguard", "netzwerk", "network"]):
        category = "Networking"
    elif any(k in combined for k in ["docker", "container", "portainer", "compose"]):
        category = "Container"
    elif any(k in combined for k in ["fail2ban", "ufw", "firewall", "authelia", "sicherheit", "security"]):
        category = "Sicherheit"
    elif any(k in combined for k in ["github", "actions", "ci/cd", "pipeline", "deploy"]):
        category = "CI/CD"
    else:
        category = tags[0] if tags else "Infrastruktur"

    return {
        "id":           slugify(name),
        "anytype_id":   obj.get("id", ""),
        "title":        name,
        "category":     category,
        "tags":         tags or [category],
        "date":         date_str,
        "status":       status,
        "statusColor":  status_color,
        "statusLabel":  status_label,
        "excerpt":      excerpt,
        "overview":     overview,
        "stack":        stack,
        "architecture": architecture,
        "setup":        setup,
        "costs":        costs,
        "security":     security,
        "code":         code,
        "learnings":    learnings,
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
        "  images: string[];",
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
            f'    images: [{", ".join(json.dumps(u) for u in e.get("images", []))}],',
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


def gen_infrastructure_ts(items: list) -> str:
    lines = [
        "// AUTO-GENERATED by scripts/sync-anytype.py",
        f"// Last sync: {datetime.now().isoformat()}",
        "// DO NOT EDIT MANUALLY – edit in Anytype Schimmilab Space instead",
        "",
        "export interface InfraItem {",
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
        "  overview: string;",
        "  stack: string;",
        "  architecture: string;",
        "  setup: string;",
        "  costs: string;",
        "  security: string;",
        "  code: string;",
        "  learnings: string;",
        "}",
        "",
        "export const infraItems: InfraItem[] = [",
    ]
    for item in items:
        lines += [
            "  {",
            f'    id: "{escape_ts(item["id"])}",',
            f'    anytype_id: "{escape_ts(item["anytype_id"])}",',
            f'    title: `{escape_ts(item["title"])}`,',
            f'    category: `{escape_ts(item["category"])}`,',
            f'    tags: [{", ".join(json.dumps(t) for t in item["tags"])}],',
            f'    date: "{item["date"]}",',
            f'    status: "{item["status"]}",',
            f'    statusColor: "{item["statusColor"]}",',
            f'    statusLabel: "{item["statusLabel"]}",',
            f'    excerpt: `{escape_ts(item["excerpt"])}`,',
            f'    overview: `{escape_ts(item["overview"])}`,',
            f'    stack: `{escape_ts(item["stack"])}`,',
            f'    architecture: `{escape_ts(item["architecture"])}`,',
            f'    setup: `{escape_ts(item["setup"])}`,',
            f'    costs: `{escape_ts(item["costs"])}`,',
            f'    security: `{escape_ts(item["security"])}`,',
            f'    code: `{escape_ts(item["code"])}`,',
            f'    learnings: `{escape_ts(item["learnings"])}`,',
            "  },",
        ]
    lines += [
        "];",
        "",
        "export const getInfraItemById = (id: string): InfraItem | undefined =>",
        "  infraItems.find((i) => i.id === id);",
        "",
        "export const getInfraItemsByCategory = (category: string): InfraItem[] =>",
        "  infraItems.filter((i) => i.category === category);",
        "",
    ]
    return "\n".join(lines)

# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    missing = [v for v, val in [("ANYTYPE_API_TOKEN", API_TOKEN), ("ANYTYPE_API_BASE_URL", API_BASE), ("ANYTYPE_SPACE_ID", SPACE_ID)] if not val]
    if missing:
        print(f"ERROR: missing required environment variables: {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)

    print(f"🔄 Anytype Sync gestartet: {datetime.now().isoformat()}")
    print(f"   API: {API_BASE}")
    print(f"   Space: {SPACE_ID[:40]}...")

    # 1. Search all objects to get type info and IDs
    resp = requests.post(
        f"{API_BASE}/v1/spaces/{SPACE_ID}/search",
        headers=HEADERS,
        json={"query": "", "limit": 200},
        timeout=30,
    )
    resp.raise_for_status()
    objects = resp.json().get("data", [])
    print(f"📦 {len(objects)} Objekte gefunden")

    experiments, thoughts, infra_items = [], [], []

    for obj in objects:
        type_name = obj.get("type", {}).get("name", "")
        type_key  = obj.get("type", {}).get("key", "")
        obj_id    = obj.get("id", "")
        obj_name  = obj.get("name", "").strip()

        if type_name == "Experimente" or type_key == "experimente":
            # Fetch full Markdown for complete section extraction
            print(f"  🔬 Lade Experiment: {obj_name[:50]}")
            markdown = fetch_object_markdown(obj_id)
            exp = parse_experiment(obj, markdown)
            if exp:
                experiments.append(exp)

        elif type_name == "Gedankenraum" or type_key == "gedankenraum":
            print(f"  🧠 Lade Gedanke: {obj_name[:50]}")
            markdown = fetch_object_markdown(obj_id)
            thought = parse_thought(obj, markdown)
            if thought:
                thoughts.append(thought)

        elif type_name == "Infrastruktur" or type_key == "infrastruktur":
            print(f"  🖥️  Lade Infrastruktur: {obj_name[:50]}")
            markdown = fetch_object_markdown(obj_id)
            item = parse_infrastructure(obj, markdown)
            if item:
                infra_items.append(item)

    # Sort newest first
    experiments.sort(key=lambda x: x["date"], reverse=True)
    thoughts.sort(key=lambda x: x["date"], reverse=True)
    infra_items.sort(key=lambda x: x["date"], reverse=True)

    # Write files
    EXPERIMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    EXPERIMENTS_FILE.write_text(gen_experiments_ts(experiments), encoding="utf-8")
    print(f"\n✅ {len(experiments)} Experimente → {EXPERIMENTS_FILE}")

    THOUGHTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    THOUGHTS_FILE.write_text(gen_thoughts_ts(thoughts), encoding="utf-8")
    print(f"✅ {len(thoughts)} Gedanken → {THOUGHTS_FILE}")

    INFRASTRUCTURE_FILE.parent.mkdir(parents=True, exist_ok=True)
    INFRASTRUCTURE_FILE.write_text(gen_infrastructure_ts(infra_items), encoding="utf-8")
    print(f"✅ {len(infra_items)} Infrastruktur-Items → {INFRASTRUCTURE_FILE}")

    SITEMAP_FILE.parent.mkdir(parents=True, exist_ok=True)
    SITEMAP_FILE.write_text(gen_sitemap(experiments, thoughts), encoding="utf-8")
    print(f"✅ Sitemap → {SITEMAP_FILE}")

    print("\n🚀 Sync abgeschlossen!")

def gen_sitemap(experiments: list, thoughts: list) -> str:
    static_pages = [
        ("", "weekly", "1.0"),
        ("/experimente", "weekly", "0.9"),
        ("/gedankenraum", "weekly", "0.8"),
        ("/infrastruktur", "monthly", "0.7"),
        ("/medien", "monthly", "0.6"),
        ("/impressum", "yearly", "0.2"),
        ("/datenschutz", "yearly", "0.2"),
    ]

    urls = []
    for path, changefreq, priority in static_pages:
        urls.append(f"""  <url>
    <loc>{BASE_URL}{path}/</loc>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    for exp in experiments:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/experimente/{exp["id"]}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""")

    for thought in thoughts:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/gedankenraum/{thought["id"]}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>""")

    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!-- AUTO-GENERATED by scripts/sync-anytype.py on {now} -->
<!-- DO NOT EDIT MANUALLY -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

{chr(10).join(urls)}

</urlset>
"""

if __name__ == "__main__":
    main()
