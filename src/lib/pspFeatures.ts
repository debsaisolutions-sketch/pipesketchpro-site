/**
 * PipeSketch Pro plan features for future Solo / Pro / Team billing.
 * Existing subscribers default to `pro` — do not change Stripe prices here.
 */

export const DEFAULT_PSP_PLAN = 'pro'

export type PspPlan = 'solo' | 'pro' | 'team'

export type PspFeatures = {
  cloudJobs: boolean
  companyStandards: boolean
  brandedPdf: boolean
  teamSharing: boolean
  coreCalc: boolean
  drawings: boolean
  pdfExport: boolean
}

export const PSP_PLAN_FEATURES: Record<PspPlan, PspFeatures> = {
  solo: {
    cloudJobs: false,
    companyStandards: false,
    brandedPdf: true,
    teamSharing: false,
    coreCalc: true,
    drawings: true,
    pdfExport: true,
  },
  pro: {
    cloudJobs: true,
    companyStandards: true,
    brandedPdf: true,
    teamSharing: false,
    coreCalc: true,
    drawings: true,
    pdfExport: true,
  },
  team: {
    cloudJobs: true,
    companyStandards: true,
    brandedPdf: true,
    teamSharing: true,
    coreCalc: true,
    drawings: true,
    pdfExport: true,
  },
}

export function resolvePspFeatures(planKey?: string | null): PspFeatures {
  const key = (planKey || DEFAULT_PSP_PLAN).toLowerCase() as PspPlan
  return PSP_PLAN_FEATURES[key] || PSP_PLAN_FEATURES.pro
}

/** Alias used by the app shell */
export const resolveFeatures = resolvePspFeatures
