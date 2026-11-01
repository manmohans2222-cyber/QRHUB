import React, { useMemo, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import QRCanvas from '../components/QRCanvas';
import { Card, Chip, Field, GhostButton, GradientButton, SectionTitle } from '../components/ui';
import { TYPES, getType } from '../lib/content';
import { scanScore } from '../lib/score';
import { getShape } from '../lib/shapes';
import { useDebounced, useStudio } from '../lib/studio';

export default function CreateScreen() {
  const {
    theme,
    type,
    setType,
    fields,
    setField,
    style,
    content,
    saveCurrent,
    buzz,
    exportSvg,
    settings,
    updateSettings,
  } = useStudio();
  const nav = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [toast, setToast] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  const debounced = useDebounced(content, 240);
  const previewSize = Math.min(width - 88, 300);
  const td = getType(type);
  const score = useMemo(() => scanScore(style), [style]);
  const shape = getShape(style.shape);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  };

  const scoreColor = theme[score.color];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LinearGradient
                colors={[theme.accent, theme.accent2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logo}
              >
                <Ionicons name="qr-code" size={20} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={{ color: theme.text, fontSize: 22, fontWeight: '900', letterSpacing: -0.4 }}>
                  QRHub
                </Text>
                <Text style={{ color: theme.dim, fontSize: 12.5, marginTop: 1 }}>
                  70+ shapes · animals · emoji
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                buzz();
                updateSettings({ appearance: theme.dark ? 'light' : 'dark' });
              }}
              style={[styles.iconBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
            >
              <Ionicons name={theme.dark ? 'sunny-outline' : 'moon-outline'} size={19} color={theme.text} />
            </Pressable>
          </View>

          <Card theme={theme} style={{ alignItems: 'center', paddingVertical: 24 }}>
            <View
              style={{
                padding: 10,
                borderRadius: 26,
                backgroundColor: style.transparent ? theme.surfaceAlt : style.bg,
              }}
            >
              <QRCanvas content={debounced} style={style} size={previewSize} radius={16} />
            </View>

            <Pressable
              onPress={() => setShowTips((s) => !s)}
              style={[styles.scorePill, { backgroundColor: scoreColor + '1F', borderColor: scoreColor + '55' }]}
            >
              <View style={[styles.dot, { backgroundColor: scoreColor }]} />
              <Text style={{ color: scoreColor, fontWeight: '800', fontSize: 12.5 }}>
                {score.label} · {score.value}
              </Text>
              <Ionicons name={showTips ? 'chevron-up' : 'chevron-down'} size={13} color={scoreColor} />
            </Pressable>

            {showTips ? (
              <View style={{ marginTop: 12, gap: 7, alignSelf: 'stretch' }}>
                {score.tips.map((t, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                    <Ionicons name="sparkles-outline" size={14} color={theme.dim} style={{ marginTop: 2 }} />
                    <Text style={{ color: theme.dim, fontSize: 12.5, flex: 1, lineHeight: 18 }}>{t}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.quickRow}>
              <QuickAction
                theme={theme}
                icon="shapes-outline"
                label={shape.name}
                onPress={() => {
                  buzz();
                  nav.navigate('Shapes');
                }}
              />
              <QuickAction
                theme={theme}
                icon="color-palette-outline"
                label="Style"
                onPress={() => {
                  buzz();
                  nav.navigate('Style');
                }}
              />
              <QuickAction
                theme={theme}
                icon="download-outline"
                label="SVG"
                onPress={async () => {
                  buzz('success');
                  const r = await exportSvg(content, style);
                  flash(r === 'downloaded' ? 'SVG downloaded' : 'SVG copied to clipboard');
                }}
              />
              <QuickAction
                theme={theme}
                icon="copy-outline"
                label="Copy"
                onPress={async () => {
                  await Clipboard.setStringAsync(content || 'https://qrhub.app');
                  buzz();
                  flash('Content copied');
                }}
              />
            </View>
          </Card>

          <SectionTitle theme={theme} title="What's inside" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 10 }}
          >
            {TYPES.map((t) => (
              <Chip
                key={t.id}
                theme={theme}
                label={t.name}
                icon={t.icon}
                active={t.id === type}
                onPress={() => {
                  buzz();
                  setType(t.id);
                }}
              />
            ))}
          </ScrollView>

          <Card theme={theme} style={{ marginTop: 16 }}>
            <Text style={{ color: theme.dim, fontSize: 13, marginBottom: 14 }}>{td.blurb}</Text>
            {td.fields.map((f) =>
              f.options ? (
                <View key={f.key} style={{ marginBottom: 14 }}>
                  <Text style={{ color: theme.dim, fontSize: 12, fontWeight: '700', marginBottom: 8 }}>
                    {f.label}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {f.options.map((o) => (
                      <Chip
                        key={o}
                        theme={theme}
                        label={o}
                        compact
                        active={(fields[f.key] ?? f.options![0]) === o}
                        onPress={() => setField(f.key, o)}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <Field
                  key={f.key}
                  theme={theme}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={fields[f.key] ?? ''}
                  onChangeText={(v) => setField(f.key, v)}
                  keyboardType={(f.keyboard as any) ?? 'default'}
                  multiline={f.multiline}
                  autoCapitalize={f.keyboard === 'email-address' || f.keyboard === 'url' ? 'none' : 'sentences'}
                  autoCorrect={false}
                  returnKeyType="done"
                />
              )
            )}
            {!content ? (
              <View style={[styles.note, { backgroundColor: theme.surfaceAlt }]}>
                <Ionicons name="information-circle-outline" size={15} color={theme.dim} />
                <Text style={{ color: theme.dim, fontSize: 12.5, flex: 1 }}>
                  Fill in the fields above — the preview shows a sample code until then.
                </Text>
              </View>
            ) : null}
          </Card>

          <GradientButton
            theme={theme}
            label="Save to collection"
            icon="bookmark-outline"
            style={{ marginTop: 20 }}
            onPress={() => {
              saveCurrent();
              buzz('success');
              flash('Saved to your collection');
            }}
          />
          <GhostButton
            theme={theme}
            label="Browse shape library"
            icon="paw-outline"
            style={{ marginTop: 10 }}
            onPress={() => nav.navigate('Shapes')}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {toast ? (
        <Animated.View style={[styles.toast, { backgroundColor: theme.text }]}>
          <Ionicons name="checkmark-circle" size={16} color={theme.bg} />
          <Text style={{ color: theme.bg, fontWeight: '700', fontSize: 13.5 }}>{toast}</Text>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

function QuickAction({
  theme,
  icon,
  label,
  onPress,
}: {
  theme: any;
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: theme.surfaceAlt, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons name={icon} size={17} color={theme.text} />
      <Text numberOfLines={1} style={{ color: theme.text, fontSize: 11.5, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logo: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { padding: 10, borderRadius: 13, borderWidth: 1 },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 16,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 18, alignSelf: 'stretch' },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
  },
  note: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 12, borderRadius: 12 },
  toast: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
});
