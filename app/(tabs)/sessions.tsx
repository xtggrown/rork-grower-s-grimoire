import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '@/store/sessionStore';
import { useSeedStore } from '@/store/seedStore';
import { SearchBar } from '@/components/SearchBar';
import { SessionCard } from '@/components/SessionCard';
import { TabHeader } from '@/components/TabHeader';
import { Session } from '@/types';
import { colors } from '@/constants/colors';

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const { sessions } = useSessionStore();
  const { flowers } = useSeedStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (session) => {
        // Get strain names for this session
        const strainNames = session.strains.map(id => {
          const flower = flowers.find(f => f.id === id);
          return flower ? flower.strain.toLowerCase() : '';
        });
        
        // Check if any strain name matches the query
        const strainsMatch = strainNames.some(name => name.includes(query));
        
        // Check if method matches
        const methodMatches = session.method.toLowerCase().includes(query);
        
        // Check if any effect matches
        const effectsMatch = session.effects.some(effect => 
          effect.name.toLowerCase().includes(query)
        );
        
        return strainsMatch || methodMatches || effectsMatch;
      }
    );
  }, [sessions, flowers, searchQuery]);

  const getStrainNames = (strainIds: string[]) => {
    return strainIds.map(id => {
      const flower = flowers.find(f => f.id === id);
      return flower ? flower.strain : 'Unknown';
    });
  };

  const handleSessionPress = (session: Session) => {
    router.push(`/session/${session.id}`);
  };

  const handleAddPress = () => {
    router.push('/add-session');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabHeader title="Sessions" onAdd={handleAddPress} />
      
      <SearchBar 
        placeholder="Search sessions..."
        onSearch={setSearchQuery} 
      />

      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard 
            session={item} 
            strainNames={getStrainNames(item.strains)}
            onPress={handleSessionPress} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions found</Text>
            <Text style={styles.emptySubtext}>Tap the + button to log your first session</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});