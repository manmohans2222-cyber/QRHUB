import { getShape } from './shapes';
import { QRStyle } from './store';

export type Score = {
  value: number; // 0..100
  label: string;
  color: 'good' | 'warn' | 'bad';
  tips: string[];
};

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: string, b: string): number {
  try {
    const l1 = luminance(a);
    const l2 = luminance(b);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  } catch {
    return 21;
  }
}

export function scanScore(style: QRStyle): Score {
  const shape = getShape(style.shape);
  const tips: string[] = [];
  let v = 100;

  const density = shape.density * Math.min(1.15, style.moduleScale);
  if (density < 0.55) {
    v -= 26;
    tips.push(`“${shape.name}” modules are sparse — bump module size up a notch.`);
  } else if (density < 0.75) {
    v -= 12;
  }

  const isEmoji = style.shape.startsWith('emoji:');
  if (isEmoji) {
    v -= 14;
    tips.push('Emoji modules are playful but busy — print large and keep ECC on High.');
  }

  if (style.ecc === 'H') v += 6;
  else if (style.ecc === 'Q') v += 0;
  else if (style.ecc === 'M') {
    v -= 10;
    tips.push('Error correction below Q leaves little room for fancy shapes.');
  } else {
    v -= 20;
    tips.push('Level L is risky with decorative modules. Use High.');
  }

  if (style.quiet < 2) {
    v -= 12;
    tips.push('Keep a quiet zone of at least 2 modules around the code.');
  }

  const ratio = contrastRatio(style.fgA, style.transparent ? '#FFFFFF' : style.bg);
  const ratioB = contrastRatio(style.fgB, style.transparent ? '#FFFFFF' : style.bg);
  const minRatio = Math.min(ratio, ratioB);
  if (minRatio < 3) {
    v -= 32;
    tips.push('Foreground and background are too close in brightness.');
  } else if (minRatio < 5) {
    v -= 14;
    tips.push('Darken the foreground for more reliable scanning.');
  }

  if (style.badge) {
    v -= 6;
    tips.push('A center badge covers modules — fine on High, risky below it.');
  }

  if (style.moduleScale > 1.12) v -= 5;

  v = Math.max(8, Math.min(100, Math.round(v)));
  const color: Score['color'] = v >= 78 ? 'good' : v >= 55 ? 'warn' : 'bad';
  const label = v >= 78 ? 'Scans great' : v >= 55 ? 'Test before printing' : 'Hard to scan';
  if (!tips.length) tips.push('Looking sharp — this one should scan on the first try.');
  return { value: v, label, color, tips };
}
