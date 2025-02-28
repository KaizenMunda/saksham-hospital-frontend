import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { AdmissionForm } from '@/components/ipd/AdmissionForm'
import { IPDAdmission } from '@/types'

interface AdmissionDialogProps {
  admission?: IPDAdmission
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => Promise<void>
}

export function AdmissionDialog({ admission, open, onOpenChange, onSuccess }: AdmissionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: Partial<IPDAdmission>) => {
    setIsSubmitting(true)

    try {
      console.log('Submitting update:', data)

      const response = await fetch(`/api/ipd/admissions?id=${admission?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: data.status,
          panel_id: data.panel_id,
          discharge_time: data.dischargeTime
        })
      })

      const result = await response.json()
      console.log('Update response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update admission')
      }

      toast({
        title: "Success",
        description: "Admission updated successfully"
      })

      await onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error updating admission:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update admission",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admission</DialogTitle>
        </DialogHeader>
        <AdmissionForm
          initialData={admission}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          hidePatientSelect
        />
      </DialogContent>
    </Dialog>
  )
} 