import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('beds')
      .select('*')
      .order('ward')
      .order('bed_number')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching beds:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch beds' },
      { status: 500 }
    )
  }
} 