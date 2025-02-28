export interface Patient {
  id: string
  patientId: string
  name: string
  dateOfBirth: string
  gender: string
  contact: string
  address: string
  email: string
  idDocument?: 'Aadhaar' | 'Driving Licence' | 'Voter Id' | 'PAN Card' | 'Other'
  idNumber?: string
  createdAt: string
  updatedAt: string
  lastVisit: Date | null
  lastVisitType: 'IPD' | 'OPD' | null
} 