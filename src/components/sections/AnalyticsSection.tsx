'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  alpha,
  CircularProgress,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  SentimentSatisfiedAlt as SentimentIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { colors } from '@/styles/colors';
import { useState, useEffect } from 'react';

interface AnalyticsData {
  sentimentTrends: any[];
  riskDistribution: any[];
  teamPerformance: any[];
  totalAnalyses: number;
}

export const AnalyticsSection = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics data in parallel
        const [sentimentRes, riskRes, teamRes] = await Promise.all([
          fetch('/api/analytics/sentiment-trends'),
          fetch('/api/analytics/risk-distribution'),
          fetch('/api/analytics/team-performance')
        ]);

        const [sentimentData, riskData, teamData] = await Promise.all([
          sentimentRes.json(),
          riskRes.json(),
          teamRes.json()
        ]);

        if (sentimentData.success && riskData.success && teamData.success) {
          setAnalyticsData({
            sentimentTrends: sentimentData.trends,
            riskDistribution: riskData.distribution,
            teamPerformance: teamData.performance,
            totalAnalyses: sentimentData.totalAnalyses
          });
        } else {
          throw new Error('Failed to fetch analytics data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress sx={{ color: colors.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
          No Analytics Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create some analyses to see analytics insights.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: colors.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Comprehensive insights from {analyticsData.totalAnalyses} meeting analyses
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Sentiment Trends */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.1)} 0%, ${alpha(colors.primary.dark, 0.05)} 100%)`,
                border: `1px solid ${alpha(colors.primary.main, 0.2)}`,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SentimentIcon sx={{ color: colors.primary.main, fontSize: 24 }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Sentiment Trends
                </Typography>
              </Box>
              
              {analyticsData.sentimentTrends.map((trend) => (
                <Box key={trend.sentiment} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={trend.sentiment}
                        size="small"
                        sx={{
                          backgroundColor: trend.sentiment === 'positive' 
                            ? alpha(colors.success.main, 0.1)
                            : trend.sentiment === 'negative'
                            ? alpha(colors.error.main, 0.1)
                            : alpha(colors.warning.main, 0.1),
                          color: trend.sentiment === 'positive'
                            ? colors.success.main
                            : trend.sentiment === 'negative'
                            ? colors.error.main
                            : colors.warning.main,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {trend.count} meetings ({trend.percentage}%)
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.success.main, fontWeight: 600 }}>
                      {trend.averageHealthScore}% avg
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={trend.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: trend.sentiment === 'positive' 
                          ? colors.success.main
                          : trend.sentiment === 'negative'
                          ? colors.error.main
                          : colors.warning.main,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Risk Distribution */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(colors.warning.main, 0.1)} 0%, ${alpha(colors.warning.dark, 0.05)} 100%)`,
                border: `1px solid ${alpha(colors.warning.main, 0.2)}`,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <WarningIcon sx={{ color: colors.warning.main, fontSize: 24 }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Risk Distribution
                </Typography>
              </Box>
              
              {analyticsData.riskDistribution.map((risk) => (
                <Box key={risk.riskLevel} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={risk.riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: risk.riskLevel === 'High' 
                            ? alpha(colors.error.main, 0.1)
                            : risk.riskLevel === 'Medium'
                            ? alpha(colors.warning.main, 0.1)
                            : alpha(colors.success.main, 0.1),
                          color: risk.riskLevel === 'High'
                            ? colors.error.main
                            : risk.riskLevel === 'Medium'
                            ? colors.warning.main
                            : colors.success.main,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {risk.count} meetings ({risk.percentage}%)
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.success.main, fontWeight: 600 }}>
                      {risk.averageHealthScore}% avg
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={risk.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: risk.riskLevel === 'High' 
                          ? colors.error.main
                          : risk.riskLevel === 'Medium'
                          ? colors.warning.main
                          : colors.success.main,
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Team Performance */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${alpha(colors.success.main, 0.1)} 0%, ${alpha(colors.success.dark, 0.05)} 100%)`,
                border: `1px solid ${alpha(colors.success.main, 0.2)}`,
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PeopleIcon sx={{ color: colors.success.main, fontSize: 24 }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Team Performance
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                {analyticsData.teamPerformance.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.teamMember}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: alpha(colors.background.paper, 0.8),
                        borderRadius: 2,
                        border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                        {member.teamMember}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Meetings:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {member.meetings}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Avg Health:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.success.main, fontWeight: 600 }}>
                            {member.averageHealthScore}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Positive Rate:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.success.main, fontWeight: 600 }}>
                            {member.positiveRate}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Risk Rate:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.error.main, fontWeight: 600 }}>
                            {member.riskRate}%
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Avg Actions:
                          </Typography>
                          <Typography variant="body2" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                            {member.averageActionItems}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
