// Maps the resolved contexts onto three Figma variable collections, plus text styles and effect
// styles. The payload is what a sync pushes through the Plugin API, and what scripts/parity.mjs
// checks a file against.
//   brand.tokens.json       → Brand    (one mode, "Value")
//   intent.*.tokens.json    → Intent   (one mode per sub-brand)
//   patterns.*.tokens.json  → Patterns (one mode per theme)
// A frame picks its sub-brand in the Intent collection and its theme in the Patterns collection,
// and every alias resolves through both.
// A token may set $extensions["brand-os"].figma to { skip, name, scopes }.
import { walk, aliasOf, resolveValue, publicPath, tierOf, ext } from './tokens.mjs';
import { toHex, hexToRgb } from './color.mjs';

export const COLLECTIONS = { brand: 'Brand', intent: 'Intent', patterns: 'Patterns' };
export const modeLabel = (theme) => theme[0].toUpperCase() + theme.slice(1);
export const figmaName = (path) => publicPath(path).replaceAll('.', '/');

// Brand and Intent colors are hidden from the pickers: files use Patterns roles, never a ramp.
const colorScopes = (tier, name) =>
  tier !== 'patterns' ? []
  : /^color\/text\//.test(name) || /\/text(-disabled)?$/.test(name) ? ['TEXT_FILL']
  : /^color\/border\//.test(name) || /\/border$/.test(name) ? ['STROKE_COLOR']
  : ['FRAME_FILL', 'SHAPE_FILL'];
const dimensionScopes = (name) =>
  name.startsWith('spacing/') ? ['GAP', 'WIDTH_HEIGHT']
  : name.startsWith('radius/') ? ['CORNER_RADIUS']
  : name.startsWith('font-size/') ? ['FONT_SIZE']
  : name.startsWith('line-height/') ? ['LINE_HEIGHT']
  : name.startsWith('stroke/') ? ['STROKE_FLOAT']
  // The fluid range has no single job in a design file, so it stays out of every picker.
  : name.startsWith('viewport/') ? []
  : ['WIDTH_HEIGHT'];
const scopesFor = (tier, name, type) =>
  type === 'color' ? colorScopes(tier, name)
  : type === 'dimension' ? dimensionScopes(name)
  : type === 'fontFamily' ? ['FONT_FAMILY']
  : type === 'fontWeight' ? ['FONT_WEIGHT']
  : [];

function figmaValue(v, type) {
  switch (type) {
    case 'color': {
      const [r, g, b] = hexToRgb(toHex(v));
      return { r: +r.toFixed(4), g: +g.toFixed(4), b: +b.toFixed(4), a: +((typeof v === 'object' ? v.alpha : 1) ?? 1).toFixed(4) };
    }
    case 'dimension':
    case 'duration': return v.value;
    case 'number':
    case 'fontWeight': return v;
    case 'fontFamily': return Array.isArray(v) ? v[0] : v;
    case 'cubicBezier': return v.join(', ');
    default: return String(v);
  }
}
const figmaType = (type) => (type === 'color' ? 'COLOR' : ['fontFamily', 'cubicBezier', 'string'].includes(type) ? 'STRING' : 'FLOAT');

// Figma names a weight per family, so a family and its weight names travel together.
const WEIGHT_NAMES = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };

export function figmaPayload(themes, defaultTheme) {
  const entries = Object.entries(themes);
  const vars = new Map();
  for (const [key, { tree, brand, theme }] of entries) {
    for (const [p, token, type] of walk(tree)) {
      const path = p.join('.');
      const tier = tierOf(path);
      if (!COLLECTIONS[tier]) continue;
      const fx = ext(token).figma ?? {};
      // Tracking is an em value. A Figma letter-spacing variable applies in pixels, so tracking
      // travels on the text styles and never as a variable.
      if (fx.skip || ['typography', 'shadow'].includes(type) || path.startsWith('brand.tracking.')) continue;
      const name = fx.name ?? figmaName(path);
      const mode = tier === 'intent' ? modeLabel(brand ?? key) : tier === 'patterns' ? modeLabel(theme ?? key) : 'Value';
      const alias = aliasOf(token);
      const value = alias ? { alias: figmaName(alias) } : figmaValue(resolveValue(tree, token.$value), type);
      const v = vars.get(name) ?? {
        name,
        collection: COLLECTIONS[tier],
        type: figmaType(type),
        scopes: fx.scopes ?? scopesFor(tier, name, type),
        codeSyntax: { WEB: `var(--${publicPath(path).replaceAll('.', '-')})` },
        description: token.$description ?? '',
        values: {},
      };
      if (v.values[mode] !== undefined) continue;
      v.values[mode] = value;
      vars.set(name, v);
    }
  }
  const first = themes[defaultTheme].tree;
  const textStyles = [];
  const effectStyles = [];
  for (const [p, token, type] of walk(first)) {
    const path = p.join('.');
    if (tierOf(path) !== 'patterns') continue;
    if (type === 'typography') {
      const v = resolveValue(first, token.$value);
      const famRef = typeof token.$value.fontFamily === 'string' && token.$value.fontFamily.match(/^\{([^}]+)\}$/);
      const famToken = famRef ? famRef[1].split('.').reduce((n, k) => n?.[k], first) : null;
      const names = { ...WEIGHT_NAMES, ...(ext(famToken).figmaStyles ?? {}) };
      const size = v.fontSize.value;
      textStyles.push({
        name: figmaName(path),
        fontFamily: Array.isArray(v.fontFamily) ? v.fontFamily[0] : v.fontFamily,
        fontStyle: names[v.fontWeight] ?? 'Regular',
        fontSize: size,
        lineHeight: v.lineHeight.value,
        // Stored as a percent on the style. em × 100 is the percent; em × size is the pixel value.
        letterSpacingPercent: +(v.letterSpacing * 100).toFixed(3),
        letterSpacingPx: +(v.letterSpacing * size).toFixed(3),
        textCase: ext(token).textTransform === 'uppercase' ? 'UPPER' : 'ORIGINAL',
      });
    }
    if (type === 'shadow') {
      const layers = [resolveValue(first, token.$value)].flat().map((s) => ({ color: figmaValue(s.color, 'color'), offsetX: s.offsetX.value, offsetY: s.offsetY.value, blur: s.blur.value, spread: s.spread.value }));
      effectStyles.push({ name: figmaName(path), layers });
    }
  }
  return {
    collections: {
      [COLLECTIONS.brand]: { modes: ['Value'] },
      [COLLECTIONS.intent]: { modes: [...new Set(entries.map(([k, c]) => modeLabel(c.brand ?? k)))] },
      [COLLECTIONS.patterns]: { modes: [...new Set(entries.map(([k, c]) => modeLabel(c.theme ?? k)))] },
    },
    variables: [...vars.values()],
    textStyles,
    effectStyles,
  };
}
