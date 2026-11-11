import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { ResourceStatus } from '@/types/resource';

type StatusViewProps = {
  status: ResourceStatus;
  error?: string | null;
  loadingMessage?: string;
  onRetry?: () => void;
  compact?: boolean
};

function StatusView({ status, error, loadingMessage = 'Carregando dados...', onRetry, compact = false }: StatusViewProps) {
  if (status === 'success') return null;

  return (
    <View style={[styles.container, compact && styles.compact]} accessibilityLiveRegion='polite'>
      {status === 'loading' ? (
        <>
          <ActivityIndicator size='large' color={COLORS.primary}/>
          <Text style={styles.message}>{loadingMessage}</Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons name='cloud-off-outline' size={48} color={COLORS.danger}/>
          <Text style={styles.title}>Dados indisponíveis</Text>
          <Text style={styles.message}>{error ?? 'Não foi possível carregar os dados.'}</Text>
          {onRetry && (
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              onPress={onRetry}
              accessibilityRole='button'>
              <MaterialCommunityIcons name='refresh' size={20} color='#FFFFFF'/>
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.xl
  },
  compact: {
    flex: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    boxShadow: '0 2px 10px rgba(15, 23, 42, 0.25)',
    elevation: 6,
    maxWidth: 360,
    width: '100%'
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    textAlign: 'center'
  },
  message: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
    textAlign: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: SPACING.lg,
    minHeight: 48
  },
  pressed: {
    opacity: 0.8
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.body,
    fontWeight: '700'
  }
});

export default StatusView;