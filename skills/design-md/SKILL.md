---
name: design-md
description: >-
  Writes a brand's DESIGN.md to Google Labs' DESIGN.md format, with token frontmatter generated
  from the brand's token library and prose that names tokens, plus the companion files that extend
  it (core-idea.md, logo.md, motion.md). Use whenever a brand needs one file an agent or a developer
  can build on-brand work from. Triggers on "write our DESIGN.md", "make a design.md for the brand",
  "document the design system for agents", "update DESIGN.md after the token change", "write the
  logo rules", "write up the core idea and motifs", or a request to make brand guidelines
  machine-readable. Use it too after any change to the tokens, since the frontmatter is generated.
  Not for deciding the identity (visual-identity), building or auditing the tokens, unused ones
  included (design-tokens), or assembling the folder and its standards sheet (brand-library).
license: MIT
compatibility: Needs the brand's token library built first. The linter runs through npx and needs network access the first time.
metadata:
  author: Atmo Studio
  version: "0.4.0"
---

# design-md

Write the file a stranger can build from: `brand/DESIGN.md`, and the three files that extend it.

**A request to audit the tokens belongs to `design-tokens`,** even mid-way through this skill:
which tokens nothing uses, which values are typed by hand. Load that skill and follow its
`## Auditing a library`; this skill's scan in Step 5 checks only the files it writes.

**DESIGN.md is the standard. The companion files add what it does not hold.** None of them repeats
a value. A color, a size or a font family is typed once, in `brand/tokens/src/`. This skill writes
prose that names tokens, and the build writes the values.

Read `references/standard.md` before writing a section. It holds the format, what the linter
checks, and the bar above the format.

**This skill reads local files only.** The token library, `brand/decisions.md`, the brand's assets,
and the Visual Identity dimension when it is a local file. It makes no call to an outside system.
Where something it needs lives elsewhere, ask the user to paste it.

The prose in `DESIGN.md` and its companion files follows `SOUL.md §Writing rules`. Use the
workspace's own `SOUL.md` when it has that section, and the one at `../../SOUL.md` from this
skill's folder when it does not. The same rules hold for what you say in chat. No sentence you
write, in a file or in a reply, carries an em dash: use a full stop, a colon or a comma. The
brand's own voice guide governs tone where it says something different.

## What you need before you start

| Input | Where | When it is missing |
|---|---|---|
| The built token library | `brand/tokens/tokens.json` | Stop. Send the user to the `design-tokens` skill, or to `visual-identity` when nothing about the identity is decided yet |
| What was decided and why | `brand/decisions.md` | Ask for the concept, the guardrails and the logo rules, and write them into a new `decisions.md` before going on |
| The logo files | `brand/assets/logo/` | Write `logo.md` for a wordmark set in type, and say so in its first line |
| The motif files, if any | `brand/assets/motifs/` | Describe each motif's construction in words |

**DESIGN.md takes decisions, never guesses.** Where `decisions.md` is silent on something a section
needs, ask one question. Do not fill the section from general taste.

**Where the question goes unanswered,** write the section from what is decided and from the brand's
record, add each line you proposed to `decisions.md → ## Open` as unconfirmed, and tell the user
which lines those are. A section the format requires is never left empty, and a proposal never
contradicts the record.

## Step 1: Check the ground

From `brand/tokens/`:

```bash
node scripts/build.mjs && node scripts/check.mjs
```

A library that fails its check is not ready to be described. Hand back to `design-tokens`.

## Step 2: Start the file

Where `brand/DESIGN.md` does not exist, copy `assets/DESIGN.template.md` to it and set `name`,
`description` and `metadata.updated`.

Where it exists, it is the brand's document. Change a section only by showing the user the old and
new text and getting a yes. The frontmatter between `colors:` and the end of `spacing:` is
generated and is never edited by hand.

Run the build once now, so the frontmatter holds the real token names before you write a reference:

```bash
node scripts/build.mjs
```

## Step 3: Write the prose

Write the sections in order, each to the "Section by section" table in `references/standard.md`.
Read the frontmatter for the exact token names and reference them as `{colors.accent-bg}`,
`{typography.body}`, `{rounded.md}`, `{spacing.4}`. **A token in a group the DESIGN.md format does
not hold,** `stroke`, `container`, `breakpoint`, `viewport`, `motion`, takes its published name in
backticks, the CSS custom property without its dashes: `stroke-rim`, `container-content`. Braces
are checked by the DESIGN.md linter and backticks by `audit.mjs`, which fails a name `tokens.json`
does not hold. Either way a renamed token breaks the scan, never silently.

- **Overview first, on a specific reference.** Take it from `decisions.md → ## Core idea` and the
  references the founder gave. Where they gave none, ask what real thing the brand should feel
  like. Do not invent one.
- **Colors: a job and a limit for each.** Read `../../expertise/color/color-usage.md → ## Color
  roles` for what a job is. Name each color the way the brand does, then give its token.
- **Typography: the roles and their use.** Give the scale's base, ratio and reason from
  `tokens.json → meta.scale`. These three numbers are tokens' own facts and may appear.
- **Do's and Don'ts: five to ten lines,** from `decisions.md → ## Guardrails`. Each is specific to
  this brand. Start every line with `**Do**` or `**Don't**`.
- **Motion and Imagery** follow Do's and Don'ts. Leave the `motion-tokens` markers in place: the
  build fills the table between them. Where no imagery is decided, the section gives the one rule
  that holds until it is: what the brand shows meanwhile, or that it shows nothing.
- **Layout states every measure a page needs,** in the template's table: page margin, section
  padding, content width, reading measure, panel padding, column gap, the gap each recurring
  element keeps from the content, and the breakpoint. The breakpoint is written as its value beside
  its token, because a media query cannot read a custom property. The margin and the display size
  are fluid tokens, so the prose says how they scale and never gives a size per screen.
  **Layout states system measures, never a page's composition.** How many columns a hero has, what
  sits beside the text, or how wide an aside runs belongs to the brief for that page.
- **Components: a minimal section, always.** Component tokens stay out of the frontmatter, which
  declares them omitted, but the prose `## Components` section is written for every brand from the
  action, border and motion roles: primary and secondary action, text link, button padding, the
  focus ring as `stroke-focus` and `stroke-focus-offset` in its color, and the motion tokens hover
  and press use. Name each action by its role. Take its current label from Messaging Pillars →
  Calls to action, or ask for it. **Open questions stay out:** they go to `decisions.md → ## Open`.

Show the user the Overview and the Do's and Don'ts before going further. Those two carry the
brand's judgment, and they are the ones a founder corrects. Revise until they say it is right.
Where they give no answer, go on, and record both sections in `decisions.md → ## Open` as
unconfirmed.

## Step 4: Write the companion files

Each has a template in `assets/`. Keep the headings exactly as the templates have them, because
`brand-library`'s sheet reads them.

| File | Template | Holds | Read first |
|---|---|---|---|
| `brand/core-idea.md` | `assets/core-idea.template.md` | The one rule that makes the brand recognizable, and each motif's origin, construction, placement and limit | `../../expertise/brand-motifs.md` |
| `brand/logo.md` | `assets/logo.template.md` | Versions and the ground each was drawn for, clear space, minimum size, misuse | n/a |
| `brand/motion.md` | `assets/motion.template.md` | Which change takes which band, what arrives first, what never moves, reduced motion | `../../expertise/motion.md` |

- **A file a review round already wrote is the founder's approved text.** Check it against its
  template's headings and keep its words.
- **A companion file names tokens and carries no values at all.** Where `DESIGN.md` already says
  something, point to its section.
- **The logo's numbers are tokens.** Add `patterns.logo.min-width` (a dimension),
  `patterns.logo.clear-space` (a number: the share of the logo's height), and the two lengths
  that follow from them and the primary logo file: `logo.min-height` and `logo.min-clear-space`,
  each to the whole px, to
  `brand/tokens/src/patterns.light.tokens.json`, and to the dark file where there is one. Then
  `logo.md` names them. Where nobody decided them, propose them from the logo itself: clear space
  as the height of one capital, minimum width where the smallest letter still reads. Log both in
  `## Open`.
- **Every motif says how it is built on the web.** Its `- **On the web:**` line names the element
  it sits on, how its size follows the content (a bar under a headline, set on a `fit-content`
  wrapper around it, is as wide as the words), and what it does below the breakpoint. A developer
  who reads Construction and builds it a different way has built a different motif.
- **A motif's file is the motif alone.** Name a drawing that shows the motif around a headline or a
  line of facts as `- **Reference drawing:**`, never `File:`, and keep copy out of new drawings: copy
  in art goes stale when the words change.
- **A motif the sheet can build names how.** Add `- **Draw:** under-rule`, `ruled-line` or `figure`
  when the motif is one of those, and name its tokens in backticks in Construction (`stroke-rim`
  tall, `spacing-24` wide, type role `ticket`), so the sheet draws it in the brand's own roles. A
  drawn `File:` that is the motif alone wins over the Draw line. Where the brand has
  two logo candidates, `logo.md` carries a `## Candidates` table until the founder chooses.
- **Every misuse line names what it shows.** Start it with one of the template's bold labels, so
  the standards sheet can draw it. A misuse no label fits is a rule for `DESIGN.md → ## Do's and
  Don'ts`, not for `logo.md`.
- **Leave out a file the brand has nothing for.** A brand with no decided motion gets no
  `motion.md`. An empty file tells an agent there is a rule where there is none.

## Step 5: Build, lint, scan

From `brand/tokens/`:

```bash
node scripts/build.mjs
npx --yes @google/design.md@0.4.0 lint ../DESIGN.md
node scripts/audit.mjs
```

- **The linter's summary must read 0 errors and 0 warnings.** `references/standard.md` maps each
  finding to its fix.
- **The scan must find nothing.** It reads `DESIGN.md` and the companion files for a hex, a color
  function, a size or a font family typed as a literal. In `DESIGN.md` a size passes only where it
  equals a `breakpoint-*` token, the one value a media query needs written out; every other size
  is a token named. In a companion file nothing passes. It also resolves every backticked token
  name, and fails one that names no token.
- With a dark theme, repeat Step 2 to here for `brand/DESIGN.dark.md`. It holds the dark theme's
  values and only the prose that differs.

Fix and run again until all three are clean. Where no network is available for the linter, say so
in one line and report the file as unlinted.

## Step 6: Read it as a stranger

Open only `DESIGN.md` and the companion files, and ask of each section: could someone who has never
seen this brand make a correct decision from it? Where the answer is no, the section is describing
and not directing. Rewrite it.

## Gotchas

- **A logo file's name is not evidence of what it is for.** A file named primary can hold the
  light-colored version drawn for a dark ground, and placed on the page by its name it disappears.
  Open each file and read its fills before giving it a ground.
- **A YAML block in the prose breaks the file.** The linter parses any fenced YAML as tokens, and a
  repeated key rejects the document. Show values in a table.
- **`omitted` is what keeps the color warnings away.** Without components, every color is reported
  as unused unless the Components section is declared omitted with a reason.
- **A frontmatter edited by hand is overwritten by the next build.** A value that looks wrong is
  wrong in the token source. Fix it there.
- **A reference to a token that was renamed is the linter's one error.** After any change to the
  tokens, build and lint again before anything else.

## When you are done

Tell the user:

1. Which files were written, and which were left out because the brand has nothing for them yet.
2. The linter's summary and the scan's count.
3. Anything asked and still unanswered, now in `decisions.md → ## Open`.

Then set the date in `brand/decisions.md`.
