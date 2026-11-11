import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

type RecentAlertsButtonProps = {
  activeCount: number;
  onPress: () => void
};

function RecentAlertsButton({ activeCount, onPress }: RecentAlertsButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={`Alertas recentes, ${activeCount} ativos. Abrir notificações`}>
      <MaterialCommunityIcons name='bell-ring-outline' size={22} color={COLORS.text}/>
      <Text style={styles.title}>Alertas recentes</Text>
      <View style={[styles.count, activeCount === 0 && styles.countEmpty]}>
        <Text style={styles.countText}>{activeCount}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    minHeight: 44,
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
    elevation: 4
  },
  pressed: {
    opacity: 0.8
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.small,
    fontWeight: '700'
  },
  count: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6
  },
  countEmpty: {
    backgroundColor: COLORS.textMuted
  },
  countText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  }
});

export default RecentAlertsButton;