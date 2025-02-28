import "./globals.css"
import { Inter } from "next/font/google"
import { LayoutContent } from "./layout-content"
import { Toaster } from "@/components/ui/toaster"
import { RoleProvider } from '@/contexts/role-context'
import { WelcomeHeader } from '@/components/WelcomeHeader'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Saksham Hospital Dashboard",
  description: "Hospital Management System",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RoleProvider>
          <div className="flex h-screen">
            <Sidebar />
            <LayoutContent className={inter.className}>
              {children}
            </LayoutContent>
          </div>
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  )
}