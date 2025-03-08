'use client'

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