# Brand OS

Brand OS is a modular brand operating system. It structures brand intelligence across the tools founders already use, so the brand becomes something the team can speak with, filter decisions through, and create from at scale. A living system that compounds as the brand grows.

This version ships three foundational modules: workspace configuration, a connected knowledge base, and a guided brand discovery experience. Together they give founders a structured home for their brand thinking and a foundation their team, contractors, and agents can all operate from.

![Brand OS](docs/brand-os_hero_2x1.png)

---

## Modules

### Core

The brand's base layer. Core configures your agent workspace, sets the brand's personality, and maintains continuity across sessions. You start here. The brand becomes present, responsive, and yours.

*Skills: workspace-setup, agent-persona, session-handover*

&nbsp;

### Memory

Your brand intelligence begins compounding. Memory connects your knowledge base and gives the brand a structured, living record you and your team operate from. New hires onboard from it. Agents read from it. You stop re-explaining everything from scratch.

*Skills: notion-connect*

*Resources: [Knowledge Base](https://www.notion.com/templates/brand-knowledge-base?clientBuildTarget=client)*

*Connections: Notion*

&nbsp;

### Worldview

The brand develops conviction. A framework-grounded interview extracts your thinking across eleven sections and writes it into the knowledge base. Purpose, values, positioning, personality, voice, story. The instincts you carry become infrastructure your team can operate from without you in the room.

*Skills: brand-discovery*

*Resources: [Knowledge Base](https://www.notion.com/templates/brand-knowledge-base?clientBuildTarget=client)*

*Connections: Notion*

---

## Getting Started

You need two things: an agent environment that supports skills (`.claude/skills/` or equivalent), and a Notion account for the Memory and Worldview modules.

### Option A: Cowork plugin (Claude desktop app)

**[Download brand-os.plugin](https://gitlab.com/atmo-studio/brand-os/-/raw/main/brand-os-v0.2.3.plugin)**

Drag `brand-os.plugin` into Cowork's plugin browser or use **Install from file**. Skills load automatically. Skip to [Set up the Knowledge Base](#set-up-the-knowledge-base).

### Option B: Universal (manual)

Copy all folders from `skills/` into your agent's skills directory. Most harnesses use `.claude/skills/`.

Brand OS also ships a baseline agent character in `SOUL.md`. If you don't already have your own agent workspace, copy `SOUL.md` into your agent's workspace-level context so the skills have a personality layer to run on. If you already have a CLAUDE.md/AGENTS.md of your own, skip this — your setup takes precedence and the skills layer on top.

workspace-setup will detect which mode you're in and adapt accordingly.

### Connect Notion

Add the Notion MCP to your agent settings. Most harnesses have a first-party MCP settings menu. Search for "Notion" and follow the prompts.

Only if your agent has **no** built-in Notion connector, add the Notion MCP server (`@notionhq/notion-mcp-server`) to *your agent's own* MCP config, using a token from [notion.so/my-integrations](https://www.notion.so/my-integrations).

> ⚠️ **Do not create a `.mcp.json` file inside the plugin folder.** Some agents auto-load it, and a config with a placeholder token will silently override a Notion connection you already have working — breaking it with no obvious cause. Configure Notion in your agent's own settings, not in the plugin.

### Set up the Knowledge Base

→ [Open the Knowledge Base template](https://www.notion.com/templates/brand-knowledge-base?clientBuildTarget=client)

Press **Duplicate** to add it to your Notion workspace. You don't need to copy any IDs by hand — run **notion-connect** (below) and it finds the database, verifies it, and records the ID for you.

### Start

Run **workspace-setup** to configure your agent environment (optional if you already have one). Then run **notion-connect** to link your duplicated template, and **brand-discovery** to begin building your brand's worldview.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full release notes.

---

## About

Built by [Atmo Studio](https://atmo.studio). Brand OS is an Atmo product.

## License

MIT — see [LICENSE](./LICENSE). Free to use, modify, and build on.
