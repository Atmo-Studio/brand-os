# Brand OS

Brand OS gives your brand a soul.

It extracts and structures brand intelligence across the tools founders already use, so the brand becomes critical infrastructure: something the team can speak with, filter decisions through, and create from at scale. Every module adds a layer to that system.

This version ships two modules: brand discovery, a framework-grounded interview that extracts and structures your brand thinking, and the knowledge base, where that intelligence lives and becomes something you can speak with, filter decisions through, and create from.

---

## Modules

### Core

The brand's base layer. Core configures your agent workspace, sets the brand's personality, and maintains continuity across sessions. You start here. The brand becomes present, responsive, and yours.

*Skills: workspace-setup, agent-persona, session-handover*

### Memory

Your brand intelligence begins compounding. Memory connects your knowledge base and gives the brand a structured, living record you and your team operate from. New hires onboard from it. Agents read from it. You stop re-explaining everything from scratch.

*Skills: notion-connect*
*Resources: [Knowledge Base](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)*
*Connections required: Notion*

### Worldview

The brand develops conviction. A framework-grounded interview extracts your thinking across eleven sections and writes it into the knowledge base. Purpose, values, positioning, personality, voice, story. The instincts you carry become infrastructure your team can operate from without you in the room.

*Skills: brand-discovery, brand-os-handover*
*Resources: [Knowledge Base](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)*
*Connections required: Notion*

---

## Prerequisites

1. An agent environment that supports skills (`.claude/skills/` or equivalent)
2. A Notion account with the Notion MCP connected (see below)
3. The Brand OS Notion template duplicated to your workspace

---

## Install

### Option A — Cowork plugin (Claude desktop app)

**[Download brand-os.plugin](https://gitlab.com/atmo-studio/brand-os/-/raw/main/brand-os-v0.2.2.plugin)**

Drag `brand-os.plugin` into Cowork's plugin browser or use **Install from file**. Skills are loaded automatically.

Skip to [Step 2: Duplicate the Notion template](#step-2-duplicate-the-notion-template).

### Option B — Universal (manual)

**Step 1: Copy the skills**

Copy all four folders from `skills/` into your agent's skills directory.

Most harnesses use `.claude/skills/` — check your harness documentation if unsure.

For **workspace-default setup** (Brand OS as your primary agent environment): copy `CLAUDE.md` to your agent's global system prompt or workspace-level context file.

For **project-scoped setup** (Brand OS active in one project): copy `CLAUDE.md` to that project's root folder or context file.

workspace-setup will detect which mode you're in and adapt accordingly.

**Step 2: Connect Notion MCP**

Add the Notion MCP to your agent settings. Most harnesses have a first-party MCP settings menu — search for "Notion" and follow the prompts.

For manual config, a reference `.mcp.json` is included in this package. Replace `YOUR_NOTION_API_KEY` with a Notion integration token from [notion.so/my-integrations](https://www.notion.so/my-integrations).

> **Recommended companion:** [notion-attachment-urls-mcp](https://github.com/skip-group/notion-attachment-urls-mcp) — enables loading Section Instructions directly from Notion attachment URLs.

---

## Step 2: Duplicate the Notion template

→ [Open Brand OS template](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)

Press **Duplicate** to add it to your Notion workspace. Once duplicated, copy the database ID from the Brand OS database URL and add it to `CLAUDE.md`:

```
Brand OS database ID: [paste your database ID here]
```

---

## Step 3: Start

Run **workspace-setup** to configure your agent environment for the first time, or to add Brand OS to an existing workspace.

Once setup is complete, run **brand-discovery** to begin the brand interview.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full release notes.

---

## About

Built by [Atmo Studio](https://atmo.studio). Brand OS is an Atmo product.
