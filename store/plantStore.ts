import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Plant, GrowSpace, FeedingEntry, TrainingNote, IPMNote, Photo, TimelineEntry, EnvironmentalReading, HarvestEntry } from '@/types';
import { plantData, growSpaceData } from '@/mocks/growData';

interface PlantState {
  plants: Plant[];
  growSpaces: GrowSpace[];
  harvestEntries: HarvestEntry[];
  
  // Plant operations
  addPlant: (plant: Omit<Plant, 'id'>) => void;
  updatePlant: (id: string, plant: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  
  // Grow space operations
  addGrowSpace: (growSpace: Omit<GrowSpace, 'id'>) => void;
  updateGrowSpace: (id: string, growSpace: Partial<GrowSpace>) => void;
  deleteGrowSpace: (id: string) => void;
  
  // Plant detail operations
  addFeedingEntry: (plantId: string, entry: Omit<FeedingEntry, 'id'>) => void;
  addTrainingNote: (plantId: string, note: Omit<TrainingNote, 'id'>) => void;
  addIPMNote: (plantId: string, note: Omit<IPMNote, 'id'>) => void;
  addPhoto: (plantId: string, photo: Omit<Photo, 'id'>) => void;
  addTimelineEntry: (plantId: string, entry: Omit<TimelineEntry, 'id'>) => void;
  addEnvironmentalReading: (plantId: string, reading: Omit<EnvironmentalReading, 'id'>) => void;
  
  // Harvest operations
  addHarvestEntry: (entry: Omit<HarvestEntry, 'id'>) => void;
  updateHarvestEntry: (id: string, entry: Partial<HarvestEntry>) => void;
}

export const usePlantStore = create<PlantState>()(
  persist(
    (set) => ({
      plants: plantData,
      growSpaces: growSpaceData,
      harvestEntries: [],
      
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
                  timelineEntries: [
                    ...plant.timelineEntries,
                    {
                      id: (Date.now() + 1).toString(),
                      date: entry.date,
                      type: 'feeding',
                      title: entry.type === 'water' ? 'Watering' : 'Feeding',
                      description: `${entry.type === 'water' ? 'Watered' : 'Fed'} ${entry.amount}L${entry.ppm ? ` (${entry.ppm} PPM)` : ''}`,
                      data: entry,
                    },
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
                  timelineEntries: [
                    ...plant.timelineEntries,
                    {
                      id: (Date.now() + 1).toString(),
                      date: note.date,
                      type: 'training',
                      title: `Training: ${note.technique}`,
                      description: note.notes,
                      photos: note.photos,
                    },
                  ],
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
                  timelineEntries: [
                    ...plant.timelineEntries,
                    {
                      id: (Date.now() + 1).toString(),
                      date: note.date,
                      type: 'ipm',
                      title: `IPM: ${note.issue || 'Treatment'}`,
                      description: note.notes,
                    },
                  ],
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
                  timelineEntries: [
                    ...plant.timelineEntries,
                    {
                      id: (Date.now() + 1).toString(),
                      date: photo.date,
                      type: 'photo',
                      title: 'Photo Added',
                      description: photo.notes || 'Progress photo',
                      photos: [photo.url],
                    },
                  ],
                }
              : plant
          ),
        })),
        
      addTimelineEntry: (plantId, entry) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  timelineEntries: [
                    ...plant.timelineEntries,
                    { ...entry, id: Date.now().toString() },
                  ],
                }
              : plant
          ),
        })),
        
      addEnvironmentalReading: (plantId, reading) =>
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === plantId
              ? {
                  ...plant,
                  environmentalData: [
                    ...plant.environmentalData,
                    { ...reading, id: Date.now().toString() },
                  ],
                  timelineEntries: [
                    ...plant.timelineEntries,
                    {
                      id: (Date.now() + 1).toString(),
                      date: reading.date,
                      type: 'environmental',
                      title: 'Environmental Reading',
                      description: `${reading.temperature}°F, ${reading.humidity}% RH${reading.vpd ? `, VPD: ${reading.vpd}` : ''}`,
                      data: reading,
                    },
                  ],
                }
              : plant
          ),
        })),
        
      addHarvestEntry: (entry) =>
        set((state) => ({
          harvestEntries: [...state.harvestEntries, { ...entry, id: Date.now().toString() }],
        })),
        
      updateHarvestEntry: (id, updatedEntry) =>
        set((state) => ({
          harvestEntries: state.harvestEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        })),
    }),
    {
      name: 'plant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);