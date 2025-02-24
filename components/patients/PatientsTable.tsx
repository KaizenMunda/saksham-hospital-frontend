import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Patient } from "@/app/patients/page"
import { format } from "date-fns"

interface PatientsTableProps {
  patients: Patient[]
}

export default function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Last Visit Type</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell className="font-medium">{patient.patientId}</TableCell>
            <TableCell>{format(patient.createdAt, 'dd/MM/yyyy')}</TableCell>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.contact}</TableCell>
            <TableCell>
              {patient.lastVisit ? format(patient.lastVisit, 'dd/MM/yyyy') : 'Never'}
            </TableCell>
            <TableCell>
              {patient.lastVisitType || '-'}
            </TableCell>
            <TableCell>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Edit functionality coming soon!')}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('View History functionality coming soon!')}
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('New OPD functionality coming soon!')}
                >
                  New OPD
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('New IPD functionality coming soon!')}
                >
                  New IPD
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 