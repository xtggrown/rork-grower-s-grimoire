import { Plant, GrowSpace, GrowStage } from '@/types';

export const growSpaceData: GrowSpace[] = [
  {
    id: '1',
    name: 'Tent 1 - 4x4',
    type: 'indoor',
    active: true,
    plants: ['1', '2'],
  },
  {
    id: '2',
    name: 'Outdoor Garden',
    type: 'outdoor',
    active: true,
    plants: ['3'],
  },
  {
    id: '3',
    name: 'Greenhouse',
    type: 'greenhouse',
    active: false,
    plants: [],
  },
];

export const plantData: Plant[] = [
  {
    id: '1',
    strain: 'Blue Dream',
    breeder: 'Humboldt Seeds',
    lineage: 'Blueberry x Haze',
    medium: 'Coco/Perlite',
    nutrients: ['General Hydroponics Flora Series', 'CalMag'],
    feedingSchedule: [
      {
        id: '1',
        date: '2025-06-01',
        type: 'nutrients',
        amount: 1,
        nutrients: ['Flora Micro', 'Flora Grow', 'Flora Bloom'],
        ppm: 650,
        ph: 6.2,
      },
      {
        id: '2',
        date: '2025-06-03',
        type: 'water',
        amount: 1,
        ph: 6.3,
      },
    ],
    trainingNotes: [
      {
        id: '1',
        date: '2025-06-05',
        technique: 'LST',
        notes: 'Tied down main stem and 4 branches',
      },
    ],
    ipmNotes: [
      {
        id: '1',
        date: '2025-06-10',
        issue: 'Fungus gnats',
        treatment: 'Neem oil spray',
        notes: 'Light infestation, treated soil surface',
      },
    ],
    stage: 'vegetative',
    startDate: '2025-05-15',
    photos: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1620463594504-5bd9505f35d4?q=80&w=1000',
        date: '2025-05-20',
        notes: 'Day 5 - seedling',
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
        date: '2025-06-10',
        notes: 'Day 25 - vegetative growth',
      },
    ],
    growSpaceId: '1',
    seedId: '1',
  },
  {
    id: '2',
    strain: 'Wedding Cake',
    breeder: 'Seed Junky Genetics',
    lineage: 'Triangle Kush x Animal Mints',
    medium: 'Living Soil',
    nutrients: ['Compost Tea', 'Worm Castings'],
    feedingSchedule: [
      {
        id: '1',
        date: '2025-06-02',
        type: 'water',
        amount: 0.5,
        ph: 6.5,
      },
      {
        id: '2',
        date: '2025-06-05',
        type: 'nutrients',
        amount: 0.5,
        nutrients: ['Compost Tea'],
        ph: 6.7,
      },
    ],
    trainingNotes: [
      {
        id: '1',
        date: '2025-06-08',
        technique: 'Topping',
        notes: 'Topped at 5th node',
      },
    ],
    ipmNotes: [],
    stage: 'vegetative',
    startDate: '2025-05-20',
    photos: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
        date: '2025-05-25',
        notes: 'Day 5 - seedling',
      },
    ],
    growSpaceId: '1',
    seedId: '2',
  },
  {
    id: '3',
    strain: 'Northern Lights',
    breeder: 'Sensi Seeds',
    lineage: 'Afghani x Thai',
    medium: 'Soil',
    nutrients: ['Fox Farm Trio'],
    feedingSchedule: [
      {
        id: '1',
        date: '2025-06-01',
        type: 'nutrients',
        amount: 2,
        nutrients: ['Big Bloom', 'Grow Big'],
        ph: 6.4,
      },
    ],
    trainingNotes: [],
    ipmNotes: [],
    stage: 'seedling',
    startDate: '2025-05-25',
    photos: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
        date: '2025-05-30',
        notes: 'Day 5 - seedling',
      },
    ],
    growSpaceId: '2',
    seedId: '4',
  },
];