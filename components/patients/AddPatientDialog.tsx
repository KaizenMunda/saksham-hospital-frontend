'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { PatientForm } from "./PatientForm"
import { type Patient } from "@/app/patients/types"

interface AddPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (patient: any) => void
}

export function AddPatientDialog({ open, onOpenChange, onAddPatient }: AddPatientDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a unique patient ID (in a real app, this would be done server-side)
      const patientId = `P${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`
      
      const newPatient = {
        ...data,
        patientId,
        createdAt: new Date(),
        lastVisit: new Date(),
        lastVisitType: 'OPD'
      }
      
      onAddPatient(newPatient)
      
      toast({
        title: "Success",
        description: "Patient added successfully",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding patient:', error)
      
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
} 