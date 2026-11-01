import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import QRCanvas from '../components/QRCanvas';
import { Chip, EmptyState } from '../components/ui';
import { getType } from '../lib/content';
import { getShape } from '../lib/shapes';
import { useStudio } from '../lib/studio';
import { Design } from '../lib/store';

function when(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function SavedScreen() {
  const { theme, designs, buzz } = useStudio();
  const nav = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  const cats = useMemo(() => {
    const set = new Set(designs.map((d) => getType(d.type).name));
    return ['All', ...Array.from(set)];
  }, [designs]);

  const data = useMemo(
    () => (filter === 'All' ? designs : designs.filter((d) => getType(d.type).name === filter)),
    [designs, filter]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 650);
  }, []);

  const renderItem = ({ item }: { item: Design }) => {
    const td = getType(item.type);
    return (
      <Pressable
        onPress={() => {
          buzz();
          nav.navigate('Detail', { id: item.id });
        }}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View
          style={{
            padding: 6,
            borderRadius: 14,
            backgroundColor: item.style.transparent ? theme.surfaceAlt : item.style.bg,
          }}
        >
          <QRCanvas content={item.content} style={item.style} size={58} />
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ color: theme.text, fontSize: 15, fontWeight: '800' }}>
            {item.title || td.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 }}>
            <Ionicons name={td.icon as any} size={12} color={theme.dim} />
            <Text style={{ color: theme.dim, fontSize: 12 }}>
              {td.name} · {getShape(item.style.shape).name} · {when(item.createdAt)}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={17} color={theme.dim} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
          Collection
        </Text>
        <Text style={{ color: theme.dim, fontSize: 13, marginTop: 2 }}>
          {designs.length} saved {designs.length === 1 ? 'code' : 'codes'}
        </Text>
      </View>

      {designs.length > 1 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
          {cats.map((c) => (
            <Chip key={c} theme={theme} label={c} compact active={filter === c} onPress={() => setFilter(c)} />
          ))}
        </View>
      ) : null}

      <FlatList
        data={data}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.dim} />
        }
        ListEmptyComponent={
          <EmptyState
            theme={theme}
            icon="bookmark-outline"
            title="Nothing saved yet"
            body="Design a code on the Create tab and tap Save to keep it here with its shapes and colors."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
});
