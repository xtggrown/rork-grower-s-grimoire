import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Save, X } from 'lucide-react-native';
import { useGrowStore } from '@/store/growStore';
import { useSeedStore } from '@/store/seedStore';
import { GrowStage } from '@/types';
import { colors } from '@/constants/colors';

export default function AddPlantScreen() {
  const insets = useSafeAreaInsets();
  const { addPlant, growSpaces } = useGrowStore();
  const { seeds } = useSeedStore();
  
  const [form, setForm] = useState({
    strain: '',
    breeder: '',
    lineage: '',
    medium: '',
    nutrients: '',
    stage: 'germination' as GrowStage,
    startDate: new Date().toISOString().split('T')[0],
    growSpaceId: growSpaces.find(space => space.active)?.id || '',
    seedId: '',
  });

  const stages: GrowStage[] = ['germination', 'seedling', 'vegetative', 'flowering', 'harvest', 'drying', 'curing'];

  const handleSeedSelect = (seedId: string) => {
    const seed = seeds.find(s => s.id === seedId);
    if (seed) {
      setForm(prev => ({
        ...prev,
        seedId,
        strain: seed.strain,
        breeder: seed.breeder,
        lineage: seed.lineage,
      }));
    }
  };

  const handleSave = () => {
    if (!form.strain.trim() || !form.breeder.trim() || !form.medium.trim()) {
      Alert.alert('Error', 'Strain, breeder, and medium are required');
      return;
    }

    if (!form.growSpaceId) {
      Alert.alert('Error', 'Please select a grow space');
      return;
    }

    addPlant({
      strain: form.strain.trim(),
      breeder: form.breeder.trim(),
      lineage: form.lineage.trim(),
      medium: form.medium.trim(),
      nutrients: form.nutrients.split(',').map(n => n.trim()).filter(n => n),
      feedingSchedule: [],
      trainingNotes: [],
      ipmNotes: [],
      stage: form.stage,
      startDate: form.startDate,
      photos: [],
      growSpaceId: form.growSpaceId,
      seedId: form.seedId || undefined,
    });
    
    Alert.alert('Success', 'Plant added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: 'Add New Plant',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                <Save size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Seed Selection */}
        {seeds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select from Seed Vault (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {seeds.map((seed) => (
                <TouchableOpacity
                  key={seed.id}
                  style={[
                    styles.seedOption,
                    form.seedId === seed.id && styles.selectedSeedOption
                  ]}
                  onPress={() => handleSeedSelect(seed.id)}
                >
                  <Text style={[
                    styles.seedOptionText,
                    form.seedId === seed.id && styles.selectedSeedOptionText
                  ]}>
                    {seed.strain}
                  </Text>
                  <Text style={styles.seedOptionBreeder}>{seed.breeder}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Information</Text>
          
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Strain Name *</Text>
            <TextInput
              style={styles.input}
              value={form.strain}
              onChangeText={(text) => setForm(prev => ({ ...prev, strain: text }))}
              placeholder="Enter strain name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Breeder *</Text>
            <TextInput
              style={styles.input}
              value={form.breeder}
              onChangeText={(text) => setForm(prev => ({ ...prev, breeder: text }))}
              placeholder="Enter breeder name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Lineage</Text>
            <TextInput
              style={styles.input}
              value={form.lineage}
              onChangeText={(text) => setForm(prev => ({ ...prev, lineage: text }))}
              placeholder="e.g., Parent A x Parent B"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Growing Medium *</Text>
            <TextInput
              style={styles.input}
              value={form.medium}
              onChangeText={(text) => setForm(prev => ({ ...prev, medium: text }))}
              placeholder="e.g., Soil, Coco, Hydro"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nutrients</Text>
            <TextInput
              style={styles.input}
              value={form.nutrients}
              onChangeText={(text) => setForm(prev => ({ ...prev, nutrients: text }))}
              placeholder="Separate with commas"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Current Stage</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {stages.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.stageOption,
                    form.stage === stage && styles.selectedStageOption
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, stage }))}
                >
                  <Text style={[
                    styles.stageOptionText,
                    form.stage === stage && styles.selectedStageOptionText
                  ]}>
                    {stage}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Start Date</Text>
            <TextInput
              style={styles.input}
              value={form.startDate}
              onChangeText={(text) => setForm(prev => ({ ...prev, startDate: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Grow Space *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {growSpaces.filter(space => space.active).map((space) => (
                <TouchableOpacity
                  key={space.id}
                  style={[
                    styles.spaceOption,
                    form.growSpaceId === space.id && styles.selectedSpaceOption
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, growSpaceId: space.id }))}
                >
                  <Text style={[
                    styles.spaceOptionText,
                    form.growSpaceId === space.id && styles.selectedSpaceOptionText
                  ]}>
                    {space.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add Plant</Text>
          </TouchableOpacity>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  seedOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSeedOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  seedOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedSeedOptionText: {
    color: colors.primaryDark,
  },
  seedOptionBreeder: {
    fontSize: 12,
    color: colors.textLight,
  },
  stageOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedStageOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  stageOptionText: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  selectedStageOptionText: {
    color: colors.primaryDark,
    fontWeight: '500',
  },
  spaceOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSpaceOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  spaceOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedSpaceOptionText: {
    color: colors.primaryDark,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});