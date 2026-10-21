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
    <header className="sticky top-0 z-40 bg-[#fffefa]/95 backdrop-blur-xl border-b border-stone-200 px-4 py-3 md:col-start-2 md:row-start-1 md:px-8 md:py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-600/25 ring-2 ring-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-700 border-2 border-white rounded-full" aria-hidden="true" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-[15px] font-extrabold tracking-tight text-slate-900 leading-tight">
                  {t.app.title}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-slate-700 border border-stone-200">
                  {t.app.prototypeLabel}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-snug mt-0.5">
                {t.app.subtitle}
              </p>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center space-x-1.5">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="flex min-h-11 items-center space-x-1.5 text-sm font-semibold px-3 rounded-xl bg-white hover:bg-stone-100 text-slate-800 transition border border-stone-300"
              aria-label={language === 'en' ? 'Switch language to Kiswahili' : 'Switch language to English'}
            >
              <Globe className="w-3.5 h-3.5 text-brand-700" />
              <span>{language === 'en' ? '🇰🇪 SW' : '🇬🇧 EN'}</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-white hover:bg-stone-100 text-slate-700 transition border border-stone-300"
              aria-label={t.app.settingsLabel}
            >
              <Settings className="w-3.5 h-3.5 text-slate-700" />
            </button>

            {/* Discreet Lock */}
            <button
              onClick={onLockApp}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-white hover:bg-stone-100 text-slate-700 transition border border-stone-300"
              aria-label={t.app.privacyLock}
            >
              <Lock className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Demo Mode Sub-banner (Crucial for Hackathon Demo Day) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:justify-end sm:border-l sm:border-stone-200 sm:pl-4">
          <div className="flex items-center space-x-1.5">
            <span className={`inline-block w-2.5 h-2.5 rounded-full border ${isDemo ? 'bg-amber-100 border-amber-700' : 'bg-slate-100 border-slate-500'}`} aria-hidden="true" />
            <span className="font-medium text-slate-700">
              {activeScenario
                ? t.app.syntheticScenarioActive.replace('{name}', activeScenario.profile.name)
                : isDemo ? t.app.demoActive : t.app.localDataLabel}
            </span>
          </div>

          <button
            onClick={handleToggleDemo}
            className={`flex min-h-11 items-center space-x-2 text-xs font-semibold px-3 rounded-xl transition border ${
              isDemo 
                ? 'bg-white hover:bg-stone-100 text-slate-800 border-stone-300' 
                : 'bg-brand-50 hover:bg-brand-100 text-brand-900 border-brand-200'
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
