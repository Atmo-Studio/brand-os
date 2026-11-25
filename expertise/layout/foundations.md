# Layout foundations

**Use when:** Arranging anything on a surface, in any medium. Load this before choosing a
structure, because the structure answers to what is decided here.

The principles of design govern this work: read
[design-principles.md](../design-principles.md) for them, and nothing below restates one. Read
[grids.md](grids.md) for the base unit and for the numbers these ratios resolve to.

---

## Start from the content, not the grid

Answer both before any structural decision, and write the answers down.

1. **What must this surface communicate, and to whom?**  
   One sentence naming what the reader leaves with. Not the topic.
2. **What content actually exists?**  
   The real inventory at real lengths: the longest title, the shortest, the item with no image, the
   empty state, and the translated string.

A layout with no answer to the first has no referent for importance, so every size decision after
it is preference. A layout with no answer to the second is a container looking for content, and the
tell is work that holds with placeholder text and breaks on real copy.

**Extremes are where structures fail and where the least attention goes.** Translated strings run
longer, and short strings grow proportionally the most, which makes a one-word button label the
riskiest element on a screen.

## What a layout is made of

The **elements of art** are the material. The principles describe how they behave once arranged.
The Getty definitions are the reference set (J. Paul Getty Trust, 2011).

| Element | Definition |
|---|---|
| **Line** | "An identifiable path created by a point moving in space. It is one-dimensional and can vary in width, direction, and length" |
| **Shape** | Two-dimensional, carrying height and width, and "usually defined by lines" |
| **Form** | Exists "in three dimensions, with height, width, and depth" |
| **Space** | "A feeling of depth or three dimensions. It can also refer to the artist's use of the area within the picture plane" |
| **Color** | "Light reflected off objects," carrying hue, value and intensity |
| **Value** | "The brightness of color" |
| **Texture** | "The surface quality of an object that we sense through touch" |

Two compound elements do not appear on that list and make up most of any page.

- **Text is shape, value and texture before it is language.**  
  A set paragraph is a gray rectangle whose darkness comes from size, weight, leading and measure.
  Judge the gray before the words, because that is the order a reader gets them in.
- **An image carries its own composition into yours.**  
  A strong internal diagonal imposes movement on a page that did not ask for it. Either the image
  agrees with the structure or it fights it, and there is no third option.

**Squint until the words are illegible.** What survives is what the composition is doing. If the
ranking is invisible at that blur, it does not exist for anyone scanning at speed.

## Grouping with space

Three tools produce grouping. Use them in order and stop at the first that works.

| Order | Tool | Use for | Never |
|---|---|---|---|
| 1 | Space | Everything, by default | |
| 2 | A shared background or container | A group that has to read as one operable unit: a selectable row, a draggable card | Never add one to repair spacing that is already wrong |
| 3 | A rule or divider | Dense tabular content where space costs more than the page can pay | Never pair a rule with a gap that already did the job |

- **Separate groups by at least twice the space used inside them.**  
  Below a 2:1 ratio the boundary stops being findable, and the grouping reads as noise no matter
  what its members have in common.
- **Nesting repeats one step rather than introducing a new value.**  
  The same interval at every level of subordination, not a fresh number per level.
- **A container groups whatever falls inside it.**  
  Common region outranks proximity, so a box drawn around the wrong set beats every grouping
  decision made within it (Palmer, 1992).

**Never repair weak proximity with a container.** Perception resolves grouping before styling, so
the box works, the spacing stays wrong, and everything built on that layout inherits the fault.

## Alignment

- **Choose a few alignment edges and hold every element to them.**  
  Scanning follows an unbroken edge, so every additional edge slows a reader down and every stray
  one reads as an error rather than as intent.
- **Express subordination with one repeated step, not a new value per level.**  
  Three leading edges in one column is the common failure, and it usually arrives as three
  components each carrying their own padding.
- **Set numbers flush to the trailing edge and text flush to the leading edge.**  
  Digits are only comparable when their place values stack.

**Optical alignment beats measured alignment wherever the two disagree.**

| Situation | Correction |
|---|---|
| A round shape beside a flat one | The round shape overshoots, or it reads small |
| A quotation mark or bullet at a text edge | It hangs outside the edge, so the edge reads straight (Bringhurst, 2004) |
| An icon inside a button beside text | An icon carries empty space inside its bounding box, so equal padding reads wider on the icon side. Take about 2px off the icon side |
| A rounded element nested in a rounded container | Outer radius = inner radius + the padding between them |
| A triangular glyph in a circular control | Shift toward the flat side; its geometric center is not its visual center |
| A type area on a page | The optical center sits above the geometric center (Tschichold, 1991) |

Measure to decide, then look, and let the eye settle it.

## Set spacing by relatedness

**How much space an interval gets is decided by how closely the two things relate**, never by where
they happen to sit. Elements placed near one another are assumed to be related, so a consistent
interval reads as a consistent relationship (Atlassian, n.d.).

Three bands carry the work. Values shown at a 4px base; at an 8px base take the same multiples of
the base rather than the same numbers.

| Band | Range | Use for |
|---|---|---|
| **Small** | 0 to 8px | Inside a component: icon-to-text gaps, badge padding, label to field |
| **Medium** | 12 to 24px | Between components and inside less dense regions: button padding, card padding |
| **Large** | 32 to 80px | Between blocks of content on the page |

Four intervals are fixed rather than chosen.

| Interval | Value |
|---|---|
| Inside a group | One Small step |
| Between groups | ≥ 2× the intra-group gap |
| Between sections | 4× the inter-group gap, so 64px at a 16px group gap, in the Large band |
| Above a heading against below it | 2 : 1 |

- **A heading belongs to the content beneath it.**  
  The space above has to be the larger one or the heading attaches to the block it just ended
  (Butterick, n.d.). At 1:1 it floats between both. Past 2:1 it stops being a heading and starts
  being a section break.
- **Macro space is margins, column gaps and the field around a headline.**  
  It sets perceived quality and is read before anything else on the surface (Boulton, 2007).
- **Micro space is leading, letterfit and the gap between a label and its field.**  
  It sets legibility, and it is the half most often left at a browser or template default.
  Set it deliberately, every time.
- **Active space directs, passive space separates.**  
  Space placed asymmetrically leads the eye somewhere. Space placed evenly holds things apart and
  produces calm. Both are decisions; neither is what is left over.

**Margins do not fix leading.** A page set with 56px margins and 20px leading on 16px type looks
considered from across the room and is tiring to read in the hand. Macro space takes the
attention because it is the half visible at a glance.

## Order by importance

Ranking comes from difference, and a layout has seven levers for it.

| Lever | What it does | What overuse costs |
|---|---|---|
| **Size** | The strongest and the first read | Empties the middle of the range, leaving nothing for secondary content |
| **Weight** | Ranks without changing the footprint | Stops discriminating past three steps |
| **Value** | Ranks by darkness against the field | Low contrast used as a taste signal fails legibility first |
| **Color** | Ranks by salience | Excludes readers with a color vision deficiency when it carries a rank alone |
| **Position** | Higher and earlier reads as more important | Fights the content's own order when applied against it |
| **Isolation** | Space around an element promotes it without changing it | Costs area, so it does not scale past two or three uses |
| **Density** | A sparse region outranks a packed one | Reads as unfinished if nothing occupies it |

- **Three or four ranks is what one surface carries.**  
  Past four the ranking stops being readable and the reader falls back to sequence, which is the
  outcome ranking existed to prevent.
- **Two or three levers per element, not seven.**  
  A promotion spent in every register leaves nothing to promote the next rank with.
- **Emphasis is a ratio, so what recedes is part of the decision.**  
  A second focal point does not add emphasis. It removes the first.

## How people actually scan

Four scanning patterns are measured. Two of them are things readers do to bad layouts, and only one
is something a designer can produce.

| Pattern | What it is | Standing |
|---|---|---|
| **Commitment** | Nearly every word read | Best comprehension, and not something layout can cause |
| **Layer-cake** | Headings scanned, body read under the ones chosen | The one to design for |
| **Spotted** | Fixations on visually distinct or task-relevant words | Better than F, with good formatting |
| **F-pattern** | First words of lines and the top of the page | Least effective of the four |

Ranked worst to best, F sits last (Pernice, 2019).

- **Produce the layer-cake pattern with informative headings at a visible ranking interval.**  
  A reader scanning heads alone gets nothing from "Overview" and "Details," so the pattern only
  pays when the headings carry content.
- **The F-pattern is a diagnosis, not a layout.**  
  It is what readers do to text that gives them nothing to navigate by (Nielsen, 2006; Pernice,
  2017). See **Refuse**.
- **The Gutenberg diagram describes a reading habit, not a measured result.**  
  Primary optical area top left, terminal area bottom right, and little empirical support behind
  the claim that following it improves comprehension (Lidwell et al., 2010).
- **The Z-pattern needs a nearly empty surface.**  
  Four points in sequence works on a poster or a single landing view. On a content-bearing page it
  is decoration.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **Equal intervals throughout.** Nothing groups, and the surface gets skimmed rather than read.
- **A divider where a gap would have done the job.** Reach for space first, every time.
- **Centered body text past two or three lines.** Every line starts in a new place, so the eye
  loses the return.
- **Justified text without hyphenation.** Rivers open through the column.
- **Running text at the full width of the canvas.** Measure is a legibility constraint, not a
  layout preference.
- **Breakpoints at device presets.** They change the layout where nothing was wrong. Read
  [adaptivity.md](adaptivity.md) for where a breakpoint belongs instead.
- **A grid that is never broken anywhere.** Correct and inert, which is what the break exists to
  prevent. Read [grids.md](grids.md) for how to place the break.
- **Content in the outer 3mm of anything trimmed.** **A ban.** The blade has tolerance and no
  brief overrides it. Read [print.md](print.md) for trim, bleed and safety.
- **Designing toward the F-pattern.** **A ban.** The finding is that unformatted text produces
  F-shaped scanning and poor comprehension, so accommodating it entrenches the failure it names.

The same failures recur at component level, and Atmo refuses those too: identical card grids
standing in for page structure, the hero-metric template, eyebrows above headings, decorative
01/02/03 section numbers, and modals wrapped around tasks that never needed to interrupt anything.

## Verify

Checks on the finished layout, not on the intention behind it.

- [ ] Every interval is a multiple of the base unit.
- [ ] Every group's inter-group gap is at least 2× its intra-group gap.
- [ ] Section gaps are 4× the inter-group gap.
- [ ] Space above each heading is 2× the space below it.
- [ ] The squint test still shows the primary element, the secondary, and the major groups in order.
- [ ] No more than four ranks, and no element carrying more than three levers.
- [ ] No rank carried on color alone.
- [ ] Headings name their content, so the heads alone are readable as a summary.
- [ ] One set of alignment edges per column, with optical corrections applied.
- [ ] Leading and letterfit set, not just margins.
- [ ] The layout holds at the longest string, the empty state and the translation.

## Failure conditions

| In the work | Cause | Value it misses |
|---|---|---|
| Groups do not read as groups | Grouping ratio under 2:1 | ≥ 2× the intra-group gap |
| A box around a group whose intervals are uniform | A container repairing proximity | The 2:1 ratio, unmet |
| Sections that read as one section | Section gap under 4× | 4×, the Large band |
| A heading floating between two blocks | Heading space symmetric | 2 : 1, above to below |
| An interval off the base | No base unit, or one abandoned | Read [grids.md](grids.md) for the base |
| Three leading edges in one column | Edges accumulated per component | One set per column |
| A round element measuring right and looking small | Measured alignment where optical was needed | Overshoot |
| Margins generous, leading tight | Macro spent, micro skipped | Body line-height 1.5 to 1.6 |
| Nothing leads | Emphasis absent, or spent in six places | One focal point per view |
| Body text running the full canvas | Measure ignored | 45 to 75 characters |

---

## Sources

- Atlassian. (n.d.). *Spacing*. Atlassian Design System. https://atlassian.design/foundations/spacing
- Boulton, M. (2007, January 8). Whitespace. *A List Apart*. https://alistapart.com/article/whitespace/
- Bringhurst, R. (2004). *The elements of typographic style* (3rd ed.). Hartley & Marks.
- Butterick, M. (n.d.). Space above and below. *Butterick's practical typography*.
  https://practicaltypography.com/space-above-and-below.html
- J. Paul Getty Trust. (2011). *Understanding formal analysis: Elements of art*. getty.edu.
- Lidwell, W., Holden, K., & Butler, J. (2010). *Universal principles of design* (rev. ed.). Rockport.
- Nielsen, J. (2006, April 17). *F-shaped pattern for reading web content*. Nielsen Norman Group.
- Palmer, S. E. (1992). Common region: A new principle of perceptual grouping. *Cognitive Psychology,
  24*(3), 436–447.
- Pernice, K. (2017, November 12). *F-shaped pattern of reading on the web: Misunderstood, but still
  relevant*. Nielsen Norman Group.
- Pernice, K. (2019, August 25). *Text scanning patterns: Eyetracking evidence*. Nielsen Norman Group.
  https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/
- Tschichold, J. (1991). *The form of the book: Essays on the morality of good design* (H. Hadeler,
  Trans.). Hartley & Marks.
