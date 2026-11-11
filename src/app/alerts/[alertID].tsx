import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import MiniMap from '@/components/map/MiniMap';
import RiskBadge from '@/components/RiskBadge';
import StatusView from '@/components/StatusView';
import { ALERT_LEVELS } from '@/constants/alertLevels';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData, { combineResources } from '@/hooks/useData';
import useSimulation from '@/hooks/useSimulation';
import { affectsUser } from '@/utils/alerts';
import { formatDateTime, formatTemperature } from '@/utils/format';
import { formatDistance, getDistanceMeters } from '@/utils/geo';

function AlertDetails() {
  const { alertID } = useLocalSearchParams<{ alertID: string }>();
  const { sensors: sensorResource, userLocation } = useData();
  const { alerts, sensors } = useSimulation();
  const pageStatus = combineResources(sensorResource, userLocation);

  if (pageStatus.status !== 'success' || !userLocation.data) {
    return (
      <StatusView
        status={pageStatus.status}
        error={pageStatus.error}
        loadingMessage='Carregando detalhes do alerta...'
        onRetry={pageStatus.reload}/>
    );
  }

  const alert = alerts.find((item) => item.alertID === alertID);

  if (!alert) {
    return (
      <View style={styles.notFound}>
        <MaterialCommunityIcons name='alert-circle-outline' size={48} color={COLORS.textMuted}/>
        <Text style={styles.notFoundText}>Alerta não encontrado.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityRole='button'>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const sensor = sensors.find((item) => item.sensorID === alert.sensorID);
  const level = ALERT_LEVELS[alert.riskLevel];
  const distance = getDistanceMeters(userLocation.data.coordinates, alert.coordinates);
  const isUserAffected = affectsUser(
    alert,
    userLocation.data.coordinates,
    userLocation.data.affectedRadiusMeters
  );
  const previousLabel = alert.previousRiskLevel
    ? ALERT_LEVELS[alert.previousRiskLevel].label
    : 'Normal';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.map}>
        <MiniMap
          dom={{ style: { width: '100%', height: 240 } }}
          targetCoordinates={alert.coordinates}
          userCoordinates={userLocation.data.coordinates}
          variant='alert'
          targetColor={level.color}/>
      </View>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name='alert-circle' size={36} color={level.color}/>
        <View style={styles.titleText}>
          <Text style={styles.name}>{sensor?.name ?? alert.address.neighborhood}</Text>
          <View style={styles.badges}>
            <RiskBadge level={alert.riskLevel}/>
            <View style={[styles.status, { backgroundColor: alert.active ? COLORS.danger : COLORS.textMuted }]}>
              <Text style={styles.statusText}>{alert.active ? 'Ativo' : 'Encerrado'}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.temperature, { color: level.color }]}>
          {formatTemperature(alert.temperature)}
        </Text>
      </View>
      <View style={styles.card}>
        <InfoRow
          icon='map-marker'
          text={`${alert.address.streetName}, ${alert.address.number} - ${alert.address.neighborhood}`}/>
        <InfoRow icon='mailbox-outline' text={`CEP ${alert.address.cep}`}/>
        <InfoRow icon='walk' text={`${formatDistance(distance)} de você`}/>
        <InfoRow icon='clock-outline' text={`Emitido em ${formatDateTime(alert.emittedAt)}`}/>
        <InfoRow icon='thermometer' text={`Temperatura no alerta: ${formatTemperature(alert.temperature)}`}/>
        {sensor && (
          <InfoRow icon='thermometer-lines' text={`Temperatura atual no sensor: ${formatTemperature(sensor.temperature)}`}/>
        )}
        <InfoRow icon='swap-vertical' text={`Nível anterior: ${previousLabel}`}/>
        <InfoRow icon='chip' text={`Sensor ${alert.sensorID} · Alerta ${alert.alertID}`}/>
      </View>
      <View style={[styles.card, { borderColor: level.color }]}>
        <Text style={styles.sectionTitle}>Recomendação</Text>
        <Text style={styles.recommendation}>{alert.recommendation}</Text>
      </View>
      {isUserAffected ? (
        <Pressable
          style={({ pressed }) => [styles.shelterButton, pressed && styles.pressed]}
          onPress={() => router.push({ pathname: '/shelters', params: { alertID: alert.alertID } })}
          accessibilityRole='button'>
          <MaterialCommunityIcons name='home-heart' size={22} color='#FFFFFF'/>
          <Text style={styles.shelterButtonText}>Buscar abrigo próximo</Text>
        </Pressable>
      ) : (
        <View style={styles.noticeCard}>
          <MaterialCommunityIcons name='information-outline' size={22} color={COLORS.textMuted}/>
          <Text style={styles.noticeText}>
            {alert.active
              ? 'Este alerta não afeta sua localização atual.'
              : 'Este alerta já foi encerrado.'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

type InfoRowProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string
};

function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={24} color={COLORS.textMuted}/>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center'
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.xl
  },
  notFoundText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700'
  },
  backButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  },
  map: {
    height: 240,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  titleText: {
    flex: 1,
    gap: 6
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    fontWeight: '700'
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  temperature: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700'
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.body
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700'
  },
  recommendation: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    lineHeight: 24
  },
  shelterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: SPACING.lg
  },
  pressed: {
    opacity: 0.8
  },
  shelterButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md
  },
  noticeText: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body
  }
});

export default AlertDetails;