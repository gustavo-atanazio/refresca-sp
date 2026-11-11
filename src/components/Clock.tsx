import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useNow from '@/hooks/useNow';
import { formatDate, formatTime } from '@/utils/format';

function Clock() {
  const now = useNow(1000);

  return (
    <View style={styles.container} accessibilityRole='timer'>
      <Text style={styles.date}>{formatDate(now)}</Text>
      <Text style={styles.time}>{formatTime(now)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
    elevation: 4,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)'
  },
  date: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small,
    fontVariant: ['tabular-nums']
  },
  time: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  }
});

export default Clock;