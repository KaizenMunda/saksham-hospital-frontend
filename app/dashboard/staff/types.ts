export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: Date;
  status: 'active' | 'inactive';
  
  // Basic Info
  fatherName?: string;
  dob?: Date;
  bloodGroup?: string;
  gender?: 'male' | 'female' | 'other';
  active?: boolean;
  
  // Identification
  aadhaar?: string;
  mobile?: string;
  address?: string;
  photo?: string;
  signature?: string;
  idProof?: string;
  kycNumber?: string;
  kycDocument?: string;
  
  // Professional
  designation?: string;
  qualifications?: string[];
  qualification?: string;
  specialization?: string;
  resume?: string;
  dutyHours?: string;
  
  // Financial
  salaryType?: string;
  salaryAmount?: string | number;
  pfUan?: string;
  pan?: string;
  salary?: string | number;
  bankName?: string;
  accountNumber?: string | number;
  
  // Other
  emergencyContact?: string;
  profileImage?: string;
}

export const STAFF_ROLES = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'admin', label: 'Administrator' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'radiologist', label: 'Radiologist' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' }
];

export const DEPARTMENTS = [
  { value: 'general_medicine', label: 'General Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'ent', label: 'ENT' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'pathology', label: 'Pathology' },
  { value: 'anesthesiology', label: 'Anesthesiology' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'icu', label: 'ICU' },
  { value: 'administration', label: 'Administration' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' }
]; 