'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { type CategoryFormData } from "@/app/dashboard/inventory/types"

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
}

export function CreateCategoryDialog({ open, onOpenChange, onSubmit }: CreateCategoryDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    type: 'product',
    isActive: true
  })
  
  // Handle input change
  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a category name.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setFormData({
        name: '',
        description: '',
        type: 'product',
        isActive: true
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Type */}
          <div className="space-y-2">
            <Label>Category Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.type === 'product' ? 'default' : 'outline'}
                onClick={() => handleChange('type', 'product')}
                className="flex-1"
              >
                Product
              </Button>
              <Button
                type="button"
                variant={formData.type === 'service' ? 'default' : 'outline'}
                onClick={() => handleChange('type', 'service')}
                className="flex-1"
              >
                Service
              </Button>
            </div>
          </div>
          
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
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
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 