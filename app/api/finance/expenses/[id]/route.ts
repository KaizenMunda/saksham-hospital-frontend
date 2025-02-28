import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      message: 'Expense deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete expense' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('expenses')
      .update({
        title: data.title,
        description: data.description,
        amount: data.amount,
        category_id: data.categoryId,
        date: data.date,
        payment_method: data.paymentMethod,
        receipt_url: data.receiptUrl,
        receipt_type: data.receiptType,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      message: 'Expense updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update expense' },
      { status: 500 }
    )
  }
} 