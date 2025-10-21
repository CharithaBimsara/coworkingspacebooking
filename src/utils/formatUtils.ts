/**
 * Format utilities for consistent formatting across the application
 */

/**
 * Safely parse a price value to ensure it's a number
 * @param price The price value to parse (could be string, number or undefined)
 * @returns A number value
 */
export function parsePrice(price: any): number {
  if (typeof price === 'string') {
    return parseFloat(price) || 0;
  }
  return typeof price === 'number' ? price : 0;
}

/**
 * Format price to display with two decimal places and thousands separators
 * Use this for all price displays across the application to ensure consistency
 * @param price The price to format
 * @returns Formatted price string with two decimal places (e.g. 1,000.00)
 */
export function formatPrice(price: any): string {
  return parsePrice(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format price for display in UI with LKR currency symbol
 * @param price The price to format
 * @returns Formatted price string with LKR prefix (e.g. LKR 1,000.00)
 */
export function formatCurrency(price: any): string {
  return `LKR ${formatPrice(price)}`;
}