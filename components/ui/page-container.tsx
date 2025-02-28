interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full max-w-full py-6 px-6">
      {children}
    </div>
  )
} 