# Brand OS

**Agent-powered brand operating system.** A Notion workspace that serves as your business's living brand knowledge base — activated by an agent that guides discovery and keeps your brand context current.

Brand OS works in any agent environment: Claude Cowork, Claude Code, Cursor, Hermes, OpenClaw, or any harness that supports skills and Notion MCP.

---

## What you get

**Four skills:**

- **workspace-setup** — Designs and builds your agent project structure. Works for first-time setup or adding Brand OS to an existing workspace.
- **brand-discovery** — Guides you through a structured brand interview across 11 Notion pages. Covers purpose, values, customers, positioning, personality, visual identity, story, voice, messaging, and taglines. Resumes exactly where the last session ended.
- **brand-os-handover** — Called automatically by brand-discovery to close sessions and generate resume prompts.
- **session-handover** — Generic session log for any focused work session.

**One Notion template:**

The Brand OS Notion workspace is the knowledge base layer. Duplicate it before running the agent. → [Brand OS on Notion](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)

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
