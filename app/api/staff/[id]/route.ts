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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('staff_details')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching staff member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch staff member' },
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
    
    // Get the current staff record to get the user_details_id
    const { data: currentStaff, error: fetchError } = await supabase
      .from('staff_details')
      .select('user_details_id, email_id')
      .eq('id', params.id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Update auth user metadata if role or email changed
    if (data.staff_role || (data.email_id && data.email_id !== currentStaff.email_id)) {
      const updateUserData: any = {
        user_metadata: {}
      }
      
      if (data.staff_role) {
        updateUserData.user_metadata.role = data.staff_role
      }
      
      if (data.email_id && data.email_id !== currentStaff.email_id) {
        updateUserData.email = data.email_id
      }
      
      const { error: userUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        currentStaff.user_details_id,
        updateUserData
      )
      
      if (userUpdateError) throw userUpdateError
    }
    
    // Update staff record
    const { data: updatedStaff, error: updateError } = await supabase
      .from('staff_details')
      .update({
        attendance: data.attendance,
        e_code: data.e_code,
        name: data.name,
        active: data.active,
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
        age: data.age,
        experience: data.experience,
        qualification: data.qualification,
        duty_hours: data.duty_hours,
        salary_amount: data.salary_amount,
        pf: data.pf,
        address: data.address,
        aadhaar: data.aadhaar,
        salary_type: data.salary_type,
        category_code: data.category_code,
        pf_uan: data.pf_uan,
        pan: data.pan,
        salary: data.salary,
        bank_name: data.bank_name,
        account_number: data.account_number,
        staff_role: data.staff_role
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    return NextResponse.json(updatedStaff)
  } catch (error: any) {
    console.error('Error updating staff member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update staff member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the user_details_id before deleting the staff record
    const { data: staff, error: fetchError } = await supabase
      .from('staff_details')
      .select('user_details_id')
      .eq('id', params.id)
      .single()
    
    if (fetchError) throw fetchError
    
    // Delete the staff record
    const { error: deleteError } = await supabase
      .from('staff_details')
      .delete()
      .eq('id', params.id)
    
    if (deleteError) throw deleteError
    
    // Delete the auth user
    if (staff.user_details_id) {
      const { error: userDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
        staff.user_details_id
      )
      
      if (userDeleteError) {
        console.error('Error deleting auth user:', userDeleteError)
        // Continue anyway, as the staff record is deleted
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting staff member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete staff member' },
      { status: 500 }
    )
  }
} 