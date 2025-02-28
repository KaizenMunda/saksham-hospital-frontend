import useSWR from 'swr'
import { ExpenseCategory } from '@/app/finance/expenses/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useExpenseCategories() {
  const { data, error, isLoading, mutate } = useSWR<ExpenseCategory[]>(
    '/api/finance/expense-categories',
    fetcher
  )
  
  return {
    categories: data || [],
    isLoading,
    isError: error,
    mutate
  }
} 