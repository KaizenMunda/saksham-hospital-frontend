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
import { type Doctor, type Bed, type IPDAdmission, type AdmissionStatus } from "@/app/ipd/types"
import { format, parseISO } from "date-fns"
import { useToast } from '@/components/ui/use-toast'
import { Combobox } from '@/components/ui/combobox'
import { Label } from "@/components/ui/label"
import type { Panel } from "@/app/panels/types"
import { SearchableSelect } from "@/components/ui/searchable-select"

interface AdmissionFormProps {
  initialData?: Partial<IPDAdmission> | null
  onSubmit: (data: Partial<IPDAdmission>) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  hidePatientSelect?: boolean
  patientData?: any
  isEditMode?: boolean
  hideWardBedFields?: boolean
  hideStatusField?: boolean
}

interface ComboboxOption {
  value: string
  label: string
}

interface BedsByWard {
  [ward: string]: ComboboxOption[]
}

type Status = 'Admitted' | 'Discharged' | 'Transferred' | 'Expired'

interface FormData {
  patientId: string
  bedId: string
  doctorIds: string[]
  admissionTime: string
  status: Status
  panel_id: string
  attendantName: string
  attendantPhone: string
  idDocumentType: string
  idNumber: string
}

export function AdmissionForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  hidePatientSelect,
  patientData,
  isEditMode,
  hideWardBedFields,
  hideStatusField
}: AdmissionFormProps) {
  const { toast } = useToast()
  const [patients, setPatients] = useState<ComboboxOption[]>([])
  const [doctors, setDoctors] = useState<ComboboxOption[]>([])
  const [wardOptions, setWardOptions] = useState<ComboboxOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWard, setSelectedWard] = useState<string>('')
  const [wardBeds, setWardBeds] = useState<BedsByWard>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [panels, setPanels] = useState<Panel[]>([])

  const [formData, setFormData] = useState<FormData>({
    patientId: initialData?.patientId || '',
    bedId: initialData?.bedId || '',
    doctorIds: initialData?.doctors?.map(d => d.id) || [],
    admissionTime: initialData?.admissionTime 
      ? format(new Date(initialData.admissionTime), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    status: (initialData?.status as Status) || 'Admitted',
    panel_id: initialData?.panel_id || '',
    attendantName: initialData?.attendantName || '',
    attendantPhone: initialData?.attendantPhone || '',
    idDocumentType: initialData?.idDocumentType || 'none',
    idNumber: initialData?.idNumber || '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching form data...');

        // Fetch all data in parallel
        const [patientsRes, doctorsRes, bedsRes, admissionsRes, panelsRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/doctors'),
          fetch('/api/beds'),
          fetch('/api/ipd'),
          fetch('/api/panels')
        ]);

        // Check if any response is not ok
        if (!patientsRes.ok || !doctorsRes.ok || !bedsRes.ok || !admissionsRes.ok || !panelsRes.ok) {
          throw new Error('One or more API requests failed');
        }

        const [patientsData, doctorsData, bedsData, admissionsData, panelsData] = await Promise.all([
          patientsRes.json(),
          doctorsRes.json(),
          bedsRes.json(),
          admissionsRes.json(),
          panelsRes.json()
        ]);

        console.log('Data fetched successfully');

        // Set panels data
        if (Array.isArray(panelsData)) {
          setPanels(panelsData);
        }

        // Get IDs of currently admitted patients
        const admittedPatientIds = (admissionsData || [])
          .filter((admission: any) => admission.status === 'Admitted')
          .map((admission: any) => admission.patientId);

        // Set patients data - filter out already admitted patients
        if (Array.isArray(patientsData)) {
          const availablePatients = patientsData.filter(p => 
            !admittedPatientIds.includes(p.id) || 
            p.id === initialData?.patientId
          );

          setPatients(availablePatients.map((p: any) => ({
            value: p.id,
            label: `${p.name} (${p.patient_id || p.patientId})`
          })));
          
          // If patientId is provided in initialData, find the patient details
          if (initialData?.patientId && hidePatientSelect) {
            const selectedPatient = patientsData.find(p => p.id === initialData.patientId);
            if (selectedPatient) {
              // You can set any additional patient-related data here if needed
              console.log('Selected patient:', selectedPatient);
            }
          }
        }

        // Set doctors data
        if (Array.isArray(doctorsData)) {
          const mappedDoctors = doctorsData
            .filter(d => d && d.id && d.name)
            .map(d => ({
              value: d.id,
              label: `${d.name} - ${d.department}${d.specialization ? ` (${d.specialization})` : ''}`
            }));
          setDoctors(mappedDoctors);
        }

        // Process beds data
        if (Array.isArray(bedsData)) {
          // Filter out occupied beds, except for the current admission's bed
          const availableBeds = bedsData.filter(bed => 
            bed.status === 'Available' || 
            bed.id === initialData?.bedId
          );

          // Get unique wards and create ward options
          const uniqueWards = [...new Set(availableBeds.map(bed => bed.ward))];
          const wardOpts = uniqueWards.map(ward => ({
            value: ward,
            label: ward
          }));
          setWardOptions(wardOpts);
          console.log('Ward options set:', wardOpts);
          
          // Group beds by ward
          const bedsByWard = availableBeds.reduce((acc: BedsByWard, bed) => {
            if (!acc[bed.ward]) {
              acc[bed.ward] = [];
            }
            acc[bed.ward].push({
              value: bed.id,
              label: `Bed ${bed.bed_number}`
            });
            return acc;
          }, {} as BedsByWard);

          setWardBeds(bedsByWard);
          console.log('Ward beds set:', bedsByWard);

          // If editing, set the selected ward based on the bed
          if (initialData?.bedId) {
            const bed = bedsData.find(b => b.id === initialData.bedId);
            if (bed) {
              setSelectedWard(bed.ward);
              console.log('Selected ward set:', bed.ward);
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialData, hidePatientSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitted) return;
    
    // Validate required fields
    if (!formData.patientId || 
        (!hideWardBedFields && !formData.bedId) || 
        formData.doctorIds.length === 0 ||
        !formData.attendantName ||
        !formData.attendantPhone ||
        !formData.idDocumentType ||
        (formData.idDocumentType !== 'none' && !formData.idNumber)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if admission time is in the future
    if (new Date(formData.admissionTime) > new Date()) {
      toast({
        title: "Validation Error",
        description: "Admission time cannot be in the future",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    
    try {
      // Create a Date object from the local datetime input
      // The browser will handle the conversion to UTC when using toISOString()
      const localDate = new Date(formData.admissionTime);
      
      // Format the data for the API
      const apiData = {
        patientId: formData.patientId,
        bedId: formData.bedId,
        doctorIds: formData.doctorIds,
        admissionTime: localDate.toISOString(), // This is already in UTC
        status: formData.status,
        panel_id: formData.panel_id || null,
        attendantName: formData.attendantName,
        attendantPhone: formData.attendantPhone,
        idDocumentType: formData.idDocumentType,
        idNumber: formData.idNumber
      };
      
      console.log('Submitting form data:', apiData);
      
      await onSubmit(apiData);
    } catch (error) {
      setIsSubmitted(false);
      console.error('Form submission error:', error);
    }
  };

  useEffect(() => {
    setIsSubmitted(false);
  }, []);

  useEffect(() => {
    console.log('Patients:', patients);
    console.log('Doctors:', doctors);
    console.log('Ward beds:', wardBeds);
    console.log('Selected ward:', selectedWard);
  }, [patients, doctors, wardBeds, selectedWard]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-4">
      {/* Patient Selection */}
      {!hidePatientSelect ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Patient *</label>
          <Combobox
            options={patients}
            value={formData.patientId}
            onChange={value => setFormData(prev => ({ ...prev, patientId: value }))}
            placeholder="Select patient"
            disabled={isEditMode}
          />
        </div>
      ) : patientData && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Patient</label>
          <div className="p-2 border rounded-md">
            <div className="font-medium">{patientData.name}</div>
            <div className="text-sm text-muted-foreground">
              Contact: {patientData.contact || 'No contact'} | 
              Gender: {patientData.gender || 'Not specified'} | 
              Age: {patientData.age || 'Not specified'}
            </div>
          </div>
          <input type="hidden" name="patientId" value={patientData.id} />
        </div>
      )}

      {/* Ward and Bed Selection - Hide in edit mode */}
      {!hideWardBedFields && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ward *</label>
            <Select
              value={selectedWard}
              onValueChange={setSelectedWard}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(wardBeds).map(ward => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bed *</label>
            <Select
              value={formData.bedId}
              onValueChange={value => {
                setFormData(prev => ({ ...prev, bedId: value }))
              }}
              placeholder={selectedWard ? "Select bed" : "Select ward first"}
              disabled={!selectedWard || (selectedWard && wardBeds[selectedWard]?.length === 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedWard ? "Select bed" : "Select ward first"} />
              </SelectTrigger>
              <SelectContent>
                {selectedWard && wardBeds[selectedWard]?.map(bed => (
                  <SelectItem key={bed.value} value={bed.value}>
                    {bed.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWard && wardBeds[selectedWard]?.length === 0 && (
              <p className="text-sm text-destructive">
                No available beds in this ward
              </p>
            )}
          </div>
        </>
      )}

      {/* Doctor Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Doctor *</label>
        <SearchableSelect
          options={doctors}
          value={formData.doctorIds[0] || ''}
          onChange={(value) => {
            console.log('Selected doctor:', value);
            setFormData(prev => ({ 
              ...prev, 
              doctorIds: value ? [value] : [] 
            }));
          }}
          placeholder="Select doctor"
        />
      </div>

      {/* Admission Time - Hide in edit mode */}
      {!isEditMode && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Admission Time *</label>
          <Input
            type="datetime-local"
            value={formData.admissionTime}
            onChange={(e) => setFormData(prev => ({ ...prev, admissionTime: e.target.value }))}
            max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            required
          />
          {new Date(formData.admissionTime) > new Date() && (
            <p className="text-sm text-destructive">
              Admission time cannot be in the future
            </p>
          )}
        </div>
      )}

      {/* Status - Hide in edit mode */}
      {!hideStatusField && initialData && initialData.id && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Status *</label>
          <Select
            value={formData.status}
            onValueChange={value => setFormData(prev => ({ ...prev, status: value as Status }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admitted">Admitted</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Panel */}
      <div className="space-y-2">
        <Label>Panel *</Label>
        <Select
          value={formData.panel_id}
          onValueChange={(value) => {
            setFormData(prev => ({ 
              ...prev, 
              panel_id: value
            }))
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select panel" />
          </SelectTrigger>
          <SelectContent>
            {panels.map((panel) => (
              <SelectItem key={panel.id} value={panel.id}>
                {panel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendant Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="attendantName">Attendant Name *</Label>
          <Input
            id="attendantName"
            name="attendantName"
            value={formData.attendantName}
            onChange={(e) => setFormData(prev => ({ ...prev, attendantName: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="attendantPhone">Attendant Phone *</Label>
          <Input
            id="attendantPhone"
            name="attendantPhone"
            value={formData.attendantPhone}
            placeholder="10 digit number"
            onChange={(e) => setFormData(prev => ({ ...prev, attendantPhone: e.target.value }))}
            required
          />
        </div>
      </div>
      
      {/* ID Document Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idDocumentType">ID Document Type *</Label>
          <Select
            value={formData.idDocumentType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, idDocumentType: value }))}
            required
          >
            <SelectTrigger id="idDocumentType">
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="Aadhar">Aadhar Card</SelectItem>
              <SelectItem value="PAN">PAN Card</SelectItem>
              <SelectItem value="Voter">Voter ID</SelectItem>
              <SelectItem value="Driving">Driving License</SelectItem>
              <SelectItem value="Passport">Passport</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number {formData.idDocumentType !== 'none' && '*'}</Label>
          <Input
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
            disabled={!formData.idDocumentType || formData.idDocumentType === 'none'}
            placeholder={formData.idDocumentType && formData.idDocumentType !== 'none' ? "" : "Select ID type first"}
            required={formData.idDocumentType !== 'none'}
          />
        </div>
      </div>

      {/* Form Actions - Make sure they're always visible */}
      <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background pb-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update' : 'Admit')}
        </Button>
      </div>
    </form>
  )
} 