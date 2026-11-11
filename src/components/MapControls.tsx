import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/theme';

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void
};

type ControlButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void
};

function ControlButton({ icon, label, onPress }: ControlButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={label}>
      <MaterialCommunityIcons name={icon} size={26} color={COLORS.text}/>
    </Pressable>
  );
}

function MapControls({ onZoomIn, onZoomOut, onRecenter }: MapControlsProps) {
  return (
    <View style={styles.container}>
      <ControlButton icon='plus' label='Aumentar zoom' onPress={onZoomIn}/>
      <ControlButton icon='minus' label='Diminuir zoom' onPress={onZoomOut}/>
      <ControlButton icon='crosshairs-gps' label='Centralizar na minha localização' onPress={onRecenter}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.25)'
  },
  pressed: {
    backgroundColor: '#E2E8F0'
  }
});

export default MapControls;