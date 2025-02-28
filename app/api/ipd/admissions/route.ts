import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const { error } = await supabase
      .from('ipd_admissions')
      .insert({
        // ... existing fields ...
        panel_id: data.panel_id
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // ... error handling ...
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    console.log('PATCH: Updating admission:', { id, data })

    if (!id) {
      return NextResponse.json(
        { error: 'Admission ID is required' },
        { status: 400 }
      )
    }

    // First, fetch the existing admission to get doctor relationships
    const { data: existingAdmission, error: fetchError } = await supabase
      .from('ipd_admissions')
      .select(`
        *,
        doctors:doctor_admission(doctor:doctors(id, name))
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('PATCH: Error fetching existing admission:', fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    // Prepare update data
    const updateData = {
      status: data.status,
      panel_id: data.panel_id,
      discharge_time: data.discharge_time,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    console.log('PATCH: Update data:', updateData)

    // Update the admission
    const { error: admissionError } = await supabase
      .from('ipd_admissions')
      .update(updateData)
      .eq('id', id)

    if (admissionError) {
      console.error('PATCH: Error updating admission:', admissionError)
      return NextResponse.json(
        { error: admissionError.message },
        { status: 500 }
      )
    }

    // Fetch the updated admission with all relationships
    const { data: updatedAdmission, error: finalFetchError } = await supabase
      .from('ipd_admissions')
      .select(`
        *,
        patient:patients(id, name, phone),
        doctors:doctor_admission(doctor:doctors(id, name)),
        panel:panels(id, name)
      `)
      .eq('id', id)
      .single()

    if (finalFetchError) {
      console.error('PATCH: Error fetching updated admission:', finalFetchError)
      return NextResponse.json(
        { error: finalFetchError.message },
        { status: 500 }
      )
    }

    // Format the response to match the expected structure
    const formattedAdmission = {
      ...updatedAdmission,
      doctors: updatedAdmission.doctors.map((d: any) => d.doctor)
    }

    console.log('PATCH: Successfully updated admission:', formattedAdmission)
    return NextResponse.json(formattedAdmission)
  } catch (error: any) {
    console.error('PATCH: Unhandled error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update admission' },
      { status: 500 }
    )
  }
} 