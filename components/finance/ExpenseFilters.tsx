'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ExpenseCategory, ExpenseFilterOptions, ExpensePeriod } from '@/app/finance/expenses/types'
import { format } from 'date-fns'

interface ExpenseFiltersProps {
  filterOptions: ExpenseFilterOptions
  categories: ExpenseCategory[]
  onFilterChange: (filters: Partial<ExpenseFilterOptions>) => void
  onPeriodChange: (period: ExpensePeriod) => void
}

export function ExpenseFilters({
  filterOptions,
  categories,
  onFilterChange,
  onPeriodChange
}: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filterOptions.categoryIds || []
  )
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newSelectedCategories: string[]
    
    if (checked) {
      newSelectedCategories = [...selectedCategories, categoryId]
    } else {
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId)
    }
    
    setSelectedCategories(newSelectedCategories)
    onFilterChange({ categoryIds: newSelectedCategories.length > 0 ? newSelectedCategories : undefined })
  }
  
  const handlePeriodChange = (period: ExpensePeriod) => {
    onPeriodChange(period)
  }
  
  const handleAmountChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined
    onFilterChange({
      [type === 'min' ? 'minAmount' : 'maxAmount']: numValue
    })
  }
  
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    onFilterChange({
      [type === 'start' ? 'startDate' : 'endDate']: value || undefined
    })
  }
  
  const clearFilters = () => {
    setSelectedCategories([])
    onFilterChange({
      categoryIds: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      startDate: undefined,
      endDate: undefined
    })
    onPeriodChange('month')
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button 
                variant={filterOptions.period === 'today' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('today')}
              >
                Today
              </Button>
              <Button 
                variant={filterOptions.period === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('week')}
              >
                This Week
              </Button>
              <Button 
                variant={filterOptions.period === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('month')}
              >
                This Month
              </Button>
              <Button 
                variant={filterOptions.period === 'quarter' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('quarter')}
              >
                This Quarter
              </Button>
              <Button 
                variant={filterOptions.period === 'year' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('year')}
              >
                This Year
              </Button>
              <Button 
                variant={filterOptions.period === 'custom' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handlePeriodChange('custom')}
              >
                Custom
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Filters' : 'More Filters'}
            </Button>
          </div>
          
          {filterOptions.period === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  value={filterOptions.startDate || ''} 
                  onChange={(e) => handleDateChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  value={filterOptions.endDate || ''} 
                  onChange={(e) => handleDateChange('end', e.target.value)}
                />
              </div>
            </div>
          )}
          
          {isExpanded && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount">Min Amount (₹)</Label>
                  <Input 
                    id="minAmount" 
                    type="number" 
                    placeholder="Min amount" 
                    value={filterOptions.minAmount || ''} 
                    onChange={(e) => handleAmountChange('min', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount">Max Amount (₹)</Label>
                  <Input 
                    id="maxAmount" 
                    type="number" 
                    placeholder="Max amount" 
                    value={filterOptions.maxAmount || ''} 
                    onChange={(e) => handleAmountChange('max', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Categories</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 