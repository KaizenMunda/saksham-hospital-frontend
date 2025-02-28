import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNextIPDNumber() {
  const { data, error, isLoading } = useSWR('/api/ipd/next-number', fetcher)

  return {
    nextNumber: data?.nextNumber,
    isLoading,
    isError: error
  }
} 