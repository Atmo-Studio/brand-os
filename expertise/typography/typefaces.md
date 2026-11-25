# Typefaces

**Use when:** Choosing the typefaces for a brand or a surface.
Read [typescale.md](typescale.md) to build the scale once the typefaces are settled, and
[typesetting.md](typesetting.md) to set them on the page.

Read `Brand Personality (Order 31) → ## Personality Summary` for the traits the typeface has to
carry, `Brand Positioning (Order 23) → ## Market Category` for the category it has to hold its
position against, and `Visual Identity (Order 32) → ## Decided Constraints` for anything already
settled that a shortlist cannot reopen. Dimensions are addressed by Order number and name; the ID
prefix is user-configured and never hardcoded.

---

## Typeface, font, and font family

**Typeface** — the design. What a designer chooses.

**Font family** — the complete set of fonts sharing one design across weights, widths and styles.
The everyday alternative to typeface, and the term CSS uses.

**Font** — one member of that family. Bold at 12pt, or the `.woff2` file on disk. What a build
loads.

The reversal comes from metal, where a font was one size and one weight of a typeface held in its
own case. Everyday speech collapses the two, and a brand document that teaches it backwards
propagates the error into every spec written from it.

**Count typefaces, never fonts.** A family carries many weights and stays one typeface, so a system
running regular, medium and bold of one design is a one-typeface system.

## The parts of a letterform

Type is described with a fixed vocabulary. Using it precisely is what makes a specification
reproducible by someone who never saw the original (Bringhurst, 2004; Lupton, 2010).

| Term | What it is |
|---|---|
| **Baseline** | The line the letters sit on |
| **x-height** | Height of the lowercase `x`, and of every lowercase letter carrying no ascender |
| **Cap height** | Height of the capitals |
| **Ascender** | The part of `b`, `d`, `h` rising above the x-height |
| **Descender** | The part of `g`, `p`, `y` falling below the baseline |
| **Overshoot** | The amount a round or pointed letter passes the baseline or cap line so it reads the same size as a flat one |
| **Counter** | The enclosed space inside `a`, `e`, `o` |
| **Aperture** | The width of the opening in `c`, `e`, `s` |
| **Terminal** | The end of a stroke carrying no serif, whose shape is one of the strongest signals of a typeface's character |
| **Stroke contrast** | The difference between the thickest and thinnest strokes |

Three of those predict how a typeface behaves before it is set.

- **x-height decides apparent size.** Two typefaces at the same nominal size are not the same size
  (Lupton, 2010). Match on x-height when swapping one for another, and expect the replacement to
  need a step up or down. A tall x-height also survives small sizes and low resolution.
- **Aperture decides legibility at distance.** Open apertures keep `c`, `e` and `s` distinct where
  closed ones collapse toward `o`.
- **Stroke contrast decides where a typeface breaks.** Hairlines vanish below roughly 12px on screen
  and close up on uncoated stock.

## Typeface categories

| Category | Structure | Use for |
|---|---|---|
| **Serif** | Small finishing strokes, the serifs, closing the ends of the main strokes | Long-form reading, editorial, print |
| **Sans serif** | Stroke ends left plain, with no finishing strokes | The default for most interfaces, and for signage and small sizes on screen |
| **Monospace** | Every glyph drawn to one advance width, so characters stack in columns | Code, data, measurement, anything aligning vertically |
| **Display** | Drawn for expression rather than for reading: exaggerated proportions, distinctive terminals, tight default fitting | Marketing and headlines, wherever the personality has to be felt before it is read. Usually large, occasionally small where the character is the point |
| **Script** | Drawn from handwriting, with strokes that often join | Occasional and decorative, where a hand is wanted |
| **Blackletter** | Dense angular strokes from medieval manuscript hands, with narrow counters | Genre and historical work |

Four subclasses change a decision rather than only a label. **Old-style serifs** carry low contrast
and angled stress, and are the most reliable serif at text size. **Didones** carry extreme contrast
and flat unbracketed hairlines, and break below roughly 12px on screen. **Geometric sans** run near-
uniform strokes with low variation between letters, distinctive at display size and tiring across
long text. **Humanist sans** carry a calligraphic skeleton and open apertures, and are the most
legible sans for continuous reading.

**No canonical taxonomy exists.** ATypI de-adopted Vox-ATypI, the standard reference since 1962, in
March 2021, on the grounds that it describes Latin script and disregards most of the world's writing
systems (Association Typographique Internationale, 2021). Nothing has replaced it. Use the category
names that change a decision, and say which system you mean where it matters.

## Choosing a typeface

Everything above describes what a typeface is. Everything below decides which one.

**A typeface earns its place by carrying the brand's documented personality and holding its stated
position against the category.** Every criterion in this section is a filter applied after that
one.

- **Write the argument before the shortlist.** Take the personality attributes from
  `Brand Personality (Order 31) → ## Personality Summary` in the brand's own words, then say what a
  typeface would have to do to carry them. A shortlist
  assembled first gets an argument retrofitted to it, and the retrofit always succeeds.
- **Run the shortlist against the real content.** The longest headline, the smallest label, the
  densest table, every script the brand publishes in. A typeface that fits the mood and fails the
  surfaces is the wrong typeface.
- **Say what the choice rules out.** A selection that excludes nothing was not a selection.

### One or two typefaces, three at the maximum

- **Three families is the ceiling. Never specify a fourth**, whatever the surface count.
- **One or two carries almost every brand.** A third earns its place only by doing a job neither of
  the others can, such as data and code where the first two are proportional.
- **Every family added is licensed, loaded and kept in sync on every surface**, so the third costs on
  each of those axes for as long as the brand runs.

### Pair on contrast, match the x-height

Two typefaces that nearly match read as a mistake. Two that clearly differ read as a decision.

| | Axis | Why |
|---|---|---|
| **Match** | x-height | The metric that matters most. Mismatched x-heights make one typeface look wrongly sized beside the other |
| **Match** | Stroke contrast, width, cap height | Keeps the color of a line even, and keeps the pair from reading as two eras |
| **Contrast** | Category | Serif against sans is the most reliable pairing there is |
| **Contrast** | Weight, era, mood | A light display typeface over a regular body; formal against casual |

- **A superfamily is the safest pairing.** Families drawn to span serif, sans and mono together
  share metrics by construction, so the pairing cannot fail on proportion.
- **Test the pairing in real copy at working sizes.** A pairing judged in two specimens at 48px says
  nothing about the caption sitting beside the headline.

### Check the family before committing

A family failing any of these fails after selection, when changing it is expensive.

- **Weights.** Every step the hierarchy needs. A scale wanting regular, medium and bold fails on a
  family shipping regular and bold alone.
- **Italics.** Real italics, or an oblique slant of the roman.
- **Numerals.** Lining and oldstyle, tabular and proportional. Tabular figures are required for
  anything that updates in place or aligns in a column.
- **Language coverage.** Every script and diacritic the brand will publish in, checked rather than
  assumed.
- **Small caps.** Real ones, or the renderer fakes them by scaling capitals.

### Variable fonts replace a family with one file

A **variable font** is a single file carrying the whole range of the axes its designer drew, so it
replaces a folder of static weight and style files. It gives direct control over those axes in
design software and in code, at values no set of predefined weights offers: `font-weight: 560` is
available, and so is every value between the extremes.

Common axes are weight `wght`, optical size `opsz`, width `wdth` and slant `slnt`, and a family
carries only the ones its designer drew.

- **Take a variable file where the system uses several weights, or needs values between them.** At
  one or two weights, static files are usually smaller.

### Licensing

- **Never use a licensed typeface that has not been supplied or paid for. A ban.** Type is authored
  work sold under license, and no brief overrides that.
- **Desktop, web, app and broadcast are separate grants**, commonly metered on pageviews, domains or
  installs. A desktop license covers the comp and covers nothing that ships. Price the recurring
  cost before selection.
- **Open-source families are free for every use.** Anything under the SIL Open Font License carries
  no per-use grant to buy. [Google Fonts](https://fonts.google.com),
  [Fontshare](https://www.fontshare.com),
  [The League of Moveable Type](https://www.theleagueofmoveabletype.com) and
  [Open Foundry](https://open-foundry.com) are four libraries to start from.
  [Uncut](https://uncut.wtf) is a catalogue of fonts free for commercial use, each under its
  creator's own license. Read the license of the specific family before selecting it.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **An unlicensed typeface in any work. A ban.**
- **A fourth typeface family. A ban.**
- **A typeface picked before `Brand Personality (Order 31)` and `Brand Positioning (Order 23)` were
  written down**, or judged from a
  specimen set larger than the work will use.
- **A system typeface carrying the display voice of a brand with its own world.** The nearest
  installed substitute is a failure rather than a fallback.
- **Monospace used to signal "technical."** Take it where things align.
- **A competent interface sans reached for as the display typeface by default.** The refusal is the
  reflex, not the typeface.
- **Pairing for similarity**, or introducing a paid typeface to satisfy a checklist.
- **Synthesized weights and italics** standing in for fonts that were never loaded.
- **"Font" where a typeface is meant**, in any brand document or spec.
- **A didone or other high-contrast typeface at text size**, or a geometric sans carrying long-form
  reading.

One typeface that appears on comparable refuse lists is deliberately absent here. Space Grotesk is
not refused by this house, and the omission is a preference rather than a claim that the field does
not flag it.

## Verify

- [ ] The personality and positioning the typeface answers to are read from
      `Brand Personality (Order 31)` and `Brand Positioning (Order 23)`, and predate the shortlist.
- [ ] `Visual Identity (Order 32) → ## Decided Constraints` was checked for anything a shortlist
      cannot reopen, or its absence was flagged rather than assumed clear.
- [ ] The shortlist was run against the real content inventory at working size, not a specimen.
- [ ] The system carries one or two families, three at most.
- [ ] The pairing contrasts on category and matches on x-height.
- [ ] Every weight, italic, numeral set, small cap and script the system needs exists in the family.
- [ ] Every shipping use is licensed, and recurring costs are priced.
- [ ] The document says typeface for the design and font for the file, and counts families.

---

## Sources

- Association Typographique Internationale. (2021, April 27). *ATypI de-adopts Vox-ATypI typeface
  classification system*.
  https://atypi.org/2021/04/27/atypi-de-adopted-the-vox-atypi-typeface-classification-system/
- Bringhurst, R. (2004). *The elements of typographic style* (3rd ed.). Hartley & Marks.
- Lupton, E. (2010). *Thinking with type* (2nd ed.). Princeton Architectural Press.
