'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { IPDAdmissionsTable } from '@/components/ipd/IPDAdmissionsTable'
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { useRole } from '@/contexts/role-context'
import { AddAdmissionDialog } from '@/components/ipd/AddAdmissionDialog'
import { EditAdmissionDialog } from '@/components/ipd/EditAdmissionDialog'
import { type IPDAdmission } from "./types"
import { useIPDAdmissions } from '@/hooks/useIPDAdmissions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { WardBedStatus } from '@/components/ipd/WardBedStatus'
import { useWardBedStats } from '@/hooks/useWardBedStats'
import { DischargeDialog } from '@/components/ipd/DischargeDialog'
import { ShiftBedDialog } from '@/components/ipd/ShiftBedDialog'
import { useNextIPDNumber } from '@/hooks/useNextIPDNumber'
import { useRouter, useSearchParams } from 'next/navigation'
import { DeleteAdmissionDialog } from '@/components/ipd/DeleteAdmissionDialog'
import { supabase } from '@/lib/supabase'

export default function IPDPage() {
  const { hasPermission } = useRole()
  const { toast } = useToast()
  const { admissions, isLoading, mutate } = useIPDAdmissions()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingAdmission, setEditingAdmission] = useState<IPDAdmission | null>(null)
  const [dischargingAdmission, setDischargingAdmission] = useState<IPDAdmission | null>(null)
  const [shiftingAdmission, setShiftingAdmission] = useState<IPDAdmission | null>(null)
  const itemsPerPage = 10
  const { stats: wardStats, isLoading: isLoadingStats } = useWardBedStats()
  const { nextNumber, isLoading: isLoadingNextNumber } = useNextIPDNumber()
  const [bedStats, setBedStats] = useState({
    total: 0,
    available: 0,
    occupied: 0
  })
  const router = useRouter()
  const [selectedAdmission, setSelectedAdmission] = useState<IPDAdmission | null>(null)
  const [isDischargeDialogOpen, setIsDischargeDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const openAdmissionDialog = searchParams?.get('openAdmissionDialog') === 'true'
  const patientIdFromUrl = searchParams?.get('patientId')
  const [preselectedPatient, setPreselectedPatient] = useState(null)

  // Use memoized values for filtered admissions to avoid recalculating on every render
  const { currentAdmissions, pastAdmissions } = useMemo(() => {
    const current = (admissions || []).filter(admission => 
      admission.status === 'Admitted' &&
      (
        admission.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.ipdNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admission.patient.contact && admission.patient.contact.includes(searchQuery))
      )
    )

    const past = (admissions || []).filter(admission => 
      admission.status !== 'Admitted' &&
      (
        admission.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admission.ipdNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admission.patient.contact && admission.patient.contact.includes(searchQuery))
      )
    )

    return { currentAdmissions: current, pastAdmissions: past }
  }, [admissions, searchQuery])

  // Use memoized values for paginated admissions
  const { 
    paginatedCurrentAdmissions, 
    paginatedPastAdmissions, 
    totalCurrentPages, 
    totalPastPages 
  } = useMemo(() => {
    const paginatedCurrent = currentAdmissions.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )

    const paginatedPast = pastAdmissions.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )

    const totalCurrent = Math.ceil(currentAdmissions.length / itemsPerPage)
    const totalPast = Math.ceil(pastAdmissions.length / itemsPerPage)

    return {
      paginatedCurrentAdmissions: paginatedCurrent,
      paginatedPastAdmissions: paginatedPast,
      totalCurrentPages: totalCurrent,
      totalPastPages: totalPast
    }
  }, [currentAdmissions, pastAdmissions, page, itemsPerPage])

  const handleEdit = useCallback((admission: IPDAdmission) => {
    setEditingAdmission(admission)
  }, [])

  const handleSaveEdit = useCallback(async (data: Partial<IPDAdmission>) => {
    try {
      console.log('Page - Updating admission with data:', data)

      const response = await fetch(`/api/ipd?id=${editingAdmission?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: data.status,
          panel_id: data.panel_id,
          discharge_time: data.dischargeTime
        })
      })

      const result = await response.json()
      console.log('Page - Update response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update admission')
      }

      await mutate()
      setEditingAdmission(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Admission updated successfully"
      })
    } catch (error: any) {
      console.error('Page - Error updating admission:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update admission",
        variant: "destructive"
      })
      throw error
    }
  }, [editingAdmission, mutate, toast])

  const handleDischarge = useCallback((admission: IPDAdmission) => {
    setSelectedAdmission(admission)
    setIsDischargeDialogOpen(true)
  }, [])

  const handleShiftBed = useCallback((admission: IPDAdmission) => {
    setShiftingAdmission(admission)
  }, [])

  const handleDelete = useCallback((admission: IPDAdmission) => {
    setSelectedAdmission(admission)
    setIsDeleteDialogOpen(true)
  }, [])

  const fetchBedStats = useCallback(async () => {
    try {
      const { data: beds, error: bedsError } = await supabase
        .from('beds')
        .select('status')
      
      if (bedsError) throw bedsError
      
      const total = beds.length
      const available = beds.filter(bed => bed.status === 'Available').length
      const occupied = beds.filter(bed => bed.status === 'Occupied').length
      
      setBedStats({
        total,
        available,
        occupied
      })
    } catch (error) {
      console.error('Error fetching bed stats:', error)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await mutate()
    await fetchBedStats()
  }, [mutate, fetchBedStats])

  // Effect to fetch bed stats on mount
  useEffect(() => {
    fetchBedStats()
  }, [fetchBedStats])

  // Effect to handle URL parameters
  useEffect(() => {
    if (openAdmissionDialog && patientIdFromUrl) {
      const fetchPatientData = async () => {
        try {
          // Check if patient is already admitted
          const { data: existingAdmission, error: admissionError } = await supabase
            .from('ipd_admissions')
            .select('id, ipd_no')
            .eq('patient_id', patientIdFromUrl)
            .eq('status', 'Admitted')
            .maybeSingle()
          
          if (admissionError) {
            throw admissionError
          }
          
          if (existingAdmission) {
            // Patient is already admitted, show toast and don't open dialog
            toast({
              title: "Patient Already Admitted",
              description: `This patient is already admitted with IPD number ${existingAdmission.ipd_no}`,
              variant: "destructive"
            })
            return
          }
          
          // Fetch patient details
          const { data: patient, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdFromUrl)
            .single()
          
          if (error) {
            throw error
          }
          
          setPreselectedPatient(patient)
          setIsDialogOpen(true)
          
          // Clear the URL parameters after handling them
          router.replace('/ipd', { scroll: false })
        } catch (error) {
          console.error('Error fetching patient:', error)
          toast({
            title: "Error",
            description: "Failed to load patient data. Please try again.",
            variant: "destructive"
          })
        }
      }
      
      fetchPatientData()
    }
  }, [openAdmissionDialog, patientIdFromUrl, toast, router])

  // Memoize the PaginationControls component to avoid recreating it on every render
  const PaginationControls = useCallback(({ totalPages }: { totalPages: number }) => (
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
        Page {page} of {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))}
        disabled={page === totalPages || totalPages === 0}
      >
        Next
      </Button>
    </div>
  ), [page])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">IPD Admissions</h1>
          {!isLoadingNextNumber && nextNumber && (
            <span className="text-sm bg-muted px-3 py-1 rounded-md">
              Next IPD: <strong>{nextNumber}</strong>
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admissions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>
          {hasPermission('manage_patients') && (
            <Button onClick={() => setIsDialogOpen(true)}>New IPD</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current IPD Admissions</TabsTrigger>
          <TabsTrigger value="past">Past IPD Admissions</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {isLoadingStats ? (
                  <div>Loading bed statistics...</div>
                ) : (
                  <WardBedStatus 
                    stats={wardStats || []} 
                    totalBeds={bedStats.total}
                    availableBeds={bedStats.available}
                    occupiedBeds={bedStats.occupied}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <IPDAdmissionsTable 
                  admissions={paginatedCurrentAdmissions} 
                  canEdit={hasPermission('manage_patients')}
                  onEdit={handleEdit}
                  onDischarge={handleDischarge}
                  onShiftBed={handleShiftBed}
                  onDelete={handleDelete}
                  showStatus={false}
                  showStayDuration={true}
                />
                <PaginationControls totalPages={totalCurrentPages} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardContent className="pt-6">
              <IPDAdmissionsTable 
                admissions={paginatedPastAdmissions} 
                canEdit={hasPermission('manage_patients')}
                onEdit={handleEdit}
                onDischarge={handleDischarge}
                onShiftBed={handleShiftBed}
                onDelete={handleDelete}
                showStatus={true}
                showStayDuration={false}
              />
              <PaginationControls totalPages={totalPastPages} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddAdmissionDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Clear preselected patient when dialog is closed
            setPreselectedPatient(null);
            // Also clear URL parameters if they exist
            if (patientIdFromUrl) {
              router.replace('/ipd', { scroll: false });
            }
          }
        }}
        onSuccess={refreshData}
        preselectedPatient={preselectedPatient}
      />

      <EditAdmissionDialog
        admission={editingAdmission}
        open={editingAdmission !== null}
        onOpenChange={(open) => !open && setEditingAdmission(null)}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />

      <DischargeDialog
        admission={selectedAdmission}
        open={isDischargeDialogOpen}
        onOpenChange={setIsDischargeDialogOpen}
        onSuccess={refreshData}
      />

      <ShiftBedDialog
        admission={shiftingAdmission}
        open={shiftingAdmission !== null}
        onOpenChange={(open) => !open && setShiftingAdmission(null)}
        onSuccess={refreshData}
      />

      <DeleteAdmissionDialog
        admission={selectedAdmission}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={refreshData}
      />
    </div>
  )
} 