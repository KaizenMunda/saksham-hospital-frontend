'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"
import { type Patient } from "@/app/patients/types"

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
  patient?: Patient
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
  const [phoneError, setPhoneError] = useState('')
  const [dobError, setDobError] = useState('')
  
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

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    if (digits.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
      return false
    }
    
    setPhoneError('')
    return true
  }

  const validateDateOfBirth = (dob: string) => {
    if (!dob) return false
    
    const dobDate = new Date(dob)
    const today = new Date()
    
    // Clear time portion for date comparison
    today.setHours(0, 0, 0, 0)
    
    if (dobDate > today) {
      setDobError('Date of birth cannot be in the future')
      return false
    }
    
    setDobError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number
    if (!validatePhone(formData.contact)) {
      return
    }
    
    // Validate date of birth
    if (!validateDateOfBirth(formData.dateOfBirth)) {
      return
    }
    
    // Convert date string to Date object
    const submissionData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth)
    }
    
    await onSubmit(submissionData)
  }
  
  const handleDelete = async () => {
    if (!patient || !onDelete) return
    
    try {
      setIsDeleting(true)
      await onDelete(patient)
    } catch (error) {
      console.error("Error deleting patient:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete patient",
        variant: "destructive"
      })
      throw error // Re-throw to prevent dialog from closing
    } finally {
      setIsDeleting(false)
    }
  }

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
          onChange={(e) => {
            if (dobError) setDobError('')
            setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))
          }}
          max={format(new Date(), 'yyyy-MM-dd')}
          required
        />
        {dobError && (
          <p className="text-sm text-destructive">{dobError}</p>
        )}
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
          onChange={(e) => {
            if (phoneError) setPhoneError('')
            setFormData(prev => ({ ...prev, contact: e.target.value }))
          }}
          required
        />
        {phoneError && (
          <p className="text-sm text-destructive">{phoneError}</p>
        )}
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
          <Button 
            type="submit" 
            disabled={isSubmitting || !!phoneError || !!dobError}
          >
            {isSubmitting ? 'Saving...' : (patient ? 'Update' : 'Add')}
          </Button>
        </div>
      </div>
    </form>
  )
} 