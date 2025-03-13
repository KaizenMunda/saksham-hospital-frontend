'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { type PaymentFormData, type Invoice } from "@/app/dashboard/billing/types"

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentFormData) => void;
  invoices: Invoice[];
}

export function CreatePaymentDialog({ open, onOpenChange, onSubmit, invoices }: CreatePaymentDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceId: '',
    invoiceNumber: '',
    patientId: '',
    patientName: '',
    dateReceived: new Date(),
    amount: 0,
    paymentMethod: 'cash',
    referenceNumber: '',
    notes: ''
  })
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      setFormData({
        invoiceId: '',
        invoiceNumber: '',
        patientId: '',
        patientName: '',
        dateReceived: new Date(),
        amount: 0,
        paymentMethod: 'cash',
        referenceNumber: '',
        notes: ''
      })
      setSelectedInvoice(null)
    }
  }, [open])
  
  // Handle invoice selection
  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    
    if (!invoice) return
    
    setSelectedInvoice(invoice)
    setFormData(prev => ({
      ...prev,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      patientId: invoice.patientId,
      patientName: invoice.patientName,
      amount: invoice.balance // Default to the full remaining balance
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInvoice) {
      toast({
        title: "Error",
        description: "Please select an invoice.",
        variant: "destructive"
      })
      return
    }
    
    if (formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Payment amount must be greater than zero.",
        variant: "destructive"
      })
      return
    }
    
    if (formData.amount > selectedInvoice.balance) {
      toast({
        title: "Error",
        description: "Payment amount cannot exceed the invoice balance.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating payment:", error)
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Selection */}
          <div className="space-y-2">
            <Label htmlFor="invoice">Invoice</Label>
            <Select 
              value={formData.invoiceId} 
              onValueChange={handleInvoiceChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an invoice" />
              </SelectTrigger>
              <SelectContent>
                {invoices.length === 0 ? (
                  <SelectItem value="" disabled>No pending invoices found</SelectItem>
                ) : (
                  invoices.map(invoice => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {invoice.patientName} (₹{invoice.balance})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedInvoice && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Invoice Details</CardTitle>
                <CardDescription>
                  {selectedInvoice.invoiceNumber} - {selectedInvoice.patientName}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 space-y-0">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <span>{format(new Date(selectedInvoice.dateCreated), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span>₹{selectedInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">Amount Paid:</span>
                  <span>₹{selectedInvoice.amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium py-1">
                  <span>Balance Due:</span>
                  <span>₹{selectedInvoice.balance.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateReceived">Payment Date</Label>
              <Input 
                id="dateReceived" 
                type="date" 
                value={format(formData.dateReceived, 'yyyy-MM-dd')}
                onChange={(e) => {
                  if (!e.target.value) return
                  setFormData(prev => ({
                    ...prev,
                    dateReceived: new Date(e.target.value)
                  }))
                }}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={formData.amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  setFormData(prev => ({
                    ...prev,
                    amount: isNaN(value) ? 0 : value
                  }))
                }}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value: PaymentFormData['paymentMethod']) => 
                  setFormData(prev => ({ ...prev, paymentMethod: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input 
                id="referenceNumber" 
                placeholder="Transaction ID, Check #, etc."
                value={formData.referenceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Payment notes..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedInvoice}>
              {isSubmitting ? 'Processing...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 