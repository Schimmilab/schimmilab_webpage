#!/usr/bin/env python3
"""
Sync Anytype Schimmilab Space → client/src/data/experiments.ts
 
This script reads all Page objects from the Anytype Schimmilab Space,
parses their markdown content (Problem/Hypothese/Umsetzung/Ergebnis/Learnings),
and writes them to the experiments.ts data file.

Usage:
  python3 scripts/sync-anytype.py

Environment variables (required):
  ANYTYPE_API_URL   - Base URL of the Anytype REST API
  ANYTYPE_API_TOKEN - Bearer token for authentication
"""
import subprocess
import json
import os
import sys
import time
import select
import re
from pathlib import Path
from datetime import datetime

# Configuration
ANYTYPE_API_URL = os.environ.get("ANYTYPE_API_URL", "https://anytype-api.schimmi-n8n.de")
ANYTYPE_API_TOKEN = os.environ.get("ANYTYPE_API_TOKEN", "")
SPACE_ID = os.environ.get("ANYTYPE_SPACE_ID", "ANYTYPE_SPACE_ID_REDACTED")
OUTPUT_FILE = Path(__file__).parent.parent / "client" / "src" / "data" / "experiments.ts"

if not ANYTYPE_API_TOKEN:
    print("ERROR: ANYTYPE_API_TOKEN environment variable not set", file=sys.stderr)
    sys.exit(1)

# --- MCP Client ---

def start_mcp():
    env = os.environ.copy()
    env["ANYTYPE_API_BASE_URL"] = ANYTYPE_API_URL
    env["OPENAPI_MCP_HEADERS"] = json.dumps({
        "Authorization": f"Bearer {ANYTYPE_API_TOKEN}",
        "Anytype-Version": "2025-11-08"
    })
    proc = subprocess.Popen(
        ["npx", "-y", "@anyproto/anytype-mcp"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env
    )
    return proc

msg_counter = [1]

def send_msg(proc, msg):
    data = (json.dumps(msg) + "\n").encode()
    proc.stdin.write(data)
    proc.stdin.flush()

def read_until(proc, target_id, timeout=15):
    deadline = time.time() + timeout
    while time.time() < deadline:
        r, _, _ = select.select([proc.stdout], [], [], 0.5)
        if r:
            line = proc.stdout.readline()
            if line:
                try:
                    resp = json.loads(line.decode())
                    if resp.get("id") == target_id:
                        content = resp.get("result", {}).get("content", [])
                        for c in content:
                            if c.get("type") == "text":
                                try:
                                    return json.loads(c["text"])
                                except:
                                    return c["text"]
                        if resp.get("error"):
                            return {"error": resp["error"]}
                except:
                    pass
    return None

def call_tool(proc, tool_name, args):
    mid = msg_counter[0]
    msg_counter[0] += 1
    send_msg(proc, {
        "jsonrpc": "2.0",
        "id": mid,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": args}
    })
    return read_until(proc, mid)

def init_mcp(proc):
    send_msg(proc, {
        "jsonrpc": "2.0",
        "id": 0,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "schimmilab-sync", "version": "1.0"}
        }
    })
    time.sleep(1)
    send_msg(proc, {"jsonrpc": "2.0", "method": "notifications/initialized"})
    time.sleep(0.5)

# --- Markdown Parser ---

def extract_section(markdown: str, heading: str) -> str:
    """Extract content under a specific heading from markdown."""
    # Match heading variants: ## Problem, ## 🎯 Problem, ## Problem, etc.
    pattern = rf'##[^#]*{re.escape(heading)}[^\n]*\n(.*?)(?=\n##|\Z)'
    match = re.search(pattern, markdown, re.DOTALL | re.IGNORECASE)
    if match:
        content = match.group(1).strip()
        # Remove italic placeholders
        content = re.sub(r'^\*[^*]+\*$', '', content, flags=re.MULTILINE).strip()
        return content
    return ""

def parse_experiment(obj: dict) -> dict | None:
    """Parse an Anytype object into an experiment data structure."""
    name = obj.get("name", "").strip()
    if not name or name == "Try more with Anytype":
        return None
    
    markdown = obj.get("markdown", "") or obj.get("snippet", "")
    obj_id = obj.get("id", "")
    
    # Generate a slug from the name
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    
    # Extract sections
    problem = extract_section(markdown, "Problem")
    hypothese = extract_section(markdown, "Hypothese")
    umsetzung = extract_section(markdown, "Umsetzung")
    ergebnis = extract_section(markdown, "Ergebnis")
    learnings = extract_section(markdown, "Learnings")
    
    # Get tags from properties
    tags = []
    for prop in obj.get("properties", []):
        if prop.get("key") == "tag" and prop.get("tags"):
            tags = [t.get("name", "") for t in prop.get("tags", [])]
    
    # Get creation date
    created_date = ""
    for prop in obj.get("properties", []):
        if prop.get("key") == "created_date" and prop.get("date"):
            created_date = prop["date"][:10]  # YYYY-MM-DD
    
    if not created_date:
        created_date = datetime.now().strftime("%Y-%m-%d")
    
    # Determine category from tags or content
    category = "Experiment"
    content_lower = (name + " " + markdown).lower()
    if any(k in content_lower for k in ["docker", "traefik", "hetzner", "server", "infrastruktur", "hosting"]):
        category = "Infrastruktur"
    elif any(k in content_lower for k in ["ki", "ai", "mcp", "llm", "gpt", "claude", "n8n"]):
        category = "KI & ML"
    elif any(k in content_lower for k in ["devops", "jenkins", "github", "ci/cd", "pipeline"]):
        category = "DevOps"
    elif any(k in content_lower for k in ["3d", "druck", "elektronik", "hardware", "arduino", "raspberry"]):
        category = "Hardware"
    
    # Derive excerpt from problem or snippet
    excerpt_text = problem or obj.get("snippet", "") or f"Dokumentation für: {name}"
    excerpt = re.sub(r'[#*`]', '', excerpt_text)[:180].strip()
    
    # Status color mapping
    status_map = {
        "Abgeschlossen": {"color": "emerald", "label": "Abgeschlossen"},
        "In Arbeit": {"color": "amber", "label": "In Arbeit"},
        "Hypothese": {"color": "blue", "label": "Hypothese"},
        "Archiviert": {"color": "gray", "label": "Archiviert"},
    }
    status_info = status_map.get("Abgeschlossen", {"color": "emerald", "label": "Abgeschlossen"})
    
    return {
        "id": slug,
        "anytype_id": obj_id,
        "title": name,
        "category": category,
        "tags": tags if tags else [category],
        "date": created_date,
        "status": "Abgeschlossen",
        "statusColor": status_info["color"],
        "statusLabel": status_info["label"],
        "excerpt": excerpt,
        "problem": problem or f"Dokumentation für: {name}",
        "hypothese": hypothese or "",
        "umsetzung": umsetzung or "",
        "ergebnis": ergebnis or "",
        "learnings": learnings or "",
        "summary": obj.get("snippet", "")[:200] if not problem else problem[:200],
    }

# --- TypeScript Generator ---

def escape_ts_string(s: str) -> str:
    """Escape a string for use in TypeScript template literals."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def generate_ts(experiments: list) -> str:
    """Generate the experiments.ts file content."""
    lines = [
        "// AUTO-GENERATED by scripts/sync-anytype.py",
        f"// Last sync: {datetime.now().isoformat()}",
        "// DO NOT EDIT MANUALLY - Edit in Anytype Schimmilab Space instead",
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
        "  summary: string;",
        "  problem: string;",
        "  hypothese: string;",
        "  umsetzung: string;",
        "  ergebnis: string;",
        "  learnings: string;",
        "}",
        "",
        "export const experiments: Experiment[] = [",
    ]
    
    for exp in experiments:
        lines.append("  {")
        lines.append(f"    id: {json.dumps(exp['id'])},")
        if exp.get('anytype_id'):
            lines.append(f"    anytype_id: {json.dumps(exp['anytype_id'])},")
        lines.append(f"    title: {json.dumps(exp['title'])},")
        lines.append(f"    category: {json.dumps(exp['category'])},")
        lines.append(f"    tags: {json.dumps(exp['tags'])},")
        lines.append(f"    date: {json.dumps(exp['date'])},")
        lines.append(f"    status: {json.dumps(exp['status'])},")
        lines.append(f"    statusColor: {json.dumps(exp.get('statusColor', 'emerald'))},")
        lines.append(f"    statusLabel: {json.dumps(exp.get('statusLabel', 'Abgeschlossen'))},")
        lines.append(f"    excerpt: `{escape_ts_string(exp.get('excerpt', ''))}`,")
        lines.append(f"    summary: `{escape_ts_string(exp['summary'])}`,")
        lines.append(f"    problem: `{escape_ts_string(exp['problem'])}`,")
        lines.append(f"    hypothese: `{escape_ts_string(exp['hypothese'])}`,")
        lines.append(f"    umsetzung: `{escape_ts_string(exp['umsetzung'])}`,")
        lines.append(f"    ergebnis: `{escape_ts_string(exp['ergebnis'])}`,")
        lines.append(f"    learnings: `{escape_ts_string(exp['learnings'])}`,")
        lines.append("  },")
    
    lines.append("];")
    lines.append("")
    lines.append("export const getExperimentById = (id: string): Experiment | undefined =>")
    lines.append("  experiments.find((e) => e.id === id);")
    lines.append("")
    lines.append("export const getExperimentsByCategory = (category: string): Experiment[] =>")
    lines.append("  experiments.filter((e) => e.category === category);")
    lines.append("")
    
    return "\n".join(lines)

# --- Main ---

def main():
    print(f"🔄 Anytype Sync gestartet: {datetime.now().isoformat()}")
    print(f"   API: {ANYTYPE_API_URL}")
    print(f"   Space: {SPACE_ID}")
    print(f"   Output: {OUTPUT_FILE}")
    
    # Start MCP
    print("\n📡 Verbinde mit Anytype MCP Server...")
    proc = start_mcp()
    init_mcp(proc)
    print("   ✅ Verbunden")
    
    # Fetch all objects
    print("\n📥 Lade Objekte aus Schimmilab Space...")
    result = call_tool(proc, "API-list-objects", {
        "space_id": SPACE_ID,
        "limit": 100
    })
    
    if not result or "data" not in result:
        print(f"   ❌ Fehler beim Laden: {result}")
        proc.terminate()
        sys.exit(1)
    
    objects = result["data"]
    total = result.get("pagination", {}).get("total", 0)
    print(f"   ✅ {total} Objekte gefunden")
    
    # For each object, fetch full content
    experiments = []
    for obj in objects:
        name = obj.get("name", "")
        obj_id = obj.get("id", "")
        
        # Skip system objects
        if name in ["Try more with Anytype", ""]:
            continue
        
        print(f"   📄 Lade: {name}")
        
        # Get full object with markdown
        full_obj = call_tool(proc, "API-get-object", {
            "space_id": SPACE_ID,
            "object_id": obj_id
        })
        
        if full_obj and isinstance(full_obj, dict):
            # Merge snippet from list with full markdown from get
            obj_data = full_obj.get("object", full_obj)
            obj_data["snippet"] = obj.get("snippet", "")
            exp = parse_experiment(obj_data)
            if exp:
                experiments.append(exp)
                print(f"      ✅ Geparst: {exp['category']} / {exp['id']}")
        
        time.sleep(0.2)  # Rate limiting
    
    proc.terminate()
    
    if not experiments:
        print("\n⚠️  Keine Experimente gefunden. Behalte bestehende experiments.ts.")
        sys.exit(0)
    
    print(f"\n✍️  Schreibe {len(experiments)} Experimente nach {OUTPUT_FILE}...")
    ts_content = generate_ts(experiments)
    OUTPUT_FILE.write_text(ts_content, encoding="utf-8")
    print(f"   ✅ Fertig!")
    
    print(f"\n📊 Zusammenfassung:")
    for exp in experiments:
        print(f"   - [{exp['category']}] {exp['title']} ({exp['date']})")
    
    print(f"\n✅ Sync abgeschlossen: {len(experiments)} Experimente synchronisiert")

if __name__ == "__main__":
    main()
