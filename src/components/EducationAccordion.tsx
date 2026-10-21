import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, HeartPulse, ExternalLink } from 'lucide-react';
import { useI18n } from '../locales/i18nContext';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = `accordion-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
      >
        <span className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-slate-900">{title}</span>
        </span>
        {open
          ? <ChevronUp aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />
          : <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-500" />}
      </button>
      {open && (
        <div id={id} className="border-t border-stone-100 px-5 pb-5 pt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

export const EducationAccordion: React.FC = () => {
  const { t } = useI18n();
  const edu = t.educationContent;

  return (
    <div className="space-y-3">
      {/* What is endometriosis */}
      <AccordionItem
        title={edu.whatIsTitle}
        icon={<BookOpen aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-700" />}
      >
        <p className="text-sm leading-relaxed text-slate-700">{edu.whatIsBody}</p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{edu.commonlyReportedTitle}</p>
          <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
            {edu.commonlyReportedItems.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">{edu.whatIsNote}</p>
      </AccordionItem>

      {/* When to seek help */}
      <AccordionItem
        title={edu.seekHelpTitle}
        icon={<HeartPulse aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-700" />}
      >
        <p className="text-sm leading-relaxed text-slate-700">{edu.seekHelpIntro}</p>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
          <ul className="space-y-2 text-sm text-slate-700">
            {edu.seekHelpPrompts.map((prompt: string) => (
              <li key={prompt} className="flex gap-2">
                <span aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand-100 text-center text-xs leading-4 text-brand-800 font-bold">·</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs leading-relaxed text-amber-900">{edu.seekHelpBoundary}</p>
        </div>
      </AccordionItem>

      {/* Resources */}
      <AccordionItem
        title={edu.resourcesTitle}
        icon={<ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-700" />}
      >
        <p className="text-sm leading-relaxed text-slate-700">{edu.resourcesIntro}</p>
        <ul className="space-y-3">
          {edu.resourceLinks.map((link: { label: string; url: string; description: string }) => (
            <li key={link.url} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
              >
                {link.label}
                <ExternalLink aria-hidden="true" className="ml-1 inline h-3 w-3" />
              </a>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{link.description}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-slate-500">{edu.resourcesNote}</p>
      </AccordionItem>
    </div>
  );
};
