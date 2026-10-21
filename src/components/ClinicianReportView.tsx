import React, { useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Filter,
  MapPin,
  Pill,
  Printer,
  UserRound,
} from 'lucide-react';
import { useI18n } from '../locales/i18nContext';
import { StorageService } from '../services/storageService';
import { LogEntry, PainDetail, PainLocation } from '../types';
import { dateToLocalIso } from '../utils/dates';

interface ClinicianReportProps {
  entries: LogEntry[];
}

type RangePreset = '30' | '90' | 'all';

const impactStyles: Record<LogEntry['dailyImpact'], string> = {
  none: 'bg-stone-100 text-slate-700',
  mild_interference: 'bg-amber-50 text-amber-900',
  missed_school_work: 'bg-rose-50 text-rose-900',
  bed_rest: 'bg-rose-50 text-rose-900',
};

export const ClinicianReportView: React.FC<ClinicianReportProps> = ({ entries }) => {
  const { t, language } = useI18n();
  const [preset, setPreset] = useState<RangePreset>('90');

  const filteredEntries = useMemo(() => {
    if (preset === 'all') return entries;
    const days = preset === '30' ? 30 : 90;
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    start.setDate(start.getDate() - days + 1);
    const startStr = dateToLocalIso(start);
    const todayStr = dateToLocalIso(today);
    return entries.filter(entry => entry.date >= startStr && entry.date <= todayStr);
  }, [entries, preset]);

  const summary = useMemo(
    () => StorageService.generateClinicianSummary(filteredEntries),
    [filteredEntries]
  );
  const customSymptomNames = useMemo(
    () => new Map(StorageService.getCustomSymptoms().map(symptom => [symptom.id, symptom.name])),
    [],
  );

  const mostUsedMedicationTypes = useMemo(() => {
    const medicationCounts = new Map<string, { name: string; count: number }>();
    filteredEntries.forEach(entry => {
      const name = entry.painkillerTaken ? entry.painkillerName?.trim().replace(/\s+/g, ' ') : '';
      if (!name) return;
      const key = name.toLocaleLowerCase();
      const current = medicationCounts.get(key);
      medicationCounts.set(key, current ? { ...current, count: current.count + 1 } : { name, count: 1 });
    });
    return [...medicationCounts.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 3);
  }, [filteredEntries]);

  const reportStats = useMemo(() => {
    const averagePain = filteredEntries.length
      ? filteredEntries.reduce((sum, entry) => sum + entry.painScore, 0) / filteredEntries.length
      : null;
    const entriesWithPain = filteredEntries.filter(entry => entry.painScore > 0).length;
    const daysWithImpact = filteredEntries.filter(entry => entry.dailyImpact !== 'none').length;
    return {
      averagePain: averagePain == null ? null : Number(averagePain.toFixed(1)),
      entriesWithPain,
      daysWithImpact,
    };
  }, [filteredEntries]);
  const presets: { key: RangePreset; label: string }[] = [
    { key: '30', label: t.report.last30Days },
    { key: '90', label: t.report.last90Days },
    { key: 'all', label: t.report.allHistory },
  ];

  const handlePrint = () => window.print();
  const hasEntries = summary.dailyObservations.length > 0;
  const reportDate = new Date().toLocaleDateString(language === 'sw' ? 'sw-KE' : 'en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const familyHistoryText = summary.familyHistoryEndometriosis === 'yes'
    ? t.report.yesValue
    : summary.familyHistoryEndometriosis === 'no'
      ? t.report.noValue
      : summary.familyHistoryEndometriosis === 'unsure'
        ? t.report.unsure
        : summary.familyHistoryEndometriosis === 'prefer_not_to_say'
          ? t.report.preferNotToSay
          : t.report.notProvided;

  const valueOrDash = (value: number | null | undefined) => value == null ? '—' : value;
  const getSymptomLabel = (value: string) =>
    t.log.symptoms[value as keyof typeof t.log.symptoms] || customSymptomNames.get(value) || value;

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-8 pt-1">
      <section className="print:hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-950">{t.report.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{t.report.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!hasEntries}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-800 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t.report.printBtn}
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-slate-700 sm:mb-0">
            <Filter className="h-4 w-4 text-brand-700" aria-hidden="true" />
            <span>{t.report.trackingWindow}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 sm:w-auto">
            {presets.map(option => (
              <button
                key={option.key}
                type="button"
                aria-pressed={preset === option.key}
                onClick={() => setPreset(option.key)}
                className={`min-h-11 rounded-lg px-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${preset === option.key
                  ? 'bg-brand-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-stone-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <article className="print-page space-y-6 rounded-3xl border border-stone-200 bg-white p-4 text-slate-800 shadow-sm sm:p-7 lg:p-9 print:space-y-5 print:rounded-none print:border-none print:p-0 print:shadow-none">
        <header className="border-b border-stone-200 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">{t.report.documentTitle}</h1>
                <p className="mt-1 text-sm text-slate-600">{t.report.documentDescription}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-900">
                {t.report.userPrepared}
              </span>
              <p className="mt-2 text-xs text-slate-600">{t.report.generatedOn}: {reportDate}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays className="h-4 w-4 text-brand-700" aria-hidden="true" />
              <span>{summary.dateRange.start} – {summary.dateRange.end}</span>
            </span>
            <span className="text-slate-600">{filteredEntries.length} {t.report.entries.toLocaleLowerCase()}</span>
          </div>
        </header>

        <section aria-labelledby="report-profile-heading" className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="report-profile-heading" className="text-base font-bold text-slate-950">{t.report.patientDetails}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{t.report.profileSharingNote}</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{t.report.patientName}: {summary.patientName || t.report.notProvided}</p>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs font-medium text-slate-500">{t.report.age}</dt><dd className="mt-0.5 font-semibold text-slate-900">{valueOrDash(summary.age)}</dd></div>
            <div><dt className="text-xs font-medium text-slate-500">{t.report.ageAtFirstPeriod}</dt><dd className="mt-0.5 font-semibold text-slate-900">{valueOrDash(summary.ageAtFirstPeriod)}</dd></div>
            <div><dt className="text-xs font-medium text-slate-500">{t.report.pregnancies}</dt><dd className="mt-0.5 font-semibold text-slate-900">{valueOrDash(summary.pregnancies)}</dd></div>
            <div><dt className="text-xs font-medium text-slate-500">{t.report.tryingToConceive}</dt><dd className="mt-0.5 font-semibold text-slate-900">{summary.tryingToConceive == null ? t.report.notProvided : summary.tryingToConceive ? t.report.yesValue : t.report.noValue}</dd></div>
            {summary.tryingToConceive && <div><dt className="text-xs font-medium text-slate-500">{t.report.monthsTrying}</dt><dd className="mt-0.5 font-semibold text-slate-900">{valueOrDash(summary.monthsTryingToConceive)}</dd></div>}
            <div><dt className="text-xs font-medium text-slate-500">{t.report.familyHistory}</dt><dd className="mt-0.5 font-semibold text-slate-900">{familyHistoryText}</dd></div>
            {summary.knownConditions && <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs font-medium text-slate-500">{t.report.knownConditions}</dt><dd className="mt-0.5 whitespace-pre-wrap font-semibold text-slate-900">{summary.knownConditions}</dd></div>}
          </dl>
        </section>

        {!hasEntries ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <h2 className="mt-3 text-base font-bold text-slate-900">{t.report.noEntriesForRange}</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{t.report.noEntriesForRangeHelp}</p>
          </section>
        ) : (
          <>
            <section aria-labelledby="report-overview-heading">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 id="report-overview-heading" className="text-base font-bold text-slate-950">{t.report.chiefComplaintHeader}</h2>
                  <p className="mt-1 text-xs text-slate-600">{t.report.recordingCoverageNote}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label={t.report.entriesRecorded} value={filteredEntries.length} />
                <StatCard label={t.report.averageOverallPain} value={reportStats.averagePain == null ? '—' : `${reportStats.averagePain}/10`} />
                <StatCard label={t.report.averagePeriodPain} value={periodPainValue(summary.averagePainOnPeriod, filteredEntries, t.report.noPeriodFlowRecords)} />
                <StatCard label={t.report.peakPain} value={`${summary.peakPainScore}/10`} />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                  <span className="text-slate-600">{t.report.daysWithRecordedPain}: </span>
                  <strong className="text-slate-950">{reportStats.entriesWithPain}</strong>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                  <span className="text-slate-600">{t.report.daysMarkedWithImpact}: </span>
                  <strong className="text-slate-950">{reportStats.daysWithImpact}</strong>
                </div>
              </div>
            </section>

            <section aria-labelledby="report-cycle-heading" className="report-section">
              <SectionHeading id="report-cycle-heading" icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />} title={t.report.cycleLengths} />
              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniStat label={t.timeline.baselineCycles} value={summary.descriptiveBaseline.cyclesIncluded} />
                <MiniStat label={t.timeline.averageCycleLength} value={summary.descriptiveBaseline.averageCycleLengthDays == null ? '—' : `${summary.descriptiveBaseline.averageCycleLengthDays} ${t.timeline.daysUnit}`} />
                <MiniStat label={t.timeline.averagePeriodPain} value={summary.descriptiveBaseline.averagePeriodPain == null ? '—' : `${summary.descriptiveBaseline.averagePeriodPain}/10`} />
              </div>
              <p className="mb-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">{t.timeline.baselineNote}</p>
              {summary.cycleLengths.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">{t.report.noCycleData}</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-600"><tr>
                      <th className="px-3 py-2.5 font-semibold">{t.report.periodStart}</th>
                      <th className="px-3 py-2.5 font-semibold">{t.report.periodEnd}</th>
                      <th className="px-3 py-2.5 font-semibold">{t.report.cycleLength}</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">{summary.cycleLengths.map(period => (
                      <tr key={period.periodStart}>
                        <td className="px-3 py-2.5">{period.periodStart}</td>
                        <td className="px-3 py-2.5">{period.periodEnd ?? '—'}</td>
                        <td className="px-3 py-2.5">{period.cycleLengthDays == null ? '—' : `${period.cycleLengthDays} ${t.timeline.daysUnit}`}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </section>

            <section aria-labelledby="report-locations-heading" className="report-section">
              <SectionHeading id="report-locations-heading" icon={<MapPin className="h-4 w-4" aria-hidden="true" />} title={t.report.painPatternHeader} />
              {summary.painLocationMatrix.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">{t.report.noLocationsRecorded}</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {summary.painLocationMatrix.map(item => (
                    <div key={item.location} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-950">{t.log.locations[item.location] || item.location}</h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.count} {t.report.entries.toLocaleLowerCase()}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">
                        {t.report.averageAndPeak}: <strong>{item.avgMagnitude}/10</strong> / <strong>{item.peakMagnitude}/10</strong>
                      </p>
                      {item.dominantTypes.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.dominantTypes.map(type => <span key={type} className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-900">{t.log.painTypes[type] || type}</span>)}
                      </div>}
                    </div>
                  ))}
                </div>
              )}
              {summary.painQualitySummary.length > 0 && <p className="mt-3 text-xs leading-relaxed text-slate-600">
                <strong className="text-slate-800">{t.report.commonRecordedQualities}: </strong>
                {summary.painQualitySummary.slice(0, 5).map(item => `${t.log.painTypes[item.type] || item.type} (${item.count})`).join(' · ')}
              </p>}
            </section>

            <section aria-labelledby="report-symptoms-heading" className="report-section">
              <SectionHeading id="report-symptoms-heading" icon={<Activity className="h-4 w-4" aria-hidden="true" />} title={t.report.associatedSymptomsHeader} />
              {summary.commonSymptoms.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">{t.report.noSymptomsRecorded}</p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {summary.commonSymptoms.map(symptom => (
                    <li key={symptom.symptom} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                      <span className="font-medium text-slate-800">{symptom.isCustom ? symptom.symptom : getSymptomLabel(symptom.symptom)}</span>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700">{symptom.count} {t.report.entries.toLocaleLowerCase()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="report-medication-heading" className="report-section">
              <SectionHeading id="report-medication-heading" icon={<Pill className="h-4 w-4" aria-hidden="true" />} title={t.report.medicationHeader} />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MiniStat label={t.report.medicationTakenCount} value={summary.painkillerResponse.takenCount} />
                <MiniStat label={t.report.reportedReliefCount} value={summary.painkillerResponse.effectiveCount} />
                <MiniStat label={t.report.someReliefCount} value={summary.painkillerResponse.partlyEffectiveCount} />
                <MiniStat label={t.report.littleOrNoReliefCount} value={summary.painkillerResponse.ineffectiveCount} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{t.report.medicationResponseNote}</p>
              <div className="mt-3 rounded-xl border border-slate-200 p-3">
                <h3 className="text-xs font-bold text-slate-800">{t.report.mostUsedMedicationNames}</h3>
                {mostUsedMedicationTypes.length > 0 ? <ol className="mt-2 grid gap-2 sm:grid-cols-3">
                  {mostUsedMedicationTypes.map((item, index) => <li key={item.name} className="flex min-w-0 items-start gap-2 rounded-xl bg-slate-50 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-900">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-bold text-slate-950">{item.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-600">{item.count} {t.report.entries.toLocaleLowerCase()}</span>
                    </span>
                  </li>)}
                </ol> : <p className="mt-2 text-sm text-slate-600">{t.report.noMedicationNamesRecorded}</p>}
              </div>
            </section>

            <section aria-labelledby="report-daily-heading" className="report-section">
              <SectionHeading id="report-daily-heading" icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />} title={t.report.dailyPain} />
              <p className="mb-3 text-xs leading-relaxed text-slate-600">{t.report.dailyRecordsNote}</p>
              <div className="space-y-3">
                {summary.dailyObservations.map(entry => <DailyObservationCard key={entry.date} entry={entry} labels={t.log.locations} language={language} customSymptoms={customSymptomNames} />)}
              </div>
            </section>
          </>
        )}

        <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {t.report.doctorNoteFooter}
        </footer>
      </article>
    </div>
  );
};

const periodPainValue = (value: number, entries: LogEntry[], emptyLabel: string) =>
  entries.some(entry => entry.flow !== 'none') ? `${value}/10` : emptyLabel;

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
    <p className="min-h-9 text-xs font-semibold leading-snug text-slate-600">{label}</p>
    <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
  </div>
);

const MiniStat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
    <p className="text-xs leading-snug text-slate-600">{label}</p>
    <p className="mt-1 text-base font-bold text-slate-950">{value}</p>
  </div>
);

const SectionHeading: React.FC<{ id: string; icon: React.ReactNode; title: string }> = ({ id, icon, title }) => (
  <h2 id={id} className="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-800">{icon}</span>
    {title}
  </h2>
);

const DailyObservationCard: React.FC<{
  entry: Omit<LogEntry, 'id' | 'createdAt'>;
  labels: Record<PainLocation, string>;
  language: 'en' | 'sw';
  customSymptoms: ReadonlyMap<string, string>;
}> = ({ entry, labels, language, customSymptoms }) => {
  const { t } = useI18n();
  const formatDate = new Date(`${entry.date}T00:00:00`).toLocaleDateString(
    language === 'sw' ? 'sw-KE' : 'en-KE',
    { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
  );
  const painDetails = entry.painDetails?.length
    ? entry.painDetails
    : entry.painLocations.map(location => ({ location, magnitude: entry.painScore, types: [] }));

  const yesNo = (value: boolean | null | undefined) => value == null
    ? t.report.notRecordedValue
    : value ? t.report.yesValue : t.report.noValue;
  const symptoms = entry.symptoms.map(value => t.log.symptoms[value as keyof typeof t.log.symptoms] || customSymptoms.get(value) || value);
  const hasBleedingDetails = entry.periodStart || entry.periodEnd || entry.padsOrTamponsUsed != null || entry.soakedWithinHour != null || entry.largeClots != null || entry.bleedingBetweenPeriods != null;
  const medicationResponse = entry.painkillerEffective === true
    ? t.report.yesValue
    : entry.painkillerEffective === false
      ? t.report.noValue
      : entry.painkillerEffective === 'partly'
        ? t.log.somewhat
        : t.report.notRecordedValue;

  return (
    <article className="report-daily-card rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-950">{formatDate}</h3>
          <p className="mt-1 text-xs text-slate-600">{t.log.flows[entry.flow]} · {t.report.overallPain}: <strong className="text-slate-900">{entry.painScore}/10</strong></p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${impactStyles[entry.dailyImpact]}`}>
          {t.report.dailyImpact}: {t.log.impacts[entry.dailyImpact]}
        </span>
      </div>
      <div className="mt-3 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
        {painDetails.length > 0 && <ReportField label={t.report.painLocationDetails}>
          <ul className="space-y-1.5">
            {painDetails.map(detail => <li key={detail.location}>
              <strong>{labels[detail.location] || detail.location}: {detail.magnitude}/10</strong>
              {detail.types.length > 0 && <span className="text-slate-600"> · {detail.types.map(type => t.log.painTypes[type]).join(', ')}</span>}
            </li>)}
          </ul>
        </ReportField>}
        <ReportField label={t.report.cycleMarkers}>
          {[entry.periodStart && t.report.periodStart, entry.periodEnd && t.report.periodEnd].filter(Boolean).join(' · ') || '—'}
        </ReportField>
        {(entry.painTiming?.length || entry.painContexts?.length) ? <ReportField label={t.report.timingContext}>
          {[...(entry.painTiming ?? []).map(value => t.log.painTiming[value]), ...(entry.painContexts ?? []).map(value => t.log.painContexts[value])].join(' · ')}
        </ReportField> : null}
        {symptoms.length > 0 && <ReportField label={t.report.associatedSymptomsHeader}>{symptoms.join(' · ')}</ReportField>}
        {entry.moodSymptoms?.length ? <ReportField label={t.report.recordedMood}>{entry.moodSymptoms.map(value => t.log.moodOptions[value as keyof typeof t.log.moodOptions] || value).join(' · ')}</ReportField> : null}
        {hasBleedingDetails && <ReportField label={t.report.bleedingObservations}>
          {[
            entry.padsOrTamponsUsed != null ? `${t.log.padCount}: ${entry.padsOrTamponsUsed}` : null,
            entry.soakedWithinHour != null ? `${t.log.soakedWithinHour}: ${yesNo(entry.soakedWithinHour)}` : null,
            entry.largeClots != null ? `${t.log.largeClots}: ${yesNo(entry.largeClots)}` : null,
            entry.bleedingBetweenPeriods != null ? `${t.log.bleedingBetweenPeriods}: ${yesNo(entry.bleedingBetweenPeriods)}` : null,
          ].filter(Boolean).join(' · ') || '—'}
        </ReportField>}
        {(entry.bloodInStool != null || entry.bloodInUrine != null) && <ReportField label={t.report.otherRecordedObservations}>
          {[
            entry.bloodInStool != null ? `${t.log.bloodInStool}: ${yesNo(entry.bloodInStool)}` : null,
            entry.bloodInUrine != null ? `${t.log.bloodInUrine}: ${yesNo(entry.bloodInUrine)}` : null,
          ].filter(Boolean).join(' · ')}
        </ReportField>}
        {entry.painkillerTaken && <ReportField label={t.report.medicationResponse}>
          <span>{entry.painkillerName || t.report.medicationNameNotRecorded}</span>
          <span className="text-slate-600"> · {medicationResponse}</span>
        </ReportField>}
      </div>
      {entry.notes && <div className="mt-3 border-t border-slate-100 pt-3 text-sm">
        <p className="text-xs font-semibold text-slate-600">{t.log.notesLabel}</p>
        <p className="mt-1 whitespace-pre-wrap text-slate-800">{entry.notes}</p>
      </div>}
    </article>
  );
};

const ReportField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <div className="mt-1 break-words text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);
