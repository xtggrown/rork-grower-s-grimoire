import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGrowStore } from '@/store/growStore';
import { SearchBar } from '@/components/SearchBar';
import { PlantCard } from '@/components/PlantCard';
import { TabHeader } from '@/components/TabHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Plant } from '@/types';
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
    const startDate = new Date(plant.startDate);
    const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    Alert.alert(
      plant.strain,
      `Breeder: ${plant.breeder}\nStage: ${plant.stage}\nMedium: ${plant.medium}\nDays: ${daysSinceStart}\nPhotos: ${plant.photos.length}\nFeeding entries: ${plant.feedingSchedule.length}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddPress = () => {
    Alert.alert('Coming Soon', 'Add plant form will be implemented next');
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
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No plants found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to start your first grow</Text>
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