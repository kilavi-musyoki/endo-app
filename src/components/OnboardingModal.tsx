import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../locales/i18nContext';
import { ShieldCheck, Clock, FileText, HeartPulse, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onDismiss }) => {
  const { t } = useI18n();
  const [acknowledged, setAcknowledged] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkboxRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 flex items-center justify-center p-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="onboarding-title" aria-describedby="onboarding-disclaimer" className="bg-white rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto p-6 shadow-2xl space-y-5 border border-stone-200">
        {/* Header Icon & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-rose-400 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-brand-600/30">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 text-[10px] font-black uppercase tracking-wider mb-1">
            Kenya Women's Health Initiative
          </div>
          <h2 id="onboarding-title" className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {t.onboarding.welcome}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed pt-1">
            {t.onboarding.subtext}
          </p>
        </div>

        {/* 3 Pillars */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{t.onboarding.point1Title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{t.onboarding.point1Desc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{t.onboarding.point2Title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{t.onboarding.point2Desc}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">{t.onboarding.point3Title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{t.onboarding.point3Desc}</p>
            </div>
          </div>
        </div>

        {/* Health Boundary Banner */}
          <div id="onboarding-disclaimer" className="p-4 bg-brand-50 border border-brand-300 rounded-2xl text-sm text-brand-950 leading-relaxed">
          <strong className="block font-black text-brand-900 mb-0.5">Strict Clinical Boundary:</strong>
          {t.onboarding.disclaimer}
        </div>

        <label className="flex min-h-12 items-start gap-3 text-sm leading-relaxed text-slate-800">
          <input ref={checkboxRef} type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-brand-800" />
          <span>{t.onboarding.acknowledge}</span>
        </label>
        {!acknowledged && <p className="text-sm text-slate-700" aria-live="polite">{t.onboarding.acknowledgeRequired}</p>}

        {/* Action Button */}
        <button
          onClick={onDismiss}
          disabled={!acknowledged}
          className="min-h-14 w-full rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t.onboarding.cta}</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
