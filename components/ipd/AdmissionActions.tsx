'use client'

import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Edit, Trash2, LogOut, BedDouble } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { IPDAdmission } from "@/app/ipd/types"

interface AdmissionActionsProps {
  admission: IPDAdmission
  onEdit: (admission: IPDAdmission) => void
  onDischarge: (admission: IPDAdmission) => void
  onShiftBed: (admission: IPDAdmission) => void
  onDelete: (admission: IPDAdmission) => void
}

export function AdmissionActions({ 
  admission,
  onEdit,
  onDischarge,
  onShiftBed,
  onDelete
}: AdmissionActionsProps) {
  const router = useRouter()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/ipd/${admission.id}`)}>
          <FileText className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(admission)}>
          Edit
        </DropdownMenuItem>
        {admission.status === 'Admitted' && (
          <>
            <DropdownMenuItem onClick={() => onDischarge(admission)}>
              <LogOut className="mr-2 h-4 w-4" />
              Discharge
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShiftBed(admission)}>
              <BedDouble className="mr-2 h-4 w-4" />
              Shift Bed
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(admission)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 