import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const analyses = await getAllAnalyses();
    
    // Group by team member and calculate performance metrics
    const teamData = analyses.reduce((acc, analysis) => {
      const teamMember = analysis.title?.split(' - ')[1] || 'Unknown';
      if (!acc[teamMember]) {
        acc[teamMember] = {
          meetings: 0,
          totalHealthScore: 0,
          positiveMeetings: 0,
          highRiskMeetings: 0,
          actionItems: 0
        };
      }
      
      acc[teamMember].meetings++;
      acc[teamMember].totalHealthScore += analysis.metrics?.score || 0;
      
      if (analysis.metrics?.sentiment === 'positive') {
        acc[teamMember].positiveMeetings++;
      }
      
      if (analysis.metrics?.riskLevel === 'High') {
        acc[teamMember].highRiskMeetings++;
      }
      
      // Count action items from insights
      const insights = analysis.insights || [];
      acc[teamMember].actionItems += insights.length;
      
      return acc;
    }, {} as Record<string, {
      meetings: number;
      totalHealthScore: number;
      positiveMeetings: number;
      highRiskMeetings: number;
      actionItems: number;
    }>);

    // Calculate performance metrics
    const performance = Object.entries(teamData).map(([teamMember, data]) => ({
      teamMember,
      meetings: data.meetings,
      averageHealthScore: Math.round(data.totalHealthScore / data.meetings),
      positiveRate: Math.round((data.positiveMeetings / data.meetings) * 100),
      riskRate: Math.round((data.highRiskMeetings / data.meetings) * 100),
      averageActionItems: Math.round(data.actionItems / data.meetings)
    }));

    return NextResponse.json({
      success: true,
      performance,
      totalAnalyses: analyses.length
    });
  } catch (error) {
    console.error('Error fetching team performance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team performance' },
      { status: 500 }
    );
  }
}
