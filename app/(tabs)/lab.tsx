import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useLabStore } from '@/store/labStore';
import { useSeedStore } from '@/store/seedStore';
import { SearchBar } from '@/components/SearchBar';
import { CrossCard } from '@/components/CrossCard';
import { TabHeader } from '@/components/TabHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Cross } from '@/types';
import { colors } from '@/constants/colors';

export default function LabScreen() {
  const insets = useSafeAreaInsets();
  const { crosses } = useLabStore();
  const { seeds } = useSeedStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusIndex, setSelectedStatusIndex] = useState(0);

  const statusOptions = ['All', 'Testing', 'Selected', 'Archived'];

  const filteredCrosses = useMemo(() => {
    let filtered = crosses;
    
    // Filter by status if not "All"
    if (selectedStatusIndex > 0) {
      const status = statusOptions[selectedStatusIndex].toLowerCase();
      filtered = filtered.filter(cross => cross.status === status);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cross) =>
          cross.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [crosses, selectedStatusIndex, searchQuery]);

  const getStrainName = (seedId: string) => {
    const seed = seeds.find(s => s.id === seedId);
    return seed ? seed.strain : 'Unknown';
  };

  const handleCrossPress = (cross: Cross) => {
    router.push(`/cross/${cross.id}`);
  };

  const handleAddPress = () => {
    router.push('/add-cross');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabHeader title="Breeder's Lab" onAdd={handleAddPress} />
      
      <SearchBar 
        placeholder="Search crosses..."
        onSearch={setSearchQuery} 
      />
      
      <SegmentedControl
        segments={statusOptions}
        selectedIndex={selectedStatusIndex}
        onChange={setSelectedStatusIndex}
      />

      <FlatList
        data={filteredCrosses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CrossCard 
            cross={item} 
            motherName={getStrainName(item.mother)}
            fatherName={getStrainName(item.father)}
            onPress={handleCrossPress} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No crosses found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first cross</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});