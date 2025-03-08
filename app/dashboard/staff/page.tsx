'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Search, Plus, UserCog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { useRole } from '@/contexts/role-context'
import { StaffFormDialog } from '@/components/staff/StaffFormDialog'
import { StaffTable } from '@/components/staff/StaffTable'
import { type StaffMember } from './types'

// Mock staff data
const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    role: 'doctor',
    department: 'cardiology',
    joinDate: new Date('2020-03-15'),
    status: 'active',
    specialization: 'Interventional Cardiology'
  },
  {
    id: '2',
    name: 'Nurse Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91 98765 43211',
    role: 'nurse',
    department: 'icu',
    joinDate: new Date('2021-06-10'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91 98765 43212',
    role: 'receptionist',
    department: 'administration',
    joinDate: new Date('2022-01-05'),
    status: 'active'
  }
];

export default function StaffPage() {
  const { hasPermission } = useRole()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff)
    setIsDialogOpen(true)
  }
  
  const handleDelete = async (staff: StaffMember) => {
    if (!confirm(`Are you sure you want to delete ${staff.name}?`)) {
      return
    }
    
    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    })
  }
  
  const filteredStaff = MOCK_STAFF.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {hasPermission('manage_staff') && (
            <Button onClick={() => {
              setEditingStaff(undefined)
              setIsDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>
            View and manage all staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffTable
            staff={filteredStaff}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      
      <StaffFormDialog
        staff={editingStaff}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingStaff(undefined)
        }}
        onSuccess={() => {
          toast({
            title: "Success",
            description: editingStaff ? "Staff updated successfully" : "Staff added successfully",
          })
        }}
      />
    </div>
  )
} 