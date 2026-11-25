# Color composition

**Use when:** Deciding how much of each color appears on a surface and where it sits. Read
[color-ramps.md](color-ramps.md) for which colors the brand owns, and
[color-usage.md](color-usage.md) for checking the pairs a composition produces.

**A palette type describes how the brand's colors relate to each other on the color wheel. A
composition strategy decides how much of each color appears on a surface, and where.** These are
separate decisions, and one palette supports several strategies across different surfaces.

Monochrome the strategy is not the same as a monochromatic palette. A brand with a complementary
palette can compose a page in monochrome by using one hue's ramp alone, and it is still a
complementary brand.

Itten's contrast of extension covers the underlying mechanism: the relative area a color occupies
changes how it reads, independent of the color itself (Itten, 1970).

---

## The strategies

### 60-30-10

Dominant color 60% of the surface, secondary 30%, accent 10%. An interior-design convention carried
into brand and interface work, and the most widely used of these.

- **Use when** the surface needs a clear ranking and a settled, professional read: marketing
  pages, dashboards, most product interfaces.
- **The accent collapsing to 2–3% is the common failure.** The proportions drift toward 70-28-2, the
  accent stops registering as a deliberate third element, and the composition reads as two colors
  with a stray. Measure the accent's actual area rather than trusting the intent.
- **The 60 is usually a neutral**, not the brand hue. Reading it as "60% brand color" produces a
  surface nobody can look at.

### Neutral and accent

The neutral ramp carries everything structural. One accent hue marks interaction and nothing else.

- **Use when** content should dominate and the interface should recede: tools, documentation,
  reading-heavy products, data-dense work.
- **This is 60-30-10 with the 30 also neutral.** The two combine rather than compete.
- **Its failure is the accent leaking** onto decorative elements, which removes the one signal it
  existed to carry.

### Monochrome

One hue's full ramp, and nothing else. Hierarchy comes entirely from lightness.

- **Use when** the brand wants cohesion and mood over signal variety, or where a single strong
  hue is the identity.
- **It needs the full ramp.** A short ramp goes flat and drops below the contrast floor, because
  lightness is carrying every distinction on the surface.
- **It leans on the other disciplines.** With no hue contrast available, typography and spacing do
  the ranking that color would otherwise do.

### Duotone

Two colors, high contrast between them, applied across imagery as well as surface.

- **Use when** the brand needs to be memorable and instantly identifiable at a glance, and it
  can commit hard enough to run the treatment across photography too.
- **Its whole value is the commitment.** Applied to some assets and not others, it reads as an
  inconsistency rather than a system.
- **Photography has to survive it.** Images with important detail in the midtones flatten under a
  two-color mapping.

### Color blocking

Whole regions filled with one flat color, butted straight against the next with nothing blending
between them. Editorial and high-impact, descended from De Stijl and the Bauhaus.

- **Use when** boldness matters more than subtlety: brand launches, campaign work, editorial.
- **Content adapts per block.** Foreground colors change with the block behind them, so every text
  and block pairing gets checked rather than one global pair.
- **It needs a grid underneath.** Without a structure holding the blocks, the surface reads chaotic
  rather than deliberate.

### Inverted sections

The page alternates between a light appearance and a dark one, section by section.

- **Use when** a long page needs rhythm, or a section needs to read as a distinct moment.
- **Every inverted section is a second appearance**, so its pairs are checked separately. Read
  [color-usage.md](color-usage.md) for what changes on the dark side.
- **The inversion has to mean something.** Alternating on a fixed interval with no relation to the
  content reads as decoration and the reader stops registering it.

### Gradient-led

A gradient carries the dominant surface, with solid colors for content on top.

- **Use when** the brand's expression is atmospheric rather than graphic, most often on hero and
  campaign surfaces rather than through a product.
- **Text sits on a solid background, not on the gradient**, or on a scrim laid over it. Contrast
  shifts the whole way along a gradient, so measuring it once tells you nothing about the rest.
- **It ages faster than the others.** A gradient treatment dates a brand to the period it was made
  in more reliably than any other strategy here.

### Maximalist

Many hues, high chroma, dense application. Color is the content.

- **Use when** `Brand Positioning (Order 23)` is expressive and the audience expects energy over
  calm.
- **It still needs a ranking.** Maximalism without hierarchy is noise, and the ranking usually has
  to come from scale and position because color has stopped providing it.
- **The contrast floor still applies.** More color does not relax it, and this strategy fails it
  more often than any other.

## Choosing

Read `Brand Personality (Order 31) → ## Personality Summary` for the character the strategy has to
produce, and `Visual Identity (Order 32) → ## Decided Constraints` for any strategy already fixed.

| The work is | Reach for |
|---|---|
| Enterprise or professional | 60-30-10, neutral and accent |
| A tool, or developer-facing | Neutral and accent, monochrome |
| Reading or content-heavy | Neutral and accent, monochrome, 60-30-10 |
| A launch or campaign | Color blocking, inverted sections, gradient-led |
| Expressive or youth-facing | Maximalist, duotone, color blocking |
| Built to be memorable at a glance | Duotone, color blocking |

- **The strategy is declared once, at brand level, and named in the guidelines.** Undeclared, each
  new surface picks its own and the brand stops being recognizable across them.
- **The medium narrows the list before taste does.** A strategy resting on large flat areas of ink
  costs real money in print, and one resting on a dark appearance is unavailable on uncoated stock.

## Combining

Strategies layer, and most real brands run two.

- **A base strategy for the product, a second for marketing.** Neutral and accent through the
  interface, color blocking on the marketing site, is the most common pairing there is.
- **60-30-10 calibrates rather than competes.** It sets the proportions inside another strategy
  rather than replacing it.
- **Two strategies is a system. Three is drift.** Where a third appears, it is usually one surface
  that was designed without reference to the guidelines.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A composition strategy conflated with a palette type**, such as treating monochrome as available
  only to a monochromatic brand.
- **60-30-10 with the dominant 60 set to the brand hue.**
- **An accent occupying under 5% of the surface** where 60-30-10 was declared.
- **A monochrome surface on a short ramp.**
- **Duotone applied to some assets and not others.**
- **Text set directly on a gradient** with no scrim and no worst-region measurement.
- **Blocks or inverted sections checked as one global pair** rather than per section.
- **A strategy left undeclared in the guidelines**, or a third one appearing without being added to
  them.

## Verify

- [ ] The strategy traces to `Brand Personality (Order 31) → ## Personality Summary`,
      `Brand Positioning (Order 23)` where Maximalist is being weighed, and any strategy already
      fixed in `Visual Identity (Order 32) → ## Decided Constraints`, or their absence was flagged
      rather than assumed.
- [ ] One strategy is declared at brand level and named in the guidelines, with a second only where
      the product and marketing surfaces deliberately differ.
- [ ] Where 60-30-10 is declared, the accent's measured area sits near 10% and above 5%, and the
      dominant 60 is neutral.
- [ ] A monochrome surface runs on the full ramp.
- [ ] Every block and every inverted section has had its own foreground pairs checked, not a single
      global pair.
- [ ] No text sits on a gradient without a scrim or a worst-region measurement.
- [ ] The strategy is achievable in the brand's actual production medium.

---

## Sources

- Itten, J. (1970). *The elements of color* (F. Birren, Ed.; E. van Haagen, Trans.). Van Nostrand
  Reinhold.
