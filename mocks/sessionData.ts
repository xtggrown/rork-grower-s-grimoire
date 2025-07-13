import { Session, Effect, ConsumptionMethod } from '@/types';

export const sessionData: Session[] = [
  {
    id: '1',
    date: '2025-07-01T20:00:00',
    strains: ['1'], // Blue Dream
    method: 'vape',
    dose: '0.2g',
    duration: 120,
    effects: [
      { name: 'Relaxed', intensity: 4 },
      { name: 'Creative', intensity: 5 },
      { name: 'Euphoric', intensity: 3 },
      { name: 'Hungry', intensity: 2 },
    ],
    flavor: ['Berry', 'Sweet', 'Earthy'],
    rating: 4,
    notes: 'Perfect for creative evening session. Helped with writing music.',
    guestReviews: [
      {
        id: '1',
        name: 'Alex',
        rating: 5,
        notes: 'Loved the berry flavor and uplifting effects',
        date: '2025-07-01T20:30:00',
      },
    ],
  },
  {
    id: '2',
    date: '2025-07-05T22:00:00',
    strains: ['2'], // Wedding Cake
    method: 'smoke',
    dose: '0.5g',
    duration: 180,
    effects: [
      { name: 'Relaxed', intensity: 5 },
      { name: 'Sleepy', intensity: 4 },
      { name: 'Pain Relief', intensity: 5 },
      { name: 'Dry Mouth', intensity: 3 },
    ],
    flavor: ['Vanilla', 'Sweet', 'Earthy'],
    rating: 5,
    notes: 'Excellent for pain relief and sleep. Very potent.',
  },
  {
    id: '3',
    date: '2025-07-10T16:00:00',
    strains: ['3', '1'], // Gelato #33 & Blue Dream
    method: 'vape',
    dose: '0.3g',
    duration: 150,
    effects: [
      { name: 'Happy', intensity: 5 },
      { name: 'Energetic', intensity: 3 },
      { name: 'Focused', intensity: 4 },
      { name: 'Dry Eyes', intensity: 2 },
    ],
    flavor: ['Sweet', 'Berry', 'Citrus'],
    rating: 4,
    notes: 'Great blend for afternoon productivity with mood boost.',
  },
];

export const effectOptions: string[] = [
  'Relaxed',
  'Happy',
  'Euphoric',
  'Uplifted',
  'Creative',
  'Energetic',
  'Focused',
  'Hungry',
  'Talkative',
  'Tingly',
  'Sleepy',
  'Pain Relief',
  'Dry Mouth',
  'Dry Eyes',
  'Anxious',
  'Paranoid',
  'Dizzy',
  'Headache',
];

export const flavorOptions: string[] = [
  'Earthy',
  'Woody',
  'Pine',
  'Spicy',
  'Herbal',
  'Peppery',
  'Citrus',
  'Lemon',
  'Orange',
  'Grapefruit',
  'Sweet',
  'Berry',
  'Blueberry',
  'Grape',
  'Tropical',
  'Mango',
  'Pineapple',
  'Floral',
  'Lavender',
  'Rose',
  'Vanilla',
  'Mint',
  'Cheese',
  'Diesel',
  'Skunk',
  'Ammonia',
  'Chemical',
];

export const consumptionMethods: ConsumptionMethod[] = [
  'smoke',
  'vape',
  'edible',
  'tincture',
  'concentrate',
  'other',
];