import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Create a supabase client with admin privileges for user management
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('staff_details')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // First, create a user in auth system
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email_id,
      password: data.password || Math.random().toString(36).slice(-8),
      email_confirm: false,
      user_metadata: {
        full_name: data.name,
        role: data.staff_role
      }
    })

    if (userError) throw userError

    // Create a separate users record with an integer ID
    const { data: userRecord, error: userRecordError } = await supabase
      .from('users')
      .insert({
        auth_id: userData.user.id,
        email: data.email_id,
        full_name: data.name,
        role: data.staff_role
      })
      .select('id')
      .single()

    if (userRecordError) throw userRecordError

    // Ensure numeric fields are properly converted to numbers
    const numericFields = {
      attendance: parseInt(data.attendance) || 0,
      age: parseInt(data.age) || null,
      experience: parseInt(data.experience) || 0,
      duty_hours: parseInt(data.duty_hours) || 8,
      salary_amount: parseFloat(data.salary_amount) || null,
      pf: parseFloat(data.pf) || null,
      salary: parseFloat(data.salary) || null
    }

    // Then, create the staff record
    const { data: staffData, error: staffError } = await supabase
      .from('staff_details')
      .insert({
        user_details_id: userRecord.id,
        e_code: data.e_code,
        name: data.name,
        active: data.active !== undefined ? data.active : true,
        designation: data.designation,
        department: data.department,
        fathers_name_first: data.fathers_name_first,
        mobile_number: data.mobile_number,
        email_id: data.email_id,
        date_of_birth: data.date_of_birth,
        blood_group: data.blood_group,
        gender: data.gender,
        kyc_number: data.kyc_number,
        date_of_joining: data.date_of_joining,
        address: data.address,
        aadhaar: data.aadhaar,
        salary_type: data.salary_type,
        category_code: data.category_code,
        pf_uan: data.pf_uan,
        pan: data.pan,
        bank_name: data.bank_name,
        account_number: data.account_number,
        staff_role: data.staff_role,
        ...numericFields
      })
      .select()
      .single()

    if (staffError) {
      // If staff creation fails, delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
      throw staffError
    }

    // Send password reset email
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: data.email_id,
    })

    if (resetError) {
      console.error('Error sending password reset email:', resetError)
      // Continue anyway, as the staff record is created
    }

    return NextResponse.json(staffData)
  } catch (error: any) {
    console.error('Error creating staff:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create staff' },
      { status: 500 }
    )
  }
} 