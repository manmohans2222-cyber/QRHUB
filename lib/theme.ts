export type Theme = {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  dim: string;
  accent: string;
  accent2: string;
  accent3: string;
  good: string;
  warn: string;
  bad: string;
  shadow: string;
};

export const darkTheme: Theme = {
  dark: true,
  bg: '#0A0A11',
  surface: '#14141F',
  surfaceAlt: '#1D1D2B',
  border: '#2A2A3C',
  text: '#F3F3FA',
  dim: '#9494B0',
  accent: '#7C5CFF',
  accent2: '#FF4D9D',
  accent3: '#FFB15C',
  good: '#3DDC97',
  warn: '#FFC53D',
  bad: '#FF5C5C',
  shadow: '#000000',
};

export const lightTheme: Theme = {
  dark: false,
  bg: '#F5F5FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F0F7',
  border: '#E3E3EE',
  text: '#14141F',
  dim: '#6B6B85',
  accent: '#6A46F5',
  accent2: '#F0348C',
  accent3: '#F59232',
  good: '#17A673',
  warn: '#C98A00',
  bad: '#E04444',
  shadow: '#8A8AA8',
};

export type Palette = {
  id: string;
  name: string;
  fgA: string;
  fgB: string;
  bg: string;
};

export const PALETTES: Palette[] = [
  { id: 'ink', name: 'Ink', fgA: '#101018', fgB: '#2B2B3C', bg: '#FFFFFF' },
  { id: 'grape', name: 'Grape', fgA: '#7C5CFF', fgB: '#FF4D9D', bg: '#FFFFFF' },
  { id: 'sunset', name: 'Sunset', fgA: '#FF6B4A', fgB: '#FFB15C', bg: '#FFF6EC' },
  { id: 'ocean', name: 'Ocean', fgA: '#0EA5E9', fgB: '#2563EB', bg: '#F2F9FF' },
  { id: 'forest', name: 'Forest', fgA: '#17A673', fgB: '#86C232', bg: '#F3FBF4' },
  { id: 'candy', name: 'Candy', fgA: '#FF4D9D', fgB: '#FF9ECF', bg: '#FFF2F8' },
  { id: 'neon', name: 'Neon', fgA: '#39FF88', fgB: '#00E0FF', bg: '#06121A' },
  { id: 'midnight', name: 'Midnight', fgA: '#A78BFA', fgB: '#60A5FA', bg: '#0B1020' },
  { id: 'gold', name: 'Gold', fgA: '#D4A017', fgB: '#F6D365', bg: '#1A1408' },
  { id: 'cherry', name: 'Cherry', fgA: '#E11D48', fgB: '#FB7185', bg: '#FFFFFF' },
];
