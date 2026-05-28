# Changelog

## v0.2.1 — Public Release
*Released 2026-05-27*

- Published to [gitlab.com/atmo-studio/brand-os](https://gitlab.com/atmo-studio/brand-os)
- Repo restructured as a distribution package: root mirrors the installable plugin, dev files separated

---

## v0.2.0 — Beta Ready
*Released 2026-05-27*

### New skills
- **workspace-setup** — Guided 4-phase agent architecture design. Detects whether an existing workspace config is present and scaffolds accordingly: fresh installs build from scratch, existing workspaces get Brand OS added as a new project module.
- **brand-os-handover** — Structured session handover with formatted resume prompts. Called automatically by brand-discovery at section end or mid-section pause.
- **session-handover** — Generic session log skill, usable outside Brand OS for any focused work session.

### Improvements to brand-discovery
- **conversation-notes** — Handover now captures in-flight conversational state (working candidates, interview position, decisions not yet in Notion, open questions) and embeds it directly in the resume prompt. Sessions no longer restart from scratch.
- **Context window management** — Explicit 70% check at the start of each page. If context is at or above threshold, the skill completes the current page, writes to Notion, and invokes handover before proceeding.
- **Status routing** — Status → `In Progress` is now step 0 of each page interview.
- **Database session lock** — If the user provides a Notion database URL at session start, it is accepted as the confirmed selection and the discovery search is skipped.
- **Selective context loading** — Completed pages from the current section load automatically at session start.
- **Stuck-state protocol** — Two-loop-type handling: conceptual loops and language loops, each with defined resolution paths.
- **Skip guard** — Skipping a page interview requires explicit user instruction.
- **Advance gate timing** — The page-advance gate only appears after an analytical pass is fully closed.
- **Candidate extraction** — Round 0 candidates must be grounded in explicit language from prior pages.
- **All-complete moment** — Rewrote the Voice & Messaging completion response as a genuine milestone.

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
