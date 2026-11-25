#!/usr/bin/env node
// Outlines live <text> in the brand's SVGs, from the brand's own font files. Shapes each line with
// HarfBuzz, so kerning, ligatures and the font's spacing hold exactly as a browser sets them.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, extname, join } from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, BRAND, walk, ext } from './lib/tokens.mjs';

const HELP = `Usage:
  node scripts/outline.mjs [file.svg ...]            Report every <text> and the font it would use
  node scripts/outline.mjs [file.svg ...] --write    Replace each <text> with an outlined <path>

With no file, reads every SVG under brand/assets/.

Fonts come from the token source: each font family's "files" list (src, weight, style), matched by
the text's font-family and nearest weight. A font file must be TrueType or OpenType (.ttf, .otf).
Shaping needs harfbuzzjs, which the library does not install by default. Once, in brand/tokens:
  npm install --no-save harfbuzzjs

Reads from each <text>, as attributes or in style="": x, y, font-family, font-weight, font-size,
letter-spacing (px or em), text-anchor, fill, transform. A <tspan> with no x, y, dx or dy of its own
is read as part of its line; one with its own position is refused, so split it into its own <text>.
Letter-spacing goes between characters, never after the last, so a line's width is its ink.

Each <path> keeps the line as aria-label, and the report gives every line's set width, so a mark
drawn to a line's width (a rule under a headline) can be measured from the outline.

Exit codes: 0 done or nothing to outline, 1 a text could not be outlined (no font file, a positioned
tspan), 2 bad arguments or harfbuzzjs missing.`;

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(HELP); process.exit(0); }
const write = args.includes('--write');
const unknown = args.filter((a) => a.startsWith('--') && a !== '--write');
if (unknown.length) { console.error(`Error: unknown option ${unknown[0]}. See --help.`); process.exit(2); }

// The SVGs to read: those named, or every one under brand/assets/.
const svgsUnder = (dir) => !existsSync(dir) ? [] : readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? svgsUnder(p) : extname(n).toLowerCase() === '.svg' ? [p] : [];
});
const named = args.filter((a) => !a.startsWith('--')).map((p) => resolve(p));
for (const p of named) if (!existsSync(p)) { console.error(`Error: ${p} does not exist.`); process.exit(2); }
const files = named.length ? named : svgsUnder(resolve(BRAND, 'assets'));

// The brand's font files, by family name, from the token source.
const families = [];
const readSrc = (f) => JSON.parse(readFileSync(resolve(ROOT, 'src', f), 'utf8'));
const srcFiles = existsSync(resolve(ROOT, 'src')) ? readdirSync(resolve(ROOT, 'src')).filter((f) => f.endsWith('.tokens.json')) : [];
for (const f of srcFiles) {
  for (const [path, token, type] of walk(readSrc(f))) {
    if (type !== 'fontFamily') continue;
    const list = Array.isArray(token.$value) ? token.$value : [token.$value];
    const fontFiles = (ext(token).files ?? []).map((x) => ({ ...x, path: [resolve(BRAND, x.src), resolve(ROOT, x.src)].find((p) => existsSync(p)) ?? resolve(BRAND, x.src) }));
    if (fontFiles.length) families.push({ token: path.join('.'), label: String(list[0]), name: String(list[0]).toLowerCase(), files: fontFiles });
  }
}

const attr = (tag, name) => {
  const style = tag.match(/\sstyle\s*=\s*"([^"]*)"/)?.[1] ?? '';
  const inStyle = style.split(';').map((d) => d.split(':').map((s) => s.trim())).find(([k]) => k === name)?.[1];
  return inStyle ?? tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`))?.[1];
};
const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&amp;/g, '&');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const WEIGHTS = { normal: 400, bold: 700, lighter: 300, bolder: 700 };

// Finds every <text>, what it says, and the font file it needs.
const jobs = [];
const problems = [];
for (const file of files) {
  const svg = readFileSync(file, 'utf8');
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const [whole, attrs, inner] = m;
    const where = `${relative(process.cwd(), file)}: "${decode(inner.replace(/<[^>]+>/g, '')).trim().slice(0, 40)}"`;
    if (/<tspan\b[^>]*\s(x|y|dx|dy)\s*=/.test(inner)) { problems.push(`${where}: a <tspan> carries its own position. Split it into its own <text>, then run again`); continue; }
    const tag = '<text' + attrs + '>';
    const text = decode(inner.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    const family = (attr(tag, 'font-family') ?? '').split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '').toLowerCase());
    const w = attr(tag, 'font-weight') ?? '400';
    const weight = WEIGHTS[w] ?? (parseFloat(w) || 400);
    const italic = /italic|oblique/.test(attr(tag, 'font-style') ?? '');
    const fam = families.find((f) => family.includes(f.name));
    if (!fam) { problems.push(`${where}: no font file for font-family "${attr(tag, 'font-family') ?? '(none)'}". Name a family the token source lists with files: ${families.map((f) => f.label).join(', ') || 'none'}`); continue; }
    const candidates = fam.files.filter((f) => (f.style === 'italic') === italic);
    const pick = (candidates.length ? candidates : fam.files).map((f) => ({ f, d: String(f.weight).includes(' ') ? (String(f.weight).split(' ').map(Number).reduce((a, b) => (weight >= a && weight <= b ? 0 : Math.min(Math.abs(weight - a), Math.abs(weight - b))))) : Math.abs(Number(f.weight) - weight) })).sort((a, b) => a.d - b.d)[0].f;
    if (!/\.(ttf|otf)$/i.test(pick.path)) { problems.push(`${where}: ${relative(BRAND, pick.path)} is not TrueType or OpenType. HarfBuzz here reads .ttf and .otf; keep one beside the web font`); continue; }
    if (!existsSync(pick.path)) { problems.push(`${where}: ${relative(BRAND, pick.path)} is missing`); continue; }
    const size = parseFloat(attr(tag, 'font-size') ?? '16');
    const ls = attr(tag, 'letter-spacing') ?? '0';
    const spacing = /em$/.test(ls) ? parseFloat(ls) * size : parseFloat(ls) || 0;
    jobs.push({ file, whole, where, text, size, spacing, x: parseFloat(attr(tag, 'x') ?? '0') || 0, y: parseFloat(attr(tag, 'y') ?? '0') || 0, anchor: attr(tag, 'text-anchor') ?? 'start', fill: attr(tag, 'fill'), transform: attr(tag, 'transform'), font: pick.path, weight: pick.weight, family: fam.token });
  }
}

if (!jobs.length) {
  console.log(JSON.stringify({ files: files.length, texts: 0, ...(problems.length ? { problems } : {}) }));
  for (const p of problems) console.error(p);
  process.exit(problems.length ? 1 : 0);
}

// harfbuzzjs from the library folder, where the help says to install it.
let hb;
try { hb = await import(createRequire(resolve(ROOT, 'package.json')).resolve('harfbuzzjs')); }
catch { try { hb = await import('harfbuzzjs'); } catch { console.error('Error: shaping needs harfbuzzjs. Run once, in brand/tokens: npm install --no-save harfbuzzjs'); process.exit(2); } }
if (hb.default && !hb.Blob) hb = await hb.default;

const fonts = new Map();
const fontFor = (p) => {
  if (!fonts.has(p)) { const face = new hb.Face(new hb.Blob(readFileSync(p))); fonts.set(p, { font: new hb.Font(face), upem: face.upem }); }
  return fonts.get(p);
};
const n = (v) => String(Math.round(v * 1000) / 1000);
// Rewrites a glyph's path from font units (y up) into the SVG's space at the pen position.
const place = (d, ox, oy, k) => d.replace(/([MLQCZ])([^MLQCZ]*)/g, (_, c, rest) => {
  const nums = (rest.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);
  const out = [];
  for (let i = 0; i < nums.length; i += 2) out.push(n(ox + nums[i] * k) + ' ' + n(oy - nums[i + 1] * k));
  return c + out.join(' ');
});

const report = [];
const edits = new Map();
for (const j of jobs) {
  const { font, upem } = fontFor(j.font);
  const buf = new hb.Buffer();
  buf.addText(j.text);
  buf.guessSegmentProperties();
  hb.shape(font, buf);
  const infos = buf.getGlyphInfos();
  const pos = buf.getGlyphPositions();
  const k = j.size / upem;
  let width = 0;
  pos.forEach((p, i) => { width += p.xAdvance * k + (i < pos.length - 1 ? j.spacing : 0); });
  let pen = j.x - (j.anchor === 'middle' ? width / 2 : j.anchor === 'end' ? width : 0);
  let d = '';
  let minX = Infinity, maxX = -Infinity;
  infos.forEach((g, i) => {
    const p = pos[i];
    const glyph = font.glyphToPath(g.codepoint);
    if (glyph) {
      const placed = place(glyph, pen + p.xOffset * k, j.y - p.yOffset * k, k);
      d += placed;
      for (const [, xs] of placed.matchAll(/(-?[\d.]+) -?[\d.]+/g)) { minX = Math.min(minX, +xs); maxX = Math.max(maxX, +xs); }
    }
    pen += p.xAdvance * k + (i < pos.length - 1 ? j.spacing : 0);
  });
  buf.destroy?.();
  const path = `<path aria-label="${esc(j.text)}"${j.fill ? ` fill="${esc(j.fill)}"` : ''}${j.transform ? ` transform="${esc(j.transform)}"` : ''} d="${d}"/>`;
  if (!edits.has(j.file)) edits.set(j.file, []);
  edits.get(j.file).push([j.whole, path]);
  report.push({ file: relative(process.cwd(), j.file), text: j.text, font: relative(BRAND, j.font), size: j.size, setWidth: +n(width), ink: Number.isFinite(minX) ? { x: +n(minX), width: +n(maxX - minX) } : null });
}

if (write) for (const [file, list] of edits) {
  let svg = readFileSync(file, 'utf8');
  for (const [from, to] of list) svg = svg.replace(from, to);
  writeFileSync(file, svg);
}
for (const p of problems) console.error(p);
console.log(JSON.stringify({ files: files.length, texts: report.length, write, lines: report, ...(problems.length ? { problems } : {}), ...(write ? {} : { next: 'Check each line and its font, then run again with --write.' }) }, null, 2));
process.exit(problems.length ? 1 : 0);
