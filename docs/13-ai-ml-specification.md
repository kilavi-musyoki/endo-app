# AI/ML Model Specification and Evaluation

**Status:** No AI/ML model is specified or approved. There is no training dataset or performance report.

## MVP position

The MVP is a tracking and report-preparation tool. It should not use generative AI or machine learning to diagnose, estimate disease probability, recommend treatment, or triage users. Do not send health data to external AI services.

## Implemented rule-based pattern reflection (Option A)

The prototype includes a transparent, client-side rule-based **Care-Seeking Readiness Guide** (`CareReadinessService`) strictly grounded in published consensus criteria:
- **ESHRE 2022 Endometriosis Guidelines** (pain management, organ-specific dyschezia/dysuria, neuropathic pain sensations).
- **NICE Guideline NG73** (severe dysmenorrhea affecting daily life, chronic pelvic pain, non-cyclical aching).

### Boundaries & Safeguards:
1. **Non-Diagnostic:** It presents an observational reflection of patient-generated health data (PGHD). It does not compute a disease probability percentage or issue a diagnosis.
2. **Prompts for Clinical Review:** The visual gauge categorizes patterns into *Routine Tracking* vs *Clinical Discussion Warranted*, providing users with tailored questions to discuss with their clinician.
3. **Zero External Data Exfiltration:** All evaluations run entirely client-side; no health data is transmitted to third-party AI or analytics services.

## Evidence required before release of a model or flag

- Documented dataset provenance, lawful/ethical basis, consent, representativeness, quality, and de-identification limits.
- Pre-registered evaluation protocol and independent clinical/statistical review.
- Sensitivity, specificity, predictive values at relevant prevalence, calibration if applicable, confidence intervals, subgroup performance, missingness, and failure analysis.
- Prospective usability and safety evaluation; measure false reassurance, anxiety, and care-seeking effects.
- Versioned model/rule definitions, change control, monitoring, rollback, and user-facing limitations.

Until evidence and approvals exist, do not display risk scores, diagnostic labels, claims of accuracy, or model-generated clinical advice. This document intentionally reports no fabricated metrics.
