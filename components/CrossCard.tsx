import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Cross } from '@/types';
import { colors } from '@/constants/colors';

interface CrossCardProps {
  cross: Cross;
  motherName: string;
  fatherName: string;
  onPress: (cross: Cross) => void;
}

export const CrossCard = ({ cross, motherName, fatherName, onPress }: CrossCardProps) => {
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(cross)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{cross.name}</Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(cross.status) }]}>
          <Text style={styles.statusText}>{cross.status}</Text>
        </View>
      </View>
      <View style={styles.parentContainer}>
        <View style={styles.parentItem}>
          <Text style={styles.parentLabel}>Mother</Text>
          <Text style={styles.parentName}>{motherName}</Text>
        </View>
        <View style={styles.parentDivider} />
        <View style={styles.parentItem}>
          <Text style={styles.parentLabel}>Father</Text>
          <Text style={styles.parentName}>{fatherName}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>Created: {new Date(cross.date).toLocaleDateString()}</Text>
        <Text style={styles.phenoCount}>{cross.phenotypes.length} phenotypes</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
  parentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  parentItem: {
    flex: 1,
  },
  parentLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  parentName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  parentDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
  },
  phenoCount: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },
});