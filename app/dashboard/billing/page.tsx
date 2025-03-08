'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage patient billing and payments
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>
            View and manage billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <CreditCard className="h-16 w-16 mr-4" />
            <span>Billing content will be displayed here</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 