'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface RoleContextType {
  hasPermission: (permission: string) => boolean
  setUserRole: (role: string) => void
  userRole: string
}

const RoleContext = createContext<RoleContextType>({
  hasPermission: () => true, // Default to allowing all permissions
  setUserRole: () => {},
  userRole: 'admin'
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState('admin') // Default role

  // This is a simplified permission check
  // In a real app, you'd have a more complex permission system
  const hasPermission = (permission: string): boolean => {
    // For demo purposes, admin has all permissions
    if (userRole === 'admin') return true

    // Add your permission logic here
    // For example, check if the user's role has the required permission
    const rolePermissions: Record<string, string[]> = {
      doctor: ['view_patients', 'manage_appointments'],
      nurse: ['view_patients'],
      receptionist: ['manage_patients', 'manage_appointments'],
      // Add more roles and their permissions
    }

    return rolePermissions[userRole]?.includes(permission) || false
  }

  return (
    <RoleContext.Provider value={{ hasPermission, setUserRole, userRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext) 