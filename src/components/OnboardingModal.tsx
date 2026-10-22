import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../locales/i18nContext';
import { ShieldCheck, Clock, FileText, HeartPulse, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  onDismiss: (displayName: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onDismiss }) => {
  const { t } = useI18n();
  const [step, setStep] = useState<1 | 2>(1);
  const [acknowledged, setAcknowledged] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstStepRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.scrollTo({ top: 0 });
    firstStepRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault();
      if (event.key !== 'Tab') return;
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])');
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (step === 2) {
      dialogRef.current?.scrollTo({ top: 0 });
      nameRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  const content = (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm sm:items-center sm:p-5" role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        className="my-auto w-full max-w-lg space-y-5 overflow-y-auto rounded-[1.75rem] border border-rose-100 bg-[#fffdfd] p-5 shadow-2xl shadow-slate-950/25 sm:p-7"
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-200 via-rose-300 to-brand-500 text-brand-900 shadow-lg shadow-rose-200/60">
            <HeartPulse className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-wide text-brand-900">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t.onboarding.stepLabel.replace('{step}', String(step))}
          </div>
          <h2 id="onboarding-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {step === 1 ? t.onboarding.welcome : t.onboarding.profileTitle}
          </h2>
          <p id="onboarding-description" className="mx-auto max-w-md pt-2 text-sm leading-relaxed text-slate-700">
            {step === 1 ? t.onboarding.subtext : t.onboarding.profileIntro}
          </p>
        </div>

        {step === 1 ? (
          <>
            <div className="space-y-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-left">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700"><Clock className="h-4 w-4" /></div>
                <div><h3 className="text-sm font-semibold text-slate-900">{t.onboarding.point1Title}</h3><p className="mt-0.5 text-sm leading-snug text-slate-600">{t.onboarding.point1Desc}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700"><FileText className="h-4 w-4" /></div>
                <div><h3 className="text-sm font-semibold text-slate-900">{t.onboarding.point2Title}</h3><p className="mt-0.5 text-sm leading-snug text-slate-600">{t.onboarding.point2Desc}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700"><ShieldCheck className="h-4 w-4" /></div>
                <div><h3 className="text-sm font-semibold text-slate-900">{t.onboarding.point3Title}</h3><p className="mt-0.5 text-sm leading-snug text-slate-600">{t.onboarding.point3Desc}</p></div>
              </div>
            </div>

            <div id="onboarding-disclaimer" className="rounded-2xl border border-rose-200 bg-white p-4 text-sm leading-relaxed text-slate-800">
              <strong className="mb-1 block font-semibold text-brand-900">{t.onboarding.boundaryTitle}</strong>
              {t.onboarding.disclaimer}
            </div>

            <label className="flex min-h-12 items-start gap-3 text-sm leading-relaxed text-slate-800">
              <input ref={firstStepRef} type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-brand-800" />
              <span>{t.onboarding.acknowledge}</span>
            </label>
            {!acknowledged && <p className="-mt-3 text-sm text-slate-600" aria-live="polite">{t.onboarding.acknowledgeRequired}</p>}
            <button type="button" onClick={() => setStep(2)} disabled={!acknowledged} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-800 px-4 font-semibold text-white transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50">
              {t.onboarding.continueProfile}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/50 p-4 sm:p-5">
              <label htmlFor="onboarding-display-name" className="block text-sm font-semibold text-slate-900">{t.onboarding.displayName}</label>
              <input ref={nameRef} id="onboarding-display-name" type="text" autoComplete="nickname" maxLength={60} value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={t.onboarding.displayNamePlaceholder} className="ui-field min-h-12 border-rose-200 focus:border-brand-600" />
              <p className="text-sm leading-relaxed text-slate-600">{t.onboarding.displayNameHelp}</p>
              <div className="rounded-xl border border-rose-200 bg-white p-3 text-sm leading-relaxed text-slate-700">
                <strong className="font-semibold text-brand-900">{t.onboarding.optionalDetailsTitle}</strong> {t.onboarding.optionalDetailsHelp}
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => setStep(1)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-stone-50">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t.onboarding.back}
              </button>
              <button type="button" onClick={() => onDismiss(displayName.trim())} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-800 px-4 font-semibold text-white transition-colors hover:bg-brand-900">
                {t.onboarding.finish}<Sparkles className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
