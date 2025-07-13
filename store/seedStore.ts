import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Seed, Flower } from '@/types';
import { seedData, flowerData } from '@/mocks/seedData';

interface SeedState {
  seeds: Seed[];
  flowers: Flower[];
  addSeed: (seed: Omit<Seed, 'id'>) => void;
  updateSeed: (id: string, seed: Partial<Seed>) => void;
  deleteSeed: (id: string) => void;
  addFlower: (flower: Omit<Flower, 'id'>) => void;
  updateFlower: (id: string, flower: Partial<Flower>) => void;
  deleteFlower: (id: string) => void;
}

export const useSeedStore = create<SeedState>()(
  persist(
    (set) => ({
      seeds: seedData,
      flowers: flowerData,
      addSeed: (seed) => 
        set((state) => ({
          seeds: [...state.seeds, { ...seed, id: Date.now().toString() }],
        })),
      updateSeed: (id, updatedSeed) =>
        set((state) => ({
          seeds: state.seeds.map((seed) => 
            seed.id === id ? { ...seed, ...updatedSeed } : seed
          ),
        })),
      deleteSeed: (id) =>
        set((state) => ({
          seeds: state.seeds.filter((seed) => seed.id !== id),
        })),
      addFlower: (flower) =>
        set((state) => ({
          flowers: [...state.flowers, { ...flower, id: Date.now().toString() }],
        })),
      updateFlower: (id, updatedFlower) =>
        set((state) => ({
          flowers: state.flowers.map((flower) =>
            flower.id === id ? { ...flower, ...updatedFlower } : flower
          ),
        })),
      deleteFlower: (id) =>
        set((state) => ({
          flowers: state.flowers.filter((flower) => flower.id !== id),
        })),
    }),
    {
      name: 'seed-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);