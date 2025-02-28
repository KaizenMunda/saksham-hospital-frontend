import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Ward {
  id: string;
  name: string;
}

export async function GET() {
  try {
    console.log('Fetching wards...');
    
    const { data, error } = await supabase
      .from('beds')
      .select('ward')
      .eq('status', 'Available')
      .order('ward');

    console.log('Raw Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Database access error: ${error.message}` },
        { status: 500 }
      )
    }

    // Get unique wards and validate the format
    const uniqueWards = [...new Set(data.map(bed => bed.ward))];
    console.log('Unique wards before transform:', uniqueWards);

    const transformedData: Ward[] = uniqueWards
      .filter(Boolean) // Remove any null or undefined values
      .map(ward => ({
        id: ward,
        name: ward
      }));

    console.log('Transformed data:', transformedData);

    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error('Error in wards API:', error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
} 