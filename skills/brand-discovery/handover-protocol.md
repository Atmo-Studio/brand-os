# Brand OS — Session Handover Protocol
*Part of the `brand-discovery` skill · Loaded at section end or mid-section pause*

This protocol produces the Brand OS session handover: a document written to the
user's workspace as the persistent state record (the startup cache Phase 1 Step 0
reads next session), and a copy-paste resume prompt printed in chat. It runs inside
the same session as the interview — no separate skill, no context passing across
a boundary. Everything referenced below is already in your context; compile it,
don't re-query the knowledge base.

---

## Context to compile

Before writing anything, assemble:

- **trigger** — `section-complete` or `mid-section-pause`
- **section** — name of the section just worked on
- **dimensions-completed** — list of IDs + dimension names completed this session
- **dimensions-remaining** — list of IDs + dimension names not yet completed in this
  section (empty if trigger is `section-complete`)
- **sections-complete** — number of sections fully done (0–4)
- **sections-remaining** — ordered list of section names not yet complete
- **next-dimension** — [ID] · [Dimension Name] to pick up at next session
- **confirmed-drafts** — dimensions the user confirmed but that were not written to
  the knowledge base this session, each with its confirmed content (may be empty;
  this is also where unreachable-backend sessions park confirmed content for the
  next connected session to sync)
- **storage** + **locator** — the locked backend type and locator for this session.
  Cache both in the handover doc so future sessions skip storage resolution entirely.
- **project_id** — the `workspace-config.md → projects[]` id this brand belongs to
  (`default` where none is defined). Stamps the handover with the brand it came from
  so Step 0 can filter candidates before sorting by recency.
- **status-map** — full 11-dimension status map. Use the Status values you've read or
  updated this session; for dimensions not touched, use the last-known status from
  the backend or the cached map loaded at startup. One entry per dimension:
  `BRND-N · [Dimension Name]: [Complete | In progress | Not started]`
  (using the workspace's configured prefix)
- **conversation-notes** — structured key-value bullets capturing live
  conversational state not yet reflected in the knowledge base: working candidates
  discussed but not confirmed (`working-candidate:`), decisions made in conversation
  that aren't written yet (`decision-pending:`), the state of an in-progress
  interview — which round, what was asked, what the user said
  (`interview-state:`), and open questions or flags (`open-question:`).
  Key-value bullets, not freeform prose. May be empty.
- **dimensions-skipped** — any dimensions the user explicitly skipped this session
  (see the skip rule in SKILL.md), so the next session revisits them. May be empty.

*(Legacy note: handovers written before v0.3 used `pages-*` field names and a
`Brand OS database ID:` workspace field. Step 0 in SKILL.md still reads those —
treat `Brand OS database ID` as `storage: notion` + locator. Handovers written
before `Project:` existed carry no project stamp, and Step 0 falls back to
matching on `Locator:` — which is why the locator stays in the block rather than
being replaced by the project stamp. New handovers always use the format below.)*

*(`Project:` is the `project_id` of the `workspace-config.md → projects[]` entry
this brand belongs to — `default` where none is defined. It exists so Step 0 can
tell one brand's handover from another's before any storage resolution happens.
In a workspace where a project's folder is the repository root, this stamp is the
only thing that distinguishes a real brand's handover from one written during a
test or dev run.)*

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

Write a markdown file into **the current project's folder** — the folder for the
brand this session is scoped to, not the workspace root and not the knowledge
base backend. This matters in multi-brand workspaces: SKILL.md Step 0 searches
the project folder for `*_brand-os-handover-*.md` and deliberately does not search
workspace-wide, so a handover written anywhere else is invisible to resume. When
no projects are defined, the workspace root *is* the project folder.

This file is the persistent session record and the startup cache for the next
session. It ends with the same resume prompt that Step 3 prints in chat — the doc
carries it so the file stands alone, chat carries it so the user can paste without
opening anything.

Filename: `YYYY-MM-DD_brand-os-handover-[section-name-kebab].md`

**If no file-write tools are available** (chat-only runtime): do not skip the
handover. Print the full handover document as a single markdown code block,
clearly labeled: *"No file write available — save this as
`[filename]` in your workspace so your next session can resume from it:"*
Then proceed to Step 3. The content is the constant; only the delivery
mechanism changes.

**Template — section complete:**

```markdown
# Brand OS — Session Handover
[section] · [Date]

## Workspace
Project: [project_id]
Storage: [storage]
Locator: `[locator]`
(Future sessions can use this directly — no need to re-run storage resolution.)

## Completed this session
[section] — all dimensions complete and written to the knowledge base.
Dimensions: [dimensions-completed as ID · Dimension Name list]

## Current state
[sections-complete] of 4 sections complete.
Sections remaining: [sections-remaining in order]

## Status Map
[Render status-map verbatim — one line per dimension, e.g.:]
BRND-1 · Purpose, Vision & Mission: Complete
BRND-2 · Brand Values: Complete
...

## Confirmed drafts (not yet written to the knowledge base)
[For each item in confirmed-drafts:]
### [ID] · [Dimension Name]
[confirmed content]

[Omit this section entirely if confirmed-drafts is empty]

## Dimensions skipped
[List dimensions-skipped with a one-line reason each. Omit entirely if empty.]

## Context for next session
[Render conversation-notes verbatim as key-value bullets.
Omit this section entirely if conversation-notes is empty.]

## To continue

Paste this into a new Brand OS session to pick up where you left off:

> "Resume Brand OS. Handover: [YYYY-MM-DD_brand-os-handover-[section-name-kebab].md]. Pick up where we left off — [first item in sections-remaining], [next-dimension]. Context from last session: [2–4 condensed bullets distilled from conversation-notes, inline; omit the 'Context from last session:' clause entirely if conversation-notes is empty]."
```

**Template — mid-section pause:**

```markdown
# Brand OS — Session Handover
[section] · [Date] · Session paused mid-section

## Workspace
Project: [project_id]
Storage: [storage]
Locator: `[locator]`
(Future sessions can use this directly — no need to re-run storage resolution.)

## Completed this session
Dimensions completed: [dimensions-completed as ID · Dimension Name list]
Dimensions remaining in this section: [dimensions-remaining as ID · Dimension Name list]

## Current state
Section [sections-complete + 1] of 4 in progress.
[count of dimensions-completed] of [total dimensions in section] complete.

## Status Map
[Render status-map verbatim — one line per dimension, e.g.:]
BRND-1 · Purpose, Vision & Mission: Complete
BRND-2 · Brand Values: Complete
...

## Confirmed drafts (not yet written to the knowledge base)
[Same as above — omit section if empty]

## Dimensions skipped
[Same as above — omit if empty]

## Context for next session
[Render conversation-notes verbatim as key-value bullets.
Mid-section pauses almost always carry conversation-notes — this section
is critical for resuming an in-progress interview without losing state.
Omit only if conversation-notes is empty.]

## To continue

Paste this into a new Brand OS session to pick up where you left off:

> "Resume Brand OS. Handover: [YYYY-MM-DD_brand-os-handover-[section-name-kebab].md]. Pick up where we left off — [section], [next-dimension]. Context from last session: [2–4 condensed bullets distilled from conversation-notes, inline; omit the 'Context from last session:' clause entirely if conversation-notes is empty]."
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
> [section or next section], [next-dimension]. Context from last session:
> [2–4 condensed bullets distilled from conversation-notes, embedded inline].
> [Omit the 'Context from last session:' clause entirely if conversation-notes
> is empty.]"*
> ---

Condense conversation-notes to 2–4 bullets and embed them directly in the
resume prompt. The filename tells the next session where to find the handover
doc — both the status map and the storage locator live there. The context
bullets remain inline so the prompt is readable without opening the file.

Print the prompt block once, directly in chat. Do not refer the user to the
handover file for this. Do not print anything after the block.

---

## Step 4 · All-complete close (Voice & Messaging final)

Use this step instead of Step 3 only when `trigger` is `section-complete` and
`sections-complete` is 4 — i.e. the user has just finished Voice & Messaging
and the full brand knowledge base is built.

Still write the handover doc (Step 2), **with one change: omit the `## To continue`
block entirely.** That block and its resume prompt exist to bootstrap the next
session, and there is no next session — every dimension is Complete. Its fields
(`sections-remaining`, `next-dimension`) are undefined here, so rendering it would
print empty placeholders. Replace it with a short closing block instead:

```markdown
## Brand OS complete
All 11 dimensions across all 4 sections are Complete as of [Date].
There is nothing left to resume — this document is the final state record.
```

Everything above that block (Workspace, Status Map, etc.) is written as normal.

Then, in chat, deliver the all-complete
close. It must do four things: celebrate, educate, suggest what's next, and
surface the menu of other Brand OS modules.

Tone: warm, specific, genuinely excited. Reference what was actually built —
you have the section names, the dimension names, and the confirmed content in
context. Do not be generic or effusive. Do not list every dimension
mechanically; speak to the shape of what now exists.

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

The knowledge base is built. The operational skills now run on it:

- **on-voice** — draft the next post, email, or page in the brand's voice,
  grounded in the Voice & Tone guide just written
- **brand-filter** — run the next campaign idea, partnership, or draft
  through the brand before committing to it, and check existing materials
  against the new foundation
- **brand-brief** — package the brand for a designer, a collaborator, or
  another AI tool; the visual identity direction can brief a designer (or
  Atmo) directly
- Use the positioning and messaging pillars as the spine of the website,
  pitch deck, and sales materials

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
