
import { DateTime } from "luxon";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Convert an ISO timestamp with an explicit timezone to a UTC Date.
 * Returns null for invalid or timezone-less timestamps.
 */
export function toUTCDate(value: string): Date | null {
  if (
    typeof value !== "string" ||
    !/(Z|[+-]\d{2}:\d{2})$/i.test(value)
  ) {
    return null;
  }

  const dateTime = DateTime.fromISO(value, { setZone: true });

  if (!dateTime.isValid) {
    return null;
  }

  return dateTime.toUTC().toJSDate();
}

/**
 * Format a timestamp as a date in Indian Standard Time.
 */
export function formatDateIST(value: Date | string): string {
  const dateTime =
    value instanceof Date
      ? DateTime.fromJSDate(value, { zone: "utc" })
      : DateTime.fromISO(value, { setZone: true });

  if (!dateTime.isValid) {
    return "-";
  }

  return dateTime
    .setZone(DEFAULT_TIMEZONE)
    .toFormat("dd LLL yyyy");
}

/**
 * Format a timestamp as date and time in Indian Standard Time.
 */
export function formatDateTimeIST(value: Date | string): string {
  const dateTime =
    value instanceof Date
      ? DateTime.fromJSDate(value, { zone: "utc" })
      : DateTime.fromISO(value, { setZone: true });

  if (!dateTime.isValid) {
    return "-";
  }

  return dateTime
    .setZone(DEFAULT_TIMEZONE)
    .toFormat("dd LLL yyyy, hh:mm a");
}

/**
 * Get the current time as a JavaScript Date.
 */
export function getCurrentUTC(): Date {
  return DateTime.utc().toJSDate();
}
