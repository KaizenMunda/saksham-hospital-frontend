'use client'

import { WelcomeHeader } from './WelcomeHeader'

export function Header() {
  return (
    <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
      <WelcomeHeader />
      <div className="flex items-center gap-4">
        {/* Your existing header content */}
      </div>
    </header>
  )
} 