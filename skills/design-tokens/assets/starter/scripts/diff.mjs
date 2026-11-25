#!/usr/bin/env node
// Compares two builds token by token, after every alias is resolved. Run it around a refactor:
// a rename or a repointed alias that changes no rendered value shows nothing here.
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const HELP = `Usage:
  node scripts/diff.mjs --snapshot          Save the current tokens.json as the "before"
  node scripts/diff.mjs                     Compare that snapshot with the current build
  node scripts/diff.mjs <old.json> <new.json>

Options:
  --rename LIST   old=new pairs, comma-separated, applied to the "before" names first. A trailing *
                  renames a prefix: layout-*=container-*. For a kit whose hand-added group now has a
                  contract name, so a move that keeps every value shows as no difference

Prints every token whose resolved value changed, appeared or disappeared, per theme.
Exit codes: 0 no difference, 1 differences, 2 a file is missing.`;
const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(HELP); process.exit(0); }
const now = resolve(ROOT, 'tokens.json');
const snap = resolve(ROOT, '.tokens.before.json');
if (args.includes('--snapshot')) {
  if (!existsSync(now)) { console.error('Error: tokens.json is missing. Run node scripts/build.mjs first.'); process.exit(2); }
  copyFileSync(now, snap);
  console.log(JSON.stringify({ snapshot: '.tokens.before.json' }));
  process.exit(0);
}
const ri = args.indexOf('--rename');
const renames = ri >= 0 ? String(args[ri + 1] ?? '').split(',').filter(Boolean).map((p) => p.split('=').map((s) => s.trim().replace(/^--/, ''))) : [];
if (renames.some((r) => r.length !== 2 || !r[0] || !r[1])) { console.error('Error: --rename takes old=new pairs, such as layout-content=container-content.'); process.exit(2); }
const files = args.filter((x, i) => !x.startsWith('--') && i !== ri + 1);
const [a, b] = files.length >= 2 ? files.map((p) => resolve(p)) : [snap, now];
for (const f of [a, b]) if (!existsSync(f)) { console.error(`Error: ${f} is missing. Take a snapshot first with --snapshot.`); process.exit(2); }
const [raw, next] = [a, b].map((f) => JSON.parse(readFileSync(f, 'utf8')).themes);
const renamed = [];
const rename = (k) => {
  for (const [from, to] of renames) {
    if (from.endsWith('*') && k.startsWith(from.slice(0, -1))) return to.replace(/\*$/, '') + k.slice(from.length - 1);
    if (k === from) return to;
  }
  return k;
};
const old = Object.fromEntries(Object.entries(raw).map(([t, o]) => [t, Object.fromEntries(Object.entries(o).map(([k, v]) => { const n = rename(k); if (n !== k && !renamed.includes(`${k}=${n}`)) renamed.push(`${k}=${n}`); return [n, v]; }))]));
const diffs = [];
for (const theme of new Set([...Object.keys(old), ...Object.keys(next)])) {
  const [o, n] = [old[theme] ?? {}, next[theme] ?? {}];
  for (const k of new Set([...Object.keys(o), ...Object.keys(n)])) {
    const [x, y] = [JSON.stringify(o[k]), JSON.stringify(n[k])];
    if (x !== y) diffs.push({ theme, token: k, before: o[k] ?? null, after: n[k] ?? null });
  }
}
for (const d of diffs.slice(0, 200)) console.error(`[${d.theme}] ${d.token}: ${JSON.stringify(d.before)} → ${JSON.stringify(d.after)}`);
console.log(JSON.stringify({ differences: diffs.length, ...(renamed.length ? { renamed } : {}) }));
process.exit(diffs.length ? 1 : 0);
