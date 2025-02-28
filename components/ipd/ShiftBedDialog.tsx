'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import type { IPDAdmission } from '@/app/ipd/types'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBeds } from '@/hooks/useBeds'

interface ShiftBedDialogProps {
  admission: IPDAdmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ShiftBedDialog({ admission, open, onOpenChange, onSuccess }: ShiftBedDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shiftTime, setShiftTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [selectedBedId, setSelectedBedId] = useState<string>('')
  const { beds, isLoading: isLoadingBeds } = useBeds()
  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm")

  const availableBeds = beds?.filter(bed => 
    bed.status === 'Available' && bed.id !== admission?.bed.id
  ) || []

  const handleShiftTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = new Date(e.target.value)
    const currentTime = new Date()

    if (selectedTime > currentTime) {
      toast({
        title: "Invalid Shift Time",
        description: "Please select a time that is not in the future. The shift time cannot be later than the current time.",
        variant: "destructive",
        duration: 4000,
      })
      setShiftTime(format(currentTime, "yyyy-MM-dd'T'HH:mm"))
    } else {
      setShiftTime(e.target.value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admission || !selectedBedId) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/ipd/${admission.id}/shift-bed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newBedId: selectedBedId,
          shiftTime
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to shift bed')
      }

      toast({
        title: "Success",
        description: "Patient has been shifted to new bed",
        variant: "default",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error shifting bed:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shift bed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Shift Patient to New Bed</DialogTitle>
        </DialogHeader>

        {admission && (
          <Card className="mb-4">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Current Location</div>
                  <div className="font-medium">{admission.bed.ward}</div>
                  <div className="text-sm">Bed {admission.bed.bed_number}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Patient</div>
                  <div className="font-medium">{admission.patient.name}</div>
                  <div className="text-sm text-muted-foreground">{admission.ipdNo}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Shift Time</label>
            <Input
              type="datetime-local"
              value={shiftTime}
              onChange={handleShiftTimeChange}
              max={now}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Bed</label>
            <Select
              value={selectedBedId}
              onValueChange={setSelectedBedId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a bed" />
              </SelectTrigger>
              <SelectContent>
                {availableBeds.map((bed) => (
                  <SelectItem key={bed.id} value={bed.id}>
                    {bed.ward} - Bed {bed.bed_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedBedId}>
              {isSubmitting ? "Shifting..." : "Shift Bed"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 