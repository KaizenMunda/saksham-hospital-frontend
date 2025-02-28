import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export async function GET() {
  try {
    // Get the current year and month for the prefix
    const today = new Date()
    const yearMonth = format(today, 'yyMM') // e.g., "2402" for February 2024
    
    // Get the latest IPD number for the current year/month
    const { data, error } = await supabase
      .from('ipd_admissions')
      .select('ipd_no')
      .ilike('ipd_no', `IPD/${yearMonth}/%`)
      .order('ipd_no', { ascending: false })
      .limit(1)

    if (error) throw error

    let nextSequence = 1
    
    // If we have existing admissions for this month
    if (data && data.length > 0) {
      const lastIpdNo = data[0].ipd_no
      // Format is IPD/YYMM/SEQUENCE
      const parts = lastIpdNo.split('/')
      if (parts.length === 3) {
        nextSequence = parseInt(parts[2]) + 1
      }
    }
    
    // Format: IPD/YYMM/SEQUENCE (e.g., IPD/2402/1)
    const nextNumber = `IPD/${yearMonth}/${nextSequence.toString().padStart(3, '0')}`

    return NextResponse.json({ nextNumber })
  } catch (error: any) {
    console.error('Error getting next IPD number:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get next IPD number' },
      { status: 500 }
    )
  }
} 