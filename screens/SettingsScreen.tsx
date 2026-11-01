import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card, Chip, GhostButton, SectionTitle } from '../components/ui';
import { SHAPES, EYES } from '../lib/shapes';
import { useStudio } from '../lib/studio';

export default function SettingsScreen() {
  const { theme, settings, updateSettings, designs, clearAll, buzz } = useStudio();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>Settings</Text>
        <Text style={{ color: theme.dim, fontSize: 13, marginTop: 2 }}>Tune QRHub to your taste</Text>

        <SectionTitle theme={theme} title="Appearance" />
        <Card theme={theme}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['system', 'light', 'dark'] as const).map((a) => (
              <Chip
                key={a}
                theme={theme}
                label={a[0].toUpperCase() + a.slice(1)}
                compact
                active={settings.appearance === a}
                onPress={() => {
                  buzz();
                  updateSettings({ appearance: a });
                }}
              />
            ))}
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14.5, fontWeight: '600' }}>Haptic feedback</Text>
              <Text style={{ color: theme.dim, fontSize: 12, marginTop: 2 }}>Tiny taps on device</Text>
            </View>
            <Switch
              value={settings.haptics}
              onValueChange={(v) => updateSettings({ haptics: v })}
              trackColor={{ true: theme.accent, false: theme.border }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <SectionTitle theme={theme} title="Library" />
        <Card theme={theme}>
          <StatRow theme={theme} icon="shapes-outline" label="Module shapes" value={`${SHAPES.length}`} />
          <StatRow theme={theme} icon="scan-outline" label="Eye styles" value={`${EYES.length}`} />
          <StatRow theme={theme} icon="happy-outline" label="Emoji modules & badges" value="90+" />
          <StatRow theme={theme} icon="bookmark-outline" label="Saved codes" value={`${designs.length}`} />
        </Card>

        <SectionTitle theme={theme} title="Printing tips" />
        <Card theme={theme}>
          {[
            'Always test-scan with two different phones before printing.',
            'Decorative modules need error correction High (30%).',
            'Keep at least a 2-module quiet zone of empty space.',
            'Dark modules on a light background scan best — never invert.',
            'Print at 2.5 cm (1 in) minimum, bigger for emoji modules.',
          ].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10, paddingVertical: 7 }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={theme.good} style={{ marginTop: 1 }} />
              <Text style={{ color: theme.dim, fontSize: 13, flex: 1, lineHeight: 19 }}>{t}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle theme={theme} title="Data" />
        <GhostButton
          theme={theme}
          label="Clear saved collection"
          icon="trash-outline"
          tone="danger"
          onPress={() => {
            clearAll();
            buzz('success');
          }}
        />

        <Pressable
          onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/QR_code')}
          style={{ marginTop: 26, alignItems: 'center' }}
        >
          <Text style={{ color: theme.dim, fontSize: 12 }}>QRHub · offline QR studio · v2.0</Text>
          <Text style={{ color: theme.accent, fontSize: 12, marginTop: 4, fontWeight: '700' }}>
            How QR codes work ↗
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ theme, icon, label, value }: { theme: any; icon: any; label: string; value: string }) {
  return (
    <View style={styles.statRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name={icon} size={17} color={theme.dim} />
        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
      </View>
      <Text style={{ color: theme.dim, fontSize: 14, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
});
