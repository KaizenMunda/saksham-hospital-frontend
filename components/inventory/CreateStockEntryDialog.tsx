'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UploadCloud, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Item, type StockEntryFormData } from "@/app/dashboard/inventory/types"

interface CreateStockEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockEntryFormData) => void;
  items: Item[];
}

export function CreateStockEntryDialog({ open, onOpenChange, onSubmit, items }: CreateStockEntryDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<StockEntryFormData>({
    itemId: '',
    quantity: 1,
    purchaseRate: 0,
    totalAmount: 0,
    vendor: '',
    invoiceNumber: '',
    entryDate: new Date(),
    expiryDate: undefined,
    notes: ''
  })
  
  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Selected item details
  const selectedItem = items.find(item => item.id === formData.itemId)
  
  // Handle input change
  const handleChange = (field: keyof StockEntryFormData, value: any) => {
    let updates: Partial<StockEntryFormData> = { [field]: value }
    
    // Auto-calculate total amount when quantity or purchase rate changes
    if (field === 'quantity' || field === 'purchaseRate') {
      const quantity = field === 'quantity' ? value : formData.quantity
      const purchaseRate = field === 'purchaseRate' ? value : formData.purchaseRate
      updates.totalAmount = quantity * purchaseRate
    }
    
    // Auto-fill vendor if selected item has a vendor
    if (field === 'itemId') {
      const item = items.find(item => item.id === value)
      if (item?.vendor && !formData.vendor) {
        updates.vendor = item.vendor
      }
      updates.purchaseRate = item?.purchaseRate || 0
      updates.totalAmount = (item?.purchaseRate || 0) * formData.quantity
    }
    
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should not exceed 5MB",
        variant: "destructive"
      })
      return
    }
    
    setSelectedImage(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  // Clear image
  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // Reset form
  const resetForm = () => {
    setFormData({
      itemId: '',
      quantity: 1,
      purchaseRate: 0,
      totalAmount: 0,
      vendor: '',
      invoiceNumber: '',
      entryDate: new Date(),
      expiryDate: undefined,
      notes: ''
    })
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.itemId) {
      toast({
        title: "Error",
        description: "Please select an item.",
        variant: "destructive"
      })
      return
    }
    
    if (formData.quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than zero.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // In a real app, you would upload the image to storage and get a URL
      // For this demo, we'll just use a mock URL or base64 if an image is selected
      const submissionData: StockEntryFormData = {
        ...formData,
        invoiceImage: imagePreview // In real app, this would be a URL from storage
      }
      
      await onSubmit(submissionData)
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating stock entry:", error)
      toast({
        title: "Error",
        description: "Failed to add stock entry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm()
      onOpenChange(open)
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Stock Entry</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="itemId">Item *</Label>
            <Select
              value={formData.itemId}
              onValueChange={(value) => handleChange('itemId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {items.length === 0 ? (
                  <SelectItem value="" disabled>No products found</SelectItem>
                ) : (
                  items.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.categoryName})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Quantity and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
              {selectedItem && (
                <p className="text-xs text-muted-foreground">
                  Unit: {selectedItem.unit}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseRate">Purchase Rate (₹) *</Label>
              <Input
                id="purchaseRate"
                type="number"
                value={formData.purchaseRate}
                onChange={(e) => handleChange('purchaseRate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₹)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Provider *</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleChange('vendor', e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entryDate">Entry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.entryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.entryDate ? format(formData.entryDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.entryDate}
                    onSelect={(date) => handleChange('entryDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Expiry Date (for applicable items) */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiryDate ? format(formData.expiryDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={(date) => handleChange('expiryDate', date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Optional for applicable items
            </p>
          </div>
          
          {/* Invoice Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="invoiceImage">Invoice Image</Label>
            <div className="flex items-center gap-4">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors",
                  "w-full h-32"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  id="invoiceImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Invoice Preview"
                      className="w-full h-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage()
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload invoice image
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 