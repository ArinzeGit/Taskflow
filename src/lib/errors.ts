export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  return fallback;
}


export function getActionErrorMessage(error: unknown, fallback: string): string {
  const message = getErrorMessage(error, fallback);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("cannot coerce the result to a single json object") ||
    normalized.includes("violates row-level security policy") ||
    normalized.includes("row-level security policy") ||
    normalized.includes("jwt expired") ||
    normalized.includes("auth session missing") ||
    normalized.includes("invalid refresh token") ||
    normalized.includes("refresh token not found")
  ) {
    return "Your session has expired. Please log in again and retry your change.";
  }

  return message;
}
