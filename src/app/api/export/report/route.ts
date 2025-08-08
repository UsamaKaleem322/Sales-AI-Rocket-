import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { filters } = await request.json();
    const analyses = await getAllAnalyses();
    
    // Apply filters if provided
    let filteredAnalyses = analyses;
    if (filters) {
      filteredAnalyses = analyses.filter(analysis => {
        if (filters.sentiment && analysis.metrics?.sentiment !== filters.sentiment) return false;
        if (filters.riskLevel && analysis.metrics?.riskLevel !== filters.riskLevel) return false;
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (analysis.createdAt < fromDate) return false;
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (analysis.createdAt > toDate) return false;
        }
        return true;
      });
    }

    // Generate comprehensive report
    const report = {
      summary: {
        totalAnalyses: filteredAnalyses.length,
        dateRange: {
          from: filteredAnalyses.length > 0 ? new Date(Math.min(...filteredAnalyses.map(a => new Date(a.createdAt).getTime())) : null,
          to: filteredAnalyses.length > 0 ? new Date(Math.max(...filteredAnalyses.map(a => new Date(a.createdAt).getTime()))) : null,
        },
        averageHealthScore: Math.round(filteredAnalyses.reduce((sum, a) => sum + (a.metrics?.score || 0), 0) / filteredAnalyses.length),
      },
      sentimentAnalysis: {
        positive: filteredAnalyses.filter(a => a.metrics?.sentiment === 'positive').length,
        neutral: filteredAnalyses.filter(a => a.metrics?.sentiment === 'neutral').length,
        negative: filteredAnalyses.filter(a => a.metrics?.sentiment === 'negative').length,
      },
      riskAnalysis: {
        low: filteredAnalyses.filter(a => a.metrics?.riskLevel === 'Low').length,
        medium: filteredAnalyses.filter(a => a.metrics?.riskLevel === 'Medium').length,
        high: filteredAnalyses.filter(a => a.metrics?.riskLevel === 'High').length,
      },
      detailedInsights: filteredAnalyses.map(analysis => ({
        id: analysis.id,
        title: analysis.title,
        date: analysis.createdAt,
        sentiment: analysis.metrics?.sentiment,
        riskLevel: analysis.metrics?.riskLevel,
        healthScore: analysis.metrics?.score,
        summary: analysis.summary,
        insights: analysis.insights,
        recommendations: analysis.recommendations,
      })),
      actionItems: filteredAnalyses.flatMap(analysis => 
        (analysis.insights || []).map(item => ({
          item,
          analysisId: analysis.id,
          date: analysis.createdAt,
          sentiment: analysis.metrics?.sentiment,
        }))
      ),
      recommendations: filteredAnalyses.flatMap(analysis => 
        (analysis.recommendations || []).map(rec => ({
          recommendation: rec,
          analysisId: analysis.id,
          date: analysis.createdAt,
          sentiment: analysis.metrics?.sentiment,
        }))
      ),
    };

    return NextResponse.json({
      success: true,
      report,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
