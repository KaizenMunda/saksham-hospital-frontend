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
import { MoreHorizontal, FileText, Printer, CreditCard, Trash, Eye } from "lucide-react"
import { format } from "date-fns"
import { type Invoice } from "@/app/dashboard/billing/types"

interface InvoicesTableProps {
  invoices: Invoice[];
  onCreatePayment: (invoice: Invoice) => void;
}

export function InvoicesTable({ invoices, onCreatePayment }: InvoicesTableProps) {
  // Helper function to get the status badge color
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Pending</Badge>
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="text-slate-500 border-slate-500">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.patientName}</TableCell>
                <TableCell>{format(new Date(invoice.dateCreated), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy')}</TableCell>
                <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                      <DropdownMenuItem onClick={() => window.open(`/dashboard/billing/invoices/${invoice.id}`, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/dashboard/billing/invoices/${invoice.id}/print`, '_blank')}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                        <DropdownMenuItem onClick={() => onCreatePayment(invoice)}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Record Payment
                        </DropdownMenuItem>
                      )}
                      {invoice.status === 'draft' && (
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Finalize Invoice
                        </DropdownMenuItem>
                      )}
                      {(invoice.status === 'draft' || invoice.status === 'pending') && (
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Invoice
                        </DropdownMenuItem>
                      )}
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