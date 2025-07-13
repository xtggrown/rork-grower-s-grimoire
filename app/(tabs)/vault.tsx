import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSeedStore } from '@/store/seedStore';
import { SearchBar } from '@/components/SearchBar';
import { SeedItem } from '@/components/SeedItem';
import { FlowerItem } from '@/components/FlowerItem';
import { TabHeader } from '@/components/TabHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Seed, Flower } from '@/types';
import { colors } from '@/constants/colors';

export default function VaultScreen() {
  const insets = useSafeAreaInsets();
  const { seeds, flowers } = useSeedStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const filteredSeeds = useMemo(() => {
    if (!searchQuery) return seeds;
    const query = searchQuery.toLowerCase();
    return seeds.filter(
      (seed) =>
        seed.strain.toLowerCase().includes(query) ||
        seed.breeder.toLowerCase().includes(query) ||
        seed.lineage.toLowerCase().includes(query)
    );
  }, [seeds, searchQuery]);

  const filteredFlowers = useMemo(() => {
    if (!searchQuery) return flowers;
    const query = searchQuery.toLowerCase();
    return flowers.filter(
      (flower) =>
        flower.strain.toLowerCase().includes(query) ||
        flower.jarId.toLowerCase().includes(query)
    );
  }, [flowers, searchQuery]);

  const handleSeedPress = (seed: Seed) => {
    // Navigate to seed detail
    console.log('Seed pressed:', seed);
  };

  const handleFlowerPress = (flower: Flower) => {
    // Navigate to flower detail
    console.log('Flower pressed:', flower);
  };

  const handleAddPress = () => {
    // Navigate to add seed/flower form
    console.log('Add pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabHeader title="Seed Vault" onAdd={handleAddPress} />
      
      <SearchBar 
        placeholder={selectedTab === 0 ? "Search seeds..." : "Search flowers..."}
        onSearch={setSearchQuery} 
      />
      
      <SegmentedControl
        segments={['Seeds', 'Flowers']}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
      />

      {selectedTab === 0 ? (
        <FlatList
          data={filteredSeeds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SeedItem seed={item} onPress={handleSeedPress} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No seeds found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredFlowers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlowerItem flower={item} onPress={handleFlowerPress} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No flowers found</Text>
            </View>
          }
        />
      )}
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