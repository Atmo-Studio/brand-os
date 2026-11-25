#!/usr/bin/env node
// Figma parity, in two steps, because a Figma file is reached only through its Plugin API.
//
//   node scripts/parity.mjs script
//     Writes figma-parity.js: a read-only Plugin API script carrying a checksum of the expected
//     state of each collection, of the text styles and of the effect styles. Run it in the file.
//     Where a checksum matches, that part is identical line for line. Where one does not, the
//     script returns its lines so the report can name every difference.
//
//   node scripts/parity.mjs report <result.json>
//     Turns that result into figma-parity.md. Exits 1 on any difference.
//
// A line is name | type | scopes | code syntax | value per mode. Colors are RGBA to four decimals,
// because Figma stores 32-bit floats. Scopes compare as a set, because Figma reorders them.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const [cmd, arg] = process.argv.slice(2);
if (!cmd || cmd === '--help') { console.log('Usage: node scripts/parity.mjs script | report <result.json>\nExit codes: 0 parity, 1 differences, 2 bad arguments or figma.json missing.'); process.exit(cmd ? 0 : 2); }
const pfile = resolve(ROOT, 'figma.json');
if (!existsSync(pfile)) { console.error('Error: figma.json is missing. Run node scripts/build.mjs first.'); process.exit(2); }
const payload = JSON.parse(readFileSync(pfile, 'utf8'));
const r4 = (n) => Math.round(n * 10000) / 10000;
const val = (x) =>
  x && typeof x === 'object' ? ('alias' in x ? `@${x.alias}` : [x.r, x.g, x.b, x.a].map(r4).join(','))
  : typeof x === 'number' ? String(r4(x)) : String(x);

const HASH = `const cyrb53 = (str, seed = 0) => { let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed; for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16); };`;
const cyrb53 = new Function(`${HASH} return cyrb53;`)();
const digest = (lines) => cyrb53([...lines].sort().join('\n'));

function expected() {
  const lines = {};
  for (const v of payload.variables) {
    const modes = payload.collections[v.collection].modes;
    lines[`${v.collection}|${v.name}`] = [v.type, [...v.scopes].sort().join(','), v.codeSyntax.WEB, modes.map((m) => val(v.values[m])).join(';')].join('|');
  }
  const fx = Object.fromEntries(payload.effectStyles.map((e) => [e.name, e.layers.map((l) => [val(l.color), l.offsetX, l.offsetY, l.blur, l.spread].join(' ')).join(';')]));
  const tx = Object.fromEntries(payload.textStyles.map((t) => [t.name, [t.fontFamily, t.fontStyle, r4(t.fontSize), r4(t.lineHeight), r4(t.letterSpacingPercent), t.textCase].join(' ')]));
  const modes = Object.fromEntries(Object.entries(payload.collections).map(([k, c]) => [k, c.modes.join(';')]));
  return { lines, fx, tx, modes };
}
function digests() {
  const { lines, fx, tx, modes } = expected();
  const cols = {};
  for (const name of Object.keys(modes)) {
    const own = Object.entries(lines).filter(([k]) => k.startsWith(`${name}|`)).map(([k, v]) => `${k.split('|')[1]}|${v}`);
    cols[name] = { modes: modes[name], count: own.length, digest: digest(own) };
  }
  const part = (o) => { const l = Object.entries(o).map(([k, v]) => `${k}|${v}`); return { count: l.length, digest: digest(l), names: Object.keys(o) }; };
  return { cols, fx: part(fx), tx: part(tx) };
}

const CHECK = `
const digest = lines => cyrb53([...lines].sort().join('\\n'));
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const all = await figma.variables.getLocalVariablesAsync();
const byId = new Map(all.map(v => [v.id, v]));
const r4 = n => Math.round(n * 10000) / 10000;
const val = x => x && typeof x === 'object' ? (x.type === 'VARIABLE_ALIAS' ? '@' + (byId.get(x.id)?.name ?? x.id) : [x.r, x.g, x.b, x.a ?? 1].map(r4).join(',')) : typeof x === 'number' ? String(r4(x)) : String(x);
const out = { capturedAt: new Date().toISOString(), collections: {}, effectStyles: null, textStyles: null };
for (const [name, want] of Object.entries(EXPECT.cols)) {
  const c = cols.find(x => x.name === name);
  if (!c) { out.collections[name] = { match: false, missing: true }; continue; }
  const modes = c.modes.map(m => m.name).join(';');
  const lines = c.variableIds.map(id => byId.get(id)).map(v => [v.name, v.resolvedType, [...v.scopes].sort().join(','), v.codeSyntax.WEB ?? '', c.modes.map(m => val(v.valuesByMode[m.modeId])).join(';')].join('|'));
  const d = digest(lines);
  const match = d === want.digest && lines.length === want.count && modes === want.modes;
  out.collections[name] = { match, count: lines.length, digest: d, modes, ...(match ? {} : { lines }) };
}
const fxs = (await figma.getLocalEffectStylesAsync()).filter(s => EXPECT.fx.names.includes(s.name));
const fxLines = fxs.map(s => s.name + '|' + s.effects.map(e => [val(e.color), e.offset.x, e.offset.y, e.radius, e.spread ?? 0].join(' ')).join(';'));
const fd = digest(fxLines);
out.effectStyles = { match: fd === EXPECT.fx.digest && fxLines.length === EXPECT.fx.count, count: fxLines.length, digest: fd, ...(fd === EXPECT.fx.digest ? {} : { lines: fxLines }) };
const txs = (await figma.getLocalTextStylesAsync()).filter(s => EXPECT.tx.names.includes(s.name));
const txLines = txs.map(s => s.name + '|' + [s.fontName.family, s.fontName.style, r4(s.fontSize), r4(s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value : 0), r4(s.letterSpacing.unit === 'PERCENT' ? s.letterSpacing.value : s.letterSpacing.value / s.fontSize * 100), s.textCase].join(' '));
const td = digest(txLines);
out.textStyles = { match: td === EXPECT.tx.digest && txLines.length === EXPECT.tx.count, count: txLines.length, digest: td, ...(td === EXPECT.tx.digest ? {} : { lines: txLines }) };
return out;
`;

if (cmd === 'script') {
  const out = `// Generated by scripts/parity.mjs from figma.json. Read-only.\n${HASH}\nconst EXPECT = ${JSON.stringify(digests())};\n${CHECK}`;
  writeFileSync(resolve(ROOT, 'figma-parity.js'), out);
  console.log(JSON.stringify({ wrote: 'figma-parity.js', variables: payload.variables.length, textStyles: payload.textStyles.length, effectStyles: payload.effectStyles.length }));
} else if (cmd === 'report') {
  if (!arg || !existsSync(resolve(arg))) { console.error('Error: give the path of the JSON the parity script returned.'); process.exit(2); }
  const r = JSON.parse(readFileSync(resolve(arg), 'utf8'));
  const { lines, fx, tx } = expected();
  const diffs = [];
  for (const [name, c] of Object.entries(r.collections)) {
    if (c.match) continue;
    if (c.missing) { diffs.push(['collection', name, 'exists', 'missing in Figma']); continue; }
    const want = Object.fromEntries(Object.entries(lines).filter(([k]) => k.startsWith(`${name}|`)).map(([k, v]) => [k.split('|')[1], v]));
    const got = Object.fromEntries((c.lines ?? []).map((l) => [l.split('|')[0], l.split('|').slice(1).join('|')]));
    if (c.modes !== payload.collections[name].modes.join(';')) diffs.push(['modes', name, payload.collections[name].modes.join(';'), c.modes]);
    for (const k of new Set([...Object.keys(want), ...Object.keys(got)]))
      if (want[k] !== got[k]) diffs.push(['variable', `${name} / ${k}`, want[k] ?? 'absent in code', got[k] ?? 'missing in Figma']);
  }
  const skipped = r.notInScope ?? [];
  for (const [kind, want, res] of [['effect style', fx, r.effectStyles], ['text style', tx, r.textStyles]]) {
    if (!res || res.match || res.skipped) continue;
    const got = Object.fromEntries((res.lines ?? []).map((l) => [l.split('|')[0], l.split('|')[1]]));
    for (const k of new Set([...Object.keys(want), ...Object.keys(got)]))
      if (want[k] !== got[k]) diffs.push([kind, k, want[k] ?? 'absent in code', got[k] ?? 'missing in Figma']);
  }
  const counts = Object.entries(r.collections).map(([n, c]) => `${n} ${c.count ?? 0}`).join(', ');
  let md = `<!-- Generated by scripts/parity.mjs. Do not edit. -->\n\n# Figma parity\n\nThe Figma file against \`figma.json\`, checked inside the file by \`figma-parity.js\`. Captured ${r.capturedAt}.\n\n`;
  md += `- **Variables:** ${payload.variables.length} in code. In Figma: ${counts}\n- **Text styles:** ${payload.textStyles.length} in code, ${r.textStyles?.skipped ? 'not synced' : r.textStyles?.count ?? 0} in Figma\n- **Effect styles:** ${payload.effectStyles.length} in code, ${r.effectStyles?.count ?? 0} in Figma\n- **Differences:** ${diffs.length}\n`;
  md += `\n| Part | Checksum | Match |\n|---|---|---|\n${Object.entries(r.collections).map(([n, c]) => `| ${n} | \`${c.digest ?? '-'}\` | ${c.match ? 'yes' : '**no**'} |`).join('\n')}\n| Text styles | \`${r.textStyles?.digest ?? '-'}\` | ${r.textStyles?.skipped ? 'not synced' : r.textStyles?.match ? 'yes' : '**no**'} |\n| Effect styles | \`${r.effectStyles?.digest ?? '-'}\` | ${r.effectStyles?.match ? 'yes' : '**no**'} |\n`;
  if (skipped.length) md += `\n## Not in this sync\n\n${skipped.map((n) => `- ${n}`).join('\n')}\n`;
  if (diffs.length) md += `\n## Differences\n\n| Kind | Token | Code | Figma |\n|---|---|---|---|\n${diffs.map((d) => `| ${d.join(' | ')} |`).join('\n')}\n`;
  writeFileSync(resolve(ROOT, 'figma-parity.md'), md);
  for (const d of diffs.slice(0, 20)) console.error(d.join(' | '));
  console.log(JSON.stringify({ differences: diffs.length, report: 'figma-parity.md' }));
  process.exit(diffs.length ? 1 : 0);
} else { console.error('Usage: node scripts/parity.mjs script | report <result.json>'); process.exit(2); }
