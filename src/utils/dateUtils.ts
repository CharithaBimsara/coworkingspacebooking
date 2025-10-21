/**
 * Date Utilities for SpaceBooking
 * Helper functions for date handling to avoid timezone issues
 */

/**
 * Get today's date in YYYY-MM-DD format using local timezone
 * This avoids timezone conversion issues that can occur with toISOString()
 */
export function getTodayLocal(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Convert a Date object to YYYY-MM-DD format using local timezone
 * This avoids timezone conversion issues that can occur with toISOString()
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse a date string and return a Date object at noon local time
 * This helps avoid timezone shifts when working with date-only values
 */
export function parseDateAtNoon(dateString: string): Date {
  return new Date(dateString + 'T12:00:00')
}