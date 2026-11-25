# Color usage

**Use when:** Applying a color system that already exists, checking a pair against the background
behind it, or building a second theme. Read [color-ramps.md](color-ramps.md) for the ramps
this file applies, and [color-composition.md](color-composition.md) for how much of each color
belongs on a surface.

---

## Color roles

- **Give every color a job, then keep it to that job.** Where the accent means "you can click this,"
  an accent-colored heading tells the reader it is a link. Readers do not see a near-miss hue as a
  different color, they see the same color slightly off.
- **The rule works in both directions.** A color missing where its meaning applies misleads as much
  as one appearing where it does not. Where the accent means interactive, an interactive element
  left neutral fails the same way a neutral one given the accent does. Where the palette is all
  neutrals, something else carries that signal, whether weight, an underline or position, and the
  same consistency rule binds whatever carries it.
- **Use each semantic token only for the job its name describes.** A border token pressed into
  service as a text color works until the first theme change and then fails, because nothing ever
  guaranteed one value would suit both jobs.
- **Commit the boldest color to one substantial area or one job.** Sprinkling it in small doses
  across a surface drains it. An accent works because it is rare.
- **One filled action per view.** Where every control is colored, none of them reads as primary.
  Selected and active states are state rather than emphasis, and may use the accent without
  spending it.
- **On a colored surface, derive the secondary text from that surface's own hue** instead of
  dropping in a generic gray, which reads as washed out against anything but white.
- **State colors appear outside their state, and that is fine where the role stays obvious.** Chips
  and tags spanning a wide range of hues, and illustration, both draw on the state palette without
  reporting a state. What matters is that a viewer never has to work out whether a color is telling
  them something or decorating something.

## Gradients

- **The interpolation space is an aesthetic decision, not a correctness one.** sRGB and OKLab
  interpolate in a straight line through the space. OKLCH interpolates around the hue wheel, so it
  stays vivid and passes through every hue between the two stops.
- **Expect a polar space to invent hues.** A blue-to-pink gradient in OKLCH travels through purple
  on the way. That is either the intent or the first thing to check when a gradient produces a color
  nobody specified.
- **Two hues from opposite sides of the wheel drag the midpoint through the neutral center**, and
  the middle of the gradient goes gray. Fix it by interpolating in a polar space, which travels
  around the wheel rather than across it, or by adding a middle stop and keeping the space.
- **Banding shows up on large areas with closely spaced stops.** Push the stops further apart,
  shrink the area, or lay a light noise texture over it.
- **Contrast changes continuously along a gradient, so one measurement describes none of it.** Set
  text on a solid panel instead. Where it has to sit on the gradient, measure at the point where the
  contrast is worst, or put a scrim underneath.

## Contrast

Work out which element actually paints the background behind the foreground, which is normally the
nearest ancestor that paints one. Text on a card sits on the card, not on the page, and measuring
against the page reports a number that never appears on screen.

| Content | AA | AAA |
|---|---|---|
| Body text | 4.5:1 | 7:1 |
| Large text | 3:1 | 4.5:1 |
| Interface components and graphical objects | 3:1 | none defined |

WCAG 2.2 AA is the floor for every pairing that occurs on screen (World Wide Web Consortium, 2023,
SC 1.4.3 and SC 1.4.11). Read [../typography/typesetting.md](../typography/typesetting.md) for the
size at which text qualifies as large.

- **Measure the pairs that actually occur, not every possible combination.** Fix the brand's
  backgrounds first: the page, the surfaces, the state backgrounds. Then measure every foreground
  against those. Two colors that never meet on screen need no ratio between them.
- **A state surface carries its own foreground.** A warning background takes a much lighter tint of
  its own hue, or white, whichever clears the floor against it. That is the shape of the answer, not
  a pair to copy.
- **Clearing the floor is a valid place to stop.** Taking the first ramp step that passes against the
  background is as legitimate as reaching for the furthest step available. Maximum contrast is a
  style, not a requirement, and a system that always reaches for the extreme reads louder than the
  brand may have intended. Read `Visual Identity (Order 32) → ## Concept` for which register the
  brand wants: a soft, close-toned reading surface and a stark high-contrast one are both
  deliberate.

- **Fix a failing pair by moving lightness. Leave hue and chroma alone.** Lightness is the channel
  contrast responds to; chroma barely moves the number. Holding the other two keeps a contrast fix
  from turning into a palette revision.
- **Use lightness to predict before you measure.** Above roughly 0.6 lightness a background behaves
  as light and wants dark text. On a background above 0.85, foregrounds below 0.45 clear body text
  comfortably; on one below 0.25, foregrounds above 0.75 do (Krehel, n.d.).
- **A background in the middle of the range caps what any foreground can reach.** When no
  foreground clears body text against it, change the background instead of hunting for a text
  color that works.
- **Raising lightness can push a color past the gamut boundary.** Lower chroma to bring it back.
  Read [color-spaces.md](color-spaces.md) for what clipping does to a ramp.
- **A value with alpha has no fixed contrast ratio**, because what it renders depends on whatever
  sits behind it. Anything carrying text takes a solid value.
- **Measure again after every change.** A fix is not a fix until it has been measured.

**APCA** models perceived contrast better than the WCAG 2.x ratio, particularly for thin and light
text. It is not a conformance target: it left the WCAG 3 working draft in July 2023, the replacement
algorithm is undecided, and WCAG 2.2 does not include it. Use it to choose between two options that
already clear the floor, never in place of the floor.

## Color alone

- **Color never carries a distinction by itself** (World Wide Web Consortium, 2023, SC 1.4.1). Pair
  it with an icon, a label, a shape or a position. A status system distinguished only by red and
  green fails this.
- **Separate states by lightness as well as hue.** A pair told apart only by hue collapses for a
  viewer who cannot separate those hues. A pair that also differs in lightness survives.
- **Simulate deuteranopia, protanopia and tritanopia across the whole system**, and compare the
  state colors against each other rather than only against their backgrounds. Error and success
  landing at the same lightness is what this catches.
- **In charts and data, encode the same value twice.** Vary brightness, intensity, marker shape,
  a direct label or a fill pattern alongside hue, so nothing depends on telling two hues apart.

## Themes

- **Decide the brand's primary theme before building a second.** Whether the brand is natively light
  or natively dark follows from `Brand Positioning (Order 23) → ## Unique Value` and
  `Visual Identity (Order 32) → ## Decided Constraints`, and it settles which theme gets designed
  and which gets derived.
- **Give every custom color a value in every theme the brand ships.** A color defined once and
  reused across themes is the most common source of a failing pair.
- **Treat increased contrast as a third theme, not a toggle.** Widen the separation between
  foreground and background, then measure again. Widening without measuring is not fixing.
- **Choose one switching mechanism and use it everywhere.** Where some values switch on the system
  preference and others switch on an explicit setting, the interface renders half-themed the moment
  someone overrides their system.

## The dark theme

Reversing the light palette gives you a starting point, not a dark theme.

- **Sit the base surface on a dark gray rather than pure black.** Material specifies `#121212`
  (Google, n.d.). Light text on pure black produces too much contrast and tires the eye, and a pure
  black surface has nowhere to show a shadow.
- **Show elevation through lightness instead of shadow.** Raise a surface by laying a white overlay
  over it, growing from 0% at the base to 16% at the highest level (Google, n.d.). Shadows do not
  register against a dark background.
- **Soften the accents.** A color that looks confident on white vibrates against a dark surface and
  often drops below the floor there. Material puts the working accent near the `200` tone (Google,
  n.d.), one or two steps lighter and less intense than the light theme uses.
- **Light text on a dark background halates**, spreading into the background and thickening the
  strokes. Dark text on light beats the reverse on both visual acuity and proofreading
  (Piepenbrock et al., 2013), and the gap widens as characters get smaller (Piepenbrock et al.,
  2014).
- **Give small text a size or weight step up on dark.** That follows directly from the size finding,
  and it is why a type spec cannot cross themes unchanged.
- **Draw a dark variant of the logo.** The same halation thickens a mark's strokes and closes its
  counters, so proportions and clear space that work on light do not transfer.
- **Contrast is not symmetrical.** A pair that passes on a light background can fail when the two
  colors swap places, so measure each theme on its own rather than assuming the reverse holds.
- **Spread the dark steps further apart than the light ones.** Values that read as distinct pale
  backgrounds collapse into each other once they are dark surfaces.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Any pairing that occurs on screen sitting below WCAG 2.2 AA. A ban.**
- **A distinction carried by color alone. A ban.** SC 1.4.1.
- **APCA used instead of the WCAG floor** rather than above it.
- **Contrast measured against the page** where the element renders on a card, an overlay or a
  translucent surface.
- **A control's interactive states left unmeasured** because its resting state passes. Hover and
  active commonly move the fill toward the ground behind it, so the resting measurement is the one
  least likely to fail.
- **A contrast fix made by changing hue** instead of lightness.
- **A value with alpha behind text.**
- **A semantic token used outside the job its name describes.**
- **A second theme produced by inverting the first** and shipped without retuning or remeasuring.
- **A pure black surface** in a dark theme.
- **Type sizes reused unchanged** across a light and a dark theme.
- **Two switching mechanisms** in one system.
- **Text set on a gradient** with no scrim and no worst-point measurement.
- **A generic gray used for secondary text** on a colored surface.

## Verify

- [ ] Every foreground and background pair that occurs on screen meets 4.5:1, or 3:1 where the text
      is large or the element is a component or graphical object.
- [ ] Where a foreground stops at the floor rather than the far end of its ramp, that is a recorded
      choice rather than an oversight.
- [ ] Every pair was measured against the background that actually renders behind it.
- [ ] Rest, hover, active, focus and disabled were each measured against the ground that state
      actually paints on, not only the resting fill.
- [ ] Every pair was measured in every theme the brand ships, not derived from one.
- [ ] No distinction anywhere depends on color alone.
- [ ] The system has been simulated under deuteranopia, protanopia and tritanopia, and the state
      colors differ from each other in lightness.
- [ ] The primary theme is recorded, and every custom color has a value in every theme.
- [ ] The primary-theme decision traces to `Brand Positioning (Order 23) → ## Unique Value` and
      `Visual Identity (Order 32) → ## Decided Constraints`, or their absence was flagged rather
      than assumed.
- [ ] The dark theme sits on a dark gray base, shows elevation through lightness, and softens its
      accents.
- [ ] Small text on dark carries a size or weight step over its light equivalent.
- [ ] A dark logo variant exists wherever the brand ships a dark theme.
- [ ] One switching mechanism is in use throughout.
- [ ] Nothing carrying text uses a value with alpha.
- [ ] The palette has been checked on a sparse screen, a crowded one, a screen mid-interaction, a
      screen showing an error, and a screen with no content in it yet.

---

## Sources

- Google. (n.d.). *Material Design: Dark theme*. https://m2.material.io/design/color/dark-theme
- Krehel, J. (n.d.). *OKLCH color picker, converter and guide*. https://oklch.fyi/
- Piepenbrock, C., Mayr, S., Mund, I., & Buchner, A. (2013). Positive display polarity is
  advantageous for both younger and older adults. *Ergonomics, 56*(7), 1116-1124.
- Piepenbrock, C., Mayr, S., & Buchner, A. (2014). Positive display polarity is particularly
  advantageous for small character sizes: Implications for display design. *Human Factors*.
  https://doi.org/10.1177/0018720813515509
- World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
