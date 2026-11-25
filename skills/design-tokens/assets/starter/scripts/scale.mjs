#!/usr/bin/env node
// Builds the type scale from one base size and one ratio and writes brand.font-size,
// brand.line-height and brand.spacing into src/brand.tokens.json. Sizes compound at full precision and
// every step rounds once, by one rule: to the nearest whole pixel. Leading lands on the base unit.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, EXT } from './lib/tokens.mjs';

// The note an earlier version wrote on every step. --tidy removes it and nothing else.
const OLD_NOTE = /^\s*-?\d+(?:\.\d+)?px computed\s*$/;

const HELP = `Usage: node scripts/scale.mjs --base <px> --ratio <n> --reason "<why>" [options]

There is no default base or ratio. Both come from the brand, as one decision.

Options:
  --base PX        Base type size in px. Required
  --ratio N        The scale's ratio, such as 1.2 or 1.333. Required
  --reason TEXT    Why this pair suits this brand and its main surfaces. Required
  --unit PX        The base unit leading and spacing sit on. Default: 4
  --round PX       Round every size to this instead of the whole pixel, such as 2 to keep an
                   existing scale on even sizes. One rule for every step: where two steps would
                   round to one size, the script stops
  --leading LIST   Keep leading that already exists: step=px pairs, such as n1=16,0=24,1=28.
                   Steps not listed get leading computed on the unit
  --down N         Steps below the base. Default: 2
  --up N           Steps above the base. Default: 8
  --dry-run        Print the scale and write nothing
  --tidy           Change no size. Remove the per-step "19.20px computed" notes an earlier
                   version of this script wrote on font-size and line-height steps, which a Figma
                   push would otherwise carry into every variable's description. Needs no base or
                   ratio. Run it once after updating an older kit's scripts
  --help           Show this text

Example:
  node scripts/scale.mjs --base 16 --ratio 1.25 --reason "Marketing site first, product second"

Step names: 0 is the base, 3 is three steps up, n1 is one step down.
Exit codes: 0 written, 2 bad arguments or two steps that round to one size.`;

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
if (flag('help') || !args.length) { console.log(HELP); process.exit(0); }
const file = resolve(ROOT, 'src/brand.tokens.json');
if (flag('tidy')) {
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const removed = [];
  for (const g of ['font-size', 'line-height']) for (const [k, t] of Object.entries(doc.brand?.[g] ?? {})) {
    if (k.startsWith('$') || !t || typeof t !== 'object' || !OLD_NOTE.test(t.$description ?? '')) continue;
    delete t.$description;
    removed.push(`${g}.${k}`);
  }
  if (removed.length) writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
  console.log(JSON.stringify({ removed: removed.length, steps: removed }));
  process.exit(0);
}
const base = Number(opt('base'));
const ratio = Number(opt('ratio'));
const reason = opt('reason');
const unit = Number(opt('unit', 4));
const round = Number(opt('round', 1));
const down = Number(opt('down', 2));
const up = Number(opt('up', 8));
if (!(base > 0) || !(ratio > 1)) { console.error('Error: --base and --ratio are both required. There is no default.\n' + HELP); process.exit(2); }
if (!reason) { console.error('Error: --reason is required. Say why this base and ratio suit this brand.'); process.exit(2); }

// Leading target by how far a step sits above the base: body, subheading, heading, display.
const target = (n) => (n <= 1 ? 1.5 : n <= 3 ? 1.3 : n <= 5 ? 1.15 : 1.0);
const key = (n) => (n < 0 ? `n${-n}` : String(n));
const sizes = {};
const leading = {};
const notes = [];
// No step carries its unrounded value: a designer reads "19.20px computed" beside 19px as a mismatch.
// The ratio and the base sit once, in the group's scale record.
const setStep = (n, size) => {
  sizes[key(n)] = { $value: { value: size, unit: 'px' } };
  leading[key(n)] = { $value: { value: Math.ceil((size * target(n)) / unit) * unit, unit: 'px' } };
};
// Every step, the base included, rounds by the same rule. Two steps that would land on one size stop
// the script: the ratio is too fine for the rounding, and a second rule for one step is how a scale
// stops being one.
const rnd = (x) => Math.round(x / round) * round;
const made = new Map();
for (let n = -down; n <= up; n++) {
  const size = rnd(base * ratio ** n);
  if (made.has(size)) { console.error(`Error: steps ${key(made.get(size))} and ${key(n)} both round to ${size}px. Use a larger ratio, fewer steps (--down, --up) or a finer --round.`); process.exit(2); }
  made.set(size, n);
  setStep(n, size);
}
const kept = Object.fromEntries((opt('leading', '') || '').split(',').filter(Boolean).map((s) => s.split('=')));
for (const [k, px] of Object.entries(kept)) {
  if (!leading[k] || !(Number(px) > 0)) { console.error(`Error: --leading ${k}=${px} names no step or no size. Steps: ${Object.keys(leading).join(', ')}`); process.exit(2); }
  leading[k] = { $value: { value: Number(px), unit: 'px' } };
}
const record = { ratio, base, unit, rounding: `every step to the nearest ${round}px`, reason, ...(notes.length ? { notes } : {}) };
const order = [...Array(down).keys()].map((i) => key(-(down - i))).concat([...Array(up + 1).keys()].map(key));
const summary = { ...record, sizes: Object.fromEntries(order.map((k) => [k, `${sizes[k].$value.value}/${leading[k].$value.value}`])) };
if (flag('dry-run')) { console.log(JSON.stringify(summary, null, 2)); process.exit(0); }

const doc = JSON.parse(readFileSync(file, 'utf8'));
doc.brand['font-size'] = { $type: 'dimension', $extensions: { [EXT]: { scale: record } }, ...Object.fromEntries(order.map((k) => [k, sizes[k]])) };
doc.brand['line-height'] = { $type: 'dimension', ...Object.fromEntries(order.map((k) => [k, leading[k]])) };
// Spacing counts base units: spacing.4 is four units.
const SPACING = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];
// Named steps, the fluid gutter and section padding, are the brand's and are kept as they were.
const named = Object.fromEntries(Object.entries(doc.brand.spacing ?? {}).filter(([k]) => !k.startsWith('$') && !/^\d+$/.test(k)));
doc.brand.spacing = { $type: 'dimension', $extensions: { [EXT]: { unit } }, ...Object.fromEntries(SPACING.map((n) => [String(n), { $value: { value: n * unit, unit: 'px' } }])), ...named };
const left = (doc.brand.$extensions?.[EXT]?.placeholder ?? []).filter((x) => x !== 'font-size');
if (doc.brand.$extensions?.[EXT]) doc.brand.$extensions[EXT].placeholder = left;
writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
// Say which type roles now point at a step the scale no longer has.
const dangling = [];
for (const f of readdirSync(resolve(ROOT, 'src')).filter((n) => /^patterns\..+\.tokens\.json$/.test(n))) {
  const path = resolve(ROOT, 'src', f);
  if (!existsSync(path)) continue;
  for (const m of readFileSync(path, 'utf8').matchAll(/\{brand\.(?:font-size|line-height)\.([\w-]+)\}/g)) if (!sizes[m[1]] && !dangling.includes(m[1])) dangling.push(m[1]);
}
if (dangling.length) summary.missingSteps = `Type roles point at steps this scale does not have: ${dangling.join(', ')}. Repoint those roles in src/patterns.*.tokens.json before building.`;
console.log(JSON.stringify(summary));
