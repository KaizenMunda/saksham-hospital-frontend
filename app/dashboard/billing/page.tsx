'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CreditCard, Receipt, Search, Download, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InvoicesTable } from "@/components/billing/InvoicesTable"
import { PaymentsTable } from "@/components/billing/PaymentsTable"
import { CreatePaymentDialog } from "@/components/billing/CreatePaymentDialog"
import { MOCK_INVOICES, MOCK_PAYMENTS } from "./types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function BillingPage() {
  const router = useRouter()
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('')
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('')
  const [invoices, setInvoices] = useState(MOCK_INVOICES)
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  
  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    invoice.patientName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    invoice.status.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
  )
  
  // Filter payments based on search query
  const filteredPayments = payments.filter(payment =>
    payment.paymentNumber.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
    payment.patientName.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
    payment.invoiceNumber.toLowerCase().includes(paymentSearchQuery.toLowerCase())
  )
  
  // Calculate statistics
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalPaidAmount = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0)
  const totalOutstandingAmount = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)
  const overdueInvoices = invoices.filter(invoice => 
    invoice.status === 'overdue' || 
    (invoice.status === 'pending' && new Date(invoice.dueDate) < new Date())
  )
  
  const handleAddInvoice = (newInvoice) => {
    setInvoices(prev => [...prev, {
      ...newInvoice,
      id: `${invoices.length + 1}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, '0')}`
    }])
  }
  
  const handleAddPayment = (newPayment) => {
    setPayments(prev => [...prev, {
      ...newPayment,
      id: `${payments.length + 1}`,
      paymentNumber: `PAY-${new Date().getFullYear()}-${(payments.length + 1).toString().padStart(4, '0')}`
    }])
    
    // Update invoice amount paid
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === newPayment.invoiceId) {
        const newAmountPaid = invoice.amountPaid + newPayment.amount
        return {
          ...invoice,
          amountPaid: newAmountPaid,
          balance: invoice.total - newAmountPaid,
          status: newAmountPaid >= invoice.total ? 'paid' : 'pending'
        }
      }
      return invoice
    }))
    
    setPaymentDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">
            Manage patient billing and payments
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvoiceAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length} payment{payments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOutstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter(i => i.balance > 0).length} pending invoice{invoices.filter(i => i.balance > 0).length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''}
            </div>
            <p className="text-xs text-muted-foreground">
              ₹{overdueInvoices.reduce((sum, invoice) => sum + invoice.balance, 0).toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Invoices</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-8"
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setInvoiceSearchQuery('')}>All</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setInvoiceSearchQuery('paid')}>Paid</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setInvoiceSearchQuery('pending')}>Pending</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setInvoiceSearchQuery('overdue')}>Overdue</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => router.push('/dashboard/billing/create')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Invoice
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage and create invoices for patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoicesTable 
                invoices={filteredInvoices} 
                onCreatePayment={(invoice) => {
                  // Pre-fill payment dialog with invoice details
                  setPaymentDialogOpen(true)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Payments</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments..."
                      className="pl-8"
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setPaymentDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Payment
                  </Button>
                </div>
              </div>
              <CardDescription>
                Record and manage payments received from patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable payments={filteredPayments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs - only keep payment dialog */}
      <CreatePaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSubmit={handleAddPayment}
        invoices={invoices.filter(invoice => invoice.balance > 0)}
      />
    </div>
  )
} 