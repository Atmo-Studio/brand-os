# Grids and the base unit

**Use when:** Setting up a brand's measurement system, or choosing and building the structure a
surface sits on. Read [foundations.md](foundations.md) for the ratios; this file resolves them into
numbers.

---

## Pick a base unit and stay on it

Every brand runs on one base unit, chosen once and used everywhere.

| Base | Take it when | Trade |
|---|---|---|
| **8** | The default. Fewer variables, and each step is visibly distinct from the last | Coarse for dense interfaces and small components |
| **4** | Dense product work, data-heavy surfaces, or a brand whose character is fine and precise | Twice as many values to hold, and easier to drift off |

4 is the finer subdivision of 8, so the two are one system rather than two. A brand on 8 can reach
for a 4 half-step inside a component without leaving its own scale. **Which one a brand takes is
settled during discovery from its own constraints, not per project.**

- **Every size, position and interval is a multiple of the base.**  
  Spacing, component dimensions, icon sizes, and the vertical position of every element.
- **Type sizes round to the nearest base multiple from the scale's default.**  
  A modular scale returning 25.6px is set at 24px on a 4 base, 24px on an 8 base.
- **The layout margin is the longest side of the canvas ÷ 25, rounded to the nearest base multiple.**  
  1440px gives 57.6, set at 56. 1024px gives 40.96, set at 40. 375px gives 15, set at 16, which is
  also where both major platforms put their mobile floor: 16dp at Material's compact breakpoint,
  and 16pt on iPhone (Apple, n.d.; Google, n.d.).
- **Print carries the same physical measure, not the same number.**  
  A CSS pixel is 1/96 inch and a point is 1/72, so 1px is exactly 0.75pt. A 4 base is 3pt in
  print and an 8 base is 6pt. The mapping is exact at every step: 8px is 6pt, 16px is 12pt,
  24px is 18pt. Carrying the number instead of the measure gives an 8pt base, a third coarser
  than the screen system it was meant to match.

**Never take an odd base such as 5.** Centering text or an icon in a 25px height produces split
pixels and blurs on some displays (Dahl, n.d.).

## The document grid

The structural division of the page. **The column count comes from how the content divides.**
Twelve is the default and it is right for most work, because it divides by two, three, four and
six. It is a convention rather than a proportion, and content that does not divide those ways
takes a different count.

| Content divides in | Take | Why |
|---|---|---|
| Halves, thirds, quarters, sixths | 12 | All four splits land on column lines |
| Thirds, with no quarters wanted | 3, 6 or 9 | The same splits with fewer lines to ignore |
| Fifths | 5 or 10 | On 12 every fifth lands between two columns |
| Sevenths, such as a week | 7 | |

The parts carry the field's own names, and using them precisely is what lets two designers discuss
a structure without drawing it (Samara, 2002).

| Part | What it is |
|---|---|
| **Margin** | Space between the content area and the edge of the format |
| **Column** | A vertical division that content aligns to and spans in whole numbers |
| **Gutter** | Space between two columns, which is what keeps them reading as separate |
| **Module** | One unit created where rows cross columns |
| **Flowline** | A horizontal alignment carrying the eye across the format, breaking it into bands |
| **Marker** | A position held constant across pages for a recurring item, such as a folio |
| **Spatial zone** | A group of modules assigned to one kind of content |

**A structure naming only columns is underspecified.** Most of what makes a set of pages read as
composed rather than arranged comes from flowlines and markers, and those are the parts left
undecided.

Working values at a 4 base, from the margin rule above:

| Width | Columns | Margin | Gutter |
|---|---|---|---|
| 375 to 599 | 4 | 16 | 16 |
| 600 to 839 | 8 | 24 | 16 |
| 840 to 1199 | 12 | 32 | 24 |
| 1200 and up | 12 | 48 or the ÷ 25 result, whichever is larger | 24 |

## The layout grid on top of it

The document grid divides the page. The **layout grid** is the compositional division actually
used, and on product surfaces it is two to four columns laid over the twelve.

- **Compose in 2 to 4, align to 12.**  
  A screen composed directly in twelve columns produces a row of equal cards, because twelve
  offers so many equal spans that taking one is the path of least resistance.
- **The layout grid is where asymmetry lives.**  
  8 + 4 for content beside a sidebar, 7 + 5 for a deliberately uneven split, 2 columns of unequal
  weight for a comparison. All of them land on the twelve underneath.
- **Documents keep the document grid alone.**  
  A report, a deck or an editorial spread has no second structure. The overlay exists because
  product screens carry regions rather than a reading flow.

## Choosing a grid

Read the content inventory. Take the first family that fits it (Samara, 2002).

| If the content is | Take | Structure | It has failed when |
|---|---|---|---|
| One continuous voice read start to finish | **Manuscript** | One column, four margins, plus markers | A second content type arrives that is not an aside |
| Discontinuous, of varying width, on one rhythm | **Column** | 12 by default, spanned in whole numbers | Every element spans the same width |
| Repeating units of similar rank, such as product cards in a marketplace or a retail listing | **Modular** | Flowlines crossed over the column grid, usually inside a region of it rather than instead of it | Every module is filled |
| Parts of genuinely different shape with no repeat | **Hierarchical** | Shared edges and flowlines, no equal division | A second designer cannot place a new element |

**A modular grid is usually laid over a column grid, not chosen instead of one.** The columns set
the page and the modules set the repeating units inside one region of it, which is why a
marketplace listing and the page holding it can run different rhythms without disagreeing.

**Never pick the column count before the measure.** Fix the line length first, then take whatever
count that implies.

## Measure sets the column

A column is as wide as a line of text can be before the eye loses the return, so the measure
decides the column and never the other way round. Read
[../typography/typesetting.md](../typography/typesetting.md) for the character-count standard; this
file takes only the column width that follows from it.

**A grid whose columns produce a measure outside the standard is wrong however well the numbers
divide.** Fix the measure, then take the column count it implies.

## Type sits on the baseline

- **Every line of type lands on the baseline grid.**  
  Text in adjacent columns then aligns line for line, and vertical rhythm holds across a spread
  without anyone measuring it (Bringhurst, 2004).
- **The baseline grid runs at 4, or 3pt, even on an 8 base.**  
  8 is too coarse an interval for leading, so the baseline runs at the half-step while spacing and
  sizing stay on 8 (Dahl, n.d.).
- **Leading is derived in typography and rounded to the baseline here.**  
  Read [../typography/typescale.md](../typography/typescale.md) for how a line-height is derived and
  for the rounding formula. What layout requires is that the result lands on the baseline, which
  means a proportional value rarely survives as a round ratio.

In print the baseline grid is worth its full cost: the page is fixed, a spread's columns are read
together, and type showing through from the reverse of the sheet lands on the same lines. On screen
it is routinely abandoned, because variable content, images of arbitrary height and font loading all
break it. **Vertical rhythm from a consistent spacing scale is the version that survives on screen**,
and it returns most of the benefit without requiring every line to land.

## Breaking the grid

- **Break one thing and let everything else hold.**  
  A break reads as intent only against a structure that is otherwise intact. Two breaks read as an
  absent grid, which is the same result as never having built one.
- **Whatever crosses the structure takes the emphasis.**  
  So the element that breaks has to be the one that should lead. A break landing on a secondary
  element assigns the focal point by accident.
- **Say where the break is before the work is made.**  
  "The grid breaks in exactly one place" is a rule someone else can apply to a surface you never
  showed them. "We broke the grid" is a description of an accident.

A grid followed everywhere with no break produces work that is correct and inert (Samara, 2002).
The grid is a tool for removing the arbitrary so that whatever remains was chosen
(Müller-Brockmann, 1981).

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A spacing or sizing value that is not on the base.** One arbitrary interval becomes the value
  every later decision is measured against.
- **A separate print scale.** Same base, expressed in points. Read [print.md](print.md) for the
  conversion.
- **Composing a product screen directly in 12 columns.** Use 2 to 4 over the 12.
- **Twelve columns on content that divides in fifths.** Take 5 or 10, or whatever the content divides by.
- **A column count chosen before the measure.**
- **A grid never broken anywhere.**
- **A baseline grid enforced on a screen layout with variable-height media.** The cost exceeds the
  return; use the spacing scale.

## Verify

- [ ] Every value in the layout is a multiple of the declared base.
- [ ] The base is declared once for the brand, not per project.
- [ ] Print work converts the base at 1px = 0.75pt rather than reusing the number.
- [ ] Layout margin equals the longest canvas side ÷ 25, rounded to the base.
- [ ] Measure sits at 45 to 75 characters in a single column, 40 to 50 in multiple columns.
- [ ] Line-height is a base multiple, body at 1.5 to 1.6.
- [ ] The grid family matches the content inventory, and does not already show its own failure
      condition from the "Choosing a grid" table: a Column grid where every element spans the same
      width, a Modular grid where every module is filled, or a Hierarchical grid a second designer
      cannot place a new element in.
- [ ] Flowlines and markers are decided, not just columns.
- [ ] Product screens compose in 2 to 4 columns over the document grid.
- [ ] The break is named, and there is exactly one.

---

## Sources

- Apple. (n.d.). *Human interface guidelines: Layout*.
  https://developer.apple.com/design/human-interface-guidelines/layout
- Bringhurst, R. (2004). *The elements of typographic style* (3rd ed.). Hartley & Marks.
- Dahl, E. (n.d.). *Space, grids, and layouts*. Design Systems.
  https://www.designsystems.com/space-grids-and-layouts/
- Google. (n.d.). *Material Design 3: Layout*. https://m3.material.io/foundations/layout
- Müller-Brockmann, J. (1981). *Grid systems in graphic design*. Niggli.
- Samara, T. (2002). *Making and breaking the grid: A graphic design layout workshop*. Rockport.
