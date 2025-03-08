/**
 * Format a number consistently for both server and client rendering
 */
export function formatNumber(value: number): string {
  // Convert to string to ensure consistent rendering
  return String(value);
}

/**
 * Get a string value that's safe for hydration
 */
export function getHydrationSafeCount(value: number, fallback = '0'): string {
  // For server-side rendering, use the fallback
  if (typeof window === 'undefined') {
    return fallback;
  }
  // For client-side rendering, use the actual value
  return String(value);
}

/**
 * Safely render a count that might change between server and client
 * by using a client-only approach
 */
export function ClientOnlyCount({ 
  value, 
  fallback = '0' 
}: { 
  value: number, 
  fallback?: string 
}): JSX.Element {
  return (
    <span suppressHydrationWarning>
      {typeof window === 'undefined' ? fallback : String(value)}
    </span>
  );
} 