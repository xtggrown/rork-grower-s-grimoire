import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Session } from '@/types';
import { colors } from '@/constants/colors';

interface SessionCardProps {
  session: Session;
  strainNames: string[];
  onPress: (session: Session) => void;
}

export const SessionCard = ({ session, strainNames, onPress }: SessionCardProps) => {
  // Format date
  const sessionDate = new Date(session.date);
  const formattedDate = sessionDate.toLocaleDateString();
  const formattedTime = sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Get top effects
  const topEffects = session.effects
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(session)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{session.rating}/5</Text>
        </View>
      </View>

      <View style={styles.strainContainer}>
        <Text style={styles.strainLabel}>Strains:</Text>
        <Text style={styles.strainNames}>{strainNames.join(', ')}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Method</Text>
          <Text style={styles.detailValue}>{session.method}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Dose</Text>
          <Text style={styles.detailValue}>{session.dose}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{session.duration} min</Text>
        </View>
      </View>

      <View style={styles.effectsContainer}>
        {topEffects.map((effect, index) => (
          <View key={index} style={styles.effectItem}>
            <Text style={styles.effectName}>{effect.name}</Text>
            <View style={styles.intensityContainer}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.intensityDot,
                    { backgroundColor: i < effect.intensity ? colors.secondary : colors.border },
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      {session.guestReviews && session.guestReviews.length > 0 && (
        <View style={styles.guestContainer}>
          <Text style={styles.guestLabel}>
            {session.guestReviews.length} guest {session.guestReviews.length === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
      )}
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 14,
    color: colors.textLight,
  },
  ratingContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  strainContainer: {
    marginBottom: 12,
  },
  strainLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  strainNames: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  effectsContainer: {
    marginBottom: 8,
  },
  effectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  effectName: {
    fontSize: 14,
    color: colors.text,
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  guestContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  guestLabel: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },
});