import useSWR from 'swr'
import { Expense, ExpenseFilterOptions } from '@/app/finance/expenses/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useExpenses(filterOptions: ExpenseFilterOptions) {
  const { period, startDate, endDate, categoryIds, minAmount, maxAmount } = filterOptions
  
  // Build query params
  let queryParams = new URLSearchParams()
  queryParams.append('period', period)
  
  if (startDate) queryParams.append('startDate', startDate)
  if (endDate) queryParams.append('endDate', endDate)
  if (categoryIds?.length) queryParams.append('categoryIds', categoryIds.join(','))
  if (minAmount) queryParams.append('minAmount', minAmount.toString())
  if (maxAmount) queryParams.append('maxAmount', maxAmount.toString())
  
  const { data, error, isLoading, mutate } = useSWR<Expense[]>(
    `/api/finance/expenses?${queryParams.toString()}`,
    fetcher
  )
  
  return {
    expenses: data || [],
    isLoading,
    isError: error,
    mutate
  }
} 