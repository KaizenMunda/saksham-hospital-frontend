import { Button } from "@/components/ui/button"
import { FileText, BedDouble, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Patient } from "@/app/patients/types"

interface PatientActionsProps {
  patient: Patient
  onEdit: (patient: Patient) => void
}

export function PatientActions({ patient, onEdit }: PatientActionsProps) {
  const router = useRouter()
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push(`/patients/${patient.id}`)}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        <span>View</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push(`/ipd?openAdmissionDialog=true&patientId=${patient.id}`)}
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
  )
} 