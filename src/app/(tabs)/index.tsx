import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Clock from '@/components/Clock';
import LevelLegend from '@/components/LevelLegend';
import MapControls from '@/components/MapControls';
import HeatMap from '@/components/map/HeatMap';
import RecentAlertsButton from '@/components/RecentAlertsButton';
import SearchBar from '@/components/SearchBar';
import StatusView from '@/components/StatusView';
import { COLORS } from '@/constants/theme';
import useData, { combineResources } from '@/hooks/useData';
import useSimulation from '@/hooks/useSimulation';
import Coordinates from '@/types/coordinates';
import MapCommand from '@/types/mapCommand';

function MapScreen() {
  const insets = useSafeAreaInsets();
  const { sensors: sensorResource, userLocation } = useData();
  const { sensors, alerts } = useSimulation();
  const [command, setCommand] = useState<MapCommand | null>(null);
  const mapStatus = combineResources(sensorResource, userLocation);
  const activeCount = alerts.filter((alert) => alert.active).length;

  const sendCommand = useCallback((next: Omit<MapCommand, 'nonce'>) => {
    setCommand({ ...next, nonce: Date.now() + Math.random() });
  }, []);

  const handleFindShelter = useCallback(async (alertID: string) => {
    router.push({ pathname: '/shelters', params: { alertID } });
  }, []);

  const handleOpenAlert = useCallback(async (alertID: string) => {
    router.push({ pathname: '/alerts/[alertID]', params: { alertID } });
  }, []);

  const handleSelectPlace = (coordinates: Coordinates) => {
    sendCommand({ type: 'flyTo', coordinates });
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        {mapStatus.status === 'success' && userLocation.data && (
          <HeatMap
            dom={{ style: { width: '100%', height: '100%' } }}
            sensors={sensors}
            alerts={alerts}
            userCoordinates={userLocation.data.coordinates}
            affectedRadiusMeters={userLocation.data.affectedRadiusMeters}
            command={command}
            onFindShelter={handleFindShelter}
            onOpenAlert={handleOpenAlert}/>
        )}
      </View>
      {mapStatus.status !== 'success' && (
        <View style={styles.statusOverlay} pointerEvents='box-none'>
          <StatusView
            status={mapStatus.status}
            error={mapStatus.error}
            loadingMessage='Carregando mapa e sensores...'
            onRetry={mapStatus.reload}
            compact/>
        </View>
      )}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents='box-none'>
        <SearchBar onSelect={handleSelectPlace}/>
        <Clock/>
      </View>
      <View style={[styles.recentAlerts, { top: insets.top + 68 }]} pointerEvents='box-none'>
        <RecentAlertsButton
          activeCount={activeCount}
          onPress={() => router.push('/notifications')}/>
      </View>
      {mapStatus.status === 'success' && (
        <View style={[styles.side, { top: insets.top + 68 }]} pointerEvents='box-none'>
          <MapControls
            onZoomIn={() => sendCommand({ type: 'zoomIn' })}
            onZoomOut={() => sendCommand({ type: 'zoomOut' })}
            onRecenter={() => sendCommand({ type: 'recenter' })}/>
        </View>
      )}
      <View style={styles.legend} pointerEvents='box-none'>
        <LevelLegend/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  statusOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    gap: 8,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
    zIndex: 20
  },
  recentAlerts: {
    position: 'absolute',
    left: 12,
    zIndex: 10
  },
  side: {
    position: 'absolute',
    right: 12,
    zIndex: 10
  },
  legend: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    zIndex: 10
  }
});

export default MapScreen;