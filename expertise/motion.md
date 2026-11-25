# Motion

**Use when:** Deciding how a brand moves, setting durations and easing, or judging movement that
feels slow, abrupt or decorative. Read [brand-motifs.md](brand-motifs.md) for a movement used as a
motif, and [layout/adaptivity.md](layout/adaptivity.md) for what a layout has to survive when it
changes shape.

**Source:** field consensus, except the house positions on a three-band duration set and on exits
at about 70% of their entrance.

---

## What motion is for

Movement on a surface does one of four jobs. Movement doing none of them is decoration, and it
taxes every repeat visit.

| Job | What it tells the person |
|---|---|
| **Feedback** | The press, the hover or the toggle registered |
| **Orientation** | Where a thing came from and where it went |
| **Focus** | Which element matters now |
| **Expression** | Whose surface this is |

- **Expression rides on the first three.** A brand's character shows in how its feedback and its
  transitions move. A movement that exists only to express is the first one a returning visitor
  wants gone.
- **Frequency sets the budget.** A transition seen once can afford more than one seen fifty times a
  day.

## Duration

Most interface movement belongs between 100 and 500ms. Under 100ms reads as instant, and past
500ms a person starts waiting (Laubheimer, 2020).

| Band | Duration | Use for |
|---|---|---|
| **Feedback** | 100 to 200ms | A press, a hover, a toggle, a color change |
| **Component** | 250 to 400ms | A menu, a sheet, a toast, anything opening or closing |
| **Layout** | 450 to 600ms | A panel resizing, a view changing shape |

The bands follow Material's short, medium and long ranges (Google, n.d.-a).

- **Duration follows distance and size.** A small element moving a short way takes the low end of
  its band. A full-screen change takes the high end.
- **Exits run shorter than entrances.** Something leaving has already been read. Material sets
  exits faster than entrances (Google, n.d.-a). Set each exit at about 70% of its entrance.
- **Three bands, each with an exit, are enough for a brand.** Six durations cover every case above,
  and a seventh is usually a one-off that should have taken the nearest band.
- **A duration is a token.** A literal in a stylesheet is how a system ends with eleven speeds.

## Easing

Easing is where the character sits. Two surfaces with the same durations and different curves feel
like different brands.

- **Entrances decelerate.** The element arrives fast and settles, so the eye lands on it at rest.
- **Exits accelerate.** The element leaves and the eye is released.
- **Movement that starts and ends on screen eases both ways.**
- **Linear is for opacity, color and continuous rotation.** Applied to position it reads as
  mechanical.
- **A calm brand takes longer deceleration and no overshoot. An energetic one takes shorter
  durations and may overshoot.** Read `Brand Personality (Order 31)` for which, and name the
  personality axis the curve expresses.
- **Overshoot and bounce are spent once.** On every element they turn into a tic.

## What to animate

- **Animate `transform` and `opacity`.** The browser can move both without recalculating layout
  (Google, n.d.-b).
- **Animating width, height, top or left recalculates layout on every frame,** and the cost shows
  as stutter on the devices least able to hide it.
- **Each frame has 16.7ms at 60 frames a second.**
- **A group arrives in sequence, inside the layout band.** A stagger that outlasts the longest
  duration token makes the last item late.

## Reduced motion

- **`prefers-reduced-motion: reduce` replaces movement with a fade or an instant change** (World
  Wide Web Consortium, 2024). Position, scale and rotation stop. The state change still happens.
- **Feedback survives.** A control that gives no sign it was pressed has failed, whatever the
  setting.
- **Movement triggered by interaction can be turned off** unless it is essential to the function
  (World Wide Web Consortium, 2023, SC 2.3.3).
- **Anything moving on its own for more than five seconds can be paused** (World Wide Web
  Consortium, 2023, SC 2.2.2).
- **Every duration token carries its reduced value,** so the setting is honored in one place and
  never per component.

## Refuse

Category defaults, not prohibitions. Terms in `INDEX.md → ## How a discipline is shaped`. Bans are
marked.

- **Movement that does none of the four jobs.**
- **A duration outside 100 to 600ms** on an interface element.
- **An exit as long as its entrance.**
- **A duration or an easing written as a literal** where a token exists.
- **Linear easing on position or scale.**
- **Overshoot on more than one kind of element.**
- **Layout properties animated** where a transform would do.
- **A stagger that runs past the layout band.**
- **A surface that ignores a reduced-motion setting. A ban.**
- **Feedback removed under reduced motion.**
- **Movement on its own past five seconds with no way to pause it. A ban.** SC 2.2.2.

## Verify

- [ ] Every movement names its job: feedback, orientation, focus or expression.
- [ ] Every duration is a token, and each sits in its band.
- [ ] Each exit runs shorter than its entrance.
- [ ] Entrances decelerate, exits accelerate, and nothing but opacity, color or rotation is linear.
- [ ] The easing choice names the personality axis it expresses.
- [ ] Only `transform` and `opacity` animate, or the exception is recorded.
- [ ] Every frame holds 16.7ms on the slowest device the brand supports.
- [ ] Under reduced motion, position, scale and rotation stop and every state change still shows.
- [ ] Every duration token has a reduced value.
- [ ] Anything moving past five seconds can be paused.

---

## Sources

- Google. (n.d.-a). *Easing and duration*. Material Design 3.
  https://m3.material.io/styles/motion/easing-and-duration
- Google. (n.d.-b). *Animations and performance*. web.dev.
  https://web.dev/articles/animations-and-performance
- Laubheimer, P. (2020). *Executing UX animations: Duration and motion characteristics*. Nielsen
  Norman Group. https://www.nngroup.com/articles/animation-duration/
- World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
  https://www.w3.org/TR/WCAG22/
- World Wide Web Consortium. (2024). *Media queries level 5*.
  https://www.w3.org/TR/mediaqueries-5/
