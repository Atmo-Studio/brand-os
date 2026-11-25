# Color spaces

**Use when:** Specifying a color in more than one notation, choosing the space to build a system in,
or moving a brand's color between screen and print. Read [color-ramps.md](color-ramps.md) for
building the ramps, and [../layout/print.md](../layout/print.md) for what the press does to a sheet
physically.

---

## Additive and subtractive

- **Additive models start at black and add light.** RGB, HSL, HSB and OKLCH are additive. All
  channels at maximum give white. This is every screen.
- **Subtractive models start at white and filter it with ink.** CMYK is subtractive. All channels at
  maximum give near-black. This is every printed sheet.
- **CIELAB is neither.** It describes human vision rather than a device or a medium, which is why it
  is perceptually uniform and device-independent. In print it connects one ICC profile to another,
  and it is where Delta E gets calculated.

## Color spaces

One brand color produces different numbers in each space, because each space describes color a
different way. Record all of them together, as one color.

| Space | Use it for | Trade-off |
|---|---|---|
| **Hex** | The common form on the web, and what design tools export | Compact and universal, but you cannot read or adjust a channel by eye |
| **RGB** | The same colors as hex, with readable alpha | The three channels do not match anything a designer reasons about |
| **HSL / HSB** | Hand-picking and adjusting a color in a design tool | Hue, saturation and lightness are intuitive to adjust, but its lightness is not perceptual, so equal numeric steps look uneven |
| **OKLCH** | Generating a system where steps have to be predictable | Equal numbers mean equal perceived difference. Needs a current tool or a library |
| **CMYK** | Anything printed by process | Device-dependent. The numbers describe nothing without a profile attached |
| **Pantone** | A premixed ink the brand wants reproduced exactly | Exact and repeatable, but each spot color adds a plate to the job |

- **Record the brand color in every space the brand actually produces in.** A CMYK build derived on
  one machine and a hex value picked on another is how a brand ends up with two different reds.
- **Convert deliberately, never incidentally.** Changing one isolated value to a different notation
  in a project that uses something else is a defect, not a tidy-up.

## Choosing the working space

Decide this explicitly at the start of a system. It is a real choice with a real trade-off, not a
default to apply on autopilot.

| Start in | When |
|---|---|
| **The space the brand already uses** | Existing hex values or HSL definitions are in play, or the client asks to work that way. Match it |
| **OKLCH** | Building a new system from scratch, where ramps have to step predictably and hold their hue |
| **HSL or hex** | Small palettes, print-led work, or a toolchain that accepts nothing else |

- **OKLCH is the preferred default for a new system, not the only correct answer.** Equal numeric
  distances correspond to equal perceived differences across lightness, chroma and hue, and hue
  stays put as lightness changes (Ottosson, 2020). That predictability is the whole reason to pick
  it.
- **HSL and hex produce good ramps too.** Generate every step at once and watch where saturation and
  lightness land across the ramps, rather than adjusting one swatch at a time. The work moves from
  the math to the eye, which is a fair trade on a small palette.
- **Know what HSL costs on a long ramp.** Its hue shifts as lightness changes, so a blue moves
  measurably toward purple as it lightens, and two hues sharing an HSL lightness can look nothing
  alike in brightness. Both are correctable by eye; neither corrects itself.
- **Write the working space into the guidelines.** Without it, the next person regenerates the ramp
  in a different space and the steps stop matching.

**Tool:** https://oklch.fyi/ converts between spaces, visualizes the gamut boundary and generates
ramps live (Krehel, n.d.). Hand it to anyone deciding whether OKLCH earns its place on a given
project.

## Gamut

**A gamut is the total range of colors a given space or device can actually reproduce.** A color can
be specified outside one and still be perfectly valid inside another.

- **sRGB fits inside Display P3, and P3 holds roughly 50% more colors.** The extra range only shows
  in highly saturated values. Anything moderately desaturated looks the same on both.
- **The boundary is irregular, not a fixed ceiling.** How much chroma a hue can reach depends on its
  lightness, and every hue peaks somewhere different. In sRGB at mid lightness, purples reach
  furthest and cyans reach least, roughly three times the difference between them. That peak moves
  as lightness changes (Krehel, n.d.).
- **Cyan runs out first at almost every lightness.** A ramp that works in red will clip in cyan at
  the same chroma numbers.
- **A color past the boundary renders as the nearest color inside it.** Two ramp steps specified
  differently can arrive at the same rendered color, which erases the distinction the ramp existed
  to make. Check the light and dark ends first, since that is where chroma runs out.
- **Bring a color back by lowering chroma and leaving lightness and hue alone.**
- **Build against sRGB and treat P3 as an enhancement.** Ship the sRGB value first so every display
  renders something, then override it only where the wider gamut is available.

## Spot and process

- **Process builds a color from four inks. Spot is a single premixed ink.** Most printing runs
  process. Spot exists for colors process cannot reach, and for colors a brand needs identical
  across every printer it uses.
- **Specify a Pantone when one of three things is true:** the color falls outside the process gamut,
  it appears at small sizes or in fine rules where multiple inks would misregister and fringe, or
  the brand prints enough volume that consistency outweighs the added plate.
- **Otherwise skip it.** A brand whose color reproduces acceptably in process gains nothing from a
  spot ink and pays for it on every job.
- **Always specify the process build alongside the spot ink.** Most jobs run process regardless, and
  leaving that conversion to the printer means it changes between jobs.

## Delta E

Delta E measures the perceptual distance between the color specified and the color reproduced.
CIEDE2000 is the current formula, and the one ISO 12647 specifies for print production.

| ΔE00 | What it means |
|---|---|
| **≤ 1** | Not perceptible to the eye |
| **1 to 2** | Perceptible to an attentive observer. The standard tolerance for commercial print matching |
| **2 to 3** | Visible only under direct comparison |
| **3 to 5** | Obvious |

- **Give the printer ΔE00 ≤ 2 for a brand color.** It is achievable on a profiled substrate and it
  is what commercial matching already targets.
- **Ask for ΔE00 ≤ 1 only where the color is the identity.** Tighter process control costs time and
  money on every run.
- **State the tolerance in the guidelines.** A brand color with no tolerance beside it has no
  definition of a bad print, so nobody can reject one.

## Substrate

- **Uncoated stock needs a different recipe than coated.** Ink soaks into an uncoated sheet, so the
  same build prints duller and darker. A color matched on coated will not match on uncoated from the
  same numbers.
- **Specify both where the brand prints on both.** Pantone publishes separate coated and uncoated
  references for exactly this reason, and the two carry different values for the same named color.
- **Read [../layout/print.md](../layout/print.md) for what the press does physically** — tone value
  increase, total area coverage, registration and how substrate affects layout. This file covers
  what the brand specifies; that one covers what happens to the sheet.
- **Once a printer is chosen, their specification wins over everything here.**

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A brand color recorded in one space only**, where the brand produces in more than one.
- **CIELAB described as subtractive**, or as a medium rather than a connection space.
- **A working space applied by habit** rather than chosen and written into the guidelines.
- **A long HSL ramp trusted to hold its hue** without checking the ends.
- **A P3 value shipped without an sRGB fallback. A ban.** It does not degrade, it disappears.
- **One isolated value converted** to a notation the rest of the project does not use.
- **A Pantone specified with no process build beside it.**
- **A spot ink added** where process already reproduces the color acceptably.
- **A brand color specified without a Delta E tolerance.**
- **One set of CMYK values used for both coated and uncoated stock.**

## Verify

- [ ] The brand color is recorded in every space the brand produces in, kept together as one color.
- [ ] The working space is named in the guidelines, with the reason it was chosen.
- [ ] Every ramp's light and dark ends have been checked for clipping in the target gamut.
- [ ] Every value outside sRGB ships with an sRGB fallback first.
- [ ] Any Pantone is justified by gamut, fine reproduction or volume, and carries a process build.
- [ ] A Delta E tolerance is stated, at ΔE00 ≤ 2 unless tighter control was paid for.
- [ ] Coated and uncoated values are specified separately where the brand prints on both.

---

## Sources

- International Organization for Standardization. (2013). *ISO 12647-2: Graphic technology, process
  control for the production of half-tone colour separations, proof and production prints, part 2:
  Offset lithographic processes*.
- Krehel, J. (n.d.). *OKLCH color picker, converter and guide*. https://oklch.fyi/
- Ottosson, B. (2020, December 23). *A perceptual color space for image processing*.
  https://bottosson.github.io/posts/oklab/
