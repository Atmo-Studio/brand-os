# Type rendering

**Use when:** Type is being delivered: written into tokens, a stylesheet or a design file, or a
delivered page renders differently from its specification. Read [typescale.md](typescale.md) for
the sizes being delivered, and [typefaces.md](typefaces.md) for licensing and for choosing between
a variable and a static family.

**Source:** field consensus.

---

## Files and loading

- **Serve `.woff2` on the web.** It compresses with Brotli and every current browser reads it. `.ttf`
  and `.otf` are desktop formats with no web compression.
- **Load only the faces the design uses.** Each weight and style is a file, and each file delays
  first render.
- **Subset to the scripts the brand writes in.** A Latin-only brand shipping a full multi-script
  file sends glyphs nobody will see.
- **Set `font-display: swap` for text** and preload the one or two files above the fold. `swap`
  shows fallback text at once and replaces it when the font arrives (World Wide Web Consortium,
  2021).

## Fallback stacks

A stack names what renders while the brand face loads, and what renders when it never does.

```css
font-family: "Brand Face", Helvetica, Arial, sans-serif;
```

- **Pick fallbacks whose metrics sit close to the brand face,** so the reflow when the font arrives
  is small.
- **End every stack on a generic family.** A stack with none hands the choice to the browser.
- **Verify every required form across the whole stack before setting `font-synthesis: none`.** A
  browser missing a bold or an italic draws a faked one and distorts the face. Turning synthesis off
  stops the fake and also erases the emphasis wherever a fallback lacks the form.

## Properties over axis tags

- **Set a variable font through the standard properties.** `font-weight: 650` and
  `font-optical-sizing: auto` keep working when a non-variable fallback renders.
  `font-variation-settings: "wght" 650` does not.
- **Reserve raw axis tags for custom axes** such as `"GRAD"`, which have no property.
- **Reach OpenType features through `font-variant-*`:** `tabular-nums`, `slashed-zero`, ligatures,
  small caps through `font-variant-caps`, superiors and inferiors through `font-variant-position`.
- **Stylistic sets and character variants differ per font** and take `font-feature-settings`. Record
  which sets a brand turns on beside the typeface, since `ss01` means something different in every
  family.

## What a design tool cannot carry

A specification written in CSS and mirrored in a design tool loses whatever the tool has no field
for. These are the losses in a variable-based design file.

| In code | In the design tool | Consequence |
|---|---|---|
| Tracking in `em` | A length in pixels | Convert per size: `em` value × font size. A percent written as a pixel value multiplies the tracking by the font size |
| Family and weight as two properties | One style name per family, such as `Medium` or `65 Medium` | Change the family and the weight name must change with it, or the style falls back |
| A fluid size, `clamp()` | One number | The tool holds one end of the range. Record which |
| `text-box` trimming | No equivalent | Text sits low in a button drawn to the same padding |
| Font features | Set per text style, not per variable | The feature list lives in the style, and a variable sync does not move it |

## Trimming and vertical position

`text-box: trim-both cap alphabetic` removes the space a font reserves above the cap height and
below the baseline, which is why text sits slightly low in buttons and badges (World Wide Web
Consortium, 2024). Chromium 133 and Safari 18.2 support it and Firefox does not, so treat it as an
enhancement: the layout holds without it and tightens with it.

## Wrapping and truncation

- **`text-wrap: balance` on headings, `pretty` on short descriptions.** Skip both in long-form text,
  where they cost layout time and change nothing a reader sees.
- **`overflow-wrap: break-word` wherever a long string could escape** its container.
- **`white-space: nowrap` on labels and badges.**
- **One line truncates with `text-overflow: ellipsis`, several with `line-clamp`.** Keep the full
  value reachable wherever the hidden text matters.

## Underlines, smoothing and rhythm

- **Take underlines from the font's own metrics:** `text-underline-position: from-font`,
  `text-decoration-thickness: from-font`, and `text-decoration-skip-ink`.
- **Apply font smoothing once, on the root.** Set per component, it produces two renderings of one
  typeface on one page.
- **`lh` and `rlh` tie spacing to the computed line height,** which keeps vertical rhythm when the
  type size changes.

## Inputs, language and direction

- **Safari on iOS zooms the page when an input's text is under 16px.** Hold inputs at 16px, or keep
  `font-size: 16px` and scale the input with a transform.
- **Set `lang` on the document and on any run in another language.** Hyphenation, quotation marks
  and font selection all read it.
- **Set `dir`, and wrap mixed-direction values in `<bdi>`.** Digits never reverse.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.

- **A font file loaded and never used.**
- **A stack with no generic family at its end.**
- **`font-synthesis: none`** set before every weight and style was checked across the stack.
- **`font-variation-settings` for an axis that has a standard property.**
- **Tracking moved into a design tool as the same number** under a different unit.
- **A family token changed without its weight names.**
- **A layout that depends on `text-box` trimming** to look right.
- **Font smoothing set on a component.**
- **An input under 16px on a touch surface** with no zoom fix.

## Verify

- [ ] Every web font is `.woff2`, subset to the scripts in use, and every loaded file is used.
- [ ] Every stack ends on a generic family, and its first fallback was chosen for its metrics.
- [ ] Every weight and style the design uses exists in the brand face, or synthesis is left on.
- [ ] Weight and optical size are set through properties. Only custom axes use raw tags.
- [ ] The features a brand turns on are recorded by name beside the typeface.
- [ ] Tracking in the design tool equals the `em` value times the font size, at every size.
- [ ] Family and weight change together wherever a design tool stores them as one style name.
- [ ] Each fluid size records which end the design tool holds.
- [ ] The layout holds with `text-box` unsupported.
- [ ] Inputs render at 16px or carry the transform fix.
- [ ] `lang` and `dir` are set on the document.

---

## Sources

- World Wide Web Consortium. (2021). *CSS fonts module level 4*. https://www.w3.org/TR/css-fonts-4/
- World Wide Web Consortium. (2024). *CSS inline layout module level 3*.
  https://www.w3.org/TR/css-inline-3/
