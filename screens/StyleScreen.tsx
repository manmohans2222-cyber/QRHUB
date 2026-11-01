import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import QRCanvas, { EyePreview } from '../components/QRCanvas';
import { Card, Chip, GhostButton, SectionTitle, Segmented, Stepper } from '../components/ui';
import { PALETTES } from '../lib/theme';
import { EYES } from '../lib/shapes';
import { useStudio } from '../lib/studio';

const SWATCHES = [
  '#101018', '#2B2B3C', '#5A5A72', '#FFFFFF', '#F3F3FA', '#FFF6EC',
  '#7C5CFF', '#6A46F5', '#A78BFA', '#FF4D9D', '#E11D48', '#FB7185',
  '#FF6B4A', '#FFB15C', '#D4A017', '#17A673', '#3DDC97', '#86C232',
  '#0EA5E9', '#2563EB', '#60A5FA', '#0B1020', '#06121A', '#1A1408',
];

export default function StyleScreen() {
  const { theme, style, patchStyle, resetStyle, content, buzz } = useStudio();
  const nav = useNavigation<any>();
  const { width } = useWindowDimensions();
  const preview = Math.min(width - 160, 190);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 46 }} showsVerticalScrollIndicator={false}>
        <Card theme={theme} style={{ alignItems: 'center' }}>
          <View
            style={{
              padding: 10,
              borderRadius: 22,
              backgroundColor: style.transparent ? theme.surfaceAlt : style.bg,
            }}
          >
            <QRCanvas content={content} style={style} size={preview} radius={12} />
          </View>
        </Card>

        <SectionTitle theme={theme} title="Palettes" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {PALETTES.map((p) => {
            const active = style.fgA === p.fgA && style.fgB === p.fgB && style.bg === p.bg;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  buzz();
                  patchStyle({ fgA: p.fgA, fgB: p.fgB, bg: p.bg, transparent: false });
                }}
                style={[
                  styles.palette,
                  {
                    backgroundColor: p.bg,
                    borderColor: active ? theme.accent : theme.border,
                    borderWidth: active ? 2.5 : 1,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <View style={[styles.swatchDot, { backgroundColor: p.fgA }]} />
                  <View style={[styles.swatchDot, { backgroundColor: p.fgB }]} />
                </View>
                <Text style={{ color: p.fgA, fontSize: 11, fontWeight: '800', marginTop: 8 }}>{p.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SectionTitle theme={theme} title="Colors" />
        <Card theme={theme}>
          <ColorRow
            theme={theme}
            label="Foreground"
            value={style.fgA}
            onPick={(c) => patchStyle({ fgA: c })}
          />
          <ColorRow
            theme={theme}
            label="Gradient end"
            value={style.fgB}
            onPick={(c) => patchStyle({ fgB: c })}
          />
          <ColorRow theme={theme} label="Background" value={style.bg} onPick={(c) => patchStyle({ bg: c })} />

          <ToggleRow
            theme={theme}
            label="Gradient fill"
            value={style.gradient}
            onChange={(v) => patchStyle({ gradient: v })}
          />
          <ToggleRow
            theme={theme}
            label="Transparent background"
            value={style.transparent}
            onChange={(v) => patchStyle({ transparent: v })}
          />
        </Card>

        <SectionTitle theme={theme} title="Geometry" />
        <Card theme={theme}>
          <Stepper
            theme={theme}
            label="Module size"
            value={style.moduleScale}
            display={`${Math.round(style.moduleScale * 100)}%`}
            onDec={() => patchStyle({ moduleScale: Math.max(0.5, +(style.moduleScale - 0.05).toFixed(2)) })}
            onInc={() => patchStyle({ moduleScale: Math.min(1.25, +(style.moduleScale + 0.05).toFixed(2)) })}
          />
          <Stepper
            theme={theme}
            label="Quiet zone"
            value={style.quiet}
            display={`${style.quiet} mod`}
            onDec={() => patchStyle({ quiet: Math.max(0, style.quiet - 1) })}
            onInc={() => patchStyle({ quiet: Math.min(6, style.quiet + 1) })}
          />
          <View style={{ marginTop: 14 }}>
            <Text style={{ color: theme.dim, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>
              Error correction
            </Text>
            <Segmented
              theme={theme}
              value={style.ecc}
              onChange={(v) => patchStyle({ ecc: v as any })}
              options={[
                { id: 'L', label: 'L 7%' },
                { id: 'M', label: 'M 15%' },
                { id: 'Q', label: 'Q 25%' },
                { id: 'H', label: 'H 30%' },
              ]}
            />
          </View>
        </Card>

        <SectionTitle theme={theme} title="Eyes" action="All shapes" onAction={() => nav.navigate('Tabs', { screen: 'Shapes' })} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {EYES.map((e) => {
            const active = style.eye === e.id;
            return (
              <Pressable
                key={e.id}
                onPress={() => {
                  buzz();
                  patchStyle({ eye: e.id });
                }}
                style={{
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 16,
                  backgroundColor: theme.dark ? '#FFFFFF' : theme.surface,
                  borderWidth: active ? 2.5 : 1,
                  borderColor: active ? theme.accent : theme.border,
                }}
              >
                <EyePreview eyeId={e.id} size={44} color="#14141F" bg={theme.dark ? '#FFFFFF' : theme.surface} />
              </Pressable>
            );
          })}
        </ScrollView>

        <SectionTitle theme={theme} title="Center badge" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip
            theme={theme}
            label="None"
            compact
            active={style.badge === null}
            onPress={() => patchStyle({ badge: null })}
          />
          {['❤️', '⭐', '🐶', '🐱', '🐼', '🚀', '🍕', '⚡', '🌸', '💎'].map((e) => (
            <Pressable
              key={e}
              onPress={() => {
                buzz();
                patchStyle({ badge: e });
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: style.badge === e ? theme.accent + '22' : theme.surfaceAlt,
                borderWidth: style.badge === e ? 2 : 1,
                borderColor: style.badge === e ? theme.accent : theme.border,
              }}
            >
              <Text style={{ fontSize: 20 }}>{e}</Text>
            </Pressable>
          ))}
        </View>

        <GhostButton
          theme={theme}
          label="Reset to default style"
          icon="refresh-outline"
          style={{ marginTop: 24 }}
          onPress={() => {
            resetStyle();
            buzz('success');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorRow({
  theme,
  label,
  value,
  onPick,
}: {
  theme: any;
  label: string;
  value: string;
  onPick: (c: string) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <View style={[styles.currentDot, { backgroundColor: value, borderColor: theme.border }]} />
        <Text style={{ color: theme.text, fontSize: 13.5, fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: theme.dim, fontSize: 11.5 }}>{value.toUpperCase()}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SWATCHES.map((c) => (
          <Pressable
            key={label + c}
            onPress={() => onPick(c)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              backgroundColor: c,
              borderWidth: value.toUpperCase() === c.toUpperCase() ? 2.5 : 1,
              borderColor: value.toUpperCase() === c.toUpperCase() ? theme.accent : theme.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function ToggleRow({
  theme,
  label,
  value,
  onChange,
}: {
  theme: any;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={{ color: theme.text, fontSize: 14.5, fontWeight: '600' }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.accent, false: theme.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  palette: {
    width: 92,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  swatchDot: { width: 16, height: 16, borderRadius: 8 },
  currentDot: { width: 20, height: 20, borderRadius: 7, borderWidth: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
});
