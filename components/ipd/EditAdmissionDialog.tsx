'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import type { IPDAdmission } from '@/app/ipd/types'
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdmissionForm } from "./AdmissionForm"

interface EditAdmissionDialogProps {
  admission: IPDAdmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Partial<IPDAdmission>) => Promise<void>
  onDelete?: (admission: IPDAdmission) => Promise<void>
}

export function EditAdmissionDialog({ 
  admission, 
  open, 
  onOpenChange, 
  onSave,
  onDelete 
}: EditAdmissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: Partial<IPDAdmission>) => {
    try {
      setIsSubmitting(true)
      
      // Only include fields that should be editable in the edit form
      const editData = {
        id: admission?.id,
        patientId: formData.patientId,
        doctorIds: formData.doctorIds || [],
        panel_id: formData.panel_id,
        attendantName: formData.attendantName,
        attendantPhone: formData.attendantPhone,
        idDocumentType: formData.idDocumentType,
        idNumber: formData.idNumber
      }
      
      await onSave(editData)
      
      toast({
        title: "Success",
        description: "Admission details updated successfully",
        variant: "default",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating admission:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update admission",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!admission) return
    try {
      setIsSubmitting(true)
      await onDelete?.(admission)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting admission:', error)
      toast({
        title: "Error",
        description: "Failed to delete admission",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit IPD Admission</DialogTitle>
            <DialogDescription>
              Update the admission details for {admission?.patient?.name}
            </DialogDescription>
          </DialogHeader>

          {admission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Patient</div>
                  <div className="font-medium">{admission.patient.name}</div>
                  <div className="text-sm text-muted-foreground">{admission.patient.patientId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">IPD Number</div>
                  <div className="font-medium">{admission.ipdNo}</div>
                </div>
              </div>

              <AdmissionForm
                initialData={admission}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                isSubmitting={isSubmitting}
                isEditMode={true}
                hideWardBedFields={true}
                hideStatusField={true}
              />

              {onDelete && (
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                  >
                    Delete Admission
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the admission record and release the bed.
              The IPD number will be reused for the next admission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 