# Changelog

## v0.4.0 — Identity Module

Brand OS can now build a high-quality visual identity from scratch, and make an existing one ready for agentic production. Four new skills, a design agent and a library of design expertise take a brand from its first direction to a production-ready kit, built on your brand knowledge base.

### New

**Bring your brand strategy to life with a foundational visual identity.** Start from scratch, or pull in the references and assets you already have. Anything you have already decided is kept exactly, and the result is a brand ready for humans and agents to design from.

**`visual-identity` walks you through the whole identity, from first direction to finished kit.** Like brand discovery, it works in rounds: it asks for references, settles color, type, space, motifs, motion and a starting wordmark with you, and shows each decision on a real surface so you judge it in use. It opens with a map of where your brand stands, and picks up wherever you left off.

**Prefer a designer? Choose that path, and the brief is written for you.** visual-identity turns everything decided so far into a designer brief, and when you have no designer yet it drafts the inquiry to Atmo Studio. When the designer delivers, the identity is taken in exactly as delivered and checked against the brief, so you see what is still missing.

**Brand OS now carries a library of written design expertise.** Standards for color, type, layout, motifs and motion, each grounded in cited sources and Atmo's own practice, sit inside Brand OS for any skill or agent to load when the work calls for them. It sets the standard floor for any agent doing visual design, so your agents work from the same knowledge a practitioner would.

**`design-director` is the first agent to work from that library.** It develops concepts, builds the foundations and critiques work other agents make, and it can tell good design from AI slop.

**`design-md` writes a DESIGN.md any agent can build from.** It builds on the industry standard set by Google Labs, and every value in it points to a token.

**`design-tokens` builds a token library ready for production, in code and in Figma.** One source covers color, type, spacing, radius, stroke, elevation, layout and motion, and publishes to CSS, JSON, JavaScript and a Tailwind theme. Point it at an existing site or codebase and it finds every value typed by hand, swaps in the matching token and lists the tokens nothing uses.

**`brand-library` assembles everything into one production-ready folder you can share with your team.** Tokens, DESIGN.md, logo and motif files and a standards sheet PDF sit together, with a readme that routes any agent to the right file. The sheet is generated from your tokens, so it stays in step with them.

**Sync your design system to Figma.** With the Figma MCP connected, brand-library builds a Figma file with your variables, type styles, logo components and standards sheet, for visual reference and further iteration. Without it, the kit is still complete.

**Bring an existing brand into Brand OS, or bring an older one up to date.** brand-library takes in a live site, a designer's files or a body of work as decided, and sends only the missing parts back to visual-identity to work out with you. A kit built on an earlier Brand OS release is upgraded with your own changes kept, and `workspace-setup` now gives every workspace a memory, adopting any memory file it already has.

### Improvements
- **`design-tokens` builds fail on low contrast.** Every text color and button state is measured against its background, dark sections on a light site included.
- **`design-tokens` libraries support multiple sub-brands and themes that share the same primitives.**
- **Built components carry their interactive states.** `design-md` defines hover, pressed and focus for each, and `design-tokens` measures them like everything else.
- **`brand-library` checks each change to an existing brand against the decisions already locked in.** You see what it would reopen, and its impact, before anything changes.
- **`brand-library`'s standards sheet draws every logo misuse and your primary color pairs with their contrast.** A logo still set in live text is caught before it ships.
- **`design-tokens` builds color ramps in OKLCH, so each step reads at the same weight in every hue.** The light steps keep their color, and a pinned brand color blends into its neighbors. The expertise library documents carrying your colors into RGB, HSL, CMYK and the other notations screen and print use.
- **The Visual Identity step in `brand-discovery` now leads straight into the identity work.** Finishing it offers visual-identity by name, and once the identity exists the page becomes a short introduction to your brand folder.
- **The Notion template is updated to match local storage.** Its Visual Identity and Messaging Pillars pages carry the same sections as a local brand folder.
- **Signature Device is now Brand Motifs in `brand-discovery`.** A brand can record several, web effects included, and a knowledge base that still says Signature Device keeps working.
- **A local brand folder can hold identity files beside your dimensions.** `brand-discovery` reads only the numbered dimension files.
- **Brand OS now writes to codified standards that cut AI slop.** Interview questions, templates and drafts drop em dashes, stock phrases, service filler and borrowed metaphors like "load-bearing."
- **Saved documents follow one naming system, YYMMDD_slug.** Files sort by date and read at a glance, so the one you want is faster to find. Documents saved earlier keep their names.
- **Resumed `brand-discovery` sessions name the dimension and section they pick up, and why.**
- **`brand-discovery` asks each section's opening question exactly as written.**
- **`brand-filter`'s mid-range scores now name the tension behind them.** Only scores below 6 or above 9 carried a reason before.
- **`session-handover` ends on the log's location and the resume prompt.** Anything left to tidy waits in the log.
- **Manual installs copy the whole Brand OS folder,** so skills keep their writing rules.

### Fixed
- **`brand-filter`'s improved proposals say what still pulls against each mid-range score,** not only what moved it.
- **`on-voice` drafts, `brand-brief` briefs and `brand-filter` reasons follow Brand OS's writing rules on plugin installs,** which never loaded them before.

## v0.3.4 — Every skill loads

Four skills in v0.3.3 never loaded, so asking for one by name did nothing. This release fixes that and changes nothing else.

### Fixed
- **Brand filter, brand brief, brand discovery and agent persona load again.** v0.3.3 hid them from your agent
- **The storage agent that brand discovery hands setup and migration to loads again**

## v0.3.3 — Authoring quality and storage consolidation

A quality pass across every shipped file, plus tighter rules on what Brand OS produces for you. No new skills or modules.

### Changed
- **Machine artifacts removed from every shipped file.** New authoring standards, applied file by file
- **Session resume blocks carry state, method, and what is still open.** A resumed session picks up instead of asking how to proceed
- **Both storage backends name documents the same way**
- **Visual Identity asks what to take from a reference brand**, not just its name
- **Storage rules consolidated into one reference**, so the skills that share them cannot drift apart

### Fixed
- **Brand briefs never shorten a quote to make it fit**
- **Cross-skill references resolve from any install**
- **The shipped agent file no longer contradicts its own writing rules**

## v0.3.2 — Cleanup and release-process hardening

Housekeeping. No interview, scoring, or storage behavior changes — every fix here is a broken pointer, a stale reference, or a gap in how releases get checked.

### Removed
- **`notion-connect` is gone.** Deprecated in v0.3 and kept as a compatibility redirect for one release, as its own deprecation notice promised. Storage connection happens in-flow: `brand-discovery` Step A and `workspace-setup` Phase 3 resolve or set up storage themselves, and the `storage-architect` agent handles scaffolding, discovery, and migration.

### Changed
- **The storage contract now ships.** `skills/brand-discovery/references/storage-contract.md` was maintainer-only; two shipped files referenced it for the integrity-assertion rules, so buyers hit a path they didn't have. It carries its own `Contract version` stamp now, independent of plugin releases.

### Fixed
- **Dead references to unpackaged files.** `storage-resolution.md` pointed twice at a path under `dev/` that no install contains, including for the `list-dimensions` integrity-assertion rules. The contract it referenced now ships alongside it.
- **Relative paths that only resolved from the repo root.** `google-docs.md` cited `storage-setup.md` as a sibling when it sits one level up; `storage-contract.md` cited its own siblings by full repo path and `handover-protocol.md` by bare name; `brand-os-handover` and `workspace-setup` each named a cross-skill file without the `../` that makes it resolvable. Every intra-package reference now resolves from the file that makes it.

## v0.3.1 — Post-release hardening

Fixes from the v0.3 manual test sweep that didn't block shipping 0.3.0: plumbing, drift, and spec gaps, no scoring-engine or interview-quality defects.

### Fixed
- **Storage resolution no longer drifts across skills.** The handover-cache and workspace-config resolution rules were restated in five places and had gone out of sync — most consumers were missing the null-locator handling brand-discovery had. Consolidated into one shipped reference every skill points at.
- **Page-prefix and stale-cache handling defined for the first time.** A brand's configured ID prefix is now read back and used consistently by every writer, instead of never being read at all. Cached handover status maps are trusted for routing but re-verified before any write.
- **brand-filter's filter set no longer changes mid-loop.** A proposal containing copy the original input lacked used to leave it ambiguous whether the Voice and Pillar-fit filters should join the re-score. They don't — the set freezes at diagnosis.
- **brand-filter's cross-run pattern check is now an explicit ask**, not a silent skip on an unevaluatable precondition.
- **agent-persona's minimal config now stamps the same schema version** as every other writer.
- **`package.sh` no longer leaves stray `.DS_Store` files in the public repo's working tree.**

### Changed
- **All nine skills are reachable in the reference dev workspace**, not just four — the operational layer (`brand-filter`, `on-voice`, `brand-brief`) and `agent-persona` are now mirrored alongside the original four.
- **Brand OS runs on any harness that supports the Agent Skills format** — now stated explicitly in the README, not just implied.

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
