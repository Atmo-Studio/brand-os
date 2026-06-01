# Visual Identity · BRND-7
*Brand Character · Page 2 of 2*

**Fills:** Logo variants table, Color system table, Typography system table, Imagery direction
**Frameworks:** Brand Identity System (Wheeler, 2017) → `brand-strategy/frameworks.md §14`; Design Token Hierarchy (Nathan Curtis, 2016) → `brand-strategy/frameworks.md §15`

---

## Failure Modes
- Treating this page as the design system — it's not. This page captures *principles and roles*; Figma is the production source of truth for specs, assets, and components. The page should make design decisions navigable, not replace the design file.
- Listing colors without roles — hex codes without usage guidance are decoration, not a system. Every color needs a job description.
- Describing imagery with vague adjectives — "modern, clean, authentic" is not a photography brief. Imagery direction needs to be specific enough that a photographer or stock searcher could make a selection based on it alone.
- Confusing what exists with what's decided — founders often have a logo and colors but haven't made intentional decisions about them. This page should surface whether the current visual identity is *deliberate* or *inherited*, and whether it still serves the brand.
- Over-engineering for a brand that isn't there yet — early-stage brands may have a logo and two colors. Don't force a full design system if the raw material isn't ready. Capture what exists, note what's missing, and frame it as something to build toward.

---

## Upstream Dependencies

This page connects directly to BRND-6 (Brand Personality). The visual identity should *express* the personality — a casual, warm brand looks different from a formal, authoritative one.

- From BRND-6: the personality spectrum positions and "we are / we are not" guardrails should inform visual choices. If the brand personality is "grounded and quiet confidence," the visual identity shouldn't be neon gradients and bold display type.

*If BRND-6 is incomplete, proceed — visual identity can be documented from existing materials. But flag during the gap check if the visual identity and personality feel misaligned.*

---

## Context Check

`AskUserQuestion`
> "Before we start — what visual assets do you currently have? Check all that apply."
- Logo and brand colors exist (even if informal)
- We have a Figma file or design system
- We have a brand guidelines doc with visual specs
- Starting from scratch — no established visual identity

*If they have existing assets: don't re-interview from zero. Read what they have, assess its completeness against the template structure (logo variants, color roles, type hierarchy, imagery direction), and focus the interview on gaps and decisions that haven't been made yet. Surface your read: "You have a logo and three colors, but there's no guidance on when to use each color or what your type hierarchy is. Let me focus on those gaps."*

*If starting from scratch: this page becomes a brief for future design work, not a documentation exercise. Frame it: "We're going to define the principles and roles your visual identity should fill — not design it right now. This becomes the brief a designer works from."*

---

## Interview Rounds

**Round 1 · Logo System**
*Extract: What logo variants exist (or should exist), and the usage rules for each.*

- Walk me through your logo. How many versions do you have — a primary, a reversed version for dark backgrounds, a standalone mark?
- When do you use each version? Are there situations where the full logo doesn't work — small sizes, social avatars, app icons?
- Are there any logo misuses you've seen — things people do with it that make you cringe? Stretching, wrong backgrounds, clashing contexts?

*Technique — the inventory before the rules:* Don't ask founders to articulate logo usage rules in the abstract. Start by asking what variants exist, then work backward: "You have a full logo and a mark. When would someone use the mark alone?" This produces practical rules, not theoretical ones.

*Advance when: you can fill the Logo table — variant name, when to use each. If only one version exists, note what's missing: "You have a primary logo but no reversed version or standalone mark. That's fine for now — note it as something to address when the visual system matures."*

**Round 2 · Color System**
*Extract: The colors in use, what role each plays, and any explicit restrictions.*

- What are your brand colors? Walk me through each one — not just the hex code, but what you use it for. Which one is your primary? Which ones are supporting?
- Do any of your colors have specific jobs — like one that's always used for calls to action, or one that's reserved for backgrounds?
- Are there any color combinations you avoid? Colors that clash with the brand or create the wrong association?

*Technique — the role audit:* Many founders have colors they "use" but haven't assigned roles. Walk through the template roles (Primary, Secondary, Accent, Neutral, Background) and ask: "Which of your colors fills this role? If none does, is that a gap you want to fill or a role you don't need?"

*Advance when: each color has a name, a hex value, a defined role, and a usage description. If there are gaps (e.g., no accent color, no defined neutral), note them explicitly rather than skipping them.*

**Round 3 · Typography**
*Extract: The type families in use, their roles, and any restrictions.*

- What fonts does your brand use? Walk me through the hierarchy — is there a display font for headlines, a different one for body text, a monospace or caption font?
- How did you choose these fonts? Was it a deliberate decision or an inherited default? Do they still feel right for where the brand is now?
- Are there any typography rules — things you never do? All-caps headlines, certain size combinations, font substitutions that are off-limits?

*Technique — the four-role test:* The template defines four type roles (Display, Heading, Body, Caption/Label). Most brands have 1–2 font families covering all four. Map what the founder describes to these roles: "It sounds like [Family A] handles display and headings, and [Family B] handles body and captions. Does that match how you think about it?"

*Advance when: each type role has a font family assigned (even if one family covers multiple roles), and there's at least one "don't" — a substitution or usage to avoid.*

**Round 4 · Imagery Direction**
*Extract: The visual world the brand inhabits — specific enough to guide a photo selection or illustration brief.*

- What does the visual world of your brand look like? If someone were choosing photos for your website — what are they looking for? Candid or staged? Bright or moody? People or abstract?
- What's the emotional quality the imagery should carry? Not "professional" — more specific. Warm? Energetic? Contemplative? Precise?
- What imagery should the brand absolutely avoid? Specific styles, subjects, or associations that would undermine the brand's character?

*Technique — the stock photo test:* Show the founder (or ask them to imagine) three different stock photos of the same subject. Ask: "Which one feels like your brand and why?" This surfaces aesthetic preferences faster than abstract questions about "visual direction." If working asynchronously, ask: "Find me one image that feels like your brand and one that doesn't — tell me why for each."

*Advance when: the imagery direction is specific enough to guide a search — "candid, natural light, focused on hands or process, warm tones, never stock-corporate or posed" is useful. "Modern and clean" is not.*

---

## Gap Check

Run all three internally. Surface the single strongest concern.

- [ ] Completeness test: are there obvious gaps in the visual system — missing logo variants, colors without roles, type roles without families? These aren't failures, but they should be explicitly noted as gaps to fill later rather than silently skipped.
- [ ] Personality alignment test: does the visual identity express the personality captured in BRND-6? If the personality is warm and casual but the visual identity is monochrome and geometric, either the personality description or the visual identity needs to shift.
- [ ] Actionability test: could a designer or content creator use this page to make a visual decision without asking for clarification? If the imagery direction is too vague or the color roles are ambiguous, it's not ready.

`AskUserQuestion`
> "Before we write this — [state the single strongest concern as a direct question, e.g., 'Your colors are documented but none of them have assigned roles — there's no guidance on which is for CTAs, which is for backgrounds, which is the accent. Want to assign roles now, or note it as a gap to address when you work with a designer?']"
- Looks solid — write it
- Let me revisit [element]

---

## Fill Targets

| Field | Notion section | Format |
|---|---|---|
| Logo | `# Logo` table | Table: Variant \| When to use. Rows: Primary, Reversed, Mark only (minimum). Each "when to use" is a specific context, not a generic restatement of the variant name. |
| Color | `# Color` table | Table: Role \| Name \| Hex \| Used for. Rows: Primary, Secondary, Accent, Neutral, Background (some may be empty — mark as "not yet defined"). Followed by `Color don'ts` field with specific combinations or uses to avoid. |
| Typography | `# Typography` table | Table: Role \| Family \| Used for. Rows: Display, Heading, Body, Caption/Label. One family can fill multiple roles. Followed by `Type don'ts` field with specific substitutions or uses to avoid. |
| Imagery | `# Imagery` | Three fields: Direction (2–3 sentences describing the visual world — specific enough for a photo search), Mood (the emotional quality — one precise phrase, not a list of adjectives), What to avoid (specific imagery types, styles, or associations to steer clear of). |

*Logo: "when to use" is contextual — "small-scale applications like favicons and social avatars" not "when needed."*
*Color: every color has a role. If a color exists without a defined role, surface it as a question, not a gap to skip.*
*Typography: map to the four-role hierarchy even if one family covers multiple roles. Don'ts are more useful than dos.*
*Imagery: fails the "modern and clean" test — if the direction could apply to any brand, it's not specific enough.*
