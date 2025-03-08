'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { type Patient } from "@/app/patients/types"
import { differenceInYears } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  History,
  Stethoscope, 
  Bed,
  Edit,
  FileText,
  Trash,
  BedDouble
} from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDate, formatDisplayDate } from '@/lib/date-utils'

interface PatientsTableProps {
  patients: Patient[]
  canEdit: boolean
  canDelete: boolean
  limit?: number
  onEdit: (patient: Patient) => void
}

export function PatientsTable({ patients, canEdit, canDelete, limit, onEdit }: PatientsTableProps) {
  const router = useRouter()
  
  // Limit the number of patients if limit prop is provided
  const displayedPatients = limit ? patients.slice(0, limit) : patients

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date) => {
    return differenceInYears(new Date(), new Date(dateOfBirth))
  }

  // Action handlers
  const handleViewHistory = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}/history`)
  }

  const handleNewOPD = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}/opd/new`)
  }

  const handleNewIPD = (patientId: string) => {
    router.push(`/dashboard/patients/${patientId}/ipd/new`)
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.patientId}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{calculateAge(patient.dateOfBirth)} years</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.contact}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => router.push(`/dashboard/ipd-appointments?openAdmissionDialog=true&patientId=${patient.id}`)}
                    className="flex items-center gap-1"
                  >
                    <BedDouble className="h-4 w-4" />
                    <span>New IPD</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(patient)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 