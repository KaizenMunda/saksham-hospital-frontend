'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'doctor' | 'manager' | 'accountant' | 'receptionist' | 'opd_attendant' | 'nurse'

interface User {
  id: string
  email: string
  full_name?: string
}

interface RoleContextType {
  role: Role | null
  user: User | null
  isLoading: boolean
  hasPermission: (permission: string) => boolean
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  user: null,
  isLoading: true,
  hasPermission: () => false,
})

const rolePermissions = {
  admin: [
    'manage_users',
    'manage_patients',
    'manage_notifications',
    'delete_patients',
    'manage_billing',
    'view_reports',
    'manage_appointments',
    'manage_admissions',
    'manage_inventory',
    'manage_staff'
  ],
  manager: [
    'manage_users',
    'manage_staff',
    'view_reports',
    'manage_inventory',
    'delete_patients'
  ],
  doctor: [
    'manage_patients',
    'manage_notifications',
    'manage_prescriptions',
    'view_reports',
    'manage_appointments'
  ],
  nurse: [
    'manage_patients',
    'manage_notifications',
    'record_vitals',
    'view_reports',
    'manage_medications'
  ],
  accountant: [
    'manage_billing',
    'view_reports',
    'generate_invoices',
    'manage_payments'
  ],
  receptionist: [
    'view_patients',
    'create_patients',
    'manage_appointments',
    'view_notifications',
    'basic_billing'
  ],
  opd_attendant: [
    'manage_patients',
    'manage_notifications',
    'manage_appointments',
    'record_vitals'
  ]
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('role, full_name, email')
            .eq('id', authUser.id)
            .single()
          
          setRole(userData?.role || null)
          setUser({
            id: authUser.id,
            email: userData?.email || authUser.email || '',
            full_name: userData?.full_name
          })
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  const hasPermission = (permission: string) => {
    if (!role) return false
    return rolePermissions[role].includes(permission)
  }

  return (
    <RoleContext.Provider value={{ role, user, isLoading, hasPermission }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext) 