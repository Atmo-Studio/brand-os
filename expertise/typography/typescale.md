# Building the typescale

**Use when:** Building the typescale for a brand or a product, or auditing one that exists.
Read [../layout/grids.md](../layout/grids.md) for the base unit and the baseline grid, and
[typefaces.md](typefaces.md) for the typefaces the scale is built in.

Four words, used precisely throughout.

**Typescale** — the modular mathematical scale the whole type system derives from. "Ramp" reads as
an alternative, though it more commonly describes color.

**Step** — one position on the typescale.

**Type size** — a step with everything set on it: font family, font size, leading, tracking, weight,
and any other styling variable the system carries.

**Role** — the job a type size does, named either semantically or as a token.

---

## One typescale for the brand

Hierarchy comes from how many steps a layout jumps, and the medium crops the range in use. A watch
face and a billboard take different windows onto one scale.

Fixing H1 through H6 at set sizes and writing a second scale for the next format fails the moment
the system reaches an extreme, and it leaves two sets of numbers nobody can reconcile.

- **Define the base and the ratio once, at brand level.** Every format derives from them.
- **Crop, never rescale.** A small canvas takes the lower steps and a large one takes the upper.
- **Shift down a step on mobile before reaching for anything else**, and add half-steps where the
  scale runs too coarse.

## Choosing the ratio

Ratios are named for musical intervals, and the name carries no meaning beyond the number.

| Name | Ratio | Character | Use for |
|---|---|---|---|
| Minor second | 1.067 | Nearly invisible steps | Dense data, admin tools |
| Major second | 1.125 | Gentle, functional | Documentation, dashboards |
| Minor third | 1.200 | Balanced | Most product interfaces |
| Major third | 1.250 | Clear hierarchy | Marketing and product together |
| Perfect fourth | 1.333 | Strong hierarchy | Content-heavy sites, editorial web |
| Augmented fourth | 1.414 | Dramatic | Magazines, editorial print |
| Perfect fifth | 1.500 | Very dramatic | Landing pages, posters |
| Golden ratio | 1.618 | Maximum drama | Display-led, luxury |

**Send an undecided choice to a calculator.** https://typescale.com/ renders every ratio above live
in the actual typeface, which settles the question faster than any description. Hand it to someone
stuck on the choice during discovery or identity work.

## The base type size

**Set the base type size before anything else. Every other size on the scale derives from it.**

- **16px on screen and 12pt in print is common practice rather than a standard.** 16px is the
  browser's own default, so a reader who has changed nothing gets it. The two are the same physical
  measure: at 1px = 0.75pt, 16px is exactly 12pt.
- **Spec the base against the brand's primary surface**, whichever it is: website, product, social,
  print, or slide deck. That gives one reference scale to design with directly in most cases, and to
  adapt for the rest.
- **The medium moves the base.** A dense professional tool sits below it, large-format display sits
  far above it, and a typeface running small for its nominal size needs a step up. Move off 16px for
  a reason that can be named.

## Deriving the sizes and rounding them

```
size(n) = base × ratio ^ n
```

- **Compound at full precision and round only the result.** Rounding each step and compounding the
  rounded value feeds the error into the next step, and the drift grows the whole way up.
- **Round every step to the nearest whole pixel, by one rule.** A size rounded to the base unit
  drifts as far as two pixels from its ratio, and at the small end two steps land on one size, which
  forces a second rule for the step that collides. A whole pixel keeps every step within half a
  pixel of the ratio and never collides at a working ratio. (House position, Atmo Studio, 2026-11-24.)
- **The base unit governs leading and space, not the size.** Each step's line height rounds up to
  the base unit that [../layout/grids.md](../layout/grids.md) fixes at 4 or 8, so the baseline
  rhythm holds whatever the size. On a 16px base at 1.25, step 2 sets at 25 on a 36 leading and step
  3 at 31 on a 44 leading.
- **Record the ratio, never the unrounded value, beside the scale.** A step labelled "19.20px
  computed" beside a 19px size reads to a designer in Figma as a mismatch. The ratio and the base
  live once, on the scale.

## Half-steps and broken intervals

A working ratio leaves no collision at whole pixels, so a scale that still needs a step between two
of its own is a half-step, chosen on purpose.

- **Half-steps are a normal part of a working system**, and dense displays are where they earn their
  place: a scale coarse enough to read well at reading sizes is too coarse for a data table.
- **Record a half-step beside the step, with its reason.** Undocumented, it reads as an error and
  the next person restores the computed value.
- **More than one or two half-steps means the ratio or the base is wrong.** Change those and
  recompute rather than correcting the scale step by step.

## Type roles

A **role** is the job a type size does. The same role carries two names, and both point at one set
of values.

| Naming | Shape | Use for |
|---|---|---|
| **Semantic** | Display, Heading, Subheading, Body, Label, with size suffixes | Brand and print systems, and tools leaning on brand hierarchy rather than tokens, such as Illustrator, Canva and Webflow |
| **Token** | The same role in token form, such as `type.body.m` | Web and software design systems, where tokens are the working names |

- **Carry both names over one set of base values.** A semantic scale alone reads as counterintuitive
  in a modern product or web system, where every consumer expects tokens. Two naming schemes over
  one scale is a mapping anyone can follow, and two scales is drift with a schedule.
- **In Figma, build the type styles to match the token library.** The semantic set can live as a
  mode in a collection where that stays clean, and otherwise belongs in the written guidelines
  rather than baked into the file.
- **Name by role, never by appearance.** `type.body.s` survives a redesign and `text-14` does not.
- **Number the steps from the base.** Step 0 is the base type size, step 3 sits three steps up and
  step -1 one step down. A position survives a change of ratio, and it cannot be mistaken for a
  framework's size.
- **Never give a step a framework's name with the brand's value.** Where `text-sm` renders at 12px
  in one system and 14px in the framework it was borrowed from, pasted code sets at the wrong size
  and nothing reports it.
- **Heading levels descend through the scale.** A child heading never renders larger than its
  parent. Adjacent levels may share a size toward the small end, where the scale runs out of
  usable gaps, provided weight or tracking still separates them. No heading goes below body size
  unless it is functioning as an overline.
- **Nine to fifteen steps covers almost every system** (Google, n.d.). Fewer runs out of hierarchy
  before the content does, and more stops being memorable to the people using it.

## What a type size holds

A step is a number. A **type size** is that step with everything set on it, specified as one
decision so it stays consistent everywhere the role appears.

| Property | CSS | Set per type size |
|---|---|---|
| Font family | `font-family` | Which typeface, where the brand runs more than one |
| Font size | `font-size` | The step from the typescale |
| Weight | `font-weight` | One value, with emphasis one step above it |
| Leading | `line-height` | Derived below, and landed on the baseline |
| Tracking | `letter-spacing` | From the curve in [typesetting.md](typesetting.md) |

A starting point for a product interface, with both names carried:

| Role | Token | Size | Leading | Weight |
|---|---|---|---|---|
| Display | `type.display` | 36px | 1.1 | 600 |
| Title | `type.title` | 24px | 1.2 | 600 |
| Heading | `type.heading` | 18px | 1.3 | 600 |
| Body | `type.body` | 16px | 1.5 | 400 |
| Caption | `type.caption` | 12px | 1.4 | 400 |

```css
.heading-lg {
  font-family: var(--brand-display);
  font-size: 40px;
  font-weight: 600;
  line-height: 40px;
  letter-spacing: -0.01em;
}
```

DESIGN.md carries those same five as `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` and
`letterSpacing`, so a scale specified this way serializes into a machine-readable design system with
no translation step (Google, n.d.).

- **Emphasis inside a role is one weight step, never a size change.**

## Leading on the baseline grid

Read [../layout/grids.md](../layout/grids.md) for why every line of type lands on the baseline grid,
which runs at 4px or 3pt. The typescale is where that gets satisfied.

```
leading = ceil(font size × target ratio ÷ base unit) × base unit
```

| Role | Target ratio, before rounding |
|---|---|
| Body | 1.4 to 1.6 |
| Subheading | 1.2 to 1.3 |
| Heading | 1.0 to 1.2 |
| Display | 0.96 down to 0.8 |

- **The requested ratio rarely survives.** Asking for 1.3 at 24px on a 4px unit returns 32px, which
  is 1.333. Store the result, not the ratio you asked for.
- **The display floor moves with x-height.** A typeface with a tall x-height fills more of the em, so
  its lines read tighter at the same ratio and cannot go as low. 0.96 holds for many display
  typefaces, and 0.8 is reachable only at large sizes on one with a short x-height.
- **Read [typesetting.md](typesetting.md) for the corrections** that measure and a dark ground each
  make to these numbers.

**Store leading as a pixel value where the system declares a baseline grid, and as a unitless
ratio where it does not.** A unitless value scales with the font size and survives a fluid scale;
a stored pixel value lands on the baseline. Record which one the system uses.

## Fluid type, when the scale starts breaking down

**Reach for this only once the scale fails at a real size**, where a display step that works at
1280px will not fit at 375px and shifting down a step no longer rescues it. Most brands never need
it, and adding it before that costs a second set of numbers to maintain.

When it is needed, define the scale twice, at a minimum viewport and a maximum, and interpolate so
type moves continuously instead of jumping at breakpoints (Mudford & Gilyead, n.d.).

```
slope     = (maxSize − minSize) ÷ (maxWidth − minWidth)
intercept = minSize − slope × minWidth
font-size: clamp(minSize, intercept + slope × 100vw, maxSize)
```

- **Take a tighter ratio at the small viewport than at the large one.**
- **Both ends of a clamp are expressed in rem, never in pure viewport units.** A `vw` value does not
  respond to browser zoom, which fails WCAG 2.2 SC 1.4.4 at Level AA (World Wide Web Consortium,
  2023).
- **Round both ends to the base unit**, and interpolate the display range only. A body size that
  moves with the window is a body size the reader cannot rely on.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A fluid clamp with a `vw` minimum or maximum. A ban.** Level AA failure under SC 1.4.4.
- **A second typescale**, where shifting down a step or adding a half-step would have held.
- **A scale built before the base type size was set**, or with no base and ratio behind it.
- **Ratios compounded on rounded values**, or rounded in a fixed direction rather than to the
  nearest baseline integer.
- **A departure from the base unit with no reason recorded beside it.**
- **Steps named for their appearance**, such as `text-14`, or a semantic scale shipped alone into a
  product system.
- **A framework's step name carrying the brand's value.**
- **A child heading rendering larger than its parent.**
- **A weight, leading or tracking value set outside the type size it belongs to.**
- **A leading value left off the baseline** in a system that declares a baseline grid.
- **A body size that scales with the viewport.**

## Verify

- [ ] The base type size is recorded, with the surface it was specced against.
- [ ] One base and one ratio are recorded at brand level, and every step reproduces from
      `base × ratio ^ n` compounded at full precision.
- [ ] Every size is the nearest baseline integer, or carries a recorded reason.
- [ ] The scale holds 9 to 15 steps, and heading levels descend through it.
- [ ] Roles carry both names over one set of base values.
- [ ] Every type size specifies family, size, weight, leading and tracking.
- [ ] Every leading value lands on the baseline grid, stored as the result rather than the request.
- [ ] Body leading sits between 1.4 and 1.6 after rounding.
- [ ] Any fluid step clamps between two rem values, both rounded to the base unit.
- [ ] The scale serializes into DESIGN.md typography tokens without a translation step.

---

## Sources

- Google. (n.d.). *DESIGN.md format specification*. GitHub.
  https://github.com/google-labs-code/design.md
- Mudford, T., & Gilyead, J. (n.d.). *Utopia: Fluid responsive design*. https://utopia.fyi
- World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
