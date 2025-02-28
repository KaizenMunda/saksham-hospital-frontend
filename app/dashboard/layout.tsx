import { WelcomeHeader } from '@/components/WelcomeHeader'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
          <WelcomeHeader />
          <div className="flex items-center gap-4">
            {/* Your existing header content */}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 