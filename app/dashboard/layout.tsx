'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { RoleProvider } from '@/contexts/role-context'
import { SupabaseProvider } from '@/contexts/supabase-context'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    )

    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    
    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <SupabaseProvider>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <RoleProvider>
            <div className="flex h-screen overflow-hidden bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </RoleProvider>
        </TooltipProvider>
      </SettingsProvider>
    </SupabaseProvider>
  )
} 