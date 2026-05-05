export const DEMO_EMAIL = "demo@taskflow.com";
export const DEMO_PASSWORD = "demo123";

/** Login URL flag: `/login?demo=1` — login page fills credentials (password is never in the URL). */
export const DEMO_LOGIN_PARAM = "demo";
export const DEMO_LOGIN_VALUE = "1";

export function getLoginPathWithDemo(): string {
  const params = new URLSearchParams({ [DEMO_LOGIN_PARAM]: DEMO_LOGIN_VALUE });
  return `/login?${params.toString()}`;
}
