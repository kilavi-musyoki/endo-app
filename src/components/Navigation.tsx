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
    { id: 'timeline' as TabType, label: t.nav.timeline, icon: CalendarDays },
    { id: 'log' as TabType, label: t.nav.log, icon: PlusCircle, isPrimary: true },
    { id: 'report' as TabType, label: t.nav.report, icon: FileSpreadsheet },
    { id: 'education' as TabType, label: t.nav.education, icon: BookHeart },
  ];

  return (
    <nav id="primary-navigation" aria-label={t.nav.primaryNavigation} className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-300 bg-[#fffefa]/95 px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform print:hidden md:fixed md:inset-y-0 md:left-0 md:right-auto md:h-dvh md:w-60 md:overflow-y-auto md:border-r md:border-t-0 md:px-4 md:py-6 md:shadow-none">
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
                className="flex min-h-14 flex-col items-center justify-center group transition-colors md:mt-0 md:flex-row md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-2 hover:bg-brand-50"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'bg-brand-100 text-brand-900 group-hover:bg-brand-200'
                }`}>
                  <Icon className="w-6 h-6 stroke-[2.2px]" />
                </div>
                <span className={`text-xs mt-1 font-semibold md:mt-0 ${isActive ? 'text-brand-900' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 rounded-xl transition-colors md:flex-row md:justify-start md:gap-3 md:px-3 ${
                isActive
                  ? 'text-brand-900 font-semibold bg-brand-50 md:bg-brand-100'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-stone-100 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-brand-700' : 'stroke-[1.8px]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 rounded-full" />
                )}
              </div>
              <span className="text-xs truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
