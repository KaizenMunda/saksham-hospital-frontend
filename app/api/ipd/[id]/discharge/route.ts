import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { dischargeTime, status } = await request.json()

    // Get the admission to find the bed
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

    // Update admission status and discharge time
    const { error: updateError } = await supabase
      .from('ipd_admissions')
      .update({
        status,
        discharge_time: dischargeTime
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating admission:', updateError)
      return NextResponse.json(
        { error: 'Failed to update admission' },
        { status: 500 }
      )
    }

    // Release the bed
    const { error: bedError } = await supabase
      .from('beds')
      .update({
        status: 'Available',
        current_admission_id: null
      })
      .eq('id', admission.bed_id)

    if (bedError) {
      console.error('Error updating bed:', bedError)
      return NextResponse.json(
        { error: 'Failed to update bed status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in discharge:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to discharge patient' },
      { status: 500 }
    )
  }
} 