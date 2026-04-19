/**
 * Returns a same-origin path for post-login redirect, or `/boards`.
 * Rejects open redirects (e.g. `//evil.com`, `https://...`).
 */
export function getSafePostAuthRedirect(nextParam: string | null): string {
  if (!nextParam) {
    return "/boards";
  }
  const trimmed = nextParam.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return "/boards";
  }
  return trimmed;
}
