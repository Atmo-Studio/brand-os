// Loads the token source through the resolver file, merges each theme's sources in order, and
// resolves aliases. Follows the Design Tokens format and resolver modules, 2025.10.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ROOT is the token library folder, BRAND the brand folder that holds it.
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const BRAND = resolve(ROOT, '..');
export const EXT = 'brand-os';
const readJson = (p) => JSON.parse(readFileSync(resolve(ROOT, p), 'utf8'));

export const isToken = (node) => node && typeof node === 'object' && '$value' in node;
const isGroup = (node) => node && typeof node === 'object' && !Array.isArray(node) && !isToken(node);
export const ext = (node) => node?.$extensions?.[EXT] ?? {};

// Deep merge where a later source's token replaces an earlier one whole.
function merge(into, from) {
  for (const [k, v] of Object.entries(from)) {
    if (isGroup(v) && isGroup(into[k])) merge(into[k], v);
    else into[k] = structuredClone(v);
  }
  return into;
}

// Walks a tree and yields [path, token, inheritedType] for every token.
export function* walk(node, path = [], type) {
  const t = node.$type ?? type;
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (isToken(v)) yield [[...path, k], v, v.$type ?? t];
    else if (isGroup(v)) yield* walk(v, [...path, k], t);
  }
}

// The three layers, brand → meaning → application. Brand holds raw values in one mode. Intent maps
// them to semantic ramps and switches sub-brand. Patterns maps those to applied roles and switches
// theme. Each points only at the layer below it; a group with no Intent (type, motion) has
// Patterns point at Brand.
export const LAYERS = ['brand', 'intent', 'patterns'];
export const BELOW = { intent: ['brand'], patterns: ['intent', 'brand'], brand: ['brand'] };

// Returns { themes: { [key]: { tree, origin, own, brandOwn, brand, theme } }, defaultTheme, brands,
// themeNames, defaultBrand, defaultThemeName }. A context is one sub-brand in one theme. Its key is
// the theme's name while the library has one sub-brand, and "brand/theme" once it has more, so a
// single-brand library builds exactly as before. origin maps a token path to the source file that
// last set it; own lists the theme's own files and brandOwn the sub-brand's. A sub-brand or theme
// other than the default is laid over the default, so it holds only what it changes. A listed source
// that is absent is skipped, so a brand with no dark theme needs no dark file.
export function loadThemes() {
  const doc = readJson('src/tokens.resolver.json');
  const order = doc.resolutionOrder.map((r) => {
    const [, kind, name] = r.$ref.split('/');
    return { kind, name, def: doc[kind][name] };
  });
  const mod = (name) => order.find((o) => o.kind === 'modifiers' && o.name === name)?.def;
  const themeMod = mod('theme') ?? { default: 'default', contexts: { default: [] } };
  const brandMod = mod('brand') ?? { default: 'main', contexts: { main: [] } };
  const pick = (m, ctx) => {
    const fallback = m.default ?? Object.keys(m.contexts)[0];
    const own = m.contexts[ctx].map((f) => f.$ref);
    return { own, files: [...(ctx === fallback ? [] : m.contexts[fallback].map((f) => f.$ref)), ...own] };
  };
  const brandNames = Object.keys(brandMod.contexts);
  const themes = {};
  for (const b of brandNames) for (const t of Object.keys(themeMod.contexts)) {
    const B = pick(brandMod, b);
    const T = pick(themeMod, t);
    const files = order.flatMap((s) => (s.kind === 'sets' ? s.def.sources.map((f) => f.$ref) : s.name === 'brand' ? B.files : s.name === 'theme' ? T.files : []));
    if (files.some((f) => !existsSync(resolve(ROOT, 'src', f)))) continue;
    const tree = {};
    const origin = {};
    for (const f of files) {
      const src = readJson(`src/${f}`);
      for (const [p] of walk(src)) origin[p.join('.')] = f;
      merge(tree, src);
    }
    const key = brandNames.length > 1 ? `${b}/${t}` : t;
    themes[key] = { tree, origin, own: T.own, brandOwn: B.own, brand: b, theme: t };
  }
  if (!Object.keys(themes).length) throw new Error('No theme could be loaded. Check src/tokens.resolver.json.');
  const defaultBrand = brandMod.default ?? brandNames[0];
  const defaultThemeName = themeMod.default ?? Object.keys(themeMod.contexts)[0];
  const defaultTheme = brandNames.length > 1 ? `${defaultBrand}/${defaultThemeName}` : defaultThemeName;
  const present = (k) => [...new Set(Object.values(themes).map((c) => c[k]))];
  return { themes, defaultTheme: themes[defaultTheme] ? defaultTheme : Object.keys(themes)[0], brands: present('brand'), themeNames: present('theme'), defaultBrand, defaultThemeName };
}

// The name a token is published under: its path without the layer. brand.color.stone.50 becomes
// color.stone.50, which is --color-stone-50 in CSS and color/stone/50 in Figma.
export const publicPath = (path) => path.replace(/^(brand|intent|patterns|component)\./, '');
export const cssName = (path) => `--${publicPath(path).replaceAll('.', '-')}`;
export const tierOf = (path) => path.split('.')[0];
export const isBrandTier = (path) => tierOf(path) === 'brand';

export function get(tree, path) {
  return path.split('.').reduce((n, k) => (n == null ? n : n[k]), tree);
}

const REF = /^\{([^}]+)\}$/;

// Resolves a value, following aliases, including ones nested in composites.
export function resolveValue(tree, value, seen = []) {
  if (typeof value === 'string') {
    const m = value.match(REF);
    if (!m) return value;
    const target = get(tree, m[1]);
    if (!isToken(target)) throw new Error(`Unresolved alias ${value}${seen.length ? ` (via ${seen.join(' → ')})` : ''}`);
    if (seen.includes(m[1])) throw new Error(`Circular alias ${[...seen, m[1]].join(' → ')}`);
    return resolveValue(tree, target.$value, [...seen, m[1]]);
  }
  if (Array.isArray(value)) return value.map((v) => resolveValue(tree, v, seen));
  if (value && typeof value === 'object') {
    if ('colorSpace' in value) return value;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveValue(tree, v, seen)]));
  }
  return value;
}

// The alias a token points at directly, or null when it holds a raw value.
export function aliasOf(token) {
  const m = typeof token.$value === 'string' && token.$value.match(REF);
  return m ? m[1] : null;
}

export function flatten(tree) {
  const rows = [];
  for (const [path, token, type] of walk(tree))
    rows.push({ path: path.join('.'), token, type, value: resolveValue(tree, token.$value), alias: aliasOf(token) });
  return rows;
}

export const dim = (v) => (v && typeof v === 'object' && 'unit' in v ? `${v.value}${v.unit}` : `${v}`);
