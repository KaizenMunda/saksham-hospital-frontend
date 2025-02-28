import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Fetching doctors...');
    const { data, error } = await supabase
      .from('doctors')
      .select('id, name, department, specialization')
      .eq('active', true)
      .order('name');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Doctors data:', data);

    if (!data || data.length === 0) {
      console.log('No doctors found or empty data');
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in doctors API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
} 