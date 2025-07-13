import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GrowCalculator } from '@/components/GrowCalculator';
import { colors } from '@/constants/colors';

export default function CalculatorsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen 
        options={{ 
          title: 'Grow Calculators',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerShadowVisible: false,
        }} 
      />
      <GrowCalculator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});