import { type LucideIcon } from "lucide-react"
import {
  Home,
  Users2,
  Calendar,
  BedDouble,
  BarChart2,
  Building2,
  Folder,
  Wallet,
  Receipt,
  CreditCard,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Bell,
  Users,
  UserPlus,
  Stethoscope,
  UserCog
} from "lucide-react"
import './sidebar.css' // Import the sidebar styles

export interface MenuItem {
  title: string
  path?: string
  icon: LucideIcon
  permission?: string | undefined
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
    permission: undefined
  },
  {
    title: "Patients",
    path: "/dashboard/patients",
    icon: Users2,
    permission: "view_patients"
  },
  {
    title: "IPD Admissions",
    path: "/dashboard/ipd",
    icon: BedDouble,
    permission: undefined
  },
  {
    title: "OPD Appointments",
    path: "/appointments",
    icon: Calendar,
    permission: "view_appointments"
  },
  {
    title: "Reports",
    icon: BarChart2,
    permission: "view_reports",
    children: [
      {
        title: "Financial Reports",
        path: "/reports/financial",
        icon: Receipt
      },
      {
        title: "Patient Reports",
        path: "/reports/patients",
        icon: Users2
      },
    ],
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
    permission: "view_departments"
  },
  {
    title: "Documents",
    path: "/documents",
    icon: Folder,
    permission: "view_documents"
  },
  {
    title: "Finance",
    icon: Wallet,
    permission: undefined,
    children: [
      {
        title: "Invoices",
        path: undefined,
        icon: Receipt
      },
      {
        title: "Payments",
        path: undefined,
        icon: CreditCard
      },
      {
        title: "Panels",
        path: "/dashboard/finance/panels",
        icon: Building2,
        permission: undefined
      },
      {
        title: "Expenses",
        path: "/dashboard/finance/expenses",
        icon: Receipt,
        permission: undefined
      },
    ]
  },
  {
    title: "Security",
    path: "/security",
    icon: Shield,
    permission: "manage_security"
  },
  {
    title: "Messages",
    path: "/messages",
    icon: MessagesSquare,
    permission: undefined
  },
  {
    title: "Video Consult",
    path: "/video-consult",
    icon: Video,
    permission: "view_consultations"
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    permission: undefined
  },
  {
    title: "Help",
    path: "/dashboard/help",
    icon: HelpCircle,
    permission: undefined
  },
  {
    title: "Staff",
    path: "/dashboard/staff",
    icon: UserCog,
    permission: "view_staff"
  }
]

// Ensure the sidebar component applies the class
const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Render menu items here */}
    </div>
  )
}

// Update the sidebar style
const sidebarStyle = {
  backgroundColor: '#4CAF50', // Change sidebar color
  // other styles...
} 