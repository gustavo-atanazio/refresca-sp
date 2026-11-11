import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import useData from '@/hooks/useData';
import Coordinates from '@/types/coordinates';
import { normalizeText } from '@/utils/text';

const MAX_RESULTS = 5;

type SearchBarProps = {
  onSelect: (coordinates: Coordinates) => void
};

function SearchBar({ onSelect }: SearchBarProps) {
  const { places } = useData();
  const [query, setQuery] = useState('');
  const available = places.status === 'success' && places.data !== null;

  const results = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery || !places.data) return [];

    return places.data.filter((place) =>
      normalizeText(`${place.name} ${place.description}`).includes(normalizedQuery)
    ).slice(0, MAX_RESULTS);
  }, [query, places.data]);

  const showEmpty = available && query.trim().length > 0 && results.length === 0;

  let placeholder = 'Buscar local em São Paulo';

  if (places.status === 'loading') placeholder = 'Carregando locais...';
  else if (places.status === 'error') placeholder = 'Busca indisponível';

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <MaterialCommunityIcons
          name={places.status === 'error' ? 'magnify-close' : 'magnify'}
          size={24}
          color={places.status === 'error' ? COLORS.danger : COLORS.textMuted}/>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          editable={available}
          placeholder={placeholder}
          placeholderTextColor={places.status === 'error' ? COLORS.danger : COLORS.textMuted}
          accessibilityLabel='Buscar localização'
          returnKeyType='search'/>
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} accessibilityLabel='Limpar busca' hitSlop={8}>
            <MaterialCommunityIcons name='close-circle' size={22} color={COLORS.textMuted}/>
          </Pressable>
        )}
        {places.status === 'error' && (
          <Pressable onPress={places.reload} accessibilityLabel='Tentar carregar os locais novamente' hitSlop={8}>
            <MaterialCommunityIcons name='refresh' size={24} color={COLORS.primary}/>
          </Pressable>
        )}
      </View>
      {(results.length > 0 || showEmpty) && (
        <View style={styles.results}>
          {results.map((place) => (
            <Pressable
              key={place.placeID}
              style={styles.result}
              onPress={() => {
                onSelect(place.coordinates);
                setQuery('');
              }}>
              <MaterialCommunityIcons name='map-marker-outline' size={22} color={COLORS.primary}/>
              <View style={styles.resultText}>
                <Text style={styles.resultName}>{place.name}</Text>
                <Text style={styles.resultDescription}>{place.description}</Text>
              </View>
            </Pressable>
          ))}
          {showEmpty && <Text style={styles.empty}>Nenhum local encontrado.</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    zIndex: 10
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 4,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)'
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    paddingVertical: SPACING.sm,
    outlineWidth: 0
  },
  results: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
    overflow: 'hidden'
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md
  },
  resultText: {
    flex: 1
  },
  resultName: {
    color: COLORS.text,
    fontSize: FONT_SIZES.body,
    fontWeight: '600'
  },
  resultDescription: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.small
  },
  empty: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.body,
    padding: SPACING.md
  }
});

export default SearchBar;