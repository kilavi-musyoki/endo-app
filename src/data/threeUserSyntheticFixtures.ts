import { LogEntry, PainLocation, PainType, UserProfile } from '../types';

/**
 * Fictional UI/test fixtures only. These values are invented to exercise forms,
 * charts, summaries, and reports; they are not derived from patients or clinical
 * reference data and must not be used as normal/abnormal or urgency examples.
 * Dates are fixed so screenshots and manual checks are repeatable.
 */
export interface SyntheticUserFixture {
  id: string;
  label: string;
  testPurpose: string;
  profile: UserProfile;
  entries: LogEntry[];
}

interface ScenarioPattern {
  id: string;
  label: string;
  testPurpose: string;
  scores: number[];
  impacts: LogEntry['dailyImpact'][];
  locations: PainLocation[];
  painTypes: PainType[];
  symptomDays: Record<number, string[]>;
  familyHistory: UserProfile['familyHistoryEndometriosis'];
  age: number;
  ageAtFirstPeriod: number;
}

const FIXTURE_START_UTC = Date.UTC(2026, 6, 24);
const FIXTURE_DAYS = 90;

const scenarios: ScenarioPattern[] = [
  {
    id: 'scenario-a',
    label: 'Scenario A — lower recorded scores',
    testPurpose: 'UI coverage for mostly low entered scores, varied flow, and little reported disruption. This is not a normal-range example.',
    scores: [0, 1, 0, 2, 1, 0, 0, 1, 0, 2, 0, 1, 0, 0, 1, 2, 0, 0, 1, 0, 0, 2, 1, 0, 0, 1, 0, 0, 2, 0],
    impacts: ['none', 'none', 'none', 'mild_interference', 'none', 'none', 'none'],
    locations: ['pelvis'],
    painTypes: ['cramping', 'dull_aching'],
    symptomDays: { 1: ['bloating_endo_belly'], 8: ['chronic_fatigue'], 16: ['brain_fog'], 25: ['lower_back_stiffness'] },
    familyHistory: 'prefer_not_to_say',
    age: 29,
    ageAtFirstPeriod: 13,
  },
  {
    id: 'scenario-b',
    label: 'Scenario B — fluctuating recorded scores',
    testPurpose: 'UI coverage for changing scores, several symptom categories, and mixed reported daily impact. This is not a moderate-risk example.',
    scores: [2, 4, 5, 6, 4, 3, 1, 2, 3, 4, 2, 1, 3, 5, 4, 2, 1, 3, 4, 2, 1, 2, 5, 6, 3, 2, 1, 3, 4, 2],
    impacts: ['mild_interference', 'missed_school_work', 'mild_interference', 'none', 'mild_interference', 'none', 'none'],
    locations: ['pelvis', 'lower_back', 'lower_abdomen'],
    painTypes: ['cramping', 'sharp_stabbing', 'dull_aching'],
    symptomDays: { 1: ['bloating_endo_belly', 'nausea'], 6: ['painful_bowel'], 12: ['chronic_fatigue'], 20: ['constipation_diarrhea'], 24: ['brain_fog'] },
    familyHistory: 'unsure',
    age: 34,
    ageAtFirstPeriod: 12,
  },
  {
    id: 'scenario-c',
    label: 'Scenario C — frequent higher recorded scores',
    testPurpose: 'UI coverage for frequent higher entered scores, multiple reported locations, and greater recorded daily impact. This is not a critical or urgent classification.',
    scores: [6, 8, 9, 8, 7, 6, 5, 7, 8, 6, 5, 7, 9, 8, 7, 6, 5, 8, 9, 7, 6, 5, 7, 8, 9, 6, 5, 7, 8, 6],
    impacts: ['missed_school_work', 'bed_rest', 'missed_school_work', 'mild_interference', 'bed_rest', 'missed_school_work', 'mild_interference'],
    locations: ['pelvis', 'lower_back', 'thighs'],
    painTypes: ['cramping', 'sharp_stabbing', 'throbbing', 'shooting_electric'],
    symptomDays: { 1: ['heavy_clots', 'nausea'], 3: ['painful_bowel', 'bloating_endo_belly'], 8: ['leg_weakness', 'chronic_fatigue'], 14: ['painful_urination'], 20: ['constipation_diarrhea', 'brain_fog'], 25: ['lower_back_stiffness'] },
    familyHistory: 'yes',
    age: 31,
    ageAtFirstPeriod: 11,
  },
];

const dateAtDay = (offset: number): string => new Date(FIXTURE_START_UTC + offset * 86_400_000).toISOString().slice(0, 10);

const buildProfile = (scenario: ScenarioPattern): UserProfile => ({
  name: `Synthetic User ${scenario.id.slice(-1).toUpperCase()}`,
  age: scenario.age,
  ageAtFirstPeriod: scenario.ageAtFirstPeriod,
  pregnancies: 0,
  tryingToConceive: false,
  monthsTryingToConceive: null,
  familyHistoryEndometriosis: scenario.familyHistory,
  knownConditions: 'Synthetic fixture value only',
  language: 'en',
  isDemoMode: true,
  onboardingCompleted: true,
});

const buildEntries = (scenario: ScenarioPattern): LogEntry[] => Array.from({ length: FIXTURE_DAYS }, (_, dayIndex) => {
  const date = dateAtDay(dayIndex);
  const cycleDay = dayIndex % 28;
  const inPeriod = cycleDay <= 4;
  const flow: LogEntry['flow'] = !inPeriod
    ? 'none'
    : cycleDay === 0 ? 'medium'
      : cycleDay === 1 ? 'heavy'
        : cycleDay === 2 ? 'medium'
          : cycleDay === 3 ? 'light' : 'spotting';
  const painScore = scenario.scores[dayIndex % scenario.scores.length];
  const painLocations = painScore > 0 ? scenario.locations : [];
  const painDetails = painLocations.map((location, locationIndex) => ({
    location,
    magnitude: Math.min(10, Math.max(0, painScore - Math.min(locationIndex, 2))),
    types: [scenario.painTypes[(dayIndex + locationIndex) % scenario.painTypes.length]],
  }));
  const painkillerTaken = painScore >= 4 && dayIndex % 4 !== 0;
  const impact = scenario.impacts[dayIndex % scenario.impacts.length];
  const symptoms = scenario.symptomDays[cycleDay] ?? [];
  const periodStart = cycleDay === 0;
  const periodEnd = cycleDay === 4;

  return {
    id: `${scenario.id}-${date}`,
    date,
    flow,
    periodStart,
    periodEnd,
    padsOrTamponsUsed: inPeriod ? 1 + (dayIndex % 5) : 0,
    soakedWithinHour: inPeriod && flow === 'heavy' && scenario.id === 'scenario-c',
    largeClots: inPeriod && cycleDay === 1 && scenario.id === 'scenario-c',
    painScore,
    painTiming: painScore === 0 ? [] : inPeriod ? ['during_period'] : ['other'],
    painContexts: painScore > 0 && dayIndex % 9 === 0 ? ['bowel_movement'] : [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: flow === 'none' && dayIndex % 17 === 0,
    moodSymptoms: dayIndex % 11 === 0 ? ['low_mood'] : [],
    painLocations,
    painDetails,
    dailyImpact: impact,
    symptoms,
    painkillerTaken,
    painkillerEffective: painkillerTaken ? (dayIndex % 3 === 0 ? true : dayIndex % 2 === 0 ? 'partly' : false) : null,
    notes: `Fictional UI fixture observation ${dayIndex + 1}; no real person data.`,
    createdAt: `${date}T12:00:00.000Z`,
  };
});

/** Three complete synthetic profiles, each with 90 daily entries (2026-07-24–2026-10-21). */
export const threeUserSyntheticFixtures: SyntheticUserFixture[] = scenarios.map((scenario) => ({
  id: scenario.id,
  label: scenario.label,
  testPurpose: scenario.testPurpose,
  profile: buildProfile(scenario),
  entries: buildEntries(scenario),
}));
