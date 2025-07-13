import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Plant, GrowSpace, FeedingEntry, TrainingNote, IPMNote, Photo } from '@/types';
import { plantData, growSpaceData } from '@/mocks/growData';

interface GrowState {
  plants: Plant[];
  growSpaces: GrowSpace[];
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  addGrowSpace: (growSpace: Omit<GrowSpace, 'id'>) => void;
  updateGrowSpace: (id: string, growSpace: Partial<GrowSpace>) => void;
  deleteGrowSpace: (id: string) => void;
  addFeedingEntry: (plantId: string, entry: Omit<FeedingEntry, 'id'>) => void;
  addTrainingNote: (plantId: string, note: Omit<TrainingNote, 'id'>) => void;
  addIPMNote: (plantId: string, note: Omit<IPMNote, 'id'>) => void;
  addPhoto: (plantId: string, photo: Omit<Photo, 'id'>) => void;
}

export const useGrowStore = create<GrowState>()(
  persist(
    (set) => ({
      plants: plantData,
      growSpaces: growSpaceData,
      addPlant: (plant) =>
        set((state) => ({
          plants: [...state.plants, { ...plant, id: Date.now().toString() }],
        })),
      updatePlant: (id, updatedPlant) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, ...updatedPlant } : plant
          ),
        })),
      deletePlant: (id) =>
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
        })),
      addGrowSpace: (growSpace) =>
        set((state) => ({
          growSpaces: [...state.growSpaces, { ...growSpace, id: Date.now().toString() }],
        })),
      updateGrowSpace: (id, updatedGrowSpace) =>
        set((state) => ({
          growSpaces: state.growSpaces.map((growSpace) =>
            growSpace.id === id ? { ...growSpace, ...updatedGrowSpace } : growSpace
          ),
        })),
      deleteGrowSpace: (id) =>
        set((state) => ({
          growSpaces: state.growSpaces.filter((growSpace) => growSpace.id !== id),
        })),
      addFeedingEntry: (plantId, entry) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  feedingSchedule: [
                    ...plant.feedingSchedule,
                    { ...entry, id: Date.now().toString() },
                  ],
                }
              : plant
          ),
        })),
      addTrainingNote: (plantId, note) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  trainingNotes: [...plant.trainingNotes, { ...note, id: Date.now().toString() }],
                }
              : plant
          ),
        })),
      addIPMNote: (plantId, note) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  ipmNotes: [...plant.ipmNotes, { ...note, id: Date.now().toString() }],
                }
              : plant
          ),
        })),
      addPhoto: (plantId, photo) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  photos: [...plant.photos, { ...photo, id: Date.now().toString() }],
                }
              : plant
          ),
        })),
    }),
    {
      name: 'grow-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);