export function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    // Check if it's an RTK Query error with a backend response body
    if ("data" in err && err.data && typeof err.data === "object") {
      const data = err.data as Record<string, unknown>;
      if (typeof data.message === "string") {
        return data.message;
      }
      if (typeof data.error === "string") {
        return data.error;
      }
    }
    // Check for standard JS/Network errors
    if ("message" in err && typeof err.message === "string") {
      return err.message;
    }
  }
  return "An unexpected error occurred.";
}
