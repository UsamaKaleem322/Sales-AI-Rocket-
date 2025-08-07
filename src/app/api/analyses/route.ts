import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses, addAnalysis, deleteAnalysis, getAnalysesByFilter } from '@/lib/database';

// GET - Get all analyses or filtered analyses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      type: searchParams.get('type') || undefined,
      title: searchParams.get('title') || undefined,
      trend: searchParams.get('trend') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };

    // Check if any filters are applied
    const hasFilters = Object.values(filters).some(filter => filter !== undefined);
    
    const analyses = hasFilters 
      ? await getAnalysesByFilter(filters)
      : await getAllAnalyses();

    return NextResponse.json({ success: true, analyses });
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

// POST - Add new analysis
export async function POST(request: NextRequest) {
  try {
    const analysis = await request.json();
    await addAnalysis(analysis);
    
    return NextResponse.json({ success: true, message: 'Analysis added successfully' });
  } catch (error) {
    console.error('Error adding analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add analysis' },
      { status: 500 }
    );
  }
}

// DELETE - Delete analysis
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    await deleteAnalysis(id);
    
    return NextResponse.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete analysis' },
      { status: 500 }
    );
  }
} 