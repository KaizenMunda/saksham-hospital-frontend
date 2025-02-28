import useSWR from 'swr'

interface Bed {
  id: string
  ward: string
  bed_number: string
  status: 'Available' | 'Occupied' | 'Maintenance'
  current_admission_id: string | null
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useBeds() {
  const { data, error, isLoading, mutate } = useSWR('/api/beds', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false
  })

  return {
    beds: data as Bed[],
    isLoading,
    isError: error,
    mutate
  }
} 