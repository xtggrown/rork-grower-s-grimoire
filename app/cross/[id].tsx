import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Edit3, Trash2, Plus } from 'lucide-react-native';
import { useLabStore } from '@/store/labStore';
import { useSeedStore } from '@/store/seedStore';
import { LineageTree } from '@/components/LineageTree';
import { colors } from '@/constants/colors';

export default function CrossDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { crosses, deleteCross } = useLabStore();
  const { seeds } = useSeedStore();
  
  const cross = crosses.find(c => c.id === id);

  if (!cross) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Cross Not Found' }} />
        <Text style={styles.errorText}>Cross not found</Text>
      </View>
    );
  }

  const mother = seeds.find(s => s.id === cross.mother);
  const father = seeds.find(s => s.id === cross.father);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'testing':
        return colors.warning;
      case 'selected':
        return colors.success;
      case 'archived':
        return colors.inactive;
      default:
        return colors.textLight;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Cross',
      'Are you sure you want to delete this cross? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCross(id!);
            router.back();
          },
        },
      ]
    );
  };

  const handleAddPhenotype = () => {
    Alert.alert('Coming Soon', 'Add phenotype form will be implemented next');
  };

  const handleSeedPress = (seed: any) => {
    router.push(`/seed/${seed.id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: cross.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => router.push(`/edit-cross/${id}`)} style={styles.headerButton}>
                <Edit3 size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cross Information */}
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.crossName}>{cross.name}</Text>
            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(cross.status) }]}>
              <Text style={styles.statusText}>{cross.status}</Text>
            </View>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mother</Text>
              <Text style={styles.infoValue}>{mother?.strain || 'Unknown'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Father</Text>
              <Text style={styles.infoValue}>{father?.strain || 'Unknown'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>{new Date(cross.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phenotypes</Text>
              <Text style={styles.infoValue}>{cross.phenotypes.length}</Text>
            </View>
          </View>

          {cross.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{cross.notes}</Text>
            </View>
          )}
        </View>

        {/* Lineage Tree */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lineage Tree</Text>
          <LineageTree
            seeds={seeds}
            motherId={cross.mother}
            fatherId={cross.father}
            onSeedPress={handleSeedPress}
          />
        </View>

        {/* Phenotypes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phenotypes ({cross.phenotypes.length})</Text>
            <TouchableOpacity onPress={handleAddPhenotype} style={styles.addButton}>
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {cross.phenotypes.length > 0 ? (
            cross.phenotypes.map((phenotype) => (
              <View key={phenotype.id} style={styles.phenotypeCard}>
                <Text style={styles.phenotypeName}>{phenotype.name}</Text>
                <Text style={styles.phenotypeDescription}>{phenotype.description}</Text>
                
                {phenotype.traits.length > 0 && (
                  <View style={styles.traitsContainer}>
                    {phenotype.traits.map((trait, index) => (
                      <View key={index} style={styles.traitTag}>
                        <Text style={styles.traitText}>{trait}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {phenotype.photos.length > 0 && (
                  <Text style={styles.photoCount}>{phenotype.photos.length} photos</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No phenotypes recorded yet</Text>
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  crossName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
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
  notesContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
  phenotypeCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  phenotypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  phenotypeDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  traitTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  traitText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  photoCount: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
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