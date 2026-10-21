import { LogEntry, PainLocation, PainType } from '../types';
import { dateToLocalIso } from '../utils/dates';

/**
 * Generates a realistic, clinically authentic 90-day symptom and cycle dataset.
 * Modeled after a typical presentation of moderate-to-severe endometriosis:
 * - 3 tracked menstrual cycles (29-day and 28-day cycle lengths)
 * - Explicit period start and end markers
 * - Severe dysmenorrhea (pain 7-9/10), bed rest, and missed work
 * - Heavy menstrual flow with large clots (>2.5cm) and soaking pads
 * - Characteristic multi-site pain: pelvis, lower back, radiating thighs, bladder, rectum
 * - Characteristic qualities: sharp/stabbing, throbbing, shooting/electric, cramping
 * - Cyclical non-menstrual manifestations: ovulation pain, dyspareunia, dyschezia, 'endo belly'
 * - Authentic medication log with NSAID/paracetamol usage and realistic efficacy
 * - Natural, patient-written first-person notes
 */
export const getSyntheticDemoData = (): LogEntry[] => {
  const entries: LogEntry[] = [];
  const today = new Date();

  // Helper to build a date offset from today
  const getDateStr = (offsetDaysFromToday: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() - offsetDaysFromToday);
    return dateToLocalIso(d);
  };

  const createEntry = (
    daysAgo: number,
    data: Omit<LogEntry, 'id' | 'date' | 'createdAt'>,
    customNote?: string
  ): LogEntry => {
    const dateStr = getDateStr(daysAgo);
    return {
      id: `demo-${dateStr}`,
      date: dateStr,
      ...data,
      notes: customNote ?? data.notes,
      createdAt: `${dateStr}T08:30:00.000Z`,
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CYCLE 1: Days -73 to -69 (Period dates: Day -73 to Day -69)
  // ══════════════════════════════════════════════════════════════════════════

  // Premenstrual day
  entries.push(createEntry(74, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 5,
    painTiming: ['before_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['irritable', 'low_mood'],
    painLocations: ['pelvis', 'lower_back'],
    painDetails: [
      { location: 'pelvis', magnitude: 5, types: ['cramping', 'dull_aching'] },
      { location: 'lower_back', magnitude: 4, types: ['dull_aching'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['bloating_endo_belly', 'lower_back_stiffness', 'chronic_fatigue'],
    painkillerTaken: true,
    painkillerName: 'Paracetamol 500mg',
    painkillerEffective: 'partly',
  }, 'Pelvic heaviness and backache started 24 hours before flow. Always know my period is coming.'));

  // Day 1 (Cycle Start)
  entries.push(createEntry(73, {
    flow: 'medium',
    periodStart: true,
    periodEnd: false,
    padsOrTamponsUsed: 4,
    soakedWithinHour: false,
    largeClots: true,
    painScore: 8,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['low_mood'],
    painLocations: ['pelvis', 'lower_back'],
    painDetails: [
      { location: 'pelvis', magnitude: 8, types: ['sharp_stabbing', 'cramping'] },
      { location: 'lower_back', magnitude: 6, types: ['dull_aching'] },
    ],
    dailyImpact: 'missed_school_work',
    symptoms: ['painful_bowel', 'bloating_endo_belly', 'lower_back_stiffness'],
    painkillerTaken: true,
    painkillerName: 'Mefenamic acid 500mg',
    painkillerEffective: false,
  }, 'Woke up at 4am with sharp pelvic spasms. Mefenamic acid barely touched the pain; had to call in sick to work.'));

  // Day 2 (Peak Pain & Heavy Bleeding)
  entries.push(createEntry(72, {
    flow: 'heavy',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 6,
    soakedWithinHour: true,
    largeClots: true,
    painScore: 9,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement', 'urination'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['anxious'],
    painLocations: ['pelvis', 'lower_back', 'thighs'],
    painDetails: [
      { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'throbbing'] },
      { location: 'lower_back', magnitude: 7, types: ['dull_aching'] },
      { location: 'thighs', magnitude: 8, types: ['shooting_electric', 'burning'] },
    ],
    dailyImpact: 'bed_rest',
    symptoms: ['heavy_clots', 'painful_bowel', 'nausea', 'leg_weakness', 'chronic_fatigue'],
    painkillerTaken: true,
    painkillerName: 'Ibuprofen 400mg',
    painkillerEffective: false,
  }, 'Severe shooting pain radiating into my thighs. Soaked through a pad in under an hour around noon. Confined to bed with hot water bottle.'));

  // Day 3
  entries.push(createEntry(71, {
    flow: 'medium',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 4,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 6,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis', 'lower_abdomen'],
    painDetails: [
      { location: 'pelvis', magnitude: 6, types: ['cramping', 'heaviness_pressure'] },
      { location: 'lower_abdomen', magnitude: 5, types: ['dull_aching'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['bloating_endo_belly', 'chronic_fatigue'],
    painkillerTaken: true,
    painkillerName: 'Paracetamol 1000mg',
    painkillerEffective: 'partly',
  }, 'Abdomen swollen like a balloon (endo belly). Pain is down to a dull deep ache, able to work from the couch.'));

  // Day 4
  entries.push(createEntry(70, {
    flow: 'light',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 2,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 4,
    painTiming: ['during_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 4, types: ['dull_aching'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['chronic_fatigue', 'brain_fog'],
    painkillerTaken: false,
  }, 'Flow slowing down. Still feeling drained of energy and foggy-headed.'));

  // Day 5 (Cycle End)
  entries.push(createEntry(69, {
    flow: 'spotting',
    periodStart: false,
    periodEnd: true,
    padsOrTamponsUsed: 1,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 2,
    painTiming: ['after_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 2, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: [],
    painkillerTaken: false,
  }, 'Period ended today. Pelvis feels tender but back to routine.'));

  // Mid-cycle 1: Ovulation pain (Day 15 of cycle)
  entries.push(createEntry(59, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 5,
    painTiming: ['mid_cycle'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis', 'lower_abdomen'],
    painDetails: [
      { location: 'pelvis', magnitude: 5, types: ['sharp_stabbing', 'heaviness_pressure'] },
      { location: 'lower_abdomen', magnitude: 4, types: ['dull_aching'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['ovulation_pain', 'bloating_endo_belly'],
    painkillerTaken: false,
  }, 'Sharp localized ovulation pain on right side of pelvis lasting most of the afternoon. Waistband tight.'));

  // Non-menstrual symptom: Intimacy pain
  entries.push(createEntry(53, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 6,
    painTiming: ['other'],
    painContexts: ['sex'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['anxious'],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 6, types: ['sharp_stabbing', 'burning'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['pain_with_intimacy'],
    painkillerTaken: true,
    painkillerName: 'Ibuprofen 400mg',
    painkillerEffective: 'partly',
  }, 'Deep burning ache in pelvic floor during and after intimacy.'));

  // ══════════════════════════════════════════════════════════════════════════
  // CYCLE 2: Days -44 to -40 (29-day cycle from Day -73 to -44)
  // ══════════════════════════════════════════════════════════════════════════

  // Day 1 (Cycle Start)
  entries.push(createEntry(44, {
    flow: 'medium',
    periodStart: true,
    periodEnd: false,
    padsOrTamponsUsed: 4,
    soakedWithinHour: false,
    largeClots: true,
    painScore: 8,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['low_mood'],
    painLocations: ['pelvis', 'lower_back', 'thighs'],
    painDetails: [
      { location: 'pelvis', magnitude: 8, types: ['cramping', 'sharp_stabbing'] },
      { location: 'lower_back', magnitude: 6, types: ['dull_aching'] },
      { location: 'thighs', magnitude: 6, types: ['shooting_electric'] },
    ],
    dailyImpact: 'missed_school_work',
    symptoms: ['painful_bowel', 'bloating_endo_belly', 'leg_weakness'],
    painkillerTaken: true,
    painkillerName: 'Ibuprofen 400mg',
    painkillerEffective: false,
  }, 'Period started exactly 29 days after last one. Sharp rectal spasms when opening bowels; stayed home from work.'));

  // Day 2 (Peak Pain & Heavy Clots)
  entries.push(createEntry(43, {
    flow: 'heavy',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 7,
    soakedWithinHour: true,
    largeClots: true,
    painScore: 9,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement', 'urination'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['low_mood', 'anxious'],
    painLocations: ['pelvis', 'lower_back', 'thighs', 'rectum'],
    painDetails: [
      { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'throbbing'] },
      { location: 'lower_back', magnitude: 8, types: ['dull_aching'] },
      { location: 'thighs', magnitude: 8, types: ['shooting_electric', 'burning'] },
      { location: 'rectum', magnitude: 7, types: ['sharp_stabbing'] },
    ],
    dailyImpact: 'bed_rest',
    symptoms: ['heavy_clots', 'painful_bowel', 'nausea', 'brain_fog', 'chronic_fatigue'],
    painkillerTaken: true,
    painkillerName: 'Naproxen 500mg',
    painkillerEffective: false,
  }, 'Severe bleeding with clots larger than coins. Soaked through two pads within 2 hours. Intense burning nerve pain down legs.'));

  // Day 3
  entries.push(createEntry(42, {
    flow: 'medium',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 4,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 6,
    painTiming: ['during_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 6, types: ['cramping', 'heaviness_pressure'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['bloating_endo_belly', 'constipation_diarrhea'],
    painkillerTaken: true,
    painkillerName: 'Paracetamol 1000mg',
    painkillerEffective: 'partly',
  }, 'Digestive upset and cyclical diarrhea. Abdomen tender and hard to the touch.'));

  // Day 4
  entries.push(createEntry(41, {
    flow: 'light',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 2,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 3,
    painTiming: ['during_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 3, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: ['chronic_fatigue'],
    painkillerTaken: false,
  }, 'Light flow, pain manageable without painkillers.'));

  // Day 5 (Cycle End)
  entries.push(createEntry(40, {
    flow: 'spotting',
    periodStart: false,
    periodEnd: true,
    padsOrTamponsUsed: 1,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 2,
    painTiming: ['after_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 2, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: [],
    painkillerTaken: false,
  }, 'Marked period end. Glad this cycle is over.'));

  // Mid-cycle 2: Ovulation pain & spotting
  entries.push(createEntry(30, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 5,
    painTiming: ['mid_cycle'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis', 'lower_abdomen'],
    painDetails: [
      { location: 'pelvis', magnitude: 5, types: ['dull_aching', 'heaviness_pressure'] },
      { location: 'lower_abdomen', magnitude: 4, types: ['dull_aching'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['ovulation_pain', 'bloating_endo_belly'],
    painkillerTaken: false,
  }, 'Mid-cycle ovulation pain again. Deep dragging sensation in the pelvis.'));

  // Bleeding between periods (Day -23)
  entries.push(createEntry(23, {
    flow: 'spotting',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 1,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 4,
    painTiming: ['other'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: true,
    moodSymptoms: ['anxious'],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 4, types: ['cramping', 'dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: ['bloating_endo_belly'],
    painkillerTaken: false,
  }, 'Unscheduled light spotting 10 days before expected period. Lower abdominal cramp.'));

  // ══════════════════════════════════════════════════════════════════════════
  // CYCLE 3: Days -16 to -12 (28-day cycle from Day -44 to -16)
  // ══════════════════════════════════════════════════════════════════════════

  // Day 1 (Cycle Start)
  entries.push(createEntry(16, {
    flow: 'medium',
    periodStart: true,
    periodEnd: false,
    padsOrTamponsUsed: 5,
    soakedWithinHour: false,
    largeClots: true,
    painScore: 8,
    painTiming: ['during_period'],
    painContexts: ['bowel_movement'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['low_mood'],
    painLocations: ['pelvis', 'lower_back'],
    painDetails: [
      { location: 'pelvis', magnitude: 8, types: ['sharp_stabbing', 'cramping'] },
      { location: 'lower_back', magnitude: 7, types: ['dull_aching'] },
    ],
    dailyImpact: 'missed_school_work',
    symptoms: ['painful_bowel', 'bloating_endo_belly', 'lower_back_stiffness'],
    painkillerTaken: true,
    painkillerName: 'Mefenamic acid 500mg',
    painkillerEffective: false,
  }, 'Period started. Heavy cramping and back stiffness; had to take time off from work again.'));

  // Day 2 (Peak Pain & Bladder Symptoms)
  entries.push(createEntry(15, {
    flow: 'heavy',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 6,
    soakedWithinHour: true,
    largeClots: true,
    painScore: 9,
    painTiming: ['during_period'],
    painContexts: ['urination', 'bowel_movement'],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: ['anxious'],
    painLocations: ['pelvis', 'lower_back', 'thighs', 'bladder'],
    painDetails: [
      { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'burning'] },
      { location: 'lower_back', magnitude: 8, types: ['dull_aching'] },
      { location: 'thighs', magnitude: 8, types: ['shooting_electric'] },
      { location: 'bladder', magnitude: 7, types: ['burning'] },
    ],
    dailyImpact: 'bed_rest',
    symptoms: ['heavy_clots', 'painful_urination', 'nausea', 'leg_weakness', 'chronic_fatigue'],
    painkillerTaken: true,
    painkillerName: 'Ibuprofen 400mg',
    painkillerEffective: false,
  }, 'Burning pain when emptying bladder and passing bowel movements. Heavy clots, soaked pad in under an hour around 2pm. Confined to bed.'));

  // Day 3
  entries.push(createEntry(14, {
    flow: 'medium',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 3,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 6,
    painTiming: ['during_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 6, types: ['cramping', 'heaviness_pressure'] },
    ],
    dailyImpact: 'mild_interference',
    symptoms: ['chronic_fatigue', 'bloating_endo_belly'],
    painkillerTaken: true,
    painkillerName: 'Paracetamol 1000mg',
    painkillerEffective: 'partly',
  }, 'Pain easing slightly from peak, but deep dull ache and exhaustion remain.'));

  // Day 4
  entries.push(createEntry(13, {
    flow: 'light',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 2,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 3,
    painTiming: ['during_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 3, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: ['brain_fog'],
    painkillerTaken: false,
  }, 'Light flow. Able to get through normal daily activities.'));

  // Day 5 (Cycle End)
  entries.push(createEntry(12, {
    flow: 'spotting',
    periodStart: false,
    periodEnd: true,
    padsOrTamponsUsed: 1,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 2,
    painTiming: ['after_period'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 2, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: [],
    painkillerTaken: false,
  }, 'Period finished. Recording in app so I can print report for my upcoming gynaecologist visit.'));

  // Recent days (Day -3 and Day -1)
  entries.push(createEntry(3, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 4,
    painTiming: ['mid_cycle'],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 4, types: ['sharp_stabbing'] },
    ],
    dailyImpact: 'none',
    symptoms: ['ovulation_pain'],
    painkillerTaken: false,
  }, 'Mid-cycle ovulation twinge on left side.'));

  entries.push(createEntry(1, {
    flow: 'none',
    periodStart: false,
    periodEnd: false,
    padsOrTamponsUsed: 0,
    soakedWithinHour: false,
    largeClots: false,
    painScore: 1,
    painTiming: [],
    painContexts: [],
    bloodInStool: false,
    bloodInUrine: false,
    bleedingBetweenPeriods: false,
    moodSymptoms: [],
    painLocations: ['pelvis'],
    painDetails: [
      { location: 'pelvis', magnitude: 1, types: ['dull_aching'] },
    ],
    dailyImpact: 'none',
    symptoms: [],
    painkillerTaken: false,
  }, 'Normal day. Preparing questions for the doctor report.'));

  // Sort descending by date (most recent first)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
