'use client'

import { useState } from 'react'
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Expense, ExpenseCategory } from '@/app/dashboard/finance/expenses/types'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseDetails } from './ExpenseDetails'
import { format } from 'date-fns'
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ExpensesListProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
  isLoading: boolean
  onExpenseUpdated: () => void
}

export function ExpensesList({ 
  expenses, 
  categories, 
  isLoading, 
  onExpenseUpdated 
}: ExpensesListProps) {
  const { toast } = useToast()
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/finance/expenses/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }
      
      onExpenseUpdated()
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting expense:', error)
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      })
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
  
  if (isLoading) {
    return <div>Loading expenses...</div>
  }
  
  if (expenses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No expenses found for the selected filters.</div>
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {expense.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell>{expense.paymentMethod || '-'}</TableCell>
                <TableCell>
                  {expense.receiptUrl ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.open(expense.receiptUrl, '_blank')}
                    >
                      View
                    </Button>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewingExpense(expense)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingExpense(expense)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={viewingExpense !== null} onOpenChange={(open) => !open && setViewingExpense(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {viewingExpense && (
            <ExpenseDetails expense={viewingExpense} />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={editingExpense !== null} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {editingExpense && (
            <ExpenseForm 
              expense={editingExpense}
              categories={categories}
              onSuccess={() => {
                onExpenseUpdated()
                setEditingExpense(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 