---
name: notion-connect
description: Deprecated as of v0.3 — storage connection now happens in-flow inside
  brand-discovery (Step A) and workspace-setup (Phase 3), with the storage-architect
  agent handling scaffolding, discovery, and verification. Brand OS now supports
  Notion and local markdown storage; there is no separate connect step
  for any of them. Retained for one release as a compatibility redirect for users
  and docs that still invoke "notion-connect" or "connect my Notion".
license: MIT
metadata:
  author: Atmo Studio
  version: "0.2.3"
  status: deprecated
---

# `notion-connect` — deprecated redirect

Brand OS storage connection moved in v0.3. There is no separate connect skill
anymore — for Notion or any other backend. The skill that needs storage asks for
it in-flow, the first time only, and remembers the grant in `workspace-config.md`.

If you were invoked anyway (an older doc, a stale reference, or a user asking to
"connect my Notion"), do not error out. Route by intent:

- **User wants to start or set up Brand OS** → invoke `brand-discovery`. Its
  Step A resolves storage, asks where the knowledge base should live if nothing
  is configured, handles the Notion template check and database discovery (via
  the `storage-architect` agent), and flows straight into the interview.
- **User is mid workspace-setup** → continue with `workspace-setup` Phase 3,
  which runs the same storage step when activating Brand OS.
- **User wants to switch or migrate storage** → deploy the `storage-architect`
  agent (`agents/storage-architect.md`) with a `migrate` mission.

The user experience must be seamless either way — no dead ends, no "run another
skill first."

*This folder will be removed in the release after v0.3.*
