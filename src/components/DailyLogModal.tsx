import React, { useState, useEffect } from 'react';
import { useI18n } from '../locales/i18nContext';
import { StorageService } from '../services/storageService';
import { PainLocationMap } from './PainLocationMap';
import { 
  LogEntry, 
  FlowLevel, 
  PainLocation, 
  DailyImpact, 
  RelatedSymptom, 
  PainType, 
  PainDetail, 
  SymptomCategory,
  CustomSymptom 
} from '../types';
import { 
  CheckCircle2, 
  Droplets, 
  MapPin, 
  Briefcase, 
  Pill, 
  Sparkles, 
  Calendar,
  Activity,
  Sliders,
  Plus,
  Trash2,
  ChevronDown,
  X,
} from 'lucide-react';

interface DailyLogProps {
  onSaved: () => void;
  entries: LogEntry[];
}

const standardSymptomList: { key: RelatedSymptom; category: SymptomCategory }[] = [
  // Pelvic & Cycle
  { key: 'pain_with_intimacy', category: 'pelvic_cycle' },
  { key: 'heavy_clots', category: 'pelvic_cycle' },
  { key: 'ovulation_pain', category: 'pelvic_cycle' },
  // Digestive
  { key: 'bloating_endo_belly', category: 'digestive' },
  { key: 'painful_bowel', category: 'digestive' },
  { key: 'constipation_diarrhea', category: 'digestive' },
  { key: 'nausea', category: 'digestive' },
  // Urinary
  { key: 'painful_urination', category: 'urinary' },
  // Neuromuscular
  { key: 'leg_weakness', category: 'neuromuscular' },
  { key: 'lower_back_stiffness', category: 'neuromuscular' },
  // Systemic / Mood
  { key: 'chronic_fatigue', category: 'systemic_mood' },
  { key: 'brain_fog', category: 'systemic_mood' }
];

export const DailyLogModal: React.FC<DailyLogProps> = ({ onSaved, entries }) => {
  const { t } = useI18n();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [flow, setFlow] = useState<FlowLevel>('none');
  const [periodStart, setPeriodStart] = useState(false);
  const [periodEnd, setPeriodEnd] = useState(false);
  const [padsOrTamponsUsed, setPadsOrTamponsUsed] = useState('');
  const [soakedWithinHour, setSoakedWithinHour] = useState<boolean | null>(null);
  const [largeClots, setLargeClots] = useState<boolean | null>(null);
  const [painScore, setPainScore] = useState<number>(0);
  const [painTiming, setPainTiming] = useState<import('../types').PainTiming[]>([]);
  const [painContexts, setPainContexts] = useState<import('../types').PainContext[]>([]);
  const [bloodInStool, setBloodInStool] = useState<boolean | null>(null);
  const [bloodInUrine, setBloodInUrine] = useState<boolean | null>(null);
  const [bleedingBetweenPeriods, setBleedingBetweenPeriods] = useState<boolean | null>(null);
  const [moodSymptoms, setMoodSymptoms] = useState<string[]>([]);
  const [painLocations, setPainLocations] = useState<PainLocation[]>(['pelvis']);
  const [painDetails, setPainDetails] = useState<PainDetail[]>([
    { location: 'pelvis', magnitude: 0, types: ['cramping'] }
  ]);
  const [activeDetailLocation, setActiveDetailLocation] = useState<PainLocation | null>('pelvis');

  const [dailyImpact, setDailyImpact] = useState<DailyImpact>('none');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomCategoryFilter, setSymptomCategoryFilter] = useState<SymptomCategory | 'all'>('all');
  const [customSymptoms, setCustomSymptoms] = useState<CustomSymptom[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [newCustomName, setNewCustomName] = useState<string>('');

  const [painkillerTaken, setPainkillerTaken] = useState<boolean>(false);
  const [painkillerName, setPainkillerName] = useState<string>('');
  const [painkillerEffective, setPainkillerEffective] = useState<boolean | 'partly' | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load custom symptoms from storage
  useEffect(() => {
    setCustomSymptoms(StorageService.getCustomSymptoms());
  }, []);

  // Pre-populate form when switching to a date with an existing entry
  useEffect(() => {
    const existing = entries.find(e => e.date === date);
    if (existing) {
      setIsEditing(true);
      setFlow(existing.flow);
      setPeriodStart(existing.periodStart ?? false);
      setPeriodEnd(existing.periodEnd ?? false);
      setPadsOrTamponsUsed(existing.padsOrTamponsUsed == null ? '' : String(existing.padsOrTamponsUsed));
      setSoakedWithinHour(existing.soakedWithinHour ?? null);
      setLargeClots(existing.largeClots ?? null);
      setPainScore(existing.painScore);
      setPainTiming(existing.painTiming ?? []);
      setPainContexts(existing.painContexts ?? []);
      setBloodInStool(existing.bloodInStool ?? null);
      setBloodInUrine(existing.bloodInUrine ?? null);
      setBleedingBetweenPeriods(existing.bleedingBetweenPeriods ?? null);
      setMoodSymptoms(existing.moodSymptoms ?? []);
      setPainLocations([...existing.painLocations]);
      
      const loadedDetails: PainDetail[] = existing.painDetails && existing.painDetails.length > 0
        ? existing.painDetails
        : existing.painLocations.map(l => ({
            location: l,
            magnitude: 0,
            types: ['cramping']
          }));
      setPainDetails(loadedDetails);
      setActiveDetailLocation(existing.painLocations[0] || null);
      
      setDailyImpact(existing.dailyImpact);
      setSymptoms([...existing.symptoms]);
      setPainkillerTaken(existing.painkillerTaken);
      setPainkillerName(existing.painkillerName ?? '');
      setPainkillerEffective(existing.painkillerEffective ?? null);
      setNotes(existing.notes || '');
    } else {
      setIsEditing(false);
      setFlow('none');
      setPeriodStart(false);
      setPeriodEnd(false);
      setPadsOrTamponsUsed('');
      setSoakedWithinHour(null);
      setLargeClots(null);
      setPainScore(0);
      setPainTiming([]);
      setPainContexts([]);
      setBloodInStool(null);
      setBloodInUrine(null);
      setBleedingBetweenPeriods(null);
      setMoodSymptoms([]);
      setPainLocations(['pelvis']);
      setPainDetails([{ location: 'pelvis', magnitude: 0, types: ['cramping'] }]);
      setActiveDetailLocation('pelvis');
      setDailyImpact('none');
      setSymptoms([]);
      setPainkillerTaken(false);
      setPainkillerName('');
      setPainkillerEffective(null);
      setNotes('');
    }
  }, [date, entries]);

  const handleOverallScoreChange = (newScore: number) => {
    setPainScore(newScore);
  };

  const toggleLocation = (loc: PainLocation) => {
    if (painLocations.includes(loc)) {
      setActiveDetailLocation(loc);
    } else {
      setPainLocations(prev => [...prev, loc]);
      setPainDetails(prev => [
        ...prev,
        { location: loc, magnitude: 0, types: ['cramping'] }
      ]);
      setActiveDetailLocation(loc);
    }
  };

  const removePainLocation = (loc: PainLocation) => {
    const remaining = painLocations.filter(location => location !== loc);
    setPainLocations(remaining);
    setPainDetails(prev => prev.filter(detail => detail.location !== loc));
    if (activeDetailLocation === loc) setActiveDetailLocation(remaining[0] ?? null);
  };

  const togglePainTypeForLocation = (loc: PainLocation, type: PainType) => {
    setPainDetails(prev => prev.map(d => {
      if (d.location !== loc) return d;
      const exists = d.types.includes(type);
      const updatedTypes = exists
        ? d.types.filter(t => t !== type)
        : [...d.types, type];
      return {
        ...d,
        types: updatedTypes.length > 0 ? updatedTypes : ['cramping']
      };
    }));
  };

  const setLocationMagnitude = (loc: PainLocation, mag: number) => {
    setPainDetails(prev => prev.map(d => {
      if (d.location !== loc) return d;
      return { ...d, magnitude: mag };
    }));
  };

  const toggleSymptom = (symKey: string) => {
    if (symptoms.includes(symKey)) {
      setSymptoms(symptoms.filter(s => s !== symKey));
    } else {
      setSymptoms([...symptoms, symKey]);
    }
  };

  const handleAddCustomSymptom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newCustomName.trim()) return;
    const created = StorageService.addCustomSymptom(newCustomName.trim(), 'custom');
    setCustomSymptoms(StorageService.getCustomSymptoms());
    setSymptoms(prev => [...prev, created.id]);
    setNewCustomName('');
    setIsAddingCustom(false);
  };

  const handleDeleteCustomSymptom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.deleteCustomSymptom(id);
    setCustomSymptoms(StorageService.getCustomSymptoms());
    setSymptoms(prev => prev.filter(s => s !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(false);
    try {
    StorageService.logEntry({
      date,
      flow,
      periodStart,
      periodEnd,
      padsOrTamponsUsed: padsOrTamponsUsed === '' ? null : Number(padsOrTamponsUsed),
      soakedWithinHour,
      largeClots,
      painScore,
      painTiming,
      painContexts,
      bloodInStool,
      bloodInUrine,
      bleedingBetweenPeriods,
      moodSymptoms,
      painLocations,
      painDetails,
      dailyImpact,
      symptoms,
      painkillerTaken,
      painkillerName: painkillerTaken ? painkillerName.trim() || undefined : undefined,
      painkillerEffective: painkillerTaken ? painkillerEffective : null,
      notes: notes.trim() || undefined
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onSaved();
    }, 1100);
    } catch {
      setSaveError(true);
    }
  };

  const painInfo = { label: t.log.recordedPainScore, color: 'text-brand-900', bg: 'bg-brand-50', border: 'border-brand-200' };
  const locationMagnitudes = painDetails.reduce<Partial<Record<PainLocation, number>>>((values, detail) => {
    values[detail.location] = detail.magnitude;
    return values;
  }, {});

  const flowIcons: Record<FlowLevel, string> = {
    none: '⚪',
    spotting: '💧',
    light: '🩸',
    medium: '🩸🩸',
    heavy: '🩸🩸🩸'
  };

  const symptomIcons: Record<string, string> = {
    painful_bowel: '🚽',
    painful_urination: '⚡',
    pain_with_intimacy: '💔',
    heavy_clots: '🩸',
    ovulation_pain: '🥚',
    bloating_endo_belly: '🎈',
    constipation_diarrhea: '🔄',
    nausea: '🤢',
    leg_weakness: '🦵',
    lower_back_stiffness: '🦴',
    chronic_fatigue: '🔋',
    brain_fog: '🌫️'
  };

  const painTypeKeys: PainType[] = [
    'cramping',
    'sharp_stabbing',
    'burning',
    'dull_aching',
    'throbbing',
    'shooting_electric',
    'heaviness_pressure'
  ];

  const availableLocations: PainLocation[] = [
    'pelvis', 
    'lower_back', 
    'lower_abdomen', 
    'thighs', 
    'legs',
    'rectum',
    'bladder',
    'chest_ribs', 
    'generalized'
  ];

  // Filter symptoms by category
  const filteredStandardSymptoms = standardSymptomList.filter(s => {
    if (symptomCategoryFilter === 'all') return true;
    return s.category === symptomCategoryFilter;
  });

  const shouldShowCustom = symptomCategoryFilter === 'all' || symptomCategoryFilter === 'custom';

  const toggleListValue = <T extends string>(current: T[], value: T, update: (next: T[]) => void) => {
    update(current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };

  return (
    <div className="mx-auto max-w-3xl py-2">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-6">
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
              <span>{t.log.title}</span>
              <Sparkles className="w-4 h-4 text-brand-600" />
            </h2>
            <p className="text-sm text-slate-600">{t.log.logIntro}</p>
            {isEditing && (
              <p className="text-[11px] text-amber-700 font-bold mt-1 flex items-center space-x-1">
                <span>✏️</span>
                <span>{t.log.editingEntry.replace('{date}', date)}</span>
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-brand-600" />
            <input
              type="date"
              value={date}
              aria-label={t.log.date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none text-slate-800 font-bold cursor-pointer"
            />
          </div>
        </div>

        {showSuccess ? (
          <div className="py-16 flex flex-col items-center justify-center text-center animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-9 h-9" />
            </div>

              <h3 role="status" aria-live="polite" className="text-base font-bold text-slate-900">{t.log.successMsg}</h3>
            <p className="text-xs text-slate-500 mt-1">Symptom pattern updated in your chronological records.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* 1. Menstrual Flow Level */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                <Droplets className="w-4 h-4 text-brand-600" />
                <span>{t.log.flowLabel}</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as FlowLevel[]).map((f) => {
                  const isSelected = flow === f;
                  return (
                    <button
                      type="button"
                      key={f}
                      aria-pressed={isSelected}
                      onClick={() => setFlow(f)}
                      className={`flex min-h-[4.5rem] flex-col items-center justify-center py-2 px-1.5 rounded-xl border transition-colors ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/90 text-brand-900 font-extrabold shadow-sm ring-2 ring-brand-500/20'
                          : 'border-slate-200/80 text-slate-600 hover:bg-slate-50/80'
                      }`}
                    >
                      <span className="text-base mb-1">{flowIcons[f]}</span>
                      <span className="text-xs text-center leading-tight font-medium">
                        {t.log.flows[f]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional bleeding details; these are recorded as entered, without interpreting thresholds. */}
            <div className="space-y-2 rounded-2xl border border-stone-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">{t.log.periodDatesLabel}</h3>
              <label className="flex min-h-11 items-center gap-3 text-sm text-slate-800"><input type="checkbox" checked={periodStart} onChange={e => setPeriodStart(e.target.checked)} className="h-5 w-5 accent-brand-700" />{t.log.periodStart}</label>
              <label className="flex min-h-11 items-center gap-3 text-sm text-slate-800"><input type="checkbox" checked={periodEnd} onChange={e => setPeriodEnd(e.target.checked)} className="h-5 w-5 accent-brand-700" />{t.log.periodEnd}</label>
              <details className="border-t border-stone-200 pt-2">
                <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-brand-900">{t.log.flowDetails} · {t.log.optionalCollapsed}</summary>
                <div className="space-y-3 pt-2">
              <label className="block text-[11px] text-slate-700">
                {t.log.padCount}
                <input type="number" min="0" step="1" inputMode="numeric" value={padsOrTamponsUsed}
                  onChange={e => setPadsOrTamponsUsed(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs" />
              </label>
              {([
                [t.log.soakedWithinHour, soakedWithinHour, setSoakedWithinHour],
                [t.log.largeClots, largeClots, setLargeClots],
                [t.log.bleedingBetweenPeriods, bleedingBetweenPeriods, setBleedingBetweenPeriods],
              ] as const).map(([label, value, update]) => (
                <fieldset key={label} className="space-y-1">
                  <legend className="text-[11px] text-slate-700">{label}</legend>
                  <div className="flex gap-1.5">
                    {([[null, t.log.notRecorded], [true, t.log.yes], [false, t.log.no]] as const).map(([answer, answerLabel]) => (
                      <button type="button" key={answerLabel} onClick={() => update(answer)} aria-pressed={value === answer}
                        className={`rounded-lg border px-2.5 py-1 text-[10px] ${value === answer ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                        {answerLabel}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              <p className="text-sm leading-relaxed text-slate-700">{t.log.bleedingBoundary}</p>
                </div>
              </details>
            </div>

            {/* Optional timing and activity context */}
            <details className="rounded-2xl border border-stone-200 bg-white p-4">
              <summary className="min-h-11 cursor-pointer py-1 text-sm font-semibold text-slate-900">{t.log.painContextSummary} · {t.log.optionalCollapsed}</summary>
              <div className="space-y-4 pt-3">
              <fieldset>
                <legend className="mb-1.5 text-xs font-bold text-slate-800">{t.log.painTimingLabel}</legend>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(t.log.painTiming) as import('../types').PainTiming[]).map(value => (
                    <button type="button" key={value}
                      onClick={() => toggleListValue(painTiming, value, setPainTiming)}
                      aria-pressed={painTiming.includes(value)}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-sm ${painTiming.includes(value) ? 'border-brand-800 bg-brand-800 text-white' : 'border-stone-300 bg-white text-slate-800'}`}>
                      {t.log.painTiming[value]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-1.5 text-xs font-bold text-slate-800">{t.log.painContextsLabel}</legend>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(t.log.painContexts) as import('../types').PainContext[]).map(value => (
                    <button type="button" key={value}
                      onClick={() => toggleListValue(painContexts, value, setPainContexts)}
                      aria-pressed={painContexts.includes(value)}
                      className={`min-h-11 rounded-lg border px-3 py-2 text-sm ${painContexts.includes(value) ? 'border-brand-800 bg-brand-800 text-white' : 'border-stone-300 bg-white text-slate-800'}`}>
                      {t.log.painContexts[value]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="text-sm leading-relaxed text-slate-700">{t.log.sensitiveFieldNote}</p>
              </div>
            </details>

            {/* 2. Interactive Overall Pain Severity Gauge */}
            <div className={`p-4 rounded-2xl border transition-colors ${painInfo.bg} ${painInfo.border}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Activity aria-hidden="true" className={`w-5 h-5 ${painInfo.color}`} />
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      {t.log.painScoreLabel}
                    </span>
                    <span className={`text-sm font-semibold ${painInfo.color}`}>
                      {painInfo.label}
                    </span>
                  </div>
                </div>

                <div className={`text-2xl font-bold px-3.5 py-1.5 rounded-xl bg-white border ${painInfo.border} ${painInfo.color}`}>
                  {painScore}<span className="text-xs font-semibold text-slate-400">/10</span>
                </div>
              </div>

              {/* Overall Slider */}
              <div className="relative pt-2 pb-1">
                <input
                  type="range"
                  aria-label={t.log.painScoreLabel}
                  aria-valuetext={`${painScore} ${t.log.painOutOfTen}`}
                  min="0"
                  max="10"
                  value={painScore}
                  onChange={(e) => handleOverallScoreChange(parseInt(e.target.value))}
                  style={{ '--range-progress': `${painScore * 10}%` } as React.CSSProperties}
                  className="pain-range w-full"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-1 mt-1">
                  <span>0 (None)</span>
                  <span>5 (Distracting)</span>
                  <span>10 (Worst)</span>
                </div>
              </div>
            </div>

            <details className="rounded-2xl border border-stone-200 bg-white p-4">
              <summary className="min-h-11 cursor-pointer py-1 text-sm font-semibold text-slate-900">{t.log.otherDetailsLabel} · {t.log.optionalCollapsed}</summary>
              <fieldset className="space-y-3 pt-3">
              <legend className="px-1 text-xs font-bold text-slate-800">{t.log.otherDetailsLabel}</legend>
              {([[t.log.bloodInStool, bloodInStool, setBloodInStool], [t.log.bloodInUrine, bloodInUrine, setBloodInUrine]] as const).map(([label, value, update]) => (
                <div key={label} className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                  <span>{label}</span>
                  <select value={value === null ? '' : String(value)} onChange={e => update(e.target.value === '' ? null : e.target.value === 'true')}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1">
                    <option value="">{t.log.notRecorded}</option><option value="true">{t.log.yes}</option><option value="false">{t.log.no}</option>
                  </select>
                </div>
              ))}
              <div>
                <p className="mb-1 text-[11px] text-slate-700">{t.log.moodLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(t.log.moodOptions) as string[]).map(value => (
                    <button type="button" key={value} aria-pressed={moodSymptoms.includes(value)}
                      onClick={() => toggleListValue(moodSymptoms, value, setMoodSymptoms)}
                      className={`rounded-lg border px-2.5 py-1 text-[10px] ${moodSymptoms.includes(value) ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                      {t.log.moodOptions[value as keyof typeof t.log.moodOptions]}
                    </button>
                  ))}
                </div>
              </div>
              </fieldset>
            </details>

            {/* 3. Pain Location Tags with Progressive Disclosure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{t.log.painLocationLabel}</span>
                </label>
                  <span className="text-sm font-medium text-slate-600">
                  {t.log.locationHelper}
                </span>
              </div>

              <PainLocationMap
                selectedLocations={painLocations}
                magnitudes={locationMagnitudes}
                labels={t.log.locations}
                frontLabel={t.log.frontBody}
                backLabel={t.log.backBody}
                mapNote={t.log.painMapNote}
                onSelectLocation={toggleLocation}
              />

              <div className="flex flex-wrap gap-1.5">
                {availableLocations.map((loc) => {
                  const isSelected = painLocations.includes(loc);
                  const detail = painDetails.find(d => d.location === loc);

                  return (
                    <div key={loc} className="inline-flex items-stretch">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleLocation(loc)}
                        className={`min-h-11 text-sm px-3 py-2 rounded-l-xl border transition-colors flex items-center space-x-2 ${isSelected
                          ? 'border-brand-600 bg-brand-600 text-white font-bold shadow-sm rounded-r-none'
                          : 'rounded-r-xl border-slate-200/80 text-slate-700 bg-slate-50/70 hover:bg-slate-100/70 font-medium'
                        }`}
                      >
                        <span>{t.log.locations[loc]}</span>
                        {isSelected && detail && detail.types.length > 0 && (
                          <span className="bg-brand-900 px-2 py-0.5 rounded-md text-xs font-medium text-white">{detail.magnitude}/10</span>
                        )}
                        {isSelected && <span aria-hidden="true"><ChevronDown className="h-4 w-4" /></span>}
                      </button>
                      {isSelected && (
                        <button
                          type="button"
                          aria-label={t.log.removeLocationLabel.replace('{location}', t.log.locations[loc])}
                          title={t.log.removeLocationLabel.replace('{location}', t.log.locations[loc])}
                          onClick={() => removePainLocation(loc)}
                          className="min-h-11 min-w-10 rounded-r-xl border border-l-0 border-brand-600 bg-brand-50 px-2 text-brand-900 hover:bg-brand-100"
                        >
                          <X className="mx-auto h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progressive Detail Box for Active Location */}
              {activeDetailLocation && painLocations.includes(activeDetailLocation) && (
                <div className="mt-3 p-3.5 bg-brand-50/60 border border-brand-200/80 rounded-2xl animate-fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-200/50 pb-2">
                    <span className="text-xs font-black text-brand-950 flex items-center space-x-1.5">
                      <Sliders className="w-3.5 h-3.5 text-brand-700" />
                      <span>{t.log.painDetailsTitle} {t.log.locations[activeDetailLocation]}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveDetailLocation(null)}
                      className="min-h-11 px-2 text-sm text-brand-900 font-semibold underline-offset-4 hover:underline"
                    >
                      Done
                    </button>
                  </div>

                  {/* Pain Type / Character Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      {t.log.painTypeLabel}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {painTypeKeys.map((type) => {
                        const detail = painDetails.find(d => d.location === activeDetailLocation);
                        const isSelected = detail?.types.includes(type) ?? false;

                        return (
                          <button
                            type="button"
                            key={type}
                            aria-pressed={isSelected}
                            onClick={() => togglePainTypeForLocation(activeDetailLocation, type)}
                            className={`min-h-11 text-sm px-3 py-2 rounded-lg border transition-colors ${
                              isSelected
                                ? 'bg-brand-700 text-white border-brand-700 font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span>{t.log.painTypes[type]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Local Magnitude Override */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        {t.log.locationMagnitudeLabel}
                      </label>
                      <span className="text-xs font-black text-brand-800">
                        {painDetails.find(d => d.location === activeDetailLocation)?.magnitude ?? 0} / 10
                      </span>
                    </div>
                    <input
                      type="range"
                      aria-label={`${t.log.locationMagnitudeLabel}: ${t.log.locations[activeDetailLocation]}`}
                      aria-valuetext={`${painDetails.find(d => d.location === activeDetailLocation)?.magnitude ?? 0} ${t.log.painOutOfTen}`}
                      min="0"
                      max="10"
                      value={painDetails.find(d => d.location === activeDetailLocation)?.magnitude ?? 0}
                      onChange={(e) => setLocationMagnitude(activeDetailLocation, parseInt(e.target.value))}
                      style={{ '--range-progress': `${(painDetails.find(d => d.location === activeDetailLocation)?.magnitude ?? 0) * 10}%` } as React.CSSProperties}
                      className="pain-range w-full"
                    />
                  </div>
                  <button type="button" onClick={() => removePainLocation(activeDetailLocation)} className="min-h-11 rounded-lg px-2 text-sm font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900">
                    {t.log.removePainLocation}
                  </button>
                </div>
              )}
            </div>

            {/* 4. Daily Life Disruption */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 mb-2">
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span>{t.log.impactLabel}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['none', 'mild_interference', 'missed_school_work', 'bed_rest'] as DailyImpact[]).map((impact) => {
                  const isSelected = dailyImpact === impact;
                  return (
                    <button
                      type="button"
                      key={impact}
                      aria-pressed={isSelected}
                      onClick={() => setDailyImpact(impact)}
                      className={`min-h-14 text-left text-sm p-3 rounded-xl border transition-colors flex items-start justify-between ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50 text-brand-950 font-extrabold ring-1 ring-brand-500/20'
                          : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="leading-snug">{t.log.impacts[impact]}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Categorized & Custom Symptoms Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Activity className="w-4 h-4 text-brand-600" />
                  <span>{t.log.symptomsLabel}</span>
                </label>
                <span className="text-xs font-medium text-slate-700 bg-stone-100 px-2.5 py-1 rounded-full">
                  {t.log.optionalCollapsed.split(' · ')[0]}
                </span>
              </div>

              <details className="rounded-2xl border border-stone-200 bg-white p-4">
                <summary className="min-h-11 cursor-pointer py-1 text-sm font-semibold text-brand-900">
                  {t.log.reviewSymptoms} {symptoms.length > 0 && <span className="text-slate-700">({symptoms.length})</span>}
                </summary>
                <div className="pt-3">
              {/* Category Segment Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {(['all', 'pelvic_cycle', 'digestive', 'urinary', 'neuromuscular', 'systemic_mood', 'custom'] as const).map((cat) => {
                  const isActive = symptomCategoryFilter === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      aria-pressed={isActive}
                      onClick={() => setSymptomCategoryFilter(cat)}
                      className={`min-h-11 text-xs font-semibold px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {t.log.symptomCategories[cat]}
                    </button>
                  );
                })}
              </div>

              {/* Standard Symptoms List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredStandardSymptoms.map(({ key: sym }) => {
                  const isChecked = symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      aria-pressed={isChecked}
                      onClick={() => toggleSymptom(sym)}
                      className={`w-full min-h-12 text-left text-sm px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-brand-700 bg-brand-50 text-brand-900 font-semibold'
                          : 'border-stone-300 text-slate-800 hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-sm">{symptomIcons[sym] || '🔹'}</span>
                        <span>{t.log.symptoms[sym]}</span>
                      </span>
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-bold ${
                        isChecked ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}

                {/* User's Custom Symptoms */}
                {shouldShowCustom && customSymptoms.map((custom) => {
                  const isChecked = symptoms.includes(custom.id);
                  return (
                    <div
                      key={custom.id}
                      className={`w-full min-h-12 text-left text-sm px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-purple-400 bg-purple-50 text-purple-950 font-bold shadow-xs'
                          : 'border-slate-200/70 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <button type="button" aria-pressed={isChecked} onClick={() => toggleSymptom(custom.id)} className="flex min-h-11 flex-1 items-center gap-2 text-left">
                        <span aria-hidden="true">✦</span><span>{custom.name}</span>
                        <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-900">{t.log.customBadge}</span>
                        <span className="ml-auto" aria-hidden="true">{isChecked ? '✓' : ''}</span>
                      </button>
                      <div className="flex items-center gap-2 pl-2">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomSymptom(custom.id, e)}
                          className="min-h-11 min-w-11 rounded-lg p-2 text-slate-700 hover:bg-rose-50 hover:text-rose-800"
                          aria-label={t.log.removeCustomSymptom.replace('{name}', custom.name)}
                        >
                          <Trash2 className="mx-auto h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Symptom Input */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                {!isAddingCustom ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(true)}
                    className="w-full min-h-11 px-3 rounded-xl border border-dashed border-brand-700 text-brand-900 hover:bg-brand-50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.log.addCustomSymptom}</span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-in">
                    <input
                      type="text"
                      value={newCustomName}
                      onChange={(e) => setNewCustomName(e.target.value)}
                      placeholder={t.log.customSymptomPlaceholder}
                      aria-label={t.log.customSymptomPlaceholder}
                      className="min-h-11 w-full text-sm p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustom(false);
                          setNewCustomName('');
                        }}
                        className="min-h-11 px-3 text-sm text-slate-700 hover:text-slate-900 font-semibold"
                      >
                        {t.log.customSymptomCancel}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomSymptom}
                        disabled={!newCustomName.trim()}
                        className="min-h-11 px-3 text-sm bg-brand-800 text-white rounded-lg font-semibold disabled:opacity-50"
                      >
                        {t.log.customSymptomAddBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
                </div>
              </details>
            </div>

            {/* 6. Medication & Response */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
              <label className="flex min-h-11 items-center gap-3 text-sm font-semibold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={painkillerTaken}
                  onChange={(e) => {
                    const taken = e.target.checked;
                    setPainkillerTaken(taken);
                    if (!taken) {
                      setPainkillerName('');
                      setPainkillerEffective(null);
                    }
                  }}
                  className="rounded-md border-stone-400 text-brand-800 focus:ring-brand-700 w-5 h-5 cursor-pointer"
                />
                <span className="flex items-center space-x-1.5">
                  <Pill className="w-3.5 h-3.5 text-brand-700" />
                  <span>{t.log.medicationLabel}</span>
                </span>
              </label>

              {painkillerTaken && (
                <div className="pt-2.5 pl-6 border-t border-slate-200/60 mt-1">
                  <label className="mb-3 block text-[11px] font-semibold text-slate-700">
                    {t.log.medicationNameLabel}
                    <input
                      type="text"
                      list="pain-medication-suggestions"
                      autoComplete="off"
                      value={painkillerName}
                      onChange={e => setPainkillerName(e.target.value)}
                      placeholder={t.log.medicationNamePlaceholder}
                      className="ui-field mt-1"
                    />
                    <datalist id="pain-medication-suggestions">
                      <option value="Paracetamol (acetaminophen)" />
                      <option value="Ibuprofen" />
                      <option value="Naproxen" />
                    </datalist>
                    <span className="mt-1 block font-normal text-slate-500">{t.log.medicationNameNote}</span>
                  </label>
                  <span className="block text-[11px] font-semibold text-slate-700 mb-2">
                    {t.log.medicationEffective}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-pressed={painkillerEffective === true}
                      onClick={() => setPainkillerEffective(true)}
                      className={`min-h-11 flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                        painkillerEffective === true
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'border-stone-300 bg-white text-slate-800'
                      }`}
                    >
                      {t.log.yes}
                    </button>
                    <button
                      type="button"
                      aria-pressed={painkillerEffective === 'partly'}
                      onClick={() => setPainkillerEffective('partly')}
                      className={`min-h-11 flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                        painkillerEffective === 'partly'
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'border-stone-300 bg-white text-slate-800'
                      }`}
                    >
                      {t.log.somewhat}
                    </button>
                    <button
                      type="button"
                      aria-pressed={painkillerEffective === false}
                      onClick={() => setPainkillerEffective(false)}
                      className={`min-h-11 flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                        painkillerEffective === false
                          ? 'bg-brand-800 text-white border-brand-800'
                          : 'border-stone-300 bg-white text-slate-800'
                      }`}
                    >
                      {t.log.no}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 7. Personal Notes */}
            <details className="rounded-2xl border border-stone-200 bg-white p-4">
              <summary className="min-h-11 cursor-pointer py-1 text-sm font-semibold text-brand-900">{notes.trim() ? t.log.noteAlreadySaved : t.log.addNote} · {t.log.optionalLabel}</summary>
              <textarea
                aria-label={t.log.notesLabel}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.log.notesPlaceholder}
                rows={3}
                className="mt-3 min-h-24 w-full text-sm border border-stone-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-y bg-white"
              />
            </details>

            {/* Save Button */}
            {saveError && <p role="alert" className="rounded-xl border border-rose-800 bg-rose-50 p-3 text-sm font-medium text-rose-950">{t.log.saveError}</p>}
            <button
              type="submit"
              className="min-h-14 w-full px-4 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.log.saveButton}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
