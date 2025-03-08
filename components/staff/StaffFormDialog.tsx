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
import { format, parseISO } from "date-fns"
import { type StaffMember } from "@/app/dashboard/staff/types"

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
  const [phoneError, setPhoneError] = useState('')
  
  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    if (digits.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
      return false
    }
    
    setPhoneError('')
    return true
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get the form data
    const formData = new FormData(e.target as HTMLFormElement)
    const phone = formData.get('phone') as string
    
    // Validate phone number
    if (!validatePhone(phone)) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: staff ? "Staff Updated" : "Staff Added",
        description: `Staff has been ${staff ? "updated" : "added"} successfully.`
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "There was a problem saving the staff information.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    defaultValue={staff?.name} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="status" 
                      name="status"
                      defaultChecked={staff?.status !== 'inactive'} 
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={staff?.role} name="role">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
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
                  <Select defaultValue={staff?.department} name="department">
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
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input 
                    id="joinDate" 
                    name="joinDate"
                    type="date" 
                    defaultValue={staff?.joinDate ? format(staff.joinDate, 'yyyy-MM-dd') : undefined} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    defaultValue={staff?.email} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    defaultValue={staff?.phone} 
                    required 
                    onChange={(e) => {
                      // Clear error when user types
                      if (phoneError) setPhoneError('')
                    }}
                  />
                  {phoneError && (
                    <p className="text-sm text-destructive">{phoneError}</p>
                  )}
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    name="address"
                    defaultValue={staff?.address} 
                    rows={3} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input 
                    id="emergencyContact" 
                    name="emergencyContact"
                    defaultValue={staff?.emergencyContact} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="professional" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    name="specialization"
                    defaultValue={staff?.specialization} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea 
                    id="qualifications" 
                    name="qualifications"
                    defaultValue={staff?.qualifications?.join(', ')} 
                    rows={3} 
                    placeholder="Enter qualifications separated by commas" 
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
            <Button type="submit" disabled={isSubmitting || !!phoneError}>
              {isSubmitting ? 'Saving...' : staff ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 