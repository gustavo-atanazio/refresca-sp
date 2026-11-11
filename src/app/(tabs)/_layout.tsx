import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { COLORS, FONT_SIZES } from '@/constants/theme';
import useSimulation from '@/hooks/useSimulation';

function TabsLayout() {
  const { alerts } = useSimulation();
  const activeCount = alerts.filter((alert) => alert.active).length;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '700'
        },
        sceneStyle: {
          backgroundColor: COLORS.background
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          minHeight: 60
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.small,
          fontWeight: '600'
        }
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='map' size={size} color={String(color)}/>
          )
        }}/>
      <Tabs.Screen
        name='shelters'
        options={{
          title: 'Abrigos',
          headerTitle: 'Abrigos próximos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home-heart' size={size} color={String(color)}/>
          )
        }}/>
      <Tabs.Screen
        name='alerts'
        options={{
          title: 'Alertas',
          headerTitle: 'Alertas ativos',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.danger,
            color: '#FFFFFF',
            fontWeight: '700'
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='alert-circle' size={size} color={String(color)}/>
          )
        }}/>
    </Tabs>
  );
}

export default TabsLayout;