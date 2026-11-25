---
version: alpha
name: "[Brand name]"
description: "[One or two sentences. What the system looks like, in the brand's own terms, and which theme this file holds.]"
omitted:
  - section: Components
    reason: "No component tokens in the frontmatter. The Components section sets the minimum every surface needs, in roles."
metadata:
  updated: [YYYY-MM-DD]
---
# [Brand name]

## Overview

[What the identity is meant to be, anchored on one specific reference: a real object, place or practice the brand resembles. Then how the brand behaves on a surface. Two or three short paragraphs. No adjectives standing alone.]

## Colors

[One sentence on how color works here as a whole.]

- **[Color's own name]** {colors.[role]} [is what, and does which one job]. [Its limit: where it never appears, or how much of a surface it may take.]

## Typography

[The families and what each is for. The scale: its base, named as `font-size-0`, its ratio and why.]

| Role | Token | Use |
|---|---|---|
| [Role] | {typography.[role]} | [The job this role does] |

[How emphasis works: what changes first, size, tone or weight.]

## Layout

[The base unit, named as `spacing-1`, how space separates ideas, and how a surface is divided. Name spacing tokens.]

| Measure | Token | Use |
|---|---|---|
| Page margin | {spacing.gutter} | [Fluid, from its smallest at `viewport-min` to its full size at `viewport-max`] |
| Section padding | {spacing.section} | [A section's own block padding, fluid the same way] |
| Content width | `container-content` | [The widest a section's content runs] |
| Reading measure | `container-prose` | [The widest a paragraph runs] |
| Panel padding | {spacing.[n]} | [Inside a card, a panel, a field group] |
| Column gap | {spacing.[n]} | [Between columns of a grid] |
| [The gap a motif or a recurring element keeps from the content] | {spacing.[n]} | [Where it applies] |
| Breakpoint | `breakpoint-[name]`, [its value in px] in a media query | [What the system does there, such as columns stacking to one. A media query cannot read a custom property, so the value is written out here once] |

[How the display size and the margins scale on a small screen. They are fluid tokens, so no page types a size per breakpoint.]

## Elevation & Depth

[How depth is shown: shadow, border or change of ground, and which wins when two could apply.]

## Shapes

[The shape language, and which radius each kind of element takes. Name rounded tokens.]

## Components

The minimum every surface needs, in roles. A brand's own components get their own files when it writes them.

- **Primary action:** {colors.action-bg} ground and {colors.action-text} text in {typography.[action role]}, {rounded.[step]}, padding {spacing.[n]} by {spacing.[n]}. Hover {colors.action-bg-hover}, pressed {colors.action-bg-pressed}, disabled {colors.action-bg-disabled} with {colors.action-text-disabled}. Its label today is "[from Messaging Pillars → Calls to action]".
- **Secondary action:** [its ground or outline, text and border roles, the same padding and radius]. Hover {colors.action-secondary-bg-hover}, pressed {colors.action-secondary-bg-pressed}.
- **One height for every action.** Where one action has a border, every action has one of the same width. On a filled action it takes the fill's color, at every state.
- **Text link:** {colors.[link role]}, [underlined or not, and what changes on hover].
- **Focus ring:** `stroke-focus` wide, `stroke-focus-offset` out from the element, in {colors.border-focus}, on every element that takes focus. [Its radius: the element's own plus the offset.]
- **Hover and press:** [which motion tokens they use, `motion-feedback-duration` on `motion-easing-linear` for a change of color, and what never moves].

## Do's and Don'ts

- **Do** [a move that makes work recognizably this brand's].
- **Don't** [a specific mistake this brand is prone to, stated so it can be seen in finished work].

## Motion

<!-- motion-tokens -->
<!-- /motion-tokens -->

[How the brand moves, in a sentence, and which band each kind of change takes. Read motion.md for the rest.]

## Imagery

[What images the brand uses, how they are treated and placed, and what it never shows.]
