import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import AlertListItem from '@/components/AlertListItem';
import LoadMoreButton from '@/components/LoadMoreButton';
import StatusView from '@/components/StatusView';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData from '@/hooks/useData';
import useNow from '@/hooks/useNow';
import usePagination from '@/hooks/usePagination';
import useSimulation from '@/hooks/useSimulation';

function Notifications() {
  const { sensors: sensorResource } = useData();
  const { alerts } = useSimulation();
  const now = useNow(1000);
  const { visibleItems, hasMore, loadMore } = usePagination(alerts);

  if (sensorResource.status !== 'success') {
    return (
      <StatusView
        status={sensorResource.status}
        error={sensorResource.error}
        loadingMessage='Carregando histórico de alertas...'
        onRetry={sensorResource.reload}/>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={visibleItems}
      keyExtractor={(item) => item.alertID}
      ListEmptyComponent={
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name='bell-outline' size={44} color={COLORS.textMuted}/>
          <Text style={styles.emptyTitle}>Nenhum alerta emitido</Text>
          <Text style={styles.emptyBody}>
            Nenhum alerta foi emitido até agora. Os sensores estão monitorando a temperatura em tempo real.
          </Text>
        </View>
      }
      ListFooterComponent={hasMore ? <LoadMoreButton onPress={loadMore}/> : undefined}
      renderItem={({ item }) => (
        <AlertListItem
          alert={item}
          now={now}
          onPress={(alert) =>
            router.push({ pathname: '/alerts/[alertID]', params: { alertID: alert.alertID } })
          }/>
      )}/>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center'
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    gap: SPACING.sm
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    textAlign: 'center'
  },
  emptyBody: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
    textAlign: 'center'
  }
});

export default Notifications;