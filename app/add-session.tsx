import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSessionStore } from '@/store/sessionStore';
import { useSeedStore } from '@/store/seedStore';
import { SessionForm } from '@/components/SessionForm';
import { colors } from '@/constants/colors';

export default function AddSessionScreen() {
  const insets = useSafeAreaInsets();
  const { addSession } = useSessionStore();
  const { flowers } = useSeedStore();

  const availableStrains = flowers.map(flower => ({
    id: flower.id,
    strain: flower.strain,
  }));

  const handleSubmit = (session: any) => {
    addSession(session);
    Alert.alert('Success', 'Session logged successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <SessionForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        availableStrains={availableStrains}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});