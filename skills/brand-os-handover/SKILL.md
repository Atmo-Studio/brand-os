---
name: brand-os-handover
description: Deprecated as of v0.2.3 — the Brand OS session handover now lives
  inside the brand-discovery skill as handover-protocol.md and runs in-session,
  with no cross-skill invocation. Retained for one release as a compatibility
  redirect. Never invoked directly by users; do not trigger this skill from
  user input.
license: MIT
metadata:
  author: Atmo Studio
  version: "0.2.3"
  status: deprecated
---

# `brand-os-handover` — deprecated redirect

This skill's content moved in v0.2.3. The Brand OS session handover is now part
of `brand-discovery` itself: load `handover-protocol.md` from the
`brand-discovery` skill folder (installed alongside this one, at
`../brand-discovery/handover-protocol.md`) and follow it end to end.

The move removed the cross-skill invocation this file used to depend on — the
handover now runs inside the same session as the interview, so nothing is
passed across a skill boundary and activation cannot fail.

If you were invoked anyway (an older orchestrator or a stale reference), do not
error out: load `../brand-discovery/handover-protocol.md`, compile the context
it lists from the current conversation, and execute it. The user experience
must be identical either way.

*This folder will be removed in the release after v0.2.3.*
