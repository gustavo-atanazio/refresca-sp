import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import RiskBadge from '@/components/RiskBadge';
import { ALERT_LEVELS } from '@/constants/alertLevels';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import Alert from '@/types/alert';
import { formatTemperature, formatTimeAgo } from '@/utils/format';
import { formatDistance } from '@/utils/geo';

type AlertListItemProps = {
  alert: Alert;
  now: Date;
  distanceMeters?: number;
  onPress: (alert: Alert) => void
};

function AlertListItem({ alert, now, distanceMeters, onPress }: AlertListItemProps) {
  const color = ALERT_LEVELS[alert.riskLevel].color;
  const distanceText = distanceMeters !== undefined ? ` · ${formatDistance(distanceMeters)}` : '';

  return (
    <Pressable
      style={[styles.container, { borderLeftColor: color }, !alert.active && styles.inactive]}
      onPress={() => onPress(alert)}
      accessibilityRole='button'
      accessibilityLabel={`Alerta ${ALERT_LEVELS[alert.riskLevel].label} em ${alert.address.streetName}`}>
      <MaterialCommunityIcons name='alert-circle' size={30} color={color}/>
      <View style={styles.info}>
        <Text style={styles.street} numberOfLines={1}>
          {alert.address.streetName}, {alert.address.number}
        </Text>
        <Text style={styles.meta}>
          {alert.address.neighborhood}
          {distanceText} · {formatTimeAgo(alert.emittedAt, now)}
          {alert.active ? '' : ' · encerrado'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.temperature, { color }]}>{formatTemperature(alert.temperature)}</Text>
        <RiskBadge level={alert.riskLevel}/>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 6,
    padding: SPACING.md
  },
  inactive: {
    opacity: 0.55
  },
  info: {
    flex: 1
  },
  street: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small
  },
  right: {
    alignItems: 'flex-end',
    gap: 4
  },
  temperature: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700'
  }
});

export default AlertListItem;