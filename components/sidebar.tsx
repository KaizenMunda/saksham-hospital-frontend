"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { menuItems } from "../src/components/Sidebar/menuItems"

// Add these interfaces
interface MenuItem {
  title: string
  path?: string
  icon?: any
  children?: MenuItem[]
}

interface NavItemProps {
  item: MenuItem
  isNested?: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prevOpenMenus) =>
      prevOpenMenus.includes(menuName)
        ? prevOpenMenus.filter((item) => item !== menuName)
        : [...prevOpenMenus, menuName],
    )
  }

  const NavItem = ({ item, isNested = false }: NavItemProps) => {
    const isActive = pathname === item.path
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMenus.includes(item.title)

    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div>
            {item.path ? (
              <Link
                href={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  isCollapsed && "justify-center px-2",
                  isNested && "pl-6",
                )}
              >
                {item.icon && <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ) : (
              <button
                onClick={() => toggleMenu(item.title)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                  "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
                  isCollapsed && "justify-center px-2",
                )}
              >
                {item.icon && <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {hasChildren &&
                      (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </>
                )}
              </button>
            )}
          </div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  return (
    <TooltipProvider>
      <>
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md shadow-md"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col bg-background transition-all duration-300 ease-in-out lg:static",
            isCollapsed ? "w-[72px]" : "w-72",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="border-b border-border">
            <div className={cn("flex h-16 items-center gap-2 px-4", isCollapsed && "justify-center px-2")}>
              {!isCollapsed && (
                <Link href="/" className="flex items-center font-semibold">
                  <span className="text-lg">Saksham Hospital</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {menuItems.map((item) => (
                <div key={item.title}>
                  <NavItem item={item} />
                  {item.children && openMenus.includes(item.title) && !isCollapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavItem key={child.title} item={child} isNested />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="border-t border-border p-2">
            <nav className="space-y-1">
              {/* bottomNavigation.map((item) => (
                <NavItem key={item.name} item={item} />
              )) */}
            </nav>
          </div>
        </div>
      </>
    </TooltipProvider>
  )
}

