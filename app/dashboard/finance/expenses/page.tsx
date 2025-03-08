'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { ExpenseFilterOptions, ExpensePeriod } from './types'
import { useExpenses } from '@/hooks/useExpenses'
import { useExpenseCategories } from '@/hooks/useExpenseCategories'
import { ExpensesList } from '@/components/finance/ExpensesList'
import { ExpenseForm } from '@/components/finance/ExpenseForm'
import { ExpenseCategoryForm } from '@/components/finance/ExpenseCategoryForm'
import { ExpenseFilters } from '@/components/finance/ExpenseFilters'
import { ExpenseSummary } from '@/components/finance/ExpenseSummary'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export default function ExpensesPage() {
  const { toast } = useToast()
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'summary'>('list')
  
  const [filterOptions, setFilterOptions] = useState<ExpenseFilterOptions>({
    period: 'month',
  })
  
  const { expenses, isLoading, mutate } = useExpenses(filterOptions)
  const { categories, mutate: mutateCategories } = useExpenseCategories()
  
  const handlePeriodChange = (period: ExpensePeriod) => {
    setFilterOptions(prev => ({
      ...prev,
      period,
      // Reset custom dates if not custom period
      startDate: period === 'custom' ? prev.startDate : undefined,
      endDate: period === 'custom' ? prev.endDate : undefined
    }))
  }
  
  const handleFilterChange = (newFilters: Partial<ExpenseFilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...newFilters
    }))
  }
  
  const handleExpenseAdded = async () => {
    await mutate()
    setIsExpenseDialogOpen(false)
    toast({
      title: "Success",
      description: "Expense added successfully",
    })
  }
  
  const handleCategoryAdded = async () => {
    await mutateCategories()
    setIsCategoryDialogOpen(false)
    toast({
      title: "Success",
      description: "Category added successfully",
    })
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expense Management</h1>
        <div className="flex gap-2 items-center">
          <Button 
            onClick={() => setIsExpenseDialogOpen(true)}
            className="bg-accent text-white hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Expense
          </Button>
          
          <Button 
            onClick={() => setIsCategoryDialogOpen(true)}
            className="bg-accent text-white hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        </div>
      </div>
      
      <ExpenseFilters 
        filterOptions={filterOptions}
        categories={categories}
        onFilterChange={handleFilterChange}
        onPeriodChange={handlePeriodChange}
      />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'summary')} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Expenses List</TabsTrigger>
          <TabsTrigger value="summary">Summary & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesList 
                expenses={expenses} 
                isLoading={isLoading} 
                categories={categories}
                onExpenseUpdated={() => mutate()}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary">
          <ExpenseSummary expenses={expenses} categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 