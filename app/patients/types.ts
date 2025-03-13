export interface Patient {
  id: string;
  patientId: string;
  name: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  email: string;
  // Add other relevant fields...
} 