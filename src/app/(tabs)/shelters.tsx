import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import RefugeCard from '@/components/RefugeCard';
import RiskBadge from '@/components/RiskBadge';
import StatusView from '@/components/StatusView';
import { ALERT_LEVELS } from '@/constants/alertLevels';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData, { combineResources } from '@/hooks/useData';
import useSimulation from '@/hooks/useSimulation';
import { getDistanceMeters } from '@/utils/geo';

function Shelters() {
  const { alertID } = useLocalSearchParams<{ alertID?: string }>();
  const { refuges: refugeResource, userLocation } = useData();
  const { alerts } = useSimulation();
  const pageStatus = combineResources(refugeResource, userLocation);
  const alert = alerts.find((item) => item.alertID === alertID);

  const refuges = useMemo(() => {
    if (!refugeResource.data || !userLocation.data) return [];

    return refugeResource.data
      .map((refuge) => ({
        refuge,
        distanceMeters: getDistanceMeters(userLocation.data!.coordinates, refuge.coordinates)
      }))
      .sort((a, b) => {
        if (a.refuge.isOpen !== b.refuge.isOpen) return a.refuge.isOpen ? -1 : 1;
        return a.distanceMeters - b.distanceMeters;
      });
  }, [refugeResource.data, userLocation.data]);

  if (pageStatus.status !== 'success') {
    return (
      <StatusView
        status={pageStatus.status}
        error={pageStatus.error}
        loadingMessage='Carregando abrigos próximos...'
        onRetry={pageStatus.reload}/>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={refuges}
      keyExtractor={(item) => item.refuge.refugeID}
      ListHeaderComponent={
        alert ? (
          <View style={[styles.banner, { borderColor: ALERT_LEVELS[alert.riskLevel].color }]}>
            <MaterialCommunityIcons
              name='alert-circle'
              size={32}
              color={ALERT_LEVELS[alert.riskLevel].color}/>
            <View style={styles.bannerText}>
              <RiskBadge level={alert.riskLevel}/>
              <Text style={styles.bannerTitle}>
                {alert.address.streetName}, {alert.address.number}
              </Text>
              <Text style={styles.bannerBody}>{alert.recommendation}</Text>
            </View>
            <Pressable
              onPress={() => router.setParams({ alertID: undefined })}
              accessibilityLabel='Fechar aviso do alerta'
              hitSlop={8}>
              <MaterialCommunityIcons name='close' size={22} color={COLORS.textMuted}/>
            </Pressable>
          </View>
        ) : undefined
      }
      renderItem={({ item }) => (
        <RefugeCard
          refuge={item.refuge}
          distanceMeters={item.distanceMeters}
          onPress={(refuge) =>
            router.push({ pathname: '/shelters/[refugeID]', params: { refugeID: refuge.refugeID } })
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
  banner: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm
  },
  bannerText: {
    flex: 1,
    gap: 4
  },
  bannerTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  },
  bannerBody: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body
  }
});

export default Shelters;