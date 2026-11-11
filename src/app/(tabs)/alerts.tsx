import { Slider } from '@expo/ui/community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import AlertListItem from '@/components/AlertListItem';
import LoadMoreButton from '@/components/LoadMoreButton';
import StatusView from '@/components/StatusView';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData, { combineResources } from '@/hooks/useData';
import useNow from '@/hooks/useNow';
import usePagination from '@/hooks/usePagination';
import useSimulation from '@/hooks/useSimulation';
import { getDistanceMeters } from '@/utils/geo';

const MIN_RADIUS_KM = 1;
const MAX_RADIUS_KM = 15;
const DEFAULT_RADIUS_KM = 5;

function ActiveAlerts() {
  const { sensors: sensorResource, userLocation } = useData();
  const { alerts } = useSimulation();
  const now = useNow(1000);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const pageStatus = combineResources(sensorResource, userLocation);

  const filteredAlerts = useMemo(() => {
    if (!userLocation.data) return [];

    const maxMeters = radiusKm * 1000;

    return alerts
      .filter((alert) => alert.active)
      .map((alert) => ({
        alert,
        distanceMeters: getDistanceMeters(userLocation.data!.coordinates, alert.coordinates)
      }))
      .filter((item) => item.distanceMeters <= maxMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [alerts, userLocation.data, radiusKm]);

  const { visibleItems, hasMore, loadMore } = usePagination(filteredAlerts);

  if (pageStatus.status !== 'success') {
    return (
      <StatusView
        status={pageStatus.status}
        error={pageStatus.error}
        loadingMessage='Carregando alertas ativos...'
        onRetry={pageStatus.reload}/>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={visibleItems}
      keyExtractor={(item) => item.alert.alertID}
      ListHeaderComponent={
        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <MaterialCommunityIcons name='map-marker-radius' size={24} color={COLORS.primary}/>
            <Text style={styles.filterTitle}>Raio de alcance</Text>
            <Text style={styles.filterValue}>{radiusKm} km</Text>
          </View>
          <Text style={styles.filterSubtitle}>
            Mostrando alertas ativos em até {radiusKm} km da sua posição ({filteredAlerts.length})
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={MIN_RADIUS_KM}
            maximumValue={MAX_RADIUS_KM}
            step={1}
            value={radiusKm}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.border}
            thumbTintColor={COLORS.primary}
            onValueChange={(value) => setRadiusKm(Math.round(value))}
            accessibilityLabel='Ajustar raio de busca de alertas em quilômetros'/>
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>{MIN_RADIUS_KM} km</Text>
            <Text style={styles.rangeText}>{MAX_RADIUS_KM} km</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name='check-circle-outline' size={44} color={COLORS.success}/>
          <Text style={styles.emptyTitle}>Nenhum alerta ativo neste raio</Text>
          <Text style={styles.emptyBody}>
            Não há alertas ativos em até {radiusKm} km de você no momento. Aumente o raio acima para verificar regiões mais distantes.
          </Text>
        </View>
      }
      ListFooterComponent={hasMore ? <LoadMoreButton onPress={loadMore}/> : undefined}
      renderItem={({ item }) => (
        <AlertListItem
          alert={item.alert}
          now={now}
          distanceMeters={item.distanceMeters}
          onPress={(alert) =>
            router.push({ pathname: '/alerts/[alertID]', params: { alertID: alert.alertID } })
          }/>
      )}/>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center'
  },
  filterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.xs,
    marginBottom: SPACING.xs
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  filterTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700'
  },
  filterValue: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.title,
    fontWeight: '700'
  },
  filterSubtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: SPACING.xs
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rangeText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    gap: SPACING.sm
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    textAlign: 'center'
  },
  emptyBody: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
    textAlign: 'center'
  }
});

export default ActiveAlerts;