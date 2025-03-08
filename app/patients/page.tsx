'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PatientsTable } from '@/components/patients/PatientsTable'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { useRole } from '@/contexts/role-context'
import { EditPatientDialog } from '@/components/patients/EditPatientDialog'
import { AddPatientDialog } from '@/components/patients/AddPatientDialog'
import { PageContainer } from '@/components/ui/page-container'

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

export default function PatientsPage() {
  const { hasPermission } = useRole()
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  useEffect(() => {
    fetchPatients()

    // Only set up realtime subscription in the browser
    if (typeof window !== 'undefined') {
      const subscription = supabase
        .channel('patients')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'patients' },
          (payload) => {
            // Refresh the patients list when changes occur
            fetchPatients()
          }
        )
        .subscribe()

      // Cleanup subscription
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  async function fetchPatients() {
    try {
      const response = await fetch('/api/patients')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      
      setPatients(data.map((patient: any) => ({
        id: patient.id,
        patientId: patient.patient_id,
        name: patient.name,
        dateOfBirth: new Date(patient.date_of_birth),
        gender: patient.gender,
        contact: patient.contact,
        address: patient.address,
        attendantName: patient.attendant_name,
        attendantContact: patient.attendant_contact,
        idDocument: patient.id_document,
        idNumber: patient.id_number,
        createdAt: new Date(patient.created_at),
        lastVisit: patient.last_visit ? new Date(patient.last_visit) : null,
        lastVisitType: patient.last_visit_type
      })))
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast({
        title: "Error",
        description: "Failed to fetch patients",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addPatient(patientData: Partial<Patient>) {
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add patient')
      }

      const newPatient = await response.json()

      // Create notification
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Patient Added',
          message: `${patientData.name} has been registered as a new patient`,
          type: 'patient',
          link: `/patients/${newPatient.id}`,
        }),
      })

      toast({
        title: "Success",
        description: "Patient added successfully",
        variant: "default",
        duration: 3000,
      })

      fetchPatients()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding patient:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add patient",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
  }

  async function handleSaveEdit(data: Partial<Patient>) {
    try {
      if (!editingPatient?.id) return

      const response = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update patient')
      }

      toast({
        title: "Success",
        description: "Patient updated successfully",
        variant: "default",
        duration: 3000,
      })

      await fetchPatients()
      setEditingPatient(null)
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleDelete = async (patient: Patient) => {
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete patient');
      }
      
      // Refresh the patients list
      fetchPatients();
      
      toast({
        title: 'Success',
        description: 'Patient deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete patient',
        variant: 'destructive',
      });
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <PageContainer>
      <div className="w-full py-10 px-4">
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
                  setPage(1)
                }}
              />
            </div>
            {hasPermission('manage_patients') && (
              <Button onClick={() => setIsDialogOpen(true)}>Add Patient</Button>
            )}
          </div>
        </div>
        
        <PatientsTable 
          patients={paginatedPatients} 
          canEdit={hasPermission('manage_patients')}
          canDelete={hasPermission('delete_patients')}
          onEdit={handleEdit}
        />
        
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

        <EditPatientDialog
          patient={editingPatient}
          open={editingPatient !== null}
          onOpenChange={(open) => !open && setEditingPatient(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      </div>
    </PageContainer>
  )
} 