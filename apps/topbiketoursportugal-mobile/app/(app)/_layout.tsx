import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

const TAB_ICON: Record<string, string> = {
  index: '🚵',
  route: '🗺️',
  elevation: '📈',
  sightseeing: '📍',
  support: '🆘',
};

export default function AppLayout() {
  const { colors, fonts } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>{TAB_ICON[route.name] ?? '•'}</Text>,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'My Trip' }} />
      <Tabs.Screen name="route" options={{ title: 'Route' }} />
      <Tabs.Screen name="elevation" options={{ title: 'Elevation' }} />
      <Tabs.Screen name="sightseeing" options={{ title: 'Sightseeing' }} />
      <Tabs.Screen name="support" options={{ title: 'Support' }} />
    </Tabs>
  );
}
