'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AdmissionForm } from './AdmissionForm'
import { useToast } from '@/components/ui/use-toast'
import type { IPDAdmission } from '@/app/ipd/types'

interface AddAdmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  preselectedPatient?: any
}

export function AddAdmissionDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  preselectedPatient
}: AddAdmissionDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && preselectedPatient) {
      console.log('Setting preselected patient:', preselectedPatient);
    } else if (!open) {
      setIsSubmitting(false);
    }
  }, [open, preselectedPatient]);

  const handleSubmit = async (formData: Partial<IPDAdmission>) => {
    try {
      setIsSubmitting(true);
      
      // Format the data for the API
      const apiData = {
        patientId: formData.patientId,
        bedId: formData.bedId,
        doctorIds: formData.doctorIds || [],
        admissionTime: formData.admissionTime,
        panel_id: formData.panel_id || null,
        attendant_name: formData.attendantName,
        attendant_phone: formData.attendantPhone,
        id_document_type: formData.idDocumentType,
        id_number: formData.idNumber
      };
      
      console.log('Sending to API:', apiData);
      
      const response = await fetch('/api/ipd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Map error messages to user-friendly messages
        const userFriendlyMessage = getUserFriendlyError(data.error);
        throw new Error(userFriendlyMessage);
      }

      toast({
        title: "Success",
        description: "Patient has been admitted successfully",
        variant: "default",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating admission:', error);
      toast({
        title: "Unable to Admit Patient",
        description: error instanceof Error ? error.message : "Failed to create admission",
        variant: "destructive",
      });
      throw error; // Re-throw to reset isSubmitted in the form
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert technical errors to user-friendly messages
  const getUserFriendlyError = (error: string) => {
    switch (true) {
      case /patient is already admitted/i.test(error):
        return "This patient is already admitted to the hospital";
      case /bed is already occupied/i.test(error):
        return "The selected bed is already occupied by another patient";
      case /missing required fields/i.test(error):
        return "Please fill in all required fields";
      case /failed to check bed status/i.test(error):
        return "Unable to verify bed availability. Please try again";
      case /failed to assign doctors/i.test(error):
        return "Unable to assign doctors. Please try again";
      default:
        return "Unable to complete admission. Please try again";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>New IPD Admission</DialogTitle>
          <DialogDescription>
            {preselectedPatient 
              ? `Create a new IPD admission for ${preselectedPatient.name}`
              : "Fill in the details to create a new IPD admission"}
          </DialogDescription>
        </DialogHeader>
        
        <AdmissionForm
          initialData={preselectedPatient ? { patientId: preselectedPatient.id } : null}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          hidePatientSelect={!!preselectedPatient}
          patientData={preselectedPatient}
        />
      </DialogContent>
    </Dialog>
  )
} 