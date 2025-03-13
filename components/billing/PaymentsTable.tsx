'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, FileText, Printer, ArrowUpRight, Eye } from "lucide-react"
import { format } from "date-fns"
import { type PaymentRecord } from "@/app/dashboard/billing/types"

interface PaymentsTableProps {
  payments: PaymentRecord[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  // Helper function to get payment method badge
  const getPaymentMethodBadge = (method: PaymentRecord['paymentMethod']) => {
    switch (method) {
      case 'cash':
        return <Badge variant="outline" className="text-green-500 border-green-500">Cash</Badge>
      case 'credit_card':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Credit Card</Badge>
      case 'debit_card':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">Debit Card</Badge>
      case 'bank_transfer':
        return <Badge variant="outline" className="text-teal-500 border-teal-500">Bank Transfer</Badge>
      case 'online_payment':
        return <Badge variant="outline" className="text-indigo-500 border-indigo-500">Online</Badge>
      case 'insurance':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Insurance</Badge>
      case 'other':
        return <Badge variant="outline">Other</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment #</TableHead>
            <TableHead>Invoice #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal"
                    onClick={() => window.open(`/dashboard/billing/invoices/${payment.invoiceId}`, '_blank')}
                  >
                    {payment.invoiceNumber}
                  </Button>
                </TableCell>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell>{format(new Date(payment.dateReceived), 'dd/MM/yyyy')}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => window.open(`/dashboard/billing/payments/${payment.id}`, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/dashboard/billing/payments/${payment.id}/print`, '_blank')}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open(`/dashboard/billing/invoices/${payment.invoiceId}`, '_blank')}>
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 