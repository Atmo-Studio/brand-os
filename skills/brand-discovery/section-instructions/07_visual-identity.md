# Visual Identity: BRND-7
*Brand Character, dimension 2 of 2*

**Fills:** Lifecycle Phase, Concept, Personality → Visual Bridge, Decided Constraints, Signature Device, System Logic, Consolidated Guardrails, Direction Forks, Assets
**Frameworks:** Brand Identity System (Wheeler, 2017) → `frameworks.md §14`; Design Token Hierarchy (Nathan Curtis, 2016) → `frameworks.md §15`

---

## Lifecycle Phase

BRND-7 is the *first step* toward a complete visual identity, not the identity itself. The page carries a phase marker so everyone (founder, designer, agent) knows what they're reading:

- **`brief`** — the identity hasn't been designed yet. The page is a constraint spec that feeds an identity brief. This is where a first interview lands.
- **`developed`** — design rounds have produced an approved concept. The page's open forks are resolved; constraints reflect the chosen direction.
- **`delivered`** — the identity shipped (logo, palette, type, assets exist as decided artifacts). The page is the high-level entry point; specs live in the design file and the `brand/` library.

**Set the phase at the top of the page on every write.** On a fresh interview, it's `brief`.

**Re-run path:** if the page is `brief` or `developed` but the founder says the identity has since been designed or delivered ("we got our branding done," "the logo's finished"), don't re-run the interview from zero. Say: *"Since your identity has been designed, let's update this page."* Then: confirm which open forks were resolved and how, convert the winning decisions into decided constraints, refresh the guardrails against the delivered identity, and advance the phase marker. Without this, the page silently goes stale the moment real design work happens.

### What each section holds at each phase

**The section set never changes.** Heading skeletons are read-only, so every heading any phase will ever need ships at `brief` and stays there, empty if it has nothing yet. What changes across phases is what each section *holds*, not which sections exist.

| Section | `brief` | `developed` | `delivered` |
|---|---|---|---|
| Source of Truth | Empty: no design file exists yet | Links the working design file | Links the design file and the `brand/` library; the page becomes the entry point and the specs live there |
| Concept | The bet, stated as a hypothesis | The concept as approved: the chosen direction named, and what it turned out to be | Unchanged from `developed` |
| Personality → Visual Bridge | Drafted implications the founder reacted to | Refined where design proved an implication wrong | Stable |
| Decided Constraints | Only what the founder actually decided; the rest marked open | Grows as resolved forks convert into decided constraints | Complete: anchors named here, specs in the design file |
| Signature Device | A candidate, labeled as one | Realized, rejected, or replaced: say which, and why | The device as shipped |
| System Logic | Mixed `decided` / `proposed` | Mostly `decided`; development resolves the proposals | `decided`; behavior here, detail in the design file |
| Guardrails | Brand-level hard don'ts + element-level don'ts | Refreshed against the approved concept; most survive unchanged | Refreshed against the shipped identity, the longest-lived content on the page |
| Direction Forks | One or two genuinely open either/ors | Each fork rewritten as its resolution: which direction won, and why | Historical record: never delete it; this is the provenance a later designer needs to understand why the identity is what it is |
| Assets | Pre-existing material, each marked deliberate or inherited; empty for a from-scratch brand | Adds what design development produced | The asset manifest: what exists, and where it lives |

**Three headings are deliberately phase-neutral.** `Concept` (not "Concept Hypothesis"), `Direction Forks` (not "Open Forks"), and `Assets` (not "Existing Assets") are named for what they hold across all three phases rather than for their `brief`-phase state. A heading that asserts a stage goes stale the moment the stage advances, and because it can't be renamed afterward the page would spend most of its life lying about its own contents.

**Never delete a section, including on a from-scratch brand.** Leave it empty. A brand with no pre-existing assets still reaches `delivered`, and a deleted heading can't be restored by any skill.

---

## Failure Modes
- Documenting what exists instead of capturing what's *decided*: the core trap. BRND-7 is an **artifact of decisions** that feeds the identity brief, not an inventory of current assets and not a design system. If the founder has a logo and two colors but hasn't made intentional decisions about them, that's an open fork, not a filled-in constraint. Surface whether each element is *deliberate* or *inherited*, and leave specs (hex, scale, tokens, components) to the design file and later the `brand/` library.
- Constraints that don't constrain: "modern, clean, authentic" bounds nothing. A real constraint rules things out: "illustration-led, never photographic; the mark must hold on a busy background." If a line could apply to any brand, it isn't a constraint yet.
- Soft don'ts: a don't that names a category but not the trap is weak. "Don't be corporate" barely steers; "must not read as the nearest competitor's palette," "should feel like it belongs on a specialist's shelf, not in a generic app store" are hard don'ts that actually direct a generator or designer.
- Over-engineering for a brand that isn't there yet: early-stage brands may have only an anchor color and a reference or two. Capture the real decisions, name the rest as open forks, and don't manufacture a full constraint set from thin material.
- Parts with no rules between them: a color, a face, and a device sitting side by side, with nothing said about what happens when they meet. Wheeler's point is that the system quality lives in how the elements behave together (`frameworks.md §14`), and that behavior is what a designer receiving this page has to invent from scratch if it isn't written down. The System Logic block is the fix: draft it even when the founder has no opinion, and mark it `proposed`.

---

## Upstream Dependencies

This dimension connects directly to BRND-6 (Brand Personality). The visual identity should *express* the personality: a casual, warm brand looks different from a formal, authoritative one.

- From BRND-6: the personality spectrum positions and "we are / we are not" guardrails should inform the decided constraints and the hard don'ts. If the brand personality is "grounded and quiet confidence," the constraints shouldn't point at neon gradients and bold display type.
- The **open forks** are seeded by BRND-6's most tension-loaded axis when it's present (often something like restraint ↔ warmth, or heritage ↔ modern). When BRND-6 is absent, infer the tension from BRND-4 + call notes and write it down for confirmation: do not edit BRND-6.

*If BRND-6 is incomplete, proceed — the constraint spec can be built from existing materials and the founder's stated preferences. But flag during the gap check if the constraints and personality feel misaligned.*

---

## Context Check

`AskUserQuestion`
> "What visual assets and decisions do you already have? Check all that apply."
- Logo and brand colors exist (even if informal)
- We have a Figma file or design system
- We have a brand guidelines doc with visual specs
- Starting from scratch, no established visual identity

*If they have existing assets: don't re-interview from zero, but don't confuse having assets with having decided. Read what they have, then separate the deliberate decisions from the inherited defaults: "You have a logo and three colors. Were those chosen for this brand, or inherited? Which ones are you committed to?" What's committed becomes a constraint; what's unexamined becomes an open fork.*

*If starting from scratch: this page becomes the constraint spec that feeds the brief, not a documentation exercise. Frame it: "We're locking the decisions you've made and naming the ones still open. That becomes the brief a designer or an agent works from. The design itself happens later."*

---

## Interview Rounds

**Round 0: Personality → Visual Bridge**
*Extract: each BRND-6 axis position translated into a visual implication — the machinery that makes "the identity should express the personality" real instead of aspirational.*

If BRND-6 is `Complete`, do this before asking anything: take each spectrum position and its "never go past" marker and draft a one-line visual implication across five levers: **contrast level, color temperature, density, type voice, composition energy**. Example: "quiet confidence, never past understated" → *high whitespace, restrained contrast, one accent used as punctuation, no display-type shouting.* Present the drafted bridge as a short table and ask the founder to react: confirm, adjust, or flag the axis that doesn't translate cleanly (that axis is usually the open fork).

If BRND-6 is skipped or incomplete: do not improvise silently. Infer the personality read from BRND-4, uploaded materials, and call notes, then **write the inference down and have the founder confirm it** before proceeding. The bridge must exist on the page either way; an unconfirmed inference is exactly the kind of invisible assumption that derails design rounds later. Do not edit BRND-6.

*Advance when: every axis (or the confirmed inference) has a visual implication the founder has reacted to, and the most tension-loaded axis is identified — it seeds the open forks in Round 6's territory.*

**Round 1: Logo & Identity Approach**
*Extract: the identity-approach decision — photography-driven vs. illustration vs. wordmark-led, and whether the logo must work overlaid on imagery — plus what logo material exists or is deliberately deferred.*

- Walk me through your logo. How many versions do you have: a primary, a reversed version for dark backgrounds, a standalone mark?
- When do you use each version? Are there situations where the full logo doesn't work? Small sizes, social avatars, app icons.
- Are there logo misuses that make you cringe? Stretching, wrong backgrounds, clashing contexts.

*Technique, the inventory before the rules:* Don't ask founders to articulate logo usage rules in the abstract. Start by asking what variants exist, then work backward: "You have a full logo and a mark. When would someone use the mark alone?" This produces practical rules, not theoretical ones.

*Advance when: you can state the identity approach as a decision ("wordmark-led; the logo must hold on a busy background; a distinctive mark deferred to a pro") — or name it as an open fork. Capture any logo misuses as guardrails. Logo specifics beyond the approach are not this page's job.*

**Round 2: Color Direction**
*Extract: the color-direction decision — the anchor color(s) and the rule that governs them — plus any hard color don'ts. Not a full role'd palette.*

- What are your brand colors? Walk me through each one: the hex, and the job it does. Which one is your primary? Which ones are supporting?
- Do any of your colors have a fixed job? One that always carries the call to action, one reserved for backgrounds.
- Are there any color combinations you avoid? Colors that clash with the brand or create the wrong association?

*Technique, the role audit:* Many founders have colors they "use" but haven't assigned roles. Walk through the template roles (Primary, Secondary, Accent, Neutral, Background) and ask: "Which of your colors fills this role? If none does, is that a gap you want to fill or a role you don't need?" But capture the *direction*, not the finished palette.

*Advance when: you have an anchor color and its governing rule ("one saturated accent, used sparingly, never tinted toward pastel"), plus any hard color don'ts. A full role'd palette with value scales is the design file's job — this page states the direction.*

**Round 3: Typography**
*Extract: any typographic decision or restriction actually made — a personality direction for type, a locked face, a hard "never." Most early brands haven't decided type; that's fine — capture the direction and note it open.*

- What fonts does your brand use? Walk me through the hierarchy: a display font for headlines, a different one for body text, a monospace or caption font?
- How did you choose these fonts? Was it a deliberate decision or an inherited default? Do they still feel right for where the brand is now?
- Are there typography rules you never break? All-caps headlines, certain size combinations, font substitutions that are off-limits.

*Technique, the four-role test:* The template defines four type roles (Display, Heading, Body, Caption/Label). Most brands have 1–2 font families covering all four. Map what the founder describes to these roles: "It sounds like [Family A] handles display and headings, and [Family B] handles body and captions. Does that match how you think about it?"

*Advance when: you have at least the type *direction* (the personality the type should express) or a locked decision, plus any type don't — or you've explicitly named type as an open fork. Don't force a full type system onto a brand that hasn't chosen one.*

**Round 4: Asset Base & Imagery Direction**
*Extract: the asset-base decision (the visual raw material the brand builds on — e.g., a founder's photo archive, an existing illustration set, or licensed stock) and an imagery direction specific enough to guide a selection.*

- What does the visual world of your brand look like? If someone were choosing photos for your website, what are they looking for? Candid or staged? Bright or moody? People or abstract?
- What's the emotional quality the imagery should carry? Push past "professional." Warm? Energetic? Contemplative? Precise?
- What imagery should the brand absolutely avoid? Specific styles, subjects, or associations that would undermine the brand's character?

*Technique, the stock photo test:* Show the founder (or ask them to imagine) three different stock photos of the same subject. Ask: "Which one feels like your brand and why?" This surfaces aesthetic preferences faster than abstract questions about "visual direction." If working asynchronously, ask: "Find me one image that feels like your brand and one that doesn't. Tell me why for each."

*Advance when: you can name the asset base and an imagery direction that rules things in and out — "candid, natural light, focused on hands or process, warm tones, never stock-corporate or posed" is useful; "modern and clean" is not. Capture imagery-to-avoid as guardrails.*

**Round 5: Signature Device**
*Extract: the one distinctive visual device the brand could own — a hypothesis, not a finished mark. A recurring crop, a signal color used as punctuation, a stamp or seal, a distinctive grid behavior, a repeated motif. Something a generator or designer can realize and the brand can be recognized by.*

- Is there one visual move you keep coming back to? Something people would recognize before they read the name. A mark, a color behavior, a way of cropping, a recurring motif.
- Think of the brands you admire. What's the one device that makes each of them instantly theirs? A signal color, the way they frame scale, a specific crop. What's the equivalent instinct for yours?
- If you had to bet on a single signature element for the next six months, what would it be? And what would it never be?

*Technique, steal from the references:* Founders name a signature device faster by pointing at someone else's than by inventing their own. Anchor on their reference brands (that's why this round follows imagery): "That brand has one unmistakable move people recognize on sight. What's yours?" Capture it as a hypothesis to test in generation, explicitly labeled as not-yet-final.

*Technique, sources, not just names:* A named brand triangulates a target; it doesn't specify one. For each reference, get the takeaway (palette, type, a specific move) and a reachable source where one exists. If a visual-reference MCP is connected (Mobbin or similar), pull comparable examples and react to them live. If not, don't send the founder to install one: a name plus a stated takeaway is enough here.

*Advance when: you have a one-line signature-device hypothesis specific enough to attempt — "one accent element used as scarce punctuation against a restrained field; scarcity is the point" — or an honest "none yet, generate options." Never force a device the founder doesn't feel.*

**Round 6: Hard Don'ts**
*Extract: the brand-identity-level "what this is NOT" — the category traps and adjacencies the identity must avoid, above the element-level don'ts already gathered in Rounds 1–4.*

- When you picture this brand going wrong, what does it look like? What adjacent category or competitor would make you cringe to be mistaken for?
- Are there whole aesthetics that are off the table? "Looks like a tech startup," "reads as a wellness brand," "feels like private equity." Name the ones that are non-negotiable.
- Here's the shelf test: where should this feel at home, and where would it feel wrong? A specialist's shelf, a trade show, a phone home screen.

*Technique, the mistaken-identity test:* Don'ts land hardest as concrete mis-reads, not abstract adjectives. Push past "not corporate" to the specific brand or category the founder fears being confused with. "Not soft" → "not approachable in a generic wellness sense." "Not tech" → "nothing that reads as a SaaS dashboard; it should feel like a physical product, not an app." These specific exclusions are what most sharpen a generator.

*Advance when: you have 3–6 hard don'ts stated as concrete mis-reads or category exclusions, each specific enough to rule out real design choices. Combined with the element-level don'ts from Rounds 1–4, these compose the consolidated guardrails block.*

**Synthesis, Concept Hypothesis & System Logic**
*Draft both, then have the founder react. Neither is an interview answer — asking a founder to specify a system cold produces nothing usable. The material is already on the table by now; the agent's job is to write the relationships down.*

**The concept hypothesis** — 2–3 sentences naming the visual idea as a bet, in the register of "one bright mark against everything else." Built from the constraints just locked, grounded in BRND-6 language.

**The system logic** — three lines that turn the collected parts into a system. Rounds 1–5 produce element-level decisions: a color and its rule, a type direction, an identity approach, a device. What they don't produce is what happens when those elements share a surface, and that gap is where a designer loses a round. Three lines close it:

- **Hierarchy** — what leads and what recedes when the elements meet. Which one carries recognition, which ones support it, and whether that changes with scale. *("The mark leads at small sizes. At poster scale the type leads and the mark drops to a signature in the corner.")*
- **Recurrence** — the move that repeats on every application, so a business card and a landing page read as the same brand. Usually the signature device given a placement rule. *("Every surface opens with the accent rule along the top edge, whatever else is on it.")*
- **Proportion** — the ratio governing how much of the loud element appears against the quiet field. *("Roughly 90/10: restrained field, accent as punctuation. If the accent is doing more than a tenth of the work, it's off-system.")*

Draw each line from what's already decided rather than inventing: hierarchy follows the identity approach and the type direction, recurrence follows the signature device, proportion follows the color rule and the composition energy from Round 0's bridge.

Present the hypothesis and the three lines as one short block and ask the founder to react. If they have no opinion, keep what you drafted and mark that line **proposed** on the page. A proposed system reads as a starting point a designer can argue with; a missing one costs them a round of guessing. Never mark a line decided without the founder's confirmation: same stage discipline the signature device runs on.

*Advance when: the concept hypothesis exists as one short paragraph, and hierarchy, recurrence, and proportion each have a line the founder has seen, each marked `decided` or `proposed`.*

**On a brand space scaffolded before System Logic existed**, the 32 page has no `## System Logic` heading, and heading skeletons are read-only: you may not add it yourself. Say so in one line and let the user decide: *"This block is new. Your Visual Identity page doesn't have a System Logic section yet. Want to add the heading so I can write it there, or should I hold these three lines in the handover for now?"* If they decline, keep the lines in the session handover rather than forcing them under another heading. Never reshape the page on your own judgment.

---

## Gap Check

Run all seven internally. Surface the single strongest concern.

- [ ] Decidedness test: does each constraint reflect a real decision the founder made, or an inherited default dressed as a decision? Inherited-but-unexamined items should be surfaced as open forks, not locked constraints.
- [ ] Constraint-strength test: is each constraint specific enough to rule something out? A constraint that excludes nothing isn't a constraint. Run the "modern and clean" test on every line.
- [ ] Personality-alignment test: do the constraints express the personality captured in BRND-6? If the personality is warm and casual but the constraints point monochrome and geometric, one of them needs to shift.
- [ ] Fork-honesty test: are the open forks genuinely open (a real tension the brief will resolve into two directions), and are there no more than one or two? A page that's all forks made no decisions; a page with zero forks probably over-claimed.
- [ ] Actionability test: could a designer or the agentic generator pick this page up and produce a strong brief (make real visual decisions) without coming back for clarification? If the constraints are too vague, the guardrails too soft, or the forks fuzzy, it's not ready.
- [ ] System test: do hierarchy, recurrence, and proportion each have a line, and does each carry its stage (`decided` or `proposed`)? A page of element constraints with no relationships between them hands the designer a set of parts and asks them to invent the system. Check the lines agree with each other and with the constraints above them: a proportion rule of "accent as punctuation" contradicts a hierarchy where the accent leads.
- [ ] Token-readiness test: every color the page mentions carries a hex (the founder's "our blue" becomes a specific `#RRGGBB` — ask for it, or pull it from their site/assets and confirm); every type direction names a family, or at minimum a genre + case + weight intent ("grotesque sans, all-caps labels, medium weight"). "Warm and modern" fails. This is the minimum specificity a generator can act on: full scales and token systems stay in the design file, but named values must be pinned here.
- [ ] Reference-specificity test: does each reference say what to take from it? "Like Brand X" tells a generator nothing; "Brand X's accent discipline: one hot color, never a field" tells it everything.

`AskUserQuestion`
> "Before we lock this: [state the single strongest concern as a direct question, e.g., 'Your anchor color is decided. Whether the identity runs minimal-and-restrained or warm-and-textured is still open. That's the fork the brief will split into two directions. Do you already know which way you lean, or should we lock it as open?']"
- Looks solid: lock it
- Let me revisit [element]

---

## Fill Targets

This page fills one artifact of decisions across four sections. The content is decisions and constraints, not spec tables: a decision with its governing rule, never a value scale. Under **Decided Constraints**, fill each field below the founder has actually decided (one bullet each); omit or mark "open" the rest. That block maps 1:1 to the identity brief's "Constraints (Decided)."

| Field | Heading | Format |
|---|---|---|
| Lifecycle Phase | Top of page | One line: `Phase: brief` (or `developed` / `delivered`) + date last advanced. |
| Concept | `## Concept` | 2–3 sentences naming the visual idea in the register of "one bright mark against everything else." Grounded in BRND-6 personality language: a bet, not a mood. Drafted in Synthesis, after the constraints are locked: it's the synthesis, not an interview answer. |
| Personality → Visual Bridge | `## Personality → Visual Bridge` | One line per BRND-6 axis (or per confirmed inference if BRND-6 was skipped): axis position → implication across contrast, color temperature, density, type voice, composition energy. From Round 0. |
| Color direction | `## Decided Constraints` | Anchor color(s) **with hex** + the rule that governs them: e.g., "one saturated accent (specific hex), used sparingly, never tinted toward pastel." |
| Identity approach | `## Decided Constraints` | Photography- / illustration- / wordmark-led; whether the logo must hold on a busy background. |
| Asset base | `## Decided Constraints` | The visual raw material the brand builds from. |
| Tone words | `## Decided Constraints` | 2–4 precise words: specific, not "professional." |
| Reference brands | `## Decided Constraints` | Named brands with what to take from each: palette, type, a specific move. Add a reachable source (URL, product, campaign) where one exists; it's what lets a later phase extract specs instead of guessing. |
| Guiding principle *(optional)* | `## Decided Constraints` | Any overarching rule the identity obeys. |
| Signature Device | `## Signature Device` | One line naming the device the brand could own, flagged as a hypothesis for generation/design to realize, or "none yet, generate options." Seeds the signature device the `visual-identity` phase builds. |
| System Logic | `## System Logic` | Three lines, each tagged `decided` or `proposed`: **hierarchy** (what leads and what recedes when the elements meet), **recurrence** (the move that repeats across every application), **proportion** (the ratio governing loud against quiet). From Synthesis. This is the block that makes the page a system instead of a parts list: it's aimed at the designer or agent receiving the brief, not at the founder. |
| Consolidated Guardrails | `## Guardrails` | Every "don't" in one block, each a concrete exclusion (not an adjective): brand-level hard don'ts (Round 6) + element-level don'ts from Rounds 1–4 (logo misuses, color combos to avoid, type substitutions, imagery to steer clear of). Seeds the generation guardrails the `visual-identity` phase enforces. |
| Direction Forks | `## Direction Forks` | At `brief`, the one or two genuinely unresolved tensions the brief resolves into two named directions (e.g., restraint ↔ warmth). Each a real either/or, not a to-do. If BRND-6 is present, read the fork from its most tension-loaded axis (surfaced in Round 0); if absent, infer from references + call notes and write it down for confirmation: do not edit BRND-6. |
| Assets | `## Assets` | At `brief`, a short inventory of pre-existing material: what exists, where it lives, and, per item, **deliberate or inherited** (from the Context Check separation). Leave the section empty for a from-scratch brand; never delete the heading. At `delivered` this becomes the asset manifest. |

*Decided vs. open is the core discipline — a decision reads as locked; anything unexamined is a fork. Never dress an inherited default as a decision.*
*Constraints must rule things out. If a line could apply to any brand, it isn't a constraint yet.*
*Don'ts are concrete mis-reads, not adjectives — "must not read as the category's default blue," not "don't be generic."*
*System Logic states behavior, not spec. "The mark leads at small sizes" belongs here; the size at which it switches belongs in the design file.*
*This page is high-level by design. Named anchor values (hexes, families) are pinned here per the token-readiness rule — but value scales, token sets, and components live in the design file and later the `brand/` library. BRND-7 points at them; it doesn't hold them.*

---

## Exit Actions

After the page is written and marked `Complete`, surface the next move: one line, before the section handover fires. Which exit applies depends on the phase:

**Phase `brief` → offer the identity brief.**
> "Your visual identity page is a working constraint spec now. When you're ready to develop the identity, I can compile it into a full creative brief: two named directions built from your open fork, ready for a designer or an AI design round. Say 'generate the identity brief' whenever you want it."

If the user asks for it (now or any later session), compile from the dimension: input assessment (which BRND dimensions exist, what was inferred) → constraints (decided) → brand foundation digest synthesized from BRND-1–5 → the concept hypothesis, expanded → the system logic (hierarchy, recurrence, proportion, each at its stage) → **two named directions** (each: positioning line, visual personality, how it interprets the constraints, what it unlocks) → comparison & decision frame → gaps for creative development. The two-directions structure is what converts the open forks into a real choice instead of a mood soup. Write it as a document to the user's workspace (or Documents database if connected).

**Phase `developed` or `delivered` → point at the library.**
> "The identity exists now. The next step is a `brand/` library (DESIGN.md + tokens + asset manifest) that any agent or codebase can generate from. That's a Brand OS module on the roadmap. For now, keep this page as the entry point and link your design file from it."

Do not attempt to generate the `brand/` library from this skill: it's a delivery-phase artifact with its own contract, not an interview output.
