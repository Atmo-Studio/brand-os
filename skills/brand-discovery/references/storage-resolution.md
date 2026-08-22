# Brand OS — Storage Resolution
*Part of the `brand-discovery` skill · The single shipped runtime copy of "Phase 1 step 1" — every consumer skill (`brand-discovery`, `brand-filter`, `on-voice`, `brand-brief`, `workspace-setup`) points here instead of restating this algorithm. The normative design spec is `storage-contract.md`, alongside this file; that document defines *what* a compliant backend must do, this one is the procedure that actually runs.*

Load this file whenever a skill needs to resolve which brand space it's operating on, whether the cached status map can be trusted, or what prefix to use when writing a dimension reference. Skip whichever sections don't apply to the calling skill — a read-only skill that never writes has no use for §5's write-path clause, for example.

---

## 1 · Handover-cache resolution

Run this before any backend call.

1. **Glob** every `*_brand-os-handover-*.md` file under the current project's folder. Use the narrowest folder that is genuinely this brand's. Exclude nested worktrees, build outputs, and vendored copies (`.claude/worktrees/`, `node_modules/`) — those hold duplicates of files already in the list, not additional candidates.
2. **Filter before you sort.** Read each candidate's `## Workspace` block — `Project:`, `Storage:`, `Locator:`, `Page prefix:`, or in handovers written before v0.3 the legacy field `Brand OS database ID:`, which means `storage: notion` with that ID as the locator. Keep only candidates matching the current brand:
   - a `Project:` line matching the resolved `project_id` is an exact match — trust it and look no further;
   - no `Project:` line → match `Locator:` against the config entry's locator;
   - no config to check against → every candidate is eligible.

   Discard the rest. **Recency selects only within the filtered set.** A newer handover belonging to a different brand is not a candidate and never a fallback — the most common way a session locks the wrong knowledge base is a dev or test handover written against a scratch space, which is newer than real work precisely because it is scratch.
3. **Take the most recent survivor** and confirm it carries both a `## Workspace` block and a `## Status Map`. If it does: lock the storage, locator, and page prefix (if present — see §4) for this session, load the matching adapter from `references/adapters/{storage}.md`, and treat this as resolved. **Before trusting the status map for anything beyond routing, apply §5's freshness rule.**
4. **Fall through to §2** if no file exists, nothing survives the filter, the survivor is unreadable, or either required section is absent.

## 2 · `workspace-config.md` matching

If §1 didn't resolve, resolve the brand's storage from `workspace-config.md → modules.brand_os`:

This is a **list** of brand instances. Distinct brands are distinct entries: each has its own `project_id`, its own `storage` + locator, and its own knowledge base — they do not share data. Brands are separated by **project folder**, so resolve by scope: match the `project_id` of the project folder this session is operating in, and use *only* that entry. If the workspace has just one entry, use it.

**Back-compat:** an entry with a `notion_db_id` and no `storage` field is `storage: notion`.

**Null-locator clause:** if the matched entry exists but its locator is null (the brand is staged but not yet connected), **do not resolve here** — treat this brand as not connected and fall through to §3, then to in-flow setup. A staged entry is not a connected one; nothing about "an entry exists" implies "a knowledge base is reachable."

Only if scope is genuinely ambiguous — no clear project folder and more than one active entry with a non-null locator — ask the user which brand this session is for.

On a match: lock the resolved entry's storage, locator, and page prefix (§4), load `references/adapters/{storage}.md`, and treat this as resolved.

## 3 · User-provided URL or path

If nothing resolved in §1–2, and the user included a Notion URL, a Google Drive folder URL, or a local folder path in their session-start prompt, treat it as the confirmed selection. Infer the backend from its shape, resolve it to a locator, verify it with the adapter's `verify-space` check, lock it, load the adapter, and treat this as resolved.

If nothing resolves at all, the calling skill's own Phase 1 defines what happens next (in-flow setup for `brand-discovery`/`workspace-setup`; a session-only fallback for the read-only operational skills). That branch is skill-specific and stays in each skill's own file.

## 4 · Page-prefix resolution

The brand's configured `page_prefix` (read from the matched `workspace-config.md` entry, or carried in a resolved handover's `Page prefix:` field) is **authoritative**. `BRND` is the system default only when the field is unset or the config predates it — never assume `BRND` is correct once a brand has its own value.

**Every writer of a dimension reference — handover documents, briefs, generated documents — uses the resolved prefix, never a hardcoded `BRND-N`.** If no prefix has been resolved yet at the point a reference must be written (rare — most write paths run after resolution), fall back to the dimension's Order number and name instead of guessing a prefix.

This is the write-side half of a rule already proven on the read side: **never hardcode the ID prefix — reference dimensions by name or Order number.** `brand-filter`'s architecture rules state this and it has held up under real conditions; every consumer should rely on the same rule rather than restating it.

## 5 · Freshness rule for cached status maps

A handover's status map (§1) is trusted for **routing and storage resolution** without a fresh read — that's the entire point of caching it, and re-verifying on every load would erase the benefit.

But a cache can go stale. Before any **write** — `write-dimension` or `set-status` — re-verify the specific dimension(s) about to be written via `read-dimension` (already required by brand-discovery's B.0 sync step) or, if no per-dimension check is already happening, one `list-dimensions` call. **Never let a stale cached status map cause a completed dimension to be re-interviewed or a real answer to be silently overwritten.**

Read-only consumers (`brand-filter`, `on-voice`, `brand-brief`) never write to the knowledge base, so this clause doesn't bind them — they may trust the cached or freshly-read status map for the whole session once loaded.

## 6 · `list-dimensions` integrity-failure surfacing

Every adapter's `list-dimensions` asserts, before returning: exactly 11 dimensions, Order values forming the complete canonical set with no nulls or duplicates, Status values within the canonical three, Section values within the four canonical sections. Full assertion definitions and rationale live in `storage-contract.md` § `list-dimensions` integrity assertions.

**If `list-dimensions` reports a failed assertion: report which one failed and what the user must correct, then stop.** Do not repair it — Order, Name, and Section are structure, and structure is read-only; no consumer may fix them, including this one. Do not route on the unreliable map — a wrong "first incomplete dimension" sends the user back into an interview they already finished. This applies identically whether the consumer reads dimensions to interview, evaluate, draft, or brief.
