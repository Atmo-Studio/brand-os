# Session log template

The canonical shape of a session log. Don't invent new sections, and omit any section with nothing
to say rather than filling it with placeholder text.

Where the host workspace defines its own template, that one wins.

Session logs are write-once. Adding to one later in the same session is fine. Editing one in a
later session is not: write a new log.

---

    # Session: YYYY-MM-DD, [Topic]

    **What happened:** [One or two sentences.]

    ## Decisions
    [Key choices made, with brief rationale where it isn't obvious. One per bullet.
    Written so a later session builds on them rather than reopening them.]

    ## Context captured
    [Facts worth knowing in future sessions: about the project, the user, or what
    shaped the work. Omit if nothing new was captured.]

    ## Open questions
    [Unresolved items, read at the start of the next session. Carry forward what is
    still live, promote what resolved, discard what went stale. Omit if none.]

    ## Handover hygiene
    [What the checklist could not close, and what it handed back. Dirty repositories
    with a paste-ready commit command, mirrors that diverged from their canonical
    source, notes still waiting on a routing decision. Where an item was also
    outstanding at the last handover, say how many sessions it has been open. Omit
    if the session closed clean.]

    ## Next Session
    [Include only when the session had deep work on one project with a clear
    continuation point, or when ending early because context is getting long. Skip
    for general or multi-topic sessions.]

    **Project:** [name and path]
    **Pick up at:** [one sentence, the exact next task]
    **Read first** (three at most):
    1. [file]: [what to check]
    2. [file]: [what to check]
    3. [file]: [what to check]

    Paste this to continue:

    ```
    [One paragraph in the user's own voice, first person, flowing rather than a list
    of fragments. Short, operational, instructional: where the work is, what to read
    and run first, the task, and how it was agreed to run including what done looks
    like. Close with what work is still open, and point at the tracker for the rest.]
    ```

---

## The block has to stand alone

The next session has its own startup context and this block, and nothing else. Anything it needs
that is in neither has to be in here.

**Write it in the user's voice, short and operational.** They are the one pasting it, so it reads
as them briefing a fresh session: "I'm continuing", "Read X, then run Y", "Author it through Z".
Instructional throughout, one sentence handing to the next. Chopped into a line per element it
reads as a form someone filled in; padded with narration it buries the task.

**Close with what work is still open**, in a line or two, then point at the tracker. Two things
depend on it: the session can see whether another open item groups naturally with the task and
belongs in the same sitting, and it knows what comes next when it writes its own handover. A task
with no horizon behind it produces a handover that stops dead.

**Open work is not open chores.** What is still to build belongs in the block. Dirty repositories, a
diverged mirror, a note that could not be routed: those stay in the log. They are the user's to
act on, and in the block they read as an invitation to keep working instead of ending.

State, method, and a stopping condition are what stop a fresh session opening with "how do you want
me to approach this?" A task without its method loses the working agreement the last session built.
