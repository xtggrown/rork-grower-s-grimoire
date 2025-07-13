import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cross, Phenotype, Photo } from '@/types';
import { crossData } from '@/mocks/labData';

interface LabState {
  crosses: Cross[];
  addCross: (cross: Omit<Cross, 'id'>) => void;
  updateCross: (id: string, cross: Partial<Cross>) => void;
  deleteCross: (id: string) => void;
  addPhenotype: (crossId: string, phenotype: Omit<Phenotype, 'id'>) => void;
  updatePhenotype: (crossId: string, phenotypeId: string, phenotype: Partial<Phenotype>) => void;
  deletePhenotype: (crossId: string, phenotypeId: string) => void;
  addPhenotypePhoto: (crossId: string, phenotypeId: string, photo: Omit<Photo, 'id'>) => void;
}

export const useLabStore = create<LabState>()(
  persist(
    (set) => ({
      crosses: crossData,
      addCross: (cross) =>
        set((state) => ({
          crosses: [...state.crosses, { ...cross, id: Date.now().toString() }],
        })),
      updateCross: (id, updatedCross) =>
        set((state) => ({
          crosses: state.crosses.map((cross) =>
            cross.id === id ? { ...cross, ...updatedCross } : cross
          ),
        })),
      deleteCross: (id) =>
        set((state) => ({
          crosses: state.crosses.filter((cross) => cross.id !== id),
        })),
      addPhenotype: (crossId, phenotype) =>
        set((state) => ({
          crosses: state.crosses.map((cross) =>
            cross.id === crossId
              ? {
                  ...cross,
                  phenotypes: [...cross.phenotypes, { ...phenotype, id: Date.now().toString() }],
                }
              : cross
          ),
        })),
      updatePhenotype: (crossId, phenotypeId, updatedPhenotype) =>
        set((state) => ({
          crosses: state.crosses.map((cross) =>
            cross.id === crossId
              ? {
                  ...cross,
                  phenotypes: cross.phenotypes.map((phenotype) =>
                    phenotype.id === phenotypeId
                      ? { ...phenotype, ...updatedPhenotype }
                      : phenotype
                  ),
                }
              : cross
          ),
        })),
      deletePhenotype: (crossId, phenotypeId) =>
        set((state) => ({
          crosses: state.crosses.map((cross) =>
            cross.id === crossId
              ? {
                  ...cross,
                  phenotypes: cross.phenotypes.filter(
                    (phenotype) => phenotype.id !== phenotypeId
                  ),
                }
              : cross
          ),
        })),
      addPhenotypePhoto: (crossId, phenotypeId, photo) =>
        set((state) => ({
          crosses: state.crosses.map((cross) =>
            cross.id === crossId
              ? {
                  ...cross,
                  phenotypes: cross.phenotypes.map((phenotype) =>
                    phenotype.id === phenotypeId
                      ? {
                          ...phenotype,
                          photos: [...phenotype.photos, { ...photo, id: Date.now().toString() }],
                        }
                      : phenotype
                  ),
                }
              : cross
          ),
        })),
    }),
    {
      name: 'lab-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);