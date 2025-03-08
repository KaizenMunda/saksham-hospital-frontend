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
    <div className={cn("sidebar", isCollapsed ? "collapsed" : "expanded")}>
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
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="Saksham Logo" 
                  width={48} 
                  height={48} 
                />
                <span className="text-lg font-bold">Saksham</span>
              </Link>
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
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.path ? "bg-accent text-accent-foreground" : "transparent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col border-r bg-sidebar",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="ml-auto"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Expand</span>
            </Button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="Saksham Logo" 
                  width={48} 
                  height={48} 
                />
                <span className="text-lg font-bold">Saksham</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.path ? "bg-accent text-accent-foreground" : "transparent",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}

