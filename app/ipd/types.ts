export type AdmissionStatus = 'Admitted' | 'Discharged' | 'Expired' | 'LAMA'

export type Doctor = {
  id: string
  name: string
  specialization?: string
  active: boolean
}

export type Bed = {
  id: string
  bedNumber: string
  ward: string
  status: 'Available' | 'Occupied' | 'Maintenance'
  currentAdmissionId?: string
}

export interface IPDAdmission {
  id: string
  ipdNo: string
  patientId: string
  patient: {
    id: string
    name: string
    contact?: string
  }
  admissionTime: Date
  dischargeTime?: Date | null
  status: 'Admitted' | 'Discharged' | 'LAMA' | 'Expired'
  bedId: string
  bed: Bed
  doctors: Doctor[]
  createdAt: Date
  updatedAt: Date
  panel_id?: string | null
  panel?: {
    id: string
    name: string
  } | null
} 