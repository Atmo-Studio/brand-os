# Color ramps

**Use when:** Turning a brand's chosen colors into full ramps, or auditing ramps that already exist.
Read [color-palette.md](color-palette.md) for choosing those colors in the first place, and
[color-spaces.md](color-spaces.md) for the space to generate in.

Three words, used precisely throughout.

**Ramp** — one hue rendered as an ordered series of steps, light to dark.

**Step** — one position on a ramp.

**Anchor** — the chosen color a ramp is built around, also called the base color. Produced by
[color-palette.md](color-palette.md).

---

## From palette to ramps

**A design system needs every color in the palette scaled to a full ramp** — the primary, the
secondary, any accent, the neutrals and every semantic state. That is the condition wherever a token
library or a product interface is being built. One swatch is not a specification: the simplest state
still needs a background, a border, a fill and text, and those are four steps.

**Steps are named on the Tailwind convention: `50`, then `100` through `900` in hundreds, then
`950`.** Eleven steps at full length. It is the naming most designers and developers already read
fluently, and what a token library will expect to consume.

- **Tints move a hue toward white, shades toward black, and tones toward gray.** A ramp is these
  produced systematically from one anchor rather than mixed by hand per use.
- **Every ramp in the brand holds the same number of steps.** Where one ramp runs longer, it
  produces a swatch with no equivalent in the others, and the first surface that needs the
  equivalent is where the system starts to drift.

### Which ramps a brand needs

| Ramp | How many | Carries |
|---|---|---|
| **Neutral** | 1 | Most of any interface: backgrounds, borders, body text |
| **Primary** | 1 | The brand hue. Actions, links, selected states |
| **Secondary** | 0–1 | Only where the palette type produces one |
| **Semantic state** | 0–4 | Error, warning, success, information |

## Ramp structure

- **Set the count between 8 and 11, from the production environment.** Marketing and collateral work
  sits at the low end. Software and web need the depth, because interface roles outnumber brand
  roles several times over.
- **Shorten from the interior, not the ends, wherever the palette builds an interface.** `50` and
  `950` are the page backgrounds of the light and dark themes, and the steps nearest them carry the
  surfaces and the body text. Drop `400` and `600` first: role mappings put them at the focus ring
  and the fill hover state, and both can borrow a neighbor without anything collapsing. A nine-step
  ramp is then `50, 100, 200, 300, 500, 700, 800, 900, 950`.
- **Trim the ends only where the palette will never carry an interface.** A brand palette that stops
  at print and collateral may never place a page background or set body text from the ramp, and
  there the extremes are the steps that go unused.
- **Decide the count before the system ships.** Changing it afterward moves every token, every
  design-tool variable and every surface downstream.
- **Put roles on a semantic alias layer above the ramp, never on the step numbers.** The ramp says
  what a color is; the alias layer says what it does. That layer is what a second theme repoints,
  and without it a theme change means editing every component.

## Building the ramp

- **Place each anchor on a step before generating anything, and expect them to land on different
  ones.** `500` is the common position for a color meant for fills and links, but a primary can sit
  at `400` and a secondary accent at `700`. Put each color where its own lightness actually falls,
  then build its ramp outward from there. Forcing every anchor onto `500` moves colors off the
  values the brand chose.
- **Pin a contractually fixed color; snap everything else.** A pinned anchor stays exactly as
  specified and its one step sits slightly off the even spacing. A snapped anchor moves to the
  computed position so every interval matches. Snapping looks better and nobody detects it without
  holding a swatch to the screen.
- **Where the anchor fails contrast, leave it alone and use a darker step for fills.** Darkening the
  brand color itself to make a step pass is a change to the brand, not a fix to the ramp.

### Generating the steps

1. **Set the lightness range.** Extend up and down from the anchor's lightness, stopping about 5%
   short of pure at both ends. Colors at absolute black and white hold no chroma, so a ramp reaching
   them loses the brand's hue exactly where page backgrounds and body text live.
2. **Space the steps evenly across that range**, lightest at `50` and darkest at `950`.
3. **Give every ramp one chroma curve, and cap it against the target gamut.** The curve rises
   through the light steps, peaks around `700` and eases off toward `950`; the anchor sets its
   height, and every combination of lightness and hue has its own maximum, so the gamut caps the
   curve wherever a hue runs out. Tints then keep their hue through `300` instead of washing to
   white, and the dark steps stay a color.
4. **Bend the neighbors of a pinned anchor.** A pinned color sits off the curve. Carry its offset
   in lightness and chroma onto the steps either side, fading with distance, so the ramp leads into
   it instead of jumping at the brand's own step.
5. **Hold the hue constant** across every step.

### Checking the result

- **Steps look evenly spaced in brightness**, not merely evenly numbered.
- **The hue is recognizably the same color end to end.** A hue that drifts makes the ramp read as
  two colors mixed together, and it will clash with a neutral built on the original hue.
- **Chroma is strongest mid-ramp and softest at both extremes.**
- **Light steps sit closer together than dark ones**, because small differences read clearly on pale
  surfaces and disappear on dark ones.
- **No two neighbors look like the same color** on a calibrated screen. Where they do, the ramp has
  more steps than the brand has decisions.
- **Record the working space, the anchor and the step count beside the ramp**, or the next person
  regenerates it by eye and it stops matching.

### Multiple hues together

- **Give every hue the same lightness at the same step.** Otherwise the red button looks heavier
  than the blue one at `500`, and nothing in the numbers explains why.
- **Share the chroma curve's shape, never one absolute number.** Every hue swells and fades at the
  same steps, and each reaches its own height under its own gamut. One fixed chroma value leaves
  some hues looking flat and others strident.
- **Expect yellow and cyan to sit lowest.** They run out of chroma well before red and purple, which
  is why a warning ramp built from copied numbers looks weak beside the error ramp.

## The neutral ramp

[color-palette.md](color-palette.md) fixes the two neutral anchors: a black near 5% lightness and a
white near 95%, both carrying the primary's hue. This ramp runs between them.

- **Give the neutral ramp at least as many steps as any other**, since it fills the most roles.
- **Hold the primary's hue across every step**, the same as any other ramp. A neutral that drifts
  toward gray in the middle breaks the cohesion the derived anchors were chosen for.
- **Keep the light end especially dense.** Page background, subtle background and component
  background all live within a few steps of `50`, and they have to stay distinguishable from each
  other.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Ramps of different lengths inside one brand.**
- **The ends trimmed** on a ramp that has to carry an interface.
- **A color in the palette left as a single swatch** instead of a full ramp.
- **A ramp built before its anchor is decided.**
- **A ramp generated without its space, anchor and step count recorded.**
- **The brand color darkened** so a step passes contrast.
- **A ramp reaching pure black or pure white on screen.**
- **One chroma number copied across hues** instead of a percentage of each hue's maximum.
- **A neutral ramp shorter than any other ramp.**
- **Step numbers applied directly** where the alias layer should carry the role.

## Verify

- [ ] Every color in the palette has a full ramp, semantic states included.
- [ ] Every ramp holds the same number of steps, between 8 and 11.
- [ ] Any shortening dropped `400` and `600` first, from the interior, unless the palette will
      never build an interface.
- [ ] Steps are named on the `50`–`950` convention.
- [ ] The anchor's step is recorded, and whether it was pinned or snapped.
- [ ] The working space, anchor and step count sit beside the ramp.
- [ ] Brightness steps evenly within each ramp and matches across ramps at the same step.
- [ ] Hue holds constant within each ramp, and chroma is strongest in the middle.
- [ ] Chroma is matched as a percentage of each hue's own maximum, so no hue reads flat or muddy
      beside the others.
- [ ] No two neighboring steps look identical on a calibrated screen.
- [ ] The neutral ramp runs between the two brand neutral anchors and is no shorter than any other.
- [ ] Roles live on an alias layer, not on step numbers.

---

## Sources

- Krehel, J. (n.d.). *OKLCH color picker, converter and guide*. https://oklch.fyi/
- Ottosson, B. (2020, December 23). *A perceptual color space for image processing*.
  https://bottosson.github.io/posts/oklab/
