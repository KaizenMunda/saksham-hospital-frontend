export interface IPDAdmission {
  id: string;
  patientId: string;
  patient?: Patient;
  admissionTime: Date;
  dischargeTime?: Date;
  status: AdmissionStatus;
  bedId?: string;
  bed?: Bed;
  doctors?: Doctor[];
  panel?: Panel;
  panelId?: string;
  attendantName?: string;
  attendantPhone?: string;
  idDocumentType?: string;
  idNumber?: string;
} 