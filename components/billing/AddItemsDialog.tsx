'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Minus, X, Search } from "lucide-react"
import { MOCK_ITEMS, MOCK_CATEGORIES, InventoryItem } from "@/app/dashboard/inventory/types"
import { InvoiceItem } from "@/app/dashboard/billing/types"

// Type for selected items which matches InvoiceItem structure (without id/invoiceId)
type SelectedItem = Omit<InvoiceItem, 'id' | 'invoiceId'>;

interface AddItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItems: (items: SelectedItem[]) => void
}

export function AddItemsDialog({ open, onOpenChange, onAddItems }: AddItemsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  // Filter items based on search query and category
  const filteredItems = MOCK_ITEMS
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(item => 
      // Show all items if 'all' is selected or no category is selected
      !selectedCategory || 
      selectedCategory === 'all' || 
      item.type.toLowerCase() === selectedCategory.toLowerCase()
    )

  // Handle quantity change for an item
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or negative, remove the item
      setSelectedItems(prev => prev.filter(item => item.itemId !== itemId))
      return
    }

    // Check if item is already selected
    const itemIndex = selectedItems.findIndex(item => item.itemId === itemId)
    
    if (itemIndex >= 0) {
      // Update existing item
      const updatedItems = [...selectedItems]
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: newQuantity,
        amount: newQuantity * updatedItems[itemIndex].unitPrice
      }
      setSelectedItems(updatedItems)
    }
  }

  // Handle adding an item to the selection
  const handleAddItem = (item: InventoryItem) => {
    // Check if item is already selected
    const existingItem = selectedItems.find(i => i.itemId === item.id)
    
    if (existingItem) {
      // Increment quantity
      handleQuantityChange(item.id, existingItem.quantity + 1)
    } else {
      // Add new item with the correct type
      setSelectedItems(prev => [...prev, {
        itemId: item.id,
        name: item.name,
        description: item.description,
        // Ensure type is compatible with InvoiceItem
        type: item.type as 'Medication' | 'Supply' | 'Equipment',
        quantity: 1,
        unit: item.unit,
        unitPrice: item.sellingPrice,
        amount: item.sellingPrice
      }])
    }
  }

  // Handle removing an item from the selection
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.itemId !== itemId))
  }

  // Calculate total amount
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0)

  // Handle done button click
  const handleDone = () => {
    onAddItems(selectedItems)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 mb-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Items"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <Select
            value={selectedCategory || undefined}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="Supply">Supply</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Create new item button */}
          <Button variant="outline" className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Create New Item
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ITEM NAME</TableHead>
                <TableHead>ITEM CODE</TableHead>
                <TableHead>SALES PRICE</TableHead>
                <TableHead>PURCHASE PRICE</TableHead>
                <TableHead>CURRENT STOCK</TableHead>
                <TableHead>QUANTITY</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No items found. Try a different search term or category.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map(item => {
                  const isSelected = selectedItems.some(i => i.itemId === item.id)
                  const selectedItem = isSelected ? selectedItems.find(i => i.itemId === item.id) : null
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>₹ {item.sellingPrice}</TableCell>
                      <TableCell>₹ {item.costPrice || '-'}</TableCell>
                      <TableCell>{item.quantity || '-'}</TableCell>
                      <TableCell>
                        {isSelected && selectedItem ? (
                          <div className="flex items-center gap-2">
                            <Button 
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, selectedItem.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {selectedItem.quantity}
                            </span>
                            <Button 
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, selectedItem.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 ml-2"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleAddItem(item)}
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            + Add
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="text-sm text-blue-600 mb-2">
            {selectedItems.length > 0 
              ? `Show ${selectedItems.length} ${selectedItems.length === 1 ? 'Item' : 'Items'} Selected` 
              : 'No items selected'}
          </div>
          <div className="flex justify-between items-center">
            <div className="font-medium">
              Total Amount: <span className="text-lg">₹ {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDone}
                disabled={selectedItems.length === 0}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 