#!/usr/bin/env node
// The library's gate. Fails on a structural or contrast defect and writes every measurement to
// contrast.md, so a pair's margin is visible even when it passes.
//   1. Every alias resolves, in every theme, with no cycle.
//   2. No two tokens publish under one name.
//   3. Every sub-brand and theme defines the same Intent and Patterns names.
//   4. Each layer points only at the layer below it: Intent at Brand, a Patterns color at Intent,
//      any other Patterns token at Intent or Brand. Intent and Patterns colors hold no raw value.
//      No Brand color shares a name with an Intent ramp.
//   5. Every pair in src/pairs.json clears its floor, in every theme.
//   6. No placeholder from the starter is left.
//   7. Every color role appears in a pair, or is listed as unpaired with the reason.
//   8. Two grounds that sit side by side keep a luminance gap, 2:1 by default, so neither reads as
//      the other where they meet. src/pairs.json → adjacent lists them; with no list, the main
//      grounds and fills are measured against each other.
//   9. No action's hover or pressed fill is the same color as a ground the action sits on, so the
//      state stays visible. The grounds are the ones src/pairs.json measures action.bg against.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, loadThemes, flatten, get, resolveValue, cssName, tierOf, aliasOf, ext, isToken, BELOW } from './lib/tokens.mjs';
import { contrast, composite, toHex, deltaE, simulate, VISION } from './lib/color.mjs';

const HELP = `Usage: node scripts/check.mjs [--allow-placeholder] [--no-report]

Checks the token source and writes contrast.md.

Options:
  --allow-placeholder   Do not fail on the starter's placeholder values
  --no-report           Do not write contrast.md
  --help                Show this text

Output: one JSON line on stdout. Failures are listed on stderr, one per line.
Exit codes: 0 all checks pass, 1 a check failed, 2 the source could not be read.`;
const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(HELP); process.exit(0); }

let themes;
try { ({ themes } = loadThemes()); } catch (e) { console.error(`Error: ${e.message}`); process.exit(2); }
const failures = [];
const fail = (m) => failures.push(m);
let tokens = 0;

const roleSets = {};
for (const [theme, { tree }] of Object.entries(themes)) {
  let rows;
  try { rows = flatten(tree); } catch (e) { fail(`[${theme}] ${e.message}`); continue; }
  tokens = Math.max(tokens, rows.length);
  roleSets[theme] = rows.filter((r) => tierOf(r.path) !== 'brand').map((r) => r.path).sort();
  // A theme is laid over the default, so a role it adds that the default lacks is the defect.
  const seen = new Map();
  for (const r of rows) {
    const pub = cssName(r.path);
    if (seen.has(pub)) fail(`[${theme}] ${r.path} and ${seen.get(pub)} both publish as ${pub}. Rename one.`);
    seen.set(pub, r.path);
    const tier = tierOf(r.path);
    if (tier !== 'brand' && r.type === 'color' && !r.alias && !ext(r.token).composite_of)
      fail(`[${theme}] ${r.path} holds a raw color. ${tier === 'intent' ? 'An Intent ramp aliases a Brand step' : 'A Patterns role aliases an Intent step'}.`);
    if (tier === 'intent' && !r.alias && !ext(r.token).composite_of)
      fail(`[${theme}] ${r.path} holds a raw value. Intent only points at Brand.`);
    // Every alias, including one inside a composite such as a type role, goes to the layer below.
    const refs = JSON.stringify(r.token.$value).match(/\{[a-z][\w.-]*\}/g) ?? [];
    for (const ref of refs) {
      const to = tierOf(ref.slice(1, -1));
      const allowed = tier === 'patterns' && r.type === 'color' ? ['intent'] : BELOW[tier] ?? [];
      if (!allowed.includes(to))
        fail(`[${theme}] ${r.path} points at ${ref}. ${tier === 'patterns' && to === 'brand' ? 'A Patterns color points at an Intent ramp, never at Brand, so a sub-brand can repoint it' : `${tier[0].toUpperCase() + tier.slice(1)} points only at ${allowed.join(' or ')}`}.`);
    }
  }
  // A Brand name equal to an Intent name publishes twice, or reads as the same thing.
  const brandColors = Object.keys(tree.brand?.color ?? {}).filter((k) => !k.startsWith('$'));
  for (const k of Object.keys(tree.intent?.color ?? {}).filter((k) => !k.startsWith('$')))
    if (brandColors.includes(k)) fail(`[${theme}] brand.color.${k} has the same name as the Intent ramp intent.color.${k}. Name the Brand ramp by its brand name or a Tailwind-style hue, such as stone for a warm neutral.`);
  const left = ext(tree.brand).placeholder ?? [];
  if (left.length && !args.includes('--allow-placeholder'))
    fail(`[${theme}] starter placeholders remain: ${left.join(', ')}. Replace each with the brand's value, then remove it from brand.$extensions["brand-os"].placeholder.`);
}
const [refTheme, refRoles] = Object.entries(roleSets)[0] ?? [];
for (const [theme, roles] of Object.entries(roleSets)) {
  const missing = refRoles.filter((r) => !roles.includes(r));
  const extra = roles.filter((r) => !refRoles.includes(r));
  if (missing.length || extra.length)
    fail(`[${theme}] roles differ from ${refTheme}. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`);
}

// An alpha role is measured where it lands: laid over the pair's `over` ground.
const hexAt = (tree, path, over) => {
  const t = get(tree, path);
  if (!isToken(t)) throw new Error(`no token ${path}`);
  const v = resolveValue(tree, t.$value);
  const hex = toHex(v);
  const alpha = typeof v === 'object' && v.alpha !== undefined ? v.alpha : 1;
  return alpha < 1 && over ? composite(hex, alpha, hexAt(tree, over)) : hex;
};
const stepAt = (tree, path) => {
  let t = get(tree, path);
  let a;
  while (t && (a = aliasOf(t))) { if (tierOf(a) === 'brand') return a.replace('brand.color.', ''); t = get(tree, a); }
  return 'raw';
};
const short = (p) => p.replace(/^patterns\.color\./, '');

const pfile = resolve(ROOT, 'src/pairs.json');
const pairs = existsSync(pfile) ? JSON.parse(readFileSync(pfile, 'utf8')) : { contrast: [] };
if (!pairs.contrast?.length) fail('src/pairs.json lists no pairs, so no contrast was measured. Run node scripts/roles.mjs, or list the pairs by hand.');
const rows = [];
for (const p of pairs.contrast ?? []) {
  for (const [theme, { tree }] of Object.entries(themes)) {
    if (p.themes && !p.themes.includes(theme)) continue;
    try {
      const [fg, bg] = [hexAt(tree, p.fg, p.bg), hexAt(tree, p.bg)];
      const ratio = contrast(fg, bg);
      const ok = ratio >= p.floor || Boolean(p.exempt);
      rows.push({ theme, fg: short(p.fg), bg: short(p.bg), fgStep: stepAt(tree, p.fg), bgStep: stepAt(tree, p.bg), ratio, floor: p.floor, ok, exempt: p.exempt, note: p.note });
      if (!ok) fail(`[${theme}] ${short(p.fg)} (${stepAt(tree, p.fg)}) on ${short(p.bg)} (${stepAt(tree, p.bg)}) measures ${ratio.toFixed(2)}:1, under ${p.floor}:1. Move the role to a step further from its ground. Where one role sits on two grounds and no step clears both, split it into a role per ground.`);
    } catch (e) { fail(`[${theme}] pair ${p.fg} on ${p.bg}: ${e.message}`); }
  }
}
// A role nobody measures is where a contrast defect hides. Every color role is in a pair, or is
// listed under "unpaired" with why it needs none.
const paired = new Set((pairs.contrast ?? []).flatMap((p) => [p.fg, p.bg]).concat((pairs.distinct ?? []).flatMap((p) => [p.a, p.b]), (pairs.adjacent ?? []).flatMap((p) => [p.a, p.b])));
const unpaired = pairs.unpaired ?? {};
if (pairs.contrast?.length) {
  const first = Object.values(themes)[0];
  let all = [];
  try { all = flatten(first.tree); } catch { /* reported above */ }
  for (const r of all) {
    if (tierOf(r.path) !== 'patterns' || r.type !== 'color') continue;
    if (!paired.has(r.path) && !(r.path in unpaired))
      fail(`${short(r.path)} is in no pair, so nothing measures it. Add the pairs it appears in to src/pairs.json, or list it under "unpaired" with the reason.`);
  }
}
// Two grounds beside each other, a dark card beside a dark fill, read as one where hue alone tells
// them apart. With no "adjacent" list in pairs.json, every two of the main grounds and fills are
// measured: the page, the inverse, the accent and action fills, and any ground the proportion names.
// Two roles on one step are one ground and are skipped.
const ADJ_FLOOR = 2;
const adjacentDefault = (tree) => {
  const prop = Object.keys(ext(tree.patterns?.color).proportion ?? {}).filter((k) => /(^bg-|-bg$)/.test(k));
  const paths = ['patterns.color.bg.page', 'patterns.color.bg.inverse', 'patterns.color.accent.bg', 'patterns.color.action.bg',
    ...prop.flatMap((k) => [`patterns.color.${k.replace('-', '.')}`, `patterns.color.${k.replace(/-([^-]+)$/, '.$1')}`])];
  const found = [...new Set(paths)].filter((x) => isToken(get(tree, x)));
  const out = [];
  for (let i = 0; i < found.length; i++) for (let j = i + 1; j < found.length; j++) out.push({ a: found[i], b: found[j] });
  return out;
};
const adjacent = [];
for (const [theme, { tree }] of Object.entries(themes)) {
  for (const p of pairs.adjacent ?? adjacentDefault(tree)) {
    if (p.themes && !p.themes.includes(theme)) continue;
    try {
      const [a, b] = [hexAt(tree, p.a), hexAt(tree, p.b)];
      const [sa, sb] = [stepAt(tree, p.a), stepAt(tree, p.b)];
      if (a === b || (sa === sb && sa !== 'raw')) continue;
      const ratio = contrast(a, b);
      const floor = p.floor ?? ADJ_FLOOR;
      const ok = ratio >= floor || Boolean(p.exempt);
      adjacent.push({ theme, a: short(p.a), b: short(p.b), aStep: sa, bStep: sb, ratio, floor, ok, exempt: p.exempt });
      if (!ok) fail(`[${theme}] ${short(p.a)} (${sa}) beside ${short(p.b)} (${sb}) measures ${ratio.toFixed(2)}:1, under ${floor}:1. Two grounds this close read as one where they meet. Move one of them a step lighter or darker, or, where the two never touch, list the pair in src/pairs.json → adjacent with "exempt" and the reason.`);
    } catch (e) { fail(`[${theme}] adjacent pair ${p.a} and ${p.b}: ${e.message}`); }
  }
}
// A hover or pressed fill equal to a ground the action sits on disappears there. The grounds are the
// ones pairs.json measures the action's fill against, which roles.mjs writes from --action-on.
const stateGrounds = [...new Set((pairs.contrast ?? []).filter((p) => /^patterns\.color\.action\.bg$/.test(p.fg) && /^patterns\.color\.bg\./.test(p.bg)).map((p) => p.bg))];
for (const [theme, { tree }] of Object.entries(themes)) {
  const states = ['bg-hover', 'bg-pressed', 'secondary-bg-hover', 'secondary-bg-pressed'].map((s) => `patterns.color.action.${s}`).filter((x) => isToken(get(tree, x)));
  for (const s of states) for (const g of stateGrounds) {
    try {
      if (hexAt(tree, s) === hexAt(tree, g)) fail(`[${theme}] ${short(s)} (${stepAt(tree, s)}) is the same color as ${short(g)}, a ground the action sits on, so the state disappears there. Move it a step away.`);
    } catch (e) { fail(`[${theme}] state ${s} on ${g}: ${e.message}`); }
  }
}
// Pairs told apart by color alone keep an OKLab distance under each kind of color vision.
const distinct = [];
for (const p of pairs.distinct ?? []) {
  for (const [theme, { tree }] of Object.entries(themes)) {
    try {
      const [a, b] = [hexAt(tree, p.a), hexAt(tree, p.b)];
      const d = Object.fromEntries(VISION.map((v) => [v, deltaE(simulate(a, v), simulate(b, v))]));
      const worst = Math.min(...Object.values(d));
      const ok = worst >= (p.margin ?? 6) || Boolean(p.carrier);
      distinct.push({ theme, a: short(p.a), b: short(p.b), d, ok, carrier: p.carrier });
      if (!ok) fail(`[${theme}] ${short(p.a)} and ${short(p.b)} sit ${worst.toFixed(1)} apart under one kind of color vision, under ${p.margin ?? 6}. Separate them in lightness, or give the pair a carrier such as a glyph.`);
    } catch (e) { fail(`[${theme}] distinct pair ${p.a} and ${p.b}: ${e.message}`); }
  }
}

if (!args.includes('--no-report')) {
  let md = '<!-- Generated by scripts/check.mjs. Do not edit. -->\n\n# Contrast\n\nEvery pair in `src/pairs.json`, measured in every theme against the ground it paints on. The floor is WCAG 2.2 AA: 4.5:1 for text, 3:1 for large text, marks and boundaries.\n';
  for (const theme of Object.keys(themes)) {
    md += `\n## ${theme[0].toUpperCase() + theme.slice(1)}\n\n| Foreground | Step | Ground | Step | Ratio | Floor | Result |\n|---|---|---|---|---|---|---|\n`;
    for (const r of rows.filter((x) => x.theme === theme))
      md += `| ${r.fg} | ${r.fgStep} | ${r.bg} | ${r.bgStep} | ${r.ratio.toFixed(2)}:1 | ${r.floor}:1 | ${r.ratio >= r.floor ? 'pass' : r.exempt ? `exempt: ${r.exempt}` : '**fail**'} |\n`;
    const as = adjacent.filter((x) => x.theme === theme);
    if (as.length) {
      md += `\n### Grounds side by side\n\nTwo grounds that can meet, measured against each other. Under the floor they read as one where they touch.\n\n| Ground | Step | Beside | Step | Ratio | Floor | Result |\n|---|---|---|---|---|---|---|\n`;
      for (const r of as) md += `| ${r.a} | ${r.aStep} | ${r.b} | ${r.bStep} | ${r.ratio.toFixed(2)}:1 | ${r.floor}:1 | ${r.ratio >= r.floor ? 'pass' : r.exempt ? `exempt: ${r.exempt}` : '**fail**'} |\n`;
    }
    const ds = distinct.filter((x) => x.theme === theme);
    if (ds.length) {
      md += `\n### Told apart by color\n\n| Pair | Normal | Deutan | Protan | Tritan | Result |\n|---|---|---|---|---|---|\n`;
      for (const r of ds) md += `| ${r.a} and ${r.b} | ${VISION.map((v) => r.d[v].toFixed(1)).join(' | ')} | ${r.ok ? (r.carrier ? `carried by ${r.carrier}` : 'pass') : '**fail**'} |\n`;
    }
  }
  writeFileSync(resolve(ROOT, 'contrast.md'), md);
}

for (const f of failures) console.error(f);
const measured = rows.filter((r) => !r.exempt).sort((a, b) => a.ratio - a.floor - (b.ratio - b.floor));
const lowest = measured[0] ? { pair: `${measured[0].fg} on ${measured[0].bg}`, theme: measured[0].theme, ratio: +measured[0].ratio.toFixed(2), floor: measured[0].floor } : null;
console.log(JSON.stringify({ themes: Object.keys(themes), tokens, pairs: rows.length, adjacent: adjacent.length, failed: failures.length, lowest }));
process.exit(failures.length ? 1 : 0);
