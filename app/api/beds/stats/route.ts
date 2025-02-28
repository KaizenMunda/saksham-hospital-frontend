import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get total beds count
    const { count: totalBeds, error: totalError } = await supabase
      .from('beds')
      .select('*', { count: 'exact', head: true })
    
    if (totalError) throw totalError
    
    // Get available beds count
    const { count: availableBeds, error: availableError } = await supabase
      .from('beds')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Available')
    
    if (availableError) throw availableError
    
    // Calculate occupied beds
    const occupiedBeds = totalBeds - availableBeds
    
    return NextResponse.json({
      total: totalBeds,
      available: availableBeds,
      occupied: occupiedBeds
    })
  } catch (error) {
    console.error('Error fetching bed statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bed statistics' },
      { status: 500 }
    )
  }
} 