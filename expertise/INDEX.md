---
metadata:
  version: "0.4.0"
---

# Expertise index

Design and brand knowledge that skills and agents load on demand. **This file is canonical.** No
other file keeps its own list.

`metadata.version` above stands for the whole tree: it means "the release this tree last changed
in," the same thing a skill's own stamp means, and it is checked the same way, by `package.sh`'s
stamp guard, against every file under `expertise/`, not just this one. Bump it whenever any file in
the tree changes with release-worthy content: a stamp-only correction doesn't count, same rule as
skills.

Expertise is not a skill and not a lens. `skills/` holds what to do, `agents/` holds who works the
problem, and this tree holds what a practitioner knows and the values they hold work to. Nothing
here is invoked. Every file is reached by path, from a consumer that named it first.

---

## The tree

| Area | Files | Owns | State |
|---|---|---|---|
| Principles | [design-principles.md](design-principles.md) | The principles of design, Gestalt, the laws of UX, and how a designer chooses which one leads | Built |
| Motifs | [brand-motifs.md](brand-motifs.md) | The core idea, the motifs that carry it, placement rules, and what a web effect or a shader owes the brand | Built |
| Motion | [motion.md](motion.md) | What movement is for, duration bands, easing, what to animate, and reduced motion | Built |
| Layout | [foundations.md](layout/foundations.md), [grids.md](layout/grids.md), [print.md](layout/print.md), [adaptivity.md](layout/adaptivity.md) | Arrangement, grouping and ranking, spacing by relatedness, the base unit, grid systems, what print constrains physically, and what a layout has to survive when it adapts | Built |
| Color | [color-palette.md](color/color-palette.md), [color-ramps.md](color/color-ramps.md), [color-composition.md](color/color-composition.md), [color-usage.md](color/color-usage.md), [color-spaces.md](color/color-spaces.md), [color-tokens.md](color/color-tokens.md) | Choosing the brand color and the palette around it, scaling those anchors into ramps, composition strategies, applying a system and checking its pairs, color across notations and media, and the token tiers and names a codebase consumes | Built |
| Typography | [typefaces.md](typography/typefaces.md), [typescale.md](typography/typescale.md), [typesetting.md](typography/typesetting.md), [rendering.md](typography/rendering.md) | Letterform anatomy, typeface categories, selecting and pairing faces, the modular scale and the type sizes built on it, what happens once the sizes exist, and how type is delivered to a browser and a design tool | Built |
| Imagery | `imagery/` | Photography, illustration, iconography, texture, pattern | Planned |
| Standards | `standards/` | Accessibility conformance, platform conventions, type licensing | Planned |
| Evaluation | `evaluation/` | The craft floor, anti-patterns, and the moves to refuse. What a critique is run against | Planned |

`standards/` sits apart from the disciplines because accessibility and licensing cut across color,
typography and imagery at once. Three copies of one rule drift; one copy cited three times does not.

Motifs and motion sit at the root, beside the principles: a motif can be a color behavior, a type
treatment or a grid habit, and motion applies to all three. Shader and web-effect work is a kind of
motif, and lives in [brand-motifs.md](brand-motifs.md).

## How a discipline is shaped

**A discipline is a flat set of files, listed above.** No sub-index, no entry file, no routing
layer.

Each file opens with a **Use when** line naming the moment it is loaded, and closes with **Refuse**
and **Verify**. A file whose failures are recognizable in finished work closes with **Failure
conditions** as well, mapping a symptom to its cause and to the value the work missed.

- **Refuse** names what not to do, written so it is recognizable in finished work. These are
  category defaults rather than prohibitions: the brief's own words can earn one back, and reaching
  for one where the axis was free means the decision was not made. A rule that no brief overrides is
  marked as a ban.
- **Verify** is a checklist run against the finished work, not against the intention behind it.
  Every line cites a value, so passing it is a measurement rather than an opinion.

A consumer that checks work later reads those closing sections, so their names are fixed.

## Stage, and what it bounds

| Stage | Answers | Whose work |
|---|---|---|
| **Concept** | What should this be, and why that | Direction and critique, before anything is selected |
| **Specification** | What exactly, in what values | Systems, tokens, and build work, after selection |

**Stage constrains what a consumer returns, never what it may read.** Stage is not a property of a
file. Every file here carries both: what a decision is for, and what values it resolves to. A
director who cannot read how anchors scale chooses anchors that do not scale.

Two things bound a load, and they do different jobs:

- **The `When` clause** in a consumer's trigger row bounds the read to the question being asked.
  This is the only lever on context cost, and the tree read whole is the largest single load in
  this product
- **The consumer's output boundary** decides what may appear in the work it hands back. A
  concept-stage consumer reads specification knowledge in order to make a better concept, and
  returns none of it

The boundary runs between whose decision a value carries. A value belonging to the **medium**, such
as trim tolerance or the reflow floor, appears at any stage, because every direction has to survive
it. A value belonging to **this brand's system**, such as its column count or its spacing tokens, is
what specification work produces and never appears in a concept deliverable.

## Citing

Every file here states where its knowledge comes from. This is a working discipline, not academic
manners: a reader who can reach the source can check it, and a claim with no source is indistinguishable
from something an agent invented.

- **Use the field's own names for things.** Where a discipline has settled on a term, that term is
  the one to use, even when a clearer coinage suggests itself. Inventing vocabulary for established
  ideas costs credibility the moment a designer reads it.
- **Quote a definitive statement rather than paraphrasing it.** Where an institution or a standard
  text has defined something, reproduce the wording in quotation marks with `(Author, year)` inline,
  then write the usage guidance underneath in our own words. Never blockquote: a definition line and
  a line we authored should sit at the same level, with the quotation marks carrying the difference.
- **Where two methods are both valid, give the selection criteria and a default.** Several of these
  disciplines have no single canonical list. State which to reach for and when. A consumer that has
  to act needs a rule, and describing the disagreement hands it two answers instead.
- **Give the value, not the adjective.** "At least 2× the intra-group gap" is usable and "generous
  spacing" is not. Where a value is a convention rather than a standard, say whose convention.
- **Every file carries a `Source` line directly under its Use when line.** It says which kind of
  knowledge the file holds. `Source: field consensus` means a practitioner outside Atmo would
  recognize every claim and could check it in the Sources section. `Source: house position` means
  the field has not settled the question and the file takes Atmo's position, naming the practice it
  draws on. A file holding both says where the line falls: `Source: field consensus, except the house
  position on shortening ramps from the interior`. Existing files take the line the next time each
  is edited.
- **Every file ends with a Sources section, APA, alphabetized.** The format matches
  `skills/brand-discovery/frameworks.md`, which is the convention already in use.

Interpretation inside field consensus is not badged sentence by sentence. Where practice extends
what a source says, it is written into the usage layer as usage, because that layer is what this
tree is for. The `Source` line marks only where Atmo's own position goes beyond the field.

## Rules

- **A file with no trigger does not ship.** Every file here is named by at least one consumer's
  trigger table. The diagnostic checks it.
- **One home per specification, pointed to from wherever else needs it.** A value belongs to the
  discipline that owns the standard, not to every discipline that consumes it. The measure is
  typography's and the column width that follows is layout's. Where a file needs a value it does
  not own, name the owning file rather than restating it, and the owner carries a pointer back to
  the consequence. Two copies of one number is how they drift apart.
- **Brand-neutral bodies.** No client hexes, named client devices, or client vocabulary. Public work,
  public typefaces and published frameworks are evidence, not brand context, and belong here.
- **State the failure, not the caution.** "Reads as timid" beats "be careful with."
- **No work order.** A file that sequences someone's work belongs in a skill. Stating a standard, a
  value, or the rule for choosing between options is not sequencing.
