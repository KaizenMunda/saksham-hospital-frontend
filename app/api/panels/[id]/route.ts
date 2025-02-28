import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const { error } = await supabase
      .from('panels')
      .update({
        name: data.name,
        panel_type: data.panelType,
        start_date: data.startDate,
        expiry_date: data.expiryDate,
        claims_email: data.claimsEmail,
        claims_address: data.claimsAddress,
        poc_name: data.pocName,
        poc_phone: data.pocPhone,
        poc_email: data.pocEmail,
        portal_name: data.portalName,
        portal_credentials: data.portalCredentials ? {
          portal_link: data.portalCredentials.portalLink,
          username: data.portalCredentials.username,
          password: data.portalCredentials.password
        } : null,
        contract_file_path: data.contractFilePath,
        rate_list_file_path: data.rateListFilePath
      })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating panel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update panel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the panel details first to get file paths
    const { data: panel, error: fetchError } = await supabase
      .from('panels')
      .select('contract_file_path, rate_list_file_path')
      .eq('id', params.id)
      .single()

    if (fetchError) throw fetchError

    // Delete files from storage if they exist
    if (panel.contract_file_path) {
      await supabase.storage.from('panel-documents').remove([`${params.id}/contract`])
    }
    if (panel.rate_list_file_path) {
      await supabase.storage.from('panel-documents').remove([`${params.id}/rateList`])
    }

    // Delete the panel record
    const { error: deleteError } = await supabase
      .from('panels')
      .delete()
      .eq('id', params.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting panel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete panel' },
      { status: 500 }
    )
  }
} 