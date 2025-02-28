import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryIds = searchParams.get('categoryIds')?.split(',')
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')
    
    let query = supabase
      .from('expenses')
      .select(`
        *,
        category:category_id(*)
      `)
      .order('date', { ascending: false })
    
    // Apply date filters
    if (startDate) {
      query = query.gte('date', startDate)
    }
    
    if (endDate) {
      query = query.lte('date', endDate)
    }
    
    // Apply category filter
    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds)
    }
    
    // Apply amount filters
    if (minAmount) {
      query = query.gte('amount', minAmount)
    }
    
    if (maxAmount) {
      query = query.lte('amount', maxAmount)
    }
    
    // Apply period filter if no custom dates
    if (!startDate && !endDate) {
      const now = new Date()
      let periodStartDate = new Date()
      
      switch (period) {
        case 'today':
          periodStartDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          periodStartDate.setDate(now.getDate() - 7)
          break
        case 'month':
          periodStartDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          periodStartDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          periodStartDate.setFullYear(now.getFullYear() - 1)
          break
        default:
          periodStartDate.setMonth(now.getMonth() - 1) // Default to month
      }
      
      query = query.gte('date', periodStartDate.toISOString())
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Transform data to match our types
    const transformedData = data.map(expense => ({
      id: expense.id,
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.category_id,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.payment_method,
      receiptUrl: expense.receipt_url,
      receiptType: expense.receipt_type,
      createdAt: expense.created_at,
      updatedAt: expense.updated_at
    }))
    
    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert([{
        title: data.title,
        description: data.description,
        amount: data.amount,
        category_id: data.categoryId,
        date: data.date || new Date().toISOString(),
        payment_method: data.paymentMethod,
        receipt_url: data.receiptUrl,
        receipt_type: data.receiptType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(expense)
  } catch (error: any) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    )
  }
} 