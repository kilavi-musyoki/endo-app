import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../locales/i18nContext';
import { StorageService } from '../services/storageService';
import { UserProfile } from '../types';
import { Settings, X, User, KeyRound, Globe, Trash2, Info } from 'lucide-react';
import { threeUserSyntheticFixtures } from '../data/threeUserSyntheticFixtures';

interface SettingsViewProps {
  onClose: () => void;
  onDataUpdated: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose, onDataUpdated }) => {
  const { language, t } = useI18n();
  const profile = StorageService.getUserProfile();
  const activeSyntheticScenario = StorageService.getActiveSyntheticScenario();

  const [name, setName] = useState<string>(profile.name || '');
  const [age, setAge] = useState(profile.age == null ? '' : String(profile.age));
  const [ageAtFirstPeriod, setAgeAtFirstPeriod] = useState(profile.ageAtFirstPeriod == null ? '' : String(profile.ageAtFirstPeriod));
  const [pregnancies, setPregnancies] = useState(profile.pregnancies == null ? '' : String(profile.pregnancies));
  const [tryingToConceive, setTryingToConceive] = useState<boolean | null>(profile.tryingToConceive ?? null);
  const [monthsTrying, setMonthsTrying] = useState(profile.monthsTryingToConceive == null ? '' : String(profile.monthsTryingToConceive));
  const [familyHistory, setFamilyHistory] = useState(profile.familyHistoryEndometriosis ?? '');
  const [knownConditions, setKnownConditions] = useState(profile.knownConditions ?? '');
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinMessage, setPinMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [nameSaved, setNameSaved] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]');
    focusable()?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Tab') {
        const elements = focusable();
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, []);

  const handleSaveName = () => {
    StorageService.saveUserProfile({ name: name.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveHealthHistory = () => {
    StorageService.saveUserProfile({
      age: age === '' ? null : Number(age),
      ageAtFirstPeriod: ageAtFirstPeriod === '' ? null : Number(ageAtFirstPeriod),
      pregnancies: pregnancies === '' ? null : Number(pregnancies),
      tryingToConceive,
      monthsTryingToConceive: monthsTrying === '' ? null : Number(monthsTrying),
      familyHistoryEndometriosis: familyHistory ? familyHistory as NonNullable<UserProfile['familyHistoryEndometriosis']> : undefined,
      knownConditions: knownConditions.trim() || undefined,
    });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleChangePin = () => {
    const storedPin = profile.pin ?? '1234';
    if (currentPin !== storedPin) {
      setPinMessage({ text: t.settings.pinCurrentError, isError: true });
      return;
    }
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinMessage({ text: t.settings.pinLengthError, isError: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: t.settings.pinMismatchError, isError: true });
      return;
    }
    StorageService.saveUserProfile({ pin: newPin });
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setPinMessage({ text: t.settings.pinChanged, isError: false });
    setTimeout(() => setPinMessage(null), 3000);
  };

  const handleDeleteAllData = () => {
    StorageService.deleteAllData();
    onDataUpdated();
    window.location.reload();
  };

  const handleLoadSyntheticScenario = (scenarioId: string, scenarioName: string) => {
    if (!window.confirm(t.settings.loadScenarioConfirm.replace('{name}', scenarioName))) return;
    const entries = StorageService.loadSyntheticUserScenario(scenarioId);
    if (!entries) return;
    onDataUpdated();
    onClose();
  };

  const handleClearSyntheticScenario = () => {
    if (!window.confirm(t.settings.clearSyntheticScenarioConfirm)) return;
    StorageService.clearToFreshDataset();
    onDataUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 flex items-center justify-center p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="settings-dialog-title" className="bg-white rounded-2xl max-w-xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-brand-700" />
            <h2 id="settings-dialog-title" className="text-lg font-bold text-slate-900 tracking-tight">{t.settings.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 transition"
            aria-label={t.settings.closeSettings}
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <User className="w-4 h-4 text-brand-600" />
              <span id="display-name-label">{t.settings.displayName}</span>
            </label>
            <p className="text-sm text-slate-700">{t.settings.displayNameHelp}</p>
            <div className="flex space-x-2">
              <input
                id="display-name-input"
                aria-labelledby="display-name-label"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.report.notProvided}
                className="flex-1 text-xs border border-slate-300/80 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
              />
              <button
                onClick={handleSaveName}
                aria-live="polite"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition active:scale-95"
              >
                {nameSaved ? `✓ ${t.settings.savedName}` : t.settings.saveName}
              </button>
            </div>
          </div>

          {/* Optional sensitive profile details */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t.settings.profileDetails}</h3>
              <p className="mt-1 text-[11px] text-slate-500">{t.settings.profileExplanation}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[11px] text-slate-600">{t.settings.age}
                <input type="number" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2" />
              </label>
              <label className="text-[11px] text-slate-600">{t.settings.ageAtFirstPeriod}
                <input type="number" min="1" max="60" value={ageAtFirstPeriod} onChange={e => setAgeAtFirstPeriod(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2" />
              </label>
              <label className="text-[11px] text-slate-600">{t.settings.pregnancies}
                <input type="number" min="0" value={pregnancies} onChange={e => setPregnancies(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2" />
              </label>
              <label className="text-[11px] text-slate-600">{t.settings.familyHistory}
                <select value={familyHistory} onChange={e => setFamilyHistory(e.target.value as typeof familyHistory)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-[11px]">
                  <option value="">{t.log.notRecorded}</option><option value="yes">{t.log.yes}</option><option value="no">{t.log.no}</option><option value="unsure">{t.report.unsure}</option><option value="prefer_not_to_say">{t.report.preferNotToSay}</option>
                </select>
              </label>
            </div>
            <fieldset>
              <legend className="text-[11px] text-slate-600">{t.settings.tryingToConceive}</legend>
              <div className="mt-1 flex gap-2">
                {([[null, t.log.notRecorded], [true, t.log.yes], [false, t.log.no]] as const).map(([value, label]) => (
                  <button key={label} type="button" aria-pressed={tryingToConceive === value} onClick={() => setTryingToConceive(value)} className={`rounded-lg border px-2.5 py-1.5 text-[10px] ${tryingToConceive === value ? 'border-brand-700 bg-brand-700 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{label}</button>
                ))}
              </div>
            </fieldset>
            {tryingToConceive === true && <label className="block text-[11px] text-slate-600">{t.settings.monthsTrying}
              <input type="number" min="0" value={monthsTrying} onChange={e => setMonthsTrying(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2" />
            </label>}
            <label className="block text-[11px] text-slate-600">{t.settings.knownConditions}
              <textarea value={knownConditions} onChange={e => setKnownConditions(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2" />
            </label>
            <button type="button" onClick={handleSaveHealthHistory} className="w-full rounded-xl bg-brand-700 px-3 py-2 text-xs font-bold text-white">{nameSaved ? t.settings.saved : t.settings.saveProfile}</button>
          </div>

          {/* PIN Change */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <KeyRound className="w-4 h-4 text-brand-600" />
              <span>{t.settings.pinTitle}</span>
            </label>
          <p className="text-sm leading-relaxed text-slate-700">{t.settings.pinDescription}</p>
            <div className="space-y-2">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                aria-label={t.settings.currentPin}
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder={t.settings.currentPin}
                className="w-full text-xs border border-slate-300/80 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  aria-label={t.settings.newPin}
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder={t.settings.newPin}
                  className="text-xs border border-slate-300/80 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="new-password"
                  aria-label={t.settings.confirmPin}
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder={t.settings.confirmPin}
                  className="text-xs border border-slate-300/80 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                />
              </div>
              <button
                onClick={handleChangePin}
                className="w-full text-xs font-bold py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95"
              >
                {t.settings.updatePin}
              </button>
              {pinMessage && (
                <p className={`text-[11px] font-bold ${pinMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {pinMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Language Info */}
          <div className="border-t border-slate-100 pt-4">
            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <Globe className="w-4 h-4 text-brand-600" />
              <span>{t.settings.languageTitle}</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1">
              {t.settings.languageCurrent.replace('{language}', language === 'en' ? t.settings.english : t.settings.kiswahili)}
            </p>
          </div>

          {/* Fictional UI test data */}
          <section className="border-t border-slate-100 pt-4 space-y-3" aria-labelledby="synthetic-scenarios-title">
            <div>
              <h3 id="synthetic-scenarios-title" className="text-xs font-bold text-slate-800">{t.settings.syntheticScenariosTitle}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{t.settings.syntheticScenariosNote}</p>
              {activeSyntheticScenario && <p className="mt-2 text-[11px] font-semibold text-brand-800">{t.settings.activeSyntheticScenario.replace('{name}', activeSyntheticScenario.label)}</p>}
            </div>
            <div className="space-y-2">
              {threeUserSyntheticFixtures.map((scenario) => (
                <div key={scenario.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <h4 className="text-xs font-bold text-slate-800">{scenario.label}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{scenario.testPurpose}</p>
                  <button type="button" onClick={() => handleLoadSyntheticScenario(scenario.id, scenario.label)} className="mt-2 rounded-lg bg-brand-700 px-3 py-2 text-[11px] font-bold text-white hover:bg-brand-800">{t.settings.loadScenarioButton}</button>
                </div>
              ))}
            </div>
            {activeSyntheticScenario && <button type="button" onClick={handleClearSyntheticScenario} className="w-full rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100">{t.settings.clearSyntheticScenarioButton}</button>}
          </section>

          {/* Delete All Data */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <label className="flex items-center space-x-1.5 text-xs font-bold text-rose-700">
              <Trash2 className="w-4 h-4" />
              <span>{t.settings.deleteTitle}</span>
            </label>
            <p className="text-sm leading-relaxed text-slate-700">
              {t.settings.deleteDataExplanation}
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full text-xs font-bold py-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition active:scale-95"
              >
                {t.settings.deleteButton}
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <p className="text-sm text-rose-950 font-semibold">{t.settings.confirmDelete}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 text-xs font-bold py-2 rounded-xl bg-white text-slate-700 border border-slate-200 transition active:scale-95"
                  >
                    {t.settings.cancel}
                  </button>
                  <button
                    onClick={handleDeleteAllData}
                    className="flex-1 text-xs font-bold py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition active:scale-95"
                  >
                    {t.settings.yesDelete}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 mb-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span>{t.settings.aboutTitle}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p><strong className="text-slate-700">{t.settings.versionTag}</strong></p>
              <p>{t.settings.consentLocal}</p>
            </div>
          </div>
        </div>
      </div>
    <