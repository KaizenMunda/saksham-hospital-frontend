/**
 * Format a number consistently for both server and client rendering
 */
export function formatNumber(value: number): string {
  // Convert to string to ensure consistent rendering
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