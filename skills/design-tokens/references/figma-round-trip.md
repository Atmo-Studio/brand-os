# The Figma round trip

How tokens move between code and Figma, in each direction, and what Figma cannot hold. Read it
before any sync.

**Code is the source. Figma is a copy.** A push overwrites Figma from `figma.json`. A pull never
writes to the source by itself: it produces a diff, and a person accepts it.

A sync needs a Figma connection that can run Plugin API code in a file. Without one, say so in one
line and stop. Figma's REST API for variables is limited to its Enterprise plan (Figma, n.d.-a), so
the Plugin API is the route that works on every plan.

## What a Figma variable can carry

| Token | In Figma | When it cannot be a variable |
|---|---|---|
| Color, solid | A color variable | n/a |
| Color with alpha | A color variable with its alpha | n/a |
| Spacing, radius, type size, leading | A number variable, scoped to where it applies | n/a |
| Font family, font weight | A string or number variable | Bind family and weight together. See the checks below |
| Tracking | **Not a variable** | A letter-spacing variable applies in pixels. Tracking is set on the text style as a percent |
| A type role | A text style | Styles hold no modes. A role that differs by theme needs one style per theme |
| A shadow | An effect style | Effect styles hold no modes. The default theme's values are pushed, and the report says so |
| A fluid size, `clamp()` | One number | Push the largest value and record that the smaller end lives in code only |
| Duration, easing | A number or a string variable | Figma applies neither. They are carried for reference |
| A sub-brand | A mode on the Intent collection | A plan that limits modes per collection caps the sub-brands Figma can show. Say which was left out |
| A theme | A mode on the Patterns collection | The same cap, on themes. A frame picks its sub-brand in Intent and its theme in Patterns, and every alias resolves through both |

## Push: code to Figma

What the finished file holds, and the order it is built in, is specified in
`../../brand-library/references/figma-kit.md`. Read that first when the job is the whole kit.


1. Build, so `figma.json` is current, then write the push scripts:
   ```bash
   node scripts/build.mjs && node scripts/figma-push.mjs
   ```
   This writes `figma-push/01-create.js`, `02-values.js`, `03-styles.js`, an `assets` script for
   each batch of logo and motif files, and a `bind` script, with more of each for a large library.
   They are Plugin API code, each small enough to run in one call.
2. Push into a file made for this brand. Never push into a file that holds other work without the
   user naming it.
3. Run each script in the file, in order, and read what it returns.
   - **Create** makes the `Brand` collection with one mode, `Value`, the `Intent` collection with
     one mode per sub-brand, and the `Patterns` collection with one mode per theme, then every
     variable with its type, scopes and code syntax. Brand and Intent colors are hidden from the
     pickers: a file binds to Patterns roles. **A file built on two tiers is renamed in place:** its
     `Core` collection becomes `Brand` and its `Intent`, which held the roles, becomes `Patterns`,
     so every binding survives, and a new `Intent` is created between them. **Then it
     looks for stale variables:** any in those collections that the source no longer has, left
     by a renamed or removed token. With any found it creates nothing and returns them as `stale`,
     each marked `renameTo` the source name it maps to or `remove`. Show the user the list, and on
     their yes write the scripts again and run `01-create.js` again:
     ```bash
     node scripts/figma-push.mjs --rename 'layout-*=container-*' --stale apply
     ```
     `--rename` takes the pairs `diff.mjs --rename` proved, in published names. A variable with a
     rename target takes its new name in place, so every node bound to it stays bound; deleting it
     and creating the new name would leave those nodes holding a raw value. The rest are deleted.
     Where the user wants them kept, `--stale keep` leaves them and carries on, and parity reports
     them as extra.
   - **Values** sets each variable in each mode. An Intent ramp becomes an alias to the Brand
     variable it points at, and a role an alias to the Intent variable. It returns `missing`: any alias whose target was not found. That list must be empty.
   - **Styles** makes a text style per type role and an effect style per elevation role. It
     returns `skipped`: each text style it could not write, and why.
   - **Assets** puts every SVG in `brand/assets/logo/` and `brand/assets/motifs/` on a page named
     `Assets`, each as a component on a frame filled with the ground `logo.md` names for it, its
     colors bound to the variables.
   - **Bind** runs last, once the standards sheet's boards are on a page named `Brand standards`.
     It names the boards, sets them in one top-aligned column per section of the sheet, each a
     Figma section, binds every solid color to its variable, gives each text
     layer its text style, or the type variables where its case differs from the style's, gives
     each shadow its effect style, and replaces each logo and motif drawing with an instance of
     its component. The swap runs before the binding, so `unmatched` counts only paints still on
     the finished boards, never one on art the swap replaced. It
     returns `textWithoutTokens` and `unmatched`: text and colors no token holds. Specimen text and
     artwork that keeps live text are the expected entries.
4. Every script updates what already exists, by name, so running one twice is safe.
5. Read everything back with the parity check, below. A push is not finished until parity is zero.

**Where a font cannot be loaded in Figma,** the styles script skips that text style and says so.
Push everything else. When every text style was skipped, add `"textStyles": { "skipped": true }` and
a `notInScope` line naming the font to the parity result before reporting, so the report says the
styles were not synced. Variables do not depend on fonts.

## The three checks on every text style

Each of these went wrong on a real build.

- **Tracking is a percent on the style, never a bound variable.** A letter-spacing variable applies
  in pixels. A 3% value bound as a variable became 3px on a 9px line.
- **Family and weight move together.** Figma names a weight per family: `Medium` in one family is
  `65 Medium` in another. After any family change, set the style name the new family uses. Record
  a family's names under `$extensions["brand-os"].figmaStyles` on its token when they differ from
  the common ones.
- **Read the font back after setting it.** Setting a family is not one operation: the family can be
  written and the font then fail to load, which leaves the style on a pair that does not exist.

## Parity

```bash
node scripts/parity.mjs script
```

This writes `figma-parity.js`, a read-only script carrying a checksum for each collection, for the
text styles and for the effect styles. Run it in the Figma file and save what it returns as JSON.
Then:

```bash
node scripts/parity.mjs report <result.json>
```

- A line is a variable's name, type, scopes, code syntax and its value in every mode.
- Colors compare to four decimals, because Figma stores 32-bit floats.
- Scopes compare as a set, because Figma reorders them.
- Where a checksum matches, that part is identical. Where it does not, the report names every
  line that differs.
- The report is `figma-parity.md`. Zero differences is the only pass.

## Pull: Figma to code

Someone explored in Figma and wants a change kept.

1. Run the parity check. Its differences are the proposed change.
2. Show each difference to the user as a diff against `brand/tokens/src/`: the token, the value in code, the
   value in Figma.
3. For each one they accept, edit `brand/tokens/src/`. Never edit a generated file.
4. Build, check, and push, so Figma and code agree again. A value the check rejects does not come
   back, and the user is told why.

A pull is never applied without the user seeing the diff.

## Code Connect

Code Connect links a Figma component to the code that implements it, and Figma limits it to its
Organization and Enterprise plans (Figma, n.d.-b). Check the plan before promising it. Where it is
unavailable, write the component's code path into its Figma description: one line a developer can
read in the inspect panel.

## Sources

- Figma. (n.d.-a). *Variables REST API*. https://www.figma.com/developers/api#variables
- Figma. (n.d.-b). *Code Connect*. https://www.figma.com/code-connect-docs/
