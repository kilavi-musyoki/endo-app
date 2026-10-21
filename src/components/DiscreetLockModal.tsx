import React, { useEffect, useRef, useState } from 'react';
import { Info, Lock } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useI18n } from '../locales/i18nContext';

interface DiscreetLockModalProps {
  onUnlock: () => void;
}

export const DiscreetLockModal: React.FC<DiscreetLockModalProps> = ({ onUnlock }) => {
  const { t } = useI18n();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = dialogRef.current?.querySelector<HTMLElement>('input, button');
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])');
      if (!items?.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const evaluatePin = (nextPin: string) => {
    if (nextPin.length !== 4) return;
    const storedPin = StorageService.getUserProfile().pin ?? '1234';
    if (nextPin === storedPin) {
      setTimeout(() => onUnlock(), 150);
    } else {
      setError(true);
      setTimeout(() => { setPin(''); setError(false); }, 900);
    }
  };

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      evaluatePin(nextPin);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="lock-title" className="w-full max-w-sm text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-brand-400 shadow-xl shadow-brand-500/10">
          <Lock className="w-8 h-8 text-rose-400" />
        </div>

        <div>
          <h2 id="lock-title" className="text-xl font-bold tracking-tight">{t.lock.title}</h2>
          <p className="text-sm text-slate-200 mt-2">{t.lock.prompt}</p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-brand-300 font-mono">
            {t.lock.demoPin}: <strong className="text-white">1234</strong>
          </div>
        </div>

        <label className="sr-only">PIN
          <input className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-white focus:p-3 focus:text-slate-900" aria-label={t.lock.prompt} type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={pin} onChange={event => {
            const nextPin = event.target.value.replace(/\D/g, '').slice(0, 4);
            setPin(nextPin); setError(false); evaluatePin(nextPin);
          }} />
        </label>

        {/* PIN Dots */}
        <div aria-hidden="true" className="flex justify-center space-x-3.5 my-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                idx < pin.length
                  ? error
                    ? 'bg-rose-500 border-rose-500 scale-110 animate-shake'
                    : 'bg-brand-500 border-brand-500 scale-110 shadow-sm shadow-brand-500/50'
                  : 'border-slate-700 bg-slate-900/60'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              aria-label={t.lock.digit.replace('{digit}', d)}
              className="min-h-16 min-w-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xl font-semibold border border-slate-700 text-white transition-colors"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            aria-label={t.lock.digit.replace('{digit}', '0')}
            className="min-h-16 min-w-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xl font-semibold border border-slate-700 text-white transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            aria-label={t.lock.backspace}
            className="min-h-16 min-w-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-base font-semibold border border-slate-700 transition flex items-center justify-center text-white"
          >
            ⌫
          </button>
        </div>

        {error && <p role="alert" aria-live="assertive" className="text-sm font-semibold text-white">{t.lock.incorrect}</p>}
        <div className="pt-2 flex items-center justify-center gap-2 text-sm text-slate-200">
          <Info aria-hidden="true" className="h-4 w-4 text-slate-300" />
          <span>{t.lock.boundary}</span>
        </div>
      </div>
    </div>
  );
};
