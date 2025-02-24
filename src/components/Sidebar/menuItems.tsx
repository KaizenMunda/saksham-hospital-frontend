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
  HelpCircle
} from "lucide-react"

export const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Patients",
    path: "/patients",
    icon: Users2,
  },
  {
    title: "OPD Appointments",
    path: "/appointments",
    icon: Calendar,
  },
  {
    title: "IPD Admissions",
    path: "/admissions",
    icon: BedDouble,
  },
  {
    title: "Reports",
    icon: BarChart2,
    children: [
      {
        title: "Financial Reports",
        path: "/reports/financial",
      },
      {
        title: "Patient Reports",
        path: "/reports/patients",
      },
    ],
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: Folder,
  },
  {
    title: "Finance",
    icon: Wallet,
    children: [
      {
        title: "Invoices",
        path: "/finance/invoices",
        icon: Receipt,
      },
      {
        title: "Payments",
        path: "/finance/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Security",
    path: "/security",
    icon: Shield,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: MessagesSquare,
  },
  {
    title: "Video Consult",
    path: "/video-consult",
    icon: Video,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    path: "/help",
    icon: HelpCircle,
  }
] 