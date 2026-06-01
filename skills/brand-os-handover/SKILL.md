---
name: brand-os-handover
description: Produces the session handover for Brand OS — writes the session
  record and delivers the resume prompt in chat. Called by brand-discovery at
  the end of each section or on mid-section pause. Not invoked directly by users.
---

# Brand OS — `brand-os-handover`
*Handover skill · Called by brand-discovery at section end or mid-section pause*

---

## What You Are

You produce the session handover for Brand OS: a document written to the user's
workspace as a persistent record, and a copy-paste resume prompt printed in chat.
You are called by `brand-discovery` — you don't run independently.

---

## Context You Receive

brand-discovery passes you the following before invoking you. Use it directly —
do not re-query Notion.

- **trigger** — `section-complete` or `mid-section-pause`
- **section** — name of the section just worked on
- **pages-completed** — list of BRND IDs + page names completed this session
- **pages-remaining** — list of BRND IDs + page names not yet completed in this
  section (empty if trigger is `section-complete`)
- **sections-complete** — number of sections fully done (0–4)
- **sections-remaining** — ordered list of section names not yet complete
- **next-page** — BRND-[N] · [Page Name] to pick up at next session
- **confirmed-drafts** — pages the user confirmed but did not write to Notion this
  session, each with its confirmed content (may be empty)
- **conversation-notes** — structured key-value bullets capturing in-flight context
  the next session needs: working candidates discussed but not confirmed, decisions
  made in conversation that aren't in Notion yet, state of an in-progress interview
  (which round, what was asked, what the user said), flags or open questions.
  Format is key-value bullets, not freeform prose. May be empty.
- **brand-os-db-id** — the confirmed Notion database ID for the user's Brand OS
  workspace. Cache this in the handover doc so future sessions can use it directly
  instead of re-running database discovery.
- **status-map** — full 11-page status map compiled by the orchestrator at session
  end. One entry per BRND page: `BRND-N · [Page Name]: [Complete | In progress | Not started]`.
  Cache this in the handover doc so resumed sessions skip all 11 Notion row fetches.

---

## Step 1 · Ask (section-complete only)

If trigger is `section-complete` AND `sections-complete` is less than 4:

Use the section-close line from the table below for the section that just completed, then present:

`AskUserQuestion`
> "[Section-close line]"
- Start a new session now
- I'll come back later

Either way, proceed to Step 2. Do not continue into the next section.

**Section-close language:**

| Section completed | Close line |
|---|---|
| Foundations | "Foundations are done — purpose, vision, mission, and values are in the knowledge base. That's the core of everything that follows. Next up: Audience & Market." |
| Audience & Market | "Audience & Market done — ICPs, competitive landscape, and positioning are locked. You know who this brand is for and where it stands. Next up: Brand Character." |
| Brand Character | "Brand Character done — personality and visual identity are in. The brand has a shape now. Final section: Voice & Messaging." |

If trigger is `section-complete` AND `sections-complete` is 4 (Voice &
Messaging just finished, full knowledge base complete): skip this step. Do
not ask whether to start a new session — there is nothing to resume. Proceed
directly to Step 2 to write the handover doc, then to Step 4 for the
all-complete close.

If trigger is `mid-section-pause`: skip this step and go directly to Step 2.

---

## Step 2 · Write the handover document

Write a markdown file to the agent's current workspace — not to Notion.
This file is the persistent session record. The resume prompt is delivered
in chat (Step 3) — do not include it here.

Filename: `YYYY-MM-DD_brand-os-handover-[section-name-kebab].md`

**Template — section complete:**

```markdown
# Brand OS — Session Handover
[section] · [Date]

## Workspace
Brand OS database ID: `[brand-os-db-id]`
(Future sessions can use this directly — no need to re-run discovery.)

## Completed this session
[section] — all pages complete and written to Notion.
Pages: [pages-completed as BRND-N · Page Name list]

## Current state
[sections-complete] of 4 sections complete.
Sections remaining: [sections-remaining in order]

## Status Map
[Render status-map verbatim — one line per BRND page, e.g.:]
BRND-1 · Purpose, Vision & Mission: Complete
BRND-2 · Brand Values: Complete
...

## Confirmed drafts (not yet written to Notion)
[For each item in confirmed-drafts:]
### BRND-[N] · [Page Name]
[confirmed content]

[Omit this section entirely if confirmed-drafts is empty]

## Context for next session
[Render conversation-notes verbatim as key-value bullets.
Omit this section entirely if conversation-notes is empty.]

## To continue

Paste this into a new Brand OS session to pick up where you left off:

> "Resume Brand OS. Handover: [YYYY-MM-DD_brand-os-handover-[section-name-kebab].md]. Pick up where we left off — [first item in sections-remaining], [next-page]. Context from last session: [2–4 condensed bullets distilled from conversation-notes, inline; omit the 'Context from last session:' clause entirely if conversation-notes is empty]."
```

**Template — mid-section pause:**

```markdown
# Brand OS — Session Handover
[section] · [Date] · Session paused mid-section

## Workspace
Brand OS database ID: `[brand-os-db-id]`
(Future sessions can use this directly — no need to re-run discovery.)

## Completed this session
Pages completed: [pages-completed as BRND-N · Page Name list]
Pages remaining in this section: [pages-remaining as BRND-N · Page Name list]

## Current state
Section [sections-complete + 1] of 4 in progress.
[count of pages-completed] of [total pages in section] pages complete.

## Status Map
[Render status-map verbatim — one line per BRND page, e.g.:]
BRND-1 · Purpose, Vision & Mission: Complete
BRND-2 · Brand Values: Complete
...

## Confirmed drafts (not yet written to Notion)
[Same as above — omit section if empty]

## Context for next session
[Render conversation-notes verbatim as key-value bullets.
Mid-section pauses almost always carry conversation-notes — this section
is critical for resuming an in-progress interview without losing state.
Omit only if conversation-notes is empty.]

## To continue

Paste this into a new Brand OS session to pick up where you left off:

> "Resume Brand OS. Handover: [YYYY-MM-DD_brand-os-handover-[section-name-kebab].md]. Pick up where we left off — [section], [next-page]. Context from last session: [2–4 condensed bullets distilled from conversation-notes, inline; omit the 'Context from last session:' clause entirely if conversation-notes is empty]."
```

---

## Step 3 · Close

**If trigger is `section-complete` AND `sections-complete` is 4** (all four
sections done), use the all-complete close in Step 4 instead of this step.

Otherwise, print in chat:

> "You're done for now. Here's your prompt for next time — paste it into a
> new Brand OS session to pick up right where you left off:"
>
> ---
> *"Resume Brand OS. Handover: [handover-filename]. Pick up where we left off —
> [section or next section], [next-page]. Context from last session:
> [2–4 condensed bullets distilled from conversation-notes, embedded inline].
> [Omit the 'Context from last session:' clause entirely if conversation-notes
> is empty.]"*
> ---

Condense conversation-notes to 2–4 bullets and embed them directly in the
resume prompt. The filename tells the next session where to find the handover
doc — both the status map and the DB ID live there. The context bullets
remain inline so the prompt is readable without opening the file.

Print the prompt block once, directly in chat. Do not refer the user to the
handover file for this. Do not print anything after the block.

---

## Step 4 · All-complete close (Voice & Messaging final)

Use this step instead of Step 3 only when `trigger` is `section-complete` and
`sections-complete` is 4 — i.e. the user has just finished Voice & Messaging
and the full brand knowledge base is built.

Still write the handover doc (Step 2). Then, in chat, deliver the all-complete
close. It must do four things: celebrate, educate, suggest what's next, and
surface the menu of other Brand OS modules.

Tone: warm, specific, genuinely excited. Reference what was actually built —
the agent has the section names, the page names, and the confirmed content in
context. Do not be generic or effusive. Do not list every page mechanically;
speak to the shape of what now exists.

**Print in chat, in this order:**

**1 · Celebrate (1–2 sentences).**
Acknowledge the milestone. The founder just defined what the brand stands for,
who it's for, where it sits in the market, and how it sounds. That's the
foundation every creative decision builds on — and most brands never get this
written down. Make it land. Don't be effusive.

Example register:
> *"You just defined what [brand name] stands for, who it's for, where it
> sits in the market, and how it sounds. That's the foundation every
> creative decision builds on and most brands never get it written down."*

**2 · Educate — what they now have.**
Name the artifacts, grouped by section. Use the actual content where helpful
(reference the purpose statement, the ICPs, the positioning, the personality
traits, the messaging pillars, the taglines — whatever was confirmed). Frame
it as one connected system, not eleven separate documents:

- **Foundations** — purpose, vision, mission, values
- **Audience & Market** — ICPs, competitive landscape, positioning
- **Brand Character** — personality, visual identity direction
- **Voice & Messaging** — story, voice, messaging pillars, taglines

All connected. All in one place. All queryable by any agent or teammate.

**3 · Suggest what's next (concrete, prioritised).**
Surface specific next moves the founder can take immediately:

- Feed the Voice & Tone page to their writing agent so all future copy lands
  in brand voice
- Use the visual identity direction to brief a designer (or Atmo) on logo,
  type, colour, and system
- Use the positioning and messaging pillars as the spine of the website,
  pitch deck, and sales materials
- Run a brand review session to check existing materials against the new
  foundation — what's on-brand, what needs to be redone

**4 · Surface the menu — other Brand OS modules.**
Introduce the Phase 2 and Phase 3 modules as the natural next step now that
the knowledge base is built:

- **Linear module (Brand OS Phase 2)** — set up project and task management
  wired to the brand context, so every project carries the brand thread
- **Figma module (Brand OS Phase 3)** — set up the design system and
  connect it to the brand foundation built here

Frame these as available when they're ready — not pressure. The brand
knowledge base stands on its own; the modules extend it.

**Close.**
End with a short line that hands the room back to the founder. Do not print a
resume prompt — there is nothing to resume. The handover doc already records
the final state for their records.
