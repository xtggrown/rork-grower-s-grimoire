import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGrowStore } from '@/store/growStore';
import { SearchBar } from '@/components/SearchBar';
import { PlantCard } from '@/components/PlantCard';
import { TabHeader } from '@/components/TabHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Plant, GrowSpace } from '@/types';
import { colors } from '@/constants/colors';

export default function GrowScreen() {
  const insets = useSafeAreaInsets();
  const { plants, growSpaces } = useGrowStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);

  const growSpaceNames = useMemo(() => {
    return ['All', ...growSpaces.filter(space => space.active).map(space => space.name)];
  }, [growSpaces]);

  const filteredPlants = useMemo(() => {
    let filtered = plants;
    
    // Filter by grow space if not "All"
    if (selectedSpaceIndex > 0) {
      const selectedSpaceId = growSpaces.filter(space => space.active)[selectedSpaceIndex - 1].id;
      filtered = filtered.filter(plant => plant.growSpaceId === selectedSpaceId);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (plant) =>
          plant.strain.toLowerCase().includes(query) ||
          plant.breeder.toLowerCase().includes(query) ||
          plant.stage.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [plants, growSpaces, selectedSpaceIndex, searchQuery]);

  const handlePlantPress = (plant: Plant) => {
    // Navigate to plant detail
    console.log('Plant pressed:', plant);
  };

  const handleAddPress = () => {
    // Navigate to add plant form
    console.log('Add pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabHeader title="Grow Log" onAdd={handleAddPress} />
      
      <SearchBar 
        placeholder="Search plants..."
        onSearch={setSearchQuery} 
      />
      
      {growSpaceNames.length > 1 && (
        <SegmentedControl
          segments={growSpaceNames}
          selectedIndex={selectedSpaceIndex}
          onChange={setSelectedSpaceIndex}
        />
      )}

      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlantCard plant={item} onPress={handlePlantPress} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No plants found</Text>
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
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});