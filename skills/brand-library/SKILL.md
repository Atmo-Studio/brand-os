---
name: brand-library
description: >-
  Packages a brand's identity into a kit any agent, designer or team can build from with no other
  context: a brand folder (tokens, DESIGN.md and its companions, assets with a manifest, a readme),
  a standards sheet as a PDF, and a Figma file built from the same tokens when Figma is connected
  and wanted. It maps the kit, shows what exists, and builds what is missing in order. Use it
  whenever an identity has to work for developers and AI tools: just decided, handed over by a
  designer as logo files and a guidelines PDF, or living in an established brand's site, files or
  body of work. Triggers on "build my brand library", "finish my brand kit", "package the brand for
  agents", "make our brand agent-ready", "brand standards sheet", "brand guidelines PDF", "set our
  brand up in Figma", "our designer sent the logos and guidelines", "turn our existing brand into a
  system". Not for deciding the identity (visual-identity), and not a digital asset manager.
license: MIT
compatibility: The sheet needs Node.js 18 or later, and a Chromium-family browser to print the PDF. Without either, the skill says what it could not make. Figma is optional.
metadata:
  author: Atmo Studio
  version: "0.4.0"
---

# brand-library

Turn an identity into a kit a stranger can build from, and prove it.

**The test this skill works toward:** an agent given only `brand/` and one job makes on-brand work,
using only the brand's tokens, and needs nothing from outside the folder. Every step below either
puts something in the kit or checks that claim.

**The files are the source of truth.** The token source in `brand/tokens/src/` holds every value
once. The PDF, the Figma file, a website and a deck are all outputs of it. A change is made in the
source and rebuilt, never made in an output.

The folder is the founder's: plain files in their project, versioned however they version
everything else. This skill never adds rights management, approval routing or access control.

The readme, the manifest and every message to the user follow `SOUL.md §Writing rules`. Read them
in the workspace's own `SOUL.md` when it has that section, otherwise in `../../SOUL.md` from this
skill's folder, before you write anything. No reply and no file you write carries an em dash in a
sentence: write two sentences, or use a colon or a comma.

## The kit

Show the user this map in Step 1, marked with what exists, so they see how the system is put
together and where their brand stands in it.

| Part | What it is for | Path | Made in |
|---|---|---|---|
| Decisions | What was decided and why, in words | `brand/decisions.md` | `visual-identity`, or Step 2 here |
| Token library | Every value, once, and the code each tool reads: CSS, JSON, JavaScript, Tailwind, Figma variables | `brand/tokens/` | Step 3, by `design-tokens` |
| Assets | The logo, motif and font files | `brand/assets/` | Step 4 |
| The standard | The rules an agent or designer applies, naming tokens: `DESIGN.md`, `core-idea.md`, `logo.md`, `motion.md` | `brand/` | Step 5, by `design-md` |
| Manifest and readme | What each file is, and where to start for each job | `brand/assets/manifest.md`, `brand/README.md` | Step 6 |
| Standards sheet | The brand on one deck, generated from the tokens | `brand/standards.pdf` | Step 7 |
| Figma file | The same kit as variables, styles, components and the sheet, for designers | Figma | Step 8, when connected and wanted |
| Visual Identity page | The knowledge base's one-minute introduction, pointing at `brand/DESIGN.md`. Marked approved, or awaiting the founder | The Visual Identity dimension | Step 9 |

**A value is typed once,** in `brand/tokens/src/`. No file in the kit repeats one.

| Path | Never edited by hand |
|---|---|
| `brand/README.md`, `brand/assets/manifest.md` | Yes. Step 6 rewrites both whole, from the template and from the assets folder, every time the kit changes. Never patch a line in place |
| `brand/DESIGN.md` | Its frontmatter |
| `brand/tokens/` | Everything outside `brand/tokens/src/` |
| `brand/standards.html`, `brand/standards.pdf`, the Figma sheet | Yes |

## Step 1: Show the map, and find the route

1. **Resolve storage** by following `../brand-discovery/references/storage-resolution.md` §1–3,
   load the adapter from `../brand-discovery/references/adapters/{storage}.md`, and lock the
   locator. `list-dimensions` once. If it reports a failed integrity assertion, follow
   `../brand-discovery/references/storage-resolution.md` §6: report the failure and stop. A
   dimension not started is still a file in the map: a missing one is drift. **Where no knowledge
   base resolves, carry on without one.** A
   brand can have an identity and no discovery behind it: take the sheet's copy from the founder in
   Step 6, and skip Step 9.
2. **Look in the brand's project folder** for each part of the kit, and ask what else exists
   outside it: a designer's files, a live site, a codebase, a body of work. A report left by an
   earlier run, `contrast.md` or `figma-parity.md`, says what was true then: mark a part done only
   by its own done condition, run now.
3. **Compare the kit's scripts with the starter's before judging any part.** `brand/tokens/scripts/`
   is a copy of `../design-tokens/assets/starter/scripts/` from the day the kit was built, and a
   check run by an old copy passes what the current one fails. Compare the two folders file by file
   (`diff -rq brand/tokens/scripts <starter>/scripts` where a shell is available). Where any file
   differs, mark the token library **stale**, and the sheet with it, and offer to update the
   scripts first. A fix the brand keeps for itself sits as a diff beside the library, per
   `../design-tokens/references/library-contract.md`: reapply it after the copy. Then run
   `node scripts/scale.mjs --tidy` once, which strips the per-step notes an older scale wrote and
   changes no size (the build names them as `oldScaleNotes` until it runs), and re-run the build,
   the checks and the render before marking anything done. Where the user declines, every
   part a script checks stays marked stale.
4. **Check for Figma.** A Figma connection counts when a Figma tool that can create files or run
   Plugin API code is available and signed in.
5. **Show the user the map** above, each part marked present, missing or stale, the Visual
   Identity page marked approved or awaiting, and the route you read from it. Then ask one thing: what they want from this session, the whole kit or one part of
   it. Where Figma is connected, add one question to that message: build the kit in Figma too?
   Where it is not, add one line: the kit can also be assembled in Figma once they connect it.
   Record the Figma answer in `decisions.md` and do not ask again.

| What you find | Route | Start at |
|---|---|---|
| `decisions.md` approved, tokens built | **Just decided.** The founder saw the rounds and is not asked again | Step 4 |
| A designer's finished files: a design file, a guidelines document, logo and font files | **Arrived finished** | Step 2 |
| An established brand: a live site, a codebase, logo and font files, or a body of work, with no system around it | **Established** | Step 2 |
| A kit that exists, with one thing changed | **Refresh** | The step that owns the change, then Step 6 on |
| A kit that exists, and the user wants only the PDF, or only Figma | **One output** | Step 7, or Step 8 |
| Nothing decided and nothing to take in | **Too early** | Stop. Send the user to `visual-identity` |

**A Refresh reads `brand/decisions.md` before any change.** Hold the request against every fixed
decision, every constraint marked to keep exactly, and every ruling in the rounds. Where it would
change one, name the decision to the user in its own words, with its date and who made it, and ask
whether to reopen it before touching a file. A yes is recorded as a new decision that names the one
it replaces. A no ends that part of the request. A request that reopens nothing goes ahead without
the question. After the change, the check names any two grounds it brought under 2:1 against each
other (`../design-tokens/references/library-contract.md → ## The checks`): show the user both
ratios, before and after, and let them choose which ground moves.

**Done when** the user has seen the map and said what they want, or has not answered and you are
going on with the route you named.

## Step 2: Take in what exists

For a designer's delivery and for an established brand alike, the work is to record what was
decided, never to redecide it.

1. **Read everything supplied before describing any of it.** Open each logo file and note its
   colors and the ground it was drawn for. Read guidelines for their rules as written. Read a site's
   stylesheet for the values it uses, and a body of work for what it does again and again: the
   colors, the faces, the way a page is set.
2. **Ask the founder what is fixed.** Which colors reproduce exactly, which typefaces they hold a
   license for, whether the guidelines are current. Then ask what source files rarely say: the one
   idea that makes the brand recognizable, and how much of a surface each color takes.
3. **Start `brand/decisions.md`** from `../visual-identity/assets/decisions.template.md`, with
   `Path: existing`. Record what was read and where from. Finish its color, type and logo sections
   after the tokens exist, so they name tokens and not values. **Where it already exists on the
   designer path,** keep it, its `Path: designer` and its `## Handoff`, and add a `## Delivery`
   section instead: what arrived, where from, and the date.
4. **On the designer path, check the delivery against the handoff.** Go down `## Handoff → What to
   deliver` and mark each item delivered, partly delivered or missing. Tell the founder what is
   missing, a drawn mark above all, and ask whether it is still coming or dropped. Record each
   answer in `## Open`. A missing item is never filled in here without the founder's say.
5. **Copy the files into `brand/assets/`:** `logo/`, `fonts/`, `motifs/`, `images/`, each made only
   when it holds a file. Copy, never move: the founder's originals stay where they were.
6. **Name what is missing.** Where the brand has no decision for a part the kit needs, a type scale,
   a core idea, a motion rule, run `visual-identity` for that round only, then come back to Step 3.
   Everything the brand already decided stays as it is.
7. **Snapshot before anything is reopened.** Where the founder reopens a part the brand already
   decided, color say, the rebuild at Step 3 still carries everything else over. Take the
   before-and-after diff that `design-tokens`' AUDIT-AND-REBUILD describes before the first value
   changes, so the groups nobody reopened are proven unchanged rather than carried by hand.

**Done when** `decisions.md` records each source, each fixed decision, and each gap and where it is
being settled, and on the designer path each handoff item is marked with the founder's answer for
anything missing.

## Step 3: The token library

Run `design-tokens` in the entry state that fits: GREENFIELD for an identity just decided, EXTRACT
for a design file, a guidelines document or a body of work, AUDIT-AND-REBUILD where tokens already
exist in code, RETROFIT for a codebase full of literal values. Stop before its Step 8: the Figma file
is made at Step 8 here, once, with the whole kit in it.

**Done when**, from `brand/tokens/`, `node scripts/build.mjs --verify` and `node scripts/check.mjs`
both exit 0.

## Step 4: The assets

Everything the standard and the sheet draw on goes into `brand/assets/` before either is written.

- **Logo and motif files.** On a generated identity the logo and core idea rounds wrote them
  already. Step 2 copied in everything else. A logo's lettering is outlines, never live text: a
  `<text>` element renders in whatever font the viewer has, and falls back to a default serif
  wherever the face is not installed. Where a file holds one, ask for an outlined version, or
  outline it in a design tool, before the sheet is rendered.
- **Fonts.** The files of each typeface the type roles name, from the founder or the foundry, with
  the license file beside them. An open-license face comes from its own source, license included.
  Where a license file cannot be found, name the license in the manifest and record the missing
  file in `decisions.md → ## Open`. Never write license text from memory. Where the brand holds no
  files for a face, say so: the sheet falls back to the stack's next face. **The check fails** a
  folder holding font files with no license file (`LICENSE`, `OFL.txt` or a name holding
  `license`) and no `## Open` line naming it. Open licenses such as the SIL Open Font License ask
  that the license travel with the fonts, so a kit handed on without it is short.
- **Reference art carries no copy.** A motif or reference drawing shows construction: weight, gap,
  proportion. A headline or a line of facts drawn into it goes stale the day a decision changes the
  words, and the Figma push carries the stale text into components. Draw it with neutral bars in
  place of words. Where a file must keep lettering, Step 6 checks its text against `sheet.json`.

**Done when** every logo, motif and font file the identity uses is in `brand/assets/`, every font
folder holds a license file or a `## Open` line naming its absence, and no motif file holds copy
that differs from `sheet.json`.

## Step 5: The standard and its companions

Run `design-md`. It writes `DESIGN.md`, `core-idea.md`, `logo.md` and `motion.md`, lints the first
and scans all four.

**Done when** its linter reads 0 errors and 0 warnings and its scan finds nothing.

## Step 6: The manifest, the readme and the sheet's copy

1. **The manifest.** `brand/assets/manifest.md`: one table, one row per file in `brand/assets/`,
   rewritten whole from a fresh listing of the folder. Carry a row's words over from the old
   manifest only where its file is unchanged. `node scripts/audit.mjs` fails a file with no row and
   a row whose file is gone.

   | File | What it is | Use it for | Governed by |
   |---|---|---|---|

   "Governed by" names the rule: `logo.md → ## Versions`, `core-idea.md → ## Motifs`, a font's
   license. A file nobody can describe is asked about, and left out of the folder until someone can.
2. **The readme.** Copy `assets/README.template.md` to `brand/README.md` afresh, over the old one,
   on every run. Keep only the rows for
   files that exist, every path written from the folder's parent, `brand/...`. Fill the Copy row
   with where the brand's verbal dimensions live: file names when the knowledge base is a local
   folder, their names in the knowledge base when it is somewhere else.
3. **The sheet's copy.** Read `references/sheet.md` now. Copy `assets/sheet.template.json` to
   `brand/sheet.json` and fill it with the brand's own words, read through the adapter: Taglines
   (Order 44), Messaging Pillars (Order 43), Brand Story (Order 41), Voice & Tone Guide (Order 42).
   Where a dimension is not complete, ask the founder for one real line, and write it to that
   dimension first (`write-dimension`), then into `sheet.json`. The dimension is where copy lives;
   `sheet.json` only carries it to the sheet. Give a type role its own
   line where it would otherwise repeat another's: under `copy.roles.<role>` when the role shares a
   name with a key the boards read, such as `nav`. Where a motif draws a ticket line or a figure,
   fill `copy.ticket`, `copy.figure` and `copy.figureUnit` with real facts. The sheet never shows
   placeholder copy. **Where Taglines and Brand Story are both empty,** ask the founder for one
   hero line, the sentence a visitor reads first, and the label of the primary action. Write the
   hero line as an Active Taglines row with the context "Website hero", and the label under
   Messaging Pillars → `## Calls to action`. Where that section is missing, report it and name the
   heading the founder adds; never create it. Then fill `copy.display` and `copy.cta` from them.
4. **Art that holds words.** Read the text in every SVG under `brand/assets/motifs/` and any
   reference drawing. Each line it carries must equal a line in `sheet.json`. Flag a mismatch to the
   founder: redraw the file without copy, or update it to the current line.

**Done when** every asset has a manifest row, every logo file is named in `logo.md → ## Versions`
with its ground, every path in the readme exists, the readme routes to `tokens/fonts.css` where the
build wrote one, `sheet.json` holds no placeholder text, its hero line and action label match Taglines and
Messaging Pillars, and no
art's text differs from it.

## Step 7: The standards sheet

From `brand/tokens/`:

```bash
node scripts/build.mjs && node scripts/check.mjs && node scripts/sheet.mjs --pdf
```

Then work the loop in `references/sheet.md → ## Reviewing it`:

1. Read the script's warnings and fix each at its source.
2. Look at every board yourself, against the "Patterns it avoids" list.
3. Have `design-director` critique it, and fix every defect it files in the source the board reads,
   never in the HTML.
4. Show the founder. Ask what reads wrong. Change, render, show again.

**The sheet is not done on the first render.** Record each round in `brand/decisions.md → ##
Rounds`.

**Done when** no warning is left unanswered, the script reports as many pages as boards with fonts
embedded, the critique's defect list is empty, and the founder has approved. Where they give no
answer, finish the kit and record the sheet in `## Open` as not yet approved.

## Step 8: Figma, when connected and wanted

Where the user said yes in Step 1, read `references/figma-kit.md` and build the file to it: the
variables and styles, the Assets page, the sheet, then the bind pass. It ends with a parity check.

Where Figma is not connected, or the user said no, the kit is complete without it. Run
`node scripts/figma-push.mjs` from `brand/tokens/` all the same: it writes the scripts that build
the file into `brand/tokens/figma-push/`, where they wait. Say so in one line in the handover, and
go on.

**Done when** the file passes the checks in `references/figma-kit.md → ## Done`, or Figma was not
part of this session.

## Step 9: The Visual Identity page

Read `references/visual-identity-page.md` and follow it. The page becomes a one-minute introduction
that points at `brand/DESIGN.md`. The founder sees the rewrite before it is written. Without their
yes the page stays as it is: put the proposed text in `decisions.md → ## Open`. A page already
rewritten with no recorded yes is shown to the founder now, beside the text it replaced.

**Done when** the founder has approved the page, the proposal is recorded as open, or there is no
knowledge base.

## Step 10: Prove it

Run every check. Report each result. A partial pass is not a pass.

From `brand/tokens/`:

```bash
node scripts/build.mjs --verify
node scripts/check.mjs
npx --yes @google/design.md@0.4.0 lint ../DESIGN.md
node scripts/audit.mjs
node scripts/audit.mjs ../standards.html
```

| Check | Passes when |
|---|---|
| Nothing is stale | `--verify` exits 0 |
| The library is sound | `check.mjs` exits 0. Report its `lowest` pair and ratio |
| The standard is valid | The linter reads 0 errors and 0 warnings |
| No value is repeated, and no art holds live text | The scan of the markdown and of `assets/` finds nothing |
| The sheet shows only tokens | The scan of `standards.html` finds nothing, the logo's own colors included |
| The PDF has a page per board, with its fonts | The sheet script reported as many `"pages"` as `"boards"`, and `"fontsEmbedded": true` |
| The readme routes | Every path in `README.md` exists, and it names `tokens/fonts.css` where that file exists |
| Fonts travel with their license | Every font folder holds a license file, or `decisions.md → ## Open` names its absence |
| The folder stands alone | The agent-ready test below |

**The agent-ready test.** Where the harness can start a fresh agent, give it only the `brand/`
folder and this job: "Build one landing page section for this brand, as a single HTML file. Use
only what is in this folder. List everything you had to guess." It passes when every color, size,
font and radius in the section is a token, and it needed nothing from outside the folder. Run
`node scripts/audit.mjs <its file>` on what it made. Have it view its own page before it reports,
as `references/sheet.md → ## Viewing a page` describes, and say whether it looked at pixels or only
read its markup.

**A guess is a gap, not a note.** Each one names something the folder should have said. Close it
before the kit is done: a token, a line in `DESIGN.md` or its companions, or a line in `sheet.json`.
Only what the founder must decide and has not goes to `brand/decisions.md → ## Open`, with the
question that settles it. The test passes when its guesses are closed or open with a question,
never sitting there with neither.

Where no fresh agent can be started, say the test was not run. Do not run it yourself: you have
read too much to be a fair reader.

## Gotchas

- **The PDF is a deck: one 1920 by 1080 board to a page.** It presents and forwards well, and
  prints landscape.
- **A logo assigned to a ground by its file name can vanish.** A file named primary can be the
  light version, drawn for the dark ground, and set on the page half of it disappears. The sheet
  script warns when a color in a logo file sits within 1.5 to 1 of its ground. Open the file and
  see which part that color is. Lettering that matches its ground means the wrong version. A label
  inside a filled shape is fine.
- **A logo with live text renders in the wrong font.** Its `<text>` lettering falls back to a
  default serif in the sheet, the PDF and any tool without the face. The sheet script warns, and
  the scan of `assets/` fails, until the lettering is outlined.
- **A logo carries its own colors, and they may match no token.** The scan of the sheet reads the
  logo art too. A color it finds is either added to Brand as a fixed color, or the logo is the odd
  one out and the founder decides.
- **A render that passes every check can still read badly.** The checks prove the values are right.
  Only looking proves the page is.
- **An established brand's site is evidence, not a decision.** A value used once on a page may be a
  mistake. Count how often each value appears, and ask about the rare ones before they become
  tokens.
- **The Visual Identity page is the founder's record.** Rewriting it without showing them replaces
  their decisions with a summary they never read.

## When you are done

Show the map again, every part marked, then tell the user:

1. Where the folder is, and to start at `README.md`.
2. Each check and its result, the agent-ready test included, and anything that did not run.
3. What the agent-ready test had to guess.
4. What the sheet leaves out because the brand has nothing for it yet.
5. The Figma file's link and what its bind pass left unbound, or that the Figma scripts wait in
   `brand/tokens/figma-push/`.
6. The Visual Identity page: approved, or awaiting the founder with the proposal in
   `decisions.md → ## Open`.
7. What is open, from `decisions.md → ## Open`.
