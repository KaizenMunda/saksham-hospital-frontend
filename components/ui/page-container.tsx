interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`container py-6 ${className || ''}`}>
      {children}
    </div>
  )
} 