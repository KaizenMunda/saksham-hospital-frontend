'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SettingsProvider } from "@/contexts/settings-context"
import { RoleProvider } from '@/contexts/role-context'
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from '@/components/Navbar'

export function LayoutContent({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (event === 'SIGNED_IN' && isLoginPage) {
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SettingsProvider>
        <TooltipProvider delayDuration={0}>
          <RoleProvider>
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-auto w-full">
                {children}
              </main>
            </div>
          </RoleProvider>
        </TooltipProvider>
      </SettingsProvider>
      <Toaster />
    </ThemeProvider>
  )
} 