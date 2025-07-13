import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Flower } from '@/types';
import { colors } from '@/constants/colors';

interface FlowerItemProps {
  flower: Flower;
  onPress: (flower: Flower) => void;
}

export const FlowerItem = ({ flower, onPress }: FlowerItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(flower)}
      activeOpacity={0.7}
    >
      {flower.imageUrl ? (
        <Image source={{ uri: flower.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.content}>
        <Text style={styles.strain}>{flower.strain}</Text>
        <Text style={styles.jarId}>Jar: {flower.jarId}</Text>
        <Text style={styles.date}>Harvested: {new Date(flower.harvestDate).toLocaleDateString()}</Text>
        <View style={styles.weightContainer}>
          <Text style={styles.weight}>{flower.weight}g</Text>
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
    backgroundColor: colors.secondaryLight,
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
  jarId: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  weightContainer: {
    backgroundColor: colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  weight: {
    fontSize: 12,
    color: colors.secondaryDark,
    fontWeight: '500',
  },
});