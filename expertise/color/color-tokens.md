# Color tokens

**Use when:** Turning a brand's ramps into the tokens a codebase and a design tool consume, or
auditing a token set that already exists. Read [color-ramps.md](color-ramps.md) for the ramps these
tokens name, and [color-usage.md](color-usage.md) for the roles and the contrast floors.

**Source:** field consensus on keeping values apart from their use (Curtis, 2016). House positions:
the three layers and where each switches, the naming of Brand ramps, removing applied tokens
nothing uses, reserving `accent` for the brand color, and shipping every interactive state as its
own role.

Four words, used precisely throughout.

**Primitive:** a token that names a value: one step of one ramp.

**Meaning:** a token that names what a primitive is for this brand: one step of a semantic ramp,
such as `accent` or `neutral`.

**Role:** a token that names where a meaning is applied: the page ground, secondary text, a
focus ring.

**Layer:** a set of tokens that points only at the layer below it.

---

## Three layers: brand, meaning, application

"Options" are the full set of values a system could use, and "decisions" are the options applied to
a context (Curtis, 2016). A token library keeps them apart in three layers, each holding one kind of
token and switching one thing.

| Layer | Holds | Points at | Switches |
|---|---|---|---|
| **Brand** | Primitives: `color.tidewater.700` says what a color is | Nothing | Nothing |
| **Intent** | Meanings: `color.accent.700` says what it is for this brand | Brand | Sub-brand |
| **Patterns** | Roles: `color.text.secondary` says where it is applied | Intent | Theme |

- **Work references roles only.** A codebase that applies primitives directly has no place to theme
  or rebrand from. Adding the layers later means auditing every use to work out which one meant
  "the accent" and which one wanted blue.
- **Intent maps whole ramps, stop for stop.** `accent.50` to `accent.950` point at the eleven steps
  of one Brand ramp, so a sub-brand repoints a ramp in one place and every role follows.
- **A sub-brand changes Intent and touches nothing else.** Sub-brands of one house draw on the same
  Brand colors: a sub-brand's accent can be the parent's amber where the parent's is tidewater. A
  house of unrelated brands, with different primitives, needs a library per brand.
- **A theme changes Patterns and touches nothing else.** A dark theme points `bg.page` at
  `neutral.950` where light points it at `neutral.50`. Intent never inverts, so a step number always
  means lightness.
- **A component token exists only where a component diverges from the roles.** It is a Patterns
  token. One such token is a documented exception. Twenty mean Patterns is missing roles.

## The role inventory

The inventory is a menu, not a requirement. Choose roles from it so two roles never do one job and
no job goes without one, then keep only the roles the brand's materials use. A role written because
the list has it, and never used, is removed once the materials exist.

| Group | Roles |
|---|---|
| **Background** | Page, surface, raised, sunken, inverse, overlay scrim |
| **Text** | Primary, secondary, disabled, inverse, on-accent |
| **Border** | Subtle, default, strong, separator, focus ring |
| **Accent** | Subtle background, border, solid, solid hover, solid pressed, text |
| **Action** | Background at rest, hover, pressed and disabled, and the text on each |
| **Status, for each state shipped** | Subtle background, border, solid, text |

- **Separator and border stay separate roles** even where they share a value. They diverge the
  first time someone restyles inputs.
- **Every interactive state is its own role.** A hover with no role gets a ramp step chosen on the
  spot, and that step is never measured against the ground it paints on. Read
  [color-usage.md](color-usage.md) for the floor each state has to clear.
- **A role absent from one theme is a defect in that theme.** Every theme carries the same roles,
  and every sub-brand the same meanings.

## Naming

Roles follow one grammar, never departed from: `color.{group}.{variant}.{state}`.

- **Name a Brand ramp for what it is.** A color the brand specifies and names takes its brand name
  (`tidewater`), in place of the plain hue it would otherwise be. Every other ramp takes a
  Tailwind-style hue: `stone`, `zinc`, `slate` or `gray` for a neutral by its tint, `red`, `amber`,
  `green` and the rest for hues. The brand's own name goes in the description either way.
- **Name an Intent ramp for what it means:** `accent`, `neutral`, `error`, `success`, `warning`,
  `info`. No Brand ramp takes one of these names; published names drop the layer, so the two would
  collide.

- **One word per concept.** `text`, never `fg`, `foreground`, `content` or `ink`. `bg`, never
  `background` or `fill`. `border`, never `stroke`, `outline` or `line`.
- **Reserve `accent` for the brand color.** `color.text.primary` beside `color.primary` makes every
  `primary` ambiguous until its definition is opened. `primary` means the most prominent of its
  group.
- **Name the job, never the look.** Each of these fails for a nameable reason:

| Name | What breaks |
|---|---|
| `color.blue-button` | Appearance in a role. A rebrand makes the name false |
| `color.sidebar-gray` | Named for its first use. The second use has no name |
| `color.light-gray` | The name lies in the dark theme |
| `color.text.2` | A number says nothing about the job |
| `color.gray.hover` | A hue and a state in one name. The state belongs to a role |

- **Ramp steps follow the `50` to `950` convention** in [color-ramps.md](color-ramps.md).
- **Token names take no dots, braces or leading `$`.** The Design Tokens format reserves all three
  (Design Tokens Community Group, 2025).

## What a color token may hold

- **A token carrying text holds a solid value.** A value with alpha has no fixed contrast ratio,
  because what it renders depends on what sits behind it.
- **An alpha token records what it is composited over.** A scrim or a hover overlay is checked as
  the color it produces on that ground.
- **Computed colors stay out of the token layers.** `color-mix()`, relative color syntax and
  `light-dark()` resolve at render time. Their output cannot be measured ahead of time or inspected
  in a design tool.
- **Store the value in the space it was built in, with a hex beside it.** The Design Tokens color
  type holds a color space, its components and an optional hex fallback (Design Tokens Community
  Group, 2025). Read [color-spaces.md](color-spaces.md) for choosing the space.

## Framework exposure

- **In Tailwind v4, every name declared in `@theme` becomes a utility** (Tailwind Labs, n.d.). Where
  primitives and roles are declared in one block, both are reachable from markup, and the layering
  holds by convention only.
- **Expose roles, and reset the namespace first.** Setting `--color-*: initial` before the brand's
  declarations removes the framework's default palette, so a utility the brand never defined stops
  resolving and cannot render a stock color.
- **A stock step name carrying a brand value is a trap.** A snippet pasted from documentation
  renders in the wrong value and nothing reports it.

## Auditing a palette that exists

An audit is reported before anything changes. Consolidating a palette changes rendered output on
screens nobody asked to have touched.

- **The audit covers every literal,** including SVG fills, chart configurations and email
  templates.
- **Near-duplicates are values closer than about one ramp step** once sorted by perceived lightness
  inside a hue family.
- **A duplicate collapses to the most-used value,** never to an average, which is a color nobody
  chose.
- **Every survivor takes a role** from the inventory, and a literal with no role is listed as one.

## Refuse

Category defaults, not prohibitions. Terms in `../INDEX.md → ## How a discipline is shaped`.
Bans are marked.

- **A primitive or a meaning applied directly to work.**
- **A layer pointing past the one below it,** such as a role pointing at a Brand ramp. A sub-brand
  can no longer repoint it.
- **A Brand ramp named for its meaning,** such as `neutral` or `accent`.
- **A role nothing uses, once the materials exist.**
- **Roles grown from components** with no inventory behind them.
- **An interactive state with no role of its own.**
- **A role present in one theme and missing from another.**
- **Two words for one concept** in the same token set.
- **`primary` naming the brand color** in a set that also ranks text or actions.
- **A role named for its appearance, its first use or a number.**
- **A value with alpha behind text. A ban.** Its contrast cannot be stated.
- **A computed color stored as a token.**
- **A framework's stock step name carrying the brand's value.**
- **A palette consolidated before its audit was reported.**

## Verify

- [ ] Every color in the work resolves to a role, every role to a meaning, every meaning to a
      primitive.
- [ ] Every role is used by the brand's materials, and every Intent ramp by a role.
- [ ] Every sub-brand carries the same Intent names.
- [ ] Rest, hover, pressed and disabled each have a role wherever the brand ships an action.
- [ ] Every theme carries the same list of roles.
- [ ] Each concept has one word across the whole set.
- [ ] No role name contains a hue, a lightness word or a bare number.
- [ ] Every token behind text holds a solid value.
- [ ] Every alpha token records the ground it is composited over.
- [ ] A framework mapping exposes roles and resets the namespaces it redefines.
- [ ] An audit lists the literals found, the duplicates collapsed and the literals left without a
      role.

---

## Sources

- Curtis, N. (2016). *Tokens in design systems*. EightShapes.
  https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421
- Design Tokens Community Group. (2025). *Design Tokens Format Module 2025.10*.
  https://www.designtokens.org/tr/2025.10/format/
- Tailwind Labs. (n.d.). *Theme variables*. Tailwind CSS. https://tailwindcss.com/docs/theme
