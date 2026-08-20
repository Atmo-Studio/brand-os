# Brand OS — In-Flow Storage Setup
*Part of the `brand-discovery` skill · Loaded only when no storage resolves for the current brand*

Run this when a brand has no knowledge base yet — from brand-discovery Step A or workspace-setup Phase 3. Set storage up here, in this session; never send the user away to a separate setup step. This is asked once: the config entry written at the end is the remembered grant, and future sessions resolve silently.

---

## 1 · The storage choice

`AskUserQuestion` (plain text if the widget is unavailable):
> "Where should your brand knowledge base live?"
- Notion — *rich template with databases; needs the Notion connection*
- Local markdown folder — *zero dependencies, works everywhere, easy to move to another backend later*

**Google Docs is not offered in this release.** The adapter is built and tested, but every Google connector currently available exposes create/read only — no way to edit an existing Doc. Since `write-dimension` and `set-status` are both edits-in-place, a Google Docs brand would scaffold successfully and then be unable to record a single answer. Offering it would strand the user *after* they committed.

If a user asks for Google Docs specifically, say that plainly and offer the local folder — the `migrate` mission moves them across later with nothing lost:

> "Google Docs isn't supported yet — the connectors available today can create documents but not edit them, so your brand couldn't actually be updated as we go. A local markdown folder works everywhere and moves over cleanly once Docs editing lands."

**If md-folder:** no location question. The Storage Architect creates `brand/` at the root of the brand's project folder (workspace root if no projects are defined). This is also where the identity workstream's brand library lives later — one shared folder.

## 2 · The grant check

If the chosen backend needs an MCP connection, verify it now with one benign call. If unreachable:

> "Brand OS needs access to [Notion / Google Drive] for that. Grant it in your agent's connector or MCP settings, then tell me — **or start in a local markdown folder now and switch later; nothing is lost in the move.**"

Never dead-end. The local folder is always available.

**Check capability, not just reachability.** A connection that answers is not necessarily a connection that can write. Before continuing, confirm the connected tools can perform the operations the adapter needs — in particular an **update** verb for backends whose statuses and content live in existing objects (see the Tool requirement in `adapters/google-docs.md`). A create-only connector passes a reachability probe and then fails at the first status write, after the user has already committed. Surface that here, with the same both-halves shape: what to connect, and the local folder as the start-now alternative.

**If the user says they'll grant it:** wait, then re-run the benign call. Do not assume the grant landed and do not proceed on the strength of the promise — a failed second probe returns to the message above rather than into a broken session.

**If the user takes the fallback:** set `storage: md-folder` and continue at step 3. Do not re-ask the step 1 storage question — they answered it by choosing the alternative.

## 3 · Confirm the ID prefix (before deploying)

The Architect renders the prefix into the space it builds, so it must be a confirmed decision *before* the deploy, not after. Ask it on its own:

> "Your dimensions will be numbered `BRND-1` through `BRND-11`. Want a different prefix — your brand's initials, say — or is `BRND` fine?"

Default `BRND` if the user has no preference. Categories and tags are Documents-area settings that don't affect the scaffold; they're confirmed in step 5.

## 4 · Deploy the Storage Architect

Deploy `agents/storage-architect.md` for the non-interactive work:

- **Mission `scaffold`** for a new space (google-docs, md-folder)
- **Mission `discover` + `verify`** for an existing one (a Notion template the user duplicated, or a folder that already exists)

Pass: the storage choice, project scope, the confirmed prefix from step 3, and the paths to `workspace-config.md`, this skill's `assets/dimensions/`, and `references/adapters/`. Receive the structured hand-back (locator + verification report). If it hands back open questions — say, two candidate databases — relay them to the user, then continue or re-deploy.

*(Harness without agent deployment: execute the Storage Architect file's instructions inline yourself.)*

**Notion only — no template yet.** Notion spaces come from duplicating the Brand OS template, not from scaffolding. If the user chose Notion and the Architect finds no candidate database:

> "Here's how to get the template:
> 1. Open the Brand OS template: https://www.notion.com/templates/brand-knowledge-base?clientBuildTarget=client
> 2. Click **Duplicate** in the top-right corner and choose where it should live
> 3. Tell me when it's done"

Then re-deploy the Architect with mission `discover` + `verify`.

## 5 · Customize and lock

Surface the remaining workspace defaults and ask if they want changes:
- Document categories: SOP · Strategy · Template · Reference · Report · Proposal · Research · Notes
- Document tags: Operations · Marketing · Sales · Finance · Legal · Interview · UI · UX · AI

Write the confirmed entry to `workspace-config.md → modules.brand_os` (`project_id`, `status: active`, `storage`, the adapter's locator field, `page_prefix`, `connected_at`). Append — never overwrite another brand's entry. If the file doesn't exist, create a minimal config (`schema_version: "1.2"` + the entry) and tell the user in one line.

**`project_id`:** use the `id` of the `projects[]` entry whose folder this session is scoped to. If `projects` is empty or no project folder is in scope, use `"default"`.

**Keep the progress tracker honest.** If the config has a `setup_progress` block (present when workspace-setup created it), add `brand_os` to `setup_progress.phase_3_modules.modules_activated` if it isn't already there. Connecting a brand's storage *is* activating the Brand OS module — without this the tracker still reads "no modules activated" after a successful connect. (When this runs standalone in a config with no `setup_progress` block, there's nothing to update — skip it.)

Lock the storage + locator for the session, load `references/adapters/{storage}.md`, and return to the host skill's flow.
