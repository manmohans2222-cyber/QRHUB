import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentType } from './content';
import { ECC } from './qr';

export type QRStyle = {
  shape: string;
  eye: string;
  fgA: string;
  fgB: string;
  gradient: boolean;
  bg: string;
  transparent: boolean;
  moduleScale: number;
  quiet: number;
  ecc: ECC;
  badge: string | null;
};

export type Design = {
  id: string;
  title: string;
  type: ContentType;
  fields: Record<string, string>;
  content: string;
  style: QRStyle;
  createdAt: number;
};

export type Settings = {
  appearance: 'system' | 'light' | 'dark';
  haptics: boolean;
};

export const DEFAULT_STYLE: QRStyle = {
  shape: 'rounded',
  eye: 'rounded',
  fgA: '#7C5CFF',
  fgB: '#FF4D9D',
  gradient: true,
  bg: '#FFFFFF',
  transparent: false,
  moduleScale: 1,
  quiet: 2,
  ecc: 'H',
  badge: null,
};

export const DEFAULT_SETTINGS: Settings = { appearance: 'system', haptics: true };

const K_DESIGNS = 'qrhub.designs.v2';
const K_DRAFT = 'qrhub.draft.v2';
const K_SETTINGS = 'qrhub.settings.v2';

export async function loadDesigns(): Promise<Design[]> {
  try {
    const raw = await AsyncStorage.getItem(K_DESIGNS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveDesigns(d: Design[]): Promise<void> {
  try {
    await AsyncStorage.setItem(K_DESIGNS, JSON.stringify(d));
  } catch {}
}

export type Draft = { type: ContentType; fields: Record<string, Record<string, string>>; style: QRStyle };

export async function loadDraft(): Promise<Draft | null> {
  try {
    const raw = await AsyncStorage.getItem(K_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveDraft(d: Draft): Promise<void> {
  try {
    await AsyncStorage.setItem(K_DRAFT, JSON.stringify(d));
  } catch {}
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(K_SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function persistSettings(s: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(K_SETTINGS, JSON.stringify(s));
  } catch {}
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
