'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STAFF_ROLES, DEPARTMENTS } from "@/app/dashboard/staff/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { type StaffMember } from "@/app/dashboard/staff/types"
import { FileUpload } from "@/components/ui/file-upload"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Dummy Options
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const KYC_DOCUMENTS = ["Aadhar Card", "Passport", "Driving License", "Voter ID", "PAN Card"];
const QUALIFICATIONS = ["MBBS", "MD", "MS", "BDS", "BAMS", "BHMS", "B.Sc Nursing", "GNM", "B.Pharm", "M.Pharm", "Other"];
const SALARY_TYPES = ["Monthly", "Hourly", "Contract", "Performance-based"];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda"];

interface StaffFormDialogProps {
  staff?: StaffMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function StaffFormDialog({ 
  staff, 
  open, 
  onOpenChange,
  onSuccess
}: StaffFormDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // Custom validation functions
  const validateField = (field: string, value: string | undefined): boolean => {
    if (!value) return true; // Empty validation handled by required attribute
    
    switch (field) {
      case 'aadhaar':
        // 12 digit numeric
        if (!/^\d{12}$/.test(value)) {
          setValidationErrors(prev => ({ ...prev, aadhaar: 'Aadhaar must be exactly 12 digits' }));
          return false;
        }
        break;
      case 'mobile':
        // Exactly 10 digit numeric
        if (!/^\d{10}$/.test(value)) {
          setValidationErrors(prev => ({ ...prev, mobile: 'Mobile number must be exactly 10 digits' }));
          return false;
        }
        break;
      case 'email':
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
          return false;
        }
        break;
      case 'dob':
      case 'joinDate':
        // Date validation - must not be in the future
        const date = new Date(value);
        const today = new Date();
        if (date > today) {
          setValidationErrors(prev => ({ 
            ...prev, 
            [field]: `${field === 'dob' ? 'Date of birth' : 'Join date'} cannot be in the future` 
          }));
          return false;
        }
        break;
    }
    
    // Clear any previous error for this field
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Get the form data
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Perform validations
    let isValid = true;
    
    isValid = validateField('aadhaar', formData.get('aadhaar') as string) && isValid;
    isValid = validateField('mobile', formData.get('mobile') as string) && isValid;
    isValid = validateField('email', formData.get('email') as string) && isValid;
    isValid = validateField('dob', formData.get('dob') as string) && isValid;
    isValid = validateField('joinDate', formData.get('joinDate') as string) && isValid;
    
    if (!isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: staff ? "Staff Updated" : "Staff Added",
        description: `Staff has been ${staff ? "updated" : "added"} successfully.`
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the staff information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate a default employee code
  const defaultEmployeeCode = staff?.id || `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Default date values
  const today = new Date();
  const defaultDob = staff?.dob || new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
  const defaultJoinDate = staff?.joinDate || today;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="identification">Identification</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCode">Employee Code</Label>
                  <Input 
                    id="employeeCode" 
                    name="employeeCode"
                    defaultValue={defaultEmployeeCode} 
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground">Auto generated code</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    defaultValue={staff?.name || "John Doe"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input 
                    id="fatherName" 
                    name="fatherName"
                    defaultValue={staff?.fatherName || "Richard Doe"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    name="dob"
                    type="date" 
                    defaultValue={format(defaultDob, 'yyyy-MM-dd')} 
                    required
                    max={format(today, 'yyyy-MM-dd')}
                    onChange={(e) => validateField('dob', e.target.value)}
                  />
                  {validationErrors.dob && (
                    <p className="text-sm text-destructive">{validationErrors.dob}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Date of Joining</Label>
                  <Input 
                    id="joinDate" 
                    name="joinDate"
                    type="date" 
                    defaultValue={format(defaultJoinDate, 'yyyy-MM-dd')} 
                    required
                    max={format(today, 'yyyy-MM-dd')}
                    onChange={(e) => validateField('joinDate', e.target.value)}
                  />
                  {validationErrors.joinDate && (
                    <p className="text-sm text-destructive">{validationErrors.joinDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select defaultValue={staff?.bloodGroup || BLOOD_GROUPS[0]} name="bloodGroup" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map(group => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <RadioGroup defaultValue={staff?.gender || "male"} name="gender" className="flex space-x-4 pt-2">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="active">Active</Label>
                  <RadioGroup defaultValue={staff?.active !== false ? "yes" : "no"} name="active" className="flex space-x-4 pt-2">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="yes" id="active-yes" />
                      <Label htmlFor="active-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="no" id="active-no" />
                      <Label htmlFor="active-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TabsContent>
            
            {/* Identification Tab */}
            <TabsContent value="identification" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar</Label>
                  <Input 
                    id="aadhaar" 
                    name="aadhaar"
                    defaultValue={staff?.aadhaar || "123456789012"} 
                    required 
                    onChange={(e) => validateField('aadhaar', e.target.value)}
                  />
                  {validationErrors.aadhaar && (
                    <p className="text-sm text-destructive">{validationErrors.aadhaar}</p>
                  )}
                  <p className="text-xs text-muted-foreground">12-digit numeric</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    name="mobile"
                    defaultValue={staff?.mobile || "9876543210"} 
                    required 
                    onChange={(e) => validateField('mobile', e.target.value)}
                  />
                  {validationErrors.mobile && (
                    <p className="text-sm text-destructive">{validationErrors.mobile}</p>
                  )}
                  <p className="text-xs text-muted-foreground">10-digit mobile number</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email ID</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    defaultValue={staff?.email || "staff@example.com"} 
                    required 
                    onChange={(e) => validateField('email', e.target.value)}
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-destructive">{validationErrors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    name="address"
                    defaultValue={staff?.address || "123 Main St, City, State, 123456"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Photo</Label>
                  <FileUpload 
                    id="photo" 
                    name="photo" 
                    accept="image/*" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signature">Upload Signature</Label>
                  <FileUpload 
                    id="signature" 
                    name="signature" 
                    accept="image/*"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="idProof">Upload ID</Label>
                  <FileUpload 
                    id="idProof" 
                    name="idProof" 
                    accept="image/*" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kycNumber">KYC Number</Label>
                  <Input 
                    id="kycNumber" 
                    name="kycNumber"
                    defaultValue={staff?.kycNumber || "KYC12345678"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="kycDocument">KYC Document</Label>
                  <Select defaultValue={staff?.kycDocument || KYC_DOCUMENTS[0]} name="kycDocument" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select KYC document" />
                    </SelectTrigger>
                    <SelectContent>
                      {KYC_DOCUMENTS.map(doc => (
                        <SelectItem key={doc} value={doc}>
                          {doc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Professional Tab */}
            <TabsContent value="professional" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Select defaultValue={staff?.designation || STAFF_ROLES[0].value} name="designation" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue={staff?.department || DEPARTMENTS[0].value} name="department" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <FileUpload 
                    id="resume" 
                    name="resume" 
                    accept=".pdf,.doc,.docx" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dutyHours">Duty Hours</Label>
                  <Input 
                    id="dutyHours" 
                    name="dutyHours"
                    defaultValue={staff?.dutyHours || "9 AM - 5 PM"} 
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Select defaultValue={staff?.qualification || QUALIFICATIONS[0]} name="qualification" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALIFICATIONS.map(qual => (
                        <SelectItem key={qual} value={qual}>
                          {qual}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select defaultValue={staff?.salaryType || SALARY_TYPES[0]} name="salaryType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salaryAmount">Salary Amount</Label>
                  <Input 
                    id="salaryAmount" 
                    name="salaryAmount"
                    type="number"
                    defaultValue={staff?.salaryAmount || "50000"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pfUan">PF UAN</Label>
                  <Input 
                    id="pfUan" 
                    name="pfUan"
                    defaultValue={staff?.pfUan || "100123456789"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input 
                    id="pan" 
                    name="pan"
                    defaultValue={staff?.pan || "ABCDE1234F"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input 
                    id="salary" 
                    name="salary"
                    type="number"
                    defaultValue={staff?.salary || "50000"} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select defaultValue={staff?.bankName || BANKS[0]} name="bankName" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map(bank => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    name="accountNumber"
                    type="number"
                    defaultValue={staff?.accountNumber || "123456789012"} 
                    required 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (staff ? "Update" : "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 