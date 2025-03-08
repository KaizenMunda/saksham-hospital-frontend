'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StaffFormDialog } from '@/components/staff/StaffFormDialog'

export default function SimpleStaffPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Staff Management</h1>
      
      <Button onClick={() => setIsDialogOpen(true)}>
        Add New Staff
      </Button>
      
      <StaffFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          console.log('Staff created successfully')
        }}
      />
    </div>
  )
} 