---
name: session-handover
description: Writes a session log and prints a resume prompt. Use at the end of
  any focused work session — especially when the context window is getting long,
  the user is wrapping up, or work has a clear continuation point. Can be invoked
  directly (gather context from conversation) or called by another skill that
  passes a pre-assembled context block. Writes to memory/sessions/ using the
  AGENTS.md session log template.
---

# `session-handover`
*Generic handover skill · Standalone or called by another skill*

---

## What You Are

You write the session record and print the resume prompt. That's it.

You're invoked in two modes:

- **Called by another skill** — the calling skill passes a structured context block
  before invoking you. Use it directly; do not re-derive what's already there.
- **Invoked directly** — the user ran `/handover` or asked you to wrap up the
  session. Gather context from the conversation yourself.

Either way, the output is the same: a session log written to `memory/sessions/`
and a paste block printed in chat.

---

## Context Block (when called by another skill)

The calling skill passes context as structured text before invoking you. Expected fields:

```
HANDOVER CONTEXT
project: [project name and folder path]
topic-slug: [short-kebab-case topic for the filename, e.g. brand-os-workspace-setup]
what-happened: [1–2 sentence summary of the session]
decisions: [list of key choices made, one per line]
context-captured: [facts worth knowing in future sessions, one per line]
open-questions: [unresolved items, one per line — omit if none]
next-task: [exact first task for the next session — one sentence]
read-first:
  1. [file path] — [what to check]
  2. [file path] — [what to check]
  3. [file path — max 3] — [what to check]
```

All fields except `project` and `what-happened` are optional. Omit any section
with nothing to say — don't force empty entries.

**If a field is missing or thin**, fill it from the conversation rather than
leaving it blank or asking the user to supply it.

---

## Step 1 · Determine the filename

Use `topic-slug` from the context block if present. Otherwise derive a short
kebab-case slug from the session's main topic — 2–4 words, no dates, no filler.

Filename: `YYYY-MM-DD_[topic-slug].md`

Use today's date. If today's date isn't available in context, check the
environment (`date` command or system context). Do not ask the user.

---

## Step 2 · Write the session log

Write to `memory/sessions/[filename]` using the template below.

Use the AGENTS.md session log template as the canonical format. This skill
mirrors it exactly — do not invent new sections.

**Template:**

```markdown
# Session: YYYY-MM-DD — [Topic]

**What happened:** [1–2 sentence summary of the session.]

## Decisions
[Key choices made, with brief rationale if non-obvious. One decision per bullet.
Frame as "don't re-litigate unless raised."]

## Context captured
[Facts worth knowing in future sessions — about the project, the user, decisions
that shaped the work. Omit this section if nothing new was captured.]

## Open questions / follow-ups
[Unresolved items. Check this at next session start — carry forward what's still
live, promote resolved items, discard stale ones. Omit if none.]

## Next Session
[Include only when the session had deep focused work on a specific project with
a clear continuation point, or when ending early because context is getting long.
Skip for general or multi-topic sessions.]

**Project:** [project name and path]
**Pick up at:** [one sentence — the exact next task]
**Read first:**
1. [file 1] — [what to check]
2. [file 2] — [what to check]
3. [file 3 — max 3] — [what to check]

> Paste this to continue:
>
> I'm continuing [project name] at [path]. Start by reading [file 1], then [file 2].
> First task: [exact task]. [Any critical context a fresh instance would miss — one sentence max.]
```

Session logs are write-once. Do not edit an existing log — create a new one.

**If no file write tools are available** (non-Cowork environment): skip the
file write. Print the full log content as a markdown code block in chat,
clearly labeled: *"No file write available — copy this to memory/sessions/[filename]:"*
Then proceed to Step 3.

---

## Step 3 · Print the resume prompt

After writing (or printing) the log, print the paste block directly in chat.
Pull it from the `## Next Session` section of the log you just wrote.

If there is no `## Next Session` section (general or multi-topic session),
print a brief close instead:

> "Session wrapped. Log written to `memory/sessions/[filename]`."

**If there is a `## Next Session` section**, print:

> "Done. Here's your prompt for next time:"
>
> ---
> [paste block from ## Next Session]
> ---

Print this once. Do not add context, explanation, or follow-up after the block.

---

## Environment Fallback Summary

| Capability | With file tools | Without file tools |
|---|---|---|
| Write session log | Write to `memory/sessions/` | Print as code block for manual save |
| Print resume prompt | Always | Always |
| AskUserQuestion widget | Use if available | Use plain text |

The skill must produce useful output in any environment. The session log content
is the constant — only the delivery mechanism varies.

---

## What Not To Do

- Do not ask the user to summarize the session. Derive it from the conversation.
- Do not ask which files to list in "Read first." Pick the most relevant ones
  from what was worked on.
- Do not write the resume prompt to the session log file. The log is the record;
  the prompt is a chat deliverable.
- Do not include meta-commentary about the handover process in chat. Write the
  log, print the prompt, stop.
- Do not edit an existing session log. Write a new file.
