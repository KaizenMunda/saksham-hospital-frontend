'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Expense, ExpenseCategory, CategoryTotal } from '@/app/finance/expenses/types'
import { format } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface ExpenseSummaryProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
}

export function ExpenseSummary({ expenses, categories }: ExpenseSummaryProps) {
  // Calculate total expenses
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])
  
  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryTotals: Record<string, CategoryTotal> = {}
    
    expenses.forEach(expense => {
      const categoryId = expense.categoryId
      const categoryName = expense.category?.name || 'Uncategorized'
      
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = {
          categoryId,
          categoryName,
          total: 0,
          count: 0
        }
      }
      
      categoryTotals[categoryId].total += expense.amount
      categoryTotals[categoryId].count += 1
    })
    
    return Object.values(categoryTotals).sort((a, b) => b.total - a.total)
  }, [expenses])
  
  // Calculate expenses by month (for the bar chart)
  const expensesByMonth = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const monthYear = format(date, 'MMM yyyy')
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0
      }
      
      monthlyData[monthYear] += expense.amount
    })
    
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })
  }, [expenses])
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1']
  
  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            No expense data available for the selected period.
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} expense entries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalAmount / (expenses.length || 1))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per expense entry
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Largest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.max(...expenses.map(e => e.amount)))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]).title}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="categoryName"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expensesByMonth}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Amount</th>
                  <th className="text-right py-2">% of Total</th>
                  <th className="text-right py-2">Entries</th>
                  <th className="text-right py-2">Avg. per Entry</th>
                </tr>
              </thead>
              <tbody>
                {expensesByCategory.map((category) => (
                  <tr key={category.categoryId} className="border-b">
                    <td className="py-2">{category.categoryName}</td>
                    <td className="text-right py-2">{formatCurrency(category.total)}</td>
                    <td className="text-right py-2">
                      {((category.total / totalAmount) * 100).toFixed(1)}%
                    </td>
                    <td className="text-right py-2">{category.count}</td>
                    <td className="text-right py-2">
                      {formatCurrency(category.total / category.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 