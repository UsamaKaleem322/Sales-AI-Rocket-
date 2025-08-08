import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses, addAnalysis, deleteAnalysis, getAnalysesByFilter } from '@/lib/database';
import { AnalysisResponse } from '@/lib/openai';

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
      sentiment: searchParams.get('sentiment') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      teamMember: searchParams.get('teamMember') || undefined,
      client: searchParams.get('client') || undefined,
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
    const analysisData = await request.json();
    
    console.log('Received analysis data:', JSON.stringify(analysisData, null, 2));
    
    // Transform AnalysisResult to AnalysisResponse format
    const analysisResponse: AnalysisResponse = {
      id: analysisData.id || `analysis_${Date.now()}`,
      type: analysisData.type || 'meeting',
      title: analysisData.title || `${analysisData.client || 'Unknown Client'} - ${analysisData.teamMember || 'Unknown Team Member'}`,
      summary: Array.isArray(analysisData.analysis?.summary) 
        ? analysisData.analysis.summary.join('\n') 
        : analysisData.analysis?.summary || analysisData.summary || 'Analysis completed',
      insights: analysisData.analysis?.actionItems || analysisData.analysis?.insights || analysisData.insights || [],
      recommendations: analysisData.analysis?.recommendations || analysisData.recommendations || [],
      metrics: {
        score: analysisData.analysis?.healthScore || analysisData.metrics?.score || 0,
        trend: analysisData.metrics?.trend || 'stable',
        confidence: analysisData.metrics?.confidence || 0,
        sentiment: analysisData.analysis?.sentiment || analysisData.metrics?.sentiment || 'neutral',
        riskLevel: analysisData.analysis?.riskLevel || analysisData.metrics?.riskLevel || 'Low',
      },
      createdAt: analysisData.createdAt || new Date(),
    };

    console.log('Transformed analysis response:', JSON.stringify(analysisResponse, null, 2));

    await addAnalysis(analysisResponse);
    
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