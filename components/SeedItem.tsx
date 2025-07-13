import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Seed } from '@/types';
import { colors } from '@/constants/colors';

interface SeedItemProps {
  seed: Seed;
  onPress: (seed: Seed) => void;
}

export const SeedItem = ({ seed, onPress }: SeedItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(seed)}
      activeOpacity={0.7}
    >
      {seed.imageUrl ? (
        <Image source={{ uri: seed.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.content}>
        <Text style={styles.strain}>{seed.strain}</Text>
        <Text style={styles.breeder}>{seed.breeder}</Text>
        <Text style={styles.lineage}>{seed.lineage}</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{seed.count} seeds</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: colors.primaryLight,
  },
  content: {
    flex: 1,
  },
  strain: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  breeder: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  lineage: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  countContainer: {
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  count: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});