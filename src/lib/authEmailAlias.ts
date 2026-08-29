/**
 * Maps test/login aliases to the real Supabase auth email.
 * Password reset is always sent to the resolved (canonical) address.
 *
 * Example: psptest@pipesketchpro.com -> debsaisolutions@gmail.com
 */
const AUTH_EMAIL_ALIASES: Record<string, string> = {
  'psptest@pipesketchpro.com': 'debsaisolutions@gmail.com',
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Email used for sign-in and password reset API calls. */
export function resolveAuthEmail(input: string): string {
  const trimmed = input.trim()
  const key = normalizeEmail(trimmed)
  return AUTH_EMAIL_ALIASES[key] ?? trimmed
}

/** Inbox where Supabase delivers the reset link (after alias resolution). */
export function getPasswordResetDeliveryEmail(input: string): string {
  return resolveAuthEmail(input)
}

export function isAuthEmailAlias(input: string): boolean {
  const key = normalizeEmail(input)
  return key in AUTH_EMAIL_ALIASES
}
