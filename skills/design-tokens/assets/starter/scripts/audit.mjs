#!/usr/bin/env node
// Scans prose and code for a color, a size or a font family typed as a literal where a token
// belongs. A value is typed once, in src/. Everywhere else names the token.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, extname, basename, join } from 'node:path';
import { ROOT, BRAND } from './lib/tokens.mjs';

const HELP = `Usage: node scripts/audit.mjs [paths...]

With no path, scans the brand folder's own markdown: DESIGN.md, core-idea.md, logo.md, motion.md
and README.md, and every SVG under assets/. Give paths to scan code or other files, such as
../../src or ../standards.html.

Rules:
  DESIGN.md prose     No hex or color function. A font family is allowed where it equals a token's
                      value. A size passes only where it equals a breakpoint-* token: a media
                      query cannot read a custom property, so the breakpoint is the one size the
                      prose states. Every other size or duration fails, as in other prose. No
                      measured contrast ratio: the generated contrast.md holds those.
  Other brand prose   No literal at all. Name the token.
  Token names         In all brand prose, every token named in braces ({spacing.4}, {colors.x})
                      or in backticks by its published name (\`stroke-rim\`, \`--container-content\`,
                      var(--x)) exists in tokens.json. A renamed token fails here.
  Code                No color literal, and no literal font-family, font-size, font-weight,
                      line-height or letter-spacing. Each belongs to a type role. A length on a
                      spacing, size or radius property is a token, never a literal, even one that
                      equals a token's value: 768px where --breakpoint-md is meant hides the link.
                      The token a finding suggests comes from a family that fits the property:
                      spacing or stroke for padding, margin, gap and inset, container or spacing
                      for a width or height, radius for a corner.
                      Media and container queries are exempt. A unitless number on a length
                      (React's padding: 24, const maxWidth = 920) and a token multiplied in calc()
                      are derived values and fail too. Every var(--x) names a token or a property
                      the file declares.
  README.md           Every path it names exists.
  assets/manifest.md  Every file under assets/ has a row, and every row's file exists. A row that
                      names a folder (fonts/<family>/) covers the files in it. Read in the default
                      scan, since the manifest is rewritten from the folder and never patched.
  standards.html      Every hex in the file equals a token's value.
  Logo lengths        Where logo-min-width exists, logo-min-height and logo-min-clear-space exist
                      and match the primary file in logo.md → ## Versions at that width, each to
                      the whole px. Read in the default scan.
  SVG art             No live text. A <text> element renders in a fallback font wherever the face
                      is not installed, so lettering in a logo or a motif is outlined.
  Published names     A token named in backticks by its source path (\`motion.feedback.duration\`)
                      fails, with the published name to use instead (\`motion-feedback-duration\`).
  Unused tokens       On the default scan, once ../DESIGN.md exists, every Intent ramp and Patterns
                      role has to be used. An Intent ramp is used when a Patterns role points at
                      any of its steps. A Patterns role is
                      used when brand prose names it, the standards sheet applies it (sheet.mjs
                      names it), or a companion file names it. The generated frontmatter,
                      contrast.md, figma.json and pairs.json are not use. Brand values may sit
                      unused: they are the palette. A token used outside this folder, in a
                      product's code, carries $extensions["brand-os"].keep saying where.
                      --no-unused skips the check
  Typeface names      Allowed in a manifest row for a font file and in the dimension pages
                      (11_purpose…44_taglines), which record what a file is or what was decided.

Skipped: frontmatter, the generated motion table, decisions.md, and the token outputs.

Output: one JSON line on stdout. Findings on stderr as file:line: kind: literal.
Exit codes: 0 clean, 1 findings, 2 tokens.json is missing (run the build first).`;
const args = process.argv.slice(2);
if (args.includes('--help')) { console.log(HELP); process.exit(0); }
const tfile = resolve(ROOT, 'tokens.json');
if (!existsSync(tfile)) { console.error('Error: tokens.json is missing. Run node scripts/build.mjs first.'); process.exit(2); }
const built = JSON.parse(readFileSync(tfile, 'utf8'));

// Every value a token resolves to, in any theme.
const known = { hex: new Set(), family: new Set() };
const take = (v) => {
  if (v && typeof v === 'object') return Object.values(v).forEach(take);
  for (const h of String(v).match(/#[0-9a-fA-F]{6}\b/g) ?? []) known.hex.add(h.toLowerCase());
};
Object.values(built.themes).forEach(take);
// A ramp's anchor is recorded in the source beside its ramp, and the sheet labels each ramp with it.
for (const m of Object.values(built.meta ?? {})) for (const r of Object.values(m.ramps ?? {})) if (r.anchor) known.hex.add(String(r.anchor).toLowerCase());
for (const t of Object.values(built.themes))
  for (const [k, v] of Object.entries(t)) if (k.startsWith('font-family-')) known.family.add(String(v).split(',')[0].replaceAll('"', '').trim());
// Value back to token name, per token family, so a literal that equals a token can say which one it
// should name. The family follows the property: 24px on padding is a spacing step even where a
// font-size step holds the same number.
const nameOf = new Map();
const breakpoints = new Set();
for (const [k, v] of Object.entries(built.themes[built.default] ?? {})) {
  if (typeof v !== 'string') continue;
  const m = v.match(/^(-?\d*\.?\d+)(px|rem|ms)$/);
  if (!m) continue;
  const n = parseFloat(m[1]);
  const px = m[2] === 'rem' ? n * 16 : n;
  const keys = m[2] === 'ms' ? [`${n}ms`] : [`${px}px`, `${+(px / 16).toFixed(4)}rem`];
  const fam = k.match(/^(font-size|line-height|[a-z]+)-/)?.[1] ?? k;
  if (!nameOf.has(fam)) nameOf.set(fam, new Map());
  for (const key of keys) if (!nameOf.get(fam).has(key)) nameOf.get(fam).set(key, k);
  if (fam === 'breakpoint') for (const key of keys) breakpoints.add(key);
}
const FAMILIES = (prop) => /radius/.test(prop) ? ['radius']
  : /width|height|basis|grid-template/.test(prop) ? ['container', 'spacing']
  : ['spacing', 'stroke'];
const suggest = (prop, v) => { for (const f of FAMILIES(prop)) { const t = nameOf.get(f)?.get(v); if (t) return t; } };
const tokenKeys = new Set(Object.values(built.themes).flatMap((t) => Object.keys(t)));
// Typography composites publish their parts too.
for (const t of Object.values(built.themes)) for (const [k, v] of Object.entries(t)) if (v && typeof v === 'object') for (const p of ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'font-feature-settings', 'font-stretch']) tokenKeys.add(`${k}-${p}`);
// A name in backticks is read as a token when it starts with a token group's own prefix. CSS and SVG
// properties that share a prefix are not tokens.
const PREFIX = /^(color|spacing|radius|stroke|container|breakpoint|viewport|type|elevation|motion|duration|easing|shadow|logo|tracking|font-(?:size|family|weight)|line-height)-[\w-]+$/;
const NOT_TOKENS = new Set(['color-scheme', 'color-mix', 'color-interpolation', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-opacity', 'stroke-miterlimit', 'line-height-step']);
const BRACE = { colors: 'color', typography: 'type', rounded: 'radius', spacing: 'spacing', elevation: 'elevation', 'font-size': 'font-size', 'line-height': 'line-height' };
const GENERIC = new Set(['system-ui', 'sans-serif', 'serif', 'monospace', 'ui-sans-serif', 'ui-serif', 'ui-monospace']);
const families = [...known.family].filter((f) => !GENERIC.has(f));

const HEX = /(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/g;
const SIZE = /(?<![\w.#-])(-?\d*\.?\d+)(px|rem|em|ms|pt)\b/g;
const findings = [];
// Every token a consumer names, published form, for the unused-token check.
const used = new Set();
const markUsed = (n) => { used.add(n); const t = n.match(/^(type-[\w-]+?)-(font-family|font-size|font-weight|line-height|letter-spacing|text-transform|font-feature-settings|font-stretch)$/); if (t) used.add(t[1]); };
const add = (file, line, kind, literal) => findings.push({ file: relative(process.cwd(), file) || basename(file), line, kind, literal });

function prose(file, strict) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let fm = lines[0] === '---';
  let generated = false;
  lines.forEach((raw, i) => {
    if (fm) { if (i > 0 && raw === '---') fm = false; return; }
    if (raw.includes('<!-- motion-tokens -->')) generated = true;
    if (raw.includes('<!-- /motion-tokens -->')) { generated = false; return; }
    if (generated) return;
    for (const m of raw.matchAll(/\{([a-z][a-z-]*)\.([\w.-]+)\}/g)) {
      const g = BRACE[m[1]];
      if (!g || (m[1] === 'colors' && m[2] === 'primary')) continue;
      if (!tokenKeys.has(`${g}-${m[2].replaceAll('.', '-')}`)) add(file, i + 1, 'token reference that names no token', m[0]);
      else markUsed(`${g}-${m[2].replaceAll('.', '-')}`);
    }
    for (const m of raw.matchAll(/`(?:var\()?(?:--)?([a-z][\w-]*)\)?`|var\(--([a-z][\w-]*)\)/g)) {
      const n = m[1] ?? m[2];
      if (!PREFIX.test(n) || NOT_TOKENS.has(n)) continue;
      if (!tokenKeys.has(n)) add(file, i + 1, 'token name that names no token', n);
      else markUsed(n);
    }
    // A token named by its source path in backticks reads as a token but is no name anything
    // publishes. The published name is the path with dashes, without the layer.
    for (const m of raw.matchAll(/`((?:brand|intent|patterns|core)\.)?([a-z][\w-]*(?:\.[\w-]+)+)`/g)) {
      const n = m[2].replaceAll('.', '-');
      if (tokenKeys.has(n)) { add(file, i + 1, `token named by its source path, use its published name \`${n}\``, m[0]); markUsed(n); }
    }
    const text = raw.replace(/\{[a-z][\w.-]*\}/g, '').replace(/\]\([^)]*\)/g, ']');
    for (const m of text.match(HEX) ?? []) add(file, i + 1, 'hex in prose, name the token', m);
    for (const m of text.match(FN) ?? []) add(file, i + 1, 'color function in prose, name the token', m + '…)');
    for (const m of text.matchAll(SIZE)) {
      const v = `${parseFloat(m[1])}${m[2]}`;
      if (strict) add(file, i + 1, 'literal value, name the token', m[0]);
      else if (!breakpoints.has(v)) add(file, i + 1, 'size that is no breakpoint, name the token', m[0]);
    }
    // A measured ratio typed into prose is a second copy of a number contrast.md holds. The floors
    // themselves (3, 4.5, 7) are standards and may be named.
    for (const m of text.matchAll(/\b(\d+(?:\.\d+)?)\s*(?::\s*1\b|to 1\b)/g)) if (![3, 4.5, 7].includes(parseFloat(m[1]))) add(file, i + 1, 'measured contrast typed in prose, point at contrast.md', m[0]);
    if (basename(file) === 'README.md') for (const m of raw.matchAll(/`([^`\s]+(?:\/[^`\s]*|\.(?:md|css|json|js|pdf|html)))`/g)) {
      const rel = m[1].split('→')[0].trim();
      if (/[\[\]*<>{}]/.test(rel)) continue;
      if (!existsSync(resolve(BRAND, rel)) && !existsSync(resolve(BRAND, '..', rel))) add(file, i + 1, 'path that does not exist', rel);
    }
    const fontRow = basename(file) === 'manifest.md' && /`[^`]*fonts\/[^`]*`/.test(raw);
    if (strict && !fontRow && !/^\d{2}_/.test(basename(file))) for (const f of families) if (new RegExp(`(?<![\\w-])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(text)) add(file, i + 1, 'font family named in prose, name the token', f);
  });
}

function code(file) {
  const src = readFileSync(file, 'utf8');
  // Custom properties the file declares for itself are not tokens and may be read with var().
  const own = new Set([...src.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1].slice(2)));
  const js = /\.(js|jsx|ts|tsx|vue|svelte|astro|html)$/.test(file);
  src.split('\n').forEach((raw, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(raw)) return;
    for (const m of raw.matchAll(/var\(--([\w-]+)/g)) { if (tokenKeys.has(m[1])) markUsed(m[1]); if (PREFIX.test(m[1]) && !NOT_TOKENS.has(m[1]) && !tokenKeys.has(m[1]) && !own.has(m[1])) add(file, i + 1, 'var() that names no token', `--${m[1]}`); }
    // A number with no unit on a length is a size the scan cannot see: React reads padding: 24 as px.
    if (js) for (const m of raw.matchAll(/\b((?:[a-z]\w*)?(?:[Ww]idth|[Hh]eight|[Gg]ap|[Mm]argin\w*|[Pp]adding\w*|[Rr]adius|[Ii]nset|[Tt]op|[Bb]ottom|[Ll]eft|[Rr]ight))\s*[:=]\s*(-?\d+(?:\.\d+)?)(?![\w.%])/g))
      if (parseFloat(m[2]) !== 0 && !/^line|^font/i.test(m[1])) add(file, i + 1, `unitless ${m[1]}, a derived size: name the token`, m[2]);
    // A token multiplied or divided in calc() makes a value no token holds.
    if (!/@media|@container/.test(raw)) for (const m of raw.matchAll(/calc\([^;]*?var\(--([\w-]+)\)\s*[*\/]\s*(\d+(?:\.\d+)?)/g)) if (parseFloat(m[2]) !== 1) add(file, i + 1, 'size derived from a token in calc(), name the token that holds it', `var(--${m[1]}) * ${m[2]}`);
    const text = raw.replace(/var\(--[\w-]+\)/g, '');
    for (const m of text.match(HEX) ?? []) add(file, i + 1, 'color literal, use a role token', m);
    for (const m of text.match(FN) ?? []) add(file, i + 1, 'color literal, use a role token', m + '…)');
    if (/font-family\s*:(?!\s*(?:var\(|inherit))/i.test(raw) || /fontFamily\s*:\s*['"`]/.test(raw)) add(file, i + 1, 'literal font family, use a type role', raw.trim().slice(0, 60));
    if (/font-size\s*:\s*-?\d/i.test(raw) || /fontSize\s*:\s*['"`]?\d/.test(raw)) add(file, i + 1, 'literal font size, use a type role', raw.trim().slice(0, 60));
    // A length on a spacing, size or radius property is a token's value or it is invented.
    // Breakpoints are exempt: CSS cannot read a variable inside a media query.
    if (!/@media|@container/.test(raw)) for (const d of text.matchAll(/(?:^|[;{\s])((?:padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left|(?:max-|min-)?(?:width|height)|border-radius|flex-basis|grid-template-(?:columns|rows))(?:-[a-z]+)?)\s*:\s*([^;}]+)/gi))
      for (const m of d[2].matchAll(SIZE)) {
        const v = `${parseFloat(m[1])}${m[2]}`.replace(/^-/, '');
        if (parseFloat(m[1]) === 0) continue;
        const t = suggest(d[1].toLowerCase(), v);
        if (t) add(file, i + 1, `${d[1]} typed as a literal that equals --${t}, use var(--${t})`, m[0]);
        else add(file, i + 1, `${d[1]} that matches no ${FAMILIES(d[1].toLowerCase()).join(' or ')} token`, m[0]);
      }
    if (/(font-weight|line-height|letter-spacing)\s*:\s*-?[\d.]/i.test(raw) || /(fontWeight|lineHeight|letterSpacing)\s*:\s*['"`]?-?[\d.]/.test(raw)) add(file, i + 1, 'literal weight, leading or tracking, use the type role that holds it', raw.trim().slice(0, 60));
  });
}

function sheet(file) {
  const check = (text, line, kind) => {
    for (const m of text.match(HEX) ?? []) {
      const h = m.toLowerCase();
      const full = h.length === 4 ? '#' + [...h.slice(1)].map((c) => c + c).join('') : h.slice(0, 7);
      if (!known.hex.has(full)) add(file, line, kind, m);
    }
  };
  const seen = new Set();
  readFileSync(file, 'utf8').split('\n').forEach((raw, i) => {
    // Embedded SVG art is decoded and read too, once per file, so a logo's own colors are checked.
    const rest = raw.replace(/data:image\/svg\+xml;base64,([A-Za-z0-9+/=]+)/g, (_, b64) => {
      if (!seen.has(b64)) { seen.add(b64); check(Buffer.from(b64, 'base64').toString('utf8'), i + 1, 'hex in embedded art that matches no token'); }
      return '';
    }).replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g, '');
    check(rest, i + 1, 'hex that matches no token');
  });
}

function svg(file) {
  readFileSync(file, 'utf8').split('\n').forEach((raw, i) => { if (/<text[\s>]/.test(raw)) add(file, i + 1, 'live text in art, outline the lettering', '<text>'); });
}

function manifest(dir) {
  const file = join(dir, 'manifest.md');
  if (!existsSync(file)) return;
  const files = [];
  const walkAssets = (d) => { for (const f of readdirSync(d)) { if (f.startsWith('.')) continue; const p = join(d, f); if (statSync(p).isDirectory()) walkAssets(p); else if (p !== file) files.push(relative(dir, p)); } };
  walkAssets(dir);
  const rows = [];
  readFileSync(file, 'utf8').split('\n').forEach((raw, i) => {
    const cell = raw.startsWith('|') ? raw.split('|')[1] : '';
    const m = cell.match(/`([^`]+)`/);
    if (m) rows.push({ line: i + 1, path: m[1].trim().replace(/^(brand\/)?assets\//, '') });
  });
  for (const r of rows) if (!existsSync(join(dir, r.path))) add(file, r.line, 'manifest row for a file that does not exist', r.path);
  for (const f of files) if (!rows.some((r) => r.path === f || (r.path.endsWith('/') && f.startsWith(r.path)))) add(file, 1, 'file in assets/ with no manifest row', f);
}

const OUTPUTS = new Set(['tokens.css', 'tailwind.css', 'fonts.css', 'tokens.js', 'tokens.json', 'figma.json']);
const CODE = new Set(['.css', '.scss', '.html', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro']);
function visit(path) {
  const st = statSync(path);
  if (st.isDirectory()) {
    if (['node_modules', '.git', 'dist', 'build', 'scripts'].includes(basename(path))) return;
    for (const f of readdirSync(path)) visit(join(path, f));
    return;
  }
  const name = basename(path);
  if (OUTPUTS.has(name) || name === 'decisions.md') return;
  if (name === 'standards.html') return sheet(path);
  if (extname(path) === '.md') return prose(path, !/^DESIGN(\.\w+)?\.md$/.test(name));
  if (extname(path).toLowerCase() === '.svg') return svg(path);
  if (CODE.has(extname(path))) return code(path);
}

// The logo's two lengths follow from its minimum width, its clear-space share and the primary
// file's proportions. A page needs them as lengths: a share of a height it has to measure is a
// value no token holds. Each is checked against the file, so a swapped logo cannot leave them stale.
function logoLengths() {
  const md = resolve(BRAND, 'logo.md');
  const t = Object.values(built.themes)[0] ?? {};
  if (!existsSync(md) || t['logo-min-width'] === undefined) return;
  const lines = readFileSync(md, 'utf8').split('\n');
  const from = lines.findIndex((l) => /^##\s+Versions/.test(l));
  const row = from < 0 ? -1 : lines.findIndex((l, i) => i > from && /^\|/.test(l) && /`[^`]*\.svg`/.test(l));
  if (row < 0) return;
  const rel = lines[row].match(/`([^`]*\.svg)`/)[1].replace(/^brand\//, '');
  const file = resolve(BRAND, rel);
  if (!existsSync(file)) return;
  const svgSrc = readFileSync(file, 'utf8');
  const vb = svgSrc.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  const [w, h] = vb ? [+vb[1], +vb[2]] : [parseFloat(svgSrc.match(/\swidth\s*=\s*["']([\d.]+)/)?.[1]), parseFloat(svgSrc.match(/\sheight\s*=\s*["']([\d.]+)/)?.[1])];
  if (!(w > 0 && h > 0)) return;
  const px = (v) => parseFloat(String(v));
  const height = Math.round(px(t['logo-min-width']) * h / w);
  const want = { 'logo-min-height': `${height}px`, ...(t['logo-clear-space'] !== undefined ? { 'logo-min-clear-space': `${Math.round(height * px(t['logo-clear-space']))}px` } : {}) };
  for (const [name, value] of Object.entries(want)) {
    if (t[name] === undefined) add(`tokens/src/patterns.*.tokens.json`, 0, `missing logo length: add logo.${name.slice(5)} at ${value}, from ${rel} at logo-min-width`, name);
    else if (px(t[name]) !== px(value)) add(`tokens/src/patterns.*.tokens.json`, 0, `logo length does not match ${rel}: set it to ${value}`, `${name}: ${t[name]}`);
  }
}

const targets = args.filter((a) => !a.startsWith('--'));
if (targets.length) for (const t of targets) { if (!existsSync(t)) { console.error(`Error: no such path: ${t}`); process.exit(2); } visit(resolve(t)); }
else {
  for (const f of readdirSync(BRAND)) if (/^(DESIGN(\.\w+)?|core-idea|logo|motion|README)\.md$/.test(f)) visit(join(BRAND, f));
  const art = (dir) => { if (!existsSync(dir)) return; for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) art(p); else if (extname(p).toLowerCase() === '.svg') svg(p); } };
  art(resolve(BRAND, 'assets'));
  manifest(resolve(BRAND, 'assets'));
  logoLengths();
}

// Unused Intent and Patterns tokens, once the brand's materials exist. The sheet's script counts as
// a material: a role it names is a role it applies.
const unusedReport = [];
if (!args.includes('--no-unused') && !targets.length && existsSync(resolve(BRAND, 'DESIGN.md')) && built.meta) {
  const sheetSrc = existsSync(resolve(ROOT, 'scripts/sheet.mjs')) ? readFileSync(resolve(ROOT, 'scripts/sheet.mjs'), 'utf8') : '';
  const layers = Object.assign({}, ...Object.values(built.meta).map((m) => m.layers ?? {}));
  const keep = Object.assign({}, ...Object.values(built.meta).map((m) => m.keep ?? {}));
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const n of Object.keys(layers)) if (layers[n] === 'patterns' && new RegExp(`['"\`-]${esc(n)}['"\`]`).test(sheetSrc)) markUsed(n);
  // The rendered sheet applies a role wherever it reads it with var(). Swatches print values, so a
  // role the sheet only displays leaves no var() behind.
  const sheetOut = resolve(BRAND, 'standards.html');
  if (existsSync(sheetOut)) for (const m of readFileSync(sheetOut, 'utf8').matchAll(/var\(--([\w-]+)/g)) markUsed(m[1]);
  // An Intent ramp maps a whole Brand ramp stop for stop, so it is judged as a ramp: used when any
  // Patterns role points at any of its steps.
  const rampOf = (n) => n.replace(/-[^-]+$/, '');
  const usedRamps = new Set(Object.values(built.meta).flatMap((m) => Object.values(m.intent ?? {}).map(rampOf)));
  const seenRamp = new Set();
  for (const [n, layer] of Object.entries(layers)) {
    if (keep[n]) continue;
    if (layer === 'patterns' && !used.has(n)) unusedReport.push({ name: n, layer });
    if (layer === 'intent' && !usedRamps.has(rampOf(n)) && !seenRamp.has(rampOf(n)) && !keep[rampOf(n)]) { seenRamp.add(rampOf(n)); unusedReport.push({ name: rampOf(n), layer }); }
  }
  for (const u of unusedReport) add(`tokens/src/${u.layer}.*.tokens.json`, 0, `unused ${u.layer === 'patterns' ? 'Patterns role: no material names it, remove it' : 'Intent ramp: no Patterns role points at it, remove it'}`, u.name);
}

for (const f of findings.slice(0, 200)) console.error(`${f.file}:${f.line}: ${f.kind}: ${f.literal}`);
if (findings.length > 200) console.error(`… and ${findings.length - 200} more`);
console.log(JSON.stringify({ findings: findings.length, ...(unusedReport.length ? { unused: { patterns: unusedReport.filter((u) => u.layer === 'patterns').length, intent: unusedReport.filter((u) => u.layer === 'intent').length } } : {}) }));
process.exit(findings.length ? 1 : 0);
