import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
    router.push(`/seed/${seed.id}`);
  };

  const handleFlowerPress = (flower: Flower) => {
    router.push(`/flower/${flower.id}`);
  };

  const handleAddPress = () => {
    Alert.alert(
      'Add New Item',
      'Choose what you want to add:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Seed', onPress: () => router.push('/add-seed') },
        { text: 'Add Flower', onPress: () => router.push('/add-flower') },
      ]
    );
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
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No seeds found</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first seed</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredFlowers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlowerItem flower={item} onPress={handleFlowerPress} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No flowers found</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first harvest</Text>
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