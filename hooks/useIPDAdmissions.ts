import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { IPDAdmission } from '@/app/ipd/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useIPDAdmissions() {
  const { data: apiData, error, isLoading, mutate } = useSWR('/api/ipd', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false
  })

  const [admissions, setAdmissions] = useState<IPDAdmission[]>([])

  // Initial load from API
  useEffect(() => {
    if (apiData) {
      setAdmissions(apiData)
    }
  }, [apiData])

  // Fetch from Supabase
  const fetchAdmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('ipd_admissions')
        .select(`
          *,
          patient:patient_id(*),
          bed:bed_id(*),
          doctors:admission_doctors(
            doctor:doctor_id(*)
          ),
          panel:panel_id(*)
        `)
        .order('admission_time', { ascending: false })

      if (error) throw error

      const formattedData = data.map(admission => ({
        id: admission.id,
        patientId: admission.patient_id,
        patient: admission.patient,
        admissionTime: new Date(admission.admission_time),
        dischargeTime: admission.discharge_time ? new Date(admission.discharge_time) : undefined,
        status: admission.status,
        bedId: admission.bed_id,
        bed: admission.bed,
        doctors: admission.doctors?.map(d => d.doctor) || [],
        panel: admission.panel,
        panelId: admission.panel_id,
        attendantName: admission.attendant_name,
        attendantPhone: admission.attendant_phone,
        idDocumentType: admission.id_document_type,
        idNumber: admission.id_number,
      }))

      setAdmissions(formattedData)
      return formattedData
    } catch (error) {
      console.error('Error fetching admissions:', error)
      return []
    }
  }

  // Refresh function that combines both API and Supabase data
  const refresh = async () => {
    const [apiResult, supabaseResult] = await Promise.all([
      mutate(),
      fetchAdmissions()
    ])
    return apiResult || supabaseResult
  }

  return {
    admissions,
    isLoading,
    isError: error,
    mutate: refresh
  }
} 