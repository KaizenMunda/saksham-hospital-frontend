'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from '@/components/ui/nav'
import { PatientsTable } from '@/components/patients/PatientsTable'
import { EditPatientDialog } from '@/components/patients/EditPatientDialog'
import { type Patient } from "@/app/patients/types"

// Mock users with hospital-specific roles
const USERS = [
  { id: '1', name: 'Dr. Saksham', role: 'Admin', department: 'Management' },
  { id: '2', name: 'Dr. Sarah', role: 'Doctor', department: 'Cardiology' },
  { id: '3', name: 'Dr. John', role: 'Doctor', department: 'Pediatrics' },
  { id: '4', name: 'Nurse Jane', role: 'Nurse', department: 'ICU' },
  { id: '5', name: 'Mr. Smith', role: 'Reception', department: 'Front Desk' }
]

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
  // Add more mock patients as needed
]

export default function DashboardPage() {
  const [selectedUser, setSelectedUser] = useState(USERS[0].id)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const currentUser = USERS.find(user => user.id === selectedUser)

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
  }

  const handleSaveEdit = async (data: Partial<Patient>) => {
    // In a real app, you would update the database here
    console.log('Saving patient:', data)
    setEditingPatient(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {USERS.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,345</div>
              <p className="text-xs text-muted-foreground">+180 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">12 pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/50</div>
              <p className="text-xs text-muted-foreground">30% occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">8 doctors on duty</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients Table */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientsTable 
                patients={MOCK_PATIENTS}
                canEdit={true}
                canDelete={true}
                limit={5}
                onEdit={handleEdit}
              />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Department Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add department status content */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <EditPatientDialog
        patient={editingPatient}
        open={editingPatient !== null}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

