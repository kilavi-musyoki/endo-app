import { LogEntry, PainLocation, PainType, UserProfile } from '../types';
import { dateToLocalIso } from '../utils/dates';

/**
 * Fictional but clinically realistic UI/test fixtures.
 * Modeled after three distinct clinical scenarios:
 * - Scenario A: Mild / lower recorded scores (mild dysmenorrhea, responsive to OTC painkillers)
 * - Scenario B: Fluctuating scores with GI involvement (marked bloating/endo belly, bowel symptoms)
 * - Scenario C: Severe classic endometriosis (heavy bleeding, pain radiating to thighs/rectum, bed rest)
 *
 * Dates are calculated dynamically relative to today so recent charts and calendar
 * strips are always populated when loaded.
 */
export interface SyntheticUserFixture {
  id: string;
  label: string;
  testPurpose: string;
  profile: UserProfile;
  entries: LogEntry[];
}

interface ScenarioConfig {
  id: string;
  name: string;
  label: string;
  testPurpose: string;
  age: number;
  ageAtFirstPeriod: number;
  pregnancies: number;
  tryingToConceive: boolean;
  monthsTrying: number | null;
  familyHistory: UserProfile['familyHistoryEndometriosis'];
  knownConditions: string;
  cycleLength: number;
  periodDuration: number;
  periodScores: number[];
  midCycleScore: number;
  baselineScore: number;
  locations: PainLocation[];
  painTypes: PainType[];
  painkillerName: string;
  painkillerEffectiveRule: (score: number) => boolean | 'partly' | null;
  impactRule: (score: number, inPeriod: boolean) => LogEntry['dailyImpact'];
  symptomsRule: (cycleDay: number, inPeriod: boolean) => string[];
  notesRule: (cycleDay: number, score: number, inPeriod: boolean) => string;
}

const scenarioConfigs: ScenarioConfig[] = [
  {
    id: 'scenario-a',
    name: 'Faith N.',
    label: 'Scenario A — Mild / Lower Recorded Scores (Faith N., 26)',
    testPurpose: 'Exercises the interface for mild, manageable symptoms: regular 28-day cycles, mild period pain (2–4/10), good relief from paracetamol, and minimal daily disruption.',
    age: 26,
    ageAtFirstPeriod: 13,
    pregnancies: 0,
    tryingToConceive: false,
    monthsTrying: null,
    familyHistory: 'no',
    knownConditions: 'None',
    cycleLength: 28,
    periodDuration: 4,
    periodScores: [3, 4, 3, 1],
    midCycleScore: 0,
    baselineScore: 0,
    locations: ['pelvis'],
    painTypes: ['cramping', 'dull_aching'],
    painkillerName: 'Paracetamol 500mg',
    painkillerEffectiveRule: (score) => (score >= 3 ? true : null),
    impactRule: (score) => (score >= 4 ? 'mild_interference' : 'none'),
    symptomsRule: (cycleDay, inPeriod) => {
      if (inPeriod && cycleDay === 0) return ['bloating_endo_belly'];
      if (inPeriod && cycleDay === 1) return ['chronic_fatigue'];
      return [];
    },
    notesRule: (cycleDay, score, inPeriod) => {
      if (inPeriod && cycleDay === 0) return 'Period started. Mild lower abdominal cramps; paracetamol helped within an hour.';
      if (inPeriod && cycleDay === 1) return 'Moderate flow. Took a warm shower and went to work as usual.';
      if (inPeriod && cycleDay === 3) return 'Period almost done. Feeling normal.';
      return score > 0 ? 'Slight pelvic twinge, nothing unusual.' : 'Normal day, felt good.';
    },
  },
  {
    id: 'scenario-b',
    name: 'Brenda O.',
    label: 'Scenario B — Fluctuating Cycle & GI Symptoms (Brenda O., 34)',
    testPurpose: 'Exercises the interface for fluctuating 29-day cycles, moderate pain (4–6/10), pronounced bloating (endo belly), bowel symptoms, and partial painkiller response.',
    age: 34,
    ageAtFirstPeriod: 12,
    pregnancies: 1,
    tryingToConceive: true,
    monthsTrying: 6,
    familyHistory: 'unsure',
    knownConditions: 'Irritable bowel syndrome (IBS)',
    cycleLength: 29,
    periodDuration: 5,
    periodScores: [6, 7, 5, 4, 2],
    midCycleScore: 4,
    baselineScore: 1,
    locations: ['pelvis', 'lower_back', 'lower_abdomen'],
    painTypes: ['cramping', 'sharp_stabbing', 'heaviness_pressure', 'dull_aching'],
    painkillerName: 'Ibuprofen 400mg',
    painkillerEffectiveRule: (score) => (score >= 6 ? 'partly' : score >= 4 ? true : null),
    impactRule: (score, inPeriod) => {
      if (inPeriod && score >= 7) return 'missed_school_work';
      if (score >= 4) return 'mild_interference';
      return 'none';
    },
    symptomsRule: (cycleDay, inPeriod) => {
      if (inPeriod && cycleDay <= 1) return ['bloating_endo_belly', 'painful_bowel', 'nausea', 'chronic_fatigue'];
      if (inPeriod && cycleDay === 2) return ['bloating_endo_belly', 'constipation_diarrhea'];
      if (cycleDay === 14) return ['ovulation_pain', 'bloating_endo_belly'];
      return cycleDay % 8 === 0 ? ['bloating_endo_belly'] : [];
    },
    notesRule: (cycleDay, score, inPeriod) => {
      if (inPeriod && cycleDay === 0) return 'Heavy cramping on day 1. Painful bowel movements made morning difficult.';
      if (inPeriod && cycleDay === 1) return 'Severe bloating — stomach looks 5 months pregnant (endo belly). Stayed home from work.';
      if (inPeriod && cycleDay === 2) return 'Alternating between constipation and loose stool. Ibuprofen only slightly relieved pelvic ache.';
      if (cycleDay === 14) return 'Mid-cycle ovulation pain on left side with lower abdomen fullness.';
      return score >= 3 ? 'Lingering pelvic pressure and lower back stiffness.' : 'Quiet day, manageable energy.';
    },
  },
  {
    id: 'scenario-c',
    name: 'Wanjiku M.',
    label: 'Scenario C — Severe Classic Endometriosis Pattern (Wanjiku M., 31)',
    testPurpose: 'Exercises the interface for severe classic endometriosis: heavy bleeding with clots, peak pain (8–9/10), radiating pain to thighs and rectum, dyschezia, dyspareunia, and bed rest.',
    age: 31,
    ageAtFirstPeriod: 11,
    pregnancies: 0,
    tryingToConceive: true,
    monthsTrying: 14,
    familyHistory: 'yes',
    knownConditions: 'Severe dysmenorrhea, suspected adenomyosis',
    cycleLength: 28,
    periodDuration: 5,
    periodScores: [8, 9, 7, 5, 3],
    midCycleScore: 5,
    baselineScore: 2,
    locations: ['pelvis', 'lower_back', 'thighs', 'rectum'],
    painTypes: ['sharp_stabbing', 'cramping', 'shooting_electric', 'burning', 'throbbing'],
    painkillerName: 'Mefenamic acid 500mg & Paracetamol',
    painkillerEffectiveRule: (score) => (score >= 7 ? false : score >= 4 ? 'partly' : null),
    impactRule: (score, inPeriod) => {
      if (inPeriod && score >= 9) return 'bed_rest';
      if (inPeriod && score >= 7) return 'missed_school_work';
      if (score >= 4) return 'mild_interference';
      return 'none';
    },
    symptomsRule: (cycleDay, inPeriod) => {
      if (inPeriod && cycleDay === 0) return ['painful_bowel', 'bloating_endo_belly', 'lower_back_stiffness'];
      if (inPeriod && cycleDay === 1) return ['heavy_clots', 'painful_bowel', 'nausea', 'leg_weakness', 'chronic_fatigue', 'brain_fog'];
      if (inPeriod && cycleDay === 2) return ['heavy_clots', 'bloating_endo_belly', 'chronic_fatigue'];
      if (cycleDay === 13) return ['ovulation_pain', 'bloating_endo_belly'];
      if (cycleDay === 19) return ['pain_with_intimacy'];
      return cycleDay % 9 === 0 ? ['lower_back_stiffness', 'chronic_fatigue'] : [];
    },
    notesRule: (cycleDay, score, inPeriod) => {
      if (inPeriod && cycleDay === 0) return 'Severe cramps started hours before flow. Excruciating pain with bowel movements; unable to work.';
      if (inPeriod && cycleDay === 1) return 'Bed rest all day. Soaked pad in under an hour; passing dark clots. Pain shooting down thighs into knees.';
      if (inPeriod && cycleDay === 2) return 'Painkillers not touching the deep burning ache. Extreme exhaustion and brain fog.';
      if (cycleDay === 13) return 'Sharp ovulation pain in lower pelvis. Abdomen visibly swollen.';
      if (cycleDay === 19) return 'Deep pelvic pain during intimacy; felt sore for hours afterwards.';
      return score >= 3 ? 'Pelvic heaviness and lower back ache; heating pad used in evening.' : 'Relatively stable day.';
    },
  },
];

const FIXTURE_DAYS = 90;

const buildProfile = (config: ScenarioConfig): UserProfile => ({
  name: config.name,
  age: config.age,
  ageAtFirstPeriod: config.ageAtFirstPeriod,
  pregnancies: config.pregnancies,
  tryingToConceive: config.tryingToConceive,
  monthsTryingToConceive: config.monthsTrying,
  familyHistoryEndometriosis: config.familyHistory,
  knownConditions: config.knownConditions,
  language: 'en',
  isDemoMode: true,
  onboardingCompleted: true,
});

const buildEntries = (config: ScenarioConfig): LogEntry[] => {
  const today = new Date();
  const entries: LogEntry[] = [];

  for (let dayIndex = FIXTURE_DAYS - 1; dayIndex >= 0; dayIndex--) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayIndex);
    const date = dateToLocalIso(d);

    const cycleDay = (FIXTURE_DAYS - 1 - dayIndex) % config.cycleLength;
    const inPeriod = cycleDay < config.periodDuration;

    let flow: LogEntry['flow'] = 'none';
    if (inPeriod) {
      if (cycleDay === 0) flow = 'medium';
      else if (cycleDay === 1) flow = 'heavy';
      else if (cycleDay === 2) flow = 'medium';
      else if (cycleDay === 3) flow = 'light';
      else flow = 'spotting';
    }

    let painScore: number;
    if (inPeriod) {
      painScore = config.periodScores[cycleDay] ?? 2;
    } else if (cycleDay === Math.floor(config.cycleLength / 2)) {
      painScore = config.midCycleScore;
    } else if (cycleDay === 19 && config.id === 'scenario-c') {
      painScore = 6;
    } else {
      painScore = config.baselineScore;
    }

    const painLocations: PainLocation[] = painScore > 0 ? config.locations : [];
    const painDetails = painLocations.map((location, locIdx) => ({
      location,
      magnitude: Math.max(1, painScore - Math.min(locIdx, 2)),
      types: [config.painTypes[(cycleDay + locIdx) % config.painTypes.length]],
    }));

    const painkillerTaken = painScore >= 4;
    const painkillerEffective = painkillerTaken ? config.painkillerEffectiveRule(painScore) : null;
    const impact = config.impactRule(painScore, inPeriod);
    const symptoms = config.symptomsRule(cycleDay, inPeriod);
    const periodStart = cycleDay === 0;
    const periodEnd = cycleDay === config.periodDuration - 1;

    const soakedWithinHour = inPeriod && flow === 'heavy' && config.id === 'scenario-c';
    const largeClots = inPeriod && cycleDay <= 1 && config.id === 'scenario-c';

    const painTiming: import('../types').PainTiming[] = inPeriod
      ? ['during_period']
      : cycleDay === Math.floor(config.cycleLength / 2)
      ? ['mid_cycle']
      : painScore > 0
      ? ['other']
      : [];

    const painContexts: import('../types').PainContext[] = [];
    if (symptoms.includes('painful_bowel')) painContexts.push('bowel_movement');
    if (symptoms.includes('painful_urination')) painContexts.push('urination');
    if (symptoms.includes('pain_with_intimacy')) painContexts.push('sex');

    const note = config.notesRule(cycleDay, painScore, inPeriod);

    entries.push({
      id: `${config.id}-${date}`,
      date,
      flow,
      periodStart,
      periodEnd,
      padsOrTamponsUsed: inPeriod ? (flow === 'heavy' ? 6 : flow === 'medium' ? 4 : 2) : 0,
      soakedWithinHour,
      largeClots,
      painScore,
      painTiming,
      painContexts,
      bloodInStool: false,
      bloodInUrine: false,
      bleedingBetweenPeriods: false,
      moodSymptoms: painScore >= 7 ? ['low_mood'] : [],
      painLocations,
      painDetails,
      dailyImpact: impact,
      symptoms,
      painkillerTaken,
      painkillerName: painkillerTaken ? config.painkillerName : undefined,
      painkillerEffective,
      notes: note,
      createdAt: `${date}T10:00:00.000Z`,
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/** Three complete, authentic synthetic profiles, each with 90 daily entries ending on today. */
export const threeUserSyntheticFixtures: SyntheticUserFixture[] = scenarioConfigs.map((config) => ({
  id: config.id,
  label: config.label,
  testPurpose: config.testPurpose,
  profile: buildProfile(config),
  entries: buildEntries(config),
}));
