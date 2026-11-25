# Adaptivity

**Use when:** The layout has to hold at a size, a text size, an orientation or a string length that
was not known when it was made. Screen work always. Any surface that reflows.

Print is fixed and adaptivity is what replaces that certainty. The width is a range, the reader
resizes the text and overrides its spacing, the device rotates, the content varies in length, and
the operating system takes part of the edge. An adaptive layout is not a composition. It is a set
of rules that produces compositions.

Read [grids.md](grids.md) for the base unit and the grid. Target sizes, contrast and the rest of
conformance move to `standards/` once it is built; what is here is only the part that decides
layout.

---

## The viewport is a range

A layout drawn at one width is a screenshot of a layout. The decision is what changes and what
holds as the width moves: what reflows, what reorders, what collapses, what stays fixed, and what
is dropped.

**Start at both extremes of the supported range, then work inward.** The narrowest and widest
cases fail soonest and get the least attention while a design is being made.

## Margins move with the window

Margins are a function of window size, not a constant. Material Design 3 names the sizes rather
than the devices, which is the useful part of the model (Google, n.d.).

| Class | Width | Typical shape |
|---|---|---|
| **Compact** | 0 to 599dp | One pane, touch first |
| **Medium** | 600 to 839dp | One or two panes, 24dp margins |
| **Expanded** | 840 to 1199dp | Two panes |
| **Large** and **Extra-large** | 1200dp and up | Two or three panes |

Read [grids.md](grids.md) for the ÷ 25 margin rule, which lands on the same numbers at these
widths.

**Safe areas are the region inset from the display edges, excluding what the system occupies**
(Apple, n.d.). On the web they read as the `env(safe-area-inset-*)` variables (W3C, 2024).

- **What the system takes, it takes from the composition.**  
  Rounded display corners, camera cutouts, home indicators, status bars and browser chrome all
  subtract from the edge the layout thought it had.
- **Content may extend under them. Anything read or tapped may not.**
- **Anything pinned to an edge adds the inset to its own offset.**  
  A sticky action bar or a floating button positioned at a flat 16px sits under the home indicator
  on the devices that have one (Apple, n.d.).

## Breakpoints come from the content

A breakpoint belongs where the layout stops working, which is a property of the content rather
than of any device.

- **Put the breakpoint where the content genuinely runs out of room.**  
  Where a sidebar squeezes the content below its minimum measure, or a card grid drops under a
  usable column width. Not at 768 because a preset says so.
- **Collapse late.**  
  Hold the full structure for as long as it actually fits. A layout that reshapes itself before it
  has to feels unpredictable to anyone moving between sizes, and it gives up room the reader
  already had.

## Adaptivity is a conformance requirement

Four criteria decide whether a layout adapts, and all four are Level AA. They are law wherever
WCAG is referenced in law, so none of them is a preference.

| Criterion | What the layout must do |
|---|---|
| **1.3.4 Orientation** | Work in both portrait and landscape, unless one orientation is essential. Some readers have a device fixed to a mount and cannot rotate it |
| **1.4.4 Resize Text** | Survive text scaled to 200% with no loss of content or function |
| **1.4.10 Reflow** | No loss of content or function, and no two-dimensional scrolling, at 320 CSS px wide for vertically scrolling content or 256 CSS px tall for horizontally scrolling content |
| **1.4.12 Text Spacing** | Survive the reader overriding line height to 1.5× the font size, paragraph spacing to 2×, letter spacing to 0.12× and word spacing to 0.16× |

- **320 CSS px is a 1280px viewport at 400% zoom.**  
  Reflow is as much about a reader enlarging text as about a small screen (W3C, 2023b).
- **1.4.12 is a requirement to survive the override, not to apply the values.**  
  The reader's own stylesheet supplies them. What the layout owes is a structure that does not
  clip or overlap when they arrive.

## Components read their container

A **media query** asks about the viewport. A **container query** asks about the element's own
containing block (W3C, 2023a). The difference decides where adaptation logic lives.

- **A component appearing in a wide region and a narrow one is two components under media queries.**  
  The viewport is identical in both places and tells the component nothing about the space it
  actually has, so the logic has nowhere correct to sit.
- **Component-level adaptation belongs to the component.**  
  Putting it in the page's breakpoints is what produces a system where the same card exists four
  times.
- **Adaptation is structural, not cosmetic.**  
  Change the structure itself, moving things, folding them away or opening them up according to
  what still matters at that size, rather than scaling everything down in proportion.

## Scales interpolate, they don't step

Simmons named the shift from responsive web design to **intrinsic web design**: layouts built from
the intrinsic needs of each piece of content rather than from a fluid grid plus breakpoints, with
columns and rows that both flex, images that may be fixed or flexible, and not necessarily any
media queries at all (Simmons, 2018).

- **Express adaptation as a flexibility model, not as a list of widths.**  
  A minimum and a maximum, a wrap threshold, or a track sized by its content will handle widths
  nobody enumerated. A layout expressed as breakpoints leaves everything between them undesigned.
- **Type and space interpolate between a minimum and a maximum viewport.**  
  A scale interpolated across that range moves continuously instead of jumping at breakpoints
  (Mudford & Gilyead, n.d.). Round each end to the base unit; the values between are fluid.
- **Every fixed value still comes from the scale.**  
  A one-off spacing value is a decision nobody else can reproduce.

## What the layout has to survive

- **Strings grow, and by no predictable percentage.**  
  How far a string stretches depends on both the target language and how long the original was,
  and the shortest strings stretch furthest in proportion. That makes a one-word button label the
  most exposed element on any screen. A fixed percentage budget will not survive it. Run the layout
  against pseudo-localized text, or against a locale known for long strings.
- **Text containers take a maximum width and a minimum height, never a fixed one.**  
  A button sizes itself from its label through inline padding. A width set to fit English is a
  clipping bug waiting for a locale.
- **A critical action never sits where it can be clipped.**  
  Three places swallow one: the far edge of a pane the user can drag smaller, the part of a
  fixed-height modal that falls out of view, and whatever an on-screen keyboard covers when it
  opens. Anchor critical actions in chrome that does not move. Inside a modal, let the body scroll
  underneath while the buttons stay where they are.
- **Direction mirrors.**  
  Right-to-left scripts mirror the layout, so horizontal position is expressed as leading and
  trailing rather than left and right. Sequences encoding progression mirror with them.
- **Content is variable.**  
  The empty state, the single item, the two hundred items and the item with no image are all real
  states of one layout.
- **Reading order has to match source order.**  
  Visual position and the order content reaches a keyboard or a screen reader are separate.
  Reordering visually without reordering the source produces a layout that is coherent to look at
  and incoherent to operate.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Two-dimensional scrolling at 320 CSS px.** **A ban.** Level AA failure.
- **A layout locked to one orientation.** **A ban.** Level AA failure unless the orientation is
  essential.
- **Breakpoints at device presets.**
- **A layout checked only at one width.**
- **A wide structure collapsed before it failed.**
- **The same component duplicated per context it appears in.**
- **A fixed width or height on a text container.**
- **A flat edge offset on anything pinned to a display edge**, with no safe-area inset added.
- **Physical left and right in a layout that has to mirror.**
- **A spacing value that appears once and comes from nowhere.**

## Verify

- [ ] Inspected at the narrowest and widest supported sizes, then between.
- [ ] No two-dimensional scrolling at 320 CSS px, and none at 400% zoom on a 1280px viewport.
- [ ] Holds at 200% text with no loss of content or function.
- [ ] Holds under the 1.4.12 text-spacing overrides applied together.
- [ ] Works in both orientations.
- [ ] Breakpoints sit where the content stops fitting, and collapse late.
- [ ] Components appearing in more than one region adapt to their container.
- [ ] Margins follow the window size, and edge-pinned elements add the safe-area inset.
- [ ] Type and space interpolate across the range, with both ends on the base unit.
- [ ] No fixed dimensions on text; holds under pseudo-localization.
- [ ] Horizontal position is expressed as leading and trailing.
- [ ] Source order matches visual order.
- [ ] Critical actions are not in clip-prone positions.
- [ ] The empty, single-item, overflowing and image-less states all hold.

---

## Sources

- Apple. (n.d.). *Human interface guidelines: Layout*.
  https://developer.apple.com/design/human-interface-guidelines/layout
- Google. (n.d.). *Material Design 3: Layout*. https://m3.material.io/foundations/layout
- Mudford, T., & Gilyead, J. (n.d.). *Utopia: Fluid responsive design*. https://utopia.fyi
- Simmons, J. (2018). *Everything you know about web design just changed* [Conference presentation].
  An Event Apart.
- World Wide Web Consortium. (2023a). *CSS containment module level 3*.
  https://www.w3.org/TR/css-contain-3/
- World Wide Web Consortium. (2023b). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
- World Wide Web Consortium. (2024). *CSS environment variables module level 1*.
  https://www.w3.org/TR/css-env-1/
