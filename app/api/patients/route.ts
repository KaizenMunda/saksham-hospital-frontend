import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

// Create a new supabase client for each request
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

async function clearSchemaCache() {
  try {
    // This is a workaround to force Supabase to refresh its schema cache
    await supabase.rpc('clear_schema_cache');
    console.log('Schema cache cleared');
  } catch (error) {
    console.error('Failed to clear schema cache:', error);
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Check for existing patient with same phone number
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id, name, contact')
      .eq('contact', data.contact)
      .single()

    if (existingPatient) {
      return NextResponse.json(
        { 
          error: `A patient with this phone number already exists (${existingPatient.name})` 
        },
        { status: 400 }
      )
    }

    // Generate patient_id
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
    
    const patientId = `P${(count + 1).toString().padStart(7, '0')}`
    
    const { data: patient, error } = await supabase
      .from('patients')
      .insert([{
        patient_id: patientId,
        name: data.name,
        date_of_birth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
        gender: data.gender,
        contact: data.contact,
        address: data.address || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error adding patient:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add patient' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const requestData = await request.json();
    console.log('PATCH request data:', JSON.stringify(requestData, null, 2));
    
    const { id } = requestData;
    
    // Use a raw SQL query to bypass the schema cache
    const { error } = await supabase.rpc('update_patient', {
      p_id: id,
      p_name: requestData.name,
      p_date_of_birth: requestData.dateOfBirth,
      p_gender: requestData.gender,
      p_contact: requestData.contact,
      p_address: requestData.address,
      p_email: requestData.email
    });
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
} 