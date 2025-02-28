import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching expense categories:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expense categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const { data: category, error } = await supabase
      .from('expense_categories')
      .insert([{
        name: data.name,
        description: data.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Error creating expense category:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create expense category' },
      { status: 500 }
    )
  }
} 