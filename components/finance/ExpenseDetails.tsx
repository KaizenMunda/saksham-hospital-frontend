'use client'

import { Expense } from '@/app/finance/expenses/types'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Image } from 'lucide-react'

interface ExpenseDetailsProps {
  expense: Expense
}

export function ExpenseDetails({ expense }: ExpenseDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy')
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{expense.title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline">
            {expense.category?.name || 'Uncategorized'}
          </Badge>
          <span className="text-muted-foreground">
            {formatDate(expense.date)}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(expense.amount)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Payment Method</div>
            <div className="text-lg">{expense.paymentMethod || 'Not specified'}</div>
          </CardContent>
        </Card>
      </div>
      
      {expense.description && (
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{expense.description}</p>
        </div>
      )}
      
      {expense.receiptUrl && (
        <div>
          <h3 className="text-sm font-medium mb-2">Receipt</h3>
          {expense.receiptType === 'image' ? (
            <div className="mt-2">
              <img 
                src={expense.receiptUrl} 
                alt="Receipt" 
                className="max-w-full max-h-[300px] rounded-md object-contain"
              />
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => window.open(expense.receiptUrl, '_blank')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View PDF Receipt
            </Button>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        Created: {formatDate(expense.createdAt)}
        {expense.updatedAt && expense.updatedAt !== expense.createdAt && (
          <> • Updated: {formatDate(expense.updatedAt)}</>
        )}
      </div>
    </div>
  )
} 