import { StyleSheet, Text, View } from 'react-native';

import { ALERT_LEVELS } from '@/constants/alertLevels';
import RiskLevel from '@/types/riskLevel';

type RiskBadgeProps = {
  level: RiskLevel
};

function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: ALERT_LEVELS[level].color }]}>
      <Text style={styles.text}>{ALERT_LEVELS[level].label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});

export default RiskBadge;