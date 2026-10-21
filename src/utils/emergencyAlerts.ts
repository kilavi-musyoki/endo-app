import { EmergencyAlert, FlowLevel, PainLocation } from '../types';

export interface EmergencyEvaluationParams {
  painScore: number;
  flow: FlowLevel;
  soakedWithinHour: boolean | null;
  padsOrTamponsUsed: number | null;
  symptoms: string[];
  painLocations: PainLocation[];
  bleedingBetweenPeriods: boolean | null;
  isTryingToConceive?: boolean | null;
}

/**
 * Evaluates user inputs against Section 6 emergency red flags:
 * - Sudden severe pain (9-10/10), especially with fever, vomiting, or fainting
 * - Very heavy bleeding: soaking a pad or tampon every hour for 2+ hours, or feeling dizzy/faint
 * - Possible pregnancy (missed period + one-sided pain or bleeding)
 * - Pain with fever and unusual discharge
 */
export const evaluateEmergencyAlerts = (params: EmergencyEvaluationParams): EmergencyAlert[] => {
  const alerts: EmergencyAlert[] = [];

  // 1. Sudden severe pain (9-10/10), especially with fever, vomiting or fainting
  if (params.painScore >= 9) {
    alerts.push({
      id: 'severe_pain',
      severity: 'critical',
      titleKey: 'severePainTitle',
      messageKey: 'severePainMessage',
    });
  }

  // 2. Very heavy bleeding: soaking a pad or tampon every hour for 2 or more hours, or feeling dizzy or faint
  const isHeavySoaking = params.soakedWithinHour === true;
  const isExcessiveBleeding = params.flow === 'heavy' && (params.padsOrTamponsUsed ?? 0) >= 6;
  const isHeavyWithDizziness =
    (params.flow === 'heavy' || params.flow === 'medium' || params.soakedWithinHour === true) &&
    params.symptoms.includes('dizziness_fainting');

  if (isHeavySoaking || isExcessiveBleeding || isHeavyWithDizziness) {
    alerts.push({
      id: 'severe_bleeding',
      severity: 'critical',
      titleKey: 'severeBleedingTitle',
      messageKey: 'severeBleedingMessage',
    });
  }

  // 3. Possible pregnancy (missed period + one-sided pain or bleeding)
  const isPregnancyFlagged = params.symptoms.includes('possible_pregnancy');
  const isTryingWithSeverePainOrBleeding =
    params.isTryingToConceive === true &&
    (params.flow !== 'none' || params.bleedingBetweenPeriods === true) &&
    (params.painScore >= 7 || params.painLocations.includes('pelvis') || params.painLocations.includes('lower_abdomen'));

  if (isPregnancyFlagged || isTryingWithSeverePainOrBleeding) {
    alerts.push({
      id: 'pregnancy_complication',
      severity: 'critical',
      titleKey: 'pregnancyTitle',
      messageKey: 'pregnancyMessage',
    });
  }

  // 4. Pain with fever and unusual discharge (Advise to see a health facility the same day)
  const hasPelvicPain = params.painScore >= 4 || params.painLocations.length > 0;
  const hasFever = params.symptoms.includes('fever');
  const hasDischarge = params.symptoms.includes('unusual_discharge');

  if (hasPelvicPain && hasFever && hasDischarge) {
    alerts.push({
      id: 'pain_fever_discharge',
      severity: 'urgent_same_day',
      titleKey: 'feverDischargeTitle',
      messageKey: 'feverDischargeMessage',
    });
  }

  return alerts;
};
