---
name: session-handover
description: Writes a session log and prints a resume prompt. Use at the end of
  any focused work session, especially when the context window is getting long,
  the user is wrapping up, or work has a clear continuation point. Can be invoked
  directly (gather context from conversation) or called by another skill that
  passes a pre-assembled context block. Writes to memory/sessions/. Not for
  closing Brand OS discovery sessions, which brand-discovery handles itself with
  the status map and database cache that resume depends on.
license: MIT
metadata:
  author: Atmo Studio
  version: "0.4.0"
---

# `session-handover`
*Generic handover skill. Standalone, or called by another skill*

---

## What You Are

You write the session record and print the resume prompt. That's it.

You're invoked in two modes:

- **Called by another skill.** The calling skill passes a structured context block
  before invoking you. Use it directly; do not re-derive what's already there.
- **Invoked directly.** The user ran `/handover` or asked you to wrap up the
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
open-questions: [unresolved items, one per line. Omit if none]
next-task: [exact first task for the next session, one sentence]
read-first:
  1. [file path]: [what to check]
  2. [file path]: [what to check]
  3. [file path]: [what to check]   # three at most
```

All fields except `project` and `what-happened` are optional. Omit any section
with nothing to say. Don't force empty entries.

**If a field is missing or thin**, fill it from the conversation rather than
leaving it blank or asking the user to supply it.

---

## Step 0

Six checks. Four run now, two run after the log exists, at Step 4.

**Report, don't resolve.** Surface what each check turns up and let the user decide. Never commit
on their behalf, never delete on your own judgment, and never guess at where an unfiled note
belongs.

**Answer from what the workspace already tells you.** Each check is a question. The workspace's own
instructions hold the answer: its tracker, its conventions, its repositories. Read them there
rather than asking the user to repeat them. Where a workspace has no answer, skip that check and
say so.

**Gather before you write.** Checks 1, 3, and 4 all read state. Collect them in one pass, then
write. Interleaving reads and writes turns a three-step close into a dozen, and a handover that
takes longer than the work it closes gets skipped.

### Now

**1. Unrouted facts.** Anything the session captured but never filed needs a home. Route what has
an obvious one and say what moved where. Anything unresolved, ambiguous, or possibly stale is a
question for the user, not a decision for you.

**2. Live work.** Update where each open thread stands in whatever the workspace uses to track it.
A thread leaves the tracker when the work finishes, not when the session ends.

**3. Dirty repos.** A nested repository is invisible to its parent's status, so its changes never
appear in the parent's output. Find every repository the session touched, then check each one.

```bash
find . -name .git -maxdepth 4 -not -path "./.git"   # nested repositories
git status --porcelain                              # in each, and at the root
```

Hand over a paste-ready commit command for anything dirty. Never commit for the user. Where the
same repository was listed at the last handover, say how many sessions it has been outstanding.

**4. External mirrors.** Where a local file mirrors a canonical source that lives elsewhere, push
the change or flag the divergence. Say which one you did.

### After the log

**5. Links resolve.** Every link in the log points at something that exists. Write the missing file
or drop the link.

**6. Continuation.** If the log carries a `## Next Session` section, write its pick-up line and
read-first list into the live-work tracker. A tracker gets read at the start of a session and a log
does not, so routing left only in the log never reaches the session that needed it.

---

## Step 1

Use `topic-slug` from the context block if present. Otherwise derive a short
kebab-case slug from the session's main topic: two to four words, no dates, no filler.

Filename: `YYYY-MM-DD_[topic-slug].md`

Use today's date. If today's date isn't available in context, check the
environment (`date` command or system context). Do not ask the user.

---

## Step 2

Write to `memory/sessions/[filename]` using `assets/session-log-template.md`. Create the directory
if it doesn't exist. Don't fail, and don't ask where to put the file.

The template is canonical, so don't invent new sections. One exception: where the host workspace
defines its own session log template, mirror that instead. The workspace's format wins.

**If no file write tools are available:** skip the
file write. Print the full log content as a markdown code block in chat,
clearly labeled: *"No file write available, copy this to memory/sessions/[filename]:"*
Then proceed to Step 3.

---

## Step 3

Print two things, in this order, and nothing after them.

**1. Where the log went.**

> Log written to `memory/sessions/[filename]`.

**2. The resume block**, exactly as written in `## Next Session`, wrapped in a fenced code block:

    Here's your prompt for next time:

    ```
    [the block]
    ```

**Leave the fence unlabelled.** A language tag makes some harnesses offer to run the contents, and
this is a prompt, not a command.

**Fence it rather than quoting it.** A fenced block gives the user one action to copy exactly the
prompt. A blockquote gives them no copy affordance and drags its `>` markers along with the text.

**The block goes last and nothing follows it.** A user copies from the end of the message, so
commentary after the block leaves them hunting for where it stops.

**Don't print what the checklist surfaced.** Dirty repositories, a diverged mirror, an unrouted
note: those went into the log, and the log is where they get picked up deliberately. Printing them
here invites the session to keep working instead of ending.

**The block has to stand alone.** The next session has its own startup context and this block, and
nothing else. Anything it needs that is in neither has to be in here.

Where there is no `## Next Session` section, print item 1, then close with one line:

> No handoff prompt created. Every running thread in this session has been fully closed.

This is the skill working as intended, the same as a clean run of any other check in this
workspace: silence after item 1 reads as a step skipped rather than a session that genuinely had
nothing left open, so say the second outcome plainly instead of leaving it to be inferred.

---

## Step 4

Run checks 5 and 6 from Step 0. Both needed the log to exist.

---

## Environment Fallback Summary

| Capability | With file tools | Without file tools |
|---|---|---|
| Write session log | Write to `memory/sessions/` | Print as code block for manual save |
| Print resume prompt, or say there isn't one | Always | Always |
| AskUserQuestion widget | Use if available | Use plain text |

The skill must produce useful output in any environment. The session log content
is the constant. Only the delivery mechanism varies.

---

## What Not To Do

- Do not ask the user to summarize the session. Derive it from the conversation.
- Do not ask which files to list in "Read first." Pick the most relevant ones
  from what was worked on.
- Do not include meta-commentary about the handover process in chat. Write the
  log, print the prompt or the no-prompt line, stop.
- Do not skip the workspace close-out because the session felt small. If the
  workspace defines a checklist, it runs.
- Do not edit an existing session log. Write a new file.
