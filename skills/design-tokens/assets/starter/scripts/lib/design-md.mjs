// Generates the token half of DESIGN.md: its YAML frontmatter and the motion table. The prose
// belongs to the brand and is never touched.
import { walk, resolveValue, tierOf, ext, dim, cssName } from './tokens.mjs';
import { toHex, toCss } from './color.mjs';

const q = (s) => `"${String(s).replaceAll('"', '\\"')}"`;

export function designFrontmatter(tree) {
  const colors = [];
  const type = [];
  for (const [p, token, t] of walk(tree)) {
    const path = p.join('.');
    if (tierOf(path) !== 'patterns') continue;
    const v = resolveValue(tree, token.$value);
    if (t === 'color') {
      const alpha = typeof v === 'object' && v.alpha !== undefined && v.alpha < 1;
      colors.push([p.slice(2).join('-'), alpha ? toCss(v) : toHex(v)]);
    }
    if (t === 'typography') {
      const lines = [
        `    fontFamily: ${q(Array.isArray(v.fontFamily) ? v.fontFamily[0] : v.fontFamily)}`,
        `    fontSize: ${dim(v.fontSize)}`,
        `    fontWeight: ${v.fontWeight}`,
        `    lineHeight: ${dim(v.lineHeight)}`,
        `    letterSpacing: ${v.letterSpacing}em`,
      ];
      if (ext(token).fontFeatureSettings) lines.push(`    fontFeature: ${q(ext(token).fontFeatureSettings)}`);
      type.push(`  ${p.at(-1)}:\n${lines.join('\n')}`);
    }
  }
  const core = tree.brand ?? {};
  const scale = (group) => Object.entries(core[group] ?? {}).filter(([k]) => !k.startsWith('$')).map(([k, t]) => `  ${/^\d/.test(k) ? q(k) : k}: ${dim(t.$value)}`);
  // DESIGN.md asks for a color named primary. It points at the brand color's fill.
  const primary = colors.find(([n]) => n === 'accent-bg') ? ['  primary: "{colors.accent-bg}"'] : [];
  return [
    'colors:', ...primary, ...colors.map(([n, v]) => `  ${n}: ${q(v)}`),
    'typography:', ...type,
    'rounded:', ...scale('radius'),
    'spacing:', ...scale('spacing'),
  ].join('\n');
}

export function motionTable(tree) {
  const rows = [];
  for (const [p, token, t] of walk(tree)) {
    const path = p.join('.');
    if (tierOf(path) !== 'patterns' || p[1] !== 'motion') continue;
    const v = resolveValue(tree, token.$value);
    rows.push(`| \`${cssName(path).slice(2)}\` | ${t === 'cubicBezier' ? `\`cubic-bezier(${v.join(', ')})\`` : dim(v)} |`);
  }
  return rows.length ? ['| Token | Value |', '|---|---|', ...rows].join('\n') : '';
}

const GENERATED = ['colors', 'typography', 'rounded', 'spacing'];

// Replaces the generated keys of the frontmatter and the motion table, and keeps everything the
// brand wrote: name, description, omitted, metadata and the prose.
export function spliceDesign(text, generated, motion) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const body = m ? text.slice(m[0].length) : text;
  const blocks = [];
  if (m) {
    let cur = null;
    for (const line of m[1].split('\n')) {
      const k = line.match(/^([A-Za-z][\w-]*):/);
      if (k) { cur = { key: k[1], lines: [line] }; blocks.push(cur); }
      else if (cur) cur.lines.push(line);
    }
  }
  const kept = blocks.filter((b) => !GENERATED.includes(b.key));
  const head = kept.filter((b) => ['version', 'name', 'description'].includes(b.key));
  const tail = kept.filter((b) => !['version', 'name', 'description'].includes(b.key));
  if (!head.some((b) => b.key === 'version')) head.unshift({ key: 'version', lines: ['version: alpha'] });
  const fm = [...head.map((b) => b.lines.join('\n')), generated, ...tail.map((b) => b.lines.join('\n'))].join('\n');
  let out = body;
  if (motion) out = out.replace(/<!-- motion-tokens -->[\s\S]*?<!-- \/motion-tokens -->/, `<!-- motion-tokens -->\n${motion}\n<!-- /motion-tokens -->`);
  return `---\n${fm}\n---\n${out}`;
}
