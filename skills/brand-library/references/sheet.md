# The standards sheet

What the sheet is, what each board reads, and what it has to avoid. Read it before the first render.

## What it is

A guidelines deck in one file: a column of boards, edge to edge, and in the PDF one board to a
page. Every board is one 1920 by 1080 frame, and its layout fills
the frame: a board that runs short stretches its rows. Each board carries its title and at most one
sentence at the top, and the metadata row along the bottom: the brand, "Brand standards", the
board's number and title, the version and date. It shows how the identity is used, not only what it
contains. It is generated from the tokens and the brand's written files, so it cannot drift from
them. `brand/standards.html` is the source of `brand/standards.pdf`.

From `brand/tokens/`:

```bash
node scripts/sheet.mjs --pdf
```

The script prints the boards it rendered, the page count, the fonts embedded, and any warning. With
`--pdf` it also measures every board in the browser and warns of one that runs past its frame or
leaves an empty band at the top or the bottom of its body. A board is left out when the brand has
nothing for it. Depth follows input: a thin brand gets fewer boards, never emptier ones.

## What each board reads

| Board | Reads | Left out when |
|---|---|---|
| Cover | `DESIGN.md` name, the logo drawn for the inverse ground, `sheet.json → images.cover`. The logo, centered, and the metadata row, nothing else | Never |
| Contents | The boards rendered: one numbered line per chapter | Never |
| Core idea | `core-idea.md`: its first sentence in the `display` role, scaled down to fit when it is long, and each `###` under `## Motifs`: the drawn file where the motif names one, else drawn from its construction in the brand's own roles, with its placement | There is no `core-idea.md` |
| Logo candidates | `logo.md → ## Candidates`, a table of candidate, file and note: each candidate in a header, large on the page, reversed on the dark ground and at its minimum width, side by side. A review round's board | Fewer than two candidates are listed. The finished `logo.md` lists none |
| Logo | `logo.md → ## Versions`: each row's file and ground | Never. With no files, the name is set in type and labelled as such |
| Clear space, size and misuse | The tokens `logo-clear-space` and `logo-min-width`, and the lines of `logo.md → ## Misuse` when there are six or fewer, each drawn at one size on the dark ground under one hairline slash, with its first sentence as the caption | Neither token exists |
| Logo misuse | Every misuse line when there are more than six, or when neither logo token exists, in the same tiles. A lone tile never fills a board | There are no lines, or they all sit on the clear-space board |
| Color | `patterns.color.$extensions["brand-os"].proportion`: each color as a field as wide as its share. An entry at 0%, and any status role, is left out, because a state is function and never a share of the surface. With no proportion, each ramp's chosen color and each fixed color | Never |
| Ramps | Every ramp and fixed color in Brand. A dot marks the step each chosen color sits on. A ramp only status roles use is drawn as a shorter row, marked "status only" | Never |
| Chroma map | Every ramp: the chroma each step holds, each step drawn in its own color | Never |
| Color pairings | The brand's primary pairs only, from `brand/tokens/src/pairs.json`: each main ground with its text color, and the inks and fills set on the page, each with its ratio. Text is a square inside the square, a filled mark a dot. Boundaries, secondary grounds and text, states and status roles stay off it: a stroke hides the color it shows | There are no pairs |
| Text contrast | The primary text color on each main ground, set as text in one line, with its ratio and level, in columns of one width. Every other measurement lives in `brand/tokens/contrast.md` | Never |
| Typefaces | Every `font.family` with the weights its type roles set, one column per family and per width a role sets it at. Each family's name is sized optically: the page measures each face's x-height and sets every name to one, outside the type scale | Never |
| Type scale and styles | Every `font-size` step drawn at its size, with the base and ratio, and every type role specified: family, weight, size and line height, tracking, the step it sits on | Never |
| Type at its real size | Every type role on one board, one line each, set with the copy in `sheet.json`, with the role's feature settings and width applied. A line longer than the board is cut with an ellipsis | Never |
| Type in use | The roles set together on a story card (ticket line, display, subheading, body, action) and a data card (figure with its unit, heading, caption, micro), so a pairing is judged as a pairing | Fewer than three roles |
| Space and shape | Spacing on the base-unit grid, radius, the stroke weights and depth: the grounds side by side with a hairline, and elevation only when a shadow is not zeroed. Set on the page color | Never |
| Layout | One ruler: the `container` widths as bars, the `breakpoint` steps as ticks with the one `DESIGN.md → ## Layout` names marked as where the layout turns, and the `viewport` range a fluid value grows across. Beside it, every fluid token at the range's two ends. Set on the page color. A breakpoint DESIGN.md does not name is a warning | There are no `container` or `breakpoint` tokens |
| Motion | Each motion band played on a real element at its own duration and easing (a press, a layer that fades and travels, a cut), then the easing curves, on the page color. The HTML plays; the PDF holds the resting state | There are no motion roles |
| Imagery | `sheet.json → images.gallery` | No images are listed |
| In use | The roles by name (`display`, `heading`, `body`, `ticket`), the logo, `sheet.json` copy and `images.hero`, and each motif drawn where its placement puts it: the rim from its file at its own size beneath the live headline, a ruled line of `copy.ticket` in the `ticket` role along the hero's edge at full measure, on the dark card in the inverse ink | Never |
| Do and don't | `DESIGN.md → ## Do's and Don'ts`, the first sentence of each | The section is empty |
| Where everything lives | The files present in `brand/` | Never |

A board's title names what it governs. Logo, Color, Typefaces, Motion and Imagery may carry one
sentence under the title, the first sentence of the brand's own section. The script writes one line
of its own: under the chroma map, the line that says how to read it.

## Drawing motifs

A motif's `- **Draw:**` line names how the sheet builds it from the tokens its Construction line
names:

| Draw | Built as |
|---|---|
| `under-rule` | The live `display` headline with a bar under it. A drawn `File:` is placed at its own size. Without one, the bar is `` `stroke-x` tall`` by `` `spacing-y` wide`` and `` `spacing-z` below`` the headline from Construction, or as wide as the headline when Construction names no width |
| `ruled-line` | A line of `copy.ticket` (or `copy.label`) in the type role Construction names, with a hairline under it across the full measure, or above and below when Construction says so. On the core idea board a drawn `File:` is shown instead |
| `figure` | The `figure` role with `copy.figure`, and `copy.figureUnit` under it in the `ticket` role and the accent text color Construction names |

**A drawn file wins over the hint when it is the motif alone.** Where a motif names a `File:` that
exists, the sheet draws the file, never its own picture of the `Draw:` word. It leaves the file off
and builds the motif from its tokens when the file is reference, not the motif: the motif's line
says so (`- **Reference drawing:**` in place of `File:`), the manifest row says "reference" or "not
placed", or the SVG holds lettering, which means a headline or facts drawn around the motif would
show twice. The last case raises a warning. With no Draw line the sheet reads Construction and
Placement for a kind. A motif that is none of these shows as its artwork on the core idea board and
stays off In use.

## Drawing misuse

Each line in `logo.md → ## Misuse` starts with the transformation it shows, as a bold label:

```markdown
- **recolor:** Don't fill the wordmark with {colors.accent-bg}. The accent marks the action.
```

| Label | Drawn as |
|---|---|
| `recolor` | The logo filled with the color the line names, as a token or a ramp's name |
| `retype` | The name set in capitals, widely tracked |
| `ground` | The logo on the ground another version was drawn for, or the accent, its bounds dashed where it vanishes |
| `stretch`, `rotate` | The logo stretched, or turned |
| `effect`, `outline` | A drop shadow, or the logo as an outline |
| `crowd` | A headline, the first words of the display line, set inside the logo's clear space, drawn dashed around it |
| `add` | A bar added beside the logo, or under it when the line says under |
| `large`, `small`, `crop` | The logo too large for its tile, below its minimum, or cut off |

A line with no label is read for one of these words. A line that names none, such as one about
rearranging the logo's own parts, is reported and left off the board: fix the line, not the sheet.

## `brand/sheet.json`

The sheet's copy and images. Copy the skill's sheet template, named in its Step 5, and fill it.

- **Every string is the brand's own.** Take them from Taglines, Messaging Pillars, Brand Story and
  the Voice & Tone Guide. Where the knowledge base has none, ask the founder for one real line.
  Never write placeholder copy, and never invent a tagline.
- **A `copy` key named for a type role sets that role's sample.** A brand with a role called
  `legal` can give it `"legal": "…"`. A role whose name is also a key the boards read, such as
  `nav` (the links list on In use) or `ticket`, keeps its sample under `copy.roles`:
  `"roles": {"nav": "Plates / Glazes / Reorder"}`. `copy.nav` may be an array or one string split
  by slashes.
- **Motif copy.** `copy.ticket` is the ticket line's facts, `copy.ticketNumber` its optional number,
  `copy.figure` the measured number and `copy.figureUnit` its unit, `copy.micro` the plate-foot line.
  Each is a real fact of the brand's, never a claim.
- **Leave out `images` when the brand has none.** The sheet is typographic without them, which is
  better than a borrowed photograph.
- `version` and `date` appear in every board's footer.
- **`accepted`** lists warnings the founder has seen and kept: `[{"warning": "…", "by": "founder",
  "date": "YYYY-MM-DD", "why": "…"}]`. The text is the warning as the script printed it, or a
  stretch of it long enough to match only that one. The script reports a matched warning under
  `accepted` instead of `warnings`, so Step 7's "no warning left unanswered" can be met. A warning
  that changes its wording, a board's overflow growing say, fires again.

## The floor

The sheet has to read as the work of a studio, not as a printout of variables.

- Every board is a fixed frame, and its layout fills it. White space inside a layout is fine. An
  empty band at the top or the bottom is not.
- Every board's title names what it governs. Prose is the brand's own, one sentence at most.
- Every line of text is set in one of the brand's type roles, exactly, so a design tool can give
  each layer its text style.
- Diagrams carry their construction: clear space is drawn, not described.
- Values sit beside what they describe, in the brand's label face.
- Grounds alternate, so the brand's light and dark registers are both seen. A board's ground, a
  tile's ground and a field are the brand's main grounds only: the page, the inverse, the accent,
  the action fill and any ink the proportion names. A surface, raised or sunken ground is an
  interface state and never paints a panel here.
- Content sits on the board's ground. A section is separated by space, and by one hairline where
  that is not enough. No filled panel, no boxed card.
- A diagram line (a curve's frame, a construction guide, a chart's grid, a unit tick) clears 3 to 1
  on its ground. The script takes the first border or text role that does, or the ground's text
  color at the lowest opacity that does.
- A long core idea scales down to fit its frame, and the motif cards below it keep their height. A
  motif's drawing has its own area in its card and never sits on its label.
- Type is shown at the size it is used at, set with real copy.
- At least one board shows the identity on a real surface.

## Patterns it avoids

Check the render against this list every round, and add to it when a round finds another.

- A gradient the brand's tokens do not define
- Everything centered
- A grid of same-sized cards
- An icon standing in for content
- Swatches with no role and no proportion
- A pairing tile carrying more than one color on its ground
- A misuse described in words where it could be drawn
- A lone specimen letter pair where a role set at real size belongs
- Placeholder copy
- A device mockup with nothing on its screen
- A shadow or a rounded corner the tokens do not hold
- A third typeface for labels when the brand has two
- A logo on a ground it was not drawn for
- A logo whose lettering is live text: it renders in a fallback font
- A boundary drawn as an outlined tile, where the color is the point
- A filled panel or boxed card holding a section
- A guide line that vanishes on its ground

## Viewing a page

Every review below depends on looking, and the obvious routes fail quietly. Built-in browser panes
often refuse `file://`, headless Chrome can hang on a page that plays motion, and a PDF reads as
text without a rasteriser. Use one of these, in this order:

1. **Serve the folder on localhost and open it there.** From the project folder that holds
   `brand/`: `npx --yes http-server -p 4173 .` or `python3 -m http.server 4173`, then open
   `http://localhost:4173/brand/standards.html`. The same serves a page an agent built, so it can
   view its own work. Fonts load, and the motion board plays.
2. **Render the PDF to images.** `pdftoppm -png -r 72 standards.pdf board` writes one PNG per
   board. Any equivalent rasteriser works.
3. **Screenshot one board** with the Chromium the script prints with:
   `chrome --headless=new --window-size=1920,1080 --screenshot=board.png http://localhost:4173/brand/standards.html`.
   Point it at the served URL, not `file://`.

Where none of these works, say so before reviewing, and review the markup. Every finding from that
review says it came from markup, not pixels, and the optical check counts as not run.

## Reviewing it

0. **View it** as `## Viewing a page` describes, and say which route you used.
1. **Read the script's warnings first.** It reports a logo whose color matches its ground, which
   is the sign of a version assigned to the wrong one, a logo file holding live text, a misuse it
   cannot draw, and a board that overflows its frame or leaves a band empty.
2. **Look at the render.** Open `standards.html`, or the PDF. A check that passed does not mean the
   page reads well.
3. **Have `design-director` critique it:** mission `critique`, the work being the rendered sheet,
   the brand context being the Visual Identity dimension and `decisions.md`. Where the harness
   cannot deploy an agent, read `agents/design-director.md` from the Brand OS root and follow its
   critique mission yourself.
4. **Fix what it files as defects** in the source the board reads, never in the HTML, and render
   again.
5. **Show the founder, and ask what reads wrong.** Repeat until they approve.

## Without a browser

`--pdf` needs a Chromium-family browser on the machine. Where there is none, the script says so and
exits with code 3. Tell the user in one line, leave `standards.html` in place, and tell them how to
make the PDF themselves: open the file, print, choose "Save as PDF", no margins, background
graphics on.
