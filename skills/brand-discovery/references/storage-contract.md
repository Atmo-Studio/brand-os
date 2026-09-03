# Brand OS: Storage Contract
**Contract version: 1.0**

**The tool-agnostic definition of how Brand OS stores, reads, and writes brand intelligence. Adapters implement this contract; no module may depend on a specific backend. Runtime sources: op implementations live in `skills/brand-discovery/references/adapters/`, the setup/migration agent in `agents/storage-architect.md` — this document is the design spec they conform to.**

## Why

Core functionality must never *require* a specific tool. Storage is the substrate every module reads and writes through: discovery, the operational layer, visual identity, brand operations. Abstract it once, here, and every module inherits three backends; skip it and every module hardcodes one.

## Entities

### Brand space
One brand's knowledge base on one backend. Identified by:

- `storage:` — backend type: `notion`, `google-docs`, `md-folder`
- **locator** — adapter-specific address: `notion_db_id`, `drive_folder_id`, `path`

Recorded per-brand in `workspace-config.md → modules.brand_os[]` (schema v1.2, below). Distinct brands are distinct spaces: never shared, resolved by project folder. Once resolved in a session, the locator is **locked**: all reads and writes use it, no re-resolution mid-session, silent redirects prohibited.

### Brand Dimension
One of the **11 framework units**. A dimension is **logical**; its physical unit is the adapter's business:

| Backend | A dimension is physically… |
|---|---|
| notion | a database-row page |
| google-docs | a top-level heading section within its section doc |
| md-folder | one markdown file |

**Addressing rule:** dimensions are addressed by **Order number + canonical name: never by ID prefix.** The prefix (`BRND` default) is user-configurable at setup; skills and adapters must not hardcode it.

| Order | Dimension | Section |
|---|---|---|
| 11 | Purpose, Vision & Mission | Foundations |
| 12 | Brand Values | Foundations |
| 21 | Ideal Customer Profiles | Audience & Market |
| 22 | Competitive Landscape | Audience & Market |
| 23 | Brand Positioning | Audience & Market |
| 31 | Brand Personality | Brand Character |
| 32 | Visual Identity | Brand Character |
| 41 | Brand Story | Voice & Messaging |
| 42 | Voice & Tone Guide | Voice & Messaging |
| 43 | Messaging Pillars | Voice & Messaging |
| 44 | Taglines | Voice & Messaging |

Order is section-scoped (first digit = section, second = position) and doubles as a stable sort key. The per-dimension content spec (what each dimension holds, in what structure) lives in the section-instructions **Fill Targets** tables (one normative home; this contract does not duplicate them). The canonical structural skeletons live in `skills/brand-discovery/assets/dimensions/`.

### Status
`Not started`, `In progress`, `Complete` — canonical values. Adapters may store a different spelling (md-folder uses kebab-case frontmatter) but must present and accept the canonical values at the contract surface. Status drives session resume and is **the one designed structural write**.

### Document
Agent-generated output (briefs, strategies, guidelines, reports). Every backend provides a **Documents-equivalent** — the default write target for everything that is not dimension content. Metadata (category, tags, client/project links) is written where the backend supports it and dropped silently where it doesn't.

### Resume state
Two layers, in priority order:

1. **The handover document** — a local markdown file in the agent's workspace, written at every session close by `../handover-protocol.md`. Backend-independent by construction. Carries: `Storage:` + `Locator:`, the full 11-dimension status map, confirmed-but-unwritten drafts, conversation notes, skipped dimensions.
2. **Backend statuses** — read via `list-dimensions` when no handover cache exists.

The handover file is the primary startup path precisely so that resume never depends on backend speed or availability.

## Operations

Seven operations. Every adapter implements all seven; implementations live in `skills/brand-discovery/references/adapters/{storage}.md`.

| Op | Contract | notion | google-docs | md-folder |
|---|---|---|---|---|
| `verify-space` | Confirm the locator points at a well-formed brand space; report what's missing without fixing it | DB carries property signature `Name, Section, Order, Status` | folder contains Index doc + 4 section docs | folder contains 11 dimension files |
| `list-dimensions` | Return the 11-dimension status map (Order, name, section, status) in **one logical read**, asserting its integrity (below) before returning | query DB rows | read the Index doc table | glob the brand folder + read frontmatter |
| `read-dimension` | Return one dimension's full content | fetch the page | read its heading span in its section doc | read the file |
| `write-dimension` | Write confirmed content into the dimension's **existing structure**; never create or delete dimensions | update page blocks | write within the heading span | write the file body below frontmatter |
| `set-status` | Set a dimension's status | `Status` property | update its Index doc row | update `status:` frontmatter |
| `write-document` | Create a new document in the Documents area, with metadata where supported | Documents DB row (Category, Tags, relations) | new doc in `Documents/` subfolder | `documents/YYYY-MM-DD_[slug].md` with frontmatter |
| `list-documents` | Enumerate existing documents | query Documents DB | list the subfolder | glob `documents/` |

**Consumers reference operations by these names.** A skill instruction reads "write the confirmed content (`write-dimension`) and mark it `Complete` (`set-status`)": never "update the Notion page."

### `list-dimensions` integrity assertions

Structural drift has to be caught on the path users actually take. `verify-space` runs on a minority of them (a user-pasted locator, or an explicitly deployed architect mission), so a workspace resolving from a saved config entry or a handover cache never reaches it, which is every recurring session on an established brand. `list-dimensions` is the one operation every consumer calls on every path, and it has already read the rows it would need to check. That makes it the only place a per-session integrity check is both reliable and free.

Every adapter's `list-dimensions` asserts the following before returning:

| Assertion | Catches |
|---|---|
| Exactly 11 dimensions returned | rows added, deleted, or filtered out by a view |
| Order values are exactly `{11, 12, 21, 22, 23, 31, 32, 41, 42, 43, 44}` — all present, no nulls, no duplicates | an ordering home that is empty or hand-edited |
| Status values are within `Not started, In progress, Complete` | a renamed backend status option |
| Section values are within the four canonical sections | a renamed or misassigned section |

Every routing decision depends on the Order assertion. A partly or wholly null sort key does not error: it returns rows in backend order while looking like it worked, and every downstream decision that reads "the first incomplete dimension" silently inherits that ordering.

**A failed assertion is reported, never repaired.** Order, name, and section are structure, and write rule 1 makes structure read-only: no consumer may fix them, including this operation. Name the failed assertion and the correction the user needs to make, then stop. A consumer that infers a missing Order value has invented framework position, which is worse than the drift it was papering over.

## Write rules (every adapter, non-negotiable)

Generalized from the Brand OS write rules (maintainer doc, not packaged):

1. **Structure is read-only.** The dimension set, names, order, section grouping, and heading skeletons are never created, deleted, or renamed by discovery or any consumer module.
2. **Status is the one designed structural write** — `In progress` when a dimension's interview begins, `Complete` when confirmed content is written.
3. **The Documents-equivalent is the default write target** for all generated output.
4. **Never write to a template or unresolved space.** Writes go only to the session-locked locator.
5. **Locator lock:** once resolved, locked for the session. No re-resolution, no silent redirects.

## Canonical element vocabulary

Dimension content is expressed in these elements. Each adapter maps them to the **highest-fidelity native affordance available** — the goal is that a dimension reads the same on every backend, with the documented fallback only where nothing closer exists. Rendering tables live in each adapter file.

| Element | Meaning | Fallback when unsupported |
|---|---|---|
| heading | section structure within a dimension | markdown/native headings (always supported) |
| field | a template string to fill (`> [Brand] exists to ___`) | blockquote or plain paragraph |
| table | rows × named columns | pipe table / native table |
| callout | highlighted note | bold-label paragraph (`**Label** — …`) |
| toggle | collapsible "how to use this page" note | plain trailing section under a heading |
| quote | verbatim voice-of-customer or field text | blockquote |
| parallel blocks | side-by-side columns (e.g. one per messaging pillar) | stack sequentially in order |
| external embed | FigJam/Figma/file embed | a labeled link |

## Storage as a grant (the permission model)

Storage behaves like an app permission, not an installer:

- **Asked when needed, not before.** No standalone connect step. The skill that needs storage (brand-discovery, workspace-setup) asks in-flow, the first time only.
- **Remembered durably.** The `workspace-config.md` entry is the grant. Recurring runs resolve silently: re-asking a granted permission is a defect.
- **Declining is never a dead end.** If a backend needs an MCP connection the agent can't reach, the ask explains how to grant it (agent-agnostic: "your agent's connector/MCP settings") **and offers local markdown as the start-now alternative in the same breath.**
- **Switching is explicit.** The user asks in plain language; the Storage Architect migrates. Nothing prompts the user to reconsider a working setup.

### The canonical in-flow resolution step

Consumer skills point at step 1's shipped runtime copy (`storage-resolution.md`, alongside this file) rather than restating it (as of v0.3.1; before this, five skills each carried their own copy and drifted, see ATMO-115). This document is the normative definition; `storage-resolution.md` is the runtime procedure that implements it. Both ship. Steps 2–5 ship as `storage-setup.md`, loaded only when nothing resolves: recurring sessions never pay for setup they don't need.

1. **Resolve silently**, in order: handover cache (`Storage:` + `Locator:`; legacy `Brand OS database ID:` ⇒ `notion`) → `workspace-config.md` entry for the current project scope (`storage` + locator; legacy entry with `notion_db_id` and no `storage` ⇒ `notion`) → a URL/path the user provided at session start. On success: load `skills/brand-discovery/references/adapters/{storage}.md`, lock the locator, continue. No user interaction.
   - **Page-prefix resolution (v0.3.1):** the brand's configured `page_prefix` is authoritative once set; `BRND` is the default only when unset. Every writer of a dimension reference (handovers, briefs, documents) uses the resolved prefix, never a hardcoded `BRND-N`. Full rule: shipped file §4.
   - **Freshness rule (v0.3.1):** a resolved handover's cached status map is trusted for routing without a fresh read: that's the point of caching it. Before any `write-dimension`/`set-status`, re-verify the specific dimension(s) via `read-dimension` or `list-dimensions`. Read-only consumers (`brand-filter`, `on-voice`, `brand-brief`) never write, so this doesn't bind them. Full rule: shipped file §5.
2. **Nothing resolves →** ask (AskUserQuestion where available, plain text otherwise): *"Where should your brand knowledge base live?"* — **Notion** (rich template, databases), **Google Docs** (lives in Drive alongside your docs), **Local markdown folder** (zero dependencies, works everywhere, easy to move later).
3. **Chosen backend needs an unreachable MCP →** the grant ask: *"Brand OS needs access to [Notion / Google Drive]. Grant it in your agent's connector or MCP settings, then tell me — **or start in a local markdown folder now and switch later.**"*
4. **Deploy the Storage Architect** (`agents/storage-architect.md`) with a mission (`verify` an existing space, `scaffold` a new one, or `discover` candidates), plus the storage choice, project scope, and the config/scaffold/adapter paths. Receive the structured hand-back (locator + verification report + open questions). Ambiguity (e.g. two candidate databases) → relay to the user, then continue or re-deploy. **Harness without agent deployment → execute the agent file's instructions inline.**
5. **Customize and lock:** confirm prefix/categories/tags defaults, write the config entry, lock the locator, continue the host skill's flow.

## The Storage Architect (execution model)

`agents/storage-architect.md` is a deployable agent: skills deploy it for **bounded, non-interactive** work and it hands back a structured result to the session that deployed it. Missions: `verify`, `scaffold`, `discover`, `migrate`.

- **Interactive halves stay in the main session** — deployed agents can't converse mid-run. Choices, grants, and confirmations belong to the consumer skill; the architect receives decisions, never makes them for the user.
- **The agent file doubles as the inline brief.** On a harness with no agent mechanism, the main session follows the same instructions itself. Same protocol as every other Claude-feature fallback in this plugin.
- **The architect never generates runtime references into the user's workspace.** Adapters and scaffold ship with the plugin and update with releases: generated copies go stale (the Notion-attachment lesson from v0.2.3).

## Switching storage (migration)

Explicit, user-initiated ("move my Brand OS to Google Docs"). The host agent deploys the Storage Architect with a `migrate` mission:

1. `scaffold` the new backend.
2. For each of the 11 dimensions: `read-dimension` from the old space → `write-dimension` + `set-status` into the new one.
3. Copy documents (`list-documents` → `write-document`).
4. **Inventory the old space:** sort its contents into *archive* (anything with history, versions, or content not fully carried over) and *safe to delete* (fully migrated, nothing unique left). The inventory ships in the hand-back.
5. Update the `workspace-config.md` entry (`storage`, locator) and note the migration in the next handover.
6. **Archive first; delete only on explicit confirmation.** The deploying skill relays the inventory to the user, who either handles the flagged items themselves or explicitly authorizes the Architect to act on them. The Architect never deletes on its own judgment.

## Degradation rules

What discovery does when a backend misbehaves. These are contract-level; adapters add backend-specific notes.

| Condition | Behavior |
|---|---|
| **Backend unreachable** | Run the session chat-only: interview proceeds, confirmed content is delivered as clearly labeled paste blocks, statuses are tracked in the handover status map. `confirmed-drafts` in the handover carries unwritten content; the next connected session syncs it via `write-dimension` + `set-status`. Never block the interview on the backend. |
| **Read-only backend** | Reads via the adapter; writes degrade to paste blocks + handover tracking, same sync path as above. |
| **Slow backend** | The design already absorbs this: handover cache first (Step 0), selective context loading (Step B.1), session locator lock, no mid-session re-queries. Batch what can be batched; never poll. |
| **Missing capability** | Render via the element-vocabulary fallbacks. Hard requirement: every backend must give statuses a durable home (property, index row, frontmatter); the handover map is the last resort, not the plan. |
| **Structure drifted** (missing dimensions, renamed headings) | `verify-space` fails soft: report exactly what's missing and offer an architect re-scaffold of the missing pieces. Discovery itself never creates structure. |
| **Integrity assertion fails** (null/duplicate Order, non-canonical Status or Section) | `list-dimensions` reports which assertion failed and what the user must correct, and does not repair it: this is structure, and structure is read-only. The consumer says so plainly and stops rather than routing on an unreliable map: a wrong "first incomplete dimension" sends the user back into an interview they already finished. Distinct from `verify-space` drift in that the space is well-formed and its *contents* are not, which is why this check runs on every path rather than at setup. |
| **No agent deployment in harness** | Architect instructions execute inline in the main session. |

## workspace-config schema v1.2 (additive)

`modules.brand_os[]` entry shape:

```yaml
- project_id: "proj-N"        # links to a projects[] entry; "default" if none defined
  status: active               # active | setup | inactive
  storage: notion              # notion | google-docs | md-folder   (NEW in v1.2)
  notion_db_id: "…"            # locator — notion only
  # drive_folder_id: "…"       # locator — google-docs only
  # path: "brand/"             # locator — md-folder only; always brand/ in the project folder, recorded for multi-brand resolution
  page_prefix: "BRND"
  connected_at: "YYYY-MM-DD"
```

**Back-compat reader rule (all consumers):** an entry with `notion_db_id` and no `storage` field is `storage: notion`. Existing configs (including the live Claus workspace) resolve without edits. Handover documents likewise: `Storage:` + `Locator:` going forward; the legacy `Brand OS database ID:` field is read as `storage: notion`.

## Adapter conformance checklist

A new adapter ships when all of these hold:

- [ ] Implements all 7 operations, keyed to the contract names
- [ ] Declares its locator field and how to resolve a user-pasted URL/path to it
- [ ] `list-dimensions` returns the full status map in one logical read
- [ ] `list-dimensions` runs the integrity assertions and reports failures without repairing
- [ ] Statuses have a durable, backend-native home with canonical values at the surface
- [ ] Ordering has a durable, backend-native home that `list-dimensions` can assert against, and the adapter documents whether that home is structurally guaranteed or merely conventional
- [ ] Rendering table maps every canonical element (native or documented fallback)
- [ ] Honors all five write rules
- [ ] `verify-space` reports missing structure without fixing it
- [ ] Scaffold path defined for the architect (from `assets/dimensions/`, rendered per backend)
- [ ] Degradation notes: what unreachable/read-only/slow look like on this backend
- [ ] No hardcoded IDs, URLs, or prefixes; brand-neutral examples only

## Known future moves (recorded, not built)

- Adapters + scaffold live in `skills/brand-discovery/` because discovery is the only interview-time consumer in v0.3. When the operational layer and the identity workstream land as heavy readers, consider graduating them to a shared module folder; until then, cross-skill reads are the pattern: from a consumer skill's own folder, `../brand-discovery/references/adapters/` and (as of v0.3.1) `../brand-discovery/references/storage-resolution.md`.
- The identity workstream's "artifact home" (reference page + local `brand/` library) is expressible today: the dimension-32 upgrade is a `write-dimension`, and the library shares the fixed `brand/` destination: for md-folder brands it is literally the same folder. No contract change needed.

---

## Contract changelog

Bump the version stamp at the top of this file when the contract changes.

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-07-16 | Initial contract. Entities, seven operations, write rules, integrity assertions, degradation rules, workspace-config schema v1.2, adapter conformance checklist. Shipped with the plugin as of 2026-08-22; previously maintainer-only. |
