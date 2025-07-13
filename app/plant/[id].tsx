import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit3, Camera, Plus, Calendar, Droplets, Scissors } from 'lucide-react-native';
import { useGrowStore } from '@/store/growStore';
import { PhotoCapture } from '@/components/PhotoCapture';
import { colors } from '@/constants/colors';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { plants, addPhoto, addFeedingEntry, addTrainingNote } = useGrowStore();
  const [showCamera, setShowCamera] = useState(false);
  
  const plant = plants.find(p => p.id === id);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Plant Not Found' }} />
        <Text style={styles.errorText}>Plant not found</Text>
      </View>
    );
  }

  // Calculate days since start
  const startDate = new Date(plant.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const handlePhotoCapture = (photoUri: string) => {
    addPhoto(id!, {
      url: photoUri,
      date: new Date().toISOString(),
      notes: `Day ${daysSinceStart} - ${plant.stage}`,
    });
    setShowCamera(false);
    Alert.alert('Success', 'Photo added successfully');
  };

  const handleAddFeeding = () => {
    Alert.alert('Add Feeding Entry', 'This feature will be implemented next');
  };

  const handleAddTraining = () => {
    Alert.alert('Add Training Note', 'This feature will be implemented next');
  };

  const renderPhoto = ({ item }: { item: any }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.url }} style={styles.photoImage} />
      <Text style={styles.photoDate}>{new Date(item.date).toLocaleDateString()}</Text>
      {item.notes && <Text style={styles.photoNotes}>{item.notes}</Text>}
    </View>
  );

  const renderFeedingEntry = ({ item }: { item: any }) => (
    <View style={styles.entryItem}>
      <View style={styles.entryHeader}>
        <Droplets size={16} color={item.type === 'water' ? colors.primary : colors.secondary} />
        <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.entryType}>{item.type}</Text>
      </View>
      <Text style={styles.entryDetails}>
        Amount: {item.amount}L
        {item.ph && ` • pH: ${item.ph}`}
        {item.ppm && ` • PPM: ${item.ppm}`}
      </Text>
      {item.nutrients && (
        <Text style={styles.entryNutrients}>Nutrients: {item.nutrients.join(', ')}</Text>
      )}
    </View>
  );

  const renderTrainingNote = ({ item }: { item: any }) => (
    <View style={styles.entryItem}>
      <View style={styles.entryHeader}>
        <Scissors size={16} color={colors.warning} />
        <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.entryType}>{item.technique}</Text>
      </View>
      <Text style={styles.entryDetails}>{item.notes}</Text>
    </View>
  );

  if (showCamera) {
    return (
      <PhotoCapture
        onCapture={handlePhotoCapture}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: plant.strain,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/edit-plant/${id}`)} style={styles.headerButton}>
              <Edit3 size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Plant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Strain</Text>
              <Text style={styles.infoValue}>{plant.strain}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Stage</Text>
              <Text style={[styles.infoValue, styles.stageValue]}>{plant.stage}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Days</Text>
              <Text style={styles.infoValue}>{daysSinceStart}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Medium</Text>
              <Text style={styles.infoValue}>{plant.medium}</Text>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Breeder</Text>
            <Text style={styles.fieldValue}>{plant.breeder}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Lineage</Text>
            <Text style={styles.fieldValue}>{plant.lineage}</Text>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos ({plant.photos.length})</Text>
            <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.addButton}>
              <Camera size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {plant.photos.length > 0 ? (
            <FlatList
              data={plant.photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
              renderItem={renderPhoto}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosList}
            />
          ) : (
            <Text style={styles.emptyText}>No photos yet. Tap the camera icon to add one!</Text>
          )}
        </View>

        {/* Feeding Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feeding Schedule ({plant.feedingSchedule.length})</Text>
            <TouchableOpacity onPress={handleAddFeeding} style={styles.addButton}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {plant.feedingSchedule.length > 0 ? (
            plant.feedingSchedule
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((entry) => (
                <View key={entry.id}>
                  {renderFeedingEntry({ item: entry })}
                </View>
              ))
          ) : (
            <Text style={styles.emptyText}>No feeding entries yet</Text>
          )}
        </View>

        {/* Training Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Training Notes ({plant.trainingNotes.length})</Text>
            <TouchableOpacity onPress={handleAddTraining} style={styles.addButton}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {plant.trainingNotes.length > 0 ? (
            plant.trainingNotes
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((note) => (
                <View key={note.id}>
                  {renderTrainingNote({ item: note })}
                </View>
              ))
          ) : (
            <Text style={styles.emptyText}>No training notes yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  stageValue: {
    textTransform: 'capitalize',
    color: colors.primary,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
  },
  photosList: {
    paddingRight: 16,
  },
  photoItem: {
    marginRight: 12,
    width: 120,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoDate: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  photoNotes: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  entryItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
  },
  entryType: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 'auto',
    textTransform: 'capitalize',
  },
  entryDetails: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  entryNutrients: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});