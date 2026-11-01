import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '../lib/theme';

export function Card({
  theme,
  children,
  style,
}: {
  theme: Theme;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: theme.border,
          padding: 18,
          shadowColor: theme.shadow,
          shadowOpacity: theme.dark ? 0.5 : 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionTitle({
  theme,
  title,
  action,
  onAction,
}: {
  theme: Theme;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={{ color: theme.dim, fontSize: 12, fontWeight: '800', letterSpacing: 1.4 }}>
        {title.toUpperCase()}
      </Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ color: theme.accent, fontSize: 13, fontWeight: '700' }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({
  theme,
  label,
  icon,
  active,
  onPress,
  compact,
}: {
  theme: Theme;
  label: string;
  icon?: any;
  active?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: compact ? 12 : 14,
          paddingVertical: compact ? 8 : 10,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? 'transparent' : theme.border,
          backgroundColor: active ? theme.accent : theme.surfaceAlt,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={compact ? 14 : 16} color={active ? '#fff' : theme.dim} />
      ) : null}
      <Text
        style={{
          color: active ? '#fff' : theme.text,
          fontWeight: '700',
          fontSize: compact ? 12.5 : 13.5,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function GradientButton({
  theme,
  label,
  icon,
  onPress,
  colors,
  style,
}: {
  theme: Theme;
  label: string;
  icon?: any;
  onPress: () => void;
  colors?: string[];
  style?: ViewStyle;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const anim = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, friction: 6, tension: 180 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPressIn={() => anim(0.96)} onPressOut={() => anim(1)} onPress={onPress}>
        <LinearGradient
          colors={(colors as any) ?? [theme.accent, theme.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 16,
            borderRadius: 18,
          }}
        >
          {icon ? <Ionicons name={icon} size={18} color="#fff" /> : null}
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15.5 }}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export function GhostButton({
  theme,
  label,
  icon,
  onPress,
  tone,
  style,
}: {
  theme: Theme;
  label: string;
  icon?: any;
  onPress: () => void;
  tone?: 'default' | 'danger';
  style?: ViewStyle;
}) {
  const color = tone === 'danger' ? theme.bad : theme.text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 15,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: pressed ? theme.surfaceAlt : 'transparent',
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={color} /> : null}
      <Text style={{ color, fontWeight: '700', fontSize: 14.5 }}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  theme,
  label,
  ...props
}: { theme: Theme; label: string } & TextInputProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: theme.dim, fontSize: 12, fontWeight: '700', marginBottom: 7 }}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.dim}
        {...props}
        style={[
          {
            backgroundColor: theme.surfaceAlt,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 13,
            color: theme.text,
            fontSize: 15,
            minHeight: props.multiline ? 90 : undefined,
            textAlignVertical: props.multiline ? 'top' : 'center',
          },
          props.style as any,
        ]}
      />
    </View>
  );
}

export function Segmented({
  theme,
  options,
  value,
  onChange,
}: {
  theme: Theme;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.surfaceAlt,
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 11,
              alignItems: 'center',
              backgroundColor: active ? theme.surface : 'transparent',
              borderWidth: active ? 1 : 0,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: active ? theme.text : theme.dim, fontWeight: '700', fontSize: 13 }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Stepper({
  theme,
  label,
  value,
  onDec,
  onInc,
  display,
}: {
  theme: Theme;
  label: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  display?: string;
}) {
  return (
    <View style={styles.stepRow}>
      <Text style={{ color: theme.text, fontSize: 14.5, fontWeight: '600' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={onDec}
          style={{ padding: 7, borderRadius: 10, backgroundColor: theme.surfaceAlt }}
        >
          <Ionicons name="remove" size={16} color={theme.text} />
        </Pressable>
        <Text style={{ color: theme.dim, minWidth: 48, textAlign: 'center', fontWeight: '700' }}>
          {display ?? value}
        </Text>
        <Pressable
          onPress={onInc}
          style={{ padding: 7, borderRadius: 10, backgroundColor: theme.surfaceAlt }}
        >
          <Ionicons name="add" size={16} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

export function EmptyState({
  theme,
  icon,
  title,
  body,
}: {
  theme: Theme;
  icon: any;
  title: string;
  body: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 56, paddingHorizontal: 30 }}>
      <View
        style={{
          width: 78,
          height: 78,
          borderRadius: 26,
          backgroundColor: theme.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Ionicons name={icon} size={34} color={theme.dim} />
      </View>
      <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800', marginBottom: 7 }}>{title}</Text>
      <Text style={{ color: theme.dim, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
});
