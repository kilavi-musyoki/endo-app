import React from 'react';
import { useI18n } from '../locales/i18nContext';
import { StorageService } from '../services/storageService';
import { Settings, Sparkles, RefreshCw, Lock, Globe, HeartPulse } from 'lucide-react';

interface HeaderProps {
  onRefreshData: () => void;
  onLockApp: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefreshData, onLockApp, onOpenSettings }) => {
  const { language, setLanguage, t } = useI18n();
  const isDemo = StorageService.isDemoMode();
  const activeScenario = StorageService.getActiveSyntheticScenario();

  const handleToggleDemo = () => {
    if (isDemo) {
      const confirmation = activeScenario ? t.app.clearScenarioConfirm : t.app.clearDemoConfirm;
      if (confirm(confirmation)) {
        StorageService.clearToFreshDataset();
        onRefreshData();
      }
    } else {
      if (confirm(t.app.loadDemoConfirm)) {
        StorageService.loadDemoDataset();
        onRefreshData();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffefa]/95 backdrop-blur-xl border-b border-stone-200 px-3 py-2.5 sm:px-6 sm:py-3 md:col-start-2 md:row-start-1 md:px-8 md:py-4 transition-all">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 md:gap-3">
        {/* Main Row: Logo, Brand & Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-600/20 ring-2 ring-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-700 border-2 border-white rounded-full" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                  {t.app.title}
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-slate-700 border border-stone-200 shrink-0">
                  {t.app.prototypeLabel}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-tight mt-0.5 hidden xs:block sm:block truncate">
                {t.app.subtitle}
              </p>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="flex h-9 sm:h-10 items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 rounded-xl bg-white hover:bg-stone-50 text-slate-800 transition border border-stone-300 shadow-2xs"
              aria-label={language === 'en' ? 'Switch language to Kiswahili' : 'Switch language to English'}
              title={language === 'en' ? 'Badilisha hadi Kiswahili' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-brand-700 shrink-0" />
              <span className="font-bold">{language === 'en' ? '🇰🇪 SW' : '🇬🇧 EN'}</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white hover:bg-stone-50 text-slate-700 transition border border-stone-300 shadow-2xs"
              aria-label={t.app.settingsLabel}
              title={t.app.settingsLabel}
            >
              <Settings className="w-4 h-4 text-slate-700" />
            </button>

            {/* Discreet Lock */}
            <button
              onClick={onLockApp}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white hover:bg-stone-50 text-slate-700 transition border border-stone-300 shadow-2xs"
              aria-label={t.app.privacyLock}
              title={t.app.privacyLock}
            >
              <Lock className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Clinical Disclaimer & Safety Boundary Banner */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50/90 border border-rose-200/80 text-[11px] font-medium text-rose-900 leading-snug">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden="true" />
          <span className="truncate sm:whitespace-normal">{t.app.disclaimerBadge}</span>
        </div>

        {/* Demo Mode / Data Status Sub-banner */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-1 sm:py-1.5 rounded-lg border text-xs transition-colors bg-stone-50/90 border-stone-200">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${isDemo ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-slate-400'}`}
              aria-hidden="true"
            />
            <span className="text-[11px] font-medium text-slate-700 truncate">
              {activeScenario
                ? t.app.syntheticScenarioActive.replace('{name}', activeScenario.profile.name)
                : isDemo ? t.app.demoActive : t.app.localDataLabel}
            </span>
          </div>

          <button
            onClick={handleToggleDemo}
            className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md transition border shadow-2xs ${
              isDemo 
                ? 'bg-white hover:bg-rose-50 text-rose-800 border-rose-200' 
                : 'bg-white hover:bg-brand-50 text-brand-900 border-brand-200'
            }`}
          >
            {isDemo ? (
              <>
                <RefreshCw className="w-3 h-3 text-rose-600" />
                <span>{t.app.clearDemo}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>{t.app.loadDemo}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
