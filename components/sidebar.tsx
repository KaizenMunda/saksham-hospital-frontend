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
  LayoutDashboard,
  Users,
  BedDouble,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { menuItems, type MenuItem } from "@/components/Sidebar/menuItems"
import { useRole } from "@/contexts/role-context"

interface NavItemProps {
  item: MenuItem
  isNested?: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const { hasPermission, role } = useRole()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])

  console.log({
    role,
    menuItems: menuItems.map(item => ({
      title: item.title,
      permission: item.permission,
      visible: !item.permission || hasPermission(item.permission)
    }))
  })

  const toggleMenu = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const NavItem = ({ item, isNested }: NavItemProps) => {
    const isActive = pathname === item.path
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openMenus.includes(item.title)

    if (item.permission && !hasPermission(item.permission)) {
      return null
    }

    return (
      <div>
        {item.path ? (
          <Link href={item.path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive && "bg-muted",
                isNested && "pl-8"
              )}
            >
              {!isCollapsed && <item.icon className="mr-2 h-4 w-4" />}
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isNested && "pl-8"
            )}
            onClick={() => toggleMenu(item.title)}
          >
            {!isCollapsed && <item.icon className="mr-2 h-4 w-4" />}
            {!isCollapsed && (
              <>
                <span>{item.title}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </Button>
        )}
        {hasChildren && isOpen && !isCollapsed && item.children && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map((child) => (
              <NavItem key={child.title} item={child} isNested />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative min-h-screen border-r">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu /> : <ChevronLeft />}
        </Button>
        <div className={cn(
          "pb-12 min-h-screen",
          isCollapsed ? "w-16" : "w-64"
        )}>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {!isCollapsed && "Menu"}
              </h2>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

