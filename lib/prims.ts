/** Drawing primitives in unit space (0..1) used by every shape in the library. */
export type Fill = 'fg' | 'bg';

export type Prim =
  | { k: 'rect'; x: number; y: number; w: number; h: number; rx?: number; rot?: number; fill?: Fill }
  | { k: 'circle'; cx: number; cy: number; r: number; fill?: Fill }
  | { k: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rot?: number; fill?: Fill }
  | { k: 'poly'; pts: Array<[number, number]>; fill?: Fill }
  | { k: 'path'; d: string; fill?: Fill }
  | { k: 'emoji'; ch: string };

/** Resolved element in absolute canvas coordinates. */
export type El =
  | { k: 'rect'; x: number; y: number; w: number; h: number; rx: number; rot?: number; fill: string }
  | { k: 'circle'; cx: number; cy: number; r: number; fill: string }
  | { k: 'ellipse'; cx: number; cy: number; rx: number; ry: number; rot?: number; fill: string }
  | { k: 'poly'; points: string; fill: string }
  | { k: 'path'; d: string; fill: string }
  | { k: 'text'; x: number; y: number; size: number; ch: string };

export function starPts(
  points: number,
  outer: number,
  inner: number,
  cx = 0.5,
  cy = 0.5
): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

export function polyPts(
  n: number,
  r: number,
  rotDeg = -90,
  cx = 0.5,
  cy = 0.5
): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const rot = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 2 * Math.PI) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

/** Convert a unit-space primitive into an absolute element. */
export function place(
  p: Prim,
  ox: number,
  oy: number,
  s: number,
  fgColor: string,
  bgColor: string
): El {
  const col = (f?: Fill) => (f === 'bg' ? bgColor : fgColor);
  switch (p.k) {
    case 'rect':
      return {
        k: 'rect',
        x: ox + p.x * s,
        y: oy + p.y * s,
        w: p.w * s,
        h: p.h * s,
        rx: (p.rx ?? 0) * s,
        rot: p.rot,
        fill: col(p.fill),
      };
    case 'circle':
      return { k: 'circle', cx: ox + p.cx * s, cy: oy + p.cy * s, r: p.r * s, fill: col(p.fill) };
    case 'ellipse':
      return {
        k: 'ellipse',
        cx: ox + p.cx * s,
        cy: oy + p.cy * s,
        rx: p.rx * s,
        ry: p.ry * s,
        rot: p.rot,
        fill: col(p.fill),
      };
    case 'poly':
      return {
        k: 'poly',
        points: p.pts.map(([x, y]) => `${(ox + x * s).toFixed(2)},${(oy + y * s).toFixed(2)}`).join(' '),
        fill: col(p.fill),
      };
    case 'path':
      return { k: 'path', d: scalePath(p.d, ox, oy, s), fill: col(p.fill) };
    case 'emoji':
      return { k: 'text', x: ox + s / 2, y: oy + s * 0.5, size: s, ch: p.ch };
  }
}

/** Scales a unit-space path (numbers in 0..1) into canvas space. */
function scalePath(d: string, ox: number, oy: number, s: number): string {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return '';
  const out: string[] = [];
  let cmd = 'M';
  let idx = 0;
  const nums: string[] = [];
  const num = (n: number) => nums.push(n.toFixed(3));
  const flush = () => {
    if (!nums.length) return;
    out.push(cmd + ' ' + nums.join(' '));
    nums.length = 0;
  };
  for (const t of tokens) {
    if (/[a-zA-Z]/.test(t)) {
      flush();
      cmd = t;
      idx = 0;
      if (t === 'Z' || t === 'z') out.push('Z');
      continue;
    }
    const v = parseFloat(t);
    if (cmd === 'A' || cmd === 'a') {
      // rx ry x-rotation large-arc-flag sweep-flag x y
      const pos = idx % 7;
      if (pos === 0 || pos === 1) num(v * s);
      else if (pos === 2) num(v);
      else if (pos === 3 || pos === 4) nums.push(String(v ? 1 : 0));
      else if (pos === 5) num(ox + v * s);
      else num(oy + v * s);
    } else if (cmd === 'H') num(ox + v * s);
    else if (cmd === 'V') num(oy + v * s);
    else num(idx % 2 === 0 ? ox + v * s : oy + v * s);
    idx++;
  }
  flush();
  return out.join(' ');
}
