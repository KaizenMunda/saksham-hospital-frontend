import { 
  MdDashboard as DashboardIcon,
  MdPeople as PatientsIcon,
  MdLocalHospital as AdmissionsIcon,
  MdEventNote as AppointmentsIcon,
  MdAttachMoney as FinanceIcon,
  MdInventory as InventoryIcon,
  MdBuildCircle as MaintenanceIcon,
  MdManageAccounts as RoleManagementIcon,
  MdSettings as SettingsIcon,
  MdBarChart as ReportsIcon,
} from 'react-icons/md';

export const menuItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: DashboardIcon, // Use your actual icon component
  },
  {
    title: 'Reports',
    icon: ReportsIcon,
    children: [
      {
        title: 'Overview',
        path: '/analytics',
      },
      {
        title: 'Reports',
        path: '/analytics/reports',
      },
      {
        title: 'Insights',
        path: '/analytics/insights',
      },
    ],
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: PatientsIcon,
  },
  {
    title: 'Admissions',
    path: '/admissions',
    icon: AdmissionsIcon,
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: AppointmentsIcon,
  },
  {
    title: 'Finance',
    icon: FinanceIcon,
    children: [
      {
        title: 'Invoices',
        path: '/finance/invoices',
      },
      {
        title: 'Payments',
        path: '/finance/payments',
      },
      {
        title: 'Wallet',
        path: '/finance/wallet',
      },
    ],
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: InventoryIcon,
  },
  {
    title: 'Maintenance',
    path: '/maintenance',
    icon: MaintenanceIcon,
  },
  {
    title: 'Role Management',
    path: '/role-management',
    icon: RoleManagementIcon,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
] 