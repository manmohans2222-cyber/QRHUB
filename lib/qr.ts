import qrcode from 'qrcode-generator';

export type ECC = 'L' | 'M' | 'Q' | 'H';

// qrcode-generator's default byte conversion is latin-1 only; use UTF-8 so
// emoji / accented characters encode correctly.
(qrcode as any).stringToBytes = (s: string): number[] => {
  const out: number[] = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const next = s.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        c = (c - 0xd800) * 0x400 + (next - 0xdc00) + 0x10000;
        i++;
      }
    }
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    else
      out.push(
        0xf0 | (c >> 18),
        0x80 | ((c >> 12) & 0x3f),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f)
      );
  }
  return out;
};

export type Matrix = {
  size: number;
  dark: boolean[][];
};

const cache = new Map<string, Matrix>();

export function makeMatrix(text: string, ecc: ECC = 'H'): Matrix {
  const data = text && text.length ? text : 'https://qrhub.app';
  const key = ecc + '::' + data;
  const hit = cache.get(key);
  if (hit) return hit;

  let qr;
  try {
    qr = qrcode(0, ecc);
    qr.addData(data);
    qr.make();
  } catch (e) {
    // Content too long for the chosen level — fall back to a lower level.
    const fallbacks: ECC[] = ['Q', 'M', 'L'];
    let made = null;
    for (const lvl of fallbacks) {
      try {
        const q = qrcode(0, lvl);
        q.addData(data);
        q.make();
        made = q;
        break;
      } catch {}
    }
    if (!made) {
      const q = qrcode(0, 'L');
      q.addData(data.slice(0, 1200));
      q.make();
      made = q;
    }
    qr = made;
  }

  const size = qr.getModuleCount();
  const dark: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) row.push(qr.isDark(r, c));
    dark.push(row);
  }
  const m = { size, dark };
  if (cache.size > 60) cache.clear();
  cache.set(key, m);
  return m;
}

/** Finder-pattern ("eye") top-left origins for a matrix of given size. */
export function eyeOrigins(size: number): Array<[number, number]> {
  return [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
}

export function inEye(size: number, r: number, c: number): boolean {
  for (const [er, ec] of eyeOrigins(size)) {
    if (r >= er && r < er + 7 && c >= ec && c < ec + 7) return true;
  }
  return false;
}
