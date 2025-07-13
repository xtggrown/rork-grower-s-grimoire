import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Calendar, Camera, Droplets, Scissors, Bug, Thermometer, FileText } from 'lucide-react-native';
import { TimelineEntry } from '@/types';
import { colors } from '@/constants/colors';

interface PlantTimelineProps {
  entries: TimelineEntry[];
  onAddEntry?: () => void;
}

export const PlantTimeline = ({ entries, onAddEntry }: PlantTimelineProps) => {
  const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIconForType = (type: string) => {
    switch (type) {
      case 'feeding':
        return <Droplets size={16} color={colors.primary} />;
      case 'training':
        return <Scissors size={16} color={colors.warning} />;
      case 'ipm':
        return <Bug size={16} color={colors.error} />;
      case 'photo':
        return <Camera size={16} color={colors.secondary} />;
      case 'environmental':
        return <Thermometer size={16} color={colors.primary} />;
      case 'stage_change':
        return <Calendar size={16} color={colors.success} />;
      default:
        return <FileText size={16} color={colors.textLight} />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'feeding':
        return colors.primary;
      case 'training':
        return colors.warning;
      case 'ipm':
        return colors.error;
      case 'photo':
        return colors.secondary;
      case 'environmental':
        return colors.primary;
      case 'stage_change':
        return colors.success;
      default:
        return colors.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        {onAddEntry && (
          <TouchableOpacity onPress={onAddEntry} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        {sortedEntries.map((entry, index) => (
          <View key={entry.id} style={styles.timelineItem}>
            <View style={styles.timelineMarker}>
              <View style={[styles.markerDot, { backgroundColor: getColorForType(entry.type) }]} />
              {index < sortedEntries.length - 1 && <View style={styles.timelineLine} />}
            </View>
            
            <View style={styles.timelineContent}>
              <View style={styles.entryHeader}>
                {getIconForType(entry.type)}
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
              
              <Text style={styles.entryDescription}>{entry.description}</Text>
              
              {entry.photos && entry.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
                  {entry.photos.map((photo, photoIndex) => (
                    <Image key={photoIndex} source={{ uri: photo }} style={styles.entryPhoto} />
                  ))}
                </ScrollView>
              )}
              
              {entry.data && entry.type === 'feeding' && (
                <View style={styles.feedingData}>
                  <Text style={styles.dataText}>
                    {entry.data.amount}L • {entry.data.ppm ? `${entry.data.ppm} PPM` : 'Water only'}
                    {entry.data.ph && ` • pH ${entry.data.ph}`}
                  </Text>
                </View>
              )}
              
              {entry.data && entry.type === 'environmental' && (
                <View style={styles.environmentalData}>
                  <Text style={styles.dataText}>
                    {entry.data.temperature}°F • {entry.data.humidity}% RH
                    {entry.data.vpd && ` • VPD ${entry.data.vpd}`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {sortedEntries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No timeline entries yet</Text>
            <Text style={styles.emptySubtext}>Add photos, notes, and track your plant's progress</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryDark,
  },
  timeline: {
    flex: 1,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 12,
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  entryDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  photosContainer: {
    marginTop: 8,
  },
  entryPhoto: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 8,
  },
  feedingData: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  environmentalData: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  dataText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});