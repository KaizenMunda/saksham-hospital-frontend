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
  Stethoscope
} from "lucide-react"

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
    path: "/",
    icon: Home,
    permission: undefined
  },
  {
    title: "Patients",
    path: "/patients",
    icon: Users2,
    permission: undefined
  },
  {
    title: "IPD Admissions",
    path: "/ipd",
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
        path: "/panels",
        icon: Building2,
        permission: undefined
      },
      {
        title: "Expenses",
        path: "/finance/expenses",
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
    path: "/settings",
    icon: Settings,
    permission: undefined
  },
  {
    title: "Help",
    path: "/help",
    icon: HelpCircle,
    permission: undefined
  }
] 