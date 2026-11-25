---
name: design-tokens
description: >-
  Builds and audits a brand's design token library in three layers (Brand primitives, Intent
  meanings per sub-brand, Patterns roles per theme): the token source in the Design Tokens format,
  and the CSS variables, JSON, JavaScript module, Tailwind theme, contrast report and Figma
  variables generated from it, with checks that fail the build. Use whenever colors, type, spacing,
  radius or motion have to become tokens, or a token set has to be checked. Triggers on "build the
  design tokens", "turn the palette into tokens", "sync the tokens to Figma", "audit the tokens",
  "which tokens don't we use", "any values typed by hand", "we have hardcoded colors everywhere",
  "add a sub-brand", or any request to extract, rebuild, migrate, retrofit or check tokens,
  including when the values live in a stylesheet, a design file or guidelines. Not for deciding what the
  identity is (visual-identity), writing DESIGN.md (design-md), or assembling the brand folder and
  its standards sheet (brand-library).
license: MIT
compatibility: The bundled scripts need Node.js 18 or later. Without Node the skill still runs, by hand, and says the library is unchecked.
metadata:
  author: Atmo Studio
  version: "0.4.0"
---

# design-tokens

Turn decided colors, type, spacing and motion into a token library: one source, every output
generated from it, and checks that stop a bad build.

**The rule everything here serves: a value is typed once.** It lives in `brand/tokens/src/`. Every
other file names the token or is generated. A second copy of a number is the first step toward two
numbers.

Read `references/library-contract.md` before writing anything. It lists every file in the library,
which are source and which are generated, the three layers and the naming grammar.

**Three layers, brand → meaning → application.** Brand holds raw values in one mode. Intent maps
them to semantic ramps (`accent`, `neutral`, `error`) and holds a mode per sub-brand. Patterns maps
those to the roles work uses (`bg.page`, `text.primary`) and holds a mode per theme. Work references
Patterns only.

**An audit request starts at `## Auditing a library`,** not at Step 1.

Every line you write for the user follows `SOUL.md §Writing rules`: the workspace's own `SOUL.md`
when it has that section, otherwise `../../SOUL.md` from this skill's folder. Read it before you
answer. No sentence you write carries an em dash, in chat or in a table cell: use a full stop, a
colon or a comma. Work quietly. Report what was decided and what failed, not which script ran.

## What you need before you start

| Input | Where it comes from | When it is missing |
|---|---|---|
| The brand color or colors, each as a specific value | `brand/decisions.md → ## Color`, or the Visual Identity dimension's Decided Constraints | Ask for it. Never pick an anchor yourself |
| Which states the brand ships: error, success, warning, information | `brand/decisions.md → ## Color` | Ask. Default to error only when the brand has a product, none when it does not |
| Light, dark or both, and which is primary | `brand/decisions.md → ## Color` | Read `../../expertise/color/color-usage.md → ## Themes`, propose one, get a yes |
| The typefaces, and where their files are | `brand/decisions.md → ## Type` | Ask. A typeface nobody has licensed or supplied is not an option |
| The type scale's base size and ratio, with the reason | `brand/decisions.md → ## Type` | Step 4 decides it with the user. There is no default |
| The base unit | `brand/decisions.md → ## Space and shape` | Decide it with the scale, in step 4 |
| How the brand moves | `brand/decisions.md → ## Motion` | Read `../../expertise/motion.md`, propose from the personality, get a yes |

`brand/` sits at the root of the brand's project folder. Where the brand has no `decisions.md`, the
Visual Identity dimension and the user's own files are the inputs, and anything you settle goes
into a new `brand/decisions.md` so the next skill can read it.

## Step 1: Name the entry state

No brand arrives empty. Say which state this one is in before touching a file, because each starts
somewhere different.

| State | You are looking at | First step | Done when |
|---|---|---|---|
| **GREENFIELD** | Decisions, and no tokens anywhere | Copy the starter (step 2) | The check passes with no placeholder left |
| **EXTRACT** | A finished identity in a design file or a guidelines document, and no code | Inventory every value in the source, with where each was read | Every inventoried value is a token or is listed as left out, with the reason |
| **AUDIT-AND-REBUILD** | Tokens or variables already in code, kept by hand | Audit before changing anything, and report | The rebuilt library reproduces every value the audit kept, shown by the migration diff |
| **RETROFIT** | A codebase full of literals, with or without a token file | Run the raw-value scan on the code and report the count | The scan is clean on the code, or every remaining literal is listed with its reason |

For EXTRACT, AUDIT-AND-REBUILD and RETROFIT, read `references/entry-states.md` now. It carries the
inventory format, the audit report and the order of work for each.

## Step 2: Set up the library

Copy `assets/starter/` from this skill's folder to `brand/tokens/`. It holds the source files with
placeholder values, the scripts, and a `package.json`.

- **Never overwrite an existing `brand/tokens/src/`.** Where one exists, this is not GREENFIELD.
- **Refresh `brand/tokens/scripts/` from the starter** when the starter's copy is newer. Where a
  script is wrong for this brand, fix the project's copy, keep the change as a diff beside the
  library, and tell the user: the next refresh overwrites it.
- Set `name` in `brand/tokens/package.json` to the brand's own, lowercase with hyphens.

Check that Node runs: `node --version`. Where it does not, tell the user in one line, read
`references/library-contract.md → ## Without Node`, and carry on by hand.

All commands below run from `brand/tokens/`.

## Step 3: Color

Read `../../expertise/color/color-ramps.md` and `../../expertise/color/color-tokens.md` first.

1. **Build one ramp per color,** named for what it is and never for the job. A color the brand
   specifies and names takes its brand name; every other ramp a Tailwind-style hue (`stone`, `zinc`,
   `slate` or `gray` for a neutral by its tint, `red`, `amber`, `green` for the rest). Never an
   Intent name such as `neutral` or `accent`; the script refuses one:
   ```bash
   node scripts/ramp.mjs --name tidewater --anchor "#RRGGBB"
   node scripts/ramp.mjs --name stone --anchor "#RRGGBB" --neutral
   ```
   The neutral takes the brand color as its anchor, so it carries the brand's hue, unless the
   brand's record describes its neutral otherwise: "a warm off-white" names a hue.
   Then anchor the neutral on that color, show it, and record it in `decisions.md` as your
   proposal for the founder to confirm. Every ramp
   shares one lightness curve, so a step reads at the same weight in every hue. The script prints
   the step the anchor landed on. That step is the brand's color, and fills point at it.
   - `--pin` keeps a color exactly as given, for one fixed by a contract or a printed pack.
   - `--fixed` writes one color and no ramp, for a paper white or an ink that sits on no ramp.
   - `--steps "50=#RRGGBB,…,950=#RRGGBB"` keeps a ramp that already exists, exactly. Use it when the
     ramps are already decided, as they are in most rebuilds.
   - Every ramp shares one chroma curve as well: it rises through the light steps, peaks at 700
     and eases off toward 950, so tints keep their hue through 300 and the darkest steps stay a
     color. The anchor sets how high the curve peaks, and the gamut caps it where a hue runs out.
     `--chroma 0.12` sets the peak by hand. A pinned anchor bends the two steps either side of it
     toward itself, so the ramp never jumps at the brand's step.
   - `--tint 0.6` quiets the light steps, easing up to the full curve at step 500. It never raises
     them. Where the tints still read as a second color (mint, peach), `--cap 0.025` puts an
     absolute ceiling on chroma at step 50, widening to none by step 500.
   - **Show the ramps before writing roles.** If a step jumps or a hue washes out, change the
     anchor's step or the flags and build again. Hand-built steps (`--steps`) are the last resort,
     and the reason goes in `decisions.md`.
   - `--match stone` takes every step's lightness from a ramp already in the source. Use it when the
     neutral was built with `--steps` and the hues built after it must sit at the same weight per step.
     The script warns when a new ramp's lightness differs from an existing one's.
   - **Proportion and states.** The proportion map holds only the colors a surface is made of. A state
     (error, success) goes in no share: it is function, and the palette board leaves a 0% entry or a
     status role out.
2. **Build a ramp for each state the brand ships.** A state borrows the brand ramp only when the
   hues match: a green brand's success state, for instance.
3. **Write the meanings and the roles:**
   ```bash
   node scripts/roles.mjs --neutral stone --accent tidewater --status negative=red
   ```
   This writes Intent (`accent`, `neutral`, `error`, each pointing stop for stop at the Brand ramp
   named) and the light theme's Patterns roles, each pointing at an Intent step. It replaces the
   starter's placeholder roles and ramps, retires their placeholders, and keeps the color
   proportion. Add `--dark` for the dark theme. Add `--action stone` where the primary action fills
   with ink and the accent is kept for emphasis.
   - **A sub-brand** of a branded house uses the parent's Brand colors and changes only its Intent:
     `node scripts/roles.mjs --brand kitchen --neutral stone --accent amber`. It writes
     `brand/tokens/src/intent.kitchen.tokens.json`, applied with `data-brand="kitchen"`, and leaves Patterns
     alone. A brand whose primitives differ is not a sub-brand: it gets a library of its own.
   - Rename the default sub-brand from `main` to the brand's own name when it has sub-brands, in the
     resolver and the file name, so Figma's Intent mode reads as the brand. `--paper` and `--ink` put fixed
   colors on the page and on text.
4. **Measure every ground an action sits on.** `--action-on page,surface` measures each state
   against each light ground, and the check fails any hover or pressed fill, the secondary
   action's included, that is the same color as one of them. A dark section is a ground of its own: write it as a named theme,
   `node scripts/roles.mjs --theme deep --ground dark --neutral … --accent …`, applied in markup with
   `data-theme="deep"`. Its hover and pressed move toward light, which one role set on both grounds
   cannot do. A button that passes on the page and sits on a dark section is the pair nobody
   measures.
5. **Treat the step map as a first draft.** `roles.mjs` places each role on a likely step. The brand
   decides whether text sits at the far end of the ramp or stops at the floor, and whether the
   accent fills or only marks. Read `../../expertise/color/color-composition.md` when how much of
   each color appears is the question.

Every action role ships rest, hover, pressed and disabled, and each has a line in `brand/tokens/src/pairs.json`.
Add a pair by hand for any combination the brand uses that the default list does not cover: text on
a state surface, a mark on a raised panel. A role that decorates and marks nothing a person has to
find goes under `"unpaired"` with the reason. The check fails on a role in neither list.

Write the proportion as `patterns.color.$extensions["brand-os"].proportion`, a map of role to percent.

## Step 4: Type, and the scale

Read `../../expertise/typography/typescale.md` and `../../expertise/typography/rendering.md` first.

**The base size and the ratio are one decision, and it has no default.** Settle it from three
things: the brand's positioning and personality, what the identity needs to do, and the surfaces
the brand mostly appears on. A dense product and an editorial site want different pairs. Put two
candidate pairs in front of the user when they have no view, each with its consequence at the
largest and smallest size, and take their pick. Where they answer neither, take the pair the
surfaces point to, store that as the reason, and add the choice to `decisions.md → ## Open` for them
to confirm.

```bash
node scripts/scale.mjs --base <px> --ratio <n> --unit <px> --reason "<why this pair suits this brand>"
```

- The script refuses to run without a reason. The reason is stored beside the scale.
- It rounds each size to the base unit and records any step it had to leave off the unit. Pass
  `--round 1` to keep the exact sizes of a scale that already exists, and `--leading 0=24,3=40` to
  set a step's line height where the computed one is wrong for the brand.
- A size that grows with the screen takes `$extensions["brand-os"].fluid`: `{"min": 32, "from":
  375, "to": 1280}`, in pixels. The build writes a `clamp()` from it, with the token's own value as
  the largest size.
- Then set `brand.font.family` to the brand's typefaces with their fallbacks, and edit the type
  roles in `brand/tokens/src/patterns.light.tokens.json` so each role points at the step, weight and
  tracking the brand uses. Name roles for their job.
- List each family's font files under `$extensions["brand-os"].files` so the build can write
  `fonts.css`: `[{"src": "assets/fonts/Name-Regular.woff2", "weight": 400, "style": "normal"}]`.
  The format follows the file's extension. A family with no files listed is expected to be
  installed or loaded by the page. Keep the font's license file beside its files.
- A role set in capitals by rule takes `$extensions["brand-os"].textTransform: "uppercase"`.
- A role with tabular figures takes `fontFeatureSettings: "\"tnum\" 1"`. A role set at a width other
  than the face's default takes `fontStretch: "75%"`, and the family's file entry then names the range
  it covers: `{"src": "…", "weight": "400 700", "stretch": "75% 100%"}`. Both reach `tokens.css`
  (`--type-<role>-font-feature-settings`, `--type-<role>-font-stretch`), `tokens.json` and the sheet.
  The CSS `font` shorthand resets width, so a consumer sets `font-stretch` after it.
- **Bundle the font files before the first render.** List them under `files` and copy them into
  `brand/assets/fonts/` before the type round's board is drawn, so `fonts.css` embeds them. A board drawn
  from fonts that only happen to be installed on this machine shows the right faces here and the wrong
  ones everywhere else.

## Step 5: Space, shape, elevation, motion

- **Spacing** follows the base unit and was written by `scale.mjs`. `spacing.4` is four units.
- **Spacing is pruned to the steps the brand uses.** `scale.mjs` writes a default run (0, 1, 2, 3, 4, 5,
  6, 8, 10, 12, 16, 20, 24, 32). Delete the steps no surface needs, so the space board
  shows the intervals in use and no others.
- **Rule weights** live in `brand.stroke`: `hairline` (1px), `focus` (2px) and `focus-offset` (2px)
  ship, and a brand adds its own (a rim, a heavy rule) by name. A rule is a dimension, so work reads
  `--stroke-hairline` and never types `1px`.
- **Layout** ships in the starter under Tailwind's names and is one placeholder, `layout`:
  `container.content` and `container.prose`, `breakpoint.{sm…2xl}`, `viewport.{min, max}`, and the
  fluid `spacing.gutter` and `spacing.section`. Set the content width and measure from the brand's
  main surface, the breakpoint its layout turns on, and the margins. Give the display steps a
  `fluid` minimum, so the display size shrinks on a small screen without a size per breakpoint.
  An agent given a kit without these guesses its widths, its margins and its small-screen display
  size.
- **Radius** is a size chart. Change the values in `brand.radius` to the brand's shape language.
  Read `../../expertise/layout/foundations.md` for how nested corners relate.
- **Elevation** points at `brand.shadow`. A brand that uses shadows keeps two and uses them rarely. A
  shadow's color aliases the darkest neutral and sets its opacity in `$extensions["brand-os"].alpha`,
  so the color is typed once. **A brand with no shadows** says so: it keeps `elevation.raised` and
  `elevation.overlay` as zeroed shadows (every length 0, alpha 0) because elevation is typed as a
  shadow, and it declares depth by ground and hairline in `DESIGN.md`. The space board then draws the
  grounds and the rule weights and leaves the empty elevation rows out.
- **A veil or scrim** is a color token with its own opacity: `patterns.color.scrim` aliasing an
  Intent step of the neutral, with `$extensions["brand-os"].alpha: 0.4`. The build writes the color with that alpha.
- **Motion** has three bands, each with an exit, and three easings: enter, exit and standard.
  Read `../../expertise/motion.md`, set the durations and curves in Brand to the brand's character,
  and keep each duration's reduced value. Component and layout durations reduce to zero. Feedback
  carries `reduced-motion` equal to its own value, so the intent is written down and a check can see
  it: a change of ink is not movement. The starter ships a `linear` easing for feedback, which only
  changes color. A brand that uses two curves deletes the roles it does not use.

Take each group out of the placeholder list as you set it.

## Step 6: Build, check, fix

```bash
node scripts/build.mjs && node scripts/check.mjs
```

Run both after every edit to `brand/tokens/src/`. The check prints one line per failure, and each line says what
to change. Fix the source and run again until it passes. Do not edit a generated file to make a
check pass, and do not lower a floor.

- **A failing pair is fixed by moving the role to another step.** Lightness is what contrast
  responds to. Changing the anchor to pass a check changes the brand.
- **A pair WCAG exempts,** such as a disabled control, takes `"exempt": "<the reason>"` in
  `brand/tokens/src/pairs.json`. It is still measured and reported.
- **Two grounds under 2:1 against each other read as one where they meet.** The check holds the
  main grounds and fills apart by default. A change that brings two of them under it, a darker
  fill in a refresh say, is named to the user with both ratios, before and after, and the user
  chooses which ground moves. Two grounds that never touch take `exempt` in `pairs.json → adjacent`.
- Finish with `node scripts/build.mjs --verify`, which fails when any generated file differs from a
  fresh build.

## Step 7: Show it, then verify

Tokens are judged by eye as well as by number.

1. Render the color and type boards and show them to the user:
   ```bash
   node scripts/sheet.mjs --draft --boards color,type
   ```
   This writes `brand/review.html`. Ask what reads wrong. Change the source, build, render again.
   Repeat until they say it is right. One pass is never the plan.
2. Run the raw-value scan on whatever consumes the tokens, where anything does yet:
   ```bash
   node scripts/audit.mjs <path to the code or the prose>
   ```
   Once the brand's materials exist, run it with no path too: `## Auditing a library`.
3. After a rebuild or a refactor, prove nothing moved that was not meant to:
   ```bash
   node scripts/diff.mjs --snapshot    # before
   node scripts/diff.mjs               # after
   ```
   Whenever a rebuild carries values over from an old system, the snapshot is taken before the
   first change, even when one group is reopened and the others are carried. Where the old system
   was never a token library, `references/entry-states.md → ## AUDIT-AND-REBUILD` says how to
   write the snapshot by hand.
4. Read `brand/tokens/contrast.md` and tell the user the lowest margin and which pair holds it.

## Auditing a library

Asked whether tokens are used, typed by hand or named right, report before changing anything.

```bash
node scripts/build.mjs && node scripts/check.mjs
node scripts/audit.mjs
node scripts/audit.mjs <each codebase or file that consumes the tokens>
```

- **The default scan** (no path) reads the brand's prose and art: hand-typed colors, sizes and
  families; a token named by its source path (`motion.feedback.duration`) where the published name
  (`motion-feedback-duration`) belongs; live text in SVG art; and, once `DESIGN.md` exists, every
  Patterns role and Intent ramp nothing uses.
- **Unused means no material names it.** Brand prose and companion files, the standards sheet where
  it applies a role, and code passed as a path count. The generated frontmatter, `contrast.md`,
  `figma.json` and `pairs.json` do not. Brand values may sit unused: they are the palette. A role a
  product's codebase uses outside this folder carries `$extensions["brand-os"].keep` naming where.
- **Report counts and locations first:** how many literals and where, how many unused roles and
  which. Then propose, and change nothing until the user says yes.
- **Removing a role** removes its line in `pairs.json` (or its `unpaired` entry), and a build drops
  it from the `DESIGN.md` frontmatter. In Figma, push again with `--stale apply` to delete the
  variable. Rebuild, check and audit again.

## Step 8: Figma

Where a Figma connection that can write is available, read `references/figma-round-trip.md` and
push the variables into a new file. A connection that is listed and not signed in is not available.
Where there is none, say so in one line and finish:

> No Figma connection here, so the tokens stay in code. Connect Figma and ask me to sync when you
> want the mirror.

Code is the source. Figma is a copy of it, and a change made in Figma returns as a diff the user
accepts before the source changes.

## Gotchas

- **A hover with no role gets a ramp step picked on the spot.** The next step down from a button's
  fill can fall under the 3:1 floor against the ground the button sits on. Make every state a role,
  and give every role a pair.
- **A contrast figure written by hand goes stale.** A ratio measured against the page is wrong for
  the same text on a card. Measure against the ground that paints behind the element, and take the
  figures from the generated `contrast.md`.
- **A framework's step name carrying the brand's value misleads every pasted snippet.** Where
  `text-sm` means 12px in the brand and 14px in the framework, code copied from the framework's
  documentation renders at the wrong size and nothing reports it. Name type sizes by role, and Brand
  steps by position.
- **An alias resolves where it is declared.** A theme that overrides a ramp step without
  redeclaring the role that points at it leaves the role on the old value. The build writes every
  role in every theme block. Do not thin them out.
- **In Figma, a letter-spacing variable applies in pixels.** A tracking percent bound as a variable
  is applied as that many pixels. Carry tracking on text styles as a percent, never as a
  variable.
- **In Figma, a weight is a name that belongs to one family.** `Medium` in one family is `65 Medium`
  in another. Change a family without its weight names and the style falls back without saying so.
- **Setting a font family in Figma is not one operation.** The family is written first, then the
  font fails to load, and the style is left on a pair that does not exist. Read every style back
  after writing it.

## When you are done

Tell the user, in this order:

1. What the library now holds: how many ramps, roles, type roles and themes.
2. The lowest contrast margin, and anything exempted.
3. Every step the scale left off the base unit, with its reason.
4. What was not done, and why: no Node, no Figma, a font file not supplied.
5. Where the files are, and that only `brand/tokens/src/` is edited.

Then update `brand/decisions.md`: the values that were settled here, and the date.
