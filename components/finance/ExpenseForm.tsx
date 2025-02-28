'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Expense, ExpenseCategory } from '@/app/finance/expenses/types'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { FileUploader } from './FileUploader'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  categoryId: z.string().min(1, {
    message: "Please select a category.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  paymentMethod: z.string().optional(),
  receiptUrl: z.string().optional(),
  receiptType: z.enum(['image', 'pdf']).optional(),
})

interface ExpenseFormProps {
  expense?: Expense
  categories: ExpenseCategory[]
  onSuccess: () => void
}

export function ExpenseForm({ expense, categories, onSuccess }: ExpenseFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | undefined>(
    expense?.receiptUrl
  )
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'pdf' | undefined>(
    expense?.receiptType
  )
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: expense?.title || '',
      description: expense?.description || '',
      amount: expense?.amount || 0,
      categoryId: expense?.categoryId || '',
      date: expense?.date 
        ? format(new Date(expense.date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      paymentMethod: expense?.paymentMethod || '',
      receiptUrl: expense?.receiptUrl || '',
      receiptType: expense?.receiptType,
    },
  })
  
  const handleFileUploaded = (url: string, type: 'image' | 'pdf') => {
    setUploadedFileUrl(url)
    setUploadedFileType(type)
    form.setValue('receiptUrl', url)
    form.setValue('receiptType', type)
  }
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      
      // Include the uploaded file info
      if (uploadedFileUrl) {
        values.receiptUrl = uploadedFileUrl
        values.receiptType = uploadedFileType
      }
      
      const url = expense 
        ? `/api/finance/expenses/${expense.id}`
        : '/api/finance/expenses'
      
      const method = expense ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save expense')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error saving expense:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save expense",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Form {...form}>
      <h2 className="text-lg font-semibold mb-4">
        {expense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Expense title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹) *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about this expense" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="receiptUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receipt</FormLabel>
              <FormControl>
                <FileUploader
                  onFileUploaded={handleFileUploaded}
                  existingFileUrl={field.value}
                  existingFileType={form.getValues().receiptType}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
          </Button>
        </div>
      </form>
    </Form>
  )
} 