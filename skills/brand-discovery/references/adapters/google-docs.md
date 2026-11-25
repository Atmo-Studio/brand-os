# Storage Adapter: Google Docs
*Part of `brand-discovery`, **STAGED: not offered in this release***

> **Status: parked pending connector support.** This adapter is complete and its
> scaffold path is tested end to end (folder, Index doc, 4 section docs,
> `Documents/`, 11 status rows, correct dimension grouping). It is not offered in
> the storage choice because **no currently available Google connector can edit an
> existing Doc**: verified across two independent Anthropic surfaces and Google's
> own first-party Workspace MCP server, which covers Gmail, Drive, Calendar, Chat,
> and People but *not* Docs. `write-dimension` and `set-status` are both
> edits-in-place, so a Google Docs brand scaffolds fine and then cannot record a
> single answer.
>
> **To unpark:** when a connector exposing a Docs edit verb (`documents.batchUpdate`
> or equivalent) becomes available off-the-shelf, (1) re-add Google Docs to the
> choice in `../storage-setup.md` §1, (2) restore it in `brand-discovery`'s frontmatter
> `description` and "What You Are", (3) re-run the capability probe below against the
> new connector, and (4) settle the two rendering questions in the parked-issues note:
> callout weight and the pillars-table-vs-headings collision. Everything else here
> is ready.
>
> Do **not** work around this by deleting and recreating Docs. No connector exposes a
> delete verb, and even with one it would destroy version history, comments, sharing
> permissions, and every existing link to the document, roughly thirty times during a
> single onboarding, with no rollback if the recreate fails.

Implements the Brand OS storage contract on Google Drive + Google Docs. There are no databases here; dimensions are grouped into **four section documents** (one per framework section, mirroring one-section-per-session, so each discovery session lives in one doc), and statuses live in a single **Index doc**.

**Locator:** `drive_folder_id` — the Brand OS Drive folder. Resolving a user-pasted URL: extract the folder ID, then `verify-space` before locking. Tools: the available Google Drive / Google Docs MCP tools in the host environment.

**Tool requirement, check this before offering Google Docs.** This backend needs an **update** capability: a tool that modifies the content of an existing Doc. `write-dimension` and `set-status` are both updates-in-place, so a connector exposing only create/copy/read/search satisfies every other line of this adapter and still cannot run a session past scaffolding. Many stock Drive connectors are create-only.

So: probe for update capability **during the grant check** (`../storage-setup.md` §2), not after scaffolding. If the connected tools can create but not update, say so before the user commits:

> "Your Drive connection can create files but not edit them, so Brand OS can't update your brand docs as we go. Two options: connect a Drive/Docs tool with edit access, **or start in a local markdown folder now and switch later; nothing is lost in the move.**"

Discovering this after the folder is built means the user has a scaffolded, permanently empty knowledge base: the worst version of this failure.

---

## Space layout

```
[Brand OS folder]                       ← drive_folder_id
├── Brand OS: Index                     ← status registry (normative)
├── Brand OS: 1. Foundations            ← dimensions 11, 12
├── Brand OS: 2. Audience & Market      ← dimensions 21, 22, 23
├── Brand OS: 3. Brand Character        ← dimensions 31, 32
├── Brand OS: 4. Voice & Messaging      ← dimensions 41, 42, 43, 44
└── Documents/                          ← default write target
```

Each dimension is a **top-level (H1) heading section** inside its section doc, titled `[ID], [Dimension Name]` using the workspace's configured prefix. Everything below that H1, up to the next H1, is the dimension's content span.

**The Index doc** holds one table, the normative status registry:

| Order | Dimension | Section | Status |
|---|---|---|---|
| 11 | Purpose, Vision & Mission | Foundations | Not started |
| … | … | … | … |

One read of this table = the full status map (the slow-backend rule). If the Index is ever missing, it is rebuilt by scanning the section docs: the architect handles that; this adapter only reports it.

---

## Operations

### `verify-space`
List the folder: the Index doc, all 4 section docs, and the `Documents/` subfolder must exist, and the Index table must have 11 rows. Also confirm an **update** capability is available in the host environment (see Tool requirement above): a space that verifies structurally but cannot be written to is not a working brand space, and reporting it as sound is how a user ends up with an empty knowledge base. Report anything missing without repairing.

### `list-dimensions`
Read the Index doc table. Return the 11 rows as the status map, sorted by Order. **Run the contract's integrity assertions on the table before returning.**

The Index table is ordinary document text with no schema behind it, so its Order column is the least protected of the three backends: a cell can be blanked, duplicated, or reordered by a human editing the doc, and nothing else in the folder changes to reveal it. Report and stop; the correction is the user's to make in the Index doc.

### `read-dimension`
Open the dimension's section doc; return the content span under its H1 (from its heading to the next H1 or end of doc).

### `write-dimension`
Write within the dimension's content span only: preserve the H1 and the heading skeleton beneath it; fill content under the existing headings. Never add or remove dimension H1s; never touch a neighboring span.

### `set-status`
Update the dimension's row in the Index table: `In progress` when its interview begins, `Complete` when confirmed content is written.

### `write-document`
Create a new Google Doc inside `Documents/`, titled `YYMMDD_[slug]`, for example
`260902_designer-handoff`. This is the same form the `md-folder` adapter writes, so a brand
reads the same whichever backend holds it. Open with a one-line metadata header
(`Category: …, Tags: …, Client/Project: …`): Drive has no structured metadata fields, so the
header carries it.

### `list-documents`
List the `Documents/` subfolder contents.

---

## Rendering

Preserve the Notion template's formatting as closely as Docs allows, reaching for the nearest visual equivalent, not the plainest one:

| Element | Rendering |
|---|---|
| heading | native headings (H1 = dimension, H2/H3 = its internal structure) |
| field | indented paragraph with the template string |
| table | native table |
| callout | **single-cell (1×1) table** with a bold label: reads as a boxed note, like Notion's callout |
| toggle | plain trailing section under a `How to use this page` H3 (Docs has no collapse) |
| quote | indented italic paragraph |
| parallel blocks | **single-row table, one column per block** — preserves Notion's side-by-side pillar layout |
| external embed | a labeled link paragraph (no live embeds) |

---

## Backend notes

- **Scaffolding** is fully programmatic (architect `scaffold` mission): create the folder, render the 4 section docs from `../../assets/dimensions/` skeletons via the table above, create the Index with all rows `Not started`, create `Documents/`. No template duplication step exists or is needed.
- **Discovery:** search Drive for a folder containing a doc named `Brand OS: Index`. Multiple matches go to the user with folder-path context.
- **Status drift risk:** the Index is the one normative status home: never mark status inside a section doc. If a user hand-edits statuses, the Index is still authoritative.
- **Slow/unreachable:** same contract degradation as everywhere: handover cache at startup, chat-only paste blocks + handover status map when Drive is unreachable, sync next connected session.
- **Multi-brand:** one folder per brand, resolved by project scope. Never mix folders in a session.
