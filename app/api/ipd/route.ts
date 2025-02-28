import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { IPDAdmission } from '@/app/ipd/types'
import { getCurrentFinancialYear, formatIPDNumber } from '@/lib/utils'
import { parseISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('API received data:', data);

    // Validate required fields
    if (!data.patientId || !data.bedId || !data.doctorIds || data.doctorIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate admission time is not in the future
    const admissionTime = new Date(data.admissionTime);
    const now = new Date();
    if (admissionTime > now) {
      return NextResponse.json(
        { error: 'Admission time cannot be in the future' },
        { status: 400 }
      );
    }

    // Check if patient is already admitted
    const { data: existingAdmission, error: checkError } = await supabase
      .from('ipd_admissions')
      .select('id')
      .eq('patient_id', data.patientId)
      .eq('status', 'Admitted')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing admission:', checkError);
      return NextResponse.json(
        { error: 'Failed to check patient admission status' },
        { status: 500 }
      );
    }

    if (existingAdmission) {
      return NextResponse.json(
        { error: 'This patient is already admitted' },
        { status: 400 }
      );
    }

    // Check if bed is available
    const { data: bed, error: bedError } = await supabase
      .from('beds')
      .select('status')
      .eq('id', data.bedId)
      .single();

    if (bedError) {
      console.error('Error checking bed status:', bedError);
      return NextResponse.json(
        { error: 'Failed to check bed status' },
        { status: 500 }
      );
    }

    if (bed.status !== 'Available') {
      return NextResponse.json(
        { error: 'The selected bed is already occupied' },
        { status: 400 }
      );
    }

    // Get the current financial year
    const financialYear = getCurrentFinancialYear();

    // Get the latest IPD number for the current financial year
    const { data: latestAdmission, error: countError } = await supabase
      .from('ipd_admissions')
      .select('ipd_no')
      .ilike('ipd_no', `${financialYear}/%`)
      .order('ipd_no', { ascending: false })
      .limit(1)
      .single();

    let nextSequence = 1;
    if (!countError || countError.code === 'PGRST116') { // PGRST116 means no rows found
      if (latestAdmission) {
        const lastSequence = parseInt(latestAdmission.ipd_no.split('/')[1]);
        nextSequence = lastSequence + 1;
      }
    } else {
      console.error('Error getting latest IPD number:', countError);
      return NextResponse.json(
        { error: 'Failed to generate IPD number' },
        { status: 500 }
      );
    }

    // Generate the new IPD number
    const ipdNo = `${financialYear}/${nextSequence.toString().padStart(3, '0')}`;

    // Insert the admission record
    const { data: admission, error: insertError } = await supabase
      .from('ipd_admissions')
      .insert({
        ipd_no: ipdNo,
        patient_id: data.patientId,
        bed_id: data.bedId,
        admission_time: data.admissionTime || new Date().toISOString(),
        status: 'Admitted',
        panel_id: data.panel_id,
        attendant_name: data.attendant_name,
        attendant_phone: data.attendant_phone,
        id_document_type: data.id_document_type,
        id_number: data.id_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting admission:', insertError);
      return NextResponse.json(
        { error: 'Failed to create admission record' },
        { status: 500 }
      );
    }

    // Add doctor assignments
    if (data.doctorIds && data.doctorIds.length > 0) {
      const doctorAssignments = data.doctorIds.map(doctorId => ({
        admission_id: admission.id,
        doctor_id: doctorId
      }));

      const { error: doctorError } = await supabase
        .from('admission_doctors')
        .insert(doctorAssignments);

      if (doctorError) {
        console.error('Error assigning doctors:', doctorError);
        // We don't want to fail the whole operation if just the doctor assignments fail
        // But we should log it for investigation
      }
    }

    // Update the bed status to 'Occupied'
    const { error: bedUpdateError } = await supabase
      .from('beds')
      .update({ 
        status: 'Occupied',
        current_admission_id: admission.id
      })
      .eq('id', data.bedId);
    
    if (bedUpdateError) {
      console.error('Error updating bed status:', bedUpdateError);
      // We don't want to fail the whole operation if just the bed status update fails
      // But we should log it for investigation
    }
    
    return NextResponse.json({
      id: admission.id,
      ipd_no: admission.ipd_no,
      patient_id: admission.patient_id,
      bed_id: admission.bed_id,
      admission_time: admission.admission_time,
      status: admission.status
    });
  } catch (error: any) {
    console.error('Error in POST /api/ipd:', error);
    return NextResponse.json(
      { error: 'Failed to create admission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ipd_admissions')
      .select(`
        *,
        patient:patient_id(*),
        bed:bed_id(*),
        doctors:admission_doctors(
          doctor:doctor_id(*)
        ),
        panel:panel_id(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform the data to match the expected format
    const transformedData = data?.map(admission => ({
      ...admission,
      id: admission.id,
      ipdNo: admission.ipd_no,
      patientId: admission.patient_id,
      bedId: admission.bed_id,
      admissionTime: new Date(admission.admission_time).toISOString(),
      status: admission.status,
      patient: admission.patient,
      bed: {
        ...admission.bed,
        bedNumber: admission.bed.bed_number
      },
      doctors: admission.doctors || [],
      panel: admission.panel,
      createdAt: new Date(admission.created_at).toISOString(),
      updatedAt: admission.updated_at ? new Date(admission.updated_at).toISOString() : null
    }))

    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error('Error fetching IPD admissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch admissions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    console.log('PATCH: Request data:', { id, data })

    if (!id) {
      return NextResponse.json(
        { error: 'Admission ID is required' },
        { status: 400 }
      )
    }

    // First, fetch the existing admission to preserve relationships
    const { data: existingAdmission, error: fetchError } = await supabase
      .from('ipd_admissions')
      .select(`
        *,
        doctors:admission_doctors(
          doctor:doctor_id(*)
        ),
        panel:panel_id(*)
      `)
      .eq('id', id)
      .single()

    console.log('PATCH: Existing admission:', existingAdmission)

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
      attendant_name: data.attendantName,
      attendant_phone: data.attendantPhone,
      id_document_type: data.idDocumentType,
      id_number: data.idNumber,
      updated_at: new Date().toISOString()
    }

    console.log('PATCH: Update data:', updateData)

    // Update the admission
    const { data: updated, error: admissionError } = await supabase
      .from('ipd_admissions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        patient:patient_id(*),
        bed:bed_id(*),
        doctors:admission_doctors(
          doctor:doctor_id(*)
        ),
        panel:panel_id(*)
      `)
      .single()

    console.log('PATCH: Update result:', { updated, error: admissionError })

    if (admissionError) {
      console.error('PATCH: Error updating admission:', admissionError)
      return NextResponse.json(
        { error: admissionError.message },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const formattedAdmission = {
      ...updated,
      id: updated.id,
      ipdNo: updated.ipd_no,
      patientId: updated.patient_id,
      bedId: updated.bed_id,
      admissionTime: new Date(updated.admission_time).toISOString(),
      status: updated.status,
      patient: updated.patient,
      doctors: updated.doctors?.map(d => ({
        id: d.doctor?.id,
        name: d.doctor?.name,
        doctor: d.doctor
      })) || [],
      panel: updated.panel,
      createdAt: new Date(updated.created_at).toISOString(),
      updatedAt: updated.updated_at ? new Date(updated.updated_at).toISOString() : null
    }

    console.log('PATCH: Formatted response:', formattedAdmission)
    return NextResponse.json(formattedAdmission)
  } catch (error: any) {
    console.error('PATCH: Unhandled error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update admission' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log('DELETE: Deleting admission:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'Admission ID is required' },
        { status: 400 }
      )
    }

    // First, get the complete admission details
    const { data: admission, error: fetchError } = await supabase
      .from('ipd_admissions')
      .select(`
        id, 
        bed_id, 
        patient_id,
        ipd_no
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('DELETE: Error fetching admission:', fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    // 1. Delete doctor assignments first
    const { error: doctorDeleteError } = await supabase
      .from('admission_doctors')
      .delete()
      .eq('admission_id', id)

    if (doctorDeleteError) {
      console.error('DELETE: Error deleting doctor assignments:', doctorDeleteError)
      return NextResponse.json(
        { error: doctorDeleteError.message },
        { status: 500 }
      )
    }

    // 2. Free up the bed if it's still assigned to this admission
    if (admission.bed_id) {
      const { error: bedError } = await supabase
        .from('beds')
        .update({ 
          status: 'Available',
          current_admission_id: null
        })
        .eq('id', admission.bed_id)
        .eq('current_admission_id', id) // Only update if this admission is still using the bed

      if (bedError) {
        console.error('DELETE: Error updating bed status:', bedError)
        return NextResponse.json(
          { error: bedError.message },
          { status: 500 }
        )
      }
    }

    // 3. Finally, delete the admission
    const { error: deleteError } = await supabase
      .from('ipd_admissions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('DELETE: Error deleting admission:', deleteError)
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }

    // 4. Log the freed IPD number for potential reuse
    console.log(`DELETE: Successfully deleted admission. IPD number ${admission.ipd_no} is now available for reuse.`)

    return NextResponse.json({ 
      success: true,
      message: `Admission deleted successfully. Bed freed, patient available for new admission, and IPD number ${admission.ipd_no} released.`
    })
  } catch (error: any) {
    console.error('DELETE: Unhandled error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete admission' },
      { status: 500 }
    )
  }
} 