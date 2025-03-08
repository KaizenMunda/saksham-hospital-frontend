'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function IPDAppointmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">IPD Appointments</h1>
        <p className="text-muted-foreground">
          Manage inpatient department appointments
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>IPD Appointments</CardTitle>
          <CardDescription>
            View and manage all inpatient appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Your IPD appointments content here */}
          <p>IPD appointments content will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  )
} 