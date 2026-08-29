/** Profile fields used to resolve PipeSketch Pro access (shared Supabase project with TDP). */
export type PspProfileEntitlement = {
  psp_standalone?: boolean | null
  pipesketchpro_active?: boolean | null
  psp_tdp_addon_active?: boolean | null
  tier_int?: number | null
  tier?: number | string | null
  subscription_status?: string | null
}

export function parseTdpTier(profile: PspProfileEntitlement): number {
  if (typeof profile.tier_int === 'number' && profile.tier_int >= 1 && profile.tier_int <= 3) {
    return profile.tier_int
  }
  const t = profile.tier
  if (t === 3 || t === '3' || t === 'tier3') return 3
  if (t === 2 || t === '2' || t === 'tier2') return 2
  if (t === 1 || t === '1' || t === 'tier1') return 1
  return 0
}

export function isTdpSubscriptionActive(profile: PspProfileEntitlement): boolean {
  const status = profile.subscription_status
  return status === 'active' || status === 'trialing'
}

export function hasCompleteIncludedPsp(profile: PspProfileEntitlement): boolean {
  return parseTdpTier(profile) === 3 && isTdpSubscriptionActive(profile)
}

export function hasTdpAddonPsp(profile: PspProfileEntitlement): boolean {
  return profile.psp_tdp_addon_active === true
}

/**
 * Idempotent access check — never consults user-editable client metadata.
 * psp_access =
 *   valid standalone PSP subscription
 *   OR active TDP Complete (included)
 *   OR active TDP PipeSketch add-on
 *   OR legacy pipesketchpro_active flag (backward compatible)
 */
export function resolvePspAccess(profile: PspProfileEntitlement | null | undefined): boolean {
  if (!profile) return false
  if (profile.psp_standalone === true) return true
  if (hasCompleteIncludedPsp(profile)) return true
  if (hasTdpAddonPsp(profile)) return true
  if (profile.pipesketchpro_active === true) return true
  return false
}

/** True when user has TDP but needs the $19/mo add-on for PSP. */
export function needsTdpPspAddon(profile: PspProfileEntitlement | null | undefined): boolean {
  if (!profile || resolvePspAccess(profile)) return false
  const tier = parseTdpTier(profile)
  return tier >= 1 && tier <= 2 && isTdpSubscriptionActive(profile)
}

export function computeTdpPspEntitlementPatch(profile: {
  tier_int?: number | null
  tier?: number | null
  subscription_status?: string | null
  psp_tdp_addon_active?: boolean | null
}): { pipesketchpro_active: boolean; psp_plan?: string } {
  const tier = profile.tier_int ?? profile.tier ?? 0
  const subActive =
    profile.subscription_status === 'active' || profile.subscription_status === 'trialing'
  const completeIncludes = tier === 3 && subActive
  const addonActive = profile.psp_tdp_addon_active === true
  const entitled = completeIncludes || addonActive
  return entitled ? { pipesketchpro_active: true, psp_plan: 'pro' } : { pipesketchpro_active: false }
}
