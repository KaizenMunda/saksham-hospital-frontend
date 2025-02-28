'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BedDouble } from "lucide-react"

const PatientDetailsPage = () => {
  const router = useRouter()

  return (
    <div>
      {/* Update the IPD button in the patient details page */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push(`/ipd?openAdmissionDialog=true&patientId=${patient.id}`)}
        className="ml-auto flex items-center gap-1"
      >
        <BedDouble className="h-4 w-4" />
        <span>New IPD</span>
      </Button>
    </div>
  )
}

export default PatientDetailsPage 