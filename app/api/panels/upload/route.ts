import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'contract' | 'rateList' | 'logo'
    const panelId = formData.get('panelId') as string

    console.log('Upload request:', {
      type,
      panelId,
      fileName: file?.name,
      fileSize: file?.size
    })

    console.log('Upload request details:', {
      type,
      panelId,
      file: file ? {
        name: file.name,
        size: file.size,
        type: file.type
      } : null
    })

    if (!file || !type || !panelId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Create a unique filename - remove special characters and spaces
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const timestamp = Date.now()
      const filename = `${panelId}/${type}/${timestamp}_${sanitizedFileName}`

      console.log('Generated filename:', filename)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('panel-documents')
        .upload(filename, file, {
          contentType: file.type,
          upsert: true
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return NextResponse.json(
          { error: `Storage upload failed: ${uploadError.message}` },
          { status: 500 }
        )
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('panel-documents')
        .getPublicUrl(filename)

      // Update the panel record
      const columnName = type === 'logo' ? 'logo_url' : 
                        type === 'contract' ? 'contract_file_path' : 
                        'rate_list_file_path'

      const { error: updateError } = await supabase
        .from('panels')
        .update({ [columnName]: publicUrl })
        .eq('id', panelId)

      if (updateError) {
        console.error('Database update error:', updateError)
        return NextResponse.json(
          { error: `Database update failed: ${updateError.message}` },
          { status: 500 }
        )
      }

      console.log('File uploaded successfully:', {
        filename,
        publicUrl,
        columnName
      })

      console.log('Database updated successfully:', {
        panelId,
        columnName,
        publicUrl
      })

      return NextResponse.json({ url: publicUrl })
    } catch (error: any) {
      console.error('Upload operation error:', error)
      return NextResponse.json(
        { error: `Upload operation failed: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Unhandled upload error:', error)
    return NextResponse.json(
      { error: `Unhandled error: ${error.message}` },
      { status: 500 }
    )
  }
} 