import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit3, Camera, Plus, Calendar, Droplets, Thermometer } from 'lucide-react-native';
import { usePlantStore } from '@/store/plantStore';
import { PhotoCapture } from '@/components/PhotoCapture';
import { PlantTimeline } from '@/components/PlantTimeline';
import { FeedingForm } from '@/components/FeedingForm';
import { EnvironmentalForm } from '@/components/EnvironmentalForm';
import { colors } from '@/constants/colors';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { plants, addPhoto, addFeedingEntry, addEnvironmentalReading, addTimelineEntry } = usePlantStore();
  const [showCamera, setShowCamera] = useState(false);
  const [showFeedingForm, setShowFeedingForm] = useState(false);
  const [showEnvironmentalForm, setShowEnvironmentalForm] = useState(false);
  
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
      stage: plant.stage,
    });
    setShowCamera(false);
    Alert.alert('Success', 'Photo added successfully');
  };

  const handleFeedingSubmit = (entry: any) => {
    addFeedingEntry(id!, entry);
    setShowFeedingForm(false);
    Alert.alert('Success', 'Feeding entry added successfully');
  };

  const handleEnvironmentalSubmit = (reading: any) => {
    addEnvironmentalReading(id!, reading);
    setShowEnvironmentalForm(false);
    Alert.alert('Success', 'Environmental reading added successfully');
  };

  const handleAddTimelineEntry = () => {
    Alert.alert(
      'Add Timeline Entry',
      'What would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Photo', onPress: () => setShowCamera(true) },
        { text: 'Feeding', onPress: () => setShowFeedingForm(true) },
        { text: 'Environmental', onPress: () => setShowEnvironmentalForm(true) },
        { 
          text: 'Note', 
          onPress: () => {
            addTimelineEntry(id!, {
              date: new Date().toISOString(),
              type: 'note',
              title: 'Manual Note',
              description: 'Added via timeline',
            });
            Alert.alert('Success', 'Note added to timeline');
          }
        },
      ]
    );
  };

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
          title: plant.name || plant.strain,
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowCamera(true)}>
              <Camera size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowFeedingForm(true)}>
              <Droplets size={24} color={colors.secondary} />
              <Text style={styles.actionButtonText}>Feeding</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowEnvironmentalForm(true)}>
              <Thermometer size={24} color={colors.warning} />
              <Text style={styles.actionButtonText}>Environment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddTimelineEntry}>
              <Plus size={24} color={colors.success} />
              <Text style={styles.actionButtonText}>Add Entry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <PlantTimeline 
            entries={plant.timelineEntries} 
            onAddEntry={handleAddTimelineEntry}
          />
        </View>

        {/* Recent Environmental Data */}
        {plant.environmentalData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Environmental Data</Text>
            {plant.environmentalData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((reading) => (
                <View key={reading.id} style={styles.environmentalCard}>
                  <View style={styles.environmentalHeader}>
                    <Text style={styles.environmentalDate}>
                      {new Date(reading.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.environmentalTemp}>{reading.temperature}°F</Text>
                  </View>
                  <View style={styles.environmentalData}>
                    <Text style={styles.environmentalText}>
                      Humidity: {reading.humidity}%
                      {reading.vpd && ` • VPD: ${reading.vpd}`}
                      {reading.co2 && ` • CO₂: ${reading.co2} PPM`}
                    </Text>
                  </View>
                  {reading.notes && (
                    <Text style={styles.environmentalNotes}>{reading.notes}</Text>
                  )}
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      {/* Feeding Form Modal */}
      <Modal
        visible={showFeedingForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <FeedingForm
          onSubmit={handleFeedingSubmit}
          onCancel={() => setShowFeedingForm(false)}
          plantStage={plant.stage}
        />
      </Modal>

      {/* Environmental Form Modal */}
      <Modal
        visible={showEnvironmentalForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EnvironmentalForm
          onSubmit={handleEnvironmentalSubmit}
          onCancel={() => setShowEnvironmentalForm(false)}
        />
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  environmentalCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  environmentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  environmentalDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  environmentalTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  environmentalData: {
    marginBottom: 4,
  },
  environmentalText: {
    fontSize: 14,
    color: colors.text,
  },
  environmentalNotes: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});