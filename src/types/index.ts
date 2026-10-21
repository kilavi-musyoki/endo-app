export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type PainTiming = 'before_period' | 'during_period' | 'after_period' | 'mid_cycle' | 'constant' | 'other';
export type PainContext = 'sex' | 'bowel_movement' | 'urination' | 'exercise';
export type FamilyHistory = 'yes' | 'no' | 'unsure' | 'prefer_not_to_say';

export type PainLocation = 
  | 'pelvis' 
  | 'lower_back' 
  | 'lower_abdomen' 
  | 'thighs' 
  | 'legs'
  | 'rectum'
  | 'bladder'
  | 'chest_ribs' 
  | 'generalized';

export type PainType = 
  | 'cramping'
  | 'sharp_stabbing'
  | 'burning'
  | 'dull_aching'
  | 'throbbing'
  | 'shooting_electric'
  | 'heaviness_pressure';

export interface PainDetail {
  location: PainLocation;
  magnitude: number; // 0-10 for this location
  types: PainType[];
}

export type DailyImpact = 
  | 'none' 
  | 'mild_interference' 
  | 'missed_school_work' 
  | 'bed_rest';

export type SymptomCategory = 
  | 'pelvic_cycle'
  | 'digestive'
  | 'urinary'
  | 'neuromuscular'
  | 'systemic_mood'
  | 'custom';

export type RelatedSymptom = 
  | 'painful_bowel' 
  | 'painful_urination' 
  | 'pain_with_intimacy' 
  | 'heavy_clots' 
  | 'bloating_endo_belly' 
  | 'nausea' 
  | 'chronic_fatigue'
  | 'ovulation_pain'
  | 'constipation_diarrhea'
  | 'leg_weakness'
  | 'lower_back_stiffness'
  | 'brain_fog';

export interface CustomSymptom {
  id: string;
  name: string;
  category?: SymptomCategory;
  createdAt: string;
}

export interface CareContact {
  id: string;
  name: string;
  type: string;
  countyOrTown: string;
  services: string;
  clinicianName?: string;
  specialty?: string;
  phone?: string;
  hours?: string;
  bookingLink?: string;
  mapLink?: string;
  costRange?: string;
  insurance?: string;
  addedAt: string;
}

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  flow: FlowLevel;
  periodStart?: boolean;
  periodEnd?: boolean;
  padsOrTamponsUsed?: number | null;
  soakedWithinHour?: boolean | null;
  largeClots?: boolean | null;
  painScore: number; // 0-10 peak/overall score
  painTiming?: PainTiming[];
  painContexts?: PainContext[];
  bloodInStool?: boolean | null;
  bloodInUrine?: boolean | null;
  bleedingBetweenPeriods?: boolean | null;
  moodSymptoms?: string[];
  painLocations: PainLocation[];
  painDetails?: PainDetail[]; // Specific location + type + magnitude
  dailyImpact: DailyImpact;
  symptoms: string[]; // RelatedSymptom or custom symptom id
  painkillerTaken: boolean;
  painkillerName?: string;
  painkillerEffective?: boolean | 'partly' | null;
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  age?: number | null;
  ageAtFirstPeriod?: number | null;
  pregnancies?: number | null;
  tryingToConceive?: boolean | null;
  monthsTryingToConceive?: number | null;
  familyHistoryEndometriosis?: FamilyHistory;
  knownConditions?: string;
  pin?: string;
  language: 'en' | 'sw';
  isDemoMode: boolean;
  onboardingCompleted: boolean;
}

export interface PainLocationMatrix {
  location: PainLocation;
  count: number;
  avgMagnitude: number;
  peakMagnitude: number;
  dominantTypes: PainType[];
}

export interface PainQualitySummary {
  type: PainType;
  count: number;
}

export interface ClinicianSummaryData {
  patientName: string;
  age?: number | null;
  ageAtFirstPeriod?: number | null;
  pregnancies?: number | null;
  tryingToConceive?: boolean | null;
  monthsTryingToConceive?: number | null;
  familyHistoryEndometriosis?: FamilyHistory;
  knownConditions?: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalCyclesTracked: number;
  cycleLengths: { periodStart: string; periodEnd?: string; cycleLengthDays?: number }[];
  descriptiveBaseline: { cyclesIncluded: number; averageCycleLengthDays: number | null; averagePeriodPain: number | null };
  dailyPain: { date: string; painScore: number }[];
  dailyObservations: Omit<LogEntry, 'id' | 'createdAt'>[];
  averagePainOnPeriod: number;
  peakPainScore: number;
  daysWithPain7Plus: number;
  daysMissedWorkOrSchool: number;
  commonSymptoms: { symptom: string; count: number; isCustom?: boolean }[];
  painLocationMatrix: PainLocationMatrix[];
  painQualitySummary: PainQualitySummary[];
  painkillerResponse: {
    takenCount: number;
    effectiveCount: number;
    partlyEffectiveCount: number;
    ineffectiveCount: number;
  };
}

