'use client'

import { WelcomeHeader } from './WelcomeHeader'
import { LogoutButton } from '@/components/LogoutButton'

export function Navbar() {
  return (
    <nav className="bg-background border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <WelcomeHeader />
      </div>
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    </nav>
  )
} 