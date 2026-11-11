import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/theme';
import DataProvider from '@/contexts/DataContext';
import SimulationProvider from '@/contexts/SimulationContext';

function RootLayout() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <SimulationProvider>
          <StatusBar style='dark'/>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: COLORS.surface
              },
              headerTintColor: COLORS.text,
              headerTitleStyle: {
                fontWeight: '700'
              },
              contentStyle: {
                backgroundColor: COLORS.background
              }
            }}>
            <Stack.Screen
              name='(tabs)'
              options={{
                headerShown: false,
                title: 'Refresca SP'
              }}/>
            <Stack.Screen
              name='alerts/[alertID]'
              options={{
                headerShown: true,
                title: 'Detalhes do alerta',
                headerBackTitle: 'Voltar'
              }}/>
            <Stack.Screen
              name='shelters/[refugeID]'
              options={{
                headerShown: true,
                title: 'Detalhes do abrigo',
                headerBackTitle: 'Abrigos'
              }}/>
            <Stack.Screen
              name='notifications'
              options={{
                headerShown: true,
                title: 'Notificações',
                headerBackTitle: 'Mapa'
              }}/>
          </Stack>
        </SimulationProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;