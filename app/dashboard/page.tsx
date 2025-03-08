'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientsTable } from '@/components/patients/PatientsTable'
import { EditPatientDialog } from '@/components/patients/EditPatientDialog'
import { type Patient } from "@/app/patients/types"
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell
} from 'lucide-react'
import { formatDate, formatDisplayDate } from '@/lib/date-utils'
import { ClientOnlyCount } from '@/components/ui/client-only-count'

// Mock patients data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    patientId: 'P0000001',
    name: 'John Doe',
    dateOfBirth: new Date('1978-05-15'),
    gender: 'Male',
    contact: '+91 98765 43210',
    address: '123 Main St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'OPD'
  },
  {
    id: '2',
    patientId: 'P0000002',
    name: 'Jane Smith',
    dateOfBirth: new Date('1991-08-23'),
    gender: 'Female',
    contact: '+91 98765 43211',
    address: '456 Oak St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'IPD'
  },
  {
    id: '3',
    patientId: 'P0000003',
    name: 'Robert Johnson',
    dateOfBirth: new Date('1985-12-10'),
    gender: 'Male',
    contact: '+91 98765 43212',
    address: '789 Pine St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'OPD'
  },
  {
    id: '4',
    patientId: 'P0000004',
    name: 'Emily Davis',
    dateOfBirth: new Date('1992-04-05'),
    gender: 'Female',
    contact: '+91 98765 43213',
    address: '321 Elm St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'IPD'
  },
  {
    id: '5',
    patientId: 'P0000005',
    name: 'Michael Wilson',
    dateOfBirth: new Date('1980-07-22'),
    gender: 'Male',
    contact: '+91 98765 43214',
    address: '654 Maple St',
    createdAt: new Date(),
    lastVisit: new Date(),
    lastVisitType: 'OPD'
  }
]

export default function DashboardPage() {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
  }

  const handleCloseDialog = () => {
    setEditingPatient(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Saksham Hospital Management System
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900">Total Patients</CardTitle>
                <CardDescription className="text-gray-500">All registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {typeof window === 'undefined' ? '0' : '1248'}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" suppressHydrationWarning>
                  {typeof window === 'undefined' ? '0' : '24'}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8%
                  </span>
                  from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bed Occupancy
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" suppressHydrationWarning>
                  {typeof window === 'undefined' ? '0' : '78'}%
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-red-500 flex items-center mr-1">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    3%
                  </span>
                  from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue (Today)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" suppressHydrationWarning>
                  ₹{typeof window === 'undefined' ? '0' : '24500'}
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <span className="text-green-500 flex items-center mr-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    15%
                  </span>
                  from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16" />
                  <span className="ml-2">Chart will be displayed here</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription suppressHydrationWarning>
                  You have {typeof window === 'undefined' ? '0' : MOCK_PATIENTS.length} patients in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_PATIENTS.slice(0, 3).map((patient) => (
                    <div key={patient.id} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.lastVisitType} visit on {formatDate(patient.lastVisit)}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {typeof window === 'undefined' ? '0' : `${Math.floor(Math.random() * 24)}`}h ago
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                A list of recent patients in your hospital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientsTable 
                patients={MOCK_PATIENTS} 
                onEdit={handleEditPatient}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <TrendingUp className="h-16 w-16" />
          <span className="ml-2">Analytics content will be displayed here</span>
        </TabsContent>
        <TabsContent value="reports" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <BarChart3 className="h-16 w-16" />
          <span className="ml-2">Reports content will be displayed here</span>
        </TabsContent>
        <TabsContent value="notifications" className="h-[400px] flex items-center justify-center text-muted-foreground">
          <Bell className="h-16 w-16" />
          <span className="ml-2">Notifications content will be displayed here</span>
        </TabsContent>
      </Tabs>
      
      {editingPatient && (
        <EditPatientDialog
          patient={editingPatient}
          open={!!editingPatient}
          onOpenChange={handleCloseDialog}
        />
      )}
    </div>
  )
}

