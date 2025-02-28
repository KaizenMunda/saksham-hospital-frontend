import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('panels')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching panels:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch panels' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Check if panel with same name exists
    const { data: existingPanel, error: checkError } = await supabase
      .from('panels')
      .select('id')
      .eq('name', data.name)
      .single()

    if (existingPanel) {
      return NextResponse.json(
        { error: 'A panel with this name already exists' },
        { status: 400 }
      )
    }

    const { error, data: panel } = await supabase
      .from('panels')
      .insert(data)
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: panel.id })
  } catch (error: any) {
    console.error('Error creating panel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create panel' },
      { status: 500 }
    )
  }
}

// Add DELETE endpoint
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Panel ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('panels')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting panel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete panel' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    console.log('[PATCH] Updating panel:', {
      id,
      data
    })

    if (!id) {
      return NextResponse.json(
        { error: 'Panel ID is required' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('panels')
      .update(data)
      .eq('id', id)

    if (updateError) {
      console.error('[PATCH] Update error:', updateError)
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    // Fetch updated panel
    const { data: panel, error: fetchError } = await supabase
      .from('panels')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('[PATCH] Fetch error:', fetchError)
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(panel)
  } catch (error: any) {
    console.error('[PATCH] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update panel' },
      { status: 500 }
    )
  }
} 