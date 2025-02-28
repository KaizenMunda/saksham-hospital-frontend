'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import type { IPDAdmission } from '@/app/ipd/types'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface DischargeDialogProps {
  admission: IPDAdmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const DISCHARGE_STATUSES = ['Discharged', 'LAMA', 'Expired'] as const
type DischargeStatus = typeof DISCHARGE_STATUSES[number]

export function DischargeDialog({ admission, open, onOpenChange, onSuccess }: DischargeDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dischargeTime, setDischargeTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [status, setStatus] = useState<DischargeStatus>('Discharged')

  // Get current date-time in ISO format for max attribute
  const now = format(new Date(), "yyyy-MM-dd'T'HH:mm")

  const getDoctorName = (doctorEntry: any) => {
    if (!doctorEntry) return 'Unknown Doctor';
    
    // If doctorEntry is the doctor object directly
    if (doctorEntry.name) return doctorEntry.name;
    
    // If doctorEntry has a nested doctor property
    if (doctorEntry.doctor?.name) return doctorEntry.doctor.name;
    
    // If we can't find a name
    return 'Unknown Doctor';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!admission) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/ipd/${admission.id}/discharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dischargeTime,
          status
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to discharge patient')
      }

      toast({
        title: "Success",
        description: "Patient has been discharged",
        variant: "default",
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error discharging patient:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to discharge patient",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDischargeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = new Date(e.target.value)
    const currentTime = new Date()

    if (selectedTime > currentTime) {
      toast({
        title: "Invalid Discharge Time",
        description: "Please select a time that is not in the future. The discharge time cannot be later than the current time.",
        variant: "destructive",
        duration: 4000,
      })
      // Reset to current time
      setDischargeTime(format(currentTime, "yyyy-MM-dd'T'HH:mm"))
    } else {
      setDischargeTime(e.target.value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Discharge Patient</DialogTitle>
        </DialogHeader>

        {admission && (
          <Card className="mb-4">
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">IPD No</div>
                  <div className="font-medium">{admission.ipdNo}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Patient Name</div>
                  <div className="font-medium">{admission.patient.name}</div>
                  <div className="text-sm text-muted-foreground">{admission.patient.patientId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{admission.bed.ward}</div>
                  <div className="text-sm">Bed {admission.bed.bedNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Doctors</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {admission.doctors?.map((d, index) => (
                      <Badge 
                        key={d.id || d.doctor?.id || `doctor-${index}`} 
                        variant="secondary"
                      >
                        {getDoctorName(d)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Discharge Time</label>
            <Input
              type="datetime-local"
              value={dischargeTime}
              onChange={handleDischargeTimeChange}
              max={now}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DischargeStatus)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISCHARGE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Discharging..." : "Discharge"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 