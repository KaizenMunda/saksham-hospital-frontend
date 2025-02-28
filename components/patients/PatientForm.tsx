'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Patient } from "@/app/patients/types"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"

// Add ID document types
const ID_DOCUMENTS = [
  "Aadhaar",
  "Driving Licence",
  "Voter Id",
  "PAN Card",
  "Other"
] as const

type IdDocumentType = typeof ID_DOCUMENTS[number]

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  onDelete?: (patient: Patient) => Promise<void>
  isSubmitting: boolean
}

export function PatientForm({ 
  patient, 
  onSubmit, 
  onCancel,
  onDelete,
  isSubmitting 
}: PatientFormProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Initialize form with patient data if available
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: 'Male',
    contact: '',
    address: '',
    email: ''
  })

  // Update form data when patient changes
  useEffect(() => {
    if (patient) {
      console.log("Setting form data from patient:", patient);
      setFormData({
        name: patient.name || '',
        dateOfBirth: patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'yyyy-MM-dd') : '',
        gender: patient.gender || 'Male',
        contact: patient.contact || '',
        address: patient.address || '',
        email: patient.email || ''
      })
    }
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }
  
  const handleDelete = async () => {
    if (!patient || !onDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(patient);
      // Don't show success toast here, it will be shown by the parent component
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete patient",
        variant: "destructive"
      });
      // Important: Don't close the dialog on error
      throw error; // Re-throw to prevent dialog from closing
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date of Birth *</label>
        <Input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Gender *</label>
        <Select
          value={formData.gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number *</label>
        <Input
          value={formData.contact}
          onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        {patient && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive/10 flex items-center gap-1"
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Patient"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the patient
                  record and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        <div className="flex gap-4 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (patient ? 'Update' : 'Add')}
          </Button>
        </div>
      </div>
    </form>
  )
} 