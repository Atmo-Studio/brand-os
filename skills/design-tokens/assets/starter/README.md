# Tokens

This brand's design tokens. One source, and everything else generated from it.

## Edit only `src/`

| File | Holds |
|---|---|
| `src/brand.tokens.json` | Brand: raw values. Color ramps, typefaces, type sizes, spacing, radius, shadow, motion |
| `src/intent.{brand}.tokens.json` | Intent: what each color means for one sub-brand (`accent`, `neutral`, `error`), each pointing stop for stop at a Brand ramp. One file per sub-brand |
| `src/patterns.light.tokens.json` | Patterns: the roles for the light theme. Each color points at an Intent step |
| `src/patterns.{theme}.tokens.json` | The same roles for a dark theme or another named ground, when the brand has one. `scripts/roles.mjs` writes it |
| `src/pairs.json` | Every text and ground pair to measure, with the contrast it must clear |

Every other file in this folder is written by the build. A change made to one of them is lost the
next time the build runs.

## After any edit

```bash
node scripts/build.mjs && node scripts/check.mjs
```

The build rewrites the outputs. The check stops on an alias that points nowhere, a role missing
from a theme, or a pair under its contrast floor, and says what to change.

## Use the tokens

| In | Load |
|---|---|
| Any stylesheet | `tokens.css`, then use the roles: `var(--color-text-primary)`, `font: var(--type-body)` |
| JavaScript | `tokens.js` |
| Tailwind v4 | `tokens.css`, then `tailwind.css` after `@import "tailwindcss"` |
| Anything else | `tokens.json`, every token resolved to its final value |

Use roles such as `color-text-primary` in work. Intent steps such as `color-accent-700` and Brand
steps such as `color-stone-900` exist so the roles have something to point at. A sub-brand is set
with `data-brand="{brand}"`, a theme with `data-theme="{theme}"`.

## Other commands

| Command | Does |
|---|---|
| `node scripts/ramp.mjs --help` | Builds a color ramp from one color |
| `node scripts/scale.mjs --help` | Builds the type scale and spacing from a base size and a ratio |
| `node scripts/roles.mjs --help` | Writes a sub-brand's Intent ramps and a theme's roles |
| `node scripts/audit.mjs` | Finds colors, sizes and font families typed as literals, and roles nothing uses. Give a path to scan code |
| `node scripts/diff.mjs --snapshot`, then `node scripts/diff.mjs` | Shows every value a change moved |
| `node scripts/sheet.mjs --pdf` | Renders the brand standards sheet |
| `node scripts/figma-push.mjs`, `node scripts/parity.mjs` | Push the tokens to Figma, and check that Figma matches |
