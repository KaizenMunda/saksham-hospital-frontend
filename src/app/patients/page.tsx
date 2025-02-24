"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, UserPlus, Calendar, Trash } from "lucide-react"

interface Patient {
  id: string
  name: string
  mobile: string
  gender: string
  age: number
  attendantPhone: string
}

// Dummy data - replace with actual API call
const patients: Patient[] = [
  {
    id: "P001",
    name: "John Doe",
    mobile: "1234567890",
    gender: "Male",
    age: 45,
    attendantPhone: "9876543210",
  },
  // Add more dummy data as needed
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleEdit = (patientId: string) => {
    // Implement edit functionality
    console.log("Edit patient:", patientId)
  }

  const handleCreateAdmission = (patientId: string) => {
    // Implement create admission functionality
    console.log("Create admission for patient:", patientId)
  }

  const handleCreateAppointment = (patientId: string) => {
    // Implement create appointment functionality
    console.log("Create appointment for patient:", patientId)
  }

  const handleDelete = (patientId: string) => {
    // Implement delete functionality
    console.log("Delete patient:", patientId)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search patients..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Add Patient</Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Attendant Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.mobile}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.attendantPhone}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(patient.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateAdmission(patient.id)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Admission
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateAppointment(patient.id)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Create Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 