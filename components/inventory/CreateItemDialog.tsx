'use client'

import { useState, useEffect } from 'react'
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
import { Switch } from "@/components/ui/switch"
import { ItemCategory, type ItemFormData } from "@/app/dashboard/inventory/types"

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ItemFormData) => void;
  categories: ItemCategory[];
}

const UNITS = ['piece', 'box', 'strip', 'tablet', 'bottle', 'vial', 'ampule', 'packet', 'bag', 'test', 'procedure', 'session', 'consultation', 'scan', 'x-ray', 'hour', 'day', 'week', 'month']

export function CreateItemDialog({ open, onOpenChange, onSubmit, categories }: CreateItemDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Product/Service type
  const [itemType, setItemType] = useState<'product' | 'service'>('product')
  
  // Form state
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    categoryId: '',
    type: 'product',
    purchaseRate: 0,
    sellingPrice: 0,
    vendor: '',
    unit: '',
    minimumStock: 0,
    isActive: true
  })
  
  // Filter categories based on selected type
  const filteredCategories = categories.filter(category => category.type === itemType)
  
  // Reset form when dialog is opened or type changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        type: itemType,
        purchaseRate: 0,
        sellingPrice: 0,
        vendor: '',
        unit: '',
        minimumStock: itemType === 'product' ? 5 : undefined, // Default minimum stock for products
        isActive: true
      })
    }
  }, [open, itemType])
  
  // Handle input change
  const handleChange = (field: keyof ItemFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.categoryId || !formData.unit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }
    
    if (formData.sellingPrice <= 0) {
      toast({
        title: "Error",
        description: "Selling price must be greater than zero.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating item:", error)
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
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
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Type Selector */}
          <div className="space-y-2">
            <Label>Item Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={itemType === 'product' ? 'default' : 'outline'}
                onClick={() => setItemType('product')}
                className="flex-1"
              >
                Product
              </Button>
              <Button
                type="button"
                variant={itemType === 'service' ? 'default' : 'outline'}
                onClick={() => setItemType('service')}
                className="flex-1"
              >
                Service
              </Button>
            </div>
          </div>
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange('categoryId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <SelectItem value="" disabled>No categories found</SelectItem>
                  ) : (
                    filteredCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleChange('unit', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor/Provider</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => handleChange('vendor', e.target.value)}
              />
            </div>
          </div>
          
          {/* Pricing Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseRate">Purchase Rate (₹)</Label>
              <Input
                id="purchaseRate"
                type="number"
                value={formData.purchaseRate || ''}
                onChange={(e) => handleChange('purchaseRate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (₹) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={formData.sellingPrice || ''}
                onChange={(e) => handleChange('sellingPrice', parseFloat(e.target.value) || 0)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
          
          {/* Product-specific Fields */}
          {itemType === 'product' && (
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock Level</Label>
              <Input
                id="minimumStock"
                type="number"
                value={formData.minimumStock || ''}
                onChange={(e) => handleChange('minimumStock', parseInt(e.target.value) || 0)}
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                System will alert when stock falls below this level
              </p>
            </div>
          )}
          
          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 