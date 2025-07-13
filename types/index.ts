export type Seed = {
  id: string;
  strain: string;
  breeder: string;
  lineage: string;
  count: number;
  acquisitionDate: string;
  notes?: string;
  imageUrl?: string;
};

export type Flower = {
  id: string;
  strain: string;
  harvestDate: string;
  weight: number;
  jarId: string;
  notes?: string;
  imageUrl?: string;
};

export type Plant = {
  id: string;
  strain: string;
  breeder: string;
  lineage: string;
  medium: string;
  nutrients: string[];
  feedingSchedule: FeedingEntry[];
  trainingNotes: TrainingNote[];
  ipmNotes: IPMNote[];
  stage: GrowStage;
  startDate: string;
  photos: Photo[];
  growSpaceId: string;
  seedId?: string;
};

export type GrowSpace = {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor' | 'greenhouse';
  active: boolean;
  plants: string[]; // Plant IDs
};

export type FeedingEntry = {
  id: string;
  date: string;
  type: 'water' | 'nutrients';
  amount: number;
  nutrients?: string[];
  ppm?: number;
  ph?: number;
  notes?: string;
};

export type TrainingNote = {
  id: string;
  date: string;
  technique: string;
  notes: string;
};

export type IPMNote = {
  id: string;
  date: string;
  issue?: string;
  treatment?: string;
  notes: string;
};

export type GrowStage = 
  | 'germination'
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'harvest'
  | 'drying'
  | 'curing';

export type Photo = {
  id: string;
  url: string;
  date: string;
  notes?: string;
};

export type Cross = {
  id: string;
  name: string;
  mother: string; // Seed ID
  father: string; // Seed ID
  date: string;
  status: 'testing' | 'selected' | 'archived';
  notes?: string;
  phenotypes: Phenotype[];
};

export type Phenotype = {
  id: string;
  name: string;
  description: string;
  traits: string[];
  photos: Photo[];
};

export type Session = {
  id: string;
  date: string;
  strains: string[]; // Flower IDs
  method: ConsumptionMethod;
  dose: string;
  duration: number; // minutes
  effects: Effect[];
  flavor: string[];
  rating: number; // 1-5
  notes?: string;
  guestReviews?: GuestReview[];
};

export type ConsumptionMethod = 
  | 'smoke'
  | 'vape'
  | 'edible'
  | 'tincture'
  | 'concentrate'
  | 'other';

export type Effect = {
  name: string;
  intensity: number; // 1-5
};

export type GuestReview = {
  id: string;
  name: string;
  rating: number;
  notes: string;
  date: string;
};