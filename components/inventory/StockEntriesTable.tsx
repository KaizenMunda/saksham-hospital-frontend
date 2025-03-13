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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { MoreHorizontal, Eye, FileImage, Edit, Trash, Calendar } from "lucide-react"
import { format } from "date-fns"
import { type StockEntry } from "@/app/dashboard/inventory/types"

interface StockEntriesTableProps {
  stockEntries: StockEntry[];
}

export function StockEntriesTable({ stockEntries }: StockEntriesTableProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  
  // Helper function to format the date
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }
  
  // Mock image for demo purposes
  const mockInvoiceImage = 'https://images.unsplash.com/photo-1651142693820-986006497614'
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Purchase Rate</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Entry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No stock entries found.
                </TableCell>
              </TableRow>
            ) : (
              stockEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.itemName}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{getUnitFromItemId(entry.itemId)}</TableCell>
                  <TableCell className="text-right">₹{entry.purchaseRate.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{entry.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{entry.invoiceNumber}</TableCell>
                  <TableCell>{formatDate(entry.entryDate)}</TableCell>
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
                        <DropdownMenuItem onClick={() => setSelectedImageUrl(entry.invoiceImage || mockInvoiceImage)}>
                          <FileImage className="mr-2 h-4 w-4" />
                          View Invoice Image
                        </DropdownMenuItem>
                        
                        {entry.expiryDate && (
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Expires: {formatDate(entry.expiryDate)}
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Entry
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Entry
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
      
      {/* Invoice Image Preview Dialog */}
      <Dialog open={!!selectedImageUrl} onOpenChange={(open) => !open && setSelectedImageUrl(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice Image</DialogTitle>
          </DialogHeader>
          {selectedImageUrl && (
            <div className="flex justify-center">
              <img
                src={selectedImageUrl}
                alt="Invoice"
                className="max-h-[500px] object-contain rounded-md border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to get unit from item ID (in a real app, this would fetch from your items list)
function getUnitFromItemId(itemId: string): string {
  const unitMap: Record<string, string> = {
    'PRD001': 'strip',
    'PRD002': 'box',
    // Add more mappings as needed
  }
  
  return unitMap[itemId] || 'unit'
} 