import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSeedStore } from '@/store/seedStore';
import { useGrowStore } from '@/store/growStore';
import { useSessionStore } from '@/store/sessionStore';
import { useLabStore } from '@/store/labStore';
import { TabHeader } from '@/components/TabHeader';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { seeds, flowers } = useSeedStore();
  const { plants } = useGrowStore();
  const { sessions } = useSessionStore();
  const { crosses } = useLabStore();

  const stats = useMemo(() => {
    // Calculate total harvest weight
    const totalHarvest = flowers.reduce((sum, flower) => sum + flower.weight, 0);
    
    // Count active plants by stage
    const plantsByStage = plants.reduce((acc, plant) => {
      acc[plant.stage] = (acc[plant.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSessions = sessions.filter(session => 
      new Date(session.date) >= thirtyDaysAgo
    );

    // Top rated strains from sessions
    const strainRatings = sessions.reduce((acc, session) => {
      session.strains.forEach(strainId => {
        const flower = flowers.find(f => f.id === strainId);
        if (flower) {
          if (!acc[flower.strain]) {
            acc[flower.strain] = { total: 0, count: 0 };
          }
          acc[flower.strain].total += session.rating;
          acc[flower.strain].count += 1;
        }
      });
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const topStrains = Object.entries(strainRatings)
      .map(([strain, data]) => ({
        strain,
        avgRating: data.total / data.count,
        sessionCount: data.count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);

    return {
      totalSeeds: seeds.length,
      totalFlowers: flowers.length,
      totalHarvest: totalHarvest.toFixed(1),
      activePlants: plants.length,
      plantsByStage,
      totalCrosses: crosses.length,
      recentSessions: recentSessions.length,
      topStrains,
    };
  }, [seeds, flowers, plants, sessions, crosses]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabHeader title="Dashboard" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalSeeds}</Text>
            <Text style={styles.statLabel}>Seeds</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activePlants}</Text>
            <Text style={styles.statLabel}>Active Plants</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalFlowers}</Text>
            <Text style={styles.statLabel}>Harvests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalHarvest}g</Text>
            <Text style={styles.statLabel}>Total Yield</Text>
          </View>
        </View>

        {/* Plants by Stage */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plants by Stage</Text>
          <View style={styles.stageContainer}>
            {Object.entries(stats.plantsByStage).map(([stage, count]) => (
              <View key={stage} style={styles.stageItem}>
                <Text style={styles.stageCount}>{count}</Text>
                <Text style={styles.stageLabel}>{stage}</Text>
              </View>
            ))}
            {Object.keys(stats.plantsByStage).length === 0 && (
              <Text style={styles.emptyText}>No active plants</Text>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity (30 days)</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <Text style={styles.activityNumber}>{stats.recentSessions}</Text>
              <Text style={styles.activityLabel}>Sessions</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityNumber}>{stats.totalCrosses}</Text>
              <Text style={styles.activityLabel}>Total Crosses</Text>
            </View>
          </View>
        </View>

        {/* Top Rated Strains */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Rated Strains</Text>
          {stats.topStrains.length > 0 ? (
            stats.topStrains.map((strain, index) => (
              <View key={strain.strain} style={styles.strainItem}>
                <View style={styles.strainRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.strainInfo}>
                  <Text style={styles.strainName}>{strain.strain}</Text>
                  <Text style={styles.strainSessions}>{strain.sessionCount} sessions</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{strain.avgRating.toFixed(1)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No session data available</Text>
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
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    margin: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  stageContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  stageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stageCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  stageLabel: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  activityContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flex: 1,
    alignItems: 'center',
  },
  activityNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  strainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  strainRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  strainInfo: {
    flex: 1,
  },
  strainName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  strainSessions: {
    fontSize: 12,
    color: colors.textLight,
  },
  ratingContainer: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryDark,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});