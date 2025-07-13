import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Save, X } from 'lucide-react-native';
import { useSeedStore } from '@/store/seedStore';
import { colors } from '@/constants/colors';

export default function AddSeedScreen() {
  const insets = useSafeAreaInsets();
  const { addSeed } = useSeedStore();
  
  const [form, setForm] = useState({
    strain: '',
    breeder: '',
    lineage: '',
    count: '',
    acquisitionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSave = () => {
    if (!form.strain.trim() || !form.breeder.trim()) {
      Alert.alert('Error', 'Strain and breeder are required');
      return;
    }

    if (!form.count || parseInt(form.count) <= 0) {
      Alert.alert('Error', 'Please enter a valid seed count');
      return;
    }

    addSeed({
      strain: form.strain.trim(),
      breeder: form.breeder.trim(),
      lineage: form.lineage.trim(),
      count: parseInt(form.count),
      acquisitionDate: form.acquisitionDate,
      notes: form.notes.trim(),
    });
    
    Alert.alert('Success', 'Seed added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: 'Add New Seed',
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seed Information</Text>
          
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
            <Text style={styles.fieldLabel}>Seed Count *</Text>
            <TextInput
              style={styles.input}
              value={form.count}
              onChangeText={(text) => setForm(prev => ({ ...prev, count: text }))}
              placeholder="Enter number of seeds"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Acquisition Date</Text>
            <TextInput
              style={styles.input}
              value={form.acquisitionDate}
              onChangeText={(text) => setForm(prev => ({ ...prev, acquisitionDate: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={form.notes}
              onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
              placeholder="Enter any notes about this seed"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Seed</Text>
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
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
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