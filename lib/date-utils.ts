/**
 * Format a date consistently for both server and client rendering
 */
export function formatDate(date: Date): string {
  // Use ISO string format which will be consistent across server and client
  const isoDate = date.toISOString();
  
  // Extract year, month, and day from the ISO string
  const year = isoDate.substring(0, 4);
  const month = isoDate.substring(5, 7);
  const day = isoDate.substring(8, 10);
  
  // Return in a consistent format (YYYY-MM-DD)
  return `${year}-${month}-${day}`;
}

/**
 * Format a date in a localized format for display only (not for hydration-sensitive areas)
 */
export function formatDisplayDate(date: Date): string {
  // This is safe to use in areas that don't affect hydration
  return date.toLocaleDateString();
} 