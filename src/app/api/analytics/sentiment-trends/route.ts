import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const analyses = await getAllAnalyses();
    
    // Group by sentiment and calculate trends
    const sentimentData = analyses.reduce((acc, analysis) => {
      const sentiment = analysis.metrics?.sentiment || 'neutral';
      if (!acc[sentiment]) {
        acc[sentiment] = { count: 0, healthScores: [] };
      }
      acc[sentiment].count++;
      acc[sentiment].healthScores.push(analysis.metrics?.score || 0);
      return acc;
    }, {} as Record<string, { count: number; healthScores: number[] }>);

    // Calculate averages and trends
    const trends = Object.entries(sentimentData).map(([sentiment, data]) => ({
      sentiment,
      count: data.count,
      averageHealthScore: Math.round(data.healthScores.reduce((sum, score) => sum + score, 0) / data.healthScores.length),
      percentage: Math.round((data.count / analyses.length) * 100)
    }));

    return NextResponse.json({
      success: true,
      trends,
      totalAnalyses: analyses.length
    });
  } catch (error) {
    console.error('Error fetching sentiment trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sentiment trends' },
      { status: 500 }
    );
  }
}
