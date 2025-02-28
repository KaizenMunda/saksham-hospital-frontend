import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Get the public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('panel-documents')
      .getPublicUrl(path)

    console.log('Generated public URL:', publicUrl)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Error viewing file:', error)
    return NextResponse.json(
      { error: 'Failed to view file' },
      { status: 500 }
    )
  }
} 