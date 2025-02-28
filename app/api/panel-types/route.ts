import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('panel_types')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching panel types:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch panel types' },
      { status: 500 }
    )
  }
} 