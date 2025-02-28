'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PatientForm } from "./PatientForm"
import { type Patient } from "@/app/patients/types"

interface AddPatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPatient: (data: Partial<Patient>) => void
}

export function AddPatientDialog({ open, onOpenChange, onAddPatient }: AddPatientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <PatientForm
          onSubmit={onAddPatient}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 