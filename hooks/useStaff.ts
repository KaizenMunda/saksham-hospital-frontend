import useSWR from 'swr'
import { Staff } from '@/app/staff/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useStaff() {
  const { data, error, isLoading, mutate } = useSWR<Staff[]>('/api/staff', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 0,
    revalidateOnReconnect: true
  })

  return {
    staff: data || [],
    isLoading,
    isError: error,
    mutate: () => mutate(undefined, true)
  }
}

export function useStaffMember(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Staff>(
    id ? `/api/staff/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
      revalidateOnReconnect: true
    }
  )

  return {
    staffMember: data,
    isLoading,
    isError: error,
    mutate: () => mutate(undefined, true)
  }
} 