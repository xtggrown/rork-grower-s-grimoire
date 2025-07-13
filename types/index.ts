export type Seed = {
  id: string;
  strain: string;
  breeder: string;
  lineage: string;
  count: number;
  acquisitionDate: string;
  notes?: string;
  imageUrl?: string;
  seedType: 'regular' | 'feminized' | 'autoflower';
  floweringTime?: string;
  yieldExpected?: string;
  thcContent?: string;
  cbdContent?: string;
};

export type Flower = {
  id: string;
  strain: string;
  harvestDate: string;
  weight: number;
  jarId: string;
  notes?: string;
  imageUrl?: string;
  wetWeight?: number;
  dryWeight?: number;
  cureStartDate?: string;
  cureEndDate?: string;
  thcContent?: string;
  cbdContent?: string;
  plantId?: string;
};

export type Plant = {
  id: string;
  name?: string; // Custom plant name/ID
  strain: string;
  breeder: string;
  lineage: string;
  medium: string;
  nutrients: string[];
  feedingSchedule: FeedingEntry[];
  trainingNotes: TrainingNote[];
  ipmNotes: IPMNote[];
  timelineEntries: TimelineEntry[];
  stage: GrowStage;
  startDate: string;
  photos: Photo[];
  growSpaceId: string;
  seedId?: string;
  harvestDate?: string;
  isActive: boolean;
  yieldWet?: number;
  yieldDry?: number;
  floweringStartDate?: string;
  environmentalData: EnvironmentalReading[];
};

export type GrowSpace = {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor' | 'greenhouse';
  active: boolean;
  plants: string[]; // Plant IDs
  size?: string; // e.g., "4x4", "2x4"
  lightType?: string;
  ventilation?: string;
  notes?: string;
};

export type FeedingEntry = {
  id: string;
  date: string;
  type: 'water' | 'nutrients';
  amount: number;
  nutrients?: NutrientMix[];
  ppm?: number;
  ec?: number;
  ph?: number;
  runoffPpm?: number;
  runoffPh?: number;
  notes?: string;
  plantStage?: GrowStage;
};

export type NutrientMix = {
  name: string;
  amount: number;
  unit: 'ml' | 'g' | 'tsp' | 'tbsp';
};

export type TrainingNote = {
  id: string;
  date: string;
  technique: string;
  notes: string;
  photos?: string[];
};

export type IPMNote = {
  id: string;
  date: string;
  issue?: string;
  treatment?: string;
  notes: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
};

export type TimelineEntry = {
  id: string;
  date: string;
  type: 'note' | 'photo' | 'feeding' | 'training' | 'ipm' | 'stage_change' | 'environmental';
  title: string;
  description: string;
  photos?: string[];
  data?: any; // Additional data specific to entry type
};

export type EnvironmentalReading = {
  id: string;
  date: string;
  temperature: number;
  humidity: number;
  vpd?: number;
  co2?: number;
  lightIntensity?: number;
  notes?: string;
};

export type GrowStage = 
  | 'germination'
  | 'seedling'
  | 'vegetative'
  | 'pre_flower'
  | 'flowering'
  | 'harvest'
  | 'drying'
  | 'curing';

export type Photo = {
  id: string;
  url: string;
  date: string;
  notes?: string;
  stage?: GrowStage;
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
  pollinationDate?: string;
  seedCount?: number;
  f1Generation?: boolean;
};

export type Phenotype = {
  id: string;
  name: string;
  description: string;
  traits: PhenotypeScore[];
  photos: Photo[];
  cloneGeneration?: number;
  motherPlant?: boolean;
  selected?: boolean;
};

export type PhenotypeScore = {
  trait: string;
  score: number; // 1-10
  notes?: string;
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
  aroma: string[];
  rating: number; // 1-5
  notes?: string;
  guestReviews?: GuestReview[];
  setting: SessionSetting;
  purpose: string[];
  participants?: string[];
  photos?: string[];
  favorite?: boolean;
  spiritualNotes?: SpiritualSession;
};

export type SessionSetting = 'solo' | 'social' | 'ritual' | 'outdoor' | 'bedtime' | 'creative' | 'medical';

export type SpiritualSession = {
  moonPhase?: string;
  ritualName?: string;
  intention?: string;
  messages?: string;
};

export type ConsumptionMethod = 
  | 'joint'
  | 'blunt'
  | 'pipe'
  | 'bong'
  | 'vape_flower'
  | 'vape_concentrate'
  | 'dab'
  | 'edible'
  | 'tincture'
  | 'topical'
  | 'other';

export type Effect = {
  category: 'head' | 'body' | 'mood' | 'negative';
  name: string;
  intensity: number; // 1-5
};

export type GuestReview = {
  id: string;
  name: string;
  rating: number;
  effects: Effect[];
  notes: string;
  date: string;
};

export type CuringLog = {
  id: string;
  flowerId: string;
  date: string;
  humidity: number;
  temperature: number;
  burped: boolean;
  notes?: string;
  photos?: string[];
};

export type HarvestEntry = {
  id: string;
  plantId: string;
  harvestDate: string;
  wetWeight: number;
  estimatedDryWeight?: number;
  actualDryWeight?: number;
  trichomeColor: 'clear' | 'cloudy' | 'amber' | 'mixed';
  floweringDays: number;
  notes?: string;
  photos?: string[];
};

export type GrowCalculation = {
  type: 'cost' | 'yield' | 'timeline' | 'nutrient' | 'light';
  inputs: Record<string, any>;
  results: Record<string, any>;
  date: string;
};