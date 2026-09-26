---
name: schimmilab-anytype
description: >-
  Anytype-Referenz für schimmilab.de-Inhaltstypen (Infrastruktur, Gedankenraum) — Typen, Struktur-Headings des Sync-Parsers, Properties. Für EXPERIMENT-Artikel stattdessen schimmilab-experiment.
---

# Schimmilab AnyType Skill

> **Scope (Stand 2026-07-10):** Für **Experiment-Artikel** den umfassenderen Skill **`schimmilab-experiment`** nutzen (deckt Anytype-Eintrag **plus** Pflicht-Header-Bild, Sync und Live-Verifikation ab). Dieser Skill bleibt die **Referenz für `infrastruktur` + `gedankenraum`** und für die generischen Anytype-Struktur-Vorgaben. **Header-Bild-Pipeline** (auch Infra/Gedankenraum brauchen ein `<slug>.webp`): siehe `schimmilab-experiment/workflow.md`.

Dieser Skill hilft dir, Inhalte für schimmilab.de direkt in AnyType zu erstellen und zu verwalten.
AnyType ist das Content-Frontend für schimmilab.de — Einträge erscheinen automatisch auf der Website.

## Kontext

- **Website:** https://schimmilab.de — "Experimente zwischen Code, KI und Erkenntnis"
- **AnyType Space:** Schimmilab
- **Space ID:** siehe `ANYTYPE_SPACE_ID` in den GitHub Secrets / lokalen Umgebungsvariablen

## Inhaltstypen & deren AnyType-Keys

### Experimente (`experimente`)
Dokumentierte technische oder kreative Versuche (DevOps, KI, Self-Hosting, Bastelprojekte).

**Properties:**
- `kategorie` — **⚠️ API-Bug: kann nicht via MCP gesetzt werden** (intern `select`/Status-Typ, vom API fälschlich als `text` gemeldet, aber bei jedem Schreibversuch abgelehnt). Muss manuell in der AnyType-App gesetzt werden. Werte: "KI", "DevOps", "Self-Hosting", "Hardware", "Bewusstsein"
- `experiment_status` — **⚠️ API-Bug: gleiche Einschränkung wie `kategorie`**. Manuell in der Anytype-App setzen. Gültige Optionen (Stand 2026-07-10, **live aus Anytype verifiziert** — die früher hier gelisteten „In Arbeit/Geplant/Archiviert" existieren nicht):
  - `abgeschlossen` → lime, fertig
  - `laufend` → gelb, in Arbeit
  - `idee` → ice, noch nicht gestartet
  - `abgebrochen` → rot, verworfen
  - Fallback wenn leer/unbekannt: `abgeschlossen`
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

## ⛔⛔ Die Anytype-Suche taugt NICHT als Existenzbeweis (am Ist gemessen 2026-09-18)

**Gilt fuer `API-search-space` UND `API-search-global` — beide getrennt gemessen, identisches Verhalten.**

| Suchstring | Treffer |
|---|---|
| `Der Fehler` | ✅ 1 |
| `Fehler, den ich nicht sehen konnte` | ✅ 1 |
| `Fehler den ich nicht sehen konnte` — **nur das Komma fehlt** | ⛔ **0** |
| `TalkBack` — steht vielfach im **Body** des Objekts | ⛔ **0** |

🎯 **Zwei Eigenschaften, die beide nirgends dokumentiert sind:**
1. **Exakte Substring-Suche** — ein fehlendes Satzzeichen killt den Treffer. Titel mit Komma, Doppelpunkt oder Gedankenstrich sind die Regel, nicht die Ausnahme.
2. **Der Body wird NICHT durchsucht** — obwohl die Tool-Beschreibung *„within object names and content"* verspricht.

⛔ **Anlass war ein echter Schaden:** Ein seit zwei Tagen veroeffentlichter Artikel galt aufgrund eines solchen Nullbefunds als nicht vorhanden; ich habe Schimmi auf dieser Grundlage widersprochen und lag falsch.

⚠️ **Und die naheliegende Fehldiagnose steht hier als Warnung, weil sie beinahe als Befund in den Vault gewandert waere:** *„der Suchindex haengt"* — sie passte zu allen Beobachtungen (die Positivkontrolle `KI OS` lieferte nur Juli-Objekte) und war trotzdem falsch. **Eine Positivkontrolle muss aus derselben KLASSE stammen wie das Gesuchte: ein kurzer Suchstring prueft nicht, ob ein langer funktioniert.**

### ✅ Was stattdessen zu tun ist

**Vor JEDEM `API-create-object` pruefen, ob der Eintrag schon existiert** — sonst entsteht ein Duplikat, und das faellt erst auf der Website auf.

```bash
# schimmilab-Inhalte: die generierte Datenquelle im Repo ist die verlaessliche Quelle
gh api repos/Schimmilab/schimmilab_webpage/contents/client/src/data/experiments.ts --jq .content \
  | base64 -d | grep -c 'id: "<slug>"'     # > 0 => existiert schon
# analog: thoughts.ts (gedankenraum) · infrastructure.ts (infrastruktur)
```

- Existiert der Eintrag: **`API-update-object` auf die `anytype_id`** aus der `*.ts`-Datei — **nicht** `create`.
- Ohne Repo-Bezug: **`API-list-objects`** statt `search`, oder nur mit **kurzen, satzzeichenfreien** Namensfragmenten suchen.
- ⛔ **Ein leeres Suchergebnis nie als „gibt es nicht" lesen.** Es heisst nur: dieser Substring steht so nicht im Namen.

⛔ **Nicht versuchen, die Suche zu reparieren** — fremder Code. Dokumentiert reicht.

➡️ Loop: `03-strategy/open-loops.md` · Lehre: `CLAUDE-lernprotokoll.md` (2026-09-18) · gleicher Warnblock in `schimmilab-experiment/workflow.md`.

## Anweisungen

Wenn der User einen neuen Eintrag für schimmilab.de erstellen möchte:

1. **Typ bestimmen:** Erkenne aus dem Kontext oder frage, ob es ein Experiment, eine Infrastruktur-Doku oder ein Gedanke ist.
2. **Inhalt strukturieren:** Nutze die passende Struktur (siehe oben) und befülle sie mit den Angaben des Users. Ergänze fehlende Abschnitte sinnvoll.
3. **Properties ableiten:** Leite `kategorie`, `experiment_status` und `tag` aus dem Inhalt ab, wenn der User sie nicht explizit nennt.
3b. ⛔ **Existenzpruefung vor dem Anlegen** — siehe Warnblock oben. Ein Duplikat faellt erst auf der Website auf.
4. **Objekt in AnyType erstellen** via `mcp__anytype__API-create-object` mit:
   - `space_id`: Wert aus `ANYTYPE_SPACE_ID` (GitHub Secret / lokale Env-Variable)
   - `type_key`: `experimente` | `infrastruktur` | `gedankenraum`
   - `name`: Titel des Eintrags
   - `body`: Strukturierter Markdown-Inhalt (ohne H1-Titel, der steht im `name`)
   - `properties`: Passende Properties (kategorie, experiment_status, tag)
   - `icon`: Passendes Emoji je Typ — Experimente: `{"format":"emoji","emoji":"🔧"}`, Infrastruktur: `{"format":"emoji","emoji":"☁️"}`, Gedankenraum: `{"format":"emoji","emoji":"💭"}`
5. **Bestätigung geben:** Nach Erstellung Titel und Typ des erstellten Objekts nennen.

Wenn der User einen bestehenden Eintrag aktualisieren möchte:
1. ⛔ **NICHT blind `API-search-space` vertrauen** (siehe Warnblock oben — exakte Substring-Suche ueber den Namen, Body wird nicht durchsucht). Ein Nullbefund ist **kein** Beleg, dass der Eintrag fehlt.
2. Verlaesslich: `anytype_id` aus der generierten `*.ts`-Datei im Repo lesen, sonst `API-list-objects`.
3. Mit `mcp__anytype__API-update-object` aktualisieren (gleiche `space_id`).

## Wann diesen Skill verwenden

- "Erstelle ein neues Experiment über ..."
- "Dokumentiere meine Infrastruktur für ..."
- "Ich habe einen Gedanken zu ..."
- "Füge zu schimmilab hinzu: ..."
- "Neuer Eintrag für schimmilab: ..."
- "Schreib das in meinen Gedankenraum: ..."
- "Aktualisiere meinen schimmilab Eintrag ..."
