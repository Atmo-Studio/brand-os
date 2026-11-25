# Brand motifs

**Use when:** Deciding what makes a brand recognizable before its name is read, turning that into
repeatable motifs, or judging whether a pattern, a treatment, a web effect or a shader belongs to
the brand. Read [design-principles.md](design-principles.md) for repetition and unity, and
[motion.md](motion.md) for anything that moves.

**Source:** field consensus on distinctive assets and on accessibility, except the house positions
on the core idea, the count of motifs and the placement rule.

Three words, used precisely throughout.

**Core idea** — the one rule that makes the brand recognizable, stated as behavior.

**Motif** — a repeated visual pattern that carries the core idea onto a surface.

**Placement rule** — where a motif appears, how much of it, and where it never appears.

---

## What a motif is for

A distinctive brand asset is a non-name element that brings the brand to mind, and its strength has
two measures: how many people link it to the brand, and how few link it to anyone else (Romaniuk,
2018). A logo is one such asset. A motif is how a brand gets more of them without adding logos.

- **An identity is a system, and its quality lives in how the elements behave together** (Wheeler,
  2017). Motifs are where that behavior becomes visible.
- **A motif works with the logo removed.** Cover the name and the mark. If the surface still reads
  as this brand, the motif is doing its job.
- **Consistency builds the link and change resets it.** An asset earns recognition through
  repetition over years (Romaniuk, 2018), so a motif redrawn each season never accumulates.
- **A motif nobody else in the category could run is worth more than a well-made one.** Read
  `Competitive Landscape (Order 22)` for what the category already owns.

## The core idea

- **State the core idea as a rule about behavior.** "One bright mark against everything else" tells
  a stranger what to do with a blank surface. "Bold and modern" does not.
- **The idea is one motif, or it is carried across several.** A brand with a single strong device
  has an idea and a motif in the same sentence. A brand with three motifs needs the sentence that
  explains why those three belong together.
- **The test is a surface the brand has never been shown on.** Someone holding only the core idea
  produces something recognizably on-brand, or the idea is a mood.

## Kinds of motif

| Kind | What repeats | Holds up where |
|---|---|---|
| **Mark-derived shape** | Geometry lifted from the logo: its angle, its counter, its grid | Every medium, one color included |
| **Pattern** | A tile built from brand elements | Packaging, backgrounds, print. Fails at small sizes |
| **Texture** | A material quality: grain, halftone, paper | Large areas. Fails in one-color reproduction |
| **Color behavior** | How a color is dosed, such as an accent used only as punctuation | Everywhere color reproduces |
| **Type treatment** | A consistent typographic move: a case, a scale jump, a label style | Everywhere type appears |
| **Crop or framing** | How images are cut and placed | Wherever the brand has images |
| **Grid behavior** | A structural habit: an offset, a ribbon, a corner the mark always holds | Layout work in any medium |
| **Motion signature** | One recurring movement | Screens only. Needs a still equivalent |
| **Web effect or shader** | A rendered, often interactive surface | Capable screens only. Needs a still equivalent |

## Building one

- **Derive it from something the brand already owns.** The mark's geometry, the product's form, a
  material the business handles, a word in the positioning. A motif with no origin in the brand is
  decoration with a rationale written afterward.
- **Give every motif a placement rule.** Where it appears, how much of the surface it takes, and
  where it never appears. A motif without one is a flourish.
- **Scarcity is part of the rule.** A device on every surface at every size stops reading as a
  signal. Say how often, and what it is saved for.
- **Draw the construction.** Proportions, angles and the grid a motif sits on are what let someone
  else reproduce it. A motif that exists only as a finished image gets redrawn slightly wrong each
  time.
- **Test it at the smallest size and in one color.** A motif that needs full color and a large area
  is a hero image, and belongs in the imagery direction.
- **One leading motif and at most two supporting ones.** Assets are built deep, a few at a time
  (Romaniuk, 2018). A fourth motif dilutes the first.

## Effects and shaders

A web effect or a shader is a motif when it has a placement rule and a still form. Without both it
is a demo.

- **Every effect has a still frame that reads as the same motif.** The still is what print, a slow
  device, a reduced-motion setting and a social card receive.
- **Honor reduced motion by showing the still.** `prefers-reduced-motion: reduce` is a request the
  page can read (World Wide Web Consortium, 2024).
- **Nothing flashes more than three times in any one second. A ban** (World Wide Web Consortium,
  2023, SC 2.3.1).
- **Anything that moves on its own for more than five seconds can be paused** (World Wide Web
  Consortium, 2023, SC 2.2.2).
- **Hold the frame budget.** At 60 frames a second each frame has 16.7ms, and an effect that misses
  it stutters the whole page, not only itself.
- **Stop rendering when the effect is off screen or the tab is hidden.**
- **Text never sits directly on a live effect.** Contrast changes with every frame, so no single
  measurement describes it. Put a solid panel or a scrim under the text, and read
  [color/color-usage.md](color/color-usage.md) for the floor.
- **An effect takes its colors from the brand's tokens.** One that brings its own palette is a
  second brand on the page.

## Refuse

Category defaults, not prohibitions. Terms in `INDEX.md → ## How a discipline is shaped`. Bans are
marked.

- **A core idea stated as adjectives.**
- **A motif with no placement rule.**
- **A motif with no origin in the brand's own material.**
- **A motif that exists only as a finished image,** with no construction recorded.
- **More than three motifs.**
- **A motif on every surface at every size.**
- **A pattern, a gradient mesh or a blob background** chosen because the category uses one.
- **An effect with no still form.**
- **An effect that ignores a reduced-motion setting. A ban.**
- **Flashing above three times a second. A ban.**
- **Text set directly on a live effect.**
- **An effect with colors outside the brand's tokens.**

## Verify

- [ ] The core idea is one sentence about behavior, and it produces recognizable work on a surface
      it was never shown on.
- [ ] Each motif names what in the brand it derives from.
- [ ] Each motif has a placement rule: where, how much, where never.
- [ ] Each motif has its construction recorded.
- [ ] Each motif holds at the brand's smallest size and in one color, or records that it does not.
- [ ] The brand carries one to three motifs.
- [ ] With the name and the mark covered, a surface still reads as this brand.
- [ ] Every effect has a still frame, shown under reduced motion.
- [ ] Nothing flashes more than three times in a second, and anything moving past five seconds can
      be paused.
- [ ] Every effect holds 16.7ms a frame on the slowest device the brand supports, and stops when
      hidden.
- [ ] Every effect draws its colors from the tokens.

---

## Sources

- Romaniuk, J. (2018). *Building distinctive brand assets*. Oxford University Press.
- Wheeler, A. (2017). *Designing brand identity: An essential guide for the whole branding team*
  (5th ed.). Wiley.
- World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
- World Wide Web Consortium. (2024). *Media queries level 5*.
  https://www.w3.org/TR/mediaqueries-5/
