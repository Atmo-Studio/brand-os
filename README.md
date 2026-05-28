# Brand OS

**Agent-powered brand operating system.** A structured knowledge base that captures your brand strategy — built in Notion, activated by an agent.

Brand OS guides you through a complete brand discovery interview across 11 pages: purpose, values, ideal customer profiles, competitive positioning, brand personality, visual identity, brand story, voice & tone, messaging pillars, and taglines. The results live in a Notion workspace your agent can read at any time.

---

## Free: workspace-setup

**workspace-setup** is included in this repository at no cost. It helps you design and build your Claude project architecture — projects, custom instructions, and context documents — so every conversation starts from the right context.

→ [Install workspace-setup](#install-workspace-setup-free)

---

## Brand OS Plugin

The full plugin includes four skills and the Notion template:

| Skill | What it does |
|-------|-------------|
| **brand-discovery** | Guided brand interview across 11 Notion pages. Resumes exactly where your last session ended. |
| **workspace-setup** | Designs and builds your agent project architecture. |
| **brand-os-handover** | Structured session close with formatted resume prompts. Called automatically. |
| **session-handover** | Generic session log for any focused work session. |

**[Purchase Brand OS →](https://atmostudio.lemonsqueezy.com/checkout/buy/78fc0906-c7df-4891-86bf-fe833f0056bf)**

One-time purchase. Includes lifetime updates — re-download from your LemonSqueezy account at any time.

---

## Prerequisites

Before installing either option, you'll need:

1. An agent environment that supports skills — Claude Cowork, Claude Code, or any harness using `.claude/skills/`
2. A Notion account with the Notion MCP connected
3. The [Brand OS Notion template](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143) duplicated to your workspace (required for the full plugin; not needed for workspace-setup alone)

---

## Install: workspace-setup (free)

1. Copy `skills/workspace-setup/` into your agent's skills directory

   Most harnesses use `.claude/skills/` — check your harness documentation if unsure.

2. Run `workspace-setup` in your agent

**Note:** workspace-setup optionally uses `session-handover` when long sessions hit a project limit. The Brand OS plugin includes it; for standalone use, the skill will still work and will simply tell you to start a new session manually.

---

## Install: Brand OS Plugin (paid)

After purchasing, download `brand-os.plugin` from your LemonSqueezy account.

**Option A — Cowork (Claude desktop app)**

Drag `brand-os.plugin` into Cowork's plugin browser, or use **Install from file**. Skills load automatically.

Skip to [Notion setup](#notion-setup).

**Option B — Universal (manual)**

Copy all four folders from `skills/` into your agent's skills directory.

For workspace-default setup (Brand OS as your primary agent context): also copy `CLAUDE.md` to your agent's global system prompt or workspace-level context file.

For project-scoped setup: copy `CLAUDE.md` to that project's root folder.

Continue with [Notion setup](#notion-setup).

---

## Notion Setup

**Step 1: Connect the Notion MCP**

Add the Notion MCP in your agent's settings. Search for "Notion" in the MCP settings menu, or configure it manually — a reference `.mcp.json` is included in the plugin package.

**Step 2: Duplicate the template**

→ [Open Brand OS template](https://atmo-studio.notion.site/BRAND-Home-358d14426511801e906eca1fc22181eb?pvs=143)

Press **Duplicate** to add it to your Notion workspace.

**Step 3: Add your database ID**

Copy the database ID from your Brand OS database URL. Add it to `CLAUDE.md`:

```
Brand OS database ID: [paste your database ID here]
```

**Step 4: Run workspace-setup**

Run `workspace-setup` to configure your agent environment and connect Brand OS to your project.

Once setup is complete, run `brand-discovery` to begin the brand interview.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for full release history.

---

## License

See [LICENSE.md](./LICENSE.md). workspace-setup is free for personal and commercial use. The Brand OS plugin (brand-discovery and related skills) is a commercial product.

---

## About

Built by [Atmo Studio](https://atmo.studio).
