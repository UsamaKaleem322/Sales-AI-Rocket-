import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisById } from '@/lib/database';

// GET - Get analysis by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    const analysis = await getAnalysisById(id);
    
    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Transform AnalysisResponse to AnalysisResult format
    const analysisResult = {
      id: analysis.id,
      type: analysis.type,
      title: analysis.title,
      client: analysis.title, // Use title as client for now
      teamMember: 'Unknown Team Member', // Default value
      transcription: '', // Default value
      timestamp: analysis.createdAt.toISOString(),
      createdAt: analysis.createdAt,
      summary: analysis.summary.includes(' | ') ? analysis.summary.split(' | ') : [analysis.summary],
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      metrics: analysis.metrics,
      analysis: {
        summary: analysis.summary.includes(' | ') ? analysis.summary.split(' | ') : [analysis.summary],
        actionItems: analysis.insights, // Use insights as action items
        sentiment: (analysis.metrics as any).sentiment || 'neutral',
        riskLevel: (analysis.metrics as any).riskLevel || 'Low',
        healthScore: analysis.metrics.score || 0,
        recommendations: analysis.recommendations,
      },
    };

    return NextResponse.json({ success: true, data: analysisResult });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
} 