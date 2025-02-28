'use client'

import { useRole } from '@/contexts/role-context'

export function WelcomeHeader() {
  const { role, user, isLoading } = useRole()
  
  if (isLoading) {
    return <div className="text-sm font-medium">Loading...</div>
  }
  
  if (!user) {
    return null
  }
  
  const displayName = user.full_name || user.email || 'User'
  
  return (
    <div className="text-sm font-medium">
      Welcome {displayName} {role ? `(${role})` : ''}!
    </div>
  )
} 