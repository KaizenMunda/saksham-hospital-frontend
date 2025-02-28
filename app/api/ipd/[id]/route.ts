import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'Admission ID is required' },
        { status: 400 }
      )
    }

    console.log(`Attempting to delete admission with ID: ${id}`)

    // 1. Get the admission details first (to get the bed_id)
    const { data: admission, error: getError } = await supabase
      .from('ipd_admissions')
      .select('bed_id, ipd_no')
      .eq('id', id)
      .single()

    if (getError) {
      console.error('Error fetching admission:', getError)
      return NextResponse.json(
        { error: 'Failed to fetch admission details' },
        { status: 500 }
      )
    }

    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      )
    }

    console.log(`Found admission with IPD number: ${admission.ipd_no}, bed ID: ${admission.bed_id}`)

    // 2. Update the bed status to Available if there's a bed assigned
    if (admission.bed_id) {
      console.log(`Updating bed ${admission.bed_id} to Available`)
      const { error: bedError } = await supabase
        .from('beds')
        .update({ 
          status: 'Available',
          current_admission_id: null
        })
        .eq('id', admission.bed_id)

      if (bedError) {
        console.error('Error updating bed status:', bedError)
        return NextResponse.json(
          { error: 'Failed to update bed status' },
          { status: 500 }
        )
      }
    }

    // 2.5. Delete related admission_doctors records
    console.log(`Deleting related admission_doctors records for admission ID: ${id}`)
    const { error: doctorsError } = await supabase
      .from('admission_doctors')
      .delete()
      .eq('admission_id', id)

    if (doctorsError) {
      console.error('Error deleting admission_doctors records:', doctorsError)
      return NextResponse.json(
        { error: 'Failed to delete related doctor records' },
        { status: 500 }
      )
    }

    // 3. Delete the admission
    console.log(`Deleting admission with ID: ${id}`)
    const { error: deleteError } = await supabase
      .from('ipd_admissions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting admission:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete admission' },
        { status: 500 }
      )
    }

    // 4. Log the freed IPD number for potential reuse
    console.log(`DELETE: Successfully deleted admission. IPD number ${admission.ipd_no} is now available for reuse.`)

    return NextResponse.json({ 
      success: true,
      message: `Admission deleted successfully. Bed freed, and IPD number ${admission.ipd_no} released.`
    })
  } catch (error: any) {
    console.error('DELETE: Unhandled error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete admission' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const { error } = await supabase
      .from('ipd_admissions')
      .update({
        admission_time: data.admissionTime,
        status: data.status,
      })
      .eq('id', params.id)

    if (error) throw error

    // Update doctor assignments if doctorIds changed
    if (data.doctorIds) {
      // First delete existing assignments
      await supabase
        .from('admission_doctors')
        .delete()
        .eq('admission_id', params.id)

      // Then insert new ones
      await supabase
        .from('admission_doctors')
        .insert(
          data.doctorIds.map(doctorId => ({
            admission_id: params.id,
            doctor_id: doctorId
          }))
        )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating admission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update admission' },
      { status: 500 }
    )
  }
} 