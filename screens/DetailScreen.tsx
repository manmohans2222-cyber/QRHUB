import React, { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import QRCanvas from '../components/QRCanvas';
import { Card, GhostButton, GradientButton } from '../components/ui';
import { getType } from '../lib/content';
import { getEye, getShape } from '../lib/shapes';
import { useStudio } from '../lib/studio';

export default function DetailScreen() {
  const { theme, designs, removeDesign, openDesign, exportSvg, buzz } = useStudio();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const [msg, setMsg] = useState<string | null>(null);

  const design = designs.find((d) => d.id === route.params?.id);

  if (!design) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="alert-circle-outline" size={34} color={theme.dim} />
        <Text style={{ color: theme.dim, marginTop: 10 }}>This code was deleted.</Text>
      </SafeAreaView>
    );
  }

  const td = getType(design.type);
  const size = Math.min(width - 90, 290);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Card theme={theme} style={{ alignItems: 'center', paddingVertical: 26 }}>
          <View
            style={{
              padding: 12,
              borderRadius: 26,
              backgroundColor: design.style.transparent ? theme.surfaceAlt : design.style.bg,
            }}
          >
            <QRCanvas content={design.content} style={design.style} size={size} radius={14} />
          </View>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', marginTop: 18 }}>
            {design.title}
          </Text>
          <Text style={{ color: theme.dim, fontSize: 12.5, marginTop: 4 }}>
            {td.name} · {getShape(design.style.shape).name} modules · {getEye(design.style.eye).name} eyes
          </Text>
        </Card>

        <Card theme={theme} style={{ marginTop: 16 }}>
          <Text style={{ color: theme.dim, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8 }}>
            ENCODED CONTENT
          </Text>
          <Text selectable style={{ color: theme.text, fontSize: 13.5, lineHeight: 20 }}>
            {design.content}
          </Text>
        </Card>

        <GradientButton
          theme={theme}
          label="Open in studio"
          icon="color-wand-outline"
          style={{ marginTop: 20 }}
          onPress={() => {
            openDesign(design);
            buzz('success');
            nav.navigate('Tabs', { screen: 'Create' });
          }}
        />
        <GhostButton
          theme={theme}
          label="Download SVG"
          icon="download-outline"
          style={{ marginTop: 10 }}
          onPress={async () => {
            const r = await exportSvg(design.content, design.style);
            setMsg(r === 'downloaded' ? 'SVG downloaded.' : 'SVG markup copied to clipboard.');
          }}
        />
        <GhostButton
          theme={theme}
          label="Copy content"
          icon="copy-outline"
          style={{ marginTop: 10 }}
          onPress={async () => {
            await Clipboard.setStringAsync(design.content);
            setMsg('Content copied to clipboard.');
          }}
        />
        <GhostButton
          theme={theme}
          label="Delete"
          icon="trash-outline"
          tone="danger"
          style={{ marginTop: 10 }}
          onPress={() => {
            removeDesign(design.id);
            buzz('success');
            nav.goBack();
          }}
        />

        {msg ? (
          <Text style={{ color: theme.good, textAlign: 'center', marginTop: 16, fontWeight: '700', fontSize: 13 }}>
            {msg}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
