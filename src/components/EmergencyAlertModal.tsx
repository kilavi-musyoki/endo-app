import React from 'react';
import { useI18n } from '../locales/i18nContext';
import { EmergencyAlert } from '../types';
import { AlertTriangle, PhoneCall, HeartHandshake, ShieldAlert, ArrowRight } from 'lucide-react';

interface EmergencyAlertModalProps {
  alerts: EmergencyAlert[];
  isOpen: boolean;
  onDismiss: () => void;
  onNavigateToCare?: () => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  alerts,
  isOpen,
  onDismiss,
  onNavigateToCare,
}) => {
  const { t } = useI18n();

  if (!isOpen || alerts.length === 0) return null;

  const hasCritical = alerts.some(a => a.severity === 'critical');

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="emergency-alert-title"
      aria-describedby="emergency-alert-desc"
      className="fixed inset-0 z-50 bg-rose-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-rose-900 via-rose-950 to-red-950 text-white p-6 sm:p-8 shadow-2xl border-2 border-rose-500 space-y-6 my-auto">
        {/* Top Header Badge & Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-900/60 animate-pulse">
            <ShieldAlert className="w-9 h-9 text-rose-300 stroke-[2.2px]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-800/80 border border-rose-400/60 text-rose-100 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.emergency.redScreenBadge}</span>
          </div>

          <h2 id="emergency-alert-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {t.emergency.redScreenTitle}
          </h2>

          <p id="emergency-alert-desc" className="text-sm text-rose-100 leading-relaxed max-w-md">
            {t.emergency.redScreenSubtitle}
          </p>
        </div>

        {/* Triggered Alert Boxes */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl p-4 border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/80 border-rose-400 text-white'
                  : 'bg-amber-950/60 border-amber-400 text-amber-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">🚨</span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold tracking-tight">
                    {t.emergency[alert.titleKey]}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-medium">
                    {t.emergency[alert.messageKey]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Emergency Telephone Hotlines (Kenya) */}
        <div className="rounded-2xl bg-black/30 border border-rose-500/40 p-4 space-y-2.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-rose-200">
            Immediate Emergency Assistance
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="tel:999"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white text-rose-950 font-bold text-sm hover:bg-rose-100 transition shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-rose-800" />
              <span>{t.emergency.callEmergency}</span>
            </a>

            <a
              href="tel:1199"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition border border-rose-400 shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>{t.emergency.callAmbulance}</span>
            </a>
          </div>

          {onNavigateToCare && (
            <button
              type="button"
              onClick={() => {
                onDismiss();
                onNavigateToCare();
              }}
              className="w-full flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-100 border border-rose-600/60 text-xs font-semibold transition"
            >
              <HeartHandshake className="w-4 h-4 text-rose-300" />
              <span>{t.emergency.viewCareContacts}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Disclaimer Boundary */}
        <p className="text-[11px] text-rose-300/80 leading-relaxed text-center">
          {t.emergency.boundaryNotice}
        </p>

        {/* Dismiss and Continue Logging Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="w-full min-h-12 rounded-2xl bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/50 text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <span>{t.emergency.dismissContinue}</span>
        </button>
      </div>
    </div>
  );
};
