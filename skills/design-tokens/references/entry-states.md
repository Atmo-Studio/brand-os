# Entry states

Read this once the entry state is named and it is not GREENFIELD. Each state below gives the order
of work, what to report, and when the state is finished.

## EXTRACT

A finished identity exists in a design file, a guidelines PDF or a slide deck. Nothing is in code.

1. **Inventory before building.** Read every value out of the source and list it with where it was
   read: the page, the frame, the style name. Use this table.

   | Value | Kind | Read from | Named in the source as | Role it appears to play |
   |---|---|---|---|---|

2. **Separate what was decided from what was drawn.** A color used once in one mockup is an
   observation. A color on the palette page is a decision. Ask about anything used and never named.
3. **Show the inventory to the user** and get three answers: which values are fixed exactly, which
   may snap to an even ramp, and which are mistakes in the source.
4. **Build from the inventory.** Fixed colors take `--pin`. Type sizes that follow no ratio are a
   finding: say so, propose the nearest scale, and let the user choose between the scale and the
   drawn sizes.
5. **Record what was left out** in `brand/decisions.md`, each with its reason.

Done when every inventoried value is a token or is listed as left out.

## AUDIT-AND-REBUILD

Tokens or variables are already in code, written by hand. Some are wrong and nobody knows which.

1. **Audit, and change nothing.** Read every variable and every literal the code uses. Report:
   - how many distinct colors, sizes and families are in use
   - near-duplicates: values closer than one ramp step
   - variables defined and never used, and literals that bypass the variables
   - every text and ground pair in use, measured against the ground that paints behind it
   - notes or comments that state a contrast ratio, checked against a fresh measurement
2. **Report before rebuilding.** Consolidating changes what renders on screens nobody asked to have
   touched. The user decides which differences are fixes and which are regressions.
3. **Snapshot the current state before changing anything**, so the rebuild can be compared. Where
   the old system is already a token library with a built `tokens.json`, run
   `node scripts/diff.mjs --snapshot`. Otherwise write the existing variables, resolved, to
   `old.tokens.json` in the build's shape: `{ "themes": { "light": { "color-bg-page": "#rrggbb", … } } }`,
   one key per variable under the name the rebuilt library will publish it as.
   **Take the snapshot even when the founder reopens one group,** color say, and the rest is carried
   over. The groups nobody reopened are exactly what the diff proves unchanged, and carried by hand
   they drift without anyone seeing it.
4. **Rebuild as GREENFIELD,** from the values the audit kept. Pin the brand anchors.
5. **Compare** with `node scripts/diff.mjs`, or `node scripts/diff.mjs old.tokens.json tokens.json`.
   List every value that changed and why. A change in a group nobody reopened, or one the user did
   not agree to, is a defect in the rebuild.
6. **Give every state a role.** An audit of hand-kept tokens nearly always finds a hover or a
   disabled state set from a raw ramp step. Each one becomes a role with a pair.
7. **Map hand-added groups onto the contract's.** A kit built before the contract named a group
   may hold its own: `layout.content`, `layout.breakpoint`, `stroke.focus-ring`, a role group the
   brand invented. Where the contract now names it (`../references/library-contract.md → ## Names`),
   move each token to the contract's name, keep its value, and remove the old group. Show the user
   the mapping as a table, old name, new name, value, before any file changes. Then prove nothing
   moved: `node scripts/diff.mjs --rename layout-content=container-content,layout-breakpoint=breakpoint-md`
   reports 0 differences when every value survived the move. Rewrite every reference to an old name
   in `DESIGN.md`, its companions and the brand's code; `node scripts/audit.mjs` fails one that
   was missed. A hand-added token the contract has no name for stays, under its own name.
8. **Clear what an older script wrote.** A kit scaled by an earlier `scale.mjs` keeps a
   "19.20px computed" note on every type step, and a Figma push carries each one into a variable's
   description. `node scripts/scale.mjs --tidy` removes those notes and changes no size. The build
   reports them as `oldScaleNotes` until it runs.

Done when the rebuilt library reproduces every value the audit kept, and every difference is one
the user agreed to.

## RETROFIT

A codebase is full of literals. A token file may or may not exist.

1. **Scan and count:**
   ```bash
   node scripts/audit.mjs <path to the code>
   ```
   Report the count by kind: colors, font families, font sizes.
2. **Build or confirm the library first.** Replacing a literal needs a token to replace it with.
3. **Map each literal to a Patterns role, never to a Brand or Intent step.** Where no role fits,
   Patterns is missing one. Add it, with its pair, and say so.
4. **Replace in small batches,** one component or one page at a time, and look at each after it
   changes. A literal that matched no token was either a mistake or a decision nobody recorded.
   Ask which.
5. **Scan again.** List every literal left, each with its reason.

Done when the scan is clean, or every remaining literal is listed with its reason.
