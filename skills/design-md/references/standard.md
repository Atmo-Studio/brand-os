# The DESIGN.md standard

What Google Labs' DESIGN.md format requires, and the bar a brand's file is held to above it. Read
it before writing the first section.

## The format

DESIGN.md is one markdown file with YAML frontmatter. The frontmatter holds the tokens, which are
the normative values. The prose explains how to use them (Google Labs, 2026).

| Key | Holds | Here |
|---|---|---|
| `version` | `alpha` | Kept as written |
| `name`, `description` | The brand's name and a one-line summary | Written by hand |
| `colors` | Name to color | Generated from the token source |
| `typography` | Name to an object: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` | Generated |
| `rounded`, `spacing` | Name to a dimension | Generated |
| `components` | Component tokens | Left out, and declared under `omitted` |
| `omitted` | Sections deliberately left out, each with a reason | Written by hand |

**Sections, in this order:** Overview, Colors, Typography, Layout, Elevation & Depth, Shapes,
Components, Do's and Don'ts. A section may be left out. The ones present keep the order. Sections
the format does not name are kept as written, which is where Motion and Imagery go, after Do's and
Don'ts.

**A token reference** is a path in braces: `{colors.accent-bg}`, `{typography.body}`,
`{rounded.md}`, `{spacing.4}`.

## What the linter checks

`npx --yes @google/design.md@0.4.0 lint <file>` returns JSON with a summary of errors, warnings and
infos. The bar is 0 errors and 0 warnings.

| Finding | Severity | Cause | Fix |
|---|---|---|---|
| `broken-ref` | Error | A `{…}` reference names no token | Correct the name. Read the frontmatter for the real one |
| `missing-primary` | Warning | No color named `primary` | The build writes one, pointing at the brand color's fill. Run the build |
| `orphaned-tokens` | Warning | A color no component uses | Declare Components under `omitted`, as the template does |
| `missing-typography` | Warning | Colors with no typography | The build writes every type role. Run the build |
| `section-order` | Warning | Sections out of order | Restore the order above |
| `token-like-ignored` | Warning | An unknown top-level key holding token-like values | Move the values into the token source |

Two behaviors that surprise:

- **The linter reads any fenced YAML block in the prose as tokens.** A value shown as YAML in a
  section is parsed, and a key that repeats a frontmatter key rejects the file. Show values in a
  table.
- **The format has no key for motion and none for themes.** Motion values go in a table between
  the `motion-tokens` markers, which the build fills. A second theme is a second file,
  `DESIGN.dark.md`.

## The bar above the format

A file can lint clean and still be useless. These are what make one worth reading.

- **The Overview stands on a specific reference.** A real object, a place, a practice. "Like a
  railway timetable" gives a stranger something to check their work against. "Clean and modern"
  gives them nothing.
- **Every color has a role and a limit.** What it does, and where it stops: the one job it holds,
  the share of a surface it may take, the element it never colors.
- **The prose names tokens and never restates a value.** A hex in the prose is a second copy of a
  number. The one size the prose states is the breakpoint, beside its token, because a media query
  cannot read a custom property. Every other size is named by its token, and the scan fails it.
- **Do's and Don'ts are short and specific to this brand.** Five to ten lines. Each don't is a
  mistake this brand is prone to, written so it can be recognized in finished work. A line any
  brand could carry is cut.
- **Motion and Imagery get sections,** though the format does not ask for them.
- **Component tokens stay out of the frontmatter; a minimal Components section stays in.**
  Component tokens in the frontmatter make the linter warn on every color no component uses, so
  the frontmatter declares Components omitted. The prose still carries a `## Components` section:
  the primary and secondary action, the text link, button padding, the focus ring and how the
  motion tokens drive hover and press. A brand with no component library still has buttons, and an
  agent left without these guesses them. The linter accepts the section beside the omission.
- **Known gaps stay out.** An open question goes to the brand's tracker or to `decisions.md`. The
  file holds what is decided.
- **There is no guide to prompting.** The file is the guide.

## Section by section

| Section | Holds | Fails when |
|---|---|---|
| Overview | The reference, how the brand behaves on a surface, which theme is primary | It could describe another brand with the name changed |
| Colors | Each color by its own name, its token, its job, its limit. How states and actions are colored. What was measured | A color appears with no job, or a hex appears at all |
| Typography | The families and their jobs, the scale's base (`font-size-0`) and ratio with the reason, a table of roles, how emphasis works | The roles are listed and their use is not |
| Layout | The base unit (`spacing-1`), how space ranks and groups, the page margin, section padding, panel padding, column gap and the gap each recurring element keeps, the content width and reading measure, and the breakpoint as a literal for media queries | It restates the spacing scale and says nothing about using it, or an agent must guess a width, a gap or where the layout changes |
| Components | The primary and secondary action with the label of the primary, the text link, button padding, the focus ring's width, offset and color, and the motion tokens hover and press use | A button's padding, ring or hover must be guessed |
| Elevation & Depth | How depth is shown and which treatment wins | Shadow and border are both allowed on one surface |
| Shapes | The shape language, and the radius each kind of element takes | Radii are listed with no assignment |
| Do's and Don'ts | The moves that make work this brand's, and its characteristic mistakes | A line could be in any brand's file |
| Motion | The character of the movement, and which band each kind of change takes | Durations are stated with no job |
| Imagery | What is shown, how it is treated and placed, what is never shown | It describes a mood |

## Sources

- Google Labs. (2026). *DESIGN.md* [Specification and CLI, alpha]. GitHub.
  https://github.com/google-labs-code/design.md
