import React from 'react';
import { useI18n } from '../locales/i18nContext';
import { CareContactsView } from './CareContactsView';
import { EducationAccordion } from './EducationAccordion';
import { HeartHandshake, ShieldAlert } from 'lucide-react';

export const EducationView: React.FC = () => {
  const { t } = useI18n();
  return <div className="mx-auto max-w-4xl space-y-5 py-2">
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-brand-700" /><h2 className="text-base font-extrabold text-slate-900">{t.education.title}</h2></div>
      <p className="mt-1 text-xs text-slate-500">{t.education.subtitle}</p>
    </div>
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
      <div className="flex items-center gap-3"><ShieldAlert aria-hidden="true" className="h-5 w-5 text-amber-900" /><h3 className="text-base font-semibold text-amber-950">{t.education.pendingReviewTitle}</h3></div>
      <p className="mt-2 text-sm leading-relaxed text-amber-950">{t.education.pendingReviewBody}</p>
    </div>
    <EducationAccordion />
    <CareContactsView />
  </div>;
};
