"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart2,
  Building2,
  Folder,
  Wallet,
  Receipt,
  CreditCard,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  BedDouble,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { menuItems } from "@/components/Sidebar/menuItems"
import { useRole } from "@/contexts/role-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { hasPermission } = useRole()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0 bg-accent text-white border-r border-accent/80">
          <div className="px-2 py-6 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
              <Image
                src="/placeholder-logo.svg"
                width={24}
                height={24}
                alt="Logo"
                className="invert"
              />
              <span>Saksham Hospital</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav className="grid gap-1 p-2">
              {menuItems.map((item) => {
                // Skip items that require permissions the user doesn't have
                if (item.permission && !hasPermission(item.permission)) {
                  return null
                }

                return (
                  <Link
                    key={item.title}
                    href={item.path || '#'}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.path 
                        ? "bg-white text-accent" 
                        : "text-white/90 hover:bg-white/10 hover:text-white",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      pathname === item.path ? "text-accent" : "text-white/80"
                    )} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col border-r border-accent/80 bg-accent text-white h-screen sticky top-0",
          isCollapsed ? "w-[80px]" : "w-[240px]"
        )}
      >
        <div className="flex h-14 items-center px-4 border-b border-accent/80">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href="/dashboard" className="flex items-center justify-center">
                    <Image
                      src="/placeholder-logo.svg"
                      width={24}
                      height={24}
                      alt="Logo"
                      className="invert"
                    />
                    <span className="sr-only">Saksham Hospital</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold">
                  Saksham Hospital
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
              <Image
                src="/placeholder-logo.svg"
                width={24}
                height={24}
                alt="Logo"
                className="invert"
              />
              <span>Saksham Hospital</span>
            </Link>
          )}
          {!isCollapsed && (
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="text-white hover:bg-accent-600"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Collapse</span>
              </Button>
            </div>
          )}
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-2">
            {menuItems.map((item) => {
              // Skip items that require permissions the user doesn't have
              if (item.permission && !hasPermission(item.permission)) {
                return null
              }

              return (
                <Link
                  key={item.title}
                  href={item.path || '#'}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.path 
                      ? "bg-white text-accent" 
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    pathname === item.path ? "text-accent" : "text-white/80"
                  )} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}

