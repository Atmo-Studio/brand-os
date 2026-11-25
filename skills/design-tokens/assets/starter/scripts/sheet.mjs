#!/usr/bin/env node
// Renders the brand standards sheet: one tall page of boards, built from the tokens and the
// brand's written files, so it cannot drift from either. Every color, size and family on it is a
// token. Every line of copy is the brand's own. Every board is one 1920 by 1080 frame, and its
// layout fills the frame.
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, BRAND } from './lib/tokens.mjs';
import { contrast, composite } from './lib/color.mjs';

const HELP = `Usage: node scripts/sheet.mjs [options]

Writes ../standards.html from tokens.json and the brand's files. Run the build first.

Options:
  --boards LIST   Only these boards, comma-separated: cover, idea, logo-candidates, logo,
                  logo-rules, misuse, palette, ramps, chroma, pairs, contrast, typefaces, scale,
                  type, compose, space, layout, motion, imagery, in-use, rules, colophon. Groups: "logos"
                  (logo-candidates, logo, logo-rules, misuse), "color" (palette, ramps, chroma,
                  pairs, contrast), "type" (typefaces, scale, type, compose)
  --draft         Write ../review.html instead, marked as a draft. For review rounds
  --theme NAME    Render a theme other than the default
  --pdf           Also print ../standards.pdf, one page, with a Chromium-family browser, and
                  measure every board against its frame
  --help          Show this text

Reads, when present: ../DESIGN.md, ../core-idea.md, ../logo.md, ../motion.md, ../sheet.json,
../assets/. A board with nothing to show is left out. A motif that names a drawn file is drawn from
it when the file is the motif alone, never when it is marked reference or holds lettering, and the roles are read by name (display, heading, body, ticket, figure), not by size.

Output: one JSON line on stdout.
Exit codes: 0 written, 2 tokens.json missing, 3 --pdf asked and no browser was found.`;
const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(HELP); process.exit(0); }
const opt = (n) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : undefined);
const draft = args.includes('--draft');

const tfile = resolve(ROOT, 'tokens.json');
if (!existsSync(tfile)) { console.error('Error: tokens.json is missing. Run node scripts/build.mjs first.'); process.exit(2); }
const built = JSON.parse(readFileSync(tfile, 'utf8'));
const theme = opt('theme') ?? built.default;
const T = built.themes[theme];
const M = built.meta[theme];
if (!T) { console.error(`Error: no theme "${theme}". Available: ${Object.keys(built.themes).join(', ')}`); process.exit(2); }

// The sheet paints with these roles. A missing one would fall back to whatever the page inherits,
// which renders without error and reads wrong, so it stops here instead.
const NEEDS = ['color-bg-page', 'color-bg-inverse', 'color-text-primary', 'color-text-secondary', 'color-text-inverse', 'color-text-on-accent', 'color-accent-bg', 'color-action-bg', 'color-action-text', 'color-border-subtle', 'color-border-default'];
const absent = NEEDS.filter((k) => T[k] === undefined);
if (absent.length) { console.error(`Error: the sheet needs these roles and the library does not define them: ${absent.map((k) => k.replace('color-', '').replace('-', '.')).join(', ')}. Add them to src/intent.${theme}.tokens.json, each with its pair.`); process.exit(2); }

// ── The brand's files ────────────────────────────────────────────────────────
const read = (f) => (existsSync(resolve(BRAND, f)) ? readFileSync(resolve(BRAND, f), 'utf8') : '');
const stripFm = (t) => t.replace(/^---\n[\s\S]*?\n---\n?/, '');
const fmField = (t, k) => (t.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) ?? [])[1] ?? '';
const sections = (t) => {
  const out = {};
  let cur = '_';
  for (const line of stripFm(t).split('\n')) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) { cur = h[1].trim(); out[cur] = ''; continue; }
    if (/^#\s/.test(line)) continue;
    out[cur] = (out[cur] ?? '') + line + '\n';
  }
  return out;
};
const paras = (s = '') => s.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^[-|<#]/.test(p) && !/^\d+\./.test(p));
const bullets = (s = '') => s.split('\n').filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, '').trim());
const table = (s = '') => {
  const rows = s.split('\n').filter((l) => /^\|/.test(l.trim())).map((l) => l.trim().slice(1, -1).split('|').map((c) => c.trim()));
  if (rows.length < 3) return [];
  const head = rows[0].map((h) => h.toLowerCase());
  return rows.slice(2).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
};
const subsections = (s = '') => {
  const out = [];
  let cur = null;
  for (const line of s.split('\n')) {
    const h = line.match(/^###\s+(.*)$/);
    if (h) { cur = { title: h[1].trim(), body: '' }; out.push(cur); } else if (cur) cur.body += line + '\n';
  }
  return out;
};
// A board carries one sentence of the brand's own at most. The rest stays in the file it came from.
const sentence = (s = '') => (String(s).replace(/\s+/g, ' ').trim().match(/^.*?[.!?](?=\s|$)/) ?? [String(s).trim()])[0];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Prose names tokens. On the sheet a token shows its name and its value, so a step number is
// never read as a size. A color token also shows its swatch.
const GROUP = { colors: 'color', rounded: 'radius', typography: 'type' };
const valueOf = (g, n) => {
  const v = T[`${GROUP[g] ?? g}-${n.replaceAll('.', '-')}`];
  if (v === undefined || v === null) return '';
  if (typeof v === 'object') return v.fontSize ? String(v.fontSize) : '';
  const r = String(v).match(/^(-?[\d.]+)rem$/);
  return r ? `${+(parseFloat(r[1]) * 16).toFixed(2)}px` : String(v);
};
const inline = (s) =>
  esc(s)
    // The swatch is a glyph in the same run of text, so a line with a token in it imports into a
    // design tool as one text layer, never split around a box.
    .replace(/\{colors\.([\w-]+)\}/g, (_, n) => `<span class="tok"><span class="sw" style="color:var(--color-${n})">\u25cf</span>\u00a0${n}</span>`)
    .replace(/\{([a-z]+)\.([\w.-]+)\}/g, (_, g, n) => { const v = valueOf(g, n); return `<span class="tok">${GROUP[g] ?? g}-${n.replaceAll('.', '-')}${v ? `, ${v}` : ''}</span>`; })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, (m, t) => { const v = valueOf(t.split('.')[0], t.split('.').slice(1).join('.')) || (T[t.replaceAll('.', '-')] !== undefined ? String(T[t.replaceAll('.', '-')]) : ''); return v ? esc(v) : `<span class="tok">${t}</span>`; });
const labelled = (items) => Object.fromEntries(items.map((b) => { const m = b.match(/^\*\*(.+?):?\*\*:?\s*(.*)$/); return m ? [m[1].replace(/:$/, '').toLowerCase(), m[2]] : null; }).filter(Boolean));

const design = read('DESIGN.md');
const D = sections(design);
const ideaDoc = read('core-idea.md');
const I = sections(ideaDoc);
const L = sections(read('logo.md'));
const Mo = sections(read('motion.md'));
const sheetCfg = existsSync(resolve(BRAND, 'sheet.json')) ? JSON.parse(read('sheet.json')) : {};
const brandName = fmField(design, 'name') || sheetCfg.name || 'Brand';
const idea = paras(I._)[0] ?? '';
const overview = paras(D.Overview ?? D['Brand & Style'] ?? '');
const copy = {
  display: idea || brandName,
  heading: (overview[0] ?? idea).split(/(?<=\.)\s/)[0] || brandName,
  subheading: (overview[1] ?? overview[0] ?? idea).split(/(?<=\.)\s/)[0] || brandName,
  body: overview[0] ?? idea,
  label: brandName,
  cta: '',
  nav: [],
  ...Object.fromEntries(Object.entries(sheetCfg.copy ?? {}).filter(([k]) => k !== 'roles')),
};
// A sample for a type role may sit in copy.roles.<role>, or beside the other lines as copy.<role>.
// copy.nav is the list of links the In use board reads, so a role named nav keeps its sample under
// copy.roles.nav. The list may be written as an array or as one string split by slashes.
const roleCopy = sheetCfg.copy?.roles ?? {};
const sampleFor = (name) => roleCopy[name] ?? (typeof copy[name] === 'string' ? copy[name] : undefined);
const navLinks = Array.isArray(copy.nav) ? copy.nav : typeof copy.nav === 'string' ? copy.nav.split(/\s*[\/|,\u00b7]\s*/).filter(Boolean) : [];
const version = sheetCfg.version ?? '0.1';
const date = sheetCfg.date ?? new Date().toISOString().slice(0, 7);

// ── Assets, inlined so the file stands alone ─────────────────────────────────
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const asset = (p) => {
  // A path may be written from the brand folder or from the project folder that holds it.
  const clean = String(p ?? '').replace(/`/g, '').trim().replace(/^brand\//, '');
  const file = resolve(BRAND, clean);
  if (!clean || !existsSync(file)) return null;
  const ext = extname(file).toLowerCase();
  if (!MIME[ext]) return null;
  const raw = readFileSync(file);
  // An SVG's own proportions size the shapes drawn from it, such as a misuse recolored through a mask.
  const vb = ext === '.svg' ? (raw.toString('utf8').match(/viewBox="[\d.\s-]*?\s([\d.]+)\s+([\d.]+)"/) ?? []) : [];
  const w = ext === '.svg' ? Number((raw.toString('utf8').match(/<svg[^>]*\swidth="([\d.]+)"/) ?? [])[1] ?? 0) : 0;
  return { src: `data:${MIME[ext]};base64,${raw.toString('base64')}`, ratio: vb[1] ? Number(vb[1]) / Number(vb[2]) : null, width: w || null };
};
const picture = (p, cls = '') => {
  const a = p && asset(p);
  return a ? `<img class="art ${cls}" src="${a.src}" alt="">` : '';
};
let fontCss = existsSync(resolve(ROOT, 'fonts.css')) ? readFileSync(resolve(ROOT, 'fonts.css'), 'utf8') : '';
fontCss = fontCss.replace(/url\("\.\.\/([^"]+)"\)/g, (m, p) => { const a = asset(p); return a?.src ? `url("${a.src}")` : m; });
const tokensCss = readFileSync(resolve(ROOT, 'tokens.css'), 'utf8');

// ── Token helpers ────────────────────────────────────────────────────────────
const has = (k) => T[k] !== undefined;
const px = (v) => parseFloat(v);
const roles = Object.entries(T).filter(([k, v]) => k.startsWith('type-') && v && typeof v === 'object').map(([k, v]) => ({ key: k, name: k.slice(5), ...v, size: px(v.fontSize) })).sort((a, b) => b.size - a.size);
const near = (target) => roles.reduce((b, r) => (Math.abs(r.size - target) < Math.abs(b.size - target) ? r : b), roles[0]);
// A role is found by the name the brand gave it first, and by its size only when it has no such role.
// The largest role is often a figure, not the display line, so size alone picks the wrong one.
const byName = (...ns) => roles.find((r) => ns.includes(r.name));
const R = { display: byName('display') ?? roles[0], title: byName('heading', 'title') ?? near(36), lede: byName('subheading', 'lede') ?? near(20), body: byName('body') ?? near(16), meta: byName('caption', 'meta', 'label') ?? near(12), ticket: byName('ticket') ?? null, figure: byName('figure') ?? null, action: byName('action', 'button') ?? null };
// Every property a role sets, so a specimen carries its width, its figures and its case with it.
const rs = (r, extra = '') => `font:var(--${r.key});letter-spacing:var(--${r.key}-letter-spacing)${r.fontStretch ? `;font-stretch:var(--${r.key}-font-stretch)` : ''}${r.fontFeatureSettings ? `;font-feature-settings:var(--${r.key}-font-feature-settings)` : ''}${r.textTransform ? `;text-transform:${r.textTransform}` : ''}${extra ? `;${extra}` : ''}`;
// Values sit in a monospaced face. Use the brand's own when it has one.
const MONO = Object.keys(T).find((k) => /^font-family-.*mono/.test(k) && roles.some((r) => String(r.fontFamily).includes(String(T[k]).split(',')[0].replaceAll('"', '').trim())));
const stepOf = (k) => (M.aliases[k] ?? '').replace(/^color-/, '');
const hex = (k) => T[k];
const families = Object.entries(T).filter(([k]) => k.startsWith('font-family-')).map(([k, v]) => ({ key: k, name: k.slice(12), stack: v, first: String(v).split(',')[0].replaceAll('"', '').trim() }));
const pairs = existsSync(resolve(ROOT, 'src/pairs.json')) ? JSON.parse(readFileSync(resolve(ROOT, 'src/pairs.json'), 'utf8')).contrast ?? [] : [];
const cssKey = (path) => path.replace(/^(brand|intent|patterns)\./, '').replaceAll('.', '-');
const ramps = Object.entries(M.ramps ?? {});
const fixed = Object.entries(M.fixed ?? {});
const onGround = (bg) => (contrast(hex('color-text-primary') ?? '#000000', bg) >= contrast(hex('color-text-inverse') ?? '#ffffff', bg) ? 'color-text-primary' : 'color-text-inverse');
const label = (k) => k.replace(/^color-/, '');
// The grounds the sheet paints with are the brand's main grounds: the page, the inks the proportion
// names, the inverse, the accent and the action fill. Never a surface, a raised or sunken ground or a
// subtle tint: those are interface states, and as panels they read as a second palette.
const MINOR = /(surface|raised|sunken|subtle|field-subtle|status|hover|pressed|disabled)/;
const mainGrounds = (() => {
  const fromProp = Object.keys(M.proportion ?? sheetCfg.proportion ?? {}).map((k) => `color-${cssKey(k).replace(/^color-/, '')}`).filter((k) => /(^color-bg-|-bg$)/.test(k));
  const out = [];
  for (const k of ['color-bg-page', ...fromProp, 'color-bg-inverse', 'color-accent-bg', 'color-action-bg']) if (has(k) && !MINOR.test(k) && String(hex(k)).startsWith('#') && !out.some((g) => String(hex(g)).toLowerCase() === String(hex(k)).toLowerCase())) out.push(k);
  return out;
})();
// A diagram line (a curve's frame, a construction guide, a chart's grid) must clear 3 to 1 on its
// ground, or it disappears. The first border or text role that does, or else the ground's text color
// at the lowest opacity that does.
const textOn = (g) => (g === 'color-bg-inverse' ? 'color-text-inverse' : onGround(String(hex(g))));
const lineFor = (g) => {
  const bg = String(hex(g));
  const role = ['color-border-default', 'color-border-strong', 'color-text-secondary'].find((k) => has(k) && String(hex(k)).startsWith('#') && contrast(String(hex(k)), bg) >= 3);
  if (role) return `var(--${role})`;
  const t = textOn(g);
  for (let a = 30; a <= 100; a += 5) if (contrast(composite(String(hex(t)), a / 100, bg), bg) >= 3) return `color-mix(in srgb, var(--${t}) ${a}%, transparent)`;
  return `var(--${t})`;
};
// A hairline between sections only has to be seen. The subtle border where it reads on the ground,
// the diagram line where it does not.
const ruleFor = (g) => (has('color-border-subtle') && contrast(String(hex('color-border-subtle')), String(hex(g))) >= 1.4 ? 'var(--color-border-subtle)' : lineFor(g));

// ── Board anatomy ────────────────────────────────────────────────────────────
// Every board is one fixed frame: a title and at most one sentence, the body, and the metadata row
// along the bottom. The body takes whatever height is left, and each board's layout fills it.
let n = 0;
const pad = (i) => String(i).padStart(2, '0');
const numbers = {};
const titles = {};
const foot = (title, i) => `<footer class="b-foot t-meta"><span>${esc(brandName)}</span><span>Brand standards${draft ? ', draft for review' : ''}</span><span>${pad(i)} ${esc(title)}</span><span>Version ${esc(version)}, ${esc(date)}</span></footer>`;
const board = (id, title, ground, body, { lede = '', cls = '', at } = {}) => {
  const i = at ?? ++n;
  numbers[id] ??= i;
  titles[id] ??= title;
  return `<section class="board g-${ground} ${cls}" id="b-${id}" data-board="${id}">
  <header class="b-head"><h2 class="t-title">${esc(title)}</h2>${lede ? `<p class="t-body b-lede">${inline(sentence(lede))}</p>` : ''}</header>
  <div class="b-body">${body}</div>
  ${foot(title, i)}
</section>`;
};
// A cross drawn corner to corner, the mark of something not to do. Its ends are percentages, not a
// stretched viewBox, so a design tool importing the page keeps the hairline a hairline.
const cross = '<svg class="x-out" aria-hidden="true"><line x1="0" y1="0" x2="100%" y2="100%"/><line x1="100%" y1="0" x2="0" y2="100%"/></svg>';
// One hairline slash across a misuse drawing.
const slash = '<svg class="slash" aria-hidden="true"><line x1="8%" y1="10%" x2="92%" y2="90%"/></svg>';
// A last row shorter than the grid stretches its tiles across, so no grid leaves a hole.
const fillRow = (count, cols) => {
  const r = count % cols;
  if (!r) return () => '';
  const base = Math.floor(cols / r), extra = cols % r;
  return (i) => (i < count - r ? '' : `grid-column:span ${base + (i - (count - r) < extra ? 1 : 0)}`);
};
// Columns for a count of tiles in a frame, chosen so each tile comes nearest a given proportion.
const columnsFor = (count, w, h, aspect, gap = 16) => {
  let best = 1, err = Infinity;
  for (let c = 1; c <= count; c++) {
    const rows = Math.ceil(count / c);
    const tw = (w - (c - 1) * gap) / c, th = (h - (rows - 1) * gap) / rows;
    const e = Math.abs(Math.log(tw / th / aspect));
    if (e < err) { err = e; best = c; }
  }
  return best;
};
// The body's size inside a frame: 1920 by 1080, less the padding, the head, the footer and the gaps.
const BODY = { w: 1776, h: 776 };

const B = {};

// Logo: the versions table in logo.md, or the name set in type when there are no files.
const versions = table(L.Versions).map((r) => ({ name: r.version ?? '', file: r.file ?? '', ground: ((r.ground ?? r['use on'] ?? '').match(/\{colors\.([\w-]+)\}/) ?? [])[1] ?? 'bg-page', use: r.use ?? r['use for'] ?? '' }));
const primary = versions.find((v) => asset(v.file));
const warnings = [];
// A logo file is read before it is trusted: a fill that matches its ground cannot be seen.
for (const v of versions) {
  const file = resolve(BRAND, v.file.replace(/`/g, '').trim().replace(/^brand\//, ''));
  const ground = T[`color-${v.ground}`];
  if (!existsSync(file) || extname(file).toLowerCase() !== '.svg') continue;
  const svgText = readFileSync(file, 'utf8');
  // Live text renders in whatever font the viewer has, and the sheet, a browser or a design tool
  // that lacks the face falls back to a default serif. A logo is outlines.
  if (/<text[\s>]/.test(svgText)) warnings.push(`${v.name}: ${v.file.replace(/`/g, '')} holds live text, a <text> element, which renders in a fallback font wherever the face is not installed. Convert the lettering to outlines.`);
  if (!String(ground).startsWith('#')) continue;
  const fills = [...new Set((svgText.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toLowerCase()))];
  const lost = fills.filter((h) => contrast(h, ground) < 1.5);
  if (lost.length) warnings.push(`${v.name}: ${lost.join(', ')} in ${v.file.replace(/`/g, '')} sits ${contrast(lost[0], ground).toFixed(2)} to 1 against ${v.ground}. If that color is the lettering or the mark, this file was drawn for another ground. If it only sits inside another shape, it is fine.`);
}
// The version drawn for the ground it will sit on, or the first one when none names that ground.
const versionFor = (ground) => versions.find((x) => x.ground === ground && asset(x.file)) ?? primary;
const wordmark = (cls = '', ground = 'bg-page') => {
  const v = versionFor(ground);
  return v ? picture(v.file, cls) : `<span class="typed ${cls}">${esc(brandName)}</span>`;
};

B.cover = () => {
  n++;
  const img = sheetCfg.images?.cover && asset(sheetCfg.images.cover);
  return `<section class="board cover g-inverse" id="b-cover" data-board="cover"${img?.src ? ` style="background-image:url('${img.src}')"` : ''}>
  <div class="cover-mark">${wordmark('', 'bg-inverse')}</div>
  <div class="cover-meta t-meta"><span>${esc(brandName)}</span><span>Brand standards${draft ? ', draft for review' : ''}</span><span>Version ${esc(version)}</span><span>${esc(date)}</span></div>
</section>`;
};

// The contents: one line per chapter, numbered by the board it opens on. Its slot is held while the
// other boards render, then filled.
B.contents = () => { n++; return '%%CONTENTS%%'; };
const CHAPTERS = [['Core idea', ['idea']], ['Logo', ['logo-candidates', 'logo', 'logo-rules', 'misuse']], ['Color', ['palette', 'ramps', 'chroma', 'pairs', 'contrast']], ['Typography', ['typefaces', 'scale', 'type', 'compose']], ['Space and motion', ['space', 'layout', 'motion']], ['Imagery', ['imagery']], ['In use', ['in-use', 'rules']], ['Files', ['colophon']]];
const contents = () => {
  const rows = CHAPTERS.map(([t, ids]) => [t, ids.map((i) => numbers[i]).filter(Boolean)[0]]).filter(([, i]) => i);
  return board('contents', 'Contents', 'page', `<ol class="contents" style="grid-template-rows:repeat(${rows.length},1fr)">${rows.map(([t, i]) => `<li><span>${pad(i)}</span><span>${esc(t)}</span></li>`).join('')}</ol>`, { at: 2 });
};

// A motif is drawn from its construction, in live type and tokens, so it keeps its rules at any size.
// `- **Draw:**` names the construction: `under-rule`, a bar under the headline, `ruled-line`, a line of
// facts in a type role with a hairline under it, or `figure`, a measured number with its unit.
// With no Draw line the sheet reads the construction and placement for one; with neither, the board
// shows the motif's artwork and the In use board leaves it out. A drawn file, where the motif names
// one and it is the motif alone, wins over the sheet's own drawing of it: the file is the brand's
// construction, the drawing a guess.
// A motif's file is placed only when it is the motif alone. A file the manifest or the motif marks
// as reference, or one that holds lettering, shows construction around copy of its own, so the
// sheet builds the motif from its tokens instead and never draws the file.
const manifestText = read('assets/manifest.md');
const placeable = (m) => {
  if (!m.file || /reference/i.test(m.file)) return null;
  const a = asset(m.file);
  if (!a) return null;
  const rel = String(m.file).replace(/`/g, '').trim().replace(/^brand\//, '').replace(/^assets\//, '');
  const row = manifestText.split('\n').find((l) => l.startsWith('|') && l.includes(rel));
  if (row && /reference|not placed/i.test(row)) return null;
  const file = resolve(BRAND, String(m.file).replace(/`/g, '').trim().replace(/^brand\//, ''));
  if (extname(file).toLowerCase() === '.svg' && /<text[\s>]/.test(readFileSync(file, 'utf8'))) {
    warnings.push(`Motif ${m.title}: ${rel} holds lettering, so the sheet builds the motif from its tokens and leaves the file off. Redraw it as the motif alone, or mark it reference in the manifest.`);
    return null;
  }
  return a;
};
const placeCache = new Map();
const placed = (m) => { const k = `${m.title}|${m.file}`; if (!placeCache.has(k)) placeCache.set(k, placeable(m)); return placeCache.get(k); };
const motifList = subsections(I.Motifs ?? '').map((m) => ({ title: m.title, ...labelled(bullets(m.body)) }));
const tokIn = (t, g) => [...String(t ?? '').matchAll(new RegExp(`\\{${g}\\.([\\w.-]+)\\}`, 'g'))].map((x) => x[1].replaceAll('.', '-'));
// A token written in backticks, as the motif files write them: `stroke-rim`, `spacing-24`.
const ticks = (t) => [...String(t ?? '').matchAll(/`([a-z][\w-]*)`/g)].map((x) => x[1]);
const motifKind = (m) => {
  const d = String(m.draw ?? '').toLowerCase().match(/under-rule|ruled-line|figure/)?.[0];
  if (d) return d;
  const c = m.construction ?? '', pl = m.placement ?? '';
  if (/\bfigure\b/i.test(m.title ?? '') && R.figure) return 'figure';
  if (/headline|title/i.test(pl) && /\b(bar|rule|underline)\b/i.test(c)) return 'under-rule';
  if (/hairline|\brules?\b/i.test(c) && /edge|top|bottom/i.test(pl)) return 'ruled-line';
  return null;
};
const paintOf = (c, fallback = 'currentColor') => {
  const t = tokIn(c, 'colors')[0];
  if (t && has(`color-${t}`)) return `var(--color-${t})`;
  const b = ticks(c).find((x) => /^color-/.test(x) && has(x));
  return b ? `var(--${b})` : fallback;
};
const roleIn = (c) => { const n = (String(c).match(/type role\s+`?([\w-]+)`?/i) ?? [])[1] ?? tokIn(c, 'typography')[0]; return roles.find((r) => r.name === n) ?? null; };
const lenOf = (name, fallback) => (name && has(name) ? `var(--${name})` : fallback);
const drawMotif = (m, text, { ink, useFile = false } = {}) => {
  const c = m.construction ?? '';
  const kind = motifKind(m);
  const paint = ink ?? paintOf(c);
  const file = placed(m);
  if (kind === 'under-rule') {
    const sp = tokIn(c, 'spacing');
    const hName = (c.match(/`((?:stroke|spacing)-[\w-]+)`\s+tall/) ?? [])[1] ?? ((c.match(/height of `?\{spacing\.([\w-]+)\}/) ?? [])[1] ?? sp[0] ? `spacing-${(c.match(/height of `?\{spacing\.([\w-]+)\}/) ?? [])[1] ?? sp[0]}` : null);
    const wName = (c.match(/`(spacing-[\w-]+)`\s+wide/) ?? [])[1];
    const gName = (c.match(/`(spacing-[\w-]+)`\s+below/) ?? [])[1] ?? ((c.match(/gap of `?\{spacing\.([\w-]+)\}/) ?? [])[1] ?? sp[1] ? `spacing-${(c.match(/gap of `?\{spacing\.([\w-]+)\}/) ?? [])[1] ?? sp[1]}` : null);
    const gap = lenOf(gName, '8px');
    // A drawn bar keeps its own size. Otherwise the bar is as tall and as wide as the construction says,
    // and as wide as the headline when it names no width.
    const bar = file ? `<img class="art m-rim" src="${file.src}" alt="" style="margin-top:${gap}">` : `<i style="display:block;height:${lenOf(hName, '8px')};margin-top:${gap};background:${paint}${wName ? `;width:${lenOf(wName, 'auto')}` : ''}"></i>`;
    return `<div class="m-under${file || wName ? ' fixed' : ''}"><p style="${rs(R.display)}">${esc(text)}</p>${bar}</div>`;
  }
  if (kind === 'ruled-line') {
    if (file && useFile) return `<img class="art m-file" src="${file.src}" alt="" style="width:${(file.width ?? 384) * 1.5}px">`;
    const r = roleIn(c) ?? R.ticket ?? R.meta;
    const w = lenOf(has('stroke-hairline') ? 'stroke-hairline' : null, '1px');
    const two = /(above and below|between two|two (hair)?lines|top and bottom)/i.test(c);
    const below = lenOf((c.match(/Below the line:\s*`(spacing-[\w-]+)`/i) ?? [])[1] ?? (has('spacing-2') ? 'spacing-2' : null), '8px');
    return `<div class="m-ruled" style="${rs(r)};color:${paint};border-color:${paint};border-width:${two ? `${w} 0` : `0 0 ${w}`};padding:${two ? `${below} 0` : `0 0 ${below}`}${/uppercase|capitals/i.test(c) && !r.textTransform ? ';text-transform:uppercase' : ''}"><span>${esc(text)}</span>${copy.ticketNumber ? `<span>${esc(copy.ticketNumber)}</span>` : ''}</div>`;
  }
  if (kind === 'figure') {
    const r = roleIn(c) ?? R.figure ?? R.display;
    const unit = R.ticket ?? R.meta;
    const accent = ticks(c).find((x) => /^color-accent/.test(x) && has(x));
    return `<div class="m-figure"><p style="${rs(r)};color:${paint === 'currentColor' ? 'var(--color-text-primary)' : paint}">${esc(text)}</p>${copy.figureUnit ? `<p style="${rs(unit)};color:${accent ? `var(--${accent})` : 'inherit'}">${esc(copy.figureUnit)}</p>` : ''}</div>`;
  }
  return '';
};

// The display line is sized to fit the frame: as large as the display role allows, smaller when the
// sentence is long, so it never pushes the motif cards into the footer. Its line count is estimated
// from an average glyph a little wider than most display faces set, so the estimate errs short.
const lineHeightOf = (r) => { const v = String(r.lineHeight ?? ''); const n = parseFloat(v); return !n ? 1.1 : /px$/.test(v) ? n / r.size : /%$/.test(v) ? n / 100 : n; };
const fitDisplay = (text, budget, from) => {
  const chars = String(text).length, lh = lineHeightOf(R.display);
  for (let size = Math.round(from); size > 32; size -= 2) {
    const lines = Math.ceil((chars * 0.58 * size) / (BODY.w * 0.92));
    if (lines * size * lh <= budget) return size;
  }
  return 32;
};
// The motif cards keep at least this much height, whatever the sentence above them.
const MOTIF_MIN = 300;
B.idea = () => {
  if (!idea) return '';
  const motifs = subsections(I.Motifs ?? '').map((m) => ({ title: m.title, ...labelled(bullets(m.body)) }));
  const shown = motifs.slice(0, 3);
  const line = sentence(idea).replace(/\*\*|`/g, '');
  const size = shown.length ? fitDisplay(line, BODY.h - MOTIF_MIN - 48, R.display.size) : fitDisplay(line, BODY.h, R.display.size * 1.5);
  return board('idea', 'Core idea', 'page', `<div class="idea${shown.length ? '' : ' alone'}">
    <p class="idea-line t-display" style="font-size:${size}px">${inline(sentence(idea))}</p>
    ${shown.length ? `<div class="motifs" style="grid-template-columns:repeat(${shown.length},1fr)">${shown.map((m) => `<figure class="motif"><div class="motif-art${motifKind(m) ? ' drawn' : ''}">${motifKind(m) ? drawMotif(m, { 'under-rule': copy.display, 'ruled-line': copy.ticket ?? copy.label, figure: copy.figure ?? '' }[motifKind(m)], { useFile: true }) : placed(m) ? `<img class="art" src="${placed(m).src}" alt="">` : ''}</div><figcaption><b class="t-lede">${esc(m.title)}</b>${m.placement ? `<span class="t-body">${inline(sentence(m.placement))}</span>` : ''}</figcaption></figure>`).join('')}</div>` : ''}
  </div>`);
};

B.logo = () => {
  const shown = versions.filter((v) => asset(v.file));
  const intro = sentence(paras(L._)[0] ?? '');
  if (!shown.length)
    return board('logo', 'Logo', 'page', `<div class="logos n2"><figure class="panel logo-panel" style="background:var(--color-bg-page);color:var(--color-text-primary)"><span class="typed">${esc(brandName)}</span><figcaption class="t-meta"><b>Set in type</b><span>No logo file yet</span></figcaption></figure><figure class="panel logo-panel" style="background:var(--color-bg-inverse);color:var(--color-text-inverse)"><span class="typed">${esc(brandName)}</span><figcaption class="t-meta"><b>Reversed</b><span>bg-inverse</span></figcaption></figure></div>`, { lede: intro });
  return board('logo', 'Logo', 'page', `<div class="logos n${Math.min(shown.length, 3)}">${shown.map((v, i) => `<figure class="panel logo-panel${i === 0 ? ' lead' : ''}" style="background:var(--color-${v.ground});color:var(--${onGround(hex(`color-${v.ground}`) ?? '#ffffff')})">${picture(v.file)}<figcaption class="t-meta"><b>${esc(v.name)}</b><span>${v.ground}</span></figcaption></figure>`).join('')}</div>`, { lede: intro });
};

// Candidates: logo.md → ## Candidates, a table of candidate, file and note, shown side by side where
// the logo lives: in a header, large on the page, reversed on the dark ground, and at its minimum.
const candidates = table(L.Candidates).map((r) => ({ name: r.candidate ?? r.version ?? '', file: r.file ?? '', note: r.note ?? r.use ?? '' })).filter((c) => asset(c.file));
B['logo-candidates'] = () => {
  if (candidates.length < 2) return '';
  const min = T['logo-min-width'] ?? '48px';
  const mask = (a, fill, style = '') => `<span class="mk" style="aspect-ratio:${a.ratio ?? 4};${style}"><i style="-webkit-mask-image:url('${a.src}');mask-image:url('${a.src}');background:${fill}"></i></span>`;
  const cols = candidates.length;
  return board('logo-candidates', 'Logo candidates', 'page', `<div class="cands" style="grid-template-columns:repeat(${cols},1fr)">${candidates.map((c) => { const a = asset(c.file); return `<figure class="cand">
    <div class="cand-row cand-head" style="background:var(--color-bg-page)"><span class="cand-h">${picture(c.file)}</span><span class="nav-links t-meta">${navLinks.map((x) => `<span>${esc(x)}</span>`).join('')}</span></div>
    <div class="cand-row" style="background:var(--color-bg-page)"><span class="cand-big">${picture(c.file)}</span></div>
    <div class="cand-row" style="background:var(--color-bg-inverse)"><span class="cand-big">${mask(a, 'var(--color-text-inverse)')}</span></div>
    <div class="cand-row cand-min" style="background:var(--color-bg-page)"><span style="width:${min};display:block">${picture(c.file)}</span><span class="t-meta">${esc(min)}</span></div>
    <figcaption class="t-meta"><b>${esc(c.name)}</b>${c.note ? `<span>${inline(sentence(c.note))}</span>` : ''}</figcaption></figure>`; }).join('')}</div>`);
};

B['logo-rules'] = () => {
  const clear = T['logo-clear-space'];
  const min = T['logo-min-width'];
  if (clear === undefined && min === undefined) return '';
  const k = Number(clear ?? 0.5);
  const row = misuseTiles().length <= 6 ? misuseTiles() : [];
  return board('logo-rules', row.length ? 'Clear space, size and misuse' : 'Clear space and size', 'inverse', `<div class="rules${row.length ? ' with-misuse' : ''}"><div class="rules-grid${clear !== undefined && min !== undefined ? '' : ' one'}">
      ${clear !== undefined ? `<figure class="panel rule-panel"><div class="cs" style="--k:${k}"><i class="g gt"></i><i class="g gb"></i><i class="g gl"></i><i class="g gr"></i><span class="x xt t-meta">${k}x</span><span class="x xl t-meta">${k}x</span>${wordmark('cs-mark', 'bg-inverse')}</div><figcaption class="t-meta"><b>Clear space</b><span>${k} of the logo's height, every side</span></figcaption></figure>` : ''}
      ${min !== undefined ? `<figure class="panel rule-panel"><div class="min"><span class="min-mark" style="width:${min}">${wordmark('', 'bg-inverse')}</span><span class="dim t-meta" style="width:${min}">${min}</span></div><figcaption class="t-meta"><b>Minimum width</b><span>${min}</span></figcaption></figure>` : ''}
    </div>${row.length ? `<div class="misuse" style="grid-template-columns:repeat(${row.length},1fr)">${row.join('')}</div>` : ''}</div>`, { lede: paras(L['Clear space'])[0] ?? '' });
};

// Misuse is drawn, never listed. Each line in logo.md → ## Misuse names the transformation it
// shows, as a bold label from this list: `- **stretch:** Don't stretch the logo.` A line with no
// label is read for one of these words; a line that names none is reported, not drawn.
const MISUSE = [
  ['recolor', /\b(fill|recolou?r|colou?r)/i],
  ['retype', /\b(capitals|tracking|typeface|font|retype|redraw|set the name)/i],
  ['ground', /\b(ground|background)\b/i],
  ['stretch', /\b(stretch|squash|distort|condens)/i],
  ['rotate', /\b(rotat|tilt|angle)/i],
  ['effect', /\b(shadow|glow|effect|bevel|gradient)/i],
  ['outline', /\b(outline|stroke)/i],
  ['crowd', /\b(crowd|clear space|too close)/i],
  ['add', /\b(under|below|add|lock ?up)\b/i],
  ['large', /\b(large|big|middle|centre|center)\b/i],
  ['small', /\b(small|tiny|minimum)\b/i],
  ['crop', /\b(crop|cut off)\b/i],
];
const misuses = () => bullets(L.Misuse).map((t) => {
  const m = t.match(/^\*\*([a-z-]+):?\*\*:?\s*(.*)$/i);
  // An unlabelled line is read by its first sentence only. The reason that follows names other things.
  const kind = m ? m[1].toLowerCase() : (MISUSE.find(([, re]) => re.test(sentence(t))) ?? [])[0];
  return { kind, text: sentence(m ? m[2] : t), full: t };
});
let tilesMemo = null;
const misuseTiles = () => {
  if (tilesMemo) return tilesMemo;
  const list = misuses();
  for (const u of list.filter((x) => !x.kind || !MISUSE.some(([k]) => k === x.kind))) warnings.push(`Misuse "${u.text}" names no transformation the sheet can draw. Start the line with one of ${MISUSE.map(([k]) => `**${k}:**`).join(', ')}.`);
  const drawable = list.filter((u) => MISUSE.some(([k]) => k === u.kind));
  // Every misuse is drawn on the dark ground, with the version drawn for it.
  const ground = 'bg-inverse';
  const base = versionFor(ground);
  const a = base && asset(base.file);
  // A color named in the line, as a token or as a ramp's name, or the accent when it names none.
  const colorIn = (t) => { const tok = t.match(/\{colors\.([\w-]+)\}/); if (tok) return `var(--color-${tok[1]})`; const r = ramps.find(([name]) => new RegExp(`\\b${name}\\b`, 'i').test(t)); return r ? r[1].steps[String(r[1].anchorStep)]?.hex ?? 'var(--color-accent-bg)' : 'var(--color-accent-bg)'; };
  const masked = (fill) => (a ? `<span class="mk" style="aspect-ratio:${a.ratio ?? 4}"><i style="-webkit-mask-image:url('${a.src}');mask-image:url('${a.src}');background:${fill}"></i></span>` : `<span class="typed" style="color:${fill}">${esc(brandName)}</span>`);
  const logo = (style = '', g = ground) => `<span class="mis-logo" style="${style}">${wordmark('', g)}</span>`;
  const other = versions.find((v) => v.ground !== ground && asset(v.file));
  // The crowding headline: the brand's own display line, cut to its first few words.
  const crowdLine = String(copy.display || copy.heading || brandName).split(/\s+/).slice(0, 3).join(' ');
  const draw = (u) => {
    switch (u.kind) {
      case 'recolor': return masked(colorIn(u.full));
      case 'retype': return `<span class="retype">${esc(brandName)}</span>`;
      // The version drawn for another ground, which can vanish here, so its bounds are dashed.
      // The wordmark drawn for another ground is lost on this one. A faint edge keeps its shape in view.
      case 'ground': return `<span class="lost">${other ? `<span class="mis-logo ghost">${picture(other.file)}</span>` : logo('', 'bg-page')}</span>`;
      case 'stretch': return logo('transform:scaleX(1.45)');
      case 'rotate': return logo('transform:rotate(-12deg)');
      case 'effect': return logo('filter:drop-shadow(6px 8px 0 var(--color-border-default))');
      case 'outline': return `<span class="outline">${masked(`var(--color-${ground})`)}</span>`;
      // A headline set inside the clear space, which is drawn dashed around the logo.
      case 'crowd': return `<span class="crowd"><b class="crowd-head" style="${rs(R.title, 'font-size:20px;line-height:1.05')}">${esc(crowdLine)}</b>${logo()}</span>`;
      case 'add': return `<span class="add${/\b(under|below)\b/i.test(u.text) ? ' under' : ''}">${logo()}<i></i></span>`;
      case 'large': return logo('width:140%');
      case 'small': return logo('width:14%');
      case 'crop': return logo('transform:translateX(55%)');
      default: return '';
    }
  };
  tilesMemo = drawable.map((u) => `<figure class="mis"><div class="mis-art">${draw(u)}${slash}</div><figcaption class="t-meta">${inline(u.text)}</figcaption></figure>`);
  return tilesMemo;
};
// Misuse sits on the clear-space board. This board holds the rest: every line past six, or all of
// them when the logo has no clear space or minimum width.
B.misuse = () => {
  const tiles = misuseTiles();
  // Up to six tiles sit under the clear-space panels. More than six move to a board of their own, whole,
  // so a lone tile never fills a board.
  const onRules = (T['logo-clear-space'] !== undefined || T['logo-min-width'] !== undefined) && tiles.length <= 6;
  if (!tiles.length || onRules) return '';
  const cols = columnsFor(tiles.length, BODY.w, BODY.h, 1.15);
  const span = fillRow(tiles.length, cols);
  return board('misuse', 'Logo misuse', 'inverse', `<div class="misuse" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${Math.ceil(tiles.length / cols)},1fr)">${tiles.map((t, i) => t.replace('<figure class="mis"', `<figure class="mis" style="${span(i)}"`)).join('')}</div>`);
};

// ── Color ────────────────────────────────────────────────────────────────────
// The main palette: the colors the proportion records, each as a field as wide as its share. With
// no proportion, each ramp's chosen color and each fixed color, in equal fields.
B.palette = () => {
  const prop = M.proportion ?? sheetCfg.proportion ?? null;
  const raw = prop ? Object.entries(prop).map(([k, v]) => ({ key: `color-${cssKey(k).replace(/^color-/, '')}`, share: Number(v) })).filter((s) => has(s.key) && s.share > 0 && !/^color-status-/.test(s.key)).map((s) => ({ ...s, hex: hex(s.key), name: label(s.key), step: stepOf(s.key) })) : [];
  const fields = [];
  // Two neighbors that resolve to one color read as one field, so they are drawn as one.
  for (const s of raw) { const last = fields[fields.length - 1]; if (last && last.hex === s.hex) { last.share += s.share; last.name += `, ${s.name}`; } else fields.push({ ...s }); }
  if (!fields.length) {
    // Each field is named for the roles that resolve to it, so no swatch stands without a job.
    const rolesAt = (h) => ['bg-page', 'bg-surface', 'bg-inverse', 'text-primary', 'accent-bg', 'action-bg'].filter((k) => String(hex(`color-${k}`)).toLowerCase() === String(h).toLowerCase());
    for (const [name, r] of ramps) { const h = r.steps[String(r.anchorStep)]?.hex ?? r.anchor; if (h) fields.push({ name: rolesAt(h).join(', ') || name, step: `${name}-${r.anchorStep}`, hex: h, share: 1 }); }
    for (const [name, h] of fixed) fields.push({ name: rolesAt(h).join(', ') || name, step: name, hex: h, share: 1 });
  }
  if (!fields.length) return '';
  const shares = Boolean(raw.length);
  return board('palette', 'Color', 'page', `<div class="palette">${fields.map((f) => `<div class="field" style="flex:${f.share};background:${f.hex};color:var(--${onGround(f.hex)})">${shares ? `<span class="share t-title">${f.share}%</span>` : '<span></span>'}<span class="field-meta"><b class="t-lede">${esc(f.name)}</b><span class="t-meta">${esc(f.step)}</span><span class="t-meta">${f.hex}</span></span></div>`).join('')}</div>`, { lede: paras(D.Colors)[0] ?? '' });
};

B.ramps = () => {
  if (!ramps.length) return '';
  const statusOnly = (name) => { const rl = Object.entries(M.aliases).filter(([, step]) => step.startsWith(`color-${name}-`)); return rl.length > 0 && rl.every(([k]) => /^(color-)?status-/.test(k)); };
  const rows = ramps.map(([name, r]) => `<div class="ramp${statusOnly(name) ? ' status' : ''}"><b class="t-meta ramp-name">${esc(name)}${statusOnly(name) ? ', status only' : ''}</b>${Object.entries(r.steps).map(([s, v]) => `<div class="rc" style="background:${v.hex};color:var(--${onGround(v.hex)})">${String(r.anchorStep) === s ? '<i class="anchor"></i>' : ''}<span class="t-meta"><b>${s}</b><span>${v.hex}</span></span></div>`).join('')}</div>`);
  if (fixed.length) rows.push(`<div class="ramp"><b class="t-meta ramp-name">fixed</b>${fixed.map(([name, h]) => `<div class="rc" style="grid-column:span 2;background:${h};color:var(--${onGround(h)})"><span class="t-meta"><b>${esc(name)}</b><span>${h}</span></span></div>`).join('')}</div>`);
  return board('ramps', 'Ramps', 'page', `<div class="ramps" style="grid-template-rows:${[...ramps.map(([n]) => (statusOnly(n) ? '0.55fr' : '1fr')), ...(fixed.length ? ['1fr'] : [])].join(' ')}">${rows.join('')}</div>`);
};

// The chroma map: how much color each step holds, every ramp on one chart, each step drawn in its own color.
B.chroma = () => {
  if (!ramps.length) return '';
  const steps = Object.keys(ramps[0][1].steps);
  const W = BODY.w, H = BODY.h, padL = 72, padR = 160, padB = 48, padT = 24;
  const maxC = Math.max(0.02, ...ramps.flatMap(([, r]) => Object.values(r.steps).map((s) => s.oklch?.[1] ?? 0)));
  const x = (i) => padL + (i * (W - padL - padR)) / (steps.length - 1);
  const y = (c) => padT + (1 - c / maxC) * (H - padT - padB);
  const c = (s) => s?.oklch?.[1] ?? 0;
  const ink = (r) => r.steps['600']?.hex ?? Object.values(r.steps)[6]?.hex;
  const ticks = [0, maxC / 2, maxC];
  // Line labels sit at the right end of each line, pushed apart where two lines end close together.
  const ends = ramps.map(([name, r]) => ({ name, y: y(c(r.steps[steps[steps.length - 1]])) })).sort((a, b) => a.y - b.y);
  for (let i = 1; i < ends.length; i++) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 32);
  const endY = Object.fromEntries(ends.map((e) => [e.name, e.y]));
  const svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Chroma by step">
    ${ticks.map((t) => `<line x1="${padL}" x2="${W - padR}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${padL - 14}" y="${y(t) + 5}" text-anchor="end" class="ax">${t.toFixed(2)}</text>`).join('')}
    ${steps.map((s, i) => `<text x="${x(i)}" y="${H - 14}" text-anchor="middle" class="ax">${s}</text>`).join('')}
    ${ramps.map(([name, r]) => { const peak = steps.reduce((b, s) => (c(r.steps[s]) > c(r.steps[b]) ? s : b), steps[0]); return `<path d="${steps.map((s, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(c(r.steps[s])).toFixed(1)}`).join(' ')}" fill="none" stroke="${ink(r)}" stroke-width="2"/>${steps.map((s, i) => `<circle cx="${x(i)}" cy="${y(c(r.steps[s]))}" r="${String(r.anchorStep) === s ? 18 : 12}" fill="${r.steps[s].hex}"${String(r.anchorStep) === s ? ` stroke="${ink(r)}" stroke-width="3"` : ''}/>`).join('')}<text x="${W - padR + 28}" y="${endY[name] + 7}" class="lbl">${esc(name)}</text><text x="${x(steps.indexOf(peak))}" y="${y(c(r.steps[peak])) - 28}" text-anchor="middle" class="ax">${c(r.steps[peak]).toFixed(3)}</text>`; }).join('')}
  </svg>`;
  // No reference guide draws this chart, so it carries the one line that says how to read it.
  return board('chroma', 'Chroma map', 'page', svg, { lede: 'How much color each step of each ramp holds. The larger dot is the color the brand chose.' });
};

// The text role the brand sets on a ground: the strongest text role a pair puts on it, or the text
// color that reads on it when no pair names one.
const textFor = (g) => pairs.map((p) => [cssKey(p.fg), cssKey(p.bg)]).filter(([fg, bg]) => bg === g && /^color-text-|-text$/.test(fg) && !/disabled/.test(fg) && has(fg)).map(([fg]) => fg).sort((a, b) => contrast(String(hex(b)), String(hex(g))) - contrast(String(hex(a)), String(hex(g))))[0] ?? onGround(String(hex(g)));

// Pairings: the brand's primary combinations only. Each main ground with its text color, and the
// fills and inks set on the page. Never a boundary drawn as an outline, which hides the color it
// shows, and never a secondary ground, a secondary text or a state. Text is a square inside the
// square, a filled mark is a dot.
B.pairs = () => {
  if (!pairs.length || !mainGrounds.length) return '';
  const seen = new Map();
  const put = (fg, bg, kind) => {
    const id = `${String(hex(fg)).toLowerCase()}|${String(hex(bg)).toLowerCase()}`;
    if (seen.has(id)) { const s = seen.get(id); if (!s.fgs.includes(fg)) s.fgs.push(fg); if (!s.bgs.includes(bg)) s.bgs.push(bg); if (kind === 'text') s.kind = 'text'; }
    else seen.set(id, { fg, bg, kind, fgs: [fg], bgs: [bg] });
  };
  for (const g of mainGrounds) put(textFor(g), g, 'text');
  // An ink or a fill on the page: the accent's text, the action's fill. Text roles past the primary
  // one (secondary, tertiary) and status roles stay off this board.
  const page = mainGrounds[0];
  for (const p of pairs) {
    const [fg, bg] = [cssKey(p.fg), cssKey(p.bg)];
    if (bg !== page || p.exempt || !has(fg) || !String(hex(fg)).startsWith('#')) continue;
    if (/(^|-)border(-|$)/.test(fg) || MINOR.test(fg) || /^color-text-/.test(fg)) continue;
    put(fg, bg, /(^|-)text(-|$)/.test(fg) ? 'text' : 'mark');
  }
  const tiles = [...seen.values()];
  if (!tiles.length) return '';
  const cols = tiles.length <= 6 ? tiles.length : Math.ceil(tiles.length / 2);
  const span = fillRow(tiles.length, cols);
  const more = (ks) => ks.map(label).join(', ');
  return board('pairs', 'Color pairings', 'page', `<div class="pairs" style="grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${Math.ceil(tiles.length / cols)},1fr)">${tiles.map((t, i) => `<div class="pair" style="${span(i)};background:var(--${t.bg});color:var(--${textOn(t.bg)})"><i class="shape ${t.kind}" style="--c:var(--${t.fg})"></i><span class="t-meta"><b>${more(t.fgs)}</b><span>on ${more(t.bgs)}</span><span>${contrast(String(hex(t.fg)), String(hex(t.bg))).toFixed(2)} to 1</span></span></div>`).join('')}</div>`);
};

// Text contrast: the primary text color on each main ground, set as text, with its ratio and level.
// Every column is one width, and the sample is short enough to hold one line in it. The full
// measurement of every pair lives in tokens/contrast.md.
B.contrast = () => {
  if (!mainGrounds.length) return '';
  const cols = mainGrounds.length;
  // The sample is the brand's shortest line that fits a column at the title size, or its name.
  const room = (BODY.w - (cols - 1) * 16) / cols - 64;
  const fits = (x) => x.length * 0.58 * R.title.size <= room;
  const word = [copy.cta, copy.display, copy.subheading, copy.heading, copy.label].filter((x) => typeof x === 'string' && x.length > 0 && fits(x)).sort((a, b) => b.length - a.length)[0] ?? brandName;
  const tile = (g) => { const t = textFor(g), ratio = contrast(String(hex(t)), String(hex(g))); return `<div class="ct" style="background:var(--${g});color:var(--${textOn(g)})"><span class="ct-word" style="color:var(--${t})">${esc(word)}</span><span class="t-meta"><b>${label(t)}, ${esc(stepOf(t) || String(hex(t)))}</b><span>on ${label(g)}</span><span>${ratio.toFixed(2)} to 1, ${ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'large text only' : 'below AA'}</span></span></div>`; };
  return board('contrast', 'Text contrast', 'page', `<div class="contrast" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${mainGrounds.map(tile).join('')}</div>`);
};

// ── Type ─────────────────────────────────────────────────────────────────────
B.typefaces = () => {
  if (!families.length) return '';
  const allWeights = Object.entries(T).filter(([k]) => k.startsWith('font-weight-')).map(([k, v]) => ({ name: k.slice(12), v }));
  // Show only the weights a family has a file for. A weight with no file is synthesized by the browser.
  // A variable font declares a range, "100 900", and covers every weight inside it.
  const loaded = (fam) => [...fontCss.matchAll(/font-family:\s*"([^"]+)";[\s\S]*?font-weight:\s*(\d+)(?:\s+(\d+))?/g)].filter((m) => m[1] === fam).map((m) => [Number(m[2]), Number(m[3] ?? m[2])]);
  const usesOf = (f) => roles.filter((r) => r.fontFamily === f.stack || String(r.fontFamily).includes(f.first));
  // A family set at two widths is two panels, one per width, so the second never repeats the first.
  const variants = families.flatMap((f) => { const widths = [...new Set(usesOf(f).map((r) => r.fontStretch ?? ''))]; return (widths.length ? widths : ['']).map((w) => ({ ...f, stretch: w })); });
  const anyRole = new Set(roles.map((r) => Number(r.fontWeight)));
  const weightsFor = (f) => { const l = loaded(f.first); const mine = new Set(usesOf(f).filter((r) => (r.fontStretch ?? '') === f.stretch).map((r) => Number(r.fontWeight))); const s = mine.size ? mine : anyRole; return allWeights.filter((w) => (!l.length || l.some(([a, b]) => Number(w.v) >= a && Number(w.v) <= b)) && s.has(Number(w.v))); };
  // Columns follow the count: up to three across, four or more in two rows. Each name is sized
  // optically: the page measures each face's x-height once its fonts load and sets every name to one
  // x-height, the largest that lets the widest name fit its column. These are one-off sizes outside
  // the type scale. The size here is only the starting point before that measurement.
  const n = variants.length;
  const cols = n <= 3 ? n : Math.ceil(n / 2);
  const rowsN = Math.ceil(n / cols);
  const inner = (BODY.w - (cols - 1) * 24) / cols - 64;
  const nameSize = (f) => Math.max(40, Math.min(120, Math.floor(inner / (f.first.length * 0.66))));
  const glyph = n <= 3 ? 28 : 22;
  return board('typefaces', 'Typefaces', 'inverse', `<div class="faces" style="grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${rowsN},minmax(0,1fr))">${variants.map((f) => `<article class="face" style="font-family:var(--${f.key})${f.stretch ? `;font-stretch:${f.stretch}` : ''}"><p class="face-name" data-fit="x-height" style="font-size:${nameSize(f)}px">${esc(f.first)}</p><p class="glyphs" style="font-size:${glyph}px">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; ? ! @ % ( ) / : ;</p><div class="weights">${weightsFor(f).map((w) => `<span style="font-weight:${w.v}">${w.name} ${w.v}</span>`).join('')}</div><p class="t-meta face-meta"><b>font-family-${f.name}${f.stretch ? `, width ${f.stretch}` : ''}</b></p></article>`).join('')}</div>`, { lede: paras(D.Typography)[0] ?? '' });
};

// The type system: every step of the scale drawn at its size, and every type role specified.
B.scale = () => {
  const steps = Object.entries(T).filter(([k]) => /^font-size-/.test(k)).map(([k, v]) => ({ k: k.slice(10), v: px(v) })).filter((x) => x.v > 0).sort((a, b) => a.v - b.v);
  if (!steps.length || !roles.length) return '';
  const sc = M.scale;
  const fam = families.find((f) => f.stack === R.display.fontFamily || String(R.display.fontFamily).includes(f.first)) ?? families[0];
  const stepOfSize = (v) => steps.find((x) => Math.abs(x.v - v) < 0.5)?.k;
  const famOf = (r) => families.find((f) => f.stack === r.fontFamily || String(r.fontFamily).includes(f.first))?.first ?? String(r.fontFamily).split(',')[0].replaceAll('"', '');
  const track = (r) => (r.letterSpacing && !/^0(px|em)?$/.test(String(r.letterSpacing)) ? r.letterSpacing : '0');
  return board('scale', 'Type scale and styles', 'page', `<div class="scale">
    <article class="scale-panel"><h3 class="t-lede">${sc ? `${sc.base}px base, ratio ${sc.ratio}` : 'Scale'}</h3><div class="steps">${steps.map((x) => `<div class="step"><span class="glyph" style="${fam ? `font-family:var(--${fam.key});` : ''}font-size:var(--font-size-${x.k})">Aa</span><span class="t-meta"><b>${x.k}</b><span>${x.v}</span></span></div>`).join('')}</div></article>
    <article class="spec"><div class="spec-head t-meta"><span>Style</span><span>Family</span><span>Weight</span><span>Size / line</span><span>Tracking</span><span>Step</span></div><div class="spec-rows" style="grid-template-rows:repeat(${roles.length},1fr)">${roles.map((r) => `<div class="spec-row t-body"><span>type-${r.name}</span><span>${esc(famOf(r))}</span><span>${r.fontWeight}</span><span>${r.fontSize} / ${r.lineHeight}</span><span>${track(r)}</span><span>${stepOfSize(r.size) ?? 'off the scale'}</span></div>`).join('')}</div></article>
  </div>`);
};

B.type = () => {
  if (!roles.length) return '';
  // Each role sets its own line. A line already shown is not shown again: repeated filler reads as placeholder.
  const used = new Set();
  // Only the brand's own lines from sheet.json. A role named in it keeps its line, and the rest share
  // what is left before any line repeats.
  const pool = [...new Set([copy.display, copy.heading, copy.subheading, copy.body, copy.label].filter(Boolean))];
  for (const r of roles) if (sampleFor(r.name)) used.add(sampleFor(r.name));
  const sample = (r) => {
    if (sampleFor(r.name)) return sampleFor(r.name);
    const first = (r.size >= 56 ? copy.display : r.size >= 30 ? copy.heading : r.size >= 22 ? copy.subheading : r.size >= 15 ? copy.body : copy.label);
    const pick = [first, ...pool].find((x) => x && !used.has(x)) ?? first;
    if (used.has(pick)) warnings.push(`Type role ${r.name} repeats a line another role shows. Give it its own in sheet.json → copy.roles.${r.name}.`);
    used.add(pick);
    return pick;
  };
  // Every role on one board, one line each. A sample longer than the line is cut, never wrapped.
  return board('type', 'Type at its real size', 'page', `<div class="type-rows">${roles.map((r) => `<div class="type-row"><div class="type-meta t-meta"><b>${r.name}</b><span>${r.fontSize} / ${r.lineHeight}, ${r.fontWeight}</span></div><p class="type-sample" style="${rs(r)}">${esc(sample(r))}</p></div>`).join('')}</div>`);
};

// Type in use: the roles set together on two surfaces, so a pairing is judged as a pairing. A story
// card carries the ticket line, the display role, the body and the action. A data card carries the
// figure with its unit, a heading and a caption. A role the brand did not define is left out.
B.compose = () => {
  if (roles.length < 3) return '';
  const meta = R.ticket ?? R.meta;
  const line = (txt) => `<div class="cp-line" style="${rs(meta)}"><span>${esc(txt)}</span></div>`;
  const named = (n) => byName(n);
  const accent = has('color-accent-text') ? 'var(--color-accent-text)' : 'inherit';
  const story = `<article class="cp story">${line(copy.ticket ?? copy.label)}<div class="cp-main"><p style="${rs(R.display)}">${esc(copy.display)}</p><p style="${rs(R.lede)}">${esc(copy.subheading)}</p><p class="cp-body" style="${rs(R.body)}">${esc(copy.body)}</p>${copy.cta ? `<span class="btn" style="${rs(R.action ?? R.body)}">${esc(copy.cta)}</span>` : ''}</div></article>`;
  const figRole = R.figure;
  const headS = named('heading-s') ?? R.lede;
  const data = `<article class="cp data">${line(copy.ticket ?? copy.label)}<div class="cp-main">${figRole ? `<p style="${rs(figRole)}">${esc(copy.figure ?? '500')}</p>${copy.figureUnit ? `<p style="${rs(meta)};color:${accent}">${esc(copy.figureUnit)}</p>` : ''}` : `<p style="${rs(R.title)}">${esc(copy.heading)}</p>`}<p style="${rs(headS)}">${esc(copy['heading-s'] ?? copy.subheading)}</p><p style="${rs(named('caption') ?? R.meta)}">${esc(copy.caption ?? copy.label)}</p>${named('micro') ? `<p style="${rs(named('micro'))}">${esc(copy.micro ?? copy.label)}</p>` : ''}</div></article>`;
  return board('compose', 'Type in use', 'page', `<div class="compose">${story}${data}</div>`);
};

// Space, shape, depth and motion sit on the page color, the ground the brand is judged on.
B.space = () => {
  const spacing = Object.entries(T).filter(([k]) => k.startsWith('spacing-')).map(([k, v]) => ({ k, v: px(v) })).filter((s) => s.v > 0);
  const radius = Object.entries(T).filter(([k]) => k.startsWith('radius-'));
  const strokes = Object.entries(T).filter(([k]) => k.startsWith('stroke-')).map(([k, v]) => ({ k, v: px(v) })).filter((s) => s.v > 0);
  // A shadow with no offset, blur or spread draws nothing. A brand that shows depth by ground and rule keeps two of them zeroed.
  const elev = Object.entries(T).filter(([k]) => k.startsWith('elevation-')).filter(([, v]) => [...String(v).matchAll(/(-?[\d.]+)px/g)].slice(0, 4).some((m) => +m[1] !== 0));
  if (!spacing.length && !radius.length) return '';
  const rad = Object.values(radius.reduce((acc, [k, v]) => { (acc[v] ??= { k, v, names: [] }).names.push(k.slice(7)); return acc; }, {}));
  const unit = M.unit ?? 4;
  // The unit grid's ticks are a construction guide, drawn at 3 to 1. Closer than 12px they read as a
  // fill, so a small unit is ticked every few units.
  const tick = unit * Math.max(1, Math.ceil(12 / unit));
  // Every table shares one row height, so their rows line up across the board.
  const rowsMax = Math.max(spacing.length, rad.length);
  const tbl = (title, rows, cls = '') => `<article class="panel tbl ${cls}"><h3 class="t-lede">${title}</h3><div class="tbl-head t-meta"><span>Token</span><span>Example</span><span>Value</span></div><div class="tbl-rows" style="grid-template-rows:repeat(${rowsMax},1fr)">${rows.join('')}</div></article>`;
  const shadow = (v) => { const n = [...String(v).matchAll(/(-?[\d.]+)px/g)].map((m) => +m[1]); return n.length >= 3 ? `${n[1]} / ${n[2]}` : ''; };
  // The brand's main grounds side by side, each edged with the hairline. Interface grounds (surface,
  // raised, sunken) are states of the page, documented in DESIGN.md, and never painted as a field here.
  const grounds = mainGrounds.map((k) => k.replace(/^color-/, ''));
  const edge = has('stroke-hairline') ? 'var(--stroke-hairline)' : '1px';
  const rules = `<article class="panel rules-depth"><h3 class="t-lede">Rules${elev.length ? ', elevation' : ''} and grounds</h3>
      <div class="strokes">${strokes.map((s) => `<div class="tr t-body"><span>${s.k}</span><span><i class="rule" style="height:var(--${s.k})"></i></span><span>${s.v}</span></div>`).join('')}</div>
      ${elev.length ? `<div class="strokes">${elev.map(([k, v]) => `<div class="tr t-body"><span>elevation-${k.slice(10)}</span><span><i class="lift" style="box-shadow:var(--${k})"></i></span><span>${shadow(v)}</span></div>`).join('')}</div>` : ''}
      <div class="depth t-meta" style="grid-template-columns:repeat(${grounds.length},1fr)">${grounds.map((k) => `<span class="ground" style="background:var(--color-${k});color:var(--${onGround(hex(`color-${k}`))});border:${edge} solid var(--color-border-default)"><b>${k}</b></span>`).join('')}</div>
      <p class="t-meta depth-note">${elev.length ? 'Depth: shadow and ground' : 'Depth: ground and hairline, no shadow'}</p></article>`;
  return board('space', 'Space and shape', 'page', `<div class="space-grid" style="grid-template-columns:5fr 3fr 4fr">
    ${tbl(`Spacing${M.unit ? `, ${M.unit}px unit${tick !== unit ? `, a tick every ${tick / unit}` : ''}` : ''}`, spacing.map((s) => `<div class="tr t-body"><span>spacing-${s.k.slice(8)}</span><span><i class="bar" style="width:${s.v}px"></i></span><span>${s.v}</span></div>`), 'unitgrid')}
    ${tbl('Radius', rad.map((g) => `<div class="tr t-body"><span>${g.names.length > 2 ? `radius-${g.names[0]} to ${g.names[g.names.length - 1]}` : g.names.map((x) => `radius-${x}`).join(', ')}</span><span><i class="sq" style="border-radius:var(--${g.k})"></i></span><span>${parseFloat(g.v) >= 999 ? 'full' : parseFloat(g.v)}</span></div>`))}
    ${rules}
  </div>`.replace('class="panel tbl unitgrid"', `class="panel tbl unitgrid" style="--u:${tick}px"`), { cls: 'flat' });
};

// Layout: the widths content is set to, the breakpoints with the one the layout turns on, and the
// range a fluid value grows across, all on one ruler so a designer reads them against each other.
B.layout = () => {
  const grp = (g) => Object.entries(T).filter(([k, v]) => k.startsWith(`${g}-`) && typeof v === 'string' && /^-?[\d.]+(px|rem)$/.test(v)).map(([k, v]) => ({ k, name: k.slice(g.length + 1), v: v.endsWith('rem') ? px(v) * 16 : px(v) }));
  const containers = grp('container');
  const bps = grp('breakpoint').sort((a, b) => a.v - b.v);
  const vp = Object.fromEntries(grp('viewport').map((x) => [x.name, x.v]));
  if (!containers.length && !bps.length) return '';
  // The breakpoint the layout turns on is the one DESIGN.md → Layout names.
  const turn = ((D.Layout ?? '').match(/breakpoint[-.]([\w]+)/) ?? [])[1];
  if (bps.length && !bps.some((b) => b.name === turn)) warnings.push(`Layout: DESIGN.md → ## Layout names no breakpoint the layout turns on, so the Layout board marks none. Name it there as \`breakpoint-md\` beside its value.`);
  const max = Math.max(...containers.map((c) => c.v), ...bps.map((b) => b.v), vp.max ?? 0) * 1.1;
  const at = (v) => `${((v / max) * 100).toFixed(3)}%`;
  // A fluid value is a clamp() from its size at viewport.min to its size at viewport.max.
  const ends = (v) => { const m = String(v).match(/^clamp\(\s*(-?[\d.]+)(px|rem)\s*,[^,]+,\s*(-?[\d.]+)(px|rem)\s*\)$/); return m ? [m[2] === 'rem' ? +m[1] * 16 : +m[1], m[4] === 'rem' ? +m[3] * 16 : +m[3]] : null; };
  // tokens.json holds a fluid token at its full size; tokens.css holds the clamp().
  const fluid = [...tokensCss.matchAll(/--((?:spacing|font-size)-[\w-]+):\s*(clamp\([^;]+\));/g)].filter(([, , v]) => ends(v)).filter(([, k], i, a) => a.findIndex((x) => x[1] === k) === i).map(([, k, v]) => [k, ...ends(v)]);
  const row = (label, body) => `<div class="lay-row"><span class="t-meta lay-label">${label}</span><div class="lay-track">${body}</div></div>`;
  const ruler = `<article class="panel lay-ruler">
    ${containers.length ? row('Content width', containers.sort((a, b) => b.v - a.v).map((c) => `<span class="lay-bar" style="width:${at(c.v)}"><b class="t-meta">container-${c.name}, ${c.v}</b></span>`).join('')) : ''}
    ${bps.length ? row('Breakpoints', bps.map((b) => `<span class="lay-tick${b.name === turn ? ' turn' : ''}" style="left:${at(b.v)}"><b class="t-meta">${b.name} ${b.v}${b.name === turn ? '<br>The layout turns here' : ''}</b></span>`).join('')) : ''}
    ${vp.min && vp.max ? row('Fluid range', `<span class="lay-range" style="left:${at(vp.min)};width:${at(vp.max - vp.min)}"><b class="t-meta">viewport-min ${vp.min} to viewport-max ${vp.max}</b></span>`) : ''}
  </article>`;
  const table = fluid.length ? `<article class="panel tbl lay-fluid"><h3 class="t-lede">Fluid values</h3><div class="tbl-head t-meta"><span>Token</span><span>At ${vp.min ?? 'min'}</span><span>At ${vp.max ?? 'max'}</span></div><div class="tbl-rows" style="grid-template-rows:repeat(${fluid.length},1fr)">${fluid.map(([k, a, b]) => `<div class="tr t-body"><span>${k}</span><span>${+a.toFixed(1)}</span><span>${+b.toFixed(1)}</span></div>`).join('')}</div></article>` : '';
  return board('layout', 'Layout', 'page', `<div class="lay-grid" style="grid-template-columns:${table ? '8fr 4fr' : '1fr'}">${ruler}${table}</div>`, { cls: 'flat' });
};

// Motion plays. Each band runs on a real element at its own duration and easing, then back out, so
// 150 milliseconds can be told from 250. A press changes ink, a layer fades and travels, and a band at
// zero cuts. The curves sit beside them.
B.motion = () => {
  const bands = [...new Set(Object.keys(T).filter((k) => /^motion-(?!easing)[\w]+-duration$/.test(k)).map((k) => k.replace(/^motion-|-duration$/g, '')))];
  if (!bands.length) return '';
  const eas = Object.entries(T).filter(([k]) => k.startsWith('motion-easing-'));
  const curve = (v) => { const [a, b, c, d] = v.match(/-?[\d.]+/g).map(Number); return `M10 110 C ${10 + a * 100} ${110 - b * 100}, ${10 + c * 100} ${110 - d * 100}, 110 10`; };
  const easeIn = T['motion-easing-enter'] ?? 'ease-out', easeOut = T['motion-easing-exit'] ?? 'ease-in', lin = T['motion-easing-linear'] ?? 'linear';
  const move = px(T['spacing-2'] ?? 8);
  const rows = bands.map((b) => {
    const i = px(T[`motion-${b}-duration`]), o = px(T[`motion-${b}-duration-exit`] ?? 0);
    const kind = !i && !o ? 'cut' : b === 'feedback' ? 'feedback' : 'layer';
    const ein = kind === 'feedback' ? lin : easeIn, eout = kind === 'feedback' ? lin : easeOut;
    const el = kind === 'feedback' ? `<span class="d-btn" style="${rs(R.action ?? R.body)}">${esc(copy.cta || 'Reorder')}</span>` : kind === 'layer' ? `<span class="d-layer"><b style="${rs(R.ticket ?? R.meta)}">${esc(copy.ticket ?? copy.label)}</b></span>` : `<span class="d-cut" style="${rs(R.ticket ?? R.meta)}"><b>${esc(copy.ticket ?? copy.label)}</b><b>${esc(copy.micro ?? copy.label)}</b></span>`;
    const what = kind === 'feedback' ? 'A press: ink to ink' : kind === 'layer' ? `A layer: fade, travel ${move}px` : 'A change of state: a cut';
    return `<div class="band"><div class="band-name t-body"><b>${b}</b><span class="t-meta">${what}</span></div><div class="demo" data-kind="${kind}" data-in="${i}" data-out="${o}" data-ein="${ein}" data-eout="${eout}" data-move="${move}">${el}</div><div class="t-meta band-nums">${kind === 'cut' ? '<span>0ms, does not animate</span>' : `<span>in ${i}ms</span><span>out ${o}ms</span>`}</div></div>`;
  });
  return board('motion', 'Motion', 'page', `<div class="motion-grid">
    <article class="panel bands"><h3 class="t-lede">Each band, played</h3><div class="band-rows">${rows.join('')}</div></article>
    <article class="panel curves"><h3 class="t-lede">Easing</h3><div class="curve-row" style="grid-template-columns:repeat(${Math.min(Math.max(eas.length, 1), 2)},1fr)">${eas.map(([k, v]) => `<figure><svg viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" class="box"/><path d="${curve(v)}" class="curve"/></svg><figcaption class="t-meta"><b>${k.slice(14)}</b><span>${v.replace('cubic-bezier', '')}</span></figcaption></figure>`).join('')}</div></article>
  </div>`, { lede: paras(Mo._)[0] ?? '', cls: 'flat' });
};

B.imagery = () => {
  const imgs = (sheetCfg.images?.gallery ?? []).map((p) => asset(p)).filter((a) => a?.src).slice(0, 6);
  if (!imgs.length) return '';
  const body = D.Imagery ?? D['Imagery & Iconography'] ?? '';
  return board('imagery', 'Imagery', 'page', `<div class="gallery g${imgs.length}">${imgs.map((a, i) => `<div class="shot s${i}" style="background-image:url('${a.src}')"></div>`).join('')}</div>`, { lede: paras(body)[0] ?? '' });
};

B['in-use'] = () => {
  if (!R.display) return '';
  const nav = navLinks;
  const hero = sheetCfg.images?.hero && asset(sheetCfg.images.hero);
  const btn = copy.cta ? `<span class="btn" style="${rs(R.action ?? R.body)}">${esc(copy.cta)}</span>` : '';
  // Each motif goes where its placement rule puts it, drawn from its construction and set in the
  // brand's own roles: an under-rule carries the headline, a ruled line runs along the hero's edge.
  const lead = motifList.find((m) => motifKind(m) === 'under-rule');
  const edge = motifList.find((m) => motifKind(m) === 'ruled-line');
  const headline = lead ? drawMotif(lead, copy.display) : `<p class="hero-line" style="${rs(R.display)}">${esc(copy.display)}</p>`;
  const ticketText = copy.ticket ?? copy.label;
  // An edge motif runs along the bottom unless its rule names only the top.
  const atTop = edge && /top/i.test(edge.placement ?? '') && !/bottom/i.test(edge.placement ?? '');
  const native = (m) => `<div class="hero-edge">${drawMotif(m, ticketText)}</div>`;
  const cardLine = edge ? drawMotif(edge, copy.micro ?? ticketText, { ink: 'var(--color-text-inverse)' }) : `<span class="t-meta">${esc(copy.label)}</span>`;
  return board('in-use', 'In use', 'page', `<div class="use-grid">
    <article class="use hero${hero?.src ? ' has-img' : ''}${atTop ? ' edge-top' : ''}">
      ${edge && atTop ? native(edge) : ''}
      <div class="use-nav" style="${rs(byName('nav') ?? R.body)}">${wordmark('nav-mark')}<span class="nav-links">${nav.map((x) => `<span>${esc(x)}</span>`).join('')}</span></div>
      <div class="hero-main">${headline}<p class="hero-sub" style="${rs(R.lede)}">${esc(copy.body)}</p>${btn}</div>
      ${edge && !atTop ? native(edge) : ''}
      ${hero?.src ? `<div class="hero-img" style="background-image:url('${hero.src}')"></div>` : ''}
    </article>
    <article class="use card-inv">${cardLine}<p style="${rs(R.title)}">${esc(copy.heading)}</p>${wordmark('card-mark', 'bg-inverse')}</article>
    <article class="use social"><p style="${rs(R.title)}">${esc(copy.subheading)}</p><span class="t-meta">${esc(brandName)}</span></article>
  </div>`);
};

B.rules = () => {
  const items = bullets(D["Do's and Don'ts"] ?? D['Do’s and Don’ts'] ?? '');
  if (!items.length) return '';
  const dos = items.filter((i) => /^\*\*Do\*\*/i.test(i)).map((i) => i.replace(/^\*\*Do\*\*\s*/i, ''));
  const donts = items.filter((i) => /^\*\*Don.t\*\*/i.test(i)).map((i) => i.replace(/^\*\*Don.t\*\*\s*/i, ''));
  const rowsN = Math.max(dos.length, donts.length);
  const col = (title, list, cls) => `<div class="rule-col ${cls}"><h3 class="t-lede">${title}</h3><ol style="grid-template-rows:repeat(${rowsN},1fr)">${list.map((t) => `<li class="t-lede"><span>${inline(sentence(t[0].toUpperCase() + t.slice(1)))}</span></li>`).join('')}</ol></div>`;
  return board('rules', 'Do and don\u2019t', 'page', `<div class="rule-cols">${col('Do', dos, 'do')}${col('Don\u2019t', donts, 'dont')}</div>`);
};

B.colophon = () => {
  const files = [['README.md', 'Start here'], ['core-idea.md', 'The core idea and its motifs'], ['DESIGN.md', 'The standard'], ['logo.md', 'Logo versions and rules'], ['motion.md', 'How the brand moves'], ['tokens/src/', 'The token source'], ['tokens/tokens.css', 'CSS custom properties'], ['tokens/tokens.json', 'Every token, resolved'], ['assets/', 'Logo, fonts, motifs, images']].filter(([f]) => f === 'README.md' || existsSync(resolve(BRAND, f)));
  return board('colophon', 'Where everything lives', 'inverse', `<div class="files" style="grid-template-rows:repeat(${files.length},1fr)">${files.map(([f, d]) => `<div class="file"><span class="t-lede"${MONO ? ` style="font-family:var(--${MONO})"` : ''}>brand/${f}</span><span class="t-body">${d}</span></div>`).join('')}</div>`);
};

const GROUPS = { color: ['palette', 'ramps', 'chroma', 'pairs', 'contrast'], type: ['typefaces', 'scale', 'type', 'compose'], logos: ['logo-candidates', 'logo', 'logo-rules', 'misuse'] };
const ORDER = ['cover', 'contents', 'idea', 'logo-candidates', 'logo', 'logo-rules', 'misuse', 'palette', 'ramps', 'chroma', 'pairs', 'contrast', 'typefaces', 'scale', 'type', 'compose', 'space', 'layout', 'motion', 'imagery', 'in-use', 'rules', 'colophon'];
const want = opt('boards') ? opt('boards').split(',').flatMap((b) => GROUPS[b.trim()] ?? [b.trim()]) : ORDER;
const unknown = want.filter((b) => !ORDER.includes(b));
if (unknown.length) { console.error(`Error: unknown board: ${unknown.join(', ')}. Boards: ${ORDER.join(', ')}. Groups: color, type, logos.`); process.exit(2); }
const rendered = ORDER.filter((b) => want.includes(b)).map((b) => [b, B[b]()]).filter(([, h]) => h).map(([b, h]) => [b, h === '%%CONTENTS%%' ? contents() : h]);

const role = (r) => rs(r);
const css = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0}
body{background:var(--color-bg-page);color:var(--color-text-primary);font:var(--${R.body.key});-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.sheet{width:1920px;margin:0 auto;padding:0;display:flex;flex-direction:column;gap:0}.board{break-after:page;break-inside:avoid}
p,h2,h3,figure,dl,dd,ol,ul{margin:0;padding:0}
ol,ul{list-style:none}
.t-display{${role(R.display)}} .t-title{${role(R.title)}} .t-lede{${role(R.lede)}} .t-body{${role(R.body)}}
.t-meta{${role(R.meta)};display:flex;gap:16px;flex-wrap:wrap}
.t-meta b{font-weight:inherit}
.board{position:relative;width:1920px;height:1080px;overflow:hidden;padding:56px 72px 48px;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:40px;background:var(--g-bg);color:var(--g-text)}
.g-page{--g-bg:var(--color-bg-page);--g-text:var(--color-text-primary);--g-2:var(--color-text-secondary);--g-rule:${ruleFor('color-bg-page')};--g-line:${lineFor('color-bg-page')}}
.g-inverse{--g-bg:var(--color-bg-inverse);--g-text:var(--color-text-inverse);--g-2:var(--color-text-inverse);--g-rule:${ruleFor('color-bg-inverse')};--g-line:${lineFor('color-bg-inverse')}}
.b-head{display:grid;grid-template-columns:repeat(12,1fr);column-gap:24px;align-items:baseline;min-height:48px}
.ramp.status .rc{opacity:1}.board.flat .panel{background:transparent;border:0;border-radius:0;padding:0}.board.flat .space-grid,.board.flat .motion-grid{column-gap:72px}
.b-head h2{grid-column:1/7}
.b-lede{grid-column:8/13;max-width:56ch;color:var(--g-2)}
.b-body{min-height:0;display:grid;overflow:hidden}
.b-body>*{min-height:0}
.b-foot{display:grid;grid-template-columns:repeat(4,1fr);column-gap:24px;color:var(--g-2)}
.b-foot span:last-child{text-align:right}
.panel{background:none;border:0;border-top:1px solid var(--g-rule);border-radius:0;padding:24px 0 0}
.tok{display:inline;white-space:nowrap}
.tok .sw{-webkit-text-stroke:1px var(--g-rule);paint-order:stroke fill}
.art{display:block}img.art{display:block;max-width:100%;height:auto}
.typed{font:var(--${R.display.key});letter-spacing:var(--${R.display.key}-letter-spacing);display:block;line-height:1}
.x-out{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.x-out line{stroke:var(--g-line);stroke-width:1.5}
/* cover */
.cover{display:grid;grid-template-rows:1fr auto;padding:56px 72px 48px;background-size:cover;background-position:center;gap:0}
.cover-meta{display:grid;grid-template-columns:repeat(4,1fr);column-gap:24px}.cover-meta span:last-child{text-align:right}
.cover-mark{place-self:center;width:44%}.cover-mark img.art{width:100%;max-height:520px;object-fit:contain}.cover-mark .typed{font-size:calc(var(--${R.display.key}-font-size) * 2.2);text-align:center}
.contents{display:grid;min-height:0}.contents li{min-height:0;overflow:hidden}.contents li{display:grid;grid-template-columns:3fr 9fr;align-items:end;border-top:1px solid var(--g-rule);padding-bottom:8px;font:var(--${R.display.key});letter-spacing:var(--${R.display.key}-letter-spacing)}
/* idea */
.idea{display:grid;grid-template-rows:auto minmax(${MOTIF_MIN}px,1fr);gap:48px}
.idea.alone{grid-template-rows:1fr;align-items:end}.idea.alone .idea-line{font-size:calc(var(--${R.display.key}-font-size) * 1.5);max-width:20ch}
.idea-line{max-width:100%;overflow:hidden}
.motifs{display:grid;gap:24px;min-height:0}
.motif{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:24px;min-height:0;border-top:1px solid var(--g-rule);padding-top:24px}
.motif-art{position:relative;min-height:0;overflow:hidden;display:grid;place-items:center}.motif-art img.art{position:absolute;inset:0;margin:auto;max-height:100%;max-width:80%;object-fit:contain}
.motif figcaption{display:grid;gap:8px}.motif figcaption span{color:var(--g-2);max-width:48ch}
/* logo */
.logos{display:grid;gap:24px;grid-template-columns:7fr 5fr;grid-template-rows:1fr 1fr}
.logos.n1{grid-template-columns:1fr;grid-template-rows:1fr}.logos.n2{grid-template-rows:1fr}
.logos.n3 .lead{grid-row:span 2}
.logo-panel{position:relative;display:grid;place-items:center;min-height:0;border:0;padding:0}
.logo-panel img.art{height:22%;width:auto;max-width:72%;object-fit:contain}.logo-panel .typed{font-size:calc(var(--${R.display.key}-font-size) * 1.4)}
.logo-panel figcaption{position:absolute;left:32px;right:32px;bottom:24px;justify-content:space-between}
.rules-grid{display:grid;grid-template-columns:7fr 5fr;gap:24px}.rules-grid.one{grid-template-columns:1fr}
.rule-panel{position:relative;display:grid;place-items:center;min-height:0}.rule-panel figcaption{position:absolute;left:32px;bottom:24px}
.cs{--h:120px;position:relative;padding:calc(var(--h) * var(--k))}.cs img.cs-mark,.cs .typed{height:var(--h);width:auto;font-size:var(--h)}
.cs .g{position:absolute;border:0 dashed var(--g-line)}.cs .gt,.cs .gb{left:-80px;right:-80px;border-top-width:1px}.cs .gt{top:calc(var(--h) * var(--k))}.cs .gb{bottom:calc(var(--h) * var(--k))}
.cs .gl,.cs .gr{top:-60px;bottom:-60px;border-left-width:1px}.cs .gl{left:calc(var(--h) * var(--k))}.cs .gr{right:calc(var(--h) * var(--k))}
.cs{border:1px dashed currentColor}.cs .x{position:absolute}.cs .xt{top:calc(var(--h) * var(--k) / 2 - 8px);left:50%}.cs .xl{left:8px;top:50%}
.min{display:grid;gap:16px;justify-items:start}.min-mark{display:block}.min-mark img.art{width:100%}.min-mark .typed{font-size:20px}.dim{border-top:1px solid currentColor;padding-top:6px;justify-content:center;min-width:max-content}
/* misuse */
.rules{display:grid;grid-template-rows:minmax(0,1fr);gap:24px}.rules.with-misuse{grid-template-rows:minmax(0,1fr) 248px}
.misuse{display:grid;gap:16px}
.mis{display:grid;grid-template-rows:minmax(0,1fr) auto;gap:16px;min-height:0;min-width:0;padding:20px;border:1px solid var(--g-rule);border-radius:var(--radius-md,0)}.mis figcaption{display:block;text-transform:none}
.mis-art{position:relative;overflow:hidden;display:grid;place-items:center;min-height:96px;color:var(--g-text)}
.slash{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.slash line{stroke:var(--g-text);stroke-width:1.5}
.mis-logo{display:block;width:min(52%,220px)}.mis-logo.ghost img.art{filter:drop-shadow(1px 0 0 var(--color-text-inverse)) drop-shadow(-1px 0 0 var(--color-text-inverse)) drop-shadow(0 1px 0 var(--color-text-inverse)) drop-shadow(0 -1px 0 var(--color-text-inverse));opacity:.55}.mis-logo img.art{width:100%}.mis-logo .typed{font-size:28px}
.mk{position:relative;display:block;width:min(52%,220px)}.mk i{position:absolute;inset:0;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
.lost{display:block;width:min(calc(52% + 26px),246px);border:1px dashed var(--color-border-default);padding:12px}.lost .mis-logo{width:100%}
.outline{display:contents}.outline .mk{filter:drop-shadow(2px 0 0 var(--g-text)) drop-shadow(-2px 0 0 var(--g-text)) drop-shadow(0 2px 0 var(--g-text)) drop-shadow(0 -2px 0 var(--g-text))}
.retype{font:var(--${R.display.key});text-transform:uppercase;letter-spacing:.3em;font-size:18px;white-space:nowrap}.add{position:relative;display:flex;align-items:center;gap:6px;width:62%}.add .mis-logo{width:78%}
.crowd{display:grid;grid-template-columns:100%;justify-items:center;gap:2px;width:min(52%,220px)}.crowd .mis-logo{width:100%;outline:1px dashed var(--g-line);outline-offset:12px}.crowd-head{max-width:100%;text-align:center;color:var(--g-text)}
.add i{display:block;width:20%;height:24px;background:var(--color-accent-bg)}.add.under{flex-direction:column;align-items:flex-start;gap:10px}.add.under i{width:74%;height:10px}
/* candidates */
.cands{display:grid;gap:24px}.cand{display:grid;grid-template-rows:auto 1fr 1fr auto auto;gap:12px;min-height:0;min-width:0}
.cand-row{display:grid;place-items:center;border:1px solid var(--g-rule);min-height:0;padding:16px 24px}.cand-head{display:flex;justify-content:space-between;align-items:center;min-height:72px}
.cand-h img.art{height:var(--spacing-6,24px);width:auto}.cand-big img.art{width:60%;max-width:100%;height:auto;margin:auto}.cand-big .mk{width:60%;margin:auto}
.cand-min{display:flex;justify-content:space-between;align-items:center}.cand-min img.art{width:100%;height:auto}.cand figcaption{flex-direction:column;gap:4px}
/* palette */
.palette{display:flex;gap:0;border:1px solid var(--g-rule)}
.field{display:flex;flex-direction:column;justify-content:space-between;padding:28px;min-width:180px;box-shadow:inset 0 0 0 1px var(--g-rule)}
.field-meta{display:grid;gap:4px}.field-meta b{display:block}
/* ramps */
.ramps{display:grid;gap:12px}.ramp{display:grid;grid-template-columns:160px repeat(11,1fr);min-height:0}
.ramp-name{align-self:center}
.rc{position:relative;padding:12px;display:flex;align-items:flex-end;min-height:0;box-shadow:inset 0 0 0 1px var(--g-rule)}.rc .t-meta{flex-direction:column;gap:2px}
.anchor{position:absolute;top:14px;left:14px;width:14px;height:14px;border-radius:50%;background:currentColor}
/* chroma */
.chart{display:block;width:100%;height:100%}.chart .grid{stroke:var(--g-line);stroke-width:1}
.chart .ax{font:var(--${R.meta.key});fill:var(--color-text-secondary)}.chart .lbl{font:var(--${R.lede.key});fill:var(--color-text-primary)}
/* pairs */
.pairs{display:grid;gap:16px}
.pair{display:grid;grid-template-rows:minmax(0,1fr) auto;border:1px solid var(--g-rule);min-height:0;padding:16px}
.pair .t-meta{flex-direction:column;gap:2px;min-width:0}
.shape{display:block;width:min(44%,240px);aspect-ratio:1;place-self:center}.shape.text{background:var(--c)}.shape.line{border:4px solid var(--c)}.shape.mark{border-radius:50%;background:var(--c);width:min(36%,200px)}
/* contrast */
.contrast{display:grid;gap:16px}
.ct{position:relative;display:grid;place-items:center;border:1px solid var(--g-rule);min-height:0}
.ct.none{border-style:dashed;color:var(--g-2)}.ct-word{font:var(--${R.title.key});letter-spacing:var(--${R.title.key}-letter-spacing);white-space:nowrap}
.ct .t-meta{position:absolute;left:16px;bottom:14px;right:16px;flex-direction:column;gap:2px}
/* type */
.faces{display:grid;gap:24px}
.face{display:grid;grid-template-rows:auto 1fr auto auto;gap:24px;min-height:0;min-width:0;border-top:1px solid var(--g-rule);padding-top:32px}.face-name{line-height:1;white-space:nowrap}.glyphs{line-height:1.4;word-break:break-all;align-self:end}
.weights{display:flex;gap:16px 32px;flex-wrap:wrap;font-size:24px;border-top:1px solid var(--g-rule);padding-top:20px}
.type-rows{display:flex;flex-direction:column}.type-row{flex:1 1 auto;display:grid;grid-template-columns:260px minmax(0,1fr);gap:40px;align-items:center;border-top:1px solid var(--g-rule);padding:8px 0;min-height:0}
.type-meta{flex-direction:column;gap:2px;color:var(--g-2)}.type-meta b{color:var(--g-text)}.type-sample{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* scale */
.scale{display:grid;grid-template-rows:auto minmax(0,1fr);gap:24px}
.steps{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding-top:8px}.step{display:grid;justify-items:start;gap:12px}.glyph{line-height:1;color:var(--g-text)}.step .t-meta{flex-direction:column;gap:2px;color:var(--g-2)}.step .t-meta b{color:var(--g-text)}
.spec{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}.spec-head,.spec-row{display:grid;grid-template-columns:3fr 3fr 2fr 3fr 2fr 2fr;column-gap:16px;align-items:center}.spec-head{color:var(--g-2);padding-bottom:12px;border-bottom:1px solid var(--g-rule)}.spec-rows{display:grid;min-height:0}.spec-row{border-bottom:1px solid var(--g-rule)}
/* compose */
.compose{display:grid;grid-template-columns:7fr 5fr;gap:72px}
.cp{display:grid;grid-template-rows:auto 1fr;gap:32px;min-height:0}
.cp-line{border-bottom:var(--stroke-hairline,1px) solid var(--g-text);padding-bottom:var(--spacing-2,8px);display:flex;justify-content:space-between}
.cp-main{display:grid;align-content:end;gap:24px;justify-items:start;min-height:0}.cp-body{max-width:56ch}.cp.data .cp-main{gap:12px}
/* space */
.space-grid{display:grid;gap:24px}
.lay-grid{display:grid;column-gap:72px;min-height:0}.lay-ruler{display:grid;grid-auto-rows:minmax(0,1fr);align-content:stretch;gap:32px}.lay-row{display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;min-height:0}.lay-label{color:var(--g-2)}
.lay-track{position:relative;border-left:1px solid var(--g-line);border-bottom:1px solid var(--g-line);min-height:72px}
.lay-bar{display:block;height:24px;margin-bottom:12px;background:var(--g-text);position:relative}.lay-bar b{position:absolute;left:calc(100% + 12px);top:0;white-space:nowrap}
.lay-tick{position:absolute;bottom:0;height:100%;border-left:1px solid var(--g-line)}.lay-tick b{position:absolute;left:8px;top:0;white-space:nowrap;display:block}
.lay-tick.turn{border-left:var(--stroke-focus,2px) solid var(--color-accent-bg)}.lay-tick.turn b{color:var(--g-text)}
.lay-range{position:absolute;top:24px;height:24px;background:var(--color-accent-bg)}.lay-range b{position:absolute;top:calc(100% + 12px);left:0;white-space:nowrap}
.tbl{display:grid;grid-template-rows:auto auto minmax(0,1fr);min-height:0}.tbl h3{margin-bottom:24px;color:var(--g-text)}
.panel h3{margin-bottom:24px;color:var(--g-2)}
.tbl-head,.tr{display:grid;grid-template-columns:5fr 4fr 2fr;column-gap:16px;align-items:center}.tbl-head{color:var(--g-2);padding-bottom:12px;border-bottom:1px solid var(--g-rule)}.tr span:last-child,.tbl-head span:last-child{text-align:right}
.tbl-rows{display:grid;min-height:0}.bar{display:block;height:12px;background:var(--color-text-primary);max-width:100%}.sq{display:block;width:44px;height:44px;border:var(--stroke-hairline,1px) solid var(--color-text-primary);background:none}.lift{display:block;width:72px;height:44px;background:var(--color-bg-raised,var(--color-bg-page));border-radius:var(--radius-md,0)}
.unitgrid .tr>span:nth-child(2){align-self:stretch;display:flex;align-items:center;background-image:repeating-linear-gradient(90deg,var(--g-line) 0 1px,transparent 1px var(--u))}
.rules-depth{display:flex;flex-direction:column;gap:20px;min-height:0}.rules-depth .strokes{display:grid}.rules-depth .tr{padding:14px 0;border-bottom:1px solid var(--g-rule)}.rule{display:block;background:var(--color-text-primary);width:100%}
.depth{flex:1;min-height:0;display:grid;gap:12px}.ground{display:flex;align-items:flex-end;padding:12px;min-width:0}.depth-note{color:var(--g-2)}
/* motion */
.motion-grid{display:grid;grid-template-columns:7fr 5fr;gap:24px}
.motion-grid>.panel{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}
.band-rows{display:flex;flex-direction:column}
.band{flex:1;display:grid;grid-template-columns:240px minmax(0,1fr) 160px;gap:24px;align-items:center;border-top:1px solid var(--g-rule)}
.band-name{display:grid;gap:4px}.band-name span{color:var(--g-2)}.band-nums{flex-direction:column;gap:2px;color:var(--g-2)}
.demo{display:flex;align-items:center;min-width:0;height:100%}
.d-btn{display:inline-block;background:var(--color-action-bg);color:var(--color-action-text);padding:12px 22px;border-radius:var(--radius-md,0)}
.d-layer,.d-cut{display:block;border:0;background:var(--color-bg-inverse);color:var(--color-text-inverse);padding:16px 24px;border-radius:var(--radius-md,0);white-space:nowrap}
.d-cut b:last-child{display:none}.d-cut.flip b:first-child{display:none}.d-cut.flip b:last-child{display:block}.d-cut b{font-weight:inherit}
.curve-row{display:grid;gap:32px;align-content:space-evenly}.curve-row svg{width:100%;max-width:320px;height:auto;display:block}.curve-row .box{fill:none;stroke:var(--g-line)}.curve-row .curve{fill:none;stroke:var(--g-text);stroke-width:3}
.curve-row figcaption{flex-direction:column;gap:2px;margin-top:8px}
/* imagery */
.gallery{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:1fr 1fr;gap:16px}.shot{background-size:cover;background-position:center;border-radius:var(--radius-md,0);grid-column:span 3}
.shot.s0{grid-column:span 6;grid-row:span 2}.g1 .shot.s0{grid-column:span 12}.g2 .shot{grid-column:span 6;grid-row:span 2}
.g3 .shot.s1,.g3 .shot.s2{grid-column:span 6}.g4 .shot.s3{grid-column:span 6}.g5 .shot.s3,.g5 .shot.s4{grid-column:span 3}
/* in use */
.use-grid{display:grid;grid-template-columns:8fr 4fr;grid-template-rows:1fr 1fr;gap:24px}
.use{border-radius:var(--radius-lg,0);overflow:hidden;position:relative;min-height:0}
.hero{grid-row:span 2;background:var(--color-bg-page);color:var(--color-text-primary);border:1px solid var(--g-rule);padding:32px 48px 56px;display:grid;grid-template-rows:auto 1fr;gap:48px}
.use-nav{display:flex;align-items:center;gap:32px}img.nav-mark{width:var(--logo-min-width,160px);height:auto}.use-nav .typed{font-size:28px}.nav-links{display:flex;gap:28px;margin-left:auto;color:var(--color-text-secondary)}
.btn{display:inline-block;background:var(--color-action-bg);color:var(--color-action-text);padding:12px 22px;border-radius:var(--radius-md,0);white-space:nowrap}
.hero-main{align-self:end;display:grid;gap:24px;justify-items:start;max-width:920px;position:relative;z-index:1}.hero-sub{color:var(--color-text-primary);max-width:56ch}
.m-under{display:inline-grid;justify-items:stretch}.m-under.fixed{justify-items:start}.m-under i,.m-rim{display:block}.m-under p{margin:0}.m-ruled{border-style:solid;white-space:nowrap;overflow:hidden;width:100%;display:flex;justify-content:space-between;gap:24px}.m-figure{display:grid;gap:8px;justify-items:start}img.m-file{max-width:100%;height:auto}.motif-art.drawn{padding:0 24px}.motif-art.drawn>*{max-width:100%}.hero-edge{grid-column:1/-1}.hero.edge-top{grid-template-rows:auto auto 1fr}.hero:not(.edge-top){grid-template-rows:auto 1fr auto}.hero-edge img.art{max-width:100%;height:auto}
.hero-img{position:absolute;right:0;top:0;bottom:0;width:38%;background-size:cover;background-position:center}
.card-inv{background:var(--color-bg-inverse);color:var(--color-text-inverse);padding:40px;display:grid;gap:24px;align-content:space-between}img.card-mark{width:var(--logo-min-width,160px);height:auto}.card-inv .typed{font-size:24px}
.social{background:var(--color-accent-bg);color:var(--color-text-on-accent);padding:40px;display:grid;align-content:space-between}
/* rules */
.rule-cols{display:grid;grid-template-columns:1fr 1fr;gap:72px}
.rule-col{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}
.rule-col h3{border-bottom:2px solid var(--g-text);padding-bottom:16px}
.rule-col ol{display:grid}.rule-col li{border-bottom:1px solid var(--g-rule);padding:16px 0;display:flex;align-items:center}
/* colophon */
.files{display:grid}.file{display:grid;grid-template-columns:5fr 7fr;column-gap:24px;align-items:end;border-top:1px solid var(--g-rule);padding-bottom:16px}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

// Measures every board once the fonts have loaded: anything that runs past the frame, and any band
// left empty at the top or the bottom of a board's body. The print step reads the result.
const measure = `function sheetFit(){var out=[];document.querySelectorAll('.board').forEach(function(b){var r={board:b.getAttribute('data-board')};var body=b.querySelector('.b-body')||b;if(b.scrollHeight>b.clientHeight+1||body.scrollHeight>body.clientHeight+1)r.overflow=Math.max(b.scrollHeight-b.clientHeight,body.scrollHeight-body.clientHeight);var bb=body.getBoundingClientRect(),top=1e9,bot=-1e9;body.querySelectorAll('*').forEach(function(e){var cs=getComputedStyle(e);var painted=!e.children.length||/^(IMG|svg)$/.test(e.tagName)||cs.backgroundColor!=='rgba(0, 0, 0, 0)'||cs.backgroundImage!=='none'||parseFloat(cs.borderTopWidth)>0||parseFloat(cs.borderBottomWidth)>0;if(!painted)return;var q=e.getBoundingClientRect();if(!q.width||!q.height)return;top=Math.min(top,q.top);bot=Math.max(bot,q.bottom);});if(top<1e9){r.top=Math.round(top-bb.top);r.bottom=Math.round(bb.bottom-bot);}out.push(r);});return out;}`;

// Sets every typeface's name to one x-height, measured from the face itself once it has loaded, the
// largest at which the widest name still fits its column. A name set at one font size reads larger or
// smaller with each face's proportions, so the sizes are optical and sit outside the type scale.
const fitNames = `function fitNames(){var els=[].slice.call(document.querySelectorAll('.face-name[data-fit]'));if(!els.length)return;var c=document.createElement('canvas').getContext('2d');
var room=function(e){var p=e.parentElement,cs=getComputedStyle(p);return p.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);};
for(var pass=0;pass<4;pass++){var target=56;var rows=els.map(function(e){var cs=getComputedStyle(e),px=parseFloat(cs.fontSize);c.font=cs.fontStyle+' '+cs.fontWeight+' '+px+'px '+cs.fontFamily;var x=(c.measureText('x').actualBoundingBoxAscent||px/2)/px;var r=document.createRange();r.selectNodeContents(e);var w=(r.getBoundingClientRect().width||1)/px;target=Math.min(target,0.96*room(e)/w*x);return{e:e,x:x};});
rows.forEach(function(q){q.e.style.fontSize=(target/q.x).toFixed(1)+'px';});}}`;

// Plays each motion band. Rest is the visible state, and a band plays a few seconds in, then every few.
const play = `(function(){function wait(m){return new Promise(function(r){setTimeout(r,m)});}
var cs=getComputedStyle(document.documentElement);function tok(n){return cs.getPropertyValue(n).trim();}
document.querySelectorAll('.demo').forEach(function(d){var k=d.dataset.kind,i=+d.dataset.in,o=+d.dataset.out,ei=d.dataset.ein,eo=d.dataset.eout,mv=+d.dataset.move||8,el=d.firstElementChild;
async function once(){
if(k==='feedback'){var a=tok('--color-action-bg'),b=tok('--color-action-bg-pressed')||a;await el.animate([{backgroundColor:a},{backgroundColor:b}],{duration:i,easing:ei,fill:'forwards'}).finished;await wait(500);await el.animate([{backgroundColor:b},{backgroundColor:a}],{duration:o,easing:eo,fill:'forwards'}).finished;}
else if(k==='layer'){await el.animate([{opacity:0,transform:'translateY('+mv+'px)'},{opacity:1,transform:'none'}],{duration:i,easing:ei}).finished;await wait(900);await el.animate([{opacity:1},{opacity:0}],{duration:o,easing:eo,fill:'forwards'}).finished;await wait(500);el.getAnimations().forEach(function(x){x.cancel()});}
else{await wait(1000);el.classList.toggle('flip');}}
(async function(){await wait(1200);for(;;){await once();await wait(1400);}})();});})();`;

const html = (pageCss = '', still = false) => `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1920">
<title>${esc(brandName)} brand standards</title>
<!-- Generated by scripts/sheet.mjs from the tokens and the brand's files. Do not edit. -->
<style>${fontCss}${tokensCss}${css}${pageCss}</style>
</head>
<body>
<main class="sheet">
${rendered.filter(([b]) => b !== 'colophon').map(([, h], i) => h.replace('class="board ', `class="board batch-${Math.floor(i / 20) + 1} `)).concat(rendered.filter(([b]) => b === 'colophon').map(([, h]) => h)).join('\n')}
</main>
<script>${measure}${fitNames}${still ? '' : play}document.fonts.ready.then(function(){fitNames();var d=document.documentElement;d.setAttribute('data-sheet-height',Math.ceil(d.scrollHeight));d.setAttribute('data-sheet-fit',JSON.stringify(sheetFit()));});</script>
</body>
</html>
`;

const outFile = resolve(BRAND, draft ? 'review.html' : 'standards.html');
writeFileSync(outFile, html());
// A finished sheet replaces the drafts the review rounds left behind.
if (!draft) for (const f of ['review.html', 'review.pdf']) rmSync(resolve(BRAND, f), { force: true });
const result = { wrote: draft ? 'review.html' : 'standards.html', theme, boards: rendered.map(([b]) => b) };
// A warning the founder has accepted, listed in sheet.json → accepted with who and when, is reported
// as accepted rather than open. Its text must match the warning as printed, so a changed warning fires again.
const acceptedList = (Array.isArray(sheetCfg.accepted) ? sheetCfg.accepted : []).map((a) => (typeof a === 'string' ? { warning: a } : a)).filter((a) => a && String(a.warning ?? '').trim());
const report = () => {
  const open = [], acc = [];
  for (const w of warnings) { const a = acceptedList.find((x) => w.includes(String(x.warning).trim())); if (a) acc.push({ warning: w, ...(a.by ? { by: a.by } : {}), ...(a.date ? { date: a.date } : {}) }); else open.push(w); }
  return { ...(open.length ? { warnings: open } : {}), ...(acc.length ? { accepted: acc } : {}) };
};

if (args.includes('--pdf')) {
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
  const browser = candidates.find((c) => existsSync(c));
  if (!browser) { console.log(JSON.stringify({ ...result, ...report(), pdf: null, reason: 'No Chromium-family browser was found. Set CHROME_PATH, or open the HTML and print it to PDF with no margins.' })); process.exit(3); }
  const profile = resolve(BRAND, '.sheet-print');
  mkdirSync(profile, { recursive: true });
  const common = ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--user-data-dir=${profile}`, '--window-size=1920,1080', '--virtual-time-budget=6000'];
  const tmp = resolve(BRAND, '.sheet-print.html');
  try {
    const dom = execFileSync(browser, [...common, '--dump-dom', `file://${outFile}`], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    const h = Number((dom.match(/data-sheet-height="(\d+)"/) ?? [])[1] ?? 0);
    if (!h) throw new Error('could not measure the page');
    const fit = JSON.parse(((dom.match(/data-sheet-fit="([^"]*)"/) ?? [])[1] ?? '[]').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
    // A board's body may breathe in the middle. An empty band at its top or its bottom reads as a
    // layout that did not fill its frame.
    for (const f of fit) {
      if (f.overflow) warnings.push(`Board ${f.board} runs ${f.overflow}px past its frame.`);
      if (f.board !== 'cover' && f.top > 64) warnings.push(`Board ${f.board} leaves ${f.top}px empty at the top of its body.`);
      if (f.board !== 'cover' && f.bottom > 64) warnings.push(`Board ${f.board} leaves ${f.bottom}px empty at the bottom of its body.`);
    }
    // One board to a page, edge to edge.
    writeFileSync(tmp, html('@page{size:1920px 1080px;margin:0}', true));
    const pdf = resolve(BRAND, draft ? 'review.pdf' : 'standards.pdf');
    execFileSync(browser, [...common, '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, `file://${tmp}`], { stdio: 'ignore' });
    const bytes = readFileSync(pdf).toString('latin1');
    result.pdf = draft ? 'review.pdf' : 'standards.pdf';
    result.pages = (bytes.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
    result.fonts = [...new Set([...bytes.matchAll(/\/FontName\s*\/(?:[A-Z]{6}\+)?([^\s/>]+)/g)].map((m) => m[1]))];
    // A browser embeds each font as a subset, named with a six-letter tag.
    const tagged = [...bytes.matchAll(/\/FontName\s*\/([^\s/>]+)/g)].map((m) => m[1]);
    result.fontsEmbedded = tagged.length > 0 && tagged.every((f) => /^[A-Z]{6}\+/.test(f));
    result.heightPx = h;
  } catch (e) {
    result.pdf = null;
    result.reason = `Printing failed: ${e.message}`;
  } finally {
    rmSync(tmp, { force: true });
    rmSync(profile, { recursive: true, force: true });
  }
}
Object.assign(result, report());
console.log(JSON.stringify(result));
