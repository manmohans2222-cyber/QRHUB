import { Prim, polyPts, starPts } from './prims';

export type ShapeCategory =
  | 'Classic'
  | 'Animals'
  | 'Emoji'
  | 'Nature'
  | 'Space'
  | 'Food'
  | 'Symbols';

export type ShapeDef = {
  id: string;
  name: string;
  category: ShapeCategory;
  /** Rough ink coverage of a module cell, used for the scan-safety meter. */
  density: number;
  prims: Prim[];
  tags?: string;
};

const C = (cx: number, cy: number, r: number, fill?: 'fg' | 'bg'): Prim => ({ k: 'circle', cx, cy, r, fill });
const R = (x: number, y: number, w: number, h: number, rx = 0, rot?: number, fill?: 'fg' | 'bg'): Prim => ({
  k: 'rect', x, y, w, h, rx, rot, fill,
});
const E = (cx: number, cy: number, rx: number, ry: number, rot?: number, fill?: 'fg' | 'bg'): Prim => ({
  k: 'ellipse', cx, cy, rx, ry, rot, fill,
});
const P = (pts: Array<[number, number]>, fill?: 'fg' | 'bg'): Prim => ({ k: 'poly', pts, fill });
const D = (d: string, fill?: 'fg' | 'bg'): Prim => ({ k: 'path', d, fill });

/* ------------------------------------------------------------------ *
 * CLASSIC
 * ------------------------------------------------------------------ */
const CLASSIC: ShapeDef[] = [
  { id: 'square', name: 'Square', category: 'Classic', density: 1, prims: [R(0, 0, 1, 1)] },
  { id: 'rounded', name: 'Rounded', category: 'Classic', density: 0.94, prims: [R(0.02, 0.02, 0.96, 0.96, 0.3)] },
  { id: 'squircle', name: 'Squircle', category: 'Classic', density: 0.9, prims: [R(0.03, 0.03, 0.94, 0.94, 0.45)] },
  { id: 'dot', name: 'Dot', category: 'Classic', density: 0.78, prims: [C(0.5, 0.5, 0.48)] },
  { id: 'mini-dot', name: 'Mini dot', category: 'Classic', density: 0.5, prims: [C(0.5, 0.5, 0.36)] },
  { id: 'diamond', name: 'Diamond', category: 'Classic', density: 0.5, prims: [P([[0.5, 0.01], [0.99, 0.5], [0.5, 0.99], [0.01, 0.5]])] },
  { id: 'plus', name: 'Plus', category: 'Classic', density: 0.55, prims: [R(0.33, 0.02, 0.34, 0.96, 0.08), R(0.02, 0.33, 0.96, 0.34, 0.08)] },
  { id: 'hexagon', name: 'Hexagon', category: 'Classic', density: 0.76, prims: [P(polyPts(6, 0.5, -90))] },
  { id: 'triangle', name: 'Triangle', category: 'Classic', density: 0.45, prims: [P([[0.5, 0.04], [0.98, 0.96], [0.02, 0.96]])] },
  { id: 'donut', name: 'Donut', category: 'Classic', density: 0.55, prims: [C(0.5, 0.5, 0.48), C(0.5, 0.5, 0.21, 'bg')] },
  { id: 'blob', name: 'Blob', category: 'Classic', density: 0.82, prims: [D('M0.5,0.02 C0.84,0.02 0.98,0.2 0.98,0.5 C0.98,0.82 0.78,0.98 0.47,0.98 C0.17,0.98 0.02,0.78 0.02,0.47 C0.02,0.17 0.2,0.02 0.5,0.02 Z')] },
  { id: 'pixel', name: 'Pixel', category: 'Classic', density: 0.66, prims: [R(0.1, 0.1, 0.8, 0.8)] },
];

/* ------------------------------------------------------------------ *
 * ANIMALS — composed from primitives so they stay readable at tiny sizes
 * ------------------------------------------------------------------ */
const ANIMALS: ShapeDef[] = [
  {
    id: 'paw', name: 'Paw', category: 'Animals', density: 0.6, tags: 'dog cat pet print',
    prims: [C(0.5, 0.66, 0.31), C(0.17, 0.33, 0.14), C(0.4, 0.2, 0.14), C(0.64, 0.2, 0.14), C(0.86, 0.36, 0.13)],
  },
  {
    id: 'cat', name: 'Cat', category: 'Animals', density: 0.7, tags: 'kitty meow',
    prims: [P([[0.1, 0.42], [0.1, 0.02], [0.4, 0.18]]), P([[0.9, 0.42], [0.9, 0.02], [0.6, 0.18]]), C(0.5, 0.6, 0.39)],
  },
  {
    id: 'bear', name: 'Bear', category: 'Animals', density: 0.72, tags: 'teddy panda',
    prims: [C(0.19, 0.22, 0.17), C(0.81, 0.22, 0.17), C(0.5, 0.58, 0.39)],
  },
  {
    id: 'bunny', name: 'Bunny', category: 'Animals', density: 0.62, tags: 'rabbit hare easter',
    prims: [E(0.32, 0.22, 0.11, 0.22, -12), E(0.68, 0.22, 0.11, 0.22, 12), C(0.5, 0.68, 0.31)],
  },
  {
    id: 'mouse', name: 'Mouse', category: 'Animals', density: 0.7, tags: 'rat ears',
    prims: [C(0.2, 0.22, 0.2), C(0.8, 0.22, 0.2), C(0.5, 0.63, 0.35)],
  },
  {
    id: 'dog', name: 'Dog', category: 'Animals', density: 0.72, tags: 'puppy floppy',
    prims: [E(0.16, 0.44, 0.14, 0.26, 12), E(0.84, 0.44, 0.14, 0.26, -12), C(0.5, 0.56, 0.36)],
  },
  {
    id: 'fish', name: 'Fish', category: 'Animals', density: 0.52, tags: 'sea ocean',
    prims: [E(0.56, 0.5, 0.4, 0.28), P([[0.2, 0.5], [0.02, 0.22], [0.02, 0.78]])],
  },
  {
    id: 'bird', name: 'Bird', category: 'Animals', density: 0.58, tags: 'tweet sparrow',
    prims: [C(0.46, 0.52, 0.34), P([[0.74, 0.42], [0.99, 0.5], [0.74, 0.58]]), P([[0.3, 0.62], [0.04, 0.92], [0.3, 0.86]])],
  },
  {
    id: 'butterfly', name: 'Butterfly', category: 'Animals', density: 0.6, tags: 'wings insect',
    prims: [E(0.27, 0.32, 0.25, 0.17, -28), E(0.73, 0.32, 0.25, 0.17, 28), E(0.29, 0.72, 0.2, 0.14, 28), E(0.71, 0.72, 0.2, 0.14, -28), R(0.45, 0.2, 0.1, 0.6, 0.05)],
  },
  {
    id: 'turtle', name: 'Turtle', category: 'Animals', density: 0.66, tags: 'tortoise shell',
    prims: [C(0.5, 0.52, 0.33), C(0.9, 0.44, 0.1), C(0.16, 0.22, 0.11), C(0.16, 0.82, 0.11), C(0.74, 0.86, 0.11)],
  },
  {
    id: 'frog', name: 'Frog', category: 'Animals', density: 0.68, tags: 'toad ribbit',
    prims: [C(0.24, 0.24, 0.2), C(0.76, 0.24, 0.2), C(0.5, 0.62, 0.36), C(0.24, 0.24, 0.07, 'bg'), C(0.76, 0.24, 0.07, 'bg')],
  },
  {
    id: 'chick', name: 'Chick', category: 'Animals', density: 0.6, tags: 'bird baby duck',
    prims: [C(0.47, 0.68, 0.3), C(0.47, 0.3, 0.22), P([[0.68, 0.26], [0.99, 0.32], [0.7, 0.4]])],
  },
  {
    id: 'whale', name: 'Whale', category: 'Animals', density: 0.58, tags: 'ocean sea',
    prims: [E(0.46, 0.58, 0.42, 0.3), P([[0.76, 0.5], [0.99, 0.12], [0.99, 0.52]]), C(0.2, 0.5, 0.05, 'bg')],
  },
  {
    id: 'pig', name: 'Pig', category: 'Animals', density: 0.72, tags: 'oink farm',
    prims: [P([[0.14, 0.36], [0.2, 0.02], [0.44, 0.18]]), P([[0.86, 0.36], [0.8, 0.02], [0.56, 0.18]]), C(0.5, 0.6, 0.38), E(0.5, 0.68, 0.17, 0.13, 0, 'bg')],
  },
  {
    id: 'octopus', name: 'Octopus', category: 'Animals', density: 0.64, tags: 'squid sea',
    prims: [D('M0.08,0.58 A0.42,0.42 0 0 1 0.92,0.58 Z'), C(0.22, 0.68, 0.13), C(0.5, 0.74, 0.13), C(0.78, 0.68, 0.13)],
  },
  {
    id: 'snail', name: 'Snail', category: 'Animals', density: 0.6, tags: 'shell slow',
    prims: [C(0.56, 0.46, 0.36), C(0.56, 0.46, 0.17, 'bg'), R(0.02, 0.76, 0.96, 0.2, 0.1), C(0.08, 0.6, 0.06)],
  },
  {
    id: 'bee', name: 'Bee', category: 'Animals', density: 0.62, tags: 'honey buzz insect',
    prims: [E(0.5, 0.6, 0.32, 0.36), R(0.2, 0.52, 0.6, 0.1, 0.05, 0, 'bg'), R(0.2, 0.72, 0.6, 0.1, 0.05, 0, 'bg'), E(0.18, 0.24, 0.16, 0.1, -25), E(0.82, 0.24, 0.16, 0.1, 25)],
  },
  {
    id: 'fox', name: 'Fox', category: 'Animals', density: 0.66, tags: 'wild animal',
    prims: [P([[0.06, 0.3], [0.14, 0.0], [0.42, 0.2]]), P([[0.94, 0.3], [0.86, 0.0], [0.58, 0.2]]), P([[0.08, 0.3], [0.92, 0.3], [0.5, 1.0]])],
  },
];

/* ------------------------------------------------------------------ *
 * NATURE / SPACE / SYMBOLS
 * ------------------------------------------------------------------ */
const NATURE: ShapeDef[] = [
  { id: 'leaf', name: 'Leaf', category: 'Nature', density: 0.6, prims: [D('M0.5,0.03 C0.88,0.22 0.98,0.55 0.5,0.98 C0.02,0.55 0.12,0.22 0.5,0.03 Z')] },
  { id: 'flower', name: 'Flower', category: 'Nature', density: 0.72, prims: [C(0.5, 0.16, 0.17), C(0.84, 0.4, 0.17), C(0.71, 0.82, 0.17), C(0.29, 0.82, 0.17), C(0.16, 0.4, 0.17), C(0.5, 0.52, 0.2)] },
  { id: 'droplet', name: 'Droplet', category: 'Nature', density: 0.6, prims: [D('M0.5,0.02 C0.76,0.34 0.92,0.5 0.92,0.65 A0.42,0.42 0 0 1 0.08,0.65 C0.08,0.5 0.24,0.34 0.5,0.02 Z')] },
  { id: 'cloud', name: 'Cloud', category: 'Nature', density: 0.62, prims: [C(0.28, 0.56, 0.22), C(0.52, 0.42, 0.3), C(0.78, 0.58, 0.2), R(0.08, 0.56, 0.84, 0.24, 0.12)] },
  { id: 'snowflake', name: 'Snowflake', category: 'Nature', density: 0.5, prims: [R(0.44, 0.0, 0.12, 1, 0.06), R(0.44, 0.0, 0.12, 1, 0.06, 60), R(0.44, 0.0, 0.12, 1, 0.06, -60)] },
  { id: 'sun', name: 'Sun', category: 'Nature', density: 0.68, prims: [C(0.5, 0.5, 0.3), R(0.46, 0.0, 0.08, 1, 0.04), R(0.46, 0.0, 0.08, 1, 0.04, 45), R(0.46, 0.0, 0.08, 1, 0.04, 90), R(0.46, 0.0, 0.08, 1, 0.04, 135)] },
  { id: 'tree', name: 'Tree', category: 'Nature', density: 0.6, prims: [P([[0.5, 0.0], [0.9, 0.5], [0.1, 0.5]]), P([[0.5, 0.22], [0.96, 0.78], [0.04, 0.78]]), R(0.42, 0.72, 0.16, 0.28, 0.03)] },
  { id: 'mountain', name: 'Mountain', category: 'Nature', density: 0.52, prims: [P([[0.34, 0.1], [0.68, 0.95], [0.0, 0.95]]), P([[0.68, 0.3], [1.0, 0.95], [0.4, 0.95]])] },
];

const SPACE: ShapeDef[] = [
  { id: 'star5', name: 'Star', category: 'Space', density: 0.5, prims: [P(starPts(5, 0.5, 0.22))] },
  { id: 'sparkle', name: 'Sparkle', category: 'Space', density: 0.44, prims: [D('M0.5,0 C0.57,0.33 0.67,0.43 1,0.5 C0.67,0.57 0.57,0.67 0.5,1 C0.43,0.67 0.33,0.57 0,0.5 C0.33,0.43 0.43,0.33 0.5,0 Z')] },
  { id: 'moon', name: 'Moon', category: 'Space', density: 0.46, prims: [D('M0.72,0.04 A0.48,0.48 0 1 0 0.72,0.96 A0.38,0.38 0 1 1 0.72,0.04 Z')] },
  { id: 'planet', name: 'Planet', category: 'Space', density: 0.68, prims: [C(0.5, 0.5, 0.36), E(0.5, 0.56, 0.52, 0.12, -20)] },
  { id: 'rocket', name: 'Rocket', category: 'Space', density: 0.56, prims: [D('M0.5,0.0 C0.72,0.22 0.78,0.46 0.78,0.72 L0.22,0.72 C0.22,0.46 0.28,0.22 0.5,0.0 Z'), P([[0.22, 0.52], [0.06, 0.86], [0.22, 0.78]]), P([[0.78, 0.52], [0.94, 0.86], [0.78, 0.78]]), C(0.5, 0.88, 0.12)] },
  { id: 'burst', name: 'Burst', category: 'Space', density: 0.6, prims: [P(starPts(8, 0.5, 0.26))] },
  { id: 'comet', name: 'Comet', category: 'Space', density: 0.5, prims: [C(0.66, 0.34, 0.3), P([[0.44, 0.56], [0.0, 1.0], [0.56, 0.68]])] },
];

const SYMBOLS: ShapeDef[] = [
  { id: 'heart', name: 'Heart', category: 'Symbols', density: 0.68, prims: [D('M0.5,0.96 C0.18,0.73 0.02,0.56 0.02,0.36 C0.02,0.16 0.28,0.06 0.5,0.28 C0.72,0.06 0.98,0.16 0.98,0.36 C0.98,0.56 0.82,0.73 0.5,0.96 Z')] },
  { id: 'bolt', name: 'Bolt', category: 'Symbols', density: 0.44, prims: [P([[0.62, 0.0], [0.16, 0.56], [0.46, 0.56], [0.36, 1.0], [0.86, 0.4], [0.54, 0.4]])] },
  { id: 'music', name: 'Music', category: 'Symbols', density: 0.52, prims: [C(0.32, 0.78, 0.2), R(0.48, 0.04, 0.12, 0.76, 0.05), P([[0.48, 0.04], [0.96, 0.16], [0.96, 0.34], [0.48, 0.22]])] },
  { id: 'shield', name: 'Shield', category: 'Symbols', density: 0.66, prims: [D('M0.5,0.02 L0.94,0.2 C0.94,0.6 0.78,0.88 0.5,0.98 C0.22,0.88 0.06,0.6 0.06,0.2 Z')] },
  { id: 'gem', name: 'Gem', category: 'Symbols', density: 0.58, prims: [P([[0.5, 0.0], [1.0, 0.36], [0.5, 1.0], [0.0, 0.36]])] },
  { id: 'smile', name: 'Smiley', category: 'Symbols', density: 0.74, prims: [C(0.5, 0.5, 0.48), C(0.34, 0.38, 0.08, 'bg'), C(0.66, 0.38, 0.08, 'bg'), D('M0.24,0.6 A0.28,0.28 0 0 0 0.76,0.6 L0.66,0.6 A0.18,0.18 0 0 1 0.34,0.6 Z', 'bg')] },
  { id: 'check', name: 'Check', category: 'Symbols', density: 0.42, prims: [R(0.1, 0.52, 0.42, 0.18, 0.08, 45), R(0.3, 0.72, 0.72, 0.18, 0.08, -50)] },
  { id: 'crown', name: 'Crown', category: 'Symbols', density: 0.56, prims: [P([[0.02, 0.88], [0.02, 0.2], [0.26, 0.46], [0.5, 0.08], [0.74, 0.46], [0.98, 0.2], [0.98, 0.88]])] },
  { id: 'pin', name: 'Pin', category: 'Symbols', density: 0.56, prims: [D('M0.5,0.0 A0.36,0.36 0 0 1 0.86,0.36 C0.86,0.62 0.6,0.8 0.5,1.0 C0.4,0.8 0.14,0.62 0.14,0.36 A0.36,0.36 0 0 1 0.5,0.0 Z'), C(0.5, 0.36, 0.13, 'bg')] },
  { id: 'hash', name: 'Hash', category: 'Symbols', density: 0.5, prims: [R(0.26, 0.0, 0.14, 1, 0.04, 10), R(0.6, 0.0, 0.14, 1, 0.04, 10), R(0.0, 0.28, 1, 0.14, 0.04), R(0.0, 0.6, 1, 0.14, 0.04)] },
];

/* ------------------------------------------------------------------ *
 * EMOJI + FOOD — rendered as real glyphs
 * ------------------------------------------------------------------ */
function emojiShape(ch: string, name: string, category: ShapeCategory, tags?: string): ShapeDef {
  return { id: 'emoji:' + ch, name, category, density: 0.62, prims: [{ k: 'emoji', ch }], tags };
}

const EMOJI: ShapeDef[] = [
  emojiShape('❤️', 'Heart', 'Emoji', 'love'),
  emojiShape('⭐', 'Star', 'Emoji'),
  emojiShape('✨', 'Sparkles', 'Emoji'),
  emojiShape('🔥', 'Fire', 'Emoji'),
  emojiShape('⚡', 'Zap', 'Emoji'),
  emojiShape('🌸', 'Blossom', 'Emoji'),
  emojiShape('🍀', 'Clover', 'Emoji'),
  emojiShape('🌈', 'Rainbow', 'Emoji'),
  emojiShape('😎', 'Cool', 'Emoji', 'face'),
  emojiShape('😀', 'Grin', 'Emoji', 'face'),
  emojiShape('👾', 'Invader', 'Emoji', 'game'),
  emojiShape('🚀', 'Rocket', 'Emoji'),
  emojiShape('🌙', 'Moon', 'Emoji'),
  emojiShape('💎', 'Gem', 'Emoji'),
  emojiShape('🎵', 'Note', 'Emoji', 'music'),
  emojiShape('⚽', 'Ball', 'Emoji', 'sport'),
  emojiShape('🎃', 'Pumpkin', 'Emoji', 'halloween'),
  emojiShape('💌', 'Letter', 'Emoji', 'mail'),
  emojiShape('🐶', 'Dog', 'Emoji', 'animal pet'),
  emojiShape('🐱', 'Cat', 'Emoji', 'animal pet'),
  emojiShape('🦊', 'Fox', 'Emoji', 'animal'),
  emojiShape('🐼', 'Panda', 'Emoji', 'animal'),
  emojiShape('🐸', 'Frog', 'Emoji', 'animal'),
  emojiShape('🐵', 'Monkey', 'Emoji', 'animal'),
  emojiShape('🦄', 'Unicorn', 'Emoji', 'animal'),
  emojiShape('🐧', 'Penguin', 'Emoji', 'animal'),
  emojiShape('🐝', 'Bee', 'Emoji', 'animal'),
  emojiShape('🦋', 'Butterfly', 'Emoji', 'animal'),
  emojiShape('🐙', 'Octopus', 'Emoji', 'animal'),
  emojiShape('🐢', 'Turtle', 'Emoji', 'animal'),
];

const FOOD: ShapeDef[] = [
  emojiShape('🍕', 'Pizza', 'Food'),
  emojiShape('☕', 'Coffee', 'Food'),
  emojiShape('🍓', 'Berry', 'Food'),
  emojiShape('🍉', 'Melon', 'Food'),
  emojiShape('🍩', 'Donut', 'Food'),
  emojiShape('🍭', 'Candy', 'Food'),
  emojiShape('🍎', 'Apple', 'Food'),
  emojiShape('🍿', 'Popcorn', 'Food'),
  emojiShape('🍦', 'Ice cream', 'Food'),
  emojiShape('🥑', 'Avocado', 'Food'),
  { id: 'icecube', name: 'Cube', category: 'Food', density: 0.8, prims: [R(0.05, 0.05, 0.9, 0.9, 0.18)] },
  { id: 'cherry', name: 'Cherries', category: 'Food', density: 0.6, prims: [C(0.3, 0.72, 0.26), C(0.74, 0.74, 0.22), D('M0.32,0.5 C0.4,0.2 0.6,0.1 0.9,0.08 L0.9,0.2 C0.66,0.24 0.5,0.32 0.46,0.52 Z')] },
];

export const SHAPES: ShapeDef[] = [...CLASSIC, ...ANIMALS, ...EMOJI, ...NATURE, ...SPACE, ...FOOD, ...SYMBOLS];

export const SHAPE_CATEGORIES: ShapeCategory[] = ['Classic', 'Animals', 'Emoji', 'Nature', 'Space', 'Food', 'Symbols'];

const SHAPE_MAP: Record<string, ShapeDef> = SHAPES.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {} as Record<string, ShapeDef>);

export function getShape(id: string): ShapeDef {
  if (SHAPE_MAP[id]) return SHAPE_MAP[id];
  if (id.startsWith('emoji:')) {
    const ch = id.slice(6);
    return emojiShape(ch, ch, 'Emoji');
  }
  return SHAPE_MAP['rounded'];
}

/* ------------------------------------------------------------------ *
 * EYES (finder patterns)
 * ------------------------------------------------------------------ */
export type EyeDef = {
  id: string;
  name: string;
  /** unit-space prims across the whole 7x7 finder block */
  prims: Prim[];
};

const u = (n: number) => n / 7;

export const EYES: EyeDef[] = [
  {
    id: 'square', name: 'Square',
    prims: [R(0, 0, 1, 1), R(u(1), u(1), u(5), u(5), 0, 0, 'bg'), R(u(2), u(2), u(3), u(3))],
  },
  {
    id: 'rounded', name: 'Rounded',
    prims: [R(0, 0, 1, 1, 0.22), R(u(1), u(1), u(5), u(5), 0.18, 0, 'bg'), R(u(2), u(2), u(3), u(3), 0.12)],
  },
  {
    id: 'circle', name: 'Circle',
    prims: [C(0.5, 0.5, 0.5), C(0.5, 0.5, u(2.5), 'bg'), C(0.5, 0.5, u(1.5))],
  },
  {
    id: 'squircle', name: 'Squircle',
    prims: [R(0, 0, 1, 1, 0.38), R(u(1), u(1), u(5), u(5), 0.3, 0, 'bg'), C(0.5, 0.5, u(1.5))],
  },
  {
    id: 'leaf', name: 'Leaf',
    prims: [
      D('M0.3,0 L1,0 L1,0.7 A0.3,0.3 0 0 1 0.7,1 L0,1 L0,0.3 A0.3,0.3 0 0 1 0.3,0 Z'),
      D(`M${u(1.9)},${u(1)} L${u(6)},${u(1)} L${u(6)},${u(5.1)} A${u(0.9)},${u(0.9)} 0 0 1 ${u(5.1)},${u(6)} L${u(1)},${u(6)} L${u(1)},${u(1.9)} A${u(0.9)},${u(0.9)} 0 0 1 ${u(1.9)},${u(1)} Z`, 'bg'),
      D(`M${u(2.8)},${u(2)} L${u(5)},${u(2)} L${u(5)},${u(4.2)} A${u(0.8)},${u(0.8)} 0 0 1 ${u(4.2)},${u(5)} L${u(2)},${u(5)} L${u(2)},${u(2.8)} A${u(0.8)},${u(0.8)} 0 0 1 ${u(2.8)},${u(2)} Z`),
    ],
  },
  {
    id: 'flower', name: 'Flower',
    prims: [
      C(0.26, 0.26, 0.26), C(0.74, 0.26, 0.26), C(0.26, 0.74, 0.26), C(0.74, 0.74, 0.26), R(0.1, 0.1, 0.8, 0.8),
      C(0.5, 0.5, u(2.4), 'bg'),
      C(0.5, 0.5, u(1.5)),
    ],
  },
  {
    id: 'paw', name: 'Paw',
    prims: [
      C(0.5, 0.5, 0.5), C(0.5, 0.5, u(2.5), 'bg'),
      C(0.5, 0.58, u(1.3)), C(0.3, 0.3, u(0.6)), C(0.5, 0.24, u(0.6)), C(0.7, 0.3, u(0.6)),
    ],
  },
  {
    id: 'cat', name: 'Cat ears',
    prims: [
      P([[0.04, 0.4], [0.04, -0.06], [0.42, 0.14]]), P([[0.96, 0.4], [0.96, -0.06], [0.58, 0.14]]),
      R(0, 0.06, 1, 0.94, 0.26), R(u(1), u(1.5), u(5), u(4.6), 0.2, 0, 'bg'), C(0.5, 0.56, u(1.5)),
    ],
  },
  {
    id: 'star', name: 'Star',
    prims: [P(starPts(4, 0.52, 0.3)), C(0.5, 0.5, u(2.2), 'bg'), P(starPts(4, u(1.7), u(0.9)))],
  },
  {
    id: 'dots', name: 'Dot grid',
    prims: [
      ...[0, 1, 2, 3, 4, 5, 6].flatMap((c) => [
        C(u(c + 0.5), u(0.5), u(0.46)),
        C(u(c + 0.5), u(6.5), u(0.46)),
      ]),
      ...[1, 2, 3, 4, 5].flatMap((r) => [C(u(0.5), u(r + 0.5), u(0.46)), C(u(6.5), u(r + 0.5), u(0.46))]),
      C(0.5, 0.5, u(1.5)),
    ],
  },
];

const EYE_MAP: Record<string, EyeDef> = EYES.reduce((a, e) => {
  a[e.id] = e;
  return a;
}, {} as Record<string, EyeDef>);

export function getEye(id: string): EyeDef {
  return EYE_MAP[id] ?? EYE_MAP['rounded'];
}

/** Emoji palette used by the custom-emoji picker & center badge. */
export const EMOJI_PICKER: string[] = [
  '😀', '😍', '😎', '🤩', '😺', '🐶', '🐱', '🦊', '🐼', '🐨',
  '🐵', '🦁', '🐯', '🐸', '🐧', '🦉', '🦄', '🐝', '🦋', '🐞',
  '🐢', '🐙', '🐳', '🐬', '🐠', '🦀', '🐌', '🦇', '🐇', '🐿️',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '⭐', '🌟', '✨', '⚡',
  '🔥', '🌈', '☀️', '🌙', '☁️', '❄️', '🌸', '🌺', '🌻', '🍀',
  '🌲', '🌵', '🍎', '🍓', '🍉', '🍌', '🍕', '🍔', '🍟', '🍩',
  '🍭', '🍦', '☕', '🧋', '🍿', '🎂', '🎁', '🎈', '🎵', '🎸',
  '🎮', '👾', '🚀', '🛸', '🏀', '⚽', '🎾', '🏆', '💎', '👑',
  '💰', '🛍️', '📷', '🎧', '💻', '📱', '🔑', '📍', '🏠', '✈️',
];
