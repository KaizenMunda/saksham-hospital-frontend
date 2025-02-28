import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    console.log('PATCH request data:', JSON.stringify(data, null, 2));
    
    // Use direct update instead of RPC
    const { data: result, error } = await supabase
      .from('patients')
      .update({
        name: data.name,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        contact: data.contact,
        address: data.address || '',
        email: data.email || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update patient' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // First, check if the patient has any admissions
    const { data: admissions, error: checkError } = await supabase
      .from('ipd_admissions')
      .select('id')
      .eq('patient_id', id)
      .limit(1);
    
    if (checkError) {
      console.error('Error checking patient admissions:', checkError);
      throw checkError;
    }
    
    // If patient has admissions, don't allow deletion
    if (admissions && admissions.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete patient with existing admissions. Please discharge and delete all admissions first.' 
        },
        { status: 400 }
      );
    }
    
    // If no admissions, proceed with deletion
    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting patient:', deleteError);
      throw deleteError;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete patient' },
      { status: 500 }
    );
  }
} 