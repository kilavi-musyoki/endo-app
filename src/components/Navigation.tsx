import React from 'react';
import { useI18n } from '../locales/i18nContext';
import { PlusCircle, CalendarDays, FileSpreadsheet, BookHeart } from 'lucide-react';

export type TabType = 'log' | 'timeline' | 'report' | 'education';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'timeline' as TabType, label: t.nav.timeline, shortLabel: t.nav.shortTimeline, icon: CalendarDays },
    { id: 'log' as TabType, label: t.nav.log, shortLabel: t.nav.shortLog, icon: PlusCircle, isPrimary: true },
    { id: 'report' as TabType, label: t.nav.report, shortLabel: t.nav.shortReport, icon: FileSpreadsheet },
    { id: 'education' as TabType, label: t.nav.education, shortLabel: t.nav.shortEducation, icon: BookHeart },
  ];

  return (
    <nav id="primary-navigation" aria-label={t.nav.primaryNavigation} className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-[#fffefa]/95 px-2 pt-1 pb-[max(.6rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform print:hidden md:fixed md:inset-y-0 md:left-0 md:right-auto md:h-dvh md:w-60 md:overflow-y-auto md:border-r md:border-t-0 md:px-4 md:py-6 md:shadow-none shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="mx-auto grid max-w-md grid-cols-4 items-center gap-1 md:max-w-none md:grid-cols-1 md:content-start md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex min-h-13 flex-col items-center justify-center group transition-colors md:mt-0 md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-2.5 hover:bg-brand-50"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                  isActive
                    ? 'bg-brand-700 text-white shadow-brand-700/25 ring-2 ring-brand-300'
                    : 'bg-brand-100 text-brand-900 group-hover:bg-brand-200'
                }`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2px]" />
                </div>
                <span className={`text-[11px] mt-0.5 font-bold leading-tight md:text-sm md:mt-0 ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                  <span className="md:hidden">{item.shortLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-13 flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-xl transition-colors md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5 ${
                isActive
                  ? 'text-brand-900 font-bold bg-brand-50/90 md:bg-brand-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4px] text-brand-700' : 'stroke-[1.8px]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-600 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] leading-tight text-center md:text-sm ${isActive ? 'font-bold text-brand-900' : 'font-semibold text-slate-700'}`}>
                <span className="md:hidden">{item.shortLabel}</span>
                <span className="hidden md:inline">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
