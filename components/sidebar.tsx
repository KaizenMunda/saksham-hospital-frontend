"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  CreditCard,
  BedDouble,
  Bell,
  Stethoscope,
  UserCog,
  Wallet,
  Receipt,
  Building2,
  Menu,
  X,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Define types 
type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

type SidebarSection = {
  title: string;
  items: MenuItem[];
}

// Define sidebar navigation with sections
const sidebarSections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ]
  },
  {
    title: "Registration",
    items: [
      {
        title: "Patients",
        path: "/dashboard/patients",
        icon: Users,
      },
      {
        title: "IPD Admissions",
        path: "/dashboard/ipd",
        icon: BedDouble,
      },
      {
        title: "OPD Appointments",
        path: "/dashboard/appointments",
        icon: Calendar,
      },
    ]
  },
  {
    title: "Management",
    items: [
      {
        title: "Doctors",
        path: "/dashboard/doctors",
        icon: Stethoscope,
      },
      {
        title: "Staff",
        path: "/dashboard/staff",
        icon: UserCog,
      },
      {
        title: "Finance",
        path: "/dashboard/finance",
        icon: Wallet,
        children: [
          {
            title: "Panels",
            path: "/dashboard/finance/panels",
            icon: Building2,
          },
          {
            title: "Expenses",
            path: "/dashboard/finance/expenses",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Billing",
        path: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: FileText,
        children: [
          {
            title: "Patient Reports",
            path: "/dashboard/reports/patients",
            icon: Users,
          },
          {
            title: "Financial Reports",
            path: "/dashboard/reports/financial",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Analytics",
        path: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "Notifications",
        path: "/dashboard/notifications",
        icon: Bell,
      },
    ]
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
      },
    ]
  }
];

// Get all menu items flattened for search
const getAllItems = (): MenuItem[] => {
  const allItems: MenuItem[] = [];
  
  sidebarSections.forEach((section) => {
    section.items.forEach((item) => {
      allItems.push(item);
      if (item.children) {
        allItems.push(...item.children);
      }
    });
  });
  
  return allItems;
};

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize expanded state when pathname changes
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    const allItems = getAllItems();
    
    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          // Expand if on a child page or parent page
          const isActive = item.children.some(
            (child) => pathname === child.path
          ) || pathname === item.path;
          
          if (isActive) {
            initialExpanded[item.title] = true;
          }
        }
      });
    });
    
    setExpandedItems(initialExpanded);
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Toggle sidebar collapsed state
  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Sidebar navigation component
  const SidebarNavContent = () => (
    <div className="flex flex-col space-y-6">
      {sidebarSections.map((section) => (
        <div key={section.title} className="space-y-2">
          {!isCollapsed && (
            <h3 className="px-3 text-xs uppercase font-semibold text-muted-foreground tracking-wider">
              {section.title}
            </h3>
          )}
          
          <nav className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              const isExpanded = expandedItems[item.title];
              const hasChildren = item.children && item.children.length > 0;
              
              return (
                <div key={item.title}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "flex items-center w-full gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname.startsWith(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.title}</span>
                          <span className="ml-auto">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isCollapsed && "justify-center"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  )}

                  {/* Children submenus - only show when sidebar is not collapsed */}
                  {hasChildren && isExpanded && !isCollapsed && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children!.map((child) => {
                        const isChildActive = pathname === child.path;
                        
                        return (
                          <Link
                            key={child.title}
                            href={child.path}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                              isChildActive 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
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
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex flex-col h-full">
            {/* Mobile Sidebar Header */}
            <div className="h-16 flex items-center justify-between border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image 
                  src="/logo.png" 
                  alt="Hospital Logo" 
                  width={60} 
                  height={60} 
                />
                <span className="font-bold text-lg">Saksham</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            {/* Mobile Sidebar Navigation */}
            <ScrollArea className="flex-1">
              <div className="px-3 py-4">
                <SidebarNavContent />
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn(
        "h-screen border-r bg-background hidden md:block flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Desktop Sidebar Header */}
        <div className="h-16 flex items-center justify-between border-b px-4">
          <Link href="/dashboard" className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center w-full" : ""
          )}>
            <Image 
              src="/logo.png" 
              alt="Hospital Logo" 
              width={isCollapsed ? 40 : 60} 
              height={isCollapsed ? 40 : 60} 
            />
            {!isCollapsed && <span className="font-bold text-lg">Saksham</span>}
          </Link>
          
          {/* Collapse Toggle Button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebarCollapse}
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Expand Button (Only shown when sidebar is collapsed) */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapse}
            title="Expand sidebar"
            className="w-full rounded-none h-8 mt-1"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Desktop Sidebar Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <SidebarNavContent />
          </div>
        </ScrollArea>
      </div>
    </>
  );
} 