import { Session, Effect, ConsumptionMethod } from '@/types';

export const sessionData: Session[] = [
  {
    id: '1',
    date: '2025-01-01T20:00:00',
    strains: ['1'], // Blue Dream
    method: 'vape_flower',
    dose: '0.2g',
    duration: 120,
    effects: [
      { category: 'head', name: 'Creative', intensity: 5 },
      { category: 'head', name: 'Euphoric', intensity: 4 },
      { category: 'head', name: 'Focused', intensity: 3 },
      { category: 'body', name: 'Relaxed', intensity: 4 },
      { category: 'mood', name: 'Happy', intensity: 5 },
      { category: 'negative', name: 'Dry Mouth', intensity: 2 },
    ],
    flavor: ['Berry', 'Sweet', 'Earthy'],
    aroma: ['Blueberry', 'Pine', 'Sweet'],
    rating: 4,
    notes: 'Perfect for creative evening session. Helped with writing music. Great balance of mental stimulation and physical relaxation.',
    setting: 'creative',
    purpose: ['creativity', 'relaxation'],
    participants: ['Alex'],
    favorite: true,
    guestReviews: [
      {
        id: '1',
        name: 'Alex',
        rating: 5,
        effects: [
          { category: 'head', name: 'Creative', intensity: 5 },
          { category: 'mood', name: 'Happy', intensity: 4 },
        ],
        notes: 'Loved the berry flavor and uplifting effects. Perfect for jamming!',
        date: '2025-01-01T20:30:00',
      },
    ],
    spiritualNotes: {
      moonPhase: 'Waxing Crescent',
      ritualName: 'Creative Flow',
      intention: 'Open creative channels and musical inspiration',
      messages: 'Strong connection to rhythm and melody',
    },
  },
  {
    id: '2',
    date: '2025-01-05T22:00:00',
    strains: ['2'], // Wedding Cake
    method: 'joint',
    dose: '0.5g',
    duration: 180,
    effects: [
      { category: 'body', name: 'Relaxed', intensity: 5 },
      { category: 'body', name: 'Pain Relief', intensity: 5 },
      { category: 'head', name: 'Sedated', intensity: 4 },
      { category: 'mood', name: 'Calm', intensity: 4 },
      { category: 'negative', name: 'Dry Mouth', intensity: 3 },
      { category: 'negative', name: 'Couch Lock', intensity: 3 },
    ],
    flavor: ['Vanilla', 'Sweet', 'Earthy', 'Cake'],
    aroma: ['Vanilla', 'Sweet', 'Dough'],
    rating: 5,
    notes: 'Excellent for pain relief and sleep. Very potent indica effects. Perfect nighttime strain.',
    setting: 'bedtime',
    purpose: ['pain relief', 'sleep', 'relaxation'],
    favorite: true,
  },
  {
    id: '3',
    date: '2025-01-10T16:00:00',
    strains: ['3', '1'], // Gelato #33 & Blue Dream mix
    method: 'vape_flower',
    dose: '0.3g',
    duration: 150,
    effects: [
      { category: 'mood', name: 'Happy', intensity: 5 },
      { category: 'head', name: 'Energetic', intensity: 3 },
      { category: 'head', name: 'Focused', intensity: 4 },
      { category: 'body', name: 'Relaxed', intensity: 3 },
      { category: 'negative', name: 'Dry Eyes', intensity: 2 },
    ],
    flavor: ['Sweet', 'Berry', 'Citrus', 'Creamy'],
    aroma: ['Sweet', 'Fruity', 'Citrus'],
    rating: 4,
    notes: 'Great blend for afternoon productivity with mood boost. The combination worked really well together.',
    setting: 'solo',
    purpose: ['focus', 'productivity', 'mood enhancement'],
  },
];

export const effectOptions = {
  head: ['Creative', 'Euphoric', 'Focused', 'Energetic', 'Clear-headed', 'Cerebral', 'Uplifted', 'Alert', 'Sedated'],
  body: ['Relaxed', 'Pain Relief', 'Tingly', 'Heavy', 'Light', 'Energized', 'Numb', 'Warm'],
  mood: ['Happy', 'Giggly', 'Social', 'Talkative', 'Calm', 'Peaceful', 'Introspective', 'Confident'],
  negative: ['Dry Mouth', 'Dry Eyes', 'Anxious', 'Paranoid', 'Dizzy', 'Headache', 'Couch Lock', 'Foggy'],
};

export const flavorOptions: string[] = [
  'Earthy', 'Woody', 'Pine', 'Spicy', 'Herbal', 'Peppery',
  'Citrus', 'Lemon', 'Orange', 'Grapefruit', 'Lime',
  'Sweet', 'Berry', 'Blueberry', 'Grape', 'Cherry',
  'Tropical', 'Mango', 'Pineapple', 'Coconut',
  'Floral', 'Lavender', 'Rose',
  'Vanilla', 'Mint', 'Chocolate', 'Coffee', 'Cake',
  'Cheese', 'Diesel', 'Skunk', 'Gas', 'Fuel',
  'Ammonia', 'Chemical', 'Sour', 'Tangy',
];

export const aromaOptions: string[] = [
  'Earthy', 'Woody', 'Pine', 'Forest', 'Spicy', 'Herbal',
  'Citrus', 'Lemon', 'Orange', 'Grapefruit',
  'Sweet', 'Fruity', 'Berry', 'Blueberry', 'Grape',
  'Tropical', 'Mango', 'Pineapple',
  'Floral', 'Lavender', 'Rose', 'Perfume',
  'Vanilla', 'Mint', 'Chocolate', 'Dough',
  'Cheese', 'Diesel', 'Skunk', 'Gas', 'Fuel', 'Rubber',
  'Pungent', 'Sharp', 'Sour',
];

export const consumptionMethods: ConsumptionMethod[] = [
  'joint',
  'blunt', 
  'pipe',
  'bong',
  'vape_flower',
  'vape_concentrate',
  'dab',
  'edible',
  'tincture',
  'topical',
  'other',
];

export const purposeOptions: string[] = [
  'relaxation',
  'sleep',
  'pain relief',
  'creativity',
  'focus',
  'productivity',
  'social',
  'meditation',
  'exercise',
  'appetite',
  'mood enhancement',
  'anxiety relief',
  'depression relief',
  'recreation',
];