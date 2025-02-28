'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PatientForm } from "./PatientForm"
import { useToast } from '@/components/ui/use-toast'
import type { Patient } from "@/app/patients/types"

interface EditPatientDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<void>
  onDelete: (patient: Patient) => Promise<void>
}

export function EditPatientDialog({ 
  patient, 
  open, 
  onOpenChange, 
  onSave,
  onDelete
}: EditPatientDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true)
      await onSave({
        id: patient?.id,
        ...formData
      })
      
      toast({
        title: "Success",
        description: "Patient updated successfully",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        title: "Error",
        description: "Failed to update patient",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (patient: Patient) => {
    try {
      await onDelete(patient);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in EditPatientDialog handleDelete:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>
        
        {patient && (
          <PatientForm
            patient={patient}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 