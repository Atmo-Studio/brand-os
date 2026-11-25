# The Visual Identity page, once the identity exists

How the Visual Identity dimension (Order 32) is rewritten when the brand folder is done. Read it at
the rewrite step.

Before the identity existed, the page was the constraint spec: what the founder had decided, and
what was open. Now the folder holds the identity, and the page becomes the short way in. It stops
being the source of truth and points at it.

## Rules

- **The headings stay.** Structure is read-only. Every heading on the page is kept, in order.
- **Nothing the founder decided in discovery is rewritten as if they had said something else.**
  Decisions are carried forward. Open items are closed with what resolved them.
- **Direction Forks keeps its history.** Each fork gains its resolution. None is deleted.
- **The founder sees the whole rewrite before it is written.** Show the page as it will read, say
  what changed in three lines, and write only on a yes.

## What each section holds now

| Section | Holds |
|---|---|
| Phase line | `Phase: delivered`, and today's date |
| Source of Truth | One line: the identity lives in the `brand/` folder, and `brand/DESIGN.md` is the standard. Then where the design file is, if there is one |
| Concept | The core idea, in the one sentence `core-idea.md` opens with |
| Personality → Visual Bridge | Kept. Any line the design proved wrong is corrected, and says so |
| Decided Constraints | The anchor decisions by name, one line each: the brand color and its rule, the typefaces, the identity approach. No values: "Read `brand/DESIGN.md`" |
| Brand Motifs | Each motif as shipped, in a line, and which candidates were dropped and why |
| System Logic | Hierarchy, recurrence and proportion, each now `decided` |
| Guardrails | The guardrails, checked against the delivered identity. These outlive everything else on the page |
| Direction Forks | Each fork, then how it resolved and why |
| Assets | One line pointing at `brand/assets/manifest.md` |

The whole page reads in about a minute. Anything longer belongs in the folder.

## Writing it

1. `read-dimension` for Visual Identity, fresh, immediately before writing.
2. Draft the page to the table above.
3. Show the founder, get a yes.
4. `write-dimension`, then confirm `Status` is `Complete`.

Where the backend cannot be reached, give the page to the founder as a paste block and note it in
`brand/decisions.md → ## Open`.
