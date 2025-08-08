import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const analyses = await getAllAnalyses();
    
    // Group by risk level and calculate distribution
    const riskData = analyses.reduce((acc, analysis) => {
      const riskLevel = analysis.metrics?.riskLevel || 'Low';
      if (!acc[riskLevel]) {
        acc[riskLevel] = { count: 0, healthScores: [] };
      }
      acc[riskLevel].count++;
      acc[riskLevel].healthScores.push(analysis.metrics?.score || 0);
      return acc;
    }, {} as Record<string, { count: number; healthScores: number[] }>);

    // Calculate distribution and averages
    const distribution = Object.entries(riskData).map(([riskLevel, data]) => ({
      riskLevel,
      count: data.count,
      averageHealthScore: Math.round(data.healthScores.reduce((sum, score) => sum + score, 0) / data.healthScores.length),
      percentage: Math.round((data.count / analyses.length) * 100)
    }));

    return NextResponse.json({
      success: true,
      distribution,
      totalAnalyses: analyses.length
    });
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk distribution' },
      { status: 500 }
    );
  }
}
