# Color palette

**Use when:** Building a brand's color palette: choosing the primary brand color, the colors around
it, and the brand neutrals. Read [color-ramps.md](color-ramps.md) for turning those anchors into
full ramps, [color-composition.md](color-composition.md) for how much of each appears on a surface,
and [color-spaces.md](color-spaces.md) for the space to work in.

Read `Brand Personality (Order 31) → ## Personality Summary` for the traits the hue has to express,
`Brand Positioning (Order 23) → ## Market Category` for the category it competes in,
`Competitive Landscape (Order 22) → ## Competitors Tracked` for the hues already taken, and
`Ideal Customer Profiles (Order 21)` for who is being sold to. Dimensions are addressed by Order
number and name; the ID prefix is user-configured and never hardcoded.

Three words, used precisely throughout.

**Association** — the meaning typically assigned to a hue. Working material, never a rationale.

**Palette type** — how the brand's hues relate to each other on the color wheel.

**Anchor** — a single chosen color, before any ramp is built from it. This file produces anchors.

---

## Color psychology

Common associations (Eiseman, 2000), and cultural differences. Use this to predict how a hue might
be perceived when choosing colors.

| Hue | Commonly reads as | Cultural divergence |
|---|---|---|
| **Red** | Energy, urgency, appetite, danger, anger, passion | Luck and prosperity in China. Marks a *rising* market in Mainland China, Japan and South Korea |
| **Orange** | Warmth, affordability, play, appetite | Sacred in Hindu and Buddhist contexts, as saffron |
| **Yellow** | Optimism, caution, attention, low cost | Imperial and reserved in historical Chinese use |
| **Green** | Growth, nature, health, permission, money, greed | Marks a *falling* market in Mainland China, Japan and South Korea. Sacred in Islam |
| **Blue** | Trust, competence, calm, cold, distance | |
| **Purple** | Royalty, ceremony, luxury, spirituality | Mourning in several Catholic and Southeast Asian contexts |
| **Black** | Authority, sophistication, luxury, mourning, danger, uncertainty | |
| **White** | Cleanliness, purity, order, space, simplicity, luxury | Mourning across much of East and South Asia |

- **Specify semantic state hues per locale.** Gain and loss, safe and unsafe, go and stop all invert
  somewhere. One hardcoded value shows a gain as a loss in those markets, which is a factual error
  rather than a matter of taste.

## Choosing the primary brand color

**Match the primary hue to the brand's personality and positioning.** Start with the hue. Then adjust saturation and lightness. Work in that order. That's what makes a brand color ownable. Deciding blue takes minutes; deciding which blue is where the brand becomes
distinct.

- **Read `Brand Personality (Order 31) → ## Personality Summary` for the traits, then pick the hue
  that expresses them.** Labrecque and
  Milne (2012) mapped hues onto Aaker's (1997) brand personality dimensions: red reads as exciting,
  blue reads as competent. Start from the trait the brand already claims and work toward the hue,
  never the reverse.
- **Check the hue against `Brand Positioning (Order 23) → ## Unique Value`.** A hue that supports a
  premium position and a hue that supports a value position are different hues, even inside one
  family.
- **Once the family is set, find an ownable color inside it.** Two brands can both be blue and look
  nothing alike. Saturation and lightness are what separate them, and they also amplify the trait
  the hue suggests (Labrecque & Milne, 2012).
- **Test the fit against the market category.** Read
  `Brand Positioning (Order 23) → ## Market Category` for which one that is, then ask whether the
  hue reads as belonging to it, and whether that is what the brand wants.
- **Test the fit against the product type.** Bottomley and Doyle (2006) found that functional
  products score better in functional colors and sensory or social products score better in sensory
  and social colors. Read `Ideal Customer Profiles (Order 21)` for which of the two the brand sells.
- **Adjust saturation and lightness before changing hue.** A brand that reads as aggressive is
  usually oversaturated, not the wrong color. One that reads as timid is usually too light.
- **Write down which test the hue passed.** "Blue" is not a decision. "Blue, expressing the
  documented competence trait, in a category where every competitor is warm" is.

### Category convention

- **List every direct competitor's primary hue before choosing one.** Read
  `Competitive Landscape (Order 22) → ## Competitors Tracked` for the set. Group them into hue
  families and count each family. A remembered impression is not the input.
- **A crowded category means buyers already associate that color with the category.** Choosing a hue
  from inside the crowd makes the brand legible immediately: people recognize what it is before they
  recognize who it is.
- **Most brands should stay inside the convention** and differentiate elsewhere: on the specific hue
  within the family, the neutrals, the typography, the imagery, the voice.

### The zag

"When everybody zigs, zag" (Neumeier, 2006). Where a category has converged on one hue family, the
unclaimed hue is available to own.

**All three conditions hold, or use the section above.**

1. The count shows the direct competitors converged on one or two hue families.
2. `Brand Positioning (Order 23) → ## Positioning Statement` puts the brand in a challenger
   position, arguing the category is wrong about something.
3. The brand can show what category it belongs to some other way, because its hue no longer does.

- **The payoff is ownership.** A hue no competitor uses becomes shorthand for the brand and makes it
  recognizable further away than a logo works.
- **The price is category legibility.** The brand gives up a signal and has to replace it, usually
  through naming, imagery or messaging.
- **It works once.** When a challenger's zag succeeds, imitators follow and that hue becomes the new
  convention. Count the current competitors, not the ones you remember.
- **Never zag on preference.** Wanting the color is not one of the three conditions.

## Palette types

Positions on Itten's twelve-part wheel (Itten, 1970). The type fixes the angle between the hues,
which sets how much contrast the palette has available.

| Type | Relationship | Character |
|---|---|---|
| **Monochromatic** | One hue | Calm and unified. No hue contrast at all, so lightness does all the ranking |
| **Analogous** | 2–3 adjacent hues, within about 30° | Harmonious and quiet. One temperature throughout |
| **Complementary** | Two hues at 180° | Bold and energetic. The most hue contrast available |
| **Split-complementary** | One hue plus the two either side of its complement | Nearly as bold, noticeably easier to balance. Some tools label this "compound" |
| **Triadic** | Three hues at 120° | Vivid and playful. Hard to rank, because all three compete |
| **Tetradic** | Two complementary pairs, forming a rectangle | Rich and complex. The widest range and the hardest to control |
| **Square** | Four hues at 90° | Tetradic, evenly spaced. Same strengths and the same difficulty |

Read the Character column against `Brand Personality (Order 31) → ## Personality Summary`, not as a
ranking. A triadic palette is right for a brand that wants to look playful and wrong for one that
wants to look precise.

**The types are a starting point, not a constraint.** A palette assembled by hand, ignoring every
angle on the wheel, is legitimate. The geometry is a fast way to reach a defensible set; it is not
what makes the set good.

**Optical adjustment is the last step of any visual work.** Build from the framework, the standard
and the technical construction, then adjust by eye until it is optically right. A palette that is
correct on the wheel and wrong on the page is wrong. This step is what separates senior craft from
work that was merely computed.

## Building the palette

The primary anchors everything: it sets which palette type is available and determines what the
remaining hues have to be.

1. **Fix the primary brand color**, using the sections above.
2. **Choose the palette type**, from the primary's position on the wheel and the character the brand
   wants.
3. **Derive the secondary and any accent from the type.** Complementary puts the second hue at 180°
   from the primary, triadic at 120° and 240°, and so on.
4. **Derive the brand neutrals from the primary**, below.
5. **Choose semantic state anchors** where the work is software or web, keeping each clearly apart
   from the primary. A red brand needs its error anchor moved well off that red, or the destructive
   control and the primary control look identical.

Most brands ship a primary, a secondary, an accent where the work calls for one, and a neutral pair.
That covers the majority of surfaces.

**A brand can ship black and white alone.** That is a complete palette, it sits outside every type
above, and it puts the whole burden on typography, imagery and layout. Where such a brand later
needs a full color system, it has one ramp, or two where a functional state color has to exist.

**Add a hue only when a role exists that no current color fills.** Two colors doing one job is drift.

## Brand neutrals

The brand's black and white are anchors like any other color, and they are chosen here rather than
falling out of the ramp.

- **Build the neutrals from the primary's hue and saturation.** The specified black and white should
  look like the brand color with a great deal of black or white mixed in, so a warm primary produces
  warm neutrals. This is what makes the neutrals read as part of the palette instead of sitting
  beside it.
- **Stop about 5% short of pure at both ends**, putting the specified black near 5% lightness and
  the specified white near 95%. Far enough to carry the hue, not far enough for anyone to name the
  color.
- **Never pure black or pure white on screen. In print both are correct** and entirely routine.
- **A single low-chroma brand hue can serve as the whole neutral system**, which removes the
  separate gray. Do this where the primary or secondary is quiet enough to sit under everything
  without competing.

Read [color-ramps.md](color-ramps.md) for building the neutral ramp between these two anchors.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A hue chosen from its associations**, or defended by them.
- **A hue chosen before `Brand Personality (Order 31)` and `Brand Positioning (Order 23)` are
  documented.**
- **A hue recorded without the test it passed:** the market category, the product type, or a named
  personality trait.
- **A competitor list written from memory** rather than read from
  `Competitive Landscape (Order 22) → ## Competitors Tracked`.
- **A zag used as the default**, or on fewer than all three conditions.
- **A different hue proposed** where saturation or lightness was the channel that was wrong.
- **A semantic state anchor sharing the primary's hue.**
- **A semantic state hue shipped to a market that reverses it, unverified. A ban.** A gain shown as a
  loss is a factual error in the interface.
- **Neutrals taken as plain gray** where the primary could have carried them.
- **A specified black or white sitting at pure** on screen.
- **A hue added with no role** that existing colors cannot fill.
- **A dimension referenced by ID prefix** rather than by Order number and name.

## Verify

- [ ] The hue traces to a documented personality trait or positioning claim, not to a preference.
- [ ] The specific saturation and lightness inside that hue family are chosen deliberately, and
      recorded.
- [ ] The test the hue passed is written down: market category, product type, or personality trait.
- [ ] A list of the direct competitors' primary hues exists, grouped by family and counted.
- [ ] Where the brand stays inside the category convention, the axes it differentiates on instead
      are named.
- [ ] Where the brand zags, all three conditions are recorded, along with what replaces the
      category legibility it gave up.
- [ ] The product-type test against `Ideal Customer Profiles (Order 21)` is recorded, or its
      absence from the deployment inputs was flagged rather than assumed.
- [ ] The palette type is named, and every other hue derives from it.
- [ ] Neutrals carry the primary's hue and stop about 5% short of pure at both ends.
- [ ] No semantic state anchor shares the primary's hue.
- [ ] Every semantic state hue is specified per locale wherever a target market reverses it.

---

## Sources

- Aaker, J. L. (1997). Dimensions of brand personality. *Journal of Marketing Research, 34*(3),
  347-356.
- Aslam, M. M. (2006). Are you selling the right colour? A cross-cultural review of colour as a
  marketing cue. *Journal of Marketing Communications, 12*(1), 15-30.
- Bottomley, P. A., & Doyle, J. R. (2006). The interactive effects of colors and products on
  perceptions of brand logo appropriateness. *Marketing Theory, 6*(1), 63-84.
- Eiseman, L. (2000). *Pantone guide to communicating with color*. Design Books International.
- Itten, J. (1970). *The elements of color* (F. Birren, Ed.; E. van Haagen, Trans.). Van Nostrand
  Reinhold.
- Labrecque, L. I., & Milne, G. R. (2012). Exciting red and competent blue: The importance of color
  in marketing. *Journal of the Academy of Marketing Science, 40*(5), 711-727.
- Neumeier, M. (2006). *Zag: The number one strategy of high-performance brands*. New Riders.
