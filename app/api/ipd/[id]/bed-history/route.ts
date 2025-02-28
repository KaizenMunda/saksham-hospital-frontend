import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('bed_history')
      .select(`
        id,
        from_time,
        to_time,
        bed:bed_id (
          ward,
          bed_number
        )
      `)
      .eq('admission_id', params.id)
      .order('from_time', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching bed history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bed history' },
      { status: 500 }
    )
  }
} 