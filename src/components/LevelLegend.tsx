import { StyleSheet, Text, View } from 'react-native';

import { ALERT_LEVELS, NORMAL_COLOR, RISK_LEVELS_ORDER } from '@/constants/alertLevels';
import { COLORS } from '@/constants/theme';

function LevelLegend() {
  return (
    <View style={styles.container} accessibilityLabel='Legenda dos níveis de alerta'>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: NORMAL_COLOR }]}/>
        <Text style={styles.text}>Normal</Text>
      </View>
      {RISK_LEVELS_ORDER.map((level) => (
        <View key={level} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: ALERT_LEVELS[level].color }]}/>
          <Text style={styles.text}>{ALERT_LEVELS[level].label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
    elevation: 4
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  text: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600'
  }
});

export default LevelLegend;