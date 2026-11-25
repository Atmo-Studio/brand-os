# Typesetting

**Use when:** Setting text on any surface, or judging text someone else set.
Read [typescale.md](typescale.md) for the sizes and their leading targets, and
[typefaces.md](typefaces.md) for the typefaces.

---

## Kerning, tracking, and leading

Three spacings, confused constantly, set by different people at different times (Lupton, 2010).

| Term | What it adjusts | Who sets it |
|---|---|---|
| **Kerning** | The space between one specific pair of letters (e.g. `AV`, `Ye`, `To`) | The type designer, in the font's kern table, applied automatically |
| **Tracking** | The space between every character across a span of text, applied evenly. `letter-spacing` in CSS | The designer, per size |
| **Leading** | The distance from one baseline to the next. `line-height` in CSS | The designer, per type size |

- **Never switch kerning off to fix spacing.** `font-kerning: none` discards the type designer's
  whole pair table. Tracking is the control that was wanted.
- **Correcting pairs by hand is a display-only job.** At text sizes the font's table beats hand
  correction, and there is far too much of it to correct anyway.

## Measure caps the line length

**Measure** — the length of a line of text, counted in characters including spaces.

| Structure | Characters per line | Source |
|---|---|---|
| Single column | 45 to 75, with 66 as the usual target | Bringhurst, 2004 |
| Multiple columns | 40 to 50 | Bringhurst, 2004 |
| Long-form on screen, in practice | 60 to 75 | |
| Absolute cap | 80 | World Wide Web Consortium, 2023, SC 1.4.8, Level AAA |

The band is set by column count rather than by medium. A three-column print page and a three-column
screen layout take the same 40 to 50.

- **Cap it in whatever unit the work uses.** `65ch`, a max-width in rem, or a column width in picas.
  The unit does not matter; what matters is that some cap is set and the resulting count falls
  inside the band.
- **Recheck the measure whenever the body size changes.** The character count moves even though the
  container did not.
- **Fix the measure first, then take the column count it implies.** Read
  [../layout/grids.md](../layout/grids.md) for how that resolves into a grid.

## Leading falls as size rises

Body sits at 1.4 to 1.6 and display runs down toward 0.96. Read [typescale.md](typescale.md) for the
targets and the rounding. What happens here is the correction applied once the type is set.

- **A tall x-height needs more leading at the same ratio.** The letters fill more of the em, so the
  lines read tighter than the number suggests.
- **A wider measure needs more leading.** The eye travels further on the return, and leading is what
  keeps it from landing on the wrong line.
- **Light text on a dark ground needs correcting on three axes at once**: slightly more leading, a
  little more tracking, and one weight step up where the typeface needs it. Light strokes bloom
  against dark, which reads as both heavier and tighter than the same setting reversed.
- **Tight leading is for short text.** Anything wrapping to three lines or more takes at least 1.4
  whatever its role, including a card description in a height-constrained row.

## Tracking tightens as size rises

At small sizes characters crowd each other. At large sizes the gaps between them read as holes. The
curve runs one way and the capitals case runs against it.

| Size | Tracking |
|---|---|
| Under 12px | +0.05em to +0.1em |
| 12 to 16px | 0 to +0.02em |
| 16 to 24px | 0 to −0.01em |
| 24 to 48px | −0.01em to −0.02em |
| 48px and up | −0.02em to −0.04em |
| All caps, any size | +0.05em to +0.12em |

- **Monospace at label sizes runs against the small-size rule.** A monospace typeface is already
  fitted to one wide advance width, so opening it further separates the characters instead of
  relieving them. A monospace label at 10 to 12px commonly takes −0.01em to −0.02em where a
  proportional typeface at the same size takes positive tracking. Correct for optical balance rather
  than applying the curve.
- **Letter spacing does not apply to logographic scripts**, and word spacing does not apply to
  scripts written without word boundaries. Chinese, Japanese and Korean set to their own rules.
- **Convert design-tool values rather than copying the number.** Figma and Sketch give pixels or a
  percentage, so `em = px ÷ font size`. Adobe applications give thousandths of an em, so
  `em = tracking ÷ 1000`. An Adobe tracking of 75 at 16px is 0.075em, which is 1.2px.

## Weight has a floor below 18px

- **Stay at 400 or heavier below 18px.**
- **Treat weights under 300 as display-only, at 28px and above.** Their strokes thin to nothing at
  reading sizes, and a low-resolution screen drops them altogether.
- **Optical weight runs against the textbook rule as often as with it.** The rule says heavier at
  large sizes and lighter at small. In practice a typeface often needs a heavier weight at small
  sizes to hold the same optical weight as the display line, and a lighter one at large sizes for the
  same reason. There is no fixed step: correct by eye, against this typeface at this size.
- **Overlines and eyebrows run all caps, tracked out, at medium or semibold.** The capitals and the
  tracking are what make a 12px line read as a label rather than as small body text.

## Body sits at 16px, and the unit decides who controls it

| Text | Size |
|---|---|
| Long-form body | 16px, verified in the actual typeface and measure |
| Interface text, inputs and menus | 14px |
| Captions and metadata | 13px |
| Utility text: labels, breadcrumbs, tooltips, badges | 10 to 12px |

- **Small is a property of the job, not a floor to defend.** Utility text sits at 10 or 11px in
  plenty of working interfaces. What never goes there is anything read continuously.
- **Move off 16px for a reason that can be named**: the typeface runs small, the measure is narrow,
  or the product is a dense professional tool.

Units are not interchangeable, and the choice decides whether the reader keeps control.

| Unit | Behavior |
|---|---|
| `px` | Fixed. Ignores the reader's own font-size setting |
| `rem` | Scales with the root font size, which is where the reader's setting lands |
| `em` | Scales with the current element's font size, which makes it right for tracking and wrong for nesting |

- **Set type sizes in rem and tracking in em.** A size in rem honors the reader's browser setting,
  and a tracking value in em stays proportional to whatever size it lands on.
- **A size is large text for contrast purposes at 18pt, or 14pt bold**, which is where the WCAG
  requirement drops from 4.5:1 to 3:1 (World Wide Web Consortium, 2023, SC 1.4.3). Measuring the
  pair is a color decision; typography decides which side of the threshold a role sits on.
- **The reader may override all of it.** Text has to survive 200% resize under SC 1.4.4 and the
  reader's own spacing overrides under SC 1.4.12, both Level AA. Read
  [../layout/adaptivity.md](../layout/adaptivity.md) for what the layout owes them.

## Rag, widows, and orphans

- **Ranged left with a ragged right is the default for anything operable.** Justification belongs to
  editorial layouts with hyphenation switched on, and nowhere in an interface (Butterick, n.d.).
- **Justified text without hyphenation opens rivers**, vertical channels of white running down the
  column as the word spaces stretch to fill each line.
- **Read the rag as a shape.** A good rag varies without pattern. A rag stepping in or out over three
  or more consecutive lines reads as a deliberate edge that is not there.
- **Two definitions of widow are in use, and the fix differs.** In book work an **orphan** is a
  paragraph's first line stranded at the foot of a column and a **widow** is its last line carried
  alone to the top of the next. In screen practice a widow is a single word alone on the last line
  of a paragraph. Name which one you mean: the first is fixed by adjusting the column, the second by
  balancing the wrap.
- **Write copy in natural case and set the case in CSS.** `text-transform` means a redesign never
  becomes a rewrite.
- **Use the real characters.** Curly quotes in prose and straight quotes in code, an en dash for
  ranges, the single ellipsis character, and a non-breaking space holding a value to its unit.
- **Give changing numbers tabular figures.** Digits have different widths by default, so a timer, a
  counter or a price shifts the layout every time it updates.

## Judging a set page

Six questions, each answered with an artifact rather than an opinion.

| Ask | What answers it |
|---|---|
| **Authority and fit** | Which typefaces and weights are established, and what in the brief justifies them |
| **Hierarchy** | Whether heading, body, label and metadata separate at a glance, without reading |
| **Scale and consistency** | A typescale with a base and a ratio, or a collection of one-off values |
| **Reading** | Measure inside the band, leading tuned to this typeface at this width |
| **Stress** | The longest heading, a translated string, 200% zoom, a narrow container, a missing weight |
| **Delivery** | Only the used fonts loaded, no invisible text, no reflow when they arrive |

**A set paragraph is a gray rectangle before it is language.** Its darkness comes from size, weight,
leading and measure together, so a paragraph reading too dark is as likely to be a leading fault as
a weight fault. Read [../layout/foundations.md](../layout/foundations.md) for the squint test. A
clean automated scan is a floor rather than a pass: nothing mechanical reads the rag or the gray.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Running text with no measure cap**, or a measure band picked from the medium rather than from
  the column count.
- **One leading value across every role**, or display leading on anything wrapping to three lines.
- **Light text on dark left uncorrected** on leading, tracking and weight.
- **The small-size tracking rule applied to a monospace label.**
- **Letter spacing applied to Chinese, Japanese or Korean text.**
- **A design-tool tracking number carried into CSS without conversion.**
- **Kerning switched off** to correct a spacing problem tracking owns.
- **Weights under 400 below 18px**, or under 300 outside display sizes.
- **Anything read continuously below 16px with no stated reason.**
- **Type sizes set in px** where the reader's own font-size setting should reach them.
- **Justified text without hyphenation**, or justification anywhere in an interface.
- **A widow, an orphan, or a river** left in finished work.
- **Changing numbers set in proportional figures.**

## Verify

- [ ] Every running text block has a measure cap, and the count sits in the band for its column count.
- [ ] Leading varies by role, rises with measure and x-height, and nothing wrapping to three lines
      or more sits below 1.4.
- [ ] Text on a dark ground carries all three corrections.
- [ ] Tracking follows the size curve, with capitals opened, monospace handled as its own case, and
      any design-tool value divided rather than copied.
- [ ] No weight below 400 appears under 18px, and none below 300 outside display sizes.
- [ ] Continuous reading sits at 16px or carries a stated reason; small sizes are utility text only.
- [ ] Sizes are expressed in rem, tracking in em, and every role sits on the correct side of the
      18pt or 14pt-bold contrast threshold.
- [ ] The setting holds at 200% zoom and under the reader's spacing overrides.
- [ ] Nothing in an interface is justified, and justified editorial text has hyphenation on.
- [ ] The rag varies without stepping over three consecutive lines, and no widow, orphan or river
      survives.
- [ ] Changing numbers use tabular figures.
- [ ] The six assessment questions are each answered with an artifact.

---

## Sources

- Bringhurst, R. (2004). *The elements of typographic style* (3rd ed.). Hartley & Marks.
- Butterick, M. (n.d.). *Butterick's practical typography*. https://practicaltypography.com
- Lupton, E. (2010). *Thinking with type* (2nd ed.). Princeton Architectural Press.
- World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
