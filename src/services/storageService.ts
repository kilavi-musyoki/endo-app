import { 
  LogEntry, 
  UserProfile, 
  ClinicianSummaryData, 
  PainLocation, 
  PainType, 
  PainLocationMatrix, 
  PainQualitySummary,
  CustomSymptom,
  SymptomCategory,
  CareContact
} from '../types';
import { getSyntheticDemoData } from '../data/demoData';
import { SyntheticUserFixture, threeUserSyntheticFixtures } from '../data/threeUserSyntheticFixtures';
import { dateToLocalIso } from '../utils/dates';

const STORAGE_KEYS = {
  ENTRIES: 'endocare_entries',
  PROFILE: 'endocare_profile',
  DEMO_MODE: 'endocare_is_demo',
  PIN_LOCKED: 'endocare_is_locked',
  CUSTOM_SYMPTOMS: 'endocare_custom_symptoms',
  CARE_CONTACTS: 'endocare_care_contacts',
  DEMO_SCENARIO: 'endocare_demo_scenario'
};

const defaultProfile: UserProfile = {
  name: '',
  language: 'en',
  isDemoMode: true,
  onboardingCompleted: true,
  pin: '1234'
};

export class StorageService {
  static getCareContacts(): CareContact[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARE_CONTACTS) || '[]'); }
    catch { return []; }
  }

  static saveCareContact(contact: Omit<CareContact, 'id' | 'addedAt'>): CareContact {
    const contacts = this.getCareContacts();
    const saved = { ...contact, id: `care-${Date.now()}`, addedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CARE_CONTACTS, JSON.stringify([...contacts, saved]));
    return saved;
  }

  static deleteCareContact(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CARE_CONTACTS, JSON.stringify(this.getCareContacts().filter(item => item.id !== id)));
  }
  /** Retrieves all symptom logs, ordered by date descending */
  static getEntries(): LogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!raw) {
      if (localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'false') return [];
      const demoEntries = getSyntheticDemoData();
      this.saveEntries(demoEntries);
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
      return demoEntries;
    }
    try {
      const parsed: LogEntry[] = JSON.parse(raw);
      // Ensure backward compatibility: synthesize painDetails if missing
      const normalized = parsed.map(e => {
        if (!e.painDetails || e.painDetails.length === 0) {
          // Synthesize location entries with empty types so no invented pain
          // qualities appear in the report for entries recorded before painDetails
          // was introduced.
          return {
            ...e,
            painDetails: e.painLocations.map(loc => ({
              location: loc,
              magnitude: 0,
              types: [] as PainType[]
            }))
          };
        }
        return e;
      });
      return normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      return [];
    }
  }

  /** Saves entries list to local persistence */
  static saveEntries(entries: LogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }

  /** Adds or updates a daily log entry (upsert by date) */
  static logEntry(entry: Omit<LogEntry, 'id' | 'createdAt'>): LogEntry {
    const entries = this.getEntries();
    const existingIndex = entries.findIndex(e => e.date === entry.date);

    const fullEntry: LogEntry = {
      ...entry,
      id: existingIndex >= 0 ? entries[existingIndex].id : `entry-${Date.now()}`,
      createdAt: existingIndex >= 0 ? entries[existingIndex].createdAt : new Date().toISOString()
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = fullEntry;
    } else {
      entries.unshift(fullEntry);
    }

    this.saveEntries(entries);
    return fullEntry;
  }

  /** Deletes a specific log entry */
  static deleteEntry(id: string): void {
    const entries = this.getEntries().filter(e => e.id !== id);
    this.saveEntries(entries);
  }

  /** Retrieves user custom symptoms */
  static getCustomSymptoms(): CustomSymptom[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_SYMPTOMS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /** Adds a custom symptom */
  static addCustomSymptom(name: string, category: SymptomCategory = 'custom'): CustomSymptom {
    const trimmed = name.trim();
    const current = this.getCustomSymptoms();
    const existing = current.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newSymptom: CustomSymptom = {
      id: `custom_${Date.now()}`,
      name: trimmed,
      category,
      createdAt: new Date().toISOString()
    };
    const updated = [...current, newSymptom];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMPTOMS, JSON.stringify(updated));
    return newSymptom;
  }

  /** Deletes a custom symptom */
  static deleteCustomSymptom(id: string): void {
    const current = this.getCustomSymptoms().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SYMPTOMS, JSON.stringify(current));
  }

  /** Loads 3-month demo data for presentation */
  static loadDemoDataset(): LogEntry[] {
    this.clearActiveSyntheticProfile();
    const demo = getSyntheticDemoData();
    this.saveEntries(demo);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
    return demo;
  }

  /** Loads one fictional multi-day profile for UI and report testing. */
  static loadSyntheticUserScenario(scenarioId: string): LogEntry[] | null {
    const fixture = threeUserSyntheticFixtures.find((scenario) => scenario.id === scenarioId);
    if (!fixture) return null;

    const language = this.getUserProfile().language;
    this.saveUserProfile({ ...fixture.profile, language });
    this.saveEntries(fixture.entries);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
    localStorage.setItem(STORAGE_KEYS.DEMO_SCENARIO, fixture.id);
    return fixture.entries;
  }

  static getActiveSyntheticScenario(): SyntheticUserFixture | null {
    const scenarioId = localStorage.getItem(STORAGE_KEYS.DEMO_SCENARIO);
    return threeUserSyntheticFixtures.find((scenario) => scenario.id === scenarioId) ?? null;
  }

  private static clearActiveSyntheticProfile(): void {
    if (!localStorage.getItem(STORAGE_KEYS.DEMO_SCENARIO)) return;
    const language = this.getUserProfile().language;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({ ...defaultProfile, language }));
    localStorage.removeItem(STORAGE_KEYS.DEMO_SCENARIO);
  }

  /** Clears demo data to start a clean personal log */
  static clearToFreshDataset(): void {
    this.clearActiveSyntheticProfile();
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'false');
  }

  /** Checks if demo mode is currently active */
  static isDemoMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
  }

  /** Gets user profile */
  static getUserProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return defaultProfile;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultProfile;
    }
  }

  /** Updates user profile fields */
  static saveUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  }

  /** Wipes all app data for "Delete My Account" */
  static deleteAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    // Keep a non-sensitive marker so the next read does not recreate demo data.
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'false');
    localStorage.removeItem('endocare_onboarded');
    localStorage.removeItem('endocare_lang');
  }

  /**
   * Generates structured 1-page Clinician Summary data.
   * Accepts an optional pre-filtered entries array so the report can cover
   * a specific date range without re-reading localStorage.
   */
  static generateClinicianSummary(passedEntries?: LogEntry[]): ClinicianSummaryData {
    const entries = passedEntries ?? this.getEntries();
    const profile = this.getUserProfile();

    if (entries.length === 0) {
      return {
        patientName: profile.name || '',
        age: profile.age ?? null,
        ageAtFirstPeriod: profile.ageAtFirstPeriod ?? null,
        pregnancies: profile.pregnancies ?? null,
        tryingToConceive: profile.tryingToConceive ?? null,
        monthsTryingToConceive: profile.monthsTryingToConceive ?? null,
        familyHistoryEndometriosis: profile.familyHistoryEndometriosis,
        knownConditions: profile.knownConditions,
        dateRange: { start: 'N/A', end: 'N/A' },
        totalCyclesTracked: 0,
        cycleLengths: [],
        descriptiveBaseline: { cyclesIncluded: 0, averageCycleLengthDays: null, averagePeriodPain: null },
        dailyPain: [],
        dailyObservations: [],
        averagePainOnPeriod: 0,
        peakPainScore: 0,
        daysWithPain7Plus: 0,
        daysMissedWorkOrSchool: 0,
        commonSymptoms: [],
        painLocationMatrix: [],
        painQualitySummary: [],
        painkillerResponse: { takenCount: 0, effectiveCount: 0, partlyEffectiveCount: 0, ineffectiveCount: 0 },
      };
    }

    const sortedByDate = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startDate = sortedByDate[0].date;
    const endDate = sortedByDate[sortedByDate.length - 1].date;

    // Use only user-marked start/end dates. A missing log is never treated as
    // a day without bleeding, and no normal-range judgment is made.
    const periodStarts = sortedByDate.filter(e => e.periodStart).map(e => e.date);
    const periodEnds = sortedByDate.filter(e => e.periodEnd).map(e => e.date);
    const cycleLengths = periodStarts.map((start, index) => {
      const nextStart = periodStarts[index + 1];
      const periodEnd = periodEnds.find(end => end >= start && (!nextStart || end < nextStart));
      const length = nextStart
        ? Math.round((new Date(`${nextStart}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) / 86400000)
        : undefined;
      return { periodStart: start, periodEnd, cycleLengthDays: length };
    });
    const totalCyclesTracked = periodStarts.length;
    const baselinePeriods = cycleLengths.filter(period => period.periodEnd && period.cycleLengthDays != null).slice(-3);
    const baselineCycleLengths = baselinePeriods.map(period => period.cycleLengthDays as number);
    const baselinePainByPeriod = baselinePeriods.map(period => {
      const scores = sortedByDate.filter(e => e.date >= period.periodStart && e.date <= (period.periodEnd as string) && e.flow !== 'none').map(e => e.painScore);
      return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
    }).filter((score): score is number => score != null);
    const descriptiveBaseline = {
      cyclesIncluded: baselinePeriods.length,
      averageCycleLengthDays: baselineCycleLengths.length ? Number((baselineCycleLengths.reduce((sum, value) => sum + value, 0) / baselineCycleLengths.length).toFixed(1)) : null,
      averagePeriodPain: baselinePainByPeriod.length ? Number((baselinePainByPeriod.reduce((sum, value) => sum + value, 0) / baselinePainByPeriod.length).toFixed(1)) : null,
    };

    const periodDays = entries.filter(e => e.flow !== 'none');
    const periodPainScores = periodDays.map(e => e.painScore);
    const avgPeriodPain = periodPainScores.length > 0
      ? Number((periodPainScores.reduce((a, b) => a + b, 0) / periodPainScores.length).toFixed(1))
      : 0;

    const peakPain = Math.max(...entries.map(e => e.painScore), 0);
    const daysPain7Plus = entries.filter(e => e.painScore >= 7).length;
    const daysMissed = entries.filter(e =>
      e.dailyImpact === 'missed_school_work' || e.dailyImpact === 'bed_rest'
    ).length;

    // Pain location and quality matrix aggregation
    const locationStats: Record<string, { count: number; totalMag: number; peakMag: number; typeCounts: Record<string, number> }> = {};
    const qualityMap: Record<string, number> = {};

    entries.forEach(e => {
      const details = e.painDetails && e.painDetails.length > 0
        ? e.painDetails
        : e.painLocations.map(l => ({ location: l, magnitude: e.painScore, types: [] as PainType[] }));

      details.forEach(d => {
        if (!locationStats[d.location]) {
          locationStats[d.location] = { count: 0, totalMag: 0, peakMag: 0, typeCounts: {} };
        }
        locationStats[d.location].count++;
        const mag = d.magnitude ?? e.painScore;
        locationStats[d.location].totalMag += mag;
        locationStats[d.location].peakMag = Math.max(locationStats[d.location].peakMag, mag);

        d.types.forEach(t => {
          locationStats[d.location].typeCounts[t] = (locationStats[d.location].typeCounts[t] || 0) + 1;
          qualityMap[t] = (qualityMap[t] || 0) + 1;
        });
      });
    });

    const painLocationMatrix: PainLocationMatrix[] = Object.keys(locationStats).map(loc => {
      const stat = locationStats[loc];
      const dominantTypes = (Object.keys(stat.typeCounts) as PainType[])
        .sort((a, b) => stat.typeCounts[b] - stat.typeCounts[a]);
      return {
        location: loc as PainLocation,
        count: stat.count,
        avgMagnitude: stat.count > 0 ? Number((stat.totalMag / stat.count).toFixed(1)) : 0,
        peakMagnitude: stat.peakMag,
        dominantTypes
      };
    }).sort((a, b) => b.count - a.count);

    const painQualitySummary: PainQualitySummary[] = (Object.keys(qualityMap) as PainType[])
      .map(type => ({ type, count: qualityMap[type] }))
      .sort((a, b) => b.count - a.count);

    // Symptom frequency mapping (both standard and custom)
    const customList = this.getCustomSymptoms();
    const customMap = new Map(customList.map(c => [c.id, c.name]));

    const symptomCounts: Record<string, number> = {};
    entries.forEach(e => {
      e.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const commonSymptoms = Object.keys(symptomCounts)
      .map(key => ({
        symptom: customMap.has(key) ? customMap.get(key)! : key,
        count: symptomCounts[key],
        isCustom: customMap.has(key)
      }))
      .filter(s => s.count > 0)
      .sort((a, b) => b.count - a.count);

    // Painkiller efficacy
    const pTaken = entries.filter(e => e.painkillerTaken);
    const pEffective = entries.filter(e => e.painkillerTaken && e.painkillerEffective === true).length;
    const pPartlyEffective = entries.filter(e => e.painkillerTaken && e.painkillerEffective === 'partly').length;
    const pIneffective = entries.filter(e => e.painkillerTaken && e.painkillerEffective === false).length;

    return {
      patientName: profile.name || '',
      age: profile.age ?? null,
      ageAtFirstPeriod: profile.ageAtFirstPeriod ?? null,
      pregnancies: profile.pregnancies ?? null,
      tryingToConceive: profile.tryingToConceive ?? null,
      monthsTryingToConceive: profile.monthsTryingToConceive ?? null,
      familyHistoryEndometriosis: profile.familyHistoryEndometriosis,
      knownConditions: profile.knownConditions,
      dateRange: { start: startDate, end: endDate },
      totalCyclesTracked,
      cycleLengths,
      descriptiveBaseline,
      dailyPain: sortedByDate.map(e => ({ date: e.date, painScore: e.painScore })),
      dailyObservations: sortedByDate.map(({ id: _id, createdAt: _createdAt, ...entry }) => entry),
      averagePainOnPeriod: avgPeriodPain,
      peakPainScore: peakPain,
      daysWithPain7Plus: daysPain7Plus,
      daysMissedWorkOrSchool: daysMissed,
      commonSymptoms,
      painLocationMatrix,
      painQualitySummary,
      painkillerResponse: {
        takenCount: pTaken.length,
        ef