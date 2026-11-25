# Layout for print

**Use when:** The work gets cut, folded, bound or pressed.

Print does not descend from screen and screen does not descend from print. Print is fixed, physical
and irreversible: one sheet size, ink crossing the trim, a blade with tolerance, and no second
version once it runs. Everything here is settled before a composition is drawn.

Read [grids.md](grids.md) for the base unit and the grid, converted to points at 1px = 0.75pt.

---

## Trim, bleed, and safety

Three nested rectangles, and confusing them is the most common production failure in the
discipline.

| Geometry | What it is | PDF/X name |
|---|---|---|
| **Trim** | The finished size, where the blade is aimed | `TrimBox` |
| **Bleed** | Trim plus the ink running past it | `BleedBox` |
| **Safety**, or the live area | An inset inside trim, within which nothing may be lost | No box; a convention |

The PDF/X family, ISO 15930, requires the finished geometry to be declared in the file rather than
inferred, which is what makes a print file exchangeable without a conversation (International
Organization for Standardization, 2001). `MediaBox` holds the page and contains the rest.

- **Bleed is a compositional decision before it is a production setting.**  
  A field stopping at the trim reads as a framed object. One running off it reads as a fragment of
  something larger. That choice is made while the composition is made, not at export.
- **Minimum bleed is 0.125in on every side, which is 3.175mm. Hold it.**  
  Metric shops conventionally specify 3mm, fractionally under the rule, so take 0.125in unless
  the printer states a larger value of their own. Some bindings and finishes want more. A
  person may go further by judgment; an agent producing print work never goes under it and
  never varies it without being told to.

## Cutting has tolerance

A guillotine cuts a lift of many sheets at once and drifts across it, so the finished edge on the
top sheet and the bottom sheet are not in the same place.

- **Nothing that matters sits within 3mm of the trim.**  
  Type or a mark placed closer will be closer on some copies and cut on others. This is a ban, not
  a default.
- **Give it more than 3mm on anything bound or folded.**  
  Those add their own movement on top of the cut.

## Format follows the paper

- **ISO 216's A, B and C series hold a ratio of 1:√2.**  
  Halving a sheet across its long side returns the same proportion, which is why a design scales
  across the series without being redrawn (International Organization for Standardization, 2007).
  North American sizes have no such property, and a layout that scales cleanly from letter to
  tabloid does so by coincidence.
- **A finished size that divides badly into the press sheet wastes paper.**  
  The cost lands on the job rather than on the design. A format chosen without asking how many fit
  on the sheet is a format chosen without its price.
- **Grain runs parallel to the binding edge.**  
  Paper fibers align during manufacture. The sheet folds cleanly along the grain and cracks across
  it, so a bound piece forced the other way will not lie flat.

## Binding takes the inner margin

How much depends on the method and the page count. Inner and outer margins are never equal on a
bound piece.

| Method | What it takes | Correction |
|---|---|---|
| **Saddle stitch** | Inner pages project further at the fore edge, then trim flush, so they lose more outer margin | Shift content inward progressively toward the center of the book. The effect is **creep**, and it grows with page count and paper bulk |
| **Perfect binding** | Pages near the back do not open flat | Grow the inner margin with page count |

- **An image crossing the gutter loses a strip of itself on every method.**  
  A face, a horizon or a word placed there is placed at risk.

## Folds change the panels

- **On any piece folding inward, the panels are not equal.**  
  A roll fold tucks each panel inside the previous one, so each successive panel is 2mm to 3mm
  shorter or the piece will not close. A gate fold does the same on both sides.
- **A layout drawn on equal panels drifts against the folds, and the error compounds inward.**
- **A fold is a structural edge, and it groups.**  
  Content crossing one reads as two pieces of content, so a fold falling through a group defeats
  proximity exactly as a divider does.

## Ink moves on the sheet

Reproduction is not exact, and four behaviors constrain layout directly.

| Behavior | What happens | What it constrains |
|---|---|---|
| **Tone value increase** | Halftone dots spread as ink meets paper, so mid-tones print darker than specified. ISO 12647-2 targets around 16% at the 50% tone for coated sheetfed (International Organization for Standardization, 2013). Uncoated gains more | Any ranking resting on a small tonal difference between two grays |
| **Total area coverage** | Ink fails to dry and offsets onto the next sheet past a limit. ISO Coated v2 sets 330% for general commercial work; uncoated profiles set less | Large dark fields |
| **Registration tolerance** | Separations do not land perfectly on one another | Small type built from more than one ink, and fine reversed-out type, which fringe |
| **Substrate** | Uncoated stock spreads ink and lowers contrast | Hairline rules and low-contrast grays, which read on a proof and vanish on the piece |

- **Small type is set in a single ink.**  
  Reversed type needs enough weight to survive the gain that closes its counters.

## Resolution is a property of size

- **Around 300ppi at reproduction size is the working target for offset.**  
  An image placed at 200% of its native size is at half its stated resolution.
- **Large format inverts the question.**  
  A billboard is produced at a fraction of that and viewed at distance. The constraint that matters
  is minimum legible size at the viewing distance, so scale decisions for signage are made against
  distance rather than against the format.

## The printer's specification overrides everything here

Every number above is a convention set by the press, the stock, the finishing and the house. These
values are for deciding before a printer is chosen. Once one is, their specification is the
constraint and this file is background.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Content inside the outer 3mm of a trimmed piece.** **A ban.**
- **Artwork ending at the trim where a field was meant to run off.**
- **A file with no declared trim geometry.** PDF/X exists to prevent exactly this.
- **Equal inner and outer margins on a bound piece.**
- **Equal panels on a piece that folds inward.**
- **A face or a word crossing the gutter.**
- **Ranking two grays that differ by less than the tone value increase.**
- **Fine reversed type in more than one ink.**
- **Hairline rules specified for uncoated stock.**
- **A separate print measurement system.** The brand's base converted at 1px = 0.75pt, not a
  fresh scale and not the same number in a different unit. Read [grids.md](grids.md) for the base.

## Verify

- [ ] `TrimBox` and, where anything bleeds, `BleedBox` are declared in the file.
- [ ] Bleed is at least 0.125in (3.175mm) per side, or the printer's larger stated value.
- [ ] Nothing that matters sits within 3mm of trim, and more on bound or folded work.
- [ ] Inner margin exceeds outer on anything bound, and grows with page count.
- [ ] Creep is corrected on saddle-stitched work.
- [ ] Panels on an inward-folding piece step down 2mm to 3mm.
- [ ] Grain runs parallel to the binding edge.
- [ ] No ranking depends on a tonal difference smaller than the gain.
- [ ] Dark fields sit under the profile's ink limit.
- [ ] Images are at roughly 300ppi at final placed size.
- [ ] Every measurement is on the brand's base converted to points, so a 4 base reads 3pt.

---

## Sources

- International Organization for Standardization. (2001). *ISO 15930: Graphic technology, prepress
  digital data exchange, use of PDF (PDF/X)*.
- International Organization for Standardization. (2007). *ISO 216: Writing paper and certain classes
  of printed matter, trimmed sizes, A and B series, and indication of machine direction*.
- International Organization for Standardization. (2013). *ISO 12647-2: Graphic technology, process
  control for the production of half-tone colour separations, proof and production prints, part 2:
  Offset lithographic processes*.
