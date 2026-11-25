# Review rounds

How each round of generation runs. Read it when the founder has chosen to generate the identity.

A round has one subject, produces something to look at, and ends only when the founder approves.
The order matters: each round builds on the one before it.

| Round | Subject | `design-director` reads | Boards | Writes before rendering |
|---|---|---|---|---|
| 1 | Color | `expertise/color/color-palette.md`, `expertise/color/color-ramps.md`, `expertise/color/color-composition.md` | `color` | The ramps and roles |
| 2 | Type | `expertise/typography/typefaces.md`, `expertise/typography/typescale.md` | `type` (typefaces, scale, roles, and the roles composed on two cards) | The font files, the scale and type roles, and `brand/sheet.json` |
| 3 | Space and shape | `expertise/layout/grids.md`, `expertise/layout/foundations.md` | `space,in-use` | Spacing, radius, stroke weights, and the depth method |
| 4 | Core idea and motifs | `expertise/brand-motifs.md` | `idea,in-use` | `brand/core-idea.md` and the motif files |
| 5 | Motion | `expertise/motion.md` | `motion,in-use` | The motion tokens and `brand/motion.md` |
| 6 | Logo | `expertise/typography/typefaces.md` | `logos,in-use` | The logo files and `brand/logo.md`, with a `## Candidates` table where two marks compete |

The boards read the files in the last column, so each round writes them before it renders. Copy
each from its template in the `design-md` skill's `assets/` folder, or, for `sheet.json`, from the
`brand-library` skill's. `sheet.json` holds the copy the boards set: take it from the brand's
taglines and messaging, or ask the founder for one real line. Without it the type board shows the
word "Brand". `design-md` later completes these files and keeps the founder's approved words.

Paths to `expertise/` and `agents/` in this file run from the Brand OS root.

**Every round is judged on a surface, not on values.** A board of values (a bar for each spacing step, a
curve for each easing) cannot tell a founder whether the round is right. Each round's boards therefore
include `in-use`, which composes the brand's own copy with the roles, motifs and grounds decided so
far, and the type round's `type` boards include a composed card of the roles set together. Where a
round needs a surface the sheet does not draw (a line card, a spec sheet, a carton), compose it from
the brand's own copy and the tokens, and write it as a page in `brand/` that links the tokens by
`tokens/tokens.css` and carries no value of its own. Do not leave that page out because the generated
boards were enough to render.

Skip a round whose subject the founder marked decided at intake. Their asset goes in as it is.

## One round, step by step

1. **Brief `design-director`.** Deploy it with mission `produce`, phase `after-selection`, naming
   the concept the Visual Identity dimension records as the selected direction. A fork the round
   settles is shown as variants inside the round. Give it:
   - the brand context: the Visual Identity dimension, Brand Personality, Brand Positioning, and
     the intake from `decisions.md`
   - the round's subject, and what earlier rounds settled
   - the surfaces the brand mostly appears on
   - `brand/` as its working directory

   Ask for the decision and its reason, traced to the brand's record. Where the harness cannot
   deploy an agent, read `agents/design-director.md` and follow it yourself.
2. **Write the values through `design-tokens`.** Follow that skill's step for the round's subject:
   ramps and roles for color, the scale and type roles for type. Build and check.
   **Where the brand already had a system and this round reopens part of it,** run
   `node scripts/diff.mjs --snapshot` before the first value changes, and `node scripts/diff.mjs`
   after. Every difference outside the reopened group is a defect, and the founder sees the list.
   **Write the companion files token-only.** `core-idea.md`, `logo.md` and `motion.md` name tokens,
   never values: `color-text-primary`, `spacing-24`, `stroke-rim`, the type role `ticket`, never a hex,
   a pixel size, a family name or a typed contrast ratio. Run
   `node scripts/audit.mjs ../core-idea.md ../logo.md ../motion.md` from `brand/tokens/` before
   rendering, and fix every literal it finds in the file. Brief `design-director` with the same rule.
3. **Render the round's boards** from `brand/tokens/`:
   ```bash
   node scripts/sheet.mjs --draft --boards <boards>
   ```
   This writes `brand/review.html`. It is self-contained: fonts and images are embedded, so its links
   never break, and with fonts embedded it can pass 900 KB. The in-app browser pane may refuse a page
   that large, and shows a page outside the project as a still snapshot, so motion does not play
   there. Open it in the founder's own browser (`open brand/review.html`), and tell them where it is.
   Before the type round renders, list the font files under `files` and copy them into
   `brand/assets/fonts/`, so the board embeds `fonts.css` and shows the faces the brand holds, not the ones
   installed on this machine.

   **A fork the round settles is rendered as both sides.** Copy `brand/` to a scratch folder for each
   variant (`brand-a/`, `brand-b/`), change only that copy's token source or `logo.md`, build and render
   there, and put the two pages beside each other. Never swap the real source, render and restore it.
   For two logo marks, list both under `## Candidates` in `logo.md`: the `logo-candidates` board draws
   them side by side in a header, large, reversed and at the minimum width.
4. **Have `design-director` critique the board** before the founder sees it: mission `critique`,
   pointed at the rendered board. Fix what it files under "fix on approval". Bring what it files
   under "needs a decision" to the founder as questions.
5. **Ask the founder what reads wrong.** One open question first, then the decisions the critique
   raised, each with its trade-off and your pick. Never ask them to approve values they cannot see.
6. **Change, build, render again.** Repeat from step 2 until they approve.
7. **Record the round** in `decisions.md → ## Rounds`: what was shown, what they said, the date.

## What each round has to settle

**Color.** The brand color and its rule, the other colors and their jobs, the neutrals, which
states ship, which themes, and how much of a surface each color takes. The proportion goes into
the token source as `patterns.color.$extensions["brand-os"].proportion`, a map of role to percent, so
the palette board can draw it.

**Type.** The families, with a license the brand holds or an open license. Read
`expertise/typography/typefaces.md → ### Licensing` for where to find open-license families,
and name the license beside the choice. Then the base size and ratio, as one decision with its
reason, and the roles.

**Space and shape.** The base unit, the radius chart, and how depth is shown.

**Core idea and motifs.** One sentence, then one to three motifs, each with what it derives from,
its construction, its placement rule and its limit. Where a motif needs a drawn file, make it as an
SVG in `brand/assets/motifs/`. An SVG shown as an image cannot read CSS variables, so write each
color as the exact value of a token: the audit accepts a value a token holds and nothing else. Draw
text in it as outlines, since a font named inside an SVG renders only where it is installed.

**Motion.** The three duration bands, their exits, and the curves, each traced to the
personality. A band that does not animate is set to zero and says so in `motion.md`.

**Logo.** A wordmark set in the brand typeface: the name, its weight, its case, its tracking, and
any one modification. Save it as `brand/assets/logo/wordmark.svg` and a reversed version, with the
letters outlined into paths by whatever tool is at hand. Where nothing can outline type, save the
SVG with the text and the family named, and add to `decisions.md → ## Open` that it needs outlining
before it is used outside the brand's own pages. Say plainly that it is a starting point. A
distinctive mark is drawn, and that is a designer's work.

## When a round stalls

Three rounds on one subject without approval means the brief is wrong, not the execution. Stop
iterating values. Ask what the founder is reacting against, go back to the references, and reopen
the direction. Where they remain stuck or would sooner hand the work over, the designer path is
still open: say so.
