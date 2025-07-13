import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Seed } from '@/types';
import { colors } from '@/constants/colors';

interface LineageTreeProps {
  seeds: Seed[];
  motherId: string;
  fatherId: string;
  onSeedPress?: (seed: Seed) => void;
}

export const LineageTree = ({ seeds, motherId, fatherId, onSeedPress }: LineageTreeProps) => {
  const mother = seeds.find(s => s.id === motherId);
  const father = seeds.find(s => s.id === fatherId);

  const parseLineage = (lineage: string): { parent1?: string; parent2?: string } => {
    if (!lineage) return {};
    
    const parts = lineage.split(/\s*[x×]\s*/i);
    if (parts.length >= 2) {
      return {
        parent1: parts[0].trim(),
        parent2: parts[1].trim(),
      };
    }
    return {};
  };

  const renderSeedNode = (seed: Seed | undefined, label: string) => {
    if (!seed) {
      return (
        <View style={styles.unknownNode}>
          <Text style={styles.unknownText}>Unknown {label}</Text>
        </View>
      );
    }

    const lineage = parseLineage(seed.lineage);

    return (
      <View style={styles.nodeContainer}>
        <TouchableOpacity
          style={styles.seedNode}
          onPress={() => onSeedPress?.(seed)}
          activeOpacity={0.7}
        >
          <Text style={styles.seedName}>{seed.strain}</Text>
          <Text style={styles.seedBreeder}>{seed.breeder}</Text>
        </TouchableOpacity>
        
        {(lineage.parent1 || lineage.parent2) && (
          <View style={styles.parentContainer}>
            <View style={styles.connectionLine} />
            <View style={styles.parentsRow}>
              {lineage.parent1 && (
                <View style={styles.parentNode}>
                  <Text style={styles.parentName}>{lineage.parent1}</Text>
                </View>
              )}
              {lineage.parent2 && (
                <View style={styles.parentNode}>
                  <Text style={styles.parentName}>{lineage.parent2}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.treeContainer}>
        {/* Cross Result (Top) */}
        <View style={styles.crossResult}>
          <View style={styles.resultNode}>
            <Text style={styles.resultText}>Cross Result</Text>
            <Text style={styles.resultSubtext}>
              {mother?.strain || 'Unknown'} × {father?.strain || 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Connection Line */}
        <View style={styles.mainConnectionLine} />

        {/* Parents Row */}
        <View style={styles.parentsContainer}>
          <View style={styles.parentSection}>
            <Text style={styles.parentLabel}>Mother ♀</Text>
            {renderSeedNode(mother, 'Mother')}
          </View>

          <View style={styles.crossSymbol}>
            <Text style={styles.crossText}>×</Text>
          </View>

          <View style={styles.parentSection}>
            <Text style={styles.parentLabel}>Father ♂</Text>
            {renderSeedNode(father, 'Father')}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minWidth: '100%',
  },
  treeContainer: {
    alignItems: 'center',
    minWidth: 400,
  },
  crossResult: {
    marginBottom: 20,
  },
  resultNode: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  mainConnectionLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  parentsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  parentSection: {
    flex: 1,
    alignItems: 'center',
  },
  parentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 12,
  },
  crossSymbol: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
  },
  crossText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.secondary,
  },
  nodeContainer: {
    alignItems: 'center',
  },
  seedNode: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  seedName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  seedBreeder: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  unknownNode: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  unknownText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  parentContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  connectionLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  parentsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  parentNode: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  parentName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});