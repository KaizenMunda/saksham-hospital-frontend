'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from 'date-fns'
import type { IPDAdmission } from '@/app/ipd/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useSWR from 'swr'

interface BedHistoryDialogProps {
  admission: IPDAdmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BedHistory {
  id: string
  bed: {
    ward: string
    bed_number: string
  }
  from_time: string
  to_time: string | null
}

export function BedHistoryDialog({ admission, open, onOpenChange }: BedHistoryDialogProps) {
  const { data: history, error, isLoading } = useSWR(
    admission ? `/api/ipd/${admission.id}/bed-history` : null,
    (url) => fetch(url).then(res => res.json())
  )

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bed History</DialogTitle>
        </DialogHeader>

        {admission && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Patient</div>
                <div className="font-medium">{admission.patient.name}</div>
                <div className="text-sm text-muted-foreground">{admission.ipdNo}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Location</div>
                <div className="font-medium">{admission.bed.ward}</div>
                <div className="text-sm">Bed {admission.bed.bed_number}</div>
              </div>
            </div>

            {isLoading ? (
              <div>Loading bed history...</div>
            ) : error ? (
              <div className="text-red-500">Failed to load bed history</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history?.map((entry: BedHistory) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.bed.ward}</TableCell>
                      <TableCell>Bed {entry.bed.bed_number}</TableCell>
                      <TableCell>{formatDate(entry.from_time)}</TableCell>
                      <TableCell>
                        {entry.to_time ? formatDate(entry.to_time) : 'Current'}
                      </TableCell>
                      <TableCell>
                        {entry.to_time ? (
                          formatDuration(new Date(entry.from_time), new Date(entry.to_time))
                        ) : (
                          formatDuration(new Date(entry.from_time), new Date())
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function formatDuration(start: Date, end: Date): string {
  const diff = Math.abs(end.getTime() - start.getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days === 0) {
    return `${hours} hours`
  }
  return `${days} days, ${hours} hours`
} 