import { Cross, Phenotype } from '@/types';

export const crossData: Cross[] = [
  {
    id: '1',
    name: 'Blue Cake',
    mother: '1', // Blue Dream
    father: '2', // Wedding Cake
    date: '2025-04-10',
    status: 'testing',
    notes: 'Hoping for berry flavor with cake potency',
    phenotypes: [
      {
        id: '1',
        name: 'Blue Cake #1',
        description: 'Tall, sativa-dominant with blue hues',
        traits: ['Berry aroma', 'Fast growth', 'High yield'],
        photos: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
            date: '2025-05-15',
            notes: 'Vegetative growth',
          },
        ],
      },
      {
        id: '2',
        name: 'Blue Cake #2',
        description: 'Shorter, indica-dominant with dense buds',
        traits: ['Vanilla aroma', 'Dense buds', 'Purple stems'],
        photos: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
            date: '2025-05-15',
            notes: 'Vegetative growth',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Northern Gelato',
    mother: '4', // Northern Lights
    father: '3', // Gelato #33
    date: '2025-03-20',
    status: 'selected',
    notes: 'Combining classic indica effects with modern flavor',
    phenotypes: [
      {
        id: '1',
        name: 'Northern Gelato #1',
        description: 'Balanced hybrid with purple buds',
        traits: ['Sweet aroma', 'Fast flowering', 'Resinous'],
        photos: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
            date: '2025-04-15',
            notes: 'Vegetative growth',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Jack Dream',
    mother: '5', // Jack Herer
    father: '1', // Blue Dream
    date: '2025-05-01',
    status: 'archived',
    notes: 'Experimental cross, not stable enough',
    phenotypes: [
      {
        id: '1',
        name: 'Jack Dream #1',
        description: 'Sativa-dominant with spicy aroma',
        traits: ['Spicy-berry aroma', 'Tall', 'Airy buds'],
        photos: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1620421680514-ade98f46c139?q=80&w=1000',
            date: '2025-05-15',
            notes: 'Vegetative growth',
          },
        ],
      },
    ],
  },
];