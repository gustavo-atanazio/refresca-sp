import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import Refuge from '@/types/refuge';
import { formatDistance } from '@/utils/geo';

const REFUGE_TYPE_ICONS: Record<Refuge['type'], keyof typeof MaterialCommunityIcons.glyphMap> = {
  AGUA_E_SOMBRA: 'water-outline',
  BEBEDOURO: 'cup-water',
  TENDA_PREFEITURA: 'tent',
  PRACA_ARBORIZADA: 'tree-outline',
  CENTRO_CLIMATIZADO: 'snowflake'
};

const REFUGE_TYPE_LABELS: Record<Refuge['type'], string> = {
  AGUA_E_SOMBRA: 'Água e sombra',
  BEBEDOURO: 'Bebedouro',
  TENDA_PREFEITURA: 'Tenda da prefeitura',
  PRACA_ARBORIZADA: 'Praça arborizada',
  CENTRO_CLIMATIZADO: 'Centro climatizado'
};

type RefugeCardProps = {
  refuge: Refuge;
  distanceMeters: number;
  onPress: (refuge: Refuge) => void
};

function RefugeCard({ refuge, distanceMeters, onPress }: RefugeCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(refuge)}
      accessibilityRole='button'
      accessibilityLabel={`${refuge.name}, a ${formatDistance(distanceMeters)}`}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={REFUGE_TYPE_ICONS[refuge.type]} size={30} color={COLORS.primary}/>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{refuge.name}</Text>
        <Text style={styles.meta}>{REFUGE_TYPE_LABELS[refuge.type]}</Text>
        <Text style={styles.meta}>
          {refuge.address.streetName}, {refuge.address.number}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.distance}>{formatDistance(distanceMeters)}</Text>
        <View style={[styles.status, { backgroundColor: refuge.isOpen ? COLORS.success : COLORS.danger }]}>
          <Text style={styles.statusText}>{refuge.isOpen ? 'Aberto' : 'Fechado'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export { REFUGE_TYPE_ICONS, REFUGE_TYPE_LABELS };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md
  },
  pressed: {
    backgroundColor: '#E2E8F0'
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1
  },
  name: {
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
    gap: 6
  },
  distance: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});

export default RefugeCard;