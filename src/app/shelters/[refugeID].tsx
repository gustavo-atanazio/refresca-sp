import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import MiniMap from '@/components/map/MiniMap';
import { REFUGE_TYPE_ICONS, REFUGE_TYPE_LABELS } from '@/components/RefugeCard';
import StatusView from '@/components/StatusView';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData, { combineResources } from '@/hooks/useData';
import { formatDistance, getDistanceMeters } from '@/utils/geo';

function ShelterDetails() {
  const { refugeID } = useLocalSearchParams<{ refugeID: string }>();
  const { refuges: refugeResource, userLocation } = useData();
  const pageStatus = combineResources(refugeResource, userLocation);

  if (pageStatus.status !== 'success' || !refugeResource.data || !userLocation.data) {
    return (
      <StatusView
        status={pageStatus.status}
        error={pageStatus.error}
        loadingMessage='Carregando detalhes do abrigo...'
        onRetry={pageStatus.reload}/>
    );
  }

  const refuge = refugeResource.data.find((item) => item.refugeID === refugeID);

  if (!refuge) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Abrigo não encontrado.</Text>
      </View>
    );
  }

  const distance = getDistanceMeters(userLocation.data.coordinates, refuge.coordinates);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.map}>
        <MiniMap
          dom={{ style: { width: '100%', height: 240 } }}
          targetCoordinates={refuge.coordinates}
          userCoordinates={userLocation.data.coordinates}
          variant='refuge'/>
      </View>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons name={REFUGE_TYPE_ICONS[refuge.type]} size={34} color={COLORS.primary}/>
        <View style={styles.titleText}>
          <Text style={styles.name}>{refuge.name}</Text>
          <Text style={styles.type}>{REFUGE_TYPE_LABELS[refuge.type]}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: refuge.isOpen ? COLORS.success : COLORS.danger }]}>
          <Text style={styles.statusText}>{refuge.isOpen ? 'Aberto' : 'Fechado'}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <InfoRow icon='map-marker' text={`${refuge.address.streetName}, ${refuge.address.number} - ${refuge.address.neighborhood}`}/>
        <InfoRow icon='mailbox-outline' text={`CEP ${refuge.address.cep}`}/>
        <InfoRow icon='walk' text={`${formatDistance(distance)} de você`}/>
        <InfoRow icon='clock-outline' text={refuge.openingHours}/>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Comodidades</Text>
        <View style={styles.amenities}>
          {refuge.amenities.map((amenity) => (
            <View key={amenity} style={styles.amenity}>
              <MaterialCommunityIcons name='check-circle' size={18} color={COLORS.success}/>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.description}>{refuge.description}</Text>
      </View>
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
    justifyContent: 'center'
  },
  notFoundText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title
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
    flex: 1
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZES.large,
    fontWeight: '700'
  },
  type: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZES.small
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
  amenities: {
    gap: SPACING.sm
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },
  amenityText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body
  },
  description: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
    lineHeight: 24
  }
});

export default ShelterDetails;