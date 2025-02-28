import useSWR from 'swr'
import type { Panel } from '@/app/panels/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePanels() {
  const { data, error, isLoading, mutate } = useSWR<Panel[]>('/api/panels', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 0,
    revalidateOnReconnect: true
  })

  return {
    panels: data || [],
    isLoading,
    isError: error,
    mutate: () => mutate(undefined, true)
  }
} 