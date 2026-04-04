---
name: schimmilab-anytype
description: Erstelle und verwalte Einträge im Schimmilab AnyType Space (Experimente, Infrastruktur, Gedankenraum), der als Frontend für schimmilab.de dient.
---

# Schimmilab AnyType Skill

Dieser Skill hilft dir, Inhalte für schimmilab.de direkt in AnyType zu erstellen und zu verwalten.
AnyType ist das Content-Frontend für schimmilab.de — Einträge erscheinen automatisch auf der Website.

## Kontext

- **Website:** https://schimmilab.de — "Experimente zwischen Code, KI und Erkenntnis"
- **AnyType Space:** Schimmilab
- **Space ID:** `ANYTYPE_SPACE_ID_REDACTED`

## Inhaltstypen & deren AnyType-Keys

### Experimente (`experimente`)
Dokumentierte technische oder kreative Versuche (DevOps, KI, Self-Hosting, Bastelprojekte).

**Properties:**
- `kategorie` — **⚠️ API-Bug: kann nicht via MCP gesetzt werden** (intern `select`/Status-Typ, vom API fälschlich als `text` gemeldet, aber bei jedem Schreibversuch abgelehnt). Muss manuell in der AnyType-App gesetzt werden. Werte: "KI", "DevOps", "Self-Hosting", "Hardware", "Bewusstsein"
- `experiment_status` — **⚠️ API-Bug: gleiche Einschränkung wie `kategorie`**. Manuell setzen. Gültige Werte (exakte Schreibweise beachten):
  - `"Laufend"` → amber, laufendes Experiment
  - `"In Arbeit"` → amber, in Bearbeitung
  - `"Abgeschlossen"` → grün, fertig
  - `"Geplant"` → cyan, noch nicht gestartet
  - `"Archiviert"` → grau, nicht mehr aktiv
  - Fallback wenn leer oder unbekannter Wert: `"Abgeschlossen"`
- `tag` (multi_select) — **funktioniert via API**; nutze dies für Klassifikation

**Workaround:** Da `kategorie` und `experiment_status` nicht via API setzbar sind, nutze `tag` für Klassifikation. Vordefinierte Tag-IDs für das `tag`-Feld des `experimente`-Typs:

> **HINWEIS FÜR ZUKÜNFTIGE NUTZUNG:** Falls der AnyType MCP-Bug behoben wird, sind `kategorie` und `experiment_status` Select-Properties (Property-IDs: `bafyreif6gi5gheqeuj2kar6fogga34hysnufxwwg5zmritfzxmea2im5by` bzw. `bafyreicjq36biho7rwa5q5midkfiwsm2xpeay3ygnjxovgnbhymsz5wrbi`) und deren Tags wurden bereits angelegt.

**Struktur eines Experiment-Eintrags** (diese Headings EXAKT so verwenden — der Parser matcht auf diese Schlüsselwörter):
```markdown
## 🎯 Problem
[Das Problem oder die Frage, die das Experiment adressiert]

## 💡 Hypothese
[Annahme/Ansatz vor der Umsetzung; ggf. benötigte Voraussetzungen & Tools]

## ⚙️ Umsetzung
[Durchführung, Schritte, Architektur, Beobachtungen]

## Ergebnis
[Was hat funktioniert, was nicht? Messbares Ergebnis]

## 🧠 Learnings
[Key Takeaways, nächste Schritte]
```

> ⚠️ **Wichtig:** Die Headings müssen die Wörter `Problem`, `Hypothese`, `Umsetzung`, `Ergebnis` und `Learnings` enthalten (Groß/Kleinschreibung egal). Der Sync-Parser extrahiert Seitenabschnitte anhand dieser Schlüsselwörter. Abweichende Headings (z.B. "Was ist das Ziel?", "Durchführung") werden nicht erkannt.

---

### Infrastruktur (`infrastruktur`)
Dokumentation der selbst gehosteten Dienste, Server, Netzwerke und Setups.

**Properties:**
- `tag` (multi_select) — z.B. "Docker", "Proxmox", "Homelab", "Netzwerk", "Monitoring"

**Struktur eines Infrastruktur-Eintrags** (Headings müssen die Schlüsselwörter `Überblick`, `Stack`, `Architektur`, `Setup`, `Kosten`, `Sicherheit`, `Code`, `Learnings` enthalten — nicht alle sind Pflicht):
```markdown
## Überblick
[Was macht diese Komponente? Wozu dient sie?]

## Stack
[Technologien, verwendete Software, Versionen]

## Architektur
[Zusammenspiel der Komponenten, Datenfluss, Abhängigkeiten]

## Setup
[Installation, Konfiguration, Befehle]

## Kosten
[Ressourcenverbrauch, Lizenzkosten, Hosting-Kosten]

## Sicherheit
[Zugriffsschutz, Netzwerk-Isolation, Zertifikate]

## Code
[Wichtige Konfigurationsdateien, Skripte, Snippets]

## Learnings
[Erkenntnisse, bekannte Probleme, Optimierungspotenzial]
```

> ⚠️ **Wichtig:** Nicht alle Sektionen müssen befüllt sein — leere Abschnitte werden beim Sync einfach übersprungen. Mindestens `Überblick` und `Setup` sind empfohlen.

---

### Gedankenraum (`gedankenraum`)
Reflexionen, Ideen, Essays und Bewusstseins-Experimente.

**Properties:**
- `tag` (multi_select) — z.B. "Philosophie", "KI", "Bewusstsein", "Reflexion", "Idee"

**Struktur eines Gedankenraum-Eintrags:**
```markdown
## Der Gedanke
[Kernidee, Fragestellung]

## Hintergrund
[Kontext, Ausgangspunkt]

## Ausführung
[Ausführliche Betrachtung]

## Offene Fragen
[Was bleibt unklar, was soll weiter erkundet werden?]
```

---

## Anweisungen

Wenn der User einen neuen Eintrag für schimmilab.de erstellen möchte:

1. **Typ bestimmen:** Erkenne aus dem Kontext oder frage, ob es ein Experiment, eine Infrastruktur-Doku oder ein Gedanke ist.
2. **Inhalt strukturieren:** Nutze die passende Struktur (siehe oben) und befülle sie mit den Angaben des Users. Ergänze fehlende Abschnitte sinnvoll.
3. **Properties ableiten:** Leite `kategorie`, `experiment_status` und `tag` aus dem Inhalt ab, wenn der User sie nicht explizit nennt.
4. **Objekt in AnyType erstellen** via `mcp__anytype__API-create-object` mit:
   - `space_id`: `ANYTYPE_SPACE_ID_REDACTED`
   - `type_key`: `experimente` | `infrastruktur` | `gedankenraum`
   - `name`: Titel des Eintrags
   - `body`: Strukturierter Markdown-Inhalt (ohne H1-Titel, der steht im `name`)
   - `properties`: Passende Properties (kategorie, experiment_status, tag)
   - `icon`: Passendes Emoji je Typ — Experimente: `{"format":"emoji","emoji":"🔧"}`, Infrastruktur: `{"format":"emoji","emoji":"☁️"}`, Gedankenraum: `{"format":"emoji","emoji":"💭"}`
5. **Bestätigung geben:** Nach Erstellung Titel und Typ des erstellten Objekts nennen.

Wenn der User einen bestehenden Eintrag aktualisieren möchte:
1. Mit `mcp__anytype__API-search-space` den Eintrag suchen.
2. Mit `mcp__anytype__API-update-object` aktualisieren (gleiche `space_id`).

## Wann diesen Skill verwenden

- "Erstelle ein neues Experiment über ..."
- "Dokumentiere meine Infrastruktur für ..."
- "Ich habe einen Gedanken zu ..."
- "Füge zu schimmilab hinzu: ..."
- "Neuer Eintrag für schimmilab: ..."
- "Schreib das in meinen Gedankenraum: ..."
- "Aktualisiere meinen schimmilab Eintrag ..."
