import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { ContentType, TYPES, autoTitle, buildContent } from './content';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STYLE,
  Design,
  QRStyle,
  Settings,
  loadDesigns,
  loadDraft,
  loadSettings,
  persistSettings,
  saveDesigns,
  saveDraft,
  uid,
} from './store';
import { Theme, darkTheme, lightTheme } from './theme';
import { buildElements, elementsToSvg } from '../components/QRCanvas';

type Ctx = {
  ready: boolean;
  theme: Theme;
  settings: Settings;
  updateSettings: (p: Partial<Settings>) => void;

  type: ContentType;
  setType: (t: ContentType) => void;
  fields: Record<string, string>;
  setField: (k: string, v: string) => void;

  style: QRStyle;
  patchStyle: (p: Partial<QRStyle>) => void;
  resetStyle: () => void;

  content: string;
  title: string;

  designs: Design[];
  saveCurrent: () => Design;
  removeDesign: (id: string) => void;
  openDesign: (d: Design) => void;
  clearAll: () => void;

  buzz: (kind?: 'light' | 'success') => void;
  exportSvg: (content: string, style: QRStyle, px?: number) => Promise<'downloaded' | 'copied'>;
};

const StudioContext = createContext<Ctx | null>(null);

const emptyFields = (): Record<string, Record<string, string>> => {
  const o: Record<string, Record<string, string>> = {};
  for (const t of TYPES) o[t.id] = { ...t.defaults };
  return o;
};

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [type, setTypeRaw] = useState<ContentType>('link');
  const [allFields, setAllFields] = useState<Record<string, Record<string, string>>>(emptyFields);
  const [style, setStyle] = useState<QRStyle>(DEFAULT_STYLE);
  const [designs, setDesigns] = useState<Design[]>([]);

  useEffect(() => {
    (async () => {
      const [s, d, draft] = await Promise.all([loadSettings(), loadDesigns(), loadDraft()]);
      setSettings(s);
      setDesigns(d);
      if (draft) {
        setTypeRaw(draft.type ?? 'link');
        setAllFields({ ...emptyFields(), ...(draft.fields ?? {}) });
        setStyle({ ...DEFAULT_STYLE, ...(draft.style ?? {}) });
      }
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft({ type, fields: allFields, style });
  }, [ready, type, allFields, style]);

  useEffect(() => {
    if (!ready) return;
    saveDesigns(designs);
  }, [ready, designs]);

  const theme: Theme = useMemo(() => {
    const dark = settings.appearance === 'system' ? scheme !== 'light' : settings.appearance === 'dark';
    return dark ? darkTheme : lightTheme;
  }, [settings.appearance, scheme]);

  const fields = allFields[type] ?? {};
  const content = useMemo(() => buildContent(type, fields), [type, fields]);
  const title = useMemo(() => autoTitle(type, fields), [type, fields]);

  const buzz = useCallback(
    (kind: 'light' | 'success' = 'light') => {
      if (!settings.haptics || Platform.OS === 'web') return;
      if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [settings.haptics]
  );

  const setField = useCallback(
    (k: string, v: string) => {
      setAllFields((prev) => ({ ...prev, [type]: { ...(prev[type] ?? {}), [k]: v } }));
    },
    [type]
  );

  const patchStyle = useCallback((p: Partial<QRStyle>) => setStyle((s) => ({ ...s, ...p })), []);
  const resetStyle = useCallback(() => setStyle(DEFAULT_STYLE), []);

  const updateSettings = useCallback((p: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...p };
      persistSettings(next);
      return next;
    });
  }, []);

  const saveCurrent = useCallback(() => {
    const d: Design = {
      id: uid(),
      title,
      type,
      fields: { ...fields },
      content: content || 'https://qrhub.app',
      style: { ...style },
      createdAt: Date.now(),
    };
    setDesigns((prev) => [d, ...prev]);
    return d;
  }, [title, type, fields, content, style]);

  const removeDesign = useCallback((id: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const openDesign = useCallback((d: Design) => {
    setTypeRaw(d.type);
    setAllFields((prev) => ({ ...prev, [d.type]: { ...d.fields } }));
    setStyle({ ...DEFAULT_STYLE, ...d.style });
  }, []);

  const clearAll = useCallback(() => setDesigns([]), []);

  const exportSvg = useCallback(async (c: string, st: QRStyle, px = 1024) => {
    const built = buildElements(c || 'https://qrhub.app', st, px);
    const svg = elementsToSvg(built.els, px, st);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrhub-code.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return 'downloaded' as const;
    }
    await Clipboard.setStringAsync(svg);
    return 'copied' as const;
  }, []);

  const value: Ctx = {
    ready,
    theme,
    settings,
    updateSettings,
    type,
    setType: setTypeRaw,
    fields,
    setField,
    style,
    patchStyle,
    resetStyle,
    content,
    title,
    designs,
    saveCurrent,
    removeDesign,
    openDesign,
    clearAll,
    buzz,
    exportSvg,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): Ctx {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}

export function useDebounced<T>(value: T, delay = 220): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
