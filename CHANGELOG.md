# Changelog

## v0.3.0 — Storage abstraction + the operational layer

Brand OS becomes storage-agnostic and starts using the brand it builds.

### New
- **Two storage backends.** Choose where the brand lives — Notion or a local markdown folder (the zero-dependency default) — the first time a skill needs it. Every read and write routes through one storage contract.
- **storage-architect** — a new deployable agent that handles verification, scaffolding, discovery, and migration between backends. Migrated spaces are archived, never deleted.
- **brand-filter** — runs any decision, idea, or draft through filters derived from your own knowledge base, scored against a fixed rubric with every score citing your brand's language. Weak scores trigger an improvement loop that researches, proposes a stronger alternative, and re-scores until it honestly earns the top band.
- **on-voice** — generates or rewrites content in your brand's voice, grounded in the Voice & Tone Guide, personality, and pillars. Every draft carries a voice trace naming the brand rules that shaped it.
- **brand-brief** — packages your brand for someone who wasn't in the room, with presets for another AI tool, a designer, a writer, or a partner. `designer`, `writer`, and `partner` briefs write to Documents automatically; a one-time `.docx` export is offered where the environment supports it.

### Changed
- **Modules reworked.** Memory now holds the knowledge base and the discovery that builds it. Worldview holds brand-filter, on-voice, and brand-brief — the operational layer that runs on the knowledge base and never edits it.
- **notion-connect deprecated**, folded into brand-discovery's in-flow storage setup. Redirects for one release, then removed.
- **Visual Identity (dimension 32) now renders fully in brand-brief.** The designer and agent presets show lifecycle phase, the personality → visual bridge, system logic, and existing assets — previously silent. Guardrails (hard don'ts) lead the agent preset's block, usable directly as generation constraints.
- **Brand Personality and Brand Values templates fixed.** Personality-spectrum position markers are now unique per axis, so edits land on the right row. Brand Values' priority order is expressed by the values table's own row order, not a separate ranked list.

## v0.2.3 — Hardening pass
*Released 2026-07-14*

Reliability and QA release — no new modules.

### Fixed
- **The plugin no longer risks breaking your Notion connection.** Removed a shipped `.mcp.json` that could override a working connection with a placeholder token; manual setup is now in the README.
- **Setup reliably finds your database.** Corrected a stale property check that failed on every current install (signature is now `Name · Section · Order · Status`).
- **Framework citations resolve.** Rebuilt `frameworks.md` to 26 sections and fixed a broken path — every citation in BRND-6–11 now points to real content.
- **Session version banner is accurate** (was lagging the plugin by two releases).

### Changed
- **Multi-brand workspaces supported.** `workspace-config.md` (schema v1.1) now holds one Brand OS instance per brand, resolved by project folder — one workspace, many brands. Solo founders just have one entry.
- **More reliable session handover.** Merged into `brand-discovery` as a bundled file instead of a separate skill that triggered inconsistently; added a chat-only fallback.
- **notion-connect runs standalone** — creates its own config instead of requiring `workspace-setup` first.
- **BRND-7 (Visual Identity) rebuilt to spec** — lifecycle phases, personality→visual bridge, concept hypothesis, token-readiness check, and identity-brief / library exit actions.
- **Round-skip handling.** Declining an interview round now leaves the page in progress with an "⚠️ Untested – Please Review" flag, instead of marking unvalidated content done.
- **Agent Skills spec compliance** — `version` moved under `metadata`, sharper trigger descriptions.

## v0.2.2 — Notion Connect + Agent Persona
*Released 2026-06-01*

### New skills
- **notion-connect** — Dedicated Notion setup skill. Handles template duplication, Brand OS database discovery, and workspace customization. Extracted from brand-discovery so the interview stays focused on brand — not infrastructure.
- **agent-persona** — Archetype-based personality setup. Runs a short interview across four archetypes (Strategist, Collaborator, Operator, Mentor), then rewrites your agent's `## Core Character` and adds an `## Engagement Mode` block to SOUL.md. Shapes default vibe and engagement tendencies for the whole workspace.

### Brand-discovery improvements
- **Startup cache** — Resumed sessions now read a handover file before making any Notion calls. All 11 Notion row fetches are skipped when resuming. Sessions continue in seconds, not after a full workspace scan.
- **3-tier database resolution** — Phase 1 now resolves the Brand OS database ID in priority order: handover file → `workspace-config.md` → Notion title search. Resumed sessions never prompt for the database again.
- **Phase 1 restructured** — Workspace customization and Notion setup moved to notion-connect. Phase 1 is now: handover check → DB resolution → context load → orient. Leaner entry, cleaner handoff.

---

## v0.2.1 — Public Release
*Released 2026-05-27*

- Published to [gitlab.com/atmo-studio/brand-os](https://gitlab.com/atmo-studio/brand-os)
- Repo restructured as a distribution package: root mirrors the installable plugin, dev files separated into `dev/`

---

## v0.2.0 — Beta Ready
*Released 2026-05-27*

### New skills
- **workspace-setup** — Guided 4-phase agent architecture design. Detects whether an existing workspace config is present and scaffolds accordingly: fresh installs build from scratch, existing workspaces get Brand OS added as a new project module.
- **brand-os-handover** — Structured session handover with formatted resume prompts. Called automatically by brand-discovery at section end or mid-section pause.
- **session-handover** — Generic session log skill, usable outside Brand OS for any focused work session.

### Improvements to brand-discovery
- **conversation-notes** — Handover now captures in-flight conversational state (working candidates, interview position, decisions not yet in Notion, open questions) and embeds it directly in the resume prompt. Sessions no longer restart from scratch.
- **Context window management** — Explicit 70% check at the start of each page. If context is at or above threshold, the skill completes the current page, writes to Notion, and invokes handover before proceeding. Post-compaction fallback: if the check is missed and compaction fires, the skill surfaces the problem and asks the user to paste the last draft rather than reconstructing from a lossy summary.
- **Status routing** — Status → `In Progress` is now step 0 of each page interview. Required write, not implied.
- **Database session lock** — If the user provides a Notion database URL at session start, it is accepted as the confirmed selection and the discovery search is skipped. The confirmed database ID is locked for all reads and writes in the session.
- **Selective context loading** — Completed pages from the current section load automatically at session start. Pages from prior sections load on demand when the current Section Instructions reference them.
- **Stuck-state protocol** — Two-loop-type handling: conceptual loops (3 rounds without resolution → reframe from source material with a structurally different approach) and language loops (3 rounds of wording feedback → surface the risk of eroding the original core idea before continuing).
- **Skip guard** — Skipping a page interview requires explicit user instruction. Never inferred from context pressure, fatigue signals, or perceived sufficiency of prior content.
- **Advance gate timing** — The page-advance gate only appears after an analytical pass is fully closed, not immediately after.
- **Candidate extraction** — Round 0 candidates must be grounded in explicit language from prior pages. No inferred candidates.
- **All-complete moment** — Rewrote the Voice & Messaging completion response as a genuine milestone: celebrates the effort, educates the founder on what they now have, and surfaces concrete next steps and available modules.

---

## v0.1.0 — Initial Beta
*Released 2026-05-15*

- **brand-discovery** skill with all 11 section instructions across 4 sections:
  - Foundations (Purpose, Vision & Mission · Brand Values)
  - Audience & Market (Ideal Customer Profiles · Competitive Landscape · Brand Positioning)
  - Brand Character (Brand Personality · Visual Identity)
  - Voice & Messaging (Brand Story · Voice & Tone Guide · Messaging Pillars · Taglines)
- Notion MCP integration for workspace read and write
- Session handover protocol (basic)
