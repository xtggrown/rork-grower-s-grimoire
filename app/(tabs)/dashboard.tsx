import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calculator, TrendingUp, Clock, Leaf } from 'lucide-react-native';
import { useSeedStore } from '@/store/seedStore';
import { usePlantStore } from '@/store/plantStore';
import { useSessionStore } from '@/store/sessionStore';
import { useLabStore } from '@/store/labStore';
import { TabHeader } from '@/components/TabHeader';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { seeds, flowers } = useSeedStore();
  const { plants } = usePlantStore();
  const { sessions } = useSessionStore();
  const { crosses } = useLabStore();

  const stats = useMemo(() => {
    // Calculate total harvest weight
    const totalHarvest = flowers.reduce((sum, flower) => sum + flower.weight, 0);
    
    // Count active plants by stage
    const activePlants = plants.filter(p => p.isActive);
    const plantsByStage = activePlants.reduce((acc, plant) => {
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

    // Calculate average days in each stage
    const stageAverages = activePlants.reduce((acc, plant) => {
      const startDate = new Date(plant.startDate);
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (!acc[plant.stage]) {
        acc[plant.stage] = { total: 0, count: 0 };
      }
      acc[plant.stage].total += daysSinceStart;
      acc[plant.stage].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return {
      totalSeeds: seeds.length,
      totalFlowers: flowers.length,
      totalHarvest: totalHarvest.toFixed(1),
      activePlants: activePlants.length,
      plantsByStage,
      totalCrosses: crosses.length,
      recentSessions: recentSessions.length,
      topStrains,
      stageAverages,
    };
  }, [seeds, flowers, plants, sessions, crosses]);

  const quickActions = [
    {
      title: 'Calculators',
      icon: Calculator,
      color: colors.primary,
      onPress: () => router.push('/calculators'),
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      color: colors.secondary,
      onPress: () => router.push('/analytics'),
    },
    {
      title: 'Timeline',
      icon: Clock,
      color: colors.warning,
      onPress: () => router.push('/(tabs)/grow'),
    },
    {
      title: 'Add Plant',
      icon: Leaf,
      color: colors.success,
      onPress: () => router.push('/add-plant'),
    },
  ];

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

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plants by Stage */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Plants by Stage</Text>
          <View style={styles.stageContainer}>
            {Object.entries(stats.plantsByStage).map(([stage, count]) => (
              <View key={stage} style={styles.stageItem}>
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>{stage}</Text>
                  <Text style={styles.stageCount}>{count} plants</Text>
                </View>
                <View style={styles.stageProgress}>
                  <View 
                    style={[
                      styles.stageProgressBar, 
                      { 
                        width: `${(count / stats.activePlants) * 100}%`,
                        backgroundColor: colors.primary,
                      }
                    ]} 
                  />
                </View>
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
            <View style={styles.activityItem}>
              <Text style={styles.activityNumber}>{flowers.length}</Text>
              <Text style={styles.activityLabel}>Harvests</Text>
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

        {/* Growth Insights */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Growth Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Average Grow Time</Text>
              <Text style={styles.insightValue}>
                {stats.activePlants > 0 
                  ? Math.round(Object.values(stats.stageAverages).reduce((sum, stage) => sum + (stage.total / stage.count), 0) / Object.keys(stats.stageAverages).length)
                  : 0
                } days
              </Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Success Rate</Text>
              <Text style={styles.insightValue}>
                {plants.length > 0 
                  ? Math.round((flowers.length / plants.length) * 100)
                  : 0
                }%
              </Text>
            </View>
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: (width - 48) / 2 - 6,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  stageContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  stageItem: {
    marginBottom: 16,
  },
  stageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  stageCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  stageProgress: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stageProgressBar: {
    height: '100%',
    borderRadius: 2,
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
  insightsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});