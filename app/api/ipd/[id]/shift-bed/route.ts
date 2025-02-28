import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { newBedId, shiftTime } = await request.json()

    // Get the current admission details
    const { data: admission, error: admissionError } = await supabase
      .from('ipd_admissions')
      .select('bed_id')
      .eq('id', params.id)
      .single()

    if (admissionError) {
      console.error('Error finding admission:', admissionError)
      return NextResponse.json(
        { error: 'Failed to find admission' },
        { status: 500 }
      )
    }

    // Call the shift_bed function with exact parameter names
    const { error: transactionError } = await supabase.rpc('shift_bed', {
      p_admission_id: params.id,
      p_old_bed_id: admission.bed_id,
      p_new_bed_id: newBedId,
      p_shift_time: shiftTime
    })

    if (transactionError) {
      console.error('Error in bed shift transaction:', transactionError)
      return NextResponse.json(
        { error: transactionError.message || 'Failed to shift bed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in bed shift:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to shift bed' },
      { status: 500 }
    )
  }
} 