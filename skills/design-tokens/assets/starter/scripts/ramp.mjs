#!/usr/bin/env node
// Builds an eleven-step color ramp from one anchor and writes it into src/brand.tokens.json.
// Every ramp shares one lightness curve, so a step reads at the same weight in every hue, and one
// chroma curve, so every hue swells and fades at the same steps. The anchor sets how high that
// curve peaks, and the sRGB gamut caps it wherever a hue runs out of chroma. A pinned anchor
// bends its neighbours toward itself, so the ramp never jumps at the brand's step.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, EXT } from './lib/tokens.mjs';
import { hexToOklch, oklchToHex, maxChroma } from './lib/color.mjs';

const HELP = `Usage: node scripts/ramp.mjs --name <hue> --anchor <#rrggbb> [options]

Builds brand.color.<hue>.50 … 950 in src/brand.tokens.json.

Options:
  --name NAME        Ramp name, lowercase. A color the brand specifies and names takes its brand
                     name (tidewater); every other ramp a Tailwind-style hue (stone, zinc, red,
                     amber, green). Never an Intent name: accent, neutral, error, success,
                     warning, info, action. Required
  --anchor HEX       The color the brand chose. Required
  --pin              Keep the anchor exactly as given on its step, and bend the two steps either
                     side of it smoothly toward it. Default: snap it to the curve
  --step N           Put the anchor on this step. Default: the step nearest its lightness
  --chroma C         The OKLCH chroma the ramp's curve peaks at, at step 700. Default: whatever
                     puts the anchor's own chroma on the curve at its step
  --tint F           A factor on chroma at step 50, 0 to 1, easing to 1 by step 500. It only
                     ever quiets the light end. Default: 1
  --cap C            An absolute ceiling on OKLCH chroma at step 50, widening to no ceiling by step
                     500. Use it when the light steps of a hue still read as a second color
                     (mint, peach) after --tint, where a wide gamut lets a tint carry more chroma
                     than the brand wants. Try 0.02 to 0.03
  --match NAME       Take the lightness of every step from the ramp NAME already in the source,
                     so a hand-built neutral and the hues built after it sit at one weight per
                     step. Default: the built-in curve. A warning names any step that differs
  --neutral          Build a neutral: holds the anchor's hue, with the curve peaking at no more
                     than 0.03 unless --chroma says otherwise
  --steps LIST       Keep a ramp that already exists, exactly: 50=#rrggbb,100=#rrggbb,…,950=#rrggbb.
                     Use it when rebuilding a system whose ramps are already decided. Add
                     --anchor to mark which step is the brand's color. --pin is not needed
  --fixed            Write one color and no ramp: brand.color.<name>. For a paper white or an ink
                     the brand fixed exactly and that sits on no ramp
  --dry-run          Print the ramp and write nothing
  --help             Show this text

Examples:
  node scripts/ramp.mjs --name green --anchor "#3f6b4f"
  node scripts/ramp.mjs --name stone --anchor "#3f6b4f" --neutral
  node scripts/ramp.mjs --name red --anchor "#c8102e" --pin
  node scripts/ramp.mjs --name red --anchor "#9e5550" --match stone --cap 0.025

Exit codes: 0 written, 2 bad arguments.`;

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
if (flag('help') || !args.length) { console.log(HELP); process.exit(0); }
const name = opt('name');
const anchor = opt('anchor');
const given = opt('steps');
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) { console.error('Error: --name is required, lowercase letters, digits and hyphens.\n' + HELP); process.exit(2); }
// Brand names say what a color is; Intent names say what it means. One name in both publishes twice.
const INTENT_NAMES = ['accent', 'neutral', 'error', 'success', 'warning', 'info', 'action'];
if (INTENT_NAMES.includes(name)) { console.error(`Error: --name ${name} is an Intent name. Name the Brand ramp by its brand name, or by a Tailwind-style hue such as ${name === 'neutral' ? 'stone, zinc, slate or gray' : 'red, amber, green or blue'}.`); process.exit(2); }
if (!given && (!anchor || !/^#[0-9a-fA-F]{6}$/.test(anchor))) { console.error(`Error: --anchor must be a six-digit hex such as "#3f6b4f". Received: ${anchor}`); process.exit(2); }

// Lightness per step. Light steps sit closer together than dark ones, the intervals even out
// from step 400 down, and neither end reaches pure white or black, where a hue holds no chroma.
// Steps 100 to 300 stay dark enough to hold color: a tint that reads white by 300 leaves the
// light end with one usable step.
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LIGHTNESS = [0.975, 0.94, 0.89, 0.82, 0.735, 0.645, 0.56, 0.48, 0.4, 0.325, 0.255];
// Chroma per step as a share of the ramp's peak, one curve for every hue. It rises through the
// light steps, peaks at 700 and eases off toward 950, so tints keep their hue and the darkest
// steps read as deep color rather than black.
const CHROMA = [0.1, 0.22, 0.4, 0.59, 0.76, 0.89, 0.96, 1, 0.87, 0.71, 0.54];
// The share of a step's gamut maximum chroma may reach. Just inside the edge, so a hue that runs
// out of chroma flattens instead of clipping to a different color.
const GAMUT = 0.97;
// How far a pinned anchor bends its neighbours: the full offset on its own step, three quarters
// one step away, a quarter two steps away, nothing beyond.
const BEND = [1, 0.75, 0.25];

if (given) {
  const STEP_NAMES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const map = Object.fromEntries(given.split(',').map((s) => s.trim().split('=')));
  const bad = STEP_NAMES.filter((s) => !/^#[0-9a-fA-F]{6}$/.test(map[s] ?? ''));
  if (bad.length) { console.error(`Error: --steps needs all eleven steps as six-digit hexes. Missing or malformed: ${bad.join(', ')}`); process.exit(2); }
  const at = anchor ? STEP_NAMES.find((s) => map[s].toLowerCase() === anchor.toLowerCase()) : undefined;
  const ramp = Object.fromEntries(STEP_NAMES.map((s) => { const [L, C, H] = hexToOklch(map[s]); return [s, { $value: { colorSpace: 'oklch', components: [+L.toFixed(4), +C.toFixed(4), +H.toFixed(2)], hex: map[s].toLowerCase() } }]; }));
  ramp.$extensions = { [EXT]: { ramp: { imported: true, ...(at ? { anchor: anchor.toLowerCase(), anchorStep: Number(at), pinned: true } : {}), space: 'oklch' } } };
  const file = resolve(ROOT, 'src/brand.tokens.json');
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  doc.brand.color ??= { $type: 'color' };
  doc.brand.color[name] = ramp;
  if (!flag('dry-run')) writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
  console.log(JSON.stringify({ name, imported: 11, anchorStep: at ? Number(at) : null }));
  process.exit(0);
}
const [aL, aC, aH] = hexToOklch(anchor);
const coreFile = resolve(ROOT, 'src/brand.tokens.json');
const coreDoc = JSON.parse(readFileSync(coreFile, 'utf8'));
// The lightness each step sits at: the built-in curve, or the curve of a ramp the brand already has.
let curve = LIGHTNESS;
const matchName = opt('match');
if (matchName) {
  const m = coreDoc.brand?.color?.[matchName];
  const from = m && !('$value' in m) ? STEPS.map((st) => m[String(st)]?.$value?.components?.[0]) : null;
  if (!from || from.some((v) => typeof v !== 'number')) { console.error(`Error: --match ${matchName} needs a ramp of eleven steps already in src/brand.tokens.json.`); process.exit(2); }
  curve = from;
}
if (flag('fixed')) {
  const file = resolve(ROOT, 'src/brand.tokens.json');
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  doc.brand.color ??= { $type: 'color' };
  doc.brand.color[name] = { $value: { colorSpace: 'oklch', components: [+aL.toFixed(4), +aC.toFixed(4), +aH.toFixed(2)], hex: anchor.toLowerCase() }, $description: 'Fixed by the brand. Sits on no ramp.', $extensions: { [EXT]: { fixed: true } } };
  if (!flag('dry-run')) writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
  console.log(JSON.stringify({ name, fixed: anchor.toLowerCase() }));
  process.exit(0);
}
const nearest = curve.reduce((best, l, i) => (Math.abs(l - aL) < Math.abs(curve[best] - aL) ? i : best), 0);
const at = opt('step') ? STEPS.indexOf(Number(opt('step'))) : nearest;
if (at < 0) { console.error(`Error: --step must be one of ${STEPS.join(', ')}. Received: ${opt('step')}`); process.exit(2); }
// The peak that puts the anchor's own chroma on the curve at its step.
const ownPeak = aC / CHROMA[at];
const peak = opt('chroma') !== undefined ? Number(opt('chroma')) : flag('neutral') ? Math.min(ownPeak, 0.03) : ownPeak;
if (!(peak >= 0 && peak <= 0.4)) { console.error(`Error: --chroma is an OKLCH chroma from 0 to 0.4. Received: ${opt('chroma')}`); process.exit(2); }
const tint = opt('tint') !== undefined ? Number(opt('tint')) : 1;
if (!(tint >= 0 && tint <= 1)) { console.error(`Error: --tint is a factor from 0 to 1, and it only ever quiets the light end. Received: ${opt('tint')}`); process.exit(2); }
const cap = opt('cap') !== undefined ? Number(opt('cap')) : null;
if (cap !== null && !(cap > 0 && cap <= 0.4)) { console.error(`Error: --cap is an OKLCH chroma above 0 and at most 0.4. Received: ${opt('cap')}`); process.exit(2); }
// The ceiling widens evenly from step 50 to step 500, and is gone from there.
const capAt = (i) => (cap === null || i >= 5 ? Infinity : cap * (1 + (4 * i) / 5));
const tintAt = (i) => (i >= 5 ? 1 : tint + (1 - tint) * (i / 5));
const chromaAt = (i, L) => Math.min(peak * CHROMA[i] * tintAt(i), capAt(i), GAMUT * maxChroma(L, aH));
// A pinned anchor sits off the curve. Carry its offset in lightness and its ratio in chroma onto
// its neighbours, fading with distance, so the steps either side lead into it.
const bendAt = (i) => (flag('pin') ? BEND[Math.abs(i - at)] ?? 0 : 0);
const dL = aL - curve[at];
const rC = aC / Math.max(chromaAt(at, curve[at]), 1e-6);
const lightness = STEPS.map((_, i) => curve[i] + dL * bendAt(i));
// The bend never lets a step pass its neighbour: lightness keeps falling from 50 to 950.
for (let i = 1; i < STEPS.length; i++) lightness[i] = Math.min(lightness[i], lightness[i - 1] - 0.01);
const ramp = {};
STEPS.forEach((step, i) => {
  const L = lightness[i];
  const C = Math.min(chromaAt(i, L) * (1 + (rC - 1) * bendAt(i)), maxChroma(L, aH));
  const pinned = flag('pin') && i === at;
  const hex = pinned ? anchor.toLowerCase() : oklchToHex(L, C, aH);
  const [pL, pC, pH] = pinned ? [aL, aC, aH] : [L, C, aH];
  ramp[String(step)] = {
    $value: { colorSpace: 'oklch', components: [+pL.toFixed(4), +pC.toFixed(4), +pH.toFixed(2)], hex },
    ...(i === at ? { $description: pinned ? 'The anchor, kept exactly as chosen.' : `The anchor's step. Chosen ${anchor.toLowerCase()}, snapped to the curve.` } : {}),
  };
});
ramp.$extensions = { [EXT]: { ramp: { anchor: anchor.toLowerCase(), anchorStep: STEPS[at], pinned: flag('pin'), peakChroma: +peak.toFixed(4), ...(tint !== 1 ? { tint: +tint.toFixed(4) } : {}), ...(cap !== null ? { lightChromaCap: cap } : {}), ...(matchName ? { lightnessFrom: matchName } : {}), hue: +aH.toFixed(2), space: 'oklch' } } };

// Ramps read as one family when each step sits at one lightness. Name any step that does not.
const warnings = [];
for (const [other, r] of Object.entries(coreDoc.brand?.color ?? {})) {
  if (other === name || other.startsWith('$') || '$value' in r) continue;
  const off = STEPS.filter((st, i) => { const l = r[String(st)]?.$value?.components?.[0]; return typeof l === 'number' && Math.abs(l - curve[i]) > 0.012; });
  if (off.length) warnings.push(`${name} and ${other} differ in lightness at step ${off.join(', ')}. A step reads at a different weight in each. Rebuild with --match ${other} to share its lightness.`);
}
const summary = { name, anchorStep: STEPS[at], peakChroma: +peak.toFixed(4), steps: Object.fromEntries(STEPS.map((s) => [s, ramp[s].$value.hex])), ...(warnings.length ? { warnings } : {}) };
if (flag('dry-run')) { console.log(JSON.stringify(summary, null, 2)); process.exit(0); }

const file = coreFile;
const doc = coreDoc;
doc.brand.color ??= { $type: 'color' };
doc.brand.color[name] = ramp;
const left = (doc.brand.$extensions?.[EXT]?.placeholder ?? []).filter((x) => x !== `color.${name}`);
if (doc.brand.$extensions?.[EXT]) doc.brand.$extensions[EXT].placeholder = left;
writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
console.log(JSON.stringify(summary));
