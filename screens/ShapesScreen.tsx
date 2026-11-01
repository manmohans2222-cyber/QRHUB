import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCanvas, { EyePreview, ShapePreview } from '../components/QRCanvas';
import { Chip, Segmented } from '../components/ui';
import { EMOJI_PICKER, EYES, SHAPES, SHAPE_CATEGORIES, ShapeDef, getShape } from '../lib/shapes';
import { useStudio } from '../lib/studio';

type Tab = 'modules' | 'eyes' | 'badge';

export default function ShapesScreen() {
  const { theme, style, patchStyle, content, buzz } = useStudio();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>('modules');
  const [cat, setCat] = useState<string>('All');
  const [query, setQuery] = useState('');

  const cols = width > 720 ? 5 : width > 520 ? 4 : 3;
  const gap = 12;
  const tileSize = (width - 40 - gap * (cols - 1)) / cols;

  const shapes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHAPES.filter((s) => {
      if (cat !== 'All' && s.category !== cat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags ?? '').toLowerCase().includes(q)
      );
    });
  }, [cat, query]);

  const previewColor = style.gradient ? style.fgA : style.fgA;

  const renderShape = ({ item }: { item: ShapeDef }) => {
    const active = style.shape === item.id;
    return (
      <Pressable
        onPress={() => {
          buzz();
          patchStyle({ shape: item.id });
        }}
        style={[
          styles.tile,
          {
            width: tileSize,
            backgroundColor: theme.surface,
            borderColor: active ? theme.accent : theme.border,
            borderWidth: active ? 2 : 1,
          },
        ]}
      >
        <View
          style={{
            backgroundColor: theme.dark ? '#FFFFFF' : theme.surfaceAlt,
            borderRadius: 12,
            padding: 8,
          }}
        >
          <ShapePreview
            shapeId={item.id}
            size={tileSize * 0.5}
            color={theme.dark ? '#14141F' : theme.text}
            bg={theme.dark ? '#FFFFFF' : theme.surfaceAlt}
          />
        </View>
        <Text numberOfLines={1} style={{ color: theme.text, fontSize: 11.5, fontWeight: '700', marginTop: 8 }}>
          {item.name}
        </Text>
        <Text style={{ color: theme.dim, fontSize: 9.5, fontWeight: '700', letterSpacing: 0.6 }}>
          {item.category.toUpperCase()}
        </Text>
        {active ? (
          <View style={[styles.check, { backgroundColor: theme.accent }]}>
            <Ionicons name="checkmark" size={11} color="#fff" />
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
            Shape library
          </Text>
          <Text style={{ color: theme.dim, fontSize: 13, marginTop: 2 }}>
            {SHAPES.length} module shapes · {EYES.length} eye styles
          </Text>
        </View>
        <View
          style={{
            padding: 7,
            borderRadius: 16,
            backgroundColor: style.transparent ? theme.surfaceAlt : style.bg,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <QRCanvas content={content} style={style} size={62} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Segmented
          theme={theme}
          value={tab}
          onChange={(v) => setTab(v as Tab)}
          options={[
            { id: 'modules', label: 'Modules' },
            { id: 'eyes', label: 'Eyes' },
            { id: 'badge', label: 'Badge' },
          ]}
        />
      </View>

      {tab === 'modules' ? (
        <>
          <View style={[styles.search, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
            <Ionicons name="search" size={16} color={theme.dim} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search cat, heart, rocket…"
              placeholderTextColor={theme.dim}
              style={{ flex: 1, color: theme.text, fontSize: 14.5, paddingVertical: 0 }}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={theme.dim} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }}
            style={{ flexGrow: 0 }}
          >
            {['All', ...SHAPE_CATEGORIES].map((c) => (
              <Chip
                key={c}
                theme={theme}
                label={c}
                compact
                active={cat === c}
                onPress={() => {
                  buzz();
                  setCat(c);
                }}
              />
            ))}
          </ScrollView>

          <FlatList
            data={shapes}
            key={cols}
            keyExtractor={(s) => s.id}
            numColumns={cols}
            renderItem={renderShape}
            columnWrapperStyle={{ gap }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 50 }}>
                <Ionicons name="search-outline" size={30} color={theme.dim} />
                <Text style={{ color: theme.dim, marginTop: 10 }}>No shapes match “{query}”.</Text>
              </View>
            }
          />
        </>
      ) : null}

      {tab === 'eyes' ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
          <Text style={{ color: theme.dim, fontSize: 13, marginBottom: 16, lineHeight: 19 }}>
            The three corner squares guide the scanner. Keep them bold — these styles stay readable.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {EYES.map((e) => {
              const active = style.eye === e.id;
              return (
                <Pressable
                  key={e.id}
                  onPress={() => {
                    buzz();
                    patchStyle({ eye: e.id });
                  }}
                  style={[
                    styles.tile,
                    {
                      width: tileSize,
                      backgroundColor: theme.surface,
                      borderColor: active ? theme.accent : theme.border,
                      borderWidth: active ? 2 : 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      backgroundColor: theme.dark ? '#FFFFFF' : theme.surfaceAlt,
                      borderRadius: 12,
                      padding: 8,
                    }}
                  >
                    <EyePreview
                      eyeId={e.id}
                      size={tileSize * 0.5}
                      color={theme.dark ? '#14141F' : theme.text}
                      bg={theme.dark ? '#FFFFFF' : theme.surfaceAlt}
                    />
                  </View>
                  <Text style={{ color: theme.text, fontSize: 11.5, fontWeight: '700', marginTop: 8 }}>
                    {e.name}
                  </Text>
                  {active ? (
                    <View style={[styles.check, { backgroundColor: theme.accent }]}>
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : null}

      {tab === 'badge' ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
          <Text style={{ color: theme.dim, fontSize: 13, marginBottom: 16, lineHeight: 19 }}>
            Drop an emoji in the middle of your code. High error correction keeps it scannable.
          </Text>
          <Pressable
            onPress={() => {
              buzz();
              patchStyle({ badge: null });
            }}
            style={[
              styles.noBadge,
              {
                backgroundColor: theme.surface,
                borderColor: style.badge === null ? theme.accent : theme.border,
                borderWidth: style.badge === null ? 2 : 1,
              },
            ]}
          >
            <Ionicons name="ban-outline" size={17} color={theme.text} />
            <Text style={{ color: theme.text, fontWeight: '700' }}>No badge</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
            {EMOJI_PICKER.map((e) => {
              const active = style.badge === e;
              return (
                <Pressable
                  key={e}
                  onPress={() => {
                    buzz();
                    patchStyle({ badge: e });
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? theme.accent + '22' : theme.surface,
                    borderWidth: active ? 2 : 1,
                    borderColor: active ? theme.accent : theme.border,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{e}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: theme.dim, fontSize: 12, marginTop: 22, marginBottom: 10, fontWeight: '800', letterSpacing: 1.2 }}>
            USE AN EMOJI AS THE MODULES
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {EMOJI_PICKER.slice(0, 60).map((e) => {
              const id = 'emoji:' + e;
              const active = style.shape === id;
              return (
                <Pressable
                  key={'m' + e}
                  onPress={() => {
                    buzz();
                    patchStyle({ shape: id });
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? theme.accent + '22' : theme.surfaceAlt,
                    borderWidth: active ? 2 : 1,
                    borderColor: active ? theme.accent : theme.border,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={{ color: theme.dim, fontSize: 12, marginTop: 14, lineHeight: 18 }}>
            Currently using: {getShape(style.shape).name} modules{' '}
            {style.shape.startsWith('emoji:') ? '(emoji mode)' : ''}
          </Text>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  tile: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
});
