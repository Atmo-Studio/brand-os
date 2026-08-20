# Storage Adapter · Notion
*Part of `brand-discovery` · Loaded when the resolved storage is `notion`*

Implements the Brand OS storage contract on a Notion workspace. This adapter preserves the exact semantics Brand OS has always used on Notion — existing users see no behavior change.

**Locator:** `notion_db_id` — the Brand OS database ID. Resolving a user-pasted URL: extract the database ID from the URL, then `verify-space` before locking. Tools: the available Notion MCP tools (search, fetch, update), whatever they are named in the host environment.

**The data source is the operational unit.** A Notion database ID is not stable. A **linked view** is a separate database object pointing at the same underlying *data source* as the real database, so a user who pastes a page URL will very often land on a view rather than the source — Brand OS's own template embeds one on its home page. Both resolve to the same data source, so reads and writes still reach the genuine dimension pages; the failure is durability, not correctness. A linked view is a block on a page, and a user who rearranges that page destroys the locator while the brand data sits untouched.

**Resolving a pasted URL.** Three shapes, one destination:

| Pasted | Resolve by |
|---|---|
| A database URL | fetch it; read the data source it exposes |
| A **page** URL (the common case) | fetch the page, enumerate its embedded `<database>` blocks, and pick the one whose schema carries the property signature. More than one structural match → ask the user; never auto-select |
| A data source URL (`collection://…`) | already the destination |

From the data source, walk back to its **source database** — the one whose fetch shows `inline="false"` with a real parent page, not the view embedded in a page. That is what goes in `notion_db_id`. Never record a view's ID there.

**What gets written where** — no schema change, one field each:

- **`workspace-config.md → notion_db_id`** — the *source database* ID. Human navigation, and the thing `verify-space` runs against.
- **The handover's `Locator:`** — the resolved **data source URL** (`collection://…`). It is the operational address, and caching it here is what keeps a resumed session at zero Notion reads: Step 0 locks it directly with no resolution call.

The config path costs one resolution fetch, because a database ID alone cannot be used to query. The handover path costs none. That is the intended asymmetry — the handover cache exists precisely to skip this.

Note that `verify-space`'s property-signature check **cannot** tell a view from its source — a view shares the schema and passes identically. Don't try to distinguish them by title or appearance either; a user can rename anything. Resolving to the data source is what makes the distinction stop mattering, which is why it's the rule rather than a heuristic.

---

## Operations

### `verify-space`
Fetch the database and check the property signature: `Name · Section · Order · Status`. All four present → well-formed; extra user-added properties are fine. Report missing properties without attempting repair.

**The signature check confirms the properties exist, not that they hold usable values.** A database whose entire `Order` column is empty passes it. Content-level integrity belongs to `list-dimensions`, which runs on every path this check does not.

### `list-dimensions`
Query the database rows. Each row is one dimension: read `Name`, `Section`, `Order`, `Status`. Return all 11 as the status map, sorted by `Order`. **Run the contract's integrity assertions on the rows before returning.**

`Order` is a plain number property, so Notion is the one backend where the ordering home has no structural guarantee — nothing stops it being empty, duplicated, or hand-edited, and an all-null column sorts to backend order while looking like it worked. The assertion exists for exactly this. It is also not yours to fix: `Order` is nav skeleton alongside `Name` and `Section`, so report the gap and tell the user to fill the column in the Notion UI.

Do not substitute the template's auto-increment `ID` property for a missing `Order`. It is user-configurable, its prefix varies per workspace, and its numbering is insertion order rather than framework order — the two agree only by coincidence.

### `read-dimension`
Fetch the dimension's page content (the row's page body).

### `write-dimension`
Update the page's content blocks within its existing heading structure. Never create or delete rows; never modify `Name`, `Section`, or `Order` — those are the nav skeleton and are read-only.

**Use targeted replacement, never whole-page replacement.** This is the mechanism, not a preference. The dimension page holds more than its fillable fields: heading blocks, gray caption paragraphs explaining each section, an intro paragraph, dividers. All of it is skeleton and all of it must survive. Rewriting the page body from a rendered version of the confirmed content destroys every one of those and looks like it worked.

So: `read-dimension` first, locate each placeholder string, and replace **only** those strings, one targeted edit per field. Whatever the host's Notion tooling calls it, the shape you want is search-and-replace against exact existing text (`update_content` / `content_updates`), not a full-body write (`replace_content`). If the only available tool replaces whole pages, treat the backend as create-only and degrade per the contract rather than overwriting the skeleton.

**Match the escaped form.** Notion's fetch returns placeholders escaped — `> \[Brand\] exists to .`, not `> [Brand] exists to ___`. A search string built from the skeleton file rather than from what fetch actually returned will silently match nothing and no-op. Read first, copy the exact returned string, replace that.

**Check for synced blocks before writing.** Template pages may wrap their fields in Notion **synced blocks**. A synced block original propagates every edit to each of its references anywhere in the workspace — and the Brand OS template already renders content through synced references on its home page, so this is live, not hypothetical. If a field you are about to write sits inside a `<synced_block>` original, you are editing every copy of it. Either write knowingly, or surface it to the user and let them decide. Never discover this after the fact.

Detection is deterministic from `fetch` output: a `<synced_block url="…#anchor">` marker whose URL page-ID equals **the page you're writing to** is an *original hosted here* (edits fan out to its references elsewhere); a URL pointing at a *different* page is a *reference* (the original lives on that other page, and editing here still propagates there). Both cases mean a write reaches content outside this dimension — treat either as "surface before writing." A plain field with no `<synced_block>` wrapper is safe to write normally.

### `set-status`
Update the row's `Status` property: `In progress` when a dimension's interview begins, `Complete` when confirmed content is written. Canonical values match Notion's status options directly.

### `write-document`
Create a row in the **Documents** database (the default write target). Set `Category` and `Tags`; link `Client` and `Project` when known. Use `Archive = true` instead of deleting, ever.

**Resolve the Documents database the same way as the dimensions database — through to its data source, not whatever object first answers to the name.** The `[TEST] Home` template renders its Docs section through a linked view exactly like the Brand OS section does, and that view can expose more than one data source (an empty stub alongside the real one is a shape this has actually produced). Fetch and confirm the data source before writing or querying — don't assume the first `Documents`-titled object found is the source.

### `list-documents`
Query the Documents database; filter `Archive ≠ true` unless asked otherwise.

---

## Rendering

Notion supports the full canonical element vocabulary natively:

| Element | Rendering |
|---|---|
| heading | heading blocks |
| field | quote/paragraph block with the template string |
| table | table block |
| callout | callout block |
| toggle | toggle block |
| quote | quote block |
| parallel blocks | column blocks (e.g. one column per messaging pillar) |
| external embed | embed block (FigJam/Figma), or a link if embedding fails |

---

## Backend notes

- **Discovery** (no locator on file): title search for `"Brand OS"` is semantic, not structural — it returns any page or database whose title/content matches. Filter to database-type results, then verify each candidate's schema agent-side. Multiple structural matches go back to the user with parent-page/teamspace context; never auto-select.
- **Scaffolding** is template duplication — a user action in the Notion UI, not an API operation. The architect's `scaffold` mission is blocked on Notion by design; route the user to duplicate the template, then `verify`.
- **Slow/unreachable:** Notion MCP calls are network calls. The handover cache exists so a resumed session **resolves storage and routes** — the whole startup handshake — with zero Notion reads; that's the promise, and it holds. The first reads happen only once actual work on a dimension begins (Step B.1 loads the current section's `Complete` dimensions for context), which is expected and is not "startup." Keep startup itself read-free; don't add speculative reads before the user has picked up where they left off. If the MCP is unreachable mid-session, degrade per the contract: chat-only writes as paste blocks, statuses in the handover map, sync next connected session.
- **Multi-brand:** one database per brand, resolved by project scope from `workspace-config.md`. Never mix databases in a session.
