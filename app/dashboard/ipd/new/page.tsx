'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdmissionForm } from '@/components/ipd/AdmissionForm'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function NewIPDAdmissionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(!!patientId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patientData, setPatientData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If patientId is provided, fetch patient data
    if (patientId) {
      const fetchPatient = async () => {
        try {
          setIsLoading(true)
          
          // Check if patient is already admitted
          const { data: existingAdmission, error: admissionError } = await supabase
            .from('ipd_admissions')
            .select('id, ipd_no')
            .eq('patient_id', patientId)
            .eq('status', 'Admitted')
            .maybeSingle()
          
          if (admissionError) {
            throw admissionError
          }
          
          if (existingAdmission) {
            // Patient is already admitted, show toast and redirect back
            toast({
              title: "Patient Already Admitted",
              description: `This patient is already admitted with IPD number ${existingAdmission.ipd_no}`,
              variant: "destructive"
            })
            router.push('/patients')
            return
          }
          
          // Fetch patient details
          const { data: patient, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single()
          
          if (error) {
            throw error
          }
          
          setPatientData(patient)
          
        } catch (error) {
          console.error('Error fetching patient:', error)
          setError('Failed to load patient data')
          toast({
            title: "Error",
            description: "Failed to load patient data. Please try again.",
            variant: "destructive"
          })
          router.push('/patients')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchPatient()
    }
  }, [patientId, router, toast])

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      
      // Add patientId to the data if it was provided in URL
      const submissionData = patientId ? { ...data, patientId } : data
      
      const response = await fetch('/api/ipd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create admission')
      }
      
      const result = await response.json()
      
      toast({
        title: "Success",
        description: `Patient admitted successfully with IPD number ${result.ipd_no}`,
      })
      
      router.push('/ipd')
      
    } catch (error) {
      console.error('Error creating admission:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create admission",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading patient data...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">New IPD Admission</h1>
      
      <AdmissionForm
        initialData={patientId ? { patientId } : null}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        hidePatientSelect={!!patientId}
        patientData={patientData}
      />
    </div>
  )
} 