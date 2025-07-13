import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit3, Save, X, Trash2 } from 'lucide-react-native';
import { useSeedStore } from '@/store/seedStore';
import { colors } from '@/constants/colors';

export default function SeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { seeds, updateSeed, deleteSeed } = useSeedStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const seed = seeds.find(s => s.id === id);
  
  const [editForm, setEditForm] = useState({
    strain: seed?.strain || '',
    breeder: seed?.breeder || '',
    lineage: seed?.lineage || '',
    count: seed?.count.toString() || '',
    acquisitionDate: seed?.acquisitionDate || '',
    notes: seed?.notes || '',
  });

  if (!seed) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Seed Not Found' }} />
        <Text style={styles.errorText}>Seed not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!editForm.strain.trim() || !editForm.breeder.trim()) {
      Alert.alert('Error', 'Strain and breeder are required');
      return;
    }

    updateSeed(id!, {
      strain: editForm.strain.trim(),
      breeder: editForm.breeder.trim(),
      lineage: editForm.lineage.trim(),
      count: parseInt(editForm.count) || 0,
      acquisitionDate: editForm.acquisitionDate,
      notes: editForm.notes.trim(),
    });
    
    setIsEditing(false);
    Alert.alert('Success', 'Seed updated successfully');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Seed',
      'Are you sure you want to delete this seed? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSeed(id!);
            router.back();
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditForm({
      strain: seed.strain,
      breeder: seed.breeder,
      lineage: seed.lineage,
      count: seed.count.toString(),
      acquisitionDate: seed.acquisitionDate,
      notes: seed.notes || '',
    });
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: isEditing ? 'Edit Seed' : seed.strain,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isEditing ? (
                <>
                  <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                    <X size={20} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                    <Save size={20} color={colors.primary} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerButton}>
                    <Edit3 size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                    <Trash2 size={20} color={colors.error} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {seed.imageUrl && (
          <Image source={{ uri: seed.imageUrl }} style={styles.image} />
        )}
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Strain</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.strain}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, strain: text }))}
                  placeholder="Enter strain name"
                />
              ) : (
                <Text style={styles.fieldValue}>{seed.strain}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Breeder</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.breeder}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, breeder: text }))}
                  placeholder="Enter breeder name"
                />
              ) : (
                <Text style={styles.fieldValue}>{seed.breeder}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Lineage</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.lineage}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, lineage: text }))}
                  placeholder="Enter lineage"
                />
              ) : (
                <Text style={styles.fieldValue}>{seed.lineage}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Count</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.count}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, count: text }))}
                  placeholder="Enter seed count"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{seed.count} seeds</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Acquisition Date</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editForm.acquisitionDate}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, acquisitionDate: text }))}
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <Text style={styles.fieldValue}>
                  {new Date(seed.acquisitionDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={editForm.notes}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, notes: text }))}
                placeholder="Enter notes about this seed"
                multiline
                numberOfLines={4}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {seed.notes || 'No notes available'}
              </Text>
            )}
          </View>
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
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
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
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});