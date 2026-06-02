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

*Resources: [Knowledge Base](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)*

*Connections: Notion*

&nbsp;

### Worldview

The brand develops conviction. A framework-grounded interview extracts your thinking across eleven sections and writes it into the knowledge base. Purpose, values, positioning, personality, voice, story. The instincts you carry become infrastructure your team can operate from without you in the room.

*Skills: brand-discovery, brand-os-handover*

*Resources: [Knowledge Base](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)*

*Connections: Notion*

---

## Getting Started

You need two things: an agent environment that supports skills (`.claude/skills/` or equivalent), and a Notion account for the Memory and Worldview modules.

### Option A: Cowork plugin (Claude desktop app)

**[Download brand-os.plugin](https://gitlab.com/atmo-studio/brand-os/-/raw/main/brand-os-v0.2.2.plugin)**

Drag `brand-os.plugin` into Cowork's plugin browser or use **Install from file**. Skills load automatically. Skip to [Set up the Knowledge Base](#set-up-the-knowledge-base).

### Option B: Universal (manual)

Copy all folders from `skills/` into your agent's skills directory. Most harnesses use `.claude/skills/`.

For **workspace-default setup** (Brand OS as your primary agent environment): copy `CLAUDE.md` to your agent's global system prompt or workspace-level context file.

For **project-scoped setup** (Brand OS active in one project): copy `CLAUDE.md` to that project's root folder or context file.

workspace-setup will detect which mode you're in and adapt accordingly.

### Connect Notion

Add the Notion MCP to your agent settings. Most harnesses have a first-party MCP settings menu. Search for "Notion" and follow the prompts.

For manual config, a reference `.mcp.json` is included in this package. Replace `YOUR_NOTION_API_KEY` with a Notion integration token from [notion.so/my-integrations](https://www.notion.so/my-integrations).

> **Recommended companion:** [notion-attachment-urls-mcp](https://github.com/skip-group/notion-attachment-urls-mcp) for loading Section Instructions directly from Notion attachment URLs.

### Set up the Knowledge Base

→ [Open the Knowledge Base template](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)

Press **Duplicate** to add it to your Notion workspace. Once duplicated, copy the database ID from the Brand OS database URL and add it to `CLAUDE.md`:

```
Brand OS database ID: [paste your database ID here]
```

### Start

Run **workspace-setup** to configure your agent environment. Once setup is complete, run **brand-discovery** to begin building your brand's worldview.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full release notes.

---

## About

Built by [Atmo Studio](https://atmo.studio). Brand OS is an Atmo product.
