import React, { useState, useEffect } from 'react';
import { useI18n } from '../locales/i18nContext';
import { StorageService } from '../services/storageService';
import { LogEntry } from '../types';
import { dateToLocalIso } from '../utils/dates';
import { Pagination } from './Pagination';
import { 
  Trash2, 
  Droplet, 
  Pill, 
  Calendar,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';

interface TimelineViewProps {
  entries: LogEntry[];
  onRefresh: () => void;
  onNavigateToReport?: () => void;
  onNavigateToLog?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ 
  entries, 
  onRefresh,
  onNavigateToReport,
  onNavigateToLog
}) => {
  const { t, language } = useI18n();
  const [filter, setFilter] = useState<'all' | 'period' | 'high_pain'>('all');
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 11;

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    if (activeDate) return e.date === activeDate;
    if (filter === 'period') return e.flow !== 'none';
    if (filter === 'high_pain') return e.painScore >= 7;
    return true;
  });

  // Reset page to 1 when filter or active date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, activeDate]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pagedEntries = filteredEntries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (confirm(t.timeline.deleteConfirm)) {
      StorageService.deleteEntry(id);
      if (selectedEntry?.id === id) setActiveDate(null);
      onRefresh();
    }
  };

  // Summary Metrics
  const periodEntries = entries.filter((e) => e.flow !== 'none');
  const avgPeriodPain = periodEntries.length > 0
    ? (periodEntries.reduce((acc, curr) => acc + curr.painScore, 0) / periodEntries.length).toFixed(1)
    : '0';
  const peakPain = entries.length > 0 ? Math.max(...entries.map((e) => e.painScore)) : 0;
  const daysMissed = entries.filter(
    (e) => e.dailyImpact === 'missed_school_work' || e.dailyImpact === 'bed_rest'
  ).length;

  const cycleCount = entries.filter(e => e.periodStart).length;
  const baseline = StorageService.generateClinicianSummary(entries).descriptiveBaseline;

  // Keep the chart descriptive: plot only recorded dates and never interpolate missing days.
  const chartEnd = new Date();
  chartEnd.setHours(0, 0, 0, 0);
  const chartStart = new Date(chartEnd);
  chartStart.setDate(chartStart.getDate() - 29);
  const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const chartStartKey = toDateKey(chartStart);
  const chartEndKey = toDateKey(chartEnd);
  const chartDateFormatter = new Intl.DateTimeFormat(language === 'sw' ? 'sw-KE' : 'en-KE', {
    month: 'short',
    day: 'numeric',
  });
  const chartEntries = entries
    .filter((entry) => entry.date >= chartStartKey && entry.date <= chartEndKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const chartWidth = 640;
  const chartHeight = 260;
  const chartMargins = { top: 18, right: 20, bottom: 42, left: 56 };
  const plotWidth = chartWidth - chartMargins.left - chartMargins.right;
  const plotHeight = chartHeight - chartMargins.top - chartMargins.bottom;
  const chartX = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const [startYear, startMonth, startDay] = chartStartKey.split('-').map(Number);
    const elapsedDays = (Date.UTC(year, month - 1, day) - Date.UTC(startYear, startMonth - 1, startDay)) / 86_400_000;
    return chartMargins.left + (elapsedDays / 29) * plotWidth;
  };
  const chartY = (score: number) => chartMargins.top + ((10 - score) / 10) * plotHeight;
  const chartDateTicks = [0, 14, 29].map((dayOffset) => {
    const date = new Date(chartStart);
    date.setDate(date.getDate() + dayOffset);
    return { x: chartMargins.left + (dayOffset / 29) * plotWidth, label: chartDateFormatter.format(date) };
  });

  // Selected entry if activeDate is clicked
  const selectedEntry = entries.find((e) => e.date === activeDate);

  // Generate last 30 calendar days (not just logged days)
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = dateToLocalIso(d);
    const entry = entries.find(e => e.date === dateStr) || null;
    return { dateStr, entry };
  });

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getPainBadge = (score: number) => {
    return { label: `${score}/10 · ${t.timeline.recordedLabel}`, bg: 'bg-stone-100 text-slate-800 border-stone-300' };
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-8 pt-1">
      {/* 1. Calm, Minimalist Summary Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/70">
        <div className="flex items-center justify-between mb-3">
          <div>
              <span className="text-xs font-semibold text-slate-600 block">
              {t.timeline.recordedHistory}
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {t.timeline.cyclePatternsTitle}
            </h2>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/50">
            {cycleCount} {t.timeline.markedPeriodStarts}
          </span>
        </div>

        {/* Clean 3-Metric Row */}
        <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100 sm:grid-cols-3">
          <div className="text-center p-2 rounded-2xl bg-slate-50">
            <span className="text-xs text-slate-600 font-medium block">{t.timeline.averagePeriodFlowPain}</span>
            <span className="text-xl font-bold text-slate-900">
              {avgPeriodPain} <span className="text-[10px] font-medium text-slate-400">/10</span>
            </span>
          </div>

          <div className="text-center p-2 rounded-2xl bg-slate-50">
            <span className="text-xs text-slate-600 font-medium block">{t.timeline.highestRecordedPain}</span>
            <span className="text-xl font-bold text-slate-900">
              {peakPain} <span className="text-[10px] font-medium text-slate-400">/10</span>
            </span>
          </div>

          <div className="text-center p-2 rounded-2xl bg-slate-50">
            <span className="text-xs text-slate-600 font-medium block">{t.timeline.impactDaysLabel}</span>
            <span className="text-xl font-bold text-slate-900">
              {daysMissed} <span className="text-xs font-medium text-slate-500">{t.timeline.daysUnit}</span>
            </span>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900">{t.timeline.baselineTitle}</h3>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{t.timeline.baselineNote}</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 p-2"><span className="block text-[9px] text-slate-500">{t.timeline.baselineCycles}</span><strong>{baseline.cyclesIncluded}</strong></div>
          <div className="rounded-xl bg-slate-50 p-2"><span className="block text-[9px] text-slate-500">{t.timeline.averageCycleLength}</span><strong>{baseline.averageCycleLengthDays == null ? '—' : `${baseline.averageCycleLengthDays} ${t.timeline.daysUnit}`}</strong></div>
          <div className="rounded-xl bg-slate-50 p-2"><span className="block text-[9px] text-slate-500">{t.timeline.averagePeriodPain}</span><strong>{baseline.averagePeriodPain == null ? '—' : `${baseline.averagePeriodPain}/10`}</strong></div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm" aria-labelledby="recorded-pain-chart-title">
        <div className="flex items-start gap-3">
          <Activity aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <div className="min-w-0 flex-1">
            <h3 id="recorded-pain-chart-title" className="text-sm font-bold text-slate-900">{t.timeline.recordedPainChartTitle}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{t.timeline.recordedPainChartDescription}</p>
          </div>
        </div>

        {chartEntries.length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{t.timeline.recordedPainChartEmpty}</p>
        ) : (
          <>
            <figure className="mt-4" aria-describedby="recorded-pain-chart-note">
              <svg
                className="block h-auto w-full overflow-visible"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                role="img"
                aria-labelledby="recorded-pain-chart-title recorded-pain-chart-svg-description"
              >
                <desc id="recorded-pain-chart-svg-description">{t.timeline.recordedPainChartDescription}</desc>
                {[0, 2, 4, 6, 8, 10].map((score) => {
                  const y = chartY(score);
                  return (
                    <g key={score}>
                      <line x1={chartMargins.left} y1={y} x2={chartWidth - chartMargins.right} y2={y} stroke="#e7e5e4" strokeDasharray={score === 0 ? undefined : '3 5'} />
                      <text x={chartMargins.left - 10} y={y + 4} textAnchor="end" className="fill-slate-600 text-[12px]">{score}</text>
                    </g>
                  );
                })}
                {chartDateTicks.map((tick) => (
                  <g key={tick.label}>
                    <line x1={tick.x} y1={chartMargins.top} x2={tick.x} y2={chartMargins.top + plotHeight} stroke="#f1f0ee" />
                    <text x={tick.x} y={chartHeight - 12} textAnchor="middle" className="fill-slate-600 text-[12px]">{tick.label}</text>
                  </g>
                ))}
                <text x={14} y={chartMargins.top + plotHeight / 2} textAnchor="middle" transform={`rotate(-90 14 ${chartMargins.top + plotHeight / 2})`} className="fill-slate-700 text-[12px]">{t.timeline.recordedPainAxis}</text>
                {chartEntries.map((entry) => (
                  <circle key={entry.id} cx={chartX(entry.date)} cy={chartY(entry.painScore)} r={5} fill="#69486d" stroke="#fffefa" strokeWidth={2}>
                    <title>{t.timeline.chartPointLabel
                      .replace('{date}', chartDateFormatter.format(new Date(`${entry.date}T00:00:00`)))
                      .replace('{score}', String(entry.painScore))}</title>
                  </circle>
                ))}
              </svg>
            </figure>

            <details className="mt-3 border-t border-stone-200 pt-2">
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-brand-900 underline-offset-4 hover:underline">{t.timeline.chartTableSummary}</summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-stone-200 text-slate-700"><th scope="col" className="py-2 pr-4">{t.timeline.chartDateColumn}</th><th scope="col" className="py-2">{t.timeline.chartPainColumn}</th></tr></thead>
                  <tbody>{chartEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-4 text-slate-700">{chartDateFormatter.format(new Date(`${entry.date}T00:00:00`))}</td>
                      <td className="py-2 font-medium text-slate-900">{entry.painScore}/10</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </details>
          </>
        )}
        <p id="recorded-pain-chart-note" className="mt-3 rounded-xl bg-stone-50 p-3 text-xs leading-relaxed text-slate-700">{t.timeline.recordedPainChartNote}</p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm" aria-labelledby="tracking-boundary-title">
        <h3 id="tracking-boundary-title" className="text-sm font-bold text-slate-900">{t.trackingBoundary.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{t.trackingBoundary.body}</p>
        {onNavigateToReport && <button type="button" onClick={onNavigateToReport} className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">{t.trackingBoundary.report}</button>}
      </section>

      {/* 3. Interactive Calendar Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2 px-1">
          <span>{t.timeline.last30Days}</span>
          {activeDate && (
            <button
              type="button"
              onClick={() => setActiveDate(null)}
              className="min-h-11 px-2 text-sm text-brand-900 font-semibold underline-offset-4 hover:underline"
            >
              {t.timeline.showAll}
            </button>
          )}
        </div>

        {/* Scrollable date strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          {calendarDays.map((day) => {
            const isPeriod = day.entry ? day.entry.flow !== 'none' : false;
            const isSelected = activeDate === day.dateStr;
            const dateObj = new Date(day.dateStr + 'T00:00:00');
            const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'narrow' });
            const dayNum = dateObj.getDate();
            const hasLog = day.entry !== null;
            const highPain = day.entry ? day.entry.painScore >= 7 : false;

            return (
              <button
                key={day.dateStr}
                type="button"
                aria-pressed={isSelected}
                aria-label={hasLog ? [t.timeline.dayWithEntry.replace('{date}', formatDisplayDate(day.dateStr)), isPeriod ? t.timeline.periodFlowRecorded : '', highPain ? t.timeline.highPainRecorded : ''].filter(Boolean).join(', ') : t.timeline.dayWithoutEntry.replace('{date}', formatDisplayDate(day.dateStr))}
                onClick={() => {
                  if (hasLog) setActiveDate(isSelected ? null : day.dateStr);
                }}
                className={`flex min-h-[52px] min-w-[48px] flex-col items-center justify-center py-2 rounded-xl transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-brand-900 text-white ring-2 ring-brand-300'
                    : isPeriod
                    ? 'bg-rose-50 border border-rose-200 text-slate-800 hover:bg-rose-100'
                    : hasLog
                    ? 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
                    : 'bg-white border border-dashed border-slate-300 text-slate-500'
                }`}
              >
                <span className={`text-[10px] font-semibold ${isSelected ? 'text-slate-300' : hasLog ? 'text-slate-400' : 'text-slate-300'}`}>
                  {dayName}
                </span>
                <span className={`text-xs font-black my-0.5 ${!hasLog ? 'text-slate-300' : ''}`}>
                  {dayNum}
                </span>
                {/* Dot marker */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected
                      ? 'bg-brand-400'
                      : isPeriod
                      ? 'bg-rose-500'
                      : highPain
                      ? 'bg-amber-500'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-slate-700">{t.timeline.blankDateNotice}</p>
      </div>

      {/* 3. Clean Filter Tabs */}
      {!activeDate && (
        <div className="flex items-center space-x-1.5 px-0.5">
          <button
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={`min-h-11 text-xs font-semibold px-3.5 py-2 rounded-xl transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
            }`}
          >
            {t.timeline.allLogs} ({entries.length})
          </button>
          <button
            onClick={() => setFilter('period')}
            aria-pressed={filter === 'period'}
            className={`min-h-11 text-xs font-semibold px-3.5 py-2 rounded-xl transition ${
              filter === 'period'
                ? 'bg-brand-700 text-white'
                : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
            }`}
          >
            {t.timeline.periodDays} ({periodEntries.length})
          </button>
          <button
            onClick={() => setFilter('high_pain')}
            aria-pressed={filter === 'high_pain'}
            className={`min-h-11 text-xs font-semibold px-3.5 py-2 rounded-xl transition ${
              filter === 'high_pain'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
            }`}
          >
            {t.timeline.painAtLeastSeven} ({entries.filter((e) => e.painScore >= 7).length})
          </button>
        </div>
      )}

      {/* 4. Streamlined Chronological Feed */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          {entries.length === 0 ? <>
            <h3 className="text-base font-semibold text-slate-900">{t.timeline.noEntriesHeading}</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-700">{t.timeline.noEntriesBody}</p>
            {onNavigateToLog && <button type="button" onClick={onNavigateToLog} className="mt-4 min-h-11 rounded-xl bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900">{t.timeline.logFirstEntry}</button>}
          </> : <p className="text-sm text-slate-600 font-medium">{t.timeline.noMatchingLogs}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {pagedEntries.map((entry) => {
              const isPeriod = entry.flow !== 'none';
              const painBadge = getPainBadge(entry.painScore);

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200"
              >
                {/* Header row: Date & Pain Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">
                      {formatDisplayDate(entry.date)}
                    </span>
                    {isPeriod && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-slate-800 border border-rose-200 flex items-center space-x-1">
                        <Droplet className="w-2.5 h-2.5 fill-rose-600" />
                        <span>{t.log.flows[entry.flow]}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {entry.painScore >= 9 || entry.soakedWithinHour === true || (entry.symptoms && entry.symptoms.includes('possible_pregnancy')) ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <span>🚨</span>
                        <span>{t.emergency.flaggedBadge}</span>
                      </span>
                    ) : null}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${painBadge.bg}`}>
                      {painBadge.label}
                    </span>
          <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-slate-700 hover:text-rose-800 hover:bg-rose-50 transition"
                      aria-label={t.timeline.deleteEntry.replace('{date}', entry.date)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <details className="group mt-3 border-t border-stone-200 pt-1">
                  <summary className="min-h-11 cursor-pointer rounded-lg py-2 text-sm font-semibold text-brand-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-brand-700">
                    <span className="group-open:hidden">{t.timeline.viewDetails}</span>
                    <span className="hidden group-open:inline">{t.timeline.hideDetails}</span>
                  </summary>
                {/* Secondary details stay available without making every entry card long. */}
                <div className="space-y-2 text-sm leading-relaxed text-slate-700">
                  {/* Detailed Pain Characteristics */}
                  {entry.painDetails && entry.painDetails.length > 0 ? (
                    <div className="space-y-1">
                      {entry.painDetails.map((pd, pidx) => (
                        <div key={pidx} className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="font-bold text-slate-800">
                            {t.log.locations[pd.location] || pd.location}:
                          </span>
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {pd.magnitude}/10
                          </span>
                          {pd.types.map((tp, tidx) => (
                            <span 
                              key={tidx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200/60"
                            >
                              {t.log.painTypes[tp] || tp}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : entry.painLocations.length > 0 ? (
                    <p className="font-medium">
                      <span className="text-slate-400 font-normal">Location: </span>
                      {entry.painLocations.map((l) => t.log.locations[l]).join(', ')}
                    </p>
                  ) : null}

                  {entry.symptoms.length > 0 && (
                    <p className="font-medium text-slate-800">
                      <span className="text-slate-400 font-normal">Symptoms: </span>
                      {entry.symptoms.map((s) => {
                        const customItem = StorageService.getCustomSymptoms().find(c => c.id === s);
                        if (customItem) return `${customItem.name} (Custom)`;
                        const std = t.log.symptoms[s as keyof typeof t.log.symptoms];
                        return std ? std.split('(')[0].trim() : s;
                      }).join(' • ')}
                    </p>
                  )}

                  {entry.dailyImpact !== 'none' && (
                    <p className="text-sm font-semibold text-slate-800">
                      {t.log.impacts[entry.dailyImpact]}
                    </p>
                  )}

                  {(entry.painTiming?.length || entry.painContexts?.length) ? <p className="text-[11px] text-slate-600">
                    {entry.painTiming?.map(value => t.log.painTiming[value]).join(', ')}{entry.painTiming?.length && entry.painContexts?.length ? ' · ' : ''}{entry.painContexts?.map(value => t.log.painContexts[value]).join(', ')}
                  </p> : null}
                  {(entry.periodStart || entry.periodEnd || entry.padsOrTamponsUsed != null || entry.soakedWithinHour != null || entry.largeClots != null || entry.bleedingBetweenPeriods != null) && <p className="text-[11px] text-slate-600">
                    {entry.periodStart ? `${t.log.periodStart}. ` : ''}{entry.periodEnd ? `${t.log.periodEnd}. ` : ''}
                    {entry.padsOrTamponsUsed != null ? `${t.log.padCount}: ${entry.padsOrTamponsUsed}. ` : ''}
                    {entry.soakedWithinHour != null ? `${t.log.soakedWithinHour}: ${entry.soakedWithinHour ? t.log.yes : t.log.no}. ` : ''}
                    {entry.largeClots != null ? `${t.log.largeClots}: ${entry.largeClots ? t.log.yes : t.log.no}. ` : ''}
                    {entry.bleedingBetweenPeriods != null ? `${t.log.bleedingBetweenPeriods}: ${entry.bleedingBetweenPeriods ? t.log.yes : t.log.no}.` : ''}
                  </p>}
                  {(entry.bloodInStool != null || entry.bloodInUrine != null || entry.moodSymptoms?.length) && <p className="text-[11px] text-slate-600">
                    {entry.bloodInStool != null ? `${t.log.bloodInStool}: ${entry.bloodInStool ? t.log.yes : t.log.no}. ` : ''}
                    {entry.bloodInUrine != null ? `${t.log.bloodInUrine}: ${entry.bloodInUrine ? t.log.yes : t.log.no}. ` : ''}
                    {entry.moodSymptoms?.map(value => t.log.moodOptions[value as keyof typeof t.log.moodOptions] || value).join(', ')}
                  </p>}

                  {entry.painkillerTaken && (
                    <p className="text-[11px] flex items-center space-x-1 text-slate-500 pt-0.5">
                      <Pill className="w-3 h-3 text-brand-600" />
                      <span>{entry.painkillerName ? `${entry.painkillerName}: ` : `${t.log.medicationLabel} `}</span>
                      <strong className={entry.painkillerEffective ? 'text-emerald-700' : 'text-rose-700'}>
                        {entry.painkillerEffective === 'partly' ? t.log.somewhat : entry.painkillerEffective ? t.log.yes : t.log.no}
                      </strong>
                    </p>
                  )}
                </div>

                {/* Personal Note */}
                {entry.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-sm text-slate-700">
                    "{entry.notes}"
                  </div>
                )}
                </details>
              </div>
            );
          })}
          </div>

          {/* Pagination Controls (Max 11 entries per page) */}
          <Pagination
            currentPage={safePage}
            totalItems={filteredEntries.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
