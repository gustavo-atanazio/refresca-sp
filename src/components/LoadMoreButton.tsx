import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';

type LoadMoreButtonProps = {
  onPress: () => void
};

function LoadMoreButton({ onPress }: LoadMoreButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel='Ver alertas anteriores'>
      <MaterialCommunityIcons name='chevron-down' size={22} color={COLORS.primary}/>
      <Text style={styles.text}>Ver anteriores</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.sm
  },
  pressed: {
    opacity: 0.7
  },
  text: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  }
});

export default LoadMoreButton;