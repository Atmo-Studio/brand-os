# [Brand name] brand folder

Everything needed to make work that is recognizably [Brand name]'s. Read `core-idea.md` first,
whatever you are making. Then follow the row for the job. Paths with a folder in them are written
from the project folder that holds `brand/`.

## Start here, by what you are making

| You are making | Read, in this order |
|---|---|
| Anything at all | `core-idea.md` |
| A layout, a page, a screen | `DESIGN.md`, then `brand/tokens/tokens.css`. Link `brand/tokens/fonts.css` beside it, where the folder has one: it loads the brand's own font files |
| Anything with the logo | `logo.md`, then the files in `brand/assets/logo/` |
| Anything with a motif | `core-idea.md → ## Motifs`, then `brand/assets/motifs/` |
| Anything that moves | `motion.md` |
| Code | `brand/tokens/tokens.css`, `brand/tokens/tokens.js` or `brand/tokens/tailwind.css`, with `brand/tokens/fonts.css` loaded beside it where the folder has one. Never type a value: use the token. Media queries take the breakpoint `DESIGN.md → ## Layout` states as a literal |
| Copy | [Where the brand's Voice & Tone Guide, Messaging Pillars and Brand Positioning live] |
| A quick look at the whole identity | `standards.pdf` |

## What is in this folder

| Path | What it is | Edit it? |
|---|---|---|
| `core-idea.md` | The one rule that makes the brand recognizable, and its motifs | Yes |
| `DESIGN.md` | The design standard: colors, type, layout, shape, do's and don'ts | The prose, yes. The frontmatter is generated |
| `logo.md` | Logo versions, clear space, minimum size, misuse | Yes |
| `motion.md` | How the brand moves | Yes |
| `brand/tokens/src/` | The token source. The only place a value is typed | Yes, then run the build |
| `brand/tokens/` outside `brand/tokens/src/` | CSS, JSON, JavaScript and Tailwind outputs, the contrast report | No. Generated |
| `brand/assets/` | Logo, font, motif and image files. `brand/assets/manifest.md` lists them | The files, yes. The manifest is generated |
| `standards.html`, `standards.pdf` | The brand standards sheet | No. Generated |
| `decisions.md` | How the identity was decided, and what is still open | Yes |

## Three rules that hold everywhere

- **A value is a token.** No color, size or font family is typed into work. It is referenced by
  its role name.
- **Work uses roles, never raw steps.** `color-text-primary`, never a ramp step such as `color-<ramp>-900`.
- **Change the source, then build.** From `brand/tokens/`: `node scripts/build.mjs && node scripts/check.mjs`.
  The standard, the sheet and every output follow.
