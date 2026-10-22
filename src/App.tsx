import React, { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './locales/i18nContext';
import { StorageService } from './services/storageService';
import { LogEntry } from './types';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DailyLogModal } from './components/DailyLogModal';
import { TimelineView } from './components/TimelineView';
import { ClinicianReportView } from './components/ClinicianReportView';
import { EducationView } from './components/EducationView';
import { DiscreetLockModal } from './components/DiscreetLockModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsView } from './components/SettingsView';

export const AppContent: React.FC = () => {
  const { t } = useI18n();
  const [currentTab, setCurrentTab] = useState<TabType>('timeline');
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('endocare_onboarded');
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const refreshData = () => {
    const updated = StorageService.getEntries();
    setEntries(updated);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDismissOnboarding = (displayName: string) => {
    if (displayName) {
      StorageService.saveUserProfile({ name: displayName });
    }
    localStorage.setItem('endocare_onboarded', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-rose-50/40 flex flex-col font-sans md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-brand-900 focus:shadow-lg">{t.app.skipToContent}</a>
      {/* Privacy Lock Screen */}
      {isLocked && <DiscreetLockModal onUnlock={() => setIsLocked(false)} />}

      {/* Onboarding Dialog */}
      {showOnboarding && <OnboardingModal onDismiss={handleDismissOnboarding} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsView
          onClose={() => setShowSettings(false)}
          onDataUpdated={refreshData}
        />
      )}

      {/* Persistent Header */}
      <Header onRefreshData={refreshData} onLockApp={() => setIsLocked(true)} onOpenSettings={() => setShowSettings(true)} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 min-w-0 w-full px-3 py-4 pb-28 sm:px-6 sm:py-6 md:col-start-2 md:row-start-2 md:px-8 md:py-8 md:pb-10">
        {currentTab === 'log' && (
          <DailyLogModal
            entries={entries}
            onSaved={() => {
              refreshData();
              setCurrentTab('timeline');
            }}
            onNavigateToCare={() => setCurrentTab('education')}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelineView 
            entries={entries} 
            onRefresh={refreshData} 
            onNavigateToReport={() => setCurrentTab('report')}
            onNavigateToLog={() => setCurrentTab('log')}
          />
        )}

        {currentTab === 'report' && <ClinicianReportView entries={entries} />}

        {currentTab === 'education' && <EducationView />}
      </main>

      {/* Bottom Navigation */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;
