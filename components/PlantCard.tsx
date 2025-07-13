import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Plant } from '@/types';
import { colors } from '@/constants/colors';

interface PlantCardProps {
  plant: Plant;
  onPress: (plant: Plant) => void;
}

export const PlantCard = ({ plant, onPress }: PlantCardProps) => {
  // Get the most recent photo if available
  const latestPhoto = plant.photos.length > 0 
    ? plant.photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  // Calculate days since start
  const startDate = new Date(plant.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(plant)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {latestPhoto ? (
          <Image source={{ uri: latestPhoto.url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.stageContainer}>
          <Text style={styles.stageText}>{plant.stage}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.strain}>{plant.strain}</Text>
        <Text style={styles.breeder}>{plant.breeder}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Medium</Text>
            <Text style={styles.infoValue}>{plant.medium}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Days</Text>
            <Text style={styles.infoValue}>{daysSinceStart}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    backgroundColor: colors.primaryLight,
  },
  stageContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  strain: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  breeder: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});