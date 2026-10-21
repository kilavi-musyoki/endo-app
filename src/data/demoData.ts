import { LogEntry } from '../types';

/**
 * Generates fictional 90-day sample values to exercise the tracking and report UI.
 * The sample is not representative of a condition, clinical guidance, or treatment response.
 */
export const getSyntheticDemoData = (): LogEntry[] => {
  const entries: LogEntry[] = [];
  const today = new Date();
  
  // Format YYYY-MM-DD
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  for (let i = 85; i >= 0; i--) {
    const current = new Date();
    current.setDate(today.getDate() - i);
    const dateStr = formatDate(current);

    let entry: LogEntry | null = null;

    // Cycle 1: Days 78 to 74 ago
    if (i >= 74 && i <= 79) {
      const cycleDay = 79 - i + 1;
      if (cycleDay === 1) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 8,
          painLocations: ['pelvis', 'lower_back'],
          painDetails: [
            { location: 'pelvis', magnitude: 8, types: ['sharp_stabbing', 'cramping'] },
            { location: 'lower_back', magnitude: 6, types: ['dull_aching'] }
          ],
          dailyImpact: 'missed_school_work',
          symptoms: ['bloating_endo_belly', 'painful_bowel', 'lower_back_stiffness'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Mefenamic acid did not reduce the throbbing pain.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 2) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'heavy',
          painScore: 9,
          painLocations: ['pelvis', 'lower_back', 'thighs'],
          painDetails: [
            { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'throbbing'] },
            { location: 'lower_back', magnitude: 7, types: ['dull_aching'] },
            { location: 'thighs', magnitude: 8, types: ['shooting_electric'] }
          ],
          dailyImpact: 'bed_rest',
          symptoms: ['heavy_clots', 'painful_bowel', 'nausea', 'leg_weakness'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Severe cramps radiating to thighs. Soaked 4 pads today.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 3) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 7,
          painLocations: ['pelvis', 'lower_abdomen'],
          painDetails: [
            { location: 'pelvis', magnitude: 7, types: ['cramping', 'heaviness_pressure'] },
            { location: 'lower_abdomen', magnitude: 6, types: ['dull_aching'] }
          ],
          dailyImpact: 'mild_interference',
          symptoms: ['chronic_fatigue', 'bloating_endo_belly'],
          painkillerTaken: true,
          painkillerEffective: false,
          createdAt: dateStr,
        };
      } else if (cycleDay >= 4) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'light',
          painScore: 4,
          painLocations: ['pelvis'],
          painDetails: [
            { location: 'pelvis', magnitude: 4, types: ['dull_aching'] }
          ],
          dailyImpact: 'mild_interference',
          symptoms: ['chronic_fatigue'],
          painkillerTaken: false,
          createdAt: dateStr,
        };
      }
    }
    // Cycle 2: Days 50 to 45 ago
    else if (i >= 45 && i <= 51) {
      const cycleDay = 51 - i + 1;
      if (cycleDay === 1) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 8,
          painLocations: ['pelvis', 'lower_back', 'thighs'],
          painDetails: [
            { location: 'pelvis', magnitude: 8, types: ['cramping', 'sharp_stabbing'] },
            { location: 'lower_back', magnitude: 6, types: ['dull_aching'] },
            { location: 'thighs', magnitude: 7, types: ['shooting_electric'] }
          ],
          dailyImpact: 'missed_school_work',
          symptoms: ['painful_bowel', 'bloating_endo_belly', 'leg_weakness'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Could not sit through college lectures due to sharp pelvic spasms.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 2) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'heavy',
          painScore: 9,
          painLocations: ['pelvis', 'lower_back', 'thighs'],
          painDetails: [
            { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'throbbing'] },
            { location: 'lower_back', magnitude: 8, types: ['dull_aching'] },
            { location: 'thighs', magnitude: 8, types: ['shooting_electric', 'burning'] }
          ],
          dailyImpact: 'bed_rest',
          symptoms: ['heavy_clots', 'nausea', 'chronic_fatigue', 'brain_fog'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Paracetamol & Ibuprofen gave almost no relief.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 3) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 6,
          painLocations: ['pelvis'],
          painDetails: [
            { location: 'pelvis', magnitude: 6, types: ['cramping', 'heaviness_pressure'] }
          ],
          dailyImpact: 'mild_interference',
          symptoms: ['bloating_endo_belly'],
          painkillerTaken: true,
          painkillerEffective: false,
          createdAt: dateStr,
        };
      } else {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'light',
          painScore: 3,
          painLocations: ['pelvis'],
          painDetails: [
            { location: 'pelvis', magnitude: 3, types: ['dull_aching'] }
          ],
          dailyImpact: 'none',
          symptoms: [],
          painkillerTaken: false,
          createdAt: dateStr,
        };
      }
    }
    // Cycle 3: Days 22 to 17 ago
    else if (i >= 17 && i <= 23) {
      const cycleDay = 23 - i + 1;
      if (cycleDay === 1) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 8,
          painLocations: ['pelvis', 'lower_back'],
          painDetails: [
            { location: 'pelvis', magnitude: 8, types: ['sharp_stabbing', 'cramping'] },
            { location: 'lower_back', magnitude: 6, types: ['dull_aching'] }
          ],
          dailyImpact: 'missed_school_work',
          symptoms: ['painful_bowel', 'bloating_endo_belly'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Pain started 24 hours before flow.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 2) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'heavy',
          painScore: 9,
          painLocations: ['pelvis', 'lower_back', 'thighs'],
          painDetails: [
            { location: 'pelvis', magnitude: 9, types: ['sharp_stabbing', 'burning'] },
            { location: 'lower_back', magnitude: 7, types: ['dull_aching'] },
            { location: 'thighs', magnitude: 8, types: ['shooting_electric'] }
          ],
          dailyImpact: 'bed_rest',
          symptoms: ['heavy_clots', 'painful_urination', 'nausea', 'leg_weakness'],
          painkillerTaken: true,
          painkillerEffective: false,
          notes: 'Sharp shooting pain when using the bathroom.',
          createdAt: dateStr,
        };
      } else if (cycleDay === 3) {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'medium',
          painScore: 6,
          painLocations: ['pelvis'],
          painDetails: [
            { location: 'pelvis', magnitude: 6, types: ['cramping', 'heaviness_pressure'] }
          ],
          dailyImpact: 'mild_interference',
          symptoms: ['chronic_fatigue'],
          painkillerTaken: true,
          painkillerEffective: false,
          createdAt: dateStr,
        };
      } else {
        entry = {
          id: `demo-${dateStr}`,
          date: dateStr,
          flow: 'light',
          painScore: 4,
          painLocations: ['pelvis'],
          painDetails: [
            { location: 'pelvis', magnitude: 4, types: ['dull_aching'] }
          ],
          dailyImpact: 'none',
          symptoms: [],
          painkillerTaken: false,
          createdAt: dateStr,
        };
      }
    }
    // Additional fictional observations between the flow-entry groups.
    else if (i === 65 || i === 36 || i === 8 || i === 3) {
      entry = {
        id: `demo-${dateStr}`,
        date: dateStr,
        flow: 'none',
        painScore: 5,
        painLocations: ['pelvis', 'lower_abdomen'],
        painDetails: [
          { location: 'pelvis', magnitude: 5, types: ['dull_aching', 'heaviness_pressure'] },
          { location: 'lower_abdomen', magnitude: 4, types: ['dull_aching'] }
        ],
        dailyImpact: 'mild_interference',
        symptoms: ['ovulation_pain', 'bloating_endo_belly', 'chronic_fatigue'],
        painkillerTaken: false,
        notes: 'Mid-cycle deep pelvic ache despite no menstrual period.',
        createdAt: dateStr,
      };
    }

    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
};
