'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import AddPatientDialog from '@/components/patients/AddPatientDialog'
import PatientsTable from '@/components/patients/PatientsTable'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface Patient {
  id: string
  patientId: string
  createdAt: Date
  lastVisit: Date | null
  lastVisitType: 'IPD' | 'OPD' | null
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  contact: string
  address: string
}

const DUMMY_PATIENTS: Patient[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  patientId: `P${(i + 1).toString().padStart(4, '0')}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  lastVisit: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 1000000000) : null,
  lastVisitType: Math.random() > 0.2 ? (Math.random() > 0.5 ? 'IPD' : 'OPD') : null,
  name: `Patient ${i + 1}`,
  age: 20 + Math.floor(Math.random() * 50),
  gender: ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)] as 'Male' | 'Female' | 'Other',
  contact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  address: `Address ${i + 1}, City`
}))

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(DUMMY_PATIENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 10

  const addPatient = (patient: Patient) => {
    setPatients([...patients, patient])
  }

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contact.includes(searchQuery)
  )

  const paginatedPatients = filteredPatients.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)  // Reset to first page on search
              }}
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Add Patient</Button>
        </div>
      </div>
      
      <PatientsTable patients={paginatedPatients} />
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
      
      <AddPatientDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onAddPatient={addPatient}
      />
    </div>
  )
} 