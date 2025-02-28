export interface Panel {
  id: string
  name: string
  logo_url: string | null
  panel_type: string
  start_date: string
  expiry_date: string | null
  claims_email: string | null
  claims_address: string | null
  poc_name: string | null
  poc_phone: string | null
  poc_email: string | null
  portal_name: string | null
  portal_credentials: {
    portal_link: string | null
    username: string | null
    password: string | null
  } | null
  contract_file_path: string | null
  rate_list_file_path: string | null
  created_at: string
  updated_at: string
}

export type NewPanel = Omit<Panel, 'id' | 'created_at' | 'updated_at'>

export const PANEL_TYPES = [
  'Insurance',
  'Corporate',
  'Government',
  'NGO',
  'Other'
] as const

export type PanelType = typeof PANEL_TYPES[number] 