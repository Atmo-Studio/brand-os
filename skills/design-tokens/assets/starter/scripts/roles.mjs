#!/usr/bin/env node
// Writes two layers. Intent, for one sub-brand: the semantic ramps (accent, neutral, and one per
// state shipped), each pointing stop for stop at a Brand ramp. Patterns, for one theme: every role
// in the inventory, each an alias to an Intent step. The step map is a starting point. Run the check
// afterward and move any role whose pair fails. Once the brand's materials exist, the audit lists
// any role nothing uses, and it comes out.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, EXT } from './lib/tokens.mjs';

const HELP = `Usage: node scripts/roles.mjs --neutral <ramp> --accent <ramp> [options]

Writes src/intent.<brand>.tokens.json and src/patterns.light.tokens.json, or
src/patterns.dark.tokens.json with --dark, and adds any missing pair to src/pairs.json. Existing
type, motion, elevation and logo roles are kept.

Options:
  --neutral RAMP       The neutral ramp's name in brand.color. Required
  --accent RAMP        The brand color's ramp. Required
  --action RAMP        The ramp primary actions fill with. Default: the accent
  --status LIST        States to ship, as state=ramp pairs: positive=green,negative=red
  --action-on LIST     Every ground an action sits on: page,inverse,surface. Default: page.
                       Each state is measured against each ground listed, and the check fails a
                       hover or pressed fill that matches one of them
  --brand NAME         The sub-brand whose Intent this writes: src/intent.NAME.tokens.json.
                       Default: the resolver's default sub-brand. A second sub-brand joins the
                       resolver, and picks its own ramps from the same Brand colors
  --dark               Write the dark theme. Short for --theme dark --ground dark
  --theme NAME         Write a named theme: src/patterns.NAME.tokens.json. Use it for a ground that
                       is not a color-scheme theme, such as a dark section on a light site. Apply
                       it in markup with data-theme="NAME"
  --ground light|dark  Whether a named theme sits on a light or a dark ground. Default: light
  --paper NAME         A fixed color in brand.color to use as the page and as text on dark fills
  --ink NAME           A fixed color in brand.color to use as primary text
  --force              Replace color roles that already exist. Default: stop. The starter's own
                       placeholder roles are replaced without it, and the color proportion is kept
  --help               Show this text

Example:
  node scripts/roles.mjs --neutral stone --accent tidewater --status negative=red,positive=green

Exit codes: 0 written, 1 roles exist and --force was not given, 2 bad arguments.`;

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
if (flag('help') || !args.length) { console.log(HELP); process.exit(0); }
const core = JSON.parse(readFileSync(resolve(ROOT, 'src/brand.tokens.json'), 'utf8')).brand;
const ramps = Object.keys(core.color ?? {}).filter((k) => !k.startsWith('$') && !('$value' in core.color[k]));
const need = (n) => {
  const v = opt(n);
  if (!v || !ramps.includes(v)) { console.error(`Error: --${n} must name a ramp in brand.color. Available: ${ramps.join(', ') || 'none'}. Received: ${v}`); process.exit(2); }
  return v;
};
const N = need('neutral');
const A = need('accent');
const ACT = opt('action') ? need('action') : A;
const status = Object.fromEntries((opt('status', '') || '').split(',').filter(Boolean).map((s) => s.split('=')));
for (const [state, ramp] of Object.entries(status))
  if (!ramps.includes(ramp)) { console.error(`Error: --status ${state}=${ramp} names no ramp. Available: ${ramps.join(', ')}`); process.exit(2); }

const themeName = opt('theme') ?? (flag('dark') ? 'dark' : 'light');
if (!/^[a-z][a-z0-9-]*$/.test(themeName)) { console.error(`Error: --theme is lowercase letters, digits and hyphens. Received: ${themeName}`); process.exit(2); }
const dark = flag('dark') || opt('ground') === 'dark';
const fixedColor = (n) => { const v = opt(n); if (v && !('$value' in (core.color[v] ?? {}))) { console.error(`Error: --${n} must name a fixed color in brand.color, made with ramp.mjs --fixed. Received: ${v}`); process.exit(2); } return v; };
const PAPER = fixedColor('paper');
const INK = fixedColor('ink');
const rfile = resolve(ROOT, 'src/tokens.resolver.json');
const rdoc = JSON.parse(readFileSync(rfile, 'utf8'));
rdoc.modifiers.brand ??= { default: 'main', contexts: {} };
const brandName = opt('brand') ?? rdoc.modifiers.brand.default ?? 'main';
if (!/^[a-z][a-z0-9-]*$/.test(brandName)) { console.error(`Error: --brand is lowercase letters, digits and hyphens. Received: ${brandName}`); process.exit(2); }
const file = resolve(ROOT, `src/patterns.${themeName}.tokens.json`);
const doc = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { patterns: {} };
const prior = doc.patterns.color?.$extensions?.[EXT] ?? {};
// A second sub-brand shares the Patterns roles and changes only which Brand ramps its Intent uses.
const intentOnly = Boolean(doc.patterns.color) && brandName !== (rdoc.modifiers.brand.default ?? 'main');
if (doc.patterns.color && !prior.starter && !flag('force') && !intentOnly) { console.error(`Error: ${file} already has color roles. Edit them by hand, or pass --force to replace them.`); process.exit(1); }

// Intent: each semantic ramp points stop for stop at the Brand ramp this sub-brand uses for it.
// A state takes its semantic name: negative is error, positive is success.
const SEM = { negative: 'error', positive: 'success', warning: 'warning', caution: 'warning', info: 'info' };
const semOf = (state) => SEM[state] ?? state;
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const intentRamps = { accent: A, neutral: N, ...(ACT !== A ? { action: ACT } : {}), ...Object.fromEntries(Object.entries(status).map(([s, r]) => [semOf(s), r])) };
const ifile = resolve(ROOT, `src/intent.${brandName}.tokens.json`);
const idoc = existsSync(ifile) ? JSON.parse(readFileSync(ifile, 'utf8')) : { intent: {} };
idoc.intent.color ??= { $type: 'color' };
delete idoc.intent.color.$extensions?.[EXT]?.starter;
if (idoc.intent.color.$extensions && !Object.keys(idoc.intent.color.$extensions[EXT] ?? {}).length) delete idoc.intent.color.$extensions;
for (const [sem, ramp] of Object.entries(intentRamps)) idoc.intent.color[sem] = Object.fromEntries(STEPS.map((st) => [String(st), { $value: `{brand.color.${ramp}.${st}}` }]));
const PAPER_ = opt('paper');
const INK_ = opt('ink');
if (PAPER_) idoc.intent.color.neutral.paper = { $value: `{brand.color.${PAPER_}}` };
if (INK_) idoc.intent.color.neutral.ink = { $value: `{brand.color.${INK_}}` };
// Patterns roles name the Intent ramp they use, never a Brand ramp.
const ref = (sem, step) => ({ $value: `{intent.color.${sem}.${step}}` });
// A fill sits on the step the brand's own color landed on, so the brand color is the one on
// screen. Hover and pressed move one and two steps further from the page.
const anchorOf = (sem) => core.color[intentRamps[sem]]?.$extensions?.[EXT]?.ramp?.anchorStep;
const fill = (sem, fallbackLight, fallbackDark) => {
  const a = STEPS.indexOf(anchorOf(sem));
  const usable = a >= 3 && a <= 8; // an anchor at either end is a surface or an ink, not a fill
  const at = dark || !usable ? STEPS.indexOf(dark ? fallbackDark : fallbackLight) : a;
  const move = (n) => STEPS[Math.max(0, Math.min(STEPS.length - 1, at + (dark ? -n : n)))];
  return { bg: ref(sem, STEPS[at]), 'bg-hover': ref(sem, move(1)), 'bg-pressed': ref(sem, move(2)) };
};
// [light step, dark step]
const pick = (l, d) => (dark ? d : l);
const tone = (sem) => ({
  'bg-subtle': ref(sem, pick(100, 900)),
  border: ref(sem, pick(300, 700)),
  bg: ref(sem, pick(600, 400)),
  text: ref(sem, pick(700, 300)),
});
doc.patterns.color = {
  $type: 'color',
  bg: {
    page: ref('neutral', pick(50, 950)),
    surface: ref('neutral', pick(100, 900)),
    raised: ref('neutral', pick(50, 800)),
    sunken: ref('neutral', pick(200, 950)),
    inverse: ref('neutral', pick(900, 50)),
  },
  text: {
    primary: ref('neutral', pick(900, 50)),
    secondary: ref('neutral', pick(700, 300)),
    disabled: ref('neutral', pick(400, 600)),
    inverse: ref('neutral', pick(50, 900)),
    'on-accent': ref('neutral', pick(50, 950)),
  },
  border: {
    subtle: ref('neutral', pick(200, 800)),
    default: ref('neutral', pick(500, 500)),
    strong: ref('neutral', pick(900, 50)),
    separator: ref('neutral', pick(200, 800)),
    focus: ref('accent', pick(600, 400)),
  },
  accent: {
    'bg-subtle': ref('accent', pick(100, 900)),
    border: ref('accent', pick(300, 700)),
    ...fill('accent', 600, 400),
    text: ref('accent', pick(700, 300)),
  },
  action: {
    ...fill(ACT !== A ? 'action' : 'accent', 600, 400),
    'bg-disabled': ref('neutral', pick(200, 800)),
    // An unfilled action's own hover and pressed grounds, one and two steps past the surface, so
    // neither borrows a ground the action can sit on.
    'secondary-bg-hover': ref('neutral', pick(200, 800)),
    'secondary-bg-pressed': ref('neutral', pick(300, 700)),
    text: ref('neutral', pick(50, 950)),
    'text-disabled': ref('neutral', pick(500, 500)),
  },
  ...(Object.keys(status).length ? { status: Object.fromEntries(Object.entries(status).map(([s, r]) => [s, tone(semOf(s))])) } : {}),
};
// What the brand recorded beside its color roles survives a rewrite: the proportion, first.
const { starter, ...kept } = prior;
if (Object.keys(kept).length) doc.patterns.color.$extensions = { [EXT]: kept };
// A fixed paper and ink take the roles a neutral ramp's ends would hold.
const solo = (name) => ({ $value: `{intent.color.neutral.${name === PAPER ? 'paper' : 'ink'}}` });
const c = doc.patterns.color;
const [light, darkEnd] = dark ? [INK, PAPER] : [PAPER, INK];
if (light) { c.bg.page = solo(light); c.bg.raised = solo(light); c.text.inverse = solo(light); }
if (darkEnd) { c.text.primary = solo(darkEnd); c.border.strong = solo(darkEnd); c.bg.inverse = solo(darkEnd); }
if (PAPER && !dark) { c.text['on-accent'] = solo(PAPER); c.action.text = solo(PAPER); }
writeFileSync(ifile, JSON.stringify(idoc, null, 2) + '\n');
if (intentOnly) {
  if (!rdoc.modifiers.brand.contexts[brandName]) { rdoc.modifiers.brand.contexts[brandName] = [{ $ref: `intent.${brandName}.tokens.json` }]; writeFileSync(rfile, JSON.stringify(rdoc, null, 2) + '\n'); }
  console.log(JSON.stringify({ brand: brandName, files: [`src/intent.${brandName}.tokens.json`], patterns: 'shared, unchanged' }));
  process.exit(0);
}
writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
// Roles that name the brand's own ramps retire the starter's color placeholders.
{
  const cfile = resolve(ROOT, 'src/brand.tokens.json');
  const cdoc = JSON.parse(readFileSync(cfile, 'utf8'));
  const list = cdoc.brand.$extensions?.[EXT]?.placeholder;
  if (list) {
    const live = (ramp) => !list.includes(`color.${ramp}`) || !['gray', 'blue'].includes(ramp);
    const left = list.filter((x) => !((x === 'color.gray' && live(N)) || (x === 'color.blue' && live(A))));
    // A starter ramp the brand replaced is deleted, and anything that pointed at it, a shadow's
    // color for one, points at the ramp that replaced it.
    const into = { gray: N, blue: A };
    let out = cdoc;
    for (const gone of ['gray', 'blue']) if (!left.includes(`color.${gone}`) && ![N, A, ACT, ...Object.values(status)].includes(gone) && cdoc.brand.color[gone]?.$extensions?.[EXT]?.starter) {
      delete out.brand.color[gone];
      out = JSON.parse(JSON.stringify(out).replaceAll(`{brand.color.${gone}.`, `{brand.color.${into[gone]}.`));
    }
    if (left.length !== list.length) { out.brand.$extensions[EXT].placeholder = left; writeFileSync(cfile, JSON.stringify(out, null, 2) + '\n'); }
  }
}
// A new theme or sub-brand joins the resolver, so the build and the check load it.
let rchanged = false;
if (!rdoc.modifiers.theme.contexts[themeName]) { rdoc.modifiers.theme.contexts[themeName] = [{ $ref: `patterns.${themeName}.tokens.json` }]; rchanged = true; }
if (!rdoc.modifiers.brand.contexts[brandName]) { rdoc.modifiers.brand.contexts[brandName] = [{ $ref: `intent.${brandName}.tokens.json` }]; rchanged = true; }
if (!rdoc.resolutionOrder.some((r) => r.$ref === '#/modifiers/brand')) { rdoc.resolutionOrder.splice(1, 0, { $ref: '#/modifiers/brand' }); rchanged = true; }
if (rchanged) writeFileSync(rfile, JSON.stringify(rdoc, null, 2) + '\n');

// Every pair these roles produce, measured against the ground it paints on.
const P = 'patterns.color';
const pairs = [
  ...['page', 'surface', 'raised', 'sunken'].flatMap((g) => [
    { fg: `${P}.text.primary`, bg: `${P}.bg.${g}`, floor: 4.5 },
    { fg: `${P}.text.secondary`, bg: `${P}.bg.${g}`, floor: 4.5 },
  ]),
  { fg: `${P}.text.inverse`, bg: `${P}.bg.inverse`, floor: 4.5 },
  { fg: `${P}.accent.text`, bg: `${P}.bg.page`, floor: 4.5 },
  { fg: `${P}.accent.text`, bg: `${P}.accent.bg-subtle`, floor: 4.5 },
  ...['bg', 'bg-hover', 'bg-pressed'].flatMap((s) => [
    { fg: `${P}.text.on-accent`, bg: `${P}.accent.${s}`, floor: 4.5 },
    { fg: `${P}.action.text`, bg: `${P}.action.${s}`, floor: 4.5 },
    ...opt('action-on', 'page').split(',').map((g) => ({ fg: `${P}.action.${s}`, bg: `${P}.bg.${g.trim()}`, floor: 3, note: `A filled control against the ${g.trim()} ground` })),
  ]),
  ...['secondary-bg-hover', 'secondary-bg-pressed'].map((s) => ({ fg: `${P}.text.primary`, bg: `${P}.action.${s}`, floor: 4.5 })),
  { fg: `${P}.border.default`, bg: `${P}.bg.page`, floor: 3, note: 'A control boundary' },
  { fg: `${P}.border.focus`, bg: `${P}.bg.page`, floor: 3, note: 'The focus ring' },
  { fg: `${P}.border.strong`, bg: `${P}.bg.page`, floor: 3 },
  { fg: `${P}.text.disabled`, bg: `${P}.bg.page`, floor: 4.5, exempt: 'Disabled text. WCAG 2.2 SC 1.4.3 exempts inactive components' },
  { fg: `${P}.action.text-disabled`, bg: `${P}.action.bg-disabled`, floor: 4.5, exempt: 'A disabled control. WCAG 2.2 SC 1.4.3 exempts inactive components' },
  ...Object.keys(status).flatMap((s) => [
    { fg: `${P}.status.${s}.text`, bg: `${P}.bg.page`, floor: 4.5 },
    { fg: `${P}.status.${s}.text`, bg: `${P}.status.${s}.bg-subtle`, floor: 4.5 },
    { fg: `${P}.status.${s}.bg`, bg: `${P}.bg.page`, floor: 3 },
  ]),
];
const pfile = resolve(ROOT, 'src/pairs.json');
const pdoc = existsSync(pfile) ? JSON.parse(readFileSync(pfile, 'utf8')) : { $description: 'Every foreground and background pair the build measures, in every theme. floor is the WCAG 2.2 ratio the pair has to clear: 4.5 for text, 3 for large text, marks and boundaries. exempt names a pair WCAG leaves out, such as disabled controls, and says why.', contrast: [] };
const have = new Set(pdoc.contrast.map((p) => `${p.fg}|${p.bg}`));
let added = 0;
for (const p of pairs) if (!have.has(`${p.fg}|${p.bg}`)) { pdoc.contrast.push(p); added++; }
// Roles that decorate and carry no meaning need no pair. Each says why.
pdoc.unpaired ??= {};
const decorative = [`${P}.border.subtle`, `${P}.border.separator`, `${P}.accent.border`, ...Object.keys(status).map((s) => `${P}.status.${s}.border`)];
for (const r of decorative) pdoc.unpaired[r] ??= 'A hairline that decorates. It marks no boundary a person has to find';
writeFileSync(pfile, JSON.stringify(pdoc, null, 2) + '\n');
console.log(JSON.stringify({ brand: brandName, theme: themeName, ground: dark ? 'dark' : 'light', files: [`src/intent.${brandName}.tokens.json`, `src/patterns.${themeName}.tokens.json`], pairsAdded: added, pairsTotal: pdoc.contrast.length }));
