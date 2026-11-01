import React, { useMemo } from 'react';
import { View, Platform } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Ellipse,
  Polygon,
  Path,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { El, Prim, place } from '../lib/prims';
import { getEye, getShape } from '../lib/shapes';
import { inEye, makeMatrix, eyeOrigins } from '../lib/qr';
import { QRStyle } from '../lib/store';

const FG = '__FG__';

function primsToEls(prims: Prim[], ox: number, oy: number, s: number, bg: string): El[] {
  return prims.map((p) => place(p, ox, oy, s, FG, bg));
}

export type Built = { els: El[]; modules: number; cell: number };

export function buildElements(content: string, style: QRStyle, size: number): Built {
  const matrix = makeMatrix(content, style.ecc);
  const n = matrix.size;
  const total = n + style.quiet * 2;
  const cell = size / total;
  const off = style.quiet * cell;
  const bg = style.transparent ? '#FFFFFF' : style.bg;

  const els: El[] = [];
  const shape = getShape(style.shape);
  const scale = style.moduleScale;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!matrix.dark[r][c]) continue;
      if (inEye(n, r, c)) continue;
      const s = cell * scale;
      const ox = off + c * cell - (s - cell) / 2;
      const oy = off + r * cell - (s - cell) / 2;
      for (const el of primsToEls(shape.prims, ox, oy, s, bg)) els.push(el);
    }
  }

  const eye = getEye(style.eye);
  for (const [er, ec] of eyeOrigins(n)) {
    const s = cell * 7;
    const ox = off + ec * cell;
    const oy = off + er * cell;
    for (const el of primsToEls(eye.prims, ox, oy, s, bg)) els.push(el);
  }

  if (style.badge) {
    const bs = size * 0.21;
    els.push({ k: 'circle', cx: size / 2, cy: size / 2, r: bs * 0.78, fill: bg });
    els.push({ k: 'text', x: size / 2, y: size / 2, size: bs, ch: style.badge });
  }

  return { els, modules: n, cell };
}

export function elementsToSvg(
  els: El[],
  size: number,
  style: QRStyle
): string {
  const fg = style.gradient ? 'url(#g)' : style.fgA;
  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
  );
  parts.push(
    `<defs><linearGradient id="g" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${style.fgA}"/><stop offset="1" stop-color="${style.fgB}"/></linearGradient></defs>`
  );
  if (!style.transparent) parts.push(`<rect width="${size}" height="${size}" fill="${style.bg}"/>`);
  for (const e of els) {
    const f = (c: string) => (c === FG ? fg : c);
    switch (e.k) {
      case 'rect': {
        const t = e.rot ? ` transform="rotate(${e.rot} ${e.x + e.w / 2} ${e.y + e.h / 2})"` : '';
        parts.push(
          `<rect x="${e.x.toFixed(2)}" y="${e.y.toFixed(2)}" width="${e.w.toFixed(2)}" height="${e.h.toFixed(
            2
          )}" rx="${e.rx.toFixed(2)}" fill="${f(e.fill)}"${t}/>`
        );
        break;
      }
      case 'circle':
        parts.push(
          `<circle cx="${e.cx.toFixed(2)}" cy="${e.cy.toFixed(2)}" r="${e.r.toFixed(2)}" fill="${f(e.fill)}"/>`
        );
        break;
      case 'ellipse': {
        const t = e.rot ? ` transform="rotate(${e.rot} ${e.cx} ${e.cy})"` : '';
        parts.push(
          `<ellipse cx="${e.cx.toFixed(2)}" cy="${e.cy.toFixed(2)}" rx="${e.rx.toFixed(2)}" ry="${e.ry.toFixed(
            2
          )}" fill="${f(e.fill)}"${t}/>`
        );
        break;
      }
      case 'poly':
        parts.push(`<polygon points="${e.points}" fill="${f(e.fill)}"/>`);
        break;
      case 'path':
        parts.push(`<path d="${e.d}" fill="${f(e.fill)}"/>`);
        break;
      case 'text':
        parts.push(
          `<text x="${e.x.toFixed(2)}" y="${e.y.toFixed(2)}" font-size="${e.size.toFixed(
            2
          )}" text-anchor="middle" dominant-baseline="central">${e.ch}</text>`
        );
        break;
    }
  }
  parts.push('</svg>');
  return parts.join('');
}

type Props = {
  content: string;
  style: QRStyle;
  size: number;
  radius?: number;
};

function renderEls(els: El[], fg: string) {
  return els.map((e, i) => {
    const fill = (c: string) => (c === FG ? fg : c);
    switch (e.k) {
          case 'rect':
            return (
              <Rect
                key={i}
                x={e.x}
                y={e.y}
                width={e.w}
                height={e.h}
                rx={e.rx}
                fill={fill(e.fill)}
                origin={`${e.x + e.w / 2}, ${e.y + e.h / 2}`}
                rotation={e.rot ?? 0}
              />
            );
          case 'circle':
            return <Circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill={fill(e.fill)} />;
          case 'ellipse':
            return (
              <Ellipse
                key={i}
                cx={e.cx}
                cy={e.cy}
                rx={e.rx}
                ry={e.ry}
                fill={fill(e.fill)}
                origin={`${e.cx}, ${e.cy}`}
                rotation={e.rot ?? 0}
              />
            );
          case 'poly':
            return <Polygon key={i} points={e.points} fill={fill(e.fill)} />;
          case 'path':
            return <Path key={i} d={e.d} fill={fill(e.fill)} />;
          case 'text':
            return (
              <SvgText
                key={i}
                x={e.x}
                y={e.y}
                fontSize={e.size}
                textAnchor="middle"
                alignmentBaseline="central"
                {...(Platform.OS === 'web' ? { dominantBaseline: 'central' } : {})}
              >
                {e.ch}
              </SvgText>
            );
    }
  });
}

let gradCounter = 0;

export default function QRCanvas({ content, style, size, radius = 0 }: Props) {
  const built = useMemo(() => buildElements(content, style, size), [content, style, size]);
  // SVG ids are document-global on web — keep one gradient id per canvas instance.
  const gid = useMemo(() => `qrgrad${++gradCounter}`, []);
  const fg = style.gradient ? `url(#${gid})` : style.fgA;

  return (
    <View style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={style.fgA} />
            <Stop offset="1" stopColor={style.fgB} />
          </LinearGradient>
        </Defs>
        {!style.transparent && <Rect x={0} y={0} width={size} height={size} fill={style.bg} />}
        {renderEls(built.els, fg)}
      </Svg>
    </View>
  );
}

/** Small preview of a single module shape (3x3 arrangement). */
export function ShapePreview({
  shapeId,
  size,
  color,
  bg,
}: {
  shapeId: string;
  size: number;
  color: string;
  bg: string;
}) {
  const els = useMemo(() => {
    const shape = getShape(shapeId);
    const pattern = [
      [1, 0, 1],
      [0, 1, 0],
      [1, 1, 1],
    ];
    const cell = size / 3;
    const out: El[] = [];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        if (!pattern[r][c]) continue;
        for (const p of shape.prims) out.push(place(p, c * cell, r * cell, cell, FG, bg));
      }
    return out;
  }, [shapeId, size, bg]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {renderEls(els, color)}
    </Svg>
  );
}

/** Small preview of an eye (finder) style. */
export function EyePreview({
  eyeId,
  size,
  color,
  bg,
}: {
  eyeId: string;
  size: number;
  color: string;
  bg: string;
}) {
  const els = useMemo(() => {
    const eye = getEye(eyeId);
    const pad = size * 0.08;
    return eye.prims.map((p) => place(p, pad, pad, size - pad * 2, FG, bg));
  }, [eyeId, size, bg]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {renderEls(els, color)}
    </Svg>
  );
}
