'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast'
import type { IPDAdmission } from '@/app/ipd/types'
import { AlertTriangle } from 'lucide-react'

interface DeleteAdmissionDialogProps {
  admission: IPDAdmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteAdmissionDialog({ admission, open, onOpenChange, onSuccess }: DeleteAdmissionDialogProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!admission) return

    try {
      setIsDeleting(true)
      console.log(`Attempting to delete admission with ID: ${admission.id}`)

      const response = await fetch(`/api/ipd/${admission.id}`, {
        method: 'DELETE',
      })

      console.log(`Delete response status: ${response.status}`)
      
      const result = await response.json()
      console.log('Delete response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete admission')
      }

      toast({
        title: "Success",
        description: result.message || "Admission has been deleted",
        variant: "default",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting admission:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete admission",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Admission
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the admission record and free up the assigned bed.
          </DialogDescription>
        </DialogHeader>

        {admission && (
          <div className="space-y-4">
            <div className="border rounded-md p-4 bg-muted/50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm font-medium">IPD No</div>
                  <div>{admission.ipdNo}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Patient</div>
                  <div>{admission.patient?.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Admission Date</div>
                  <div>{new Date(admission.admissionTime).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div>{admission.status}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 