# The Figma file

What a brand's Figma file holds, how it is built, and how to know it is right. Read it when Figma is
connected and the user wants the kit there. Build the file to this spec, in this order.

The file mirrors the brand folder. Every value in it comes from `brand/tokens/src/` through the
build. A designer may edit the file and build from it; a change to the brand itself is made in the
token source and pushed again. `../../design-tokens/references/figma-round-trip.md` covers how a
change made in Figma comes back to the source.

## The file

**One file per brand, made for it.** Name it `[Brand name] Brand kit`. Make it where the user asks;
never write into a file that holds other work unless they name it.

| Page | Holds |
|---|---|
| `Brand standards` | The standards sheet: one frame per board, in one top-aligned column per section |
| `Assets` | The logo versions and the motifs, each a component |

## Variables

| Collection | Modes | Holds |
|---|---|---|
| `Brand` | One, `Value` | Every primitive: each ramp step, fixed colors, font families and weights, radii, spacing, durations, easing, the scale's sizes and line heights |
| `Intent` | One per sub-brand, the brand's own first | Every semantic ramp, stop for stop: accent, neutral and each state shipped. Each is an alias to a Brand variable |
| `Patterns` | One per theme, `Light` first | Every role: backgrounds, text, borders, accent, action, status, motion, the logo's two numbers. A color role is an alias to an Intent variable |

- **Names are the token path with slashes:** `color/neutral/50`, `color/bg/page`,
  `font/family/sans`.
- **Every variable has scopes.** A background role fills frames and shapes, a text role fills text,
  a border role colors strokes, a spacing step sets gaps and sizes. A primitive with no single job
  has no scope, so it never appears in a picker.
- **Every variable has its CSS name as web code syntax,** `var(--color-bg-page)`, so a developer
  inspecting the file sees the token they use.

## Styles

- **A text style per type role,** named `type/<role>`: family and style, size, line height in
  pixels, tracking as a percent, case. Line height and tracking live only on the style; a variable
  cannot hold them as the role sets them.
- **An effect style per elevation role,** named `elevation/<role>`, with the default theme's
  shadow.

## Components

- **Each logo version** is a component named `Logo/<Version>` from `logo.md → ## Versions`, on a
  frame filled with the variable for the ground it was drawn for.
- **Each motif with artwork** is a component named `Motif/<name>`.
- Their colors are bound to the variables.

## The sheet

- **Each board is a 1920 by 1080 frame,** named from its footer label: `05 Clear space, size and
  misuse`.
- **One section per chapter of the sheet,** named for it: Cover, Core idea, Logo, Color,
  Typography, Space and motion, Imagery, In use. Sections sit side by side, aligned to the top.
  Boards run down their section in number order. Each section is filled with the page ground's
  variable, never Figma's default white.
- **The "Where everything lives" board stays out.** It describes the folder's files, which a
  designer in Figma does not use. The sheet leaves it out of the import batches, and the bind
  script removes it wherever it arrived.
- **Every solid color is bound to a variable.** A text color to a text role, a stroke to a border
  role, a fill to a background, accent, action or status role in Patterns, and to a Brand color
  where no role fits. Never to an Intent ramp.
- **Every text layer takes its text style,** or, where its case differs from the style's, the type
  variables for family, weight, size and line height. Overriding a style's case detaches the
  style, so such a layer is bound to the variables instead.
- **Every shadow takes its effect style.**
- **Every logo drawing is an instance** of its component.

## Building it

From `brand/tokens/`:

```bash
node scripts/build.mjs && node scripts/figma-push.mjs
```

This writes the scripts in `brand/tokens/figma-push/`. They are Plugin API code, each small enough
to run in one call, each safe to run twice. Run them in the file, in order, through whatever runs
Plugin API code there, and read what each returns.

1. **Create, values and styles.** The collections, every variable with its scopes and code syntax,
   every value and alias, the text and effect styles. The styles script returns `skipped`: a text
   style whose font Figma cannot load. A skipped style is reported to the user; everything else
   goes on.
2. **Assets.** The `Assets` page and its components.
3. **The sheet.** Put `brand/standards.html` on the `Brand standards` page with whatever the
   connection offers for turning a self-contained HTML document into layers, capturing each board
   as its own frame. Do this after step 1: an import binds to variables that already exist. The
   sheet tags its boards in batches of twenty, `batch-1`, `batch-2`, because an importer that takes
   a selector may stop at twenty matches. Import with the selector `.batch-1`, then `.batch-2` when
   the sheet has one, and so on. The colophon carries no batch class, so it never imports.
4. **Bind.** The bind script names the boards, sets the sections, binds the colors, text and
   shadows, and swaps logo drawings for instances. It returns what it bound, what it could not,
   `dropped` (the colophon, wherever it arrived) and `overlaps`: pairs of text layers set on top of
   each other. An importer can split one line, a Do and don't with an inline swatch say, into two
   layers and stack them. Fix each overlap at the source line where the sheet can, or join the two
   layers in Figma, and say which. Boards are ordered by their number once named, so a second
   import and a second bind run after the first are safe.

To update the file after a change: run step 1 again, then remove the sheet's frames and repeat
steps 3 and 4.

## Done

| Check | Passes when |
|---|---|
| Variables match the source | The parity check in `figma-round-trip.md → ## Parity` reports 0 differences |
| Every style was written | The styles script's `skipped` list is empty, or each entry is reported to the user |
| The assets are components | The `Assets` page holds one component per SVG in `brand/assets/logo/` and `motifs/` |
| The sheet is whole | One frame per board the sheet script rendered, each named, in sections |
| The sheet is bound | The bind report's `unmatched` list is empty, and `textWithoutTokens` holds only specimen text and the text inside artwork |
| Nothing overlaps | The bind report's `overlaps` list is empty, or each pair is fixed and named to the user |
| No pure white around the boards | Every section's fill is bound to the page ground |

Hand the user the file's link, and say that the folder is the source: a change to the brand is made
in the tokens and pushed, and edits to the sheet's boards in Figma do not come back.

## Without Figma

Run `node scripts/figma-push.mjs` all the same. The kit is complete without the file, and the
scripts wait in `brand/tokens/figma-push/`, ready for the day Figma is connected.
