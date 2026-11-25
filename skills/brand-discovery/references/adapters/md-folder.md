# Storage Adapter: Markdown Folder
*Part of `brand-discovery`, loaded when the resolved storage is `md-folder`*

Implements the Brand OS storage contract on a plain local folder, the **zero-dependency default**: no MCP, no external account, works in any agent environment with file access, and is the graceful fallback whenever another backend can't be reached or granted. Also the most agent-native backend: everything is markdown the host agent can read directly.

**Locator:** `path` — always `brand/` at the root of the brand's project folder (workspace root if no projects are defined). The path is still recorded in the config entry because multi-brand workspaces resolve each brand's folder through it. Tools: the host environment's file read/write/list.

---

## Space layout

```
brand/                                  ← path (always brand/ in the project folder)
├── 11_purpose-vision-mission.md
├── 12_brand-values.md
├── 21_ideal-customer-profiles.md
├── 22_competitive-landscape.md
├── 23_brand-positioning.md
├── 31_brand-personality.md
├── 32_visual-identity.md
├── 41_brand-story.md
├── 42_voice-tone-guide.md
├── 43_messaging-pillars.md
├── 44_taglines.md
└── documents/                          ← default write target
```

The dimension files live directly in the brand folder: no extra nesting. One file per dimension; the Order-number filename prefix makes lexical sort equal framework order. Each file carries YAML frontmatter, the normative status home:

```yaml
---
dimension: Purpose, Vision & Mission
order: 11
section: Foundations
status: not-started        # not-started | in-progress | complete
---
```

Frontmatter spellings map to the canonical values (`Not started, In progress, Complete`) at the contract surface. Per-file status means there is no index file to drift; 11 local reads are effectively free.

There is deliberately **no `BRND-N` prefix** in the frontmatter. The prefix is a Notion property that helps categorize rows in that UI; here, dimensions are addressed by Order number and name, and the filename's Order prefix already gives a stable sort. If a display ID is ever wanted it is derived from `order`, not stored: its absence is intended, not a gap to fill.

---

## Operations

### `verify-space`
List the brand folder: all 11 dimension files present with parseable frontmatter. `documents/` is **not** required to exist: it is created on the first `write-document`, so its absence means "no documents yet," not "malformed space." (An empty directory doesn't survive git or zip, so requiring one would make a version-controlled brand fail its own verification.) Report any missing dimension files without repairing.

### `list-dimensions`
Glob `[path]/[0-9][0-9]_*.md`; read each file's frontmatter. Return the 11 entries as the status map, sorted by `order`. The two-digit prefix is what marks a dimension: the brand folder also holds the brand's identity files (`README.md`, `DESIGN.md` and others), and no operation here reads them. **Run the contract's integrity assertions on the entries before returning.**

Here the ordering home is structurally guaranteed twice over (the filename's Order prefix and the `order:` frontmatter), so the assertions are near-free and mostly serve as a cross-check: a filename whose prefix disagrees with its own frontmatter is the drift this backend actually produces, usually from a hand-renamed or hand-copied file.

### `read-dimension`
Read the file (body below frontmatter).

### `write-dimension`
Write the file body below the frontmatter, filling content under the existing heading skeleton. Never create, delete, or rename dimension files; never edit `dimension`, `order`, or `section` in frontmatter.

### `set-status`
Update the `status:` frontmatter key: `in-progress` when the interview begins, `complete` when confirmed content is written.

### `write-document`
Create `documents/` if it doesn't exist yet (first write only), then write `documents/YYMMDD_[slug].md` with frontmatter:

```yaml
---
title: …
category: …               # Strategy | Report | Reference | …
tags: […]
date: YYYY-MM-DD
---
```

### `list-documents`
Glob `documents/*.md`; read frontmatter for titles and categories.

---

## Rendering

Everything is plain markdown:

| Element | Rendering |
|---|---|
| heading | `#` / `##` / `###` |
| field | blockquote with the template string (`> [Brand] exists to ___`) |
| table | pipe table |
| callout | blockquote with bold label: `> **[Label]** — …` |
| toggle | plain trailing `## How to use this page` section |
| quote | blockquote |
| parallel blocks | stacked sequentially, one `###` block per pillar |
| external embed | a labeled markdown link |

---

## Backend notes

- **Scaffolding** (Storage Architect `scaffold` mission): create `brand/` at the root of the brand's project folder, copy the 11 skeletons from `../../assets/dimensions/` directly into it (they ship md-native). Do **not** create an empty `documents/` — it's made on the first `write-document` (an empty dir doesn't survive git or zip anyway). Seconds, no permissions, no network.
- **Discovery:** check the brand's project folder for `brand/` matching this layout.
- **Shared home:** the brand library that `brand-library` assembles (`DESIGN.md`, tokens, assets) lives in this same `brand/` folder: one home for everything the brand is.
- **As the universal fallback:** when a user declines or can't grant an MCP, this backend starts immediately, and the architect's `migrate` mission moves the brand to Notion later with nothing lost (or to Google Docs, once that adapter is unparked).
- **Chat-only runtimes** (no file tools at all): the contract's unreachable-backend rule applies: paste blocks + handover status map.
- **Multi-brand:** one folder per brand, each brand's `path` in its own config entry.
