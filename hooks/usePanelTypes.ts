import useSWR from 'swr'

interface PanelType {
  id: string
  name: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePanelTypes() {
  const { data, error, isLoading } = useSWR<PanelType[]>('/api/panel-types', fetcher)

  return {
    panelTypes: data ?? [],
    isLoading,
    isError: error
  }
} 