// Color math for the build and its checks. No dependencies.
// OKLab/OKLCH after Ottosson (2020). WCAG 2.x relative luminance and contrast.
// Color-vision simulation after Machado, Oliveira & Fernandes (2009), severity 1.0,
// applied in linear sRGB.

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}

export function rgbToHex(rgb) {
  return '#' + rgb.map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, '0')).join('');
}

export function rgbToOklab(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) => toGamma(c));
}

export function oklchToHex(L, C, H) {
  const h = (H * Math.PI) / 180;
  return rgbToHex(oklabToRgb([L, C * Math.cos(h), C * Math.sin(h)]));
}

export function hexToOklch(hex) {
  const [L, a, b] = rgbToOklab(hexToRgb(hex));
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// OKLab Euclidean distance, reported ×100.
export function deltaE(a, b) {
  const p = rgbToOklab(hexToRgb(a));
  const q = rgbToOklab(hexToRgb(b));
  return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

export function simulate(hex, type) {
  if (type === 'normal') return hex;
  const lin = hexToRgb(hex).map(toLinear);
  const m = MACHADO[type];
  const out = m.map((row) => clamp01(row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]));
  return rgbToHex(out.map(toGamma));
}

export const VISION = ['normal', 'deutan', 'protan', 'tritan'];

// Accepts a DTCG color value object or a hex string; returns #rrggbb.
export function toHex(value) {
  if (typeof value === 'string') return value.toLowerCase();
  if (value.hex) return value.hex.toLowerCase();
  if (value.colorSpace === 'oklch') return oklchToHex(...value.components);
  if (value.colorSpace === 'srgb') return rgbToHex(value.components);
  throw new Error(`Unsupported color value ${JSON.stringify(value)}`);
}

// CSS for a DTCG color: oklch() with the hex fallback emitted separately by the caller.
export function toCss(value) {
  if (typeof value === 'string') return value;
  const alpha = value.alpha ?? 1;
  if (value.colorSpace === 'oklch') {
    const [L, C, H] = value.components;
    const a = alpha < 1 ? ` / ${+alpha.toFixed(3)}` : '';
    return `oklch(${+(L * 100).toFixed(2)}% ${+C.toFixed(4)} ${+H.toFixed(1)}${a})`;
  }
  if (value.colorSpace === 'srgb') {
    const [r, g, b] = value.components.map((c) => Math.round(c * 255));
    return alpha < 1 ? `rgb(${r} ${g} ${b} / ${+alpha.toFixed(3)})` : rgbToHex(value.components);
  }
  throw new Error(`Unsupported color value ${JSON.stringify(value)}`);
}

// True when an OKLCH color sits inside the sRGB gamut.
export function inGamut(L, C, H) {
  const h = (H * Math.PI) / 180;
  return oklabToRgb([L, C * Math.cos(h), C * Math.sin(h)]).every((c) => c >= -0.0005 && c <= 1.0005);
}

// The most chroma sRGB can show at a lightness and hue, by bisection.
export function maxChroma(L, H) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
}

// Lays an alpha color over a ground and returns the color that renders.
export function composite(top, alpha, base) {
  const [t, b] = [hexToRgb(top), hexToRgb(base)];
  return rgbToHex(t.map((c, i) => c * alpha + b[i] * (1 - alpha)));
}
