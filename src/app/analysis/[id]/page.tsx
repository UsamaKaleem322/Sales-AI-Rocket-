'use client';

import {
  Box,
  Container,
  Typography,
  IconButton,
  Chip,
  Button,
  alpha,
  LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { colors } from '@/styles/colors';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { useAnalysisStore, AnalysisResult } from '@/lib/store';

// TabButton component
const TabButton = ({ children, active, onClick }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    sx={{
      color: active ? '#4caf50' : 'text.secondary',
      borderBottom: active ? `2px solid #4caf50` : 'none',
      borderRadius: 0,
      textTransform: 'none',
      fontSize: '0.95rem',
      fontWeight: 500,
      px: 3,
      py: 2,
      '&:hover': {
        backgroundColor: active ? 'transparent' : alpha('#4caf50', 0.05),
      },
    }}
  >
    {children}
  </Button>
);

const AnalysisOverview = ({ analysis }: { analysis: AnalysisResult }) => {
  // Handle both data structures
  const sentiment = analysis.analysis?.sentiment || analysis.metrics?.sentiment || 'neutral';
  const riskLevel = analysis.analysis?.riskLevel || analysis.metrics?.riskLevel || 'Low';
  const healthScore = analysis.analysis?.healthScore || analysis.metrics?.score || 0;
  const client = analysis.client || analysis.title || 'Unknown Client';
  const teamMember = analysis.teamMember || 'Unknown Team Member';
  const timestamp = analysis.timestamp || analysis.createdAt || new Date().toISOString();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                AI Analysis - {client}
              </Typography>
              <Chip
                label={sentiment}
                size="small"
                sx={{
                  backgroundColor: sentiment === 'positive' 
                    ? alpha(colors.success.main, 0.1)
                    : sentiment === 'negative'
                    ? alpha(colors.error.main, 0.1)
                    : alpha(colors.warning.main, 0.1),
                  color: sentiment === 'positive'
                    ? colors.success.main
                    : sentiment === 'negative'
                    ? colors.error.main
                    : colors.warning.main,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(timestamp).toLocaleDateString()} • {teamMember}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography variant="body2" color="text.secondary">
                  AI Generated
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Health:
            </Typography>
            <Typography variant="body1" sx={{ color: colors.success.main, fontWeight: 600 }}>
              {healthScore}%
            </Typography>
            <IconButton size="small">
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Summary:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3, mb: 3 }}>
          {(analysis.analysis?.summary || analysis.insights || []).map((point, idx) => (
            <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {point}
            </Typography>
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Key Insights:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {(analysis.analysis?.insights || analysis.insights || []).map((insight, idx) => (
            <Chip
              key={idx}
              label={insight}
              size="small"
              sx={{
                backgroundColor: alpha(colors.primary.main, 0.1),
                color: colors.primary.main,
                borderRadius: 1,
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Recommendations:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 3 }}>
          {(analysis.analysis?.recommendations || analysis.recommendations || []).map((rec, idx) => (
            <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {rec}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const SentimentAnalysis = ({ analysis }: { analysis: AnalysisResult }) => {
  // Handle both data structures
  const sentiment = analysis.analysis?.sentiment || analysis.metrics?.sentiment || 'neutral';
  const summary = analysis.analysis?.summary || analysis.insights || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Sentiment Analysis
      </Typography>
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Overall Sentiment
          </Typography>
          <Chip
            label={sentiment}
            size="medium"
            sx={{
              backgroundColor: sentiment === 'positive' 
                ? alpha(colors.success.main, 0.1)
                : sentiment === 'negative'
                ? alpha(colors.error.main, 0.1)
                : alpha(colors.warning.main, 0.1),
              color: sentiment === 'positive'
                ? colors.success.main
                : sentiment === 'negative'
                ? colors.error.main
                : colors.warning.main,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sentiment Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ color: colors.success.main, fontWeight: 600 }}>
              {sentiment === 'positive' ? 85 : sentiment === 'negative' ? 35 : 65}%
            </Typography>
            <Box sx={{ flex: 1, height: 8, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  width: `${sentiment === 'positive' ? 85 : sentiment === 'negative' ? 35 : 65}%`,
                  height: '100%',
                  backgroundColor: sentiment === 'positive' ? colors.success.main : 
                                 sentiment === 'negative' ? colors.error.main : colors.warning.main,
                  borderRadius: 4,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          The AI analysis indicates a {sentiment} sentiment throughout the meeting, 
          with key points focusing on {Array.isArray(summary) && summary.length > 0 ? summary.slice(0, 2).join(' and ') : 'various topics'}.
        </Typography>
      </Box>
    </Box>
  );
};

const RiskAssessment = ({ analysis }: { analysis: AnalysisResult }) => {
  // Handle both data structures
  const riskLevel = analysis.analysis?.riskLevel || analysis.metrics?.riskLevel || 'Low';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Risk Assessment
      </Typography>
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Risk Level
          </Typography>
          <Chip
            label={riskLevel}
            size="medium"
            sx={{
              backgroundColor: riskLevel === 'High' 
                ? alpha(colors.error.main, 0.1)
                : riskLevel === 'Medium'
                ? alpha(colors.warning.main, 0.1)
                : alpha(colors.success.main, 0.1),
              color: riskLevel === 'High'
                ? colors.error.main
                : riskLevel === 'Medium'
                ? colors.warning.main
                : colors.success.main,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Risk Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ 
              color: riskLevel === 'High' ? colors.error.main : 
                     riskLevel === 'Medium' ? colors.warning.main : colors.success.main, 
              fontWeight: 600 
            }}>
              {riskLevel === 'High' ? 85 : riskLevel === 'Medium' ? 55 : 25}%
            </Typography>
            <Box sx={{ flex: 1, height: 8, backgroundColor: alpha(colors.grey[700], 0.2), borderRadius: 4, overflow: 'hidden' }}>
              <Box
                sx={{
                  width: `${riskLevel === 'High' ? 85 : riskLevel === 'Medium' ? 55 : 25}%`,
                  height: '100%',
                  backgroundColor: riskLevel === 'High' ? colors.error.main : 
                                 riskLevel === 'Medium' ? colors.warning.main : colors.success.main,
                  borderRadius: 4,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          The AI analysis indicates a {riskLevel.toLowerCase()} risk level for this meeting, 
          requiring {riskLevel === 'High' ? 'immediate attention' : riskLevel === 'Medium' ? 'monitoring' : 'standard follow-up'}.
        </Typography>
      </Box>
    </Box>
  );
};

const ActionItems = ({ analysis }: { analysis: AnalysisResult }) => {
  // Handle both data structures
  const actionItems = analysis.analysis?.actionItems || analysis.insights || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Action Items
      </Typography>
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        }}
      >
        {Array.isArray(actionItems) && actionItems.length > 0 ? (
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {actionItems.map((item, idx) => (
              <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 2 }}>
                {item}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No specific action items identified in this analysis.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const Recommendations = ({ analysis }: { analysis: AnalysisResult }) => {
  // Handle both data structures
  const recommendations = analysis.analysis?.recommendations || analysis.recommendations || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Recommendations
      </Typography>
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        }}
      >
        {Array.isArray(recommendations) && recommendations.length > 0 ? (
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {recommendations.map((rec, idx) => (
              <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 2 }}>
                {rec}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No specific recommendations available for this analysis.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default function AnalysisDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analysis/${id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setAnalysis(result.data);
          } else {
            console.error('Failed to fetch analysis:', result.error);
          }
        } else {
          console.error('Failed to fetch analysis:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  const renderContent = () => {
    if (!analysis) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
            Analysis Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The requested analysis could not be found.
          </Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <AnalysisOverview analysis={analysis} />;
      case 'sentiment':
        return <SentimentAnalysis analysis={analysis} />;
      case 'risk':
        return <RiskAssessment analysis={analysis} />;
      case 'actions':
        return <ActionItems analysis={analysis} />;
      case 'recommendations':
        return <Recommendations analysis={analysis} />;
      default:
        return <AnalysisOverview analysis={analysis} />;
    }
  };

  if (!analysis) {
    return (
      <Layout>
        <Box sx={{ backgroundColor: colors.background.default, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Loading analysis...
          </Typography>
        </Box>
      </Layout>
    );
  }

  // Handle both data structures for the header
  const sentiment = analysis.analysis?.sentiment || analysis.metrics?.sentiment || 'neutral';
  const riskLevel = analysis.analysis?.riskLevel || analysis.metrics?.riskLevel || 'Low';
  const healthScore = analysis.analysis?.healthScore || analysis.metrics?.score || 0;
  const client = analysis.client || analysis.title || 'Unknown Client';
  const teamMember = analysis.teamMember || 'Unknown Team Member';
  const timestamp = analysis.timestamp || analysis.createdAt || new Date().toISOString();

  return (
    <Layout>
      <Box sx={{ backgroundColor: colors.background.default, minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ borderBottom: `1px solid ${alpha(colors.grey[700], 0.2)}` }}>
          <Container maxWidth="xl">
            <Box sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <IconButton
                  onClick={() => router.back()}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(colors.primary.main, 0.1),
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  Back to Dashboard
                </Typography>
              </Box>

              <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        AI Analysis Details
                      </Typography>
                      <Chip
                        label={sentiment}
                        size="small"
                        sx={{
                          backgroundColor: sentiment === 'positive' 
                            ? alpha(colors.success.main, 0.1)
                            : sentiment === 'negative'
                            ? alpha(colors.error.main, 0.1)
                            : alpha(colors.warning.main, 0.1),
                          color: sentiment === 'positive'
                            ? colors.success.main
                            : sentiment === 'negative'
                            ? colors.error.main
                            : colors.warning.main,
                          borderRadius: 1,
                        }}
                      />
                      <Chip
                        label={riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: riskLevel === 'High' 
                            ? alpha(colors.error.main, 0.1)
                            : riskLevel === 'Medium'
                            ? alpha(colors.warning.main, 0.1)
                            : alpha(colors.success.main, 0.1),
                          color: riskLevel === 'High'
                            ? colors.error.main
                            : riskLevel === 'Medium'
                            ? colors.warning.main
                            : colors.success.main,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {client} • {teamMember} • {new Date(timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                      {healthScore}%
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ChatIcon />}
                      sx={{
                        backgroundColor: '#4caf50',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                          backgroundColor: '#388e3c',
                        },
                      }}
                    >
                      Export Report
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip
                    label="AI Generated"
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    label="Real-time Analysis"
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      color: 'text.primary',
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    label="Meeting Insights"
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      color: 'text.primary',
                      borderRadius: 1,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Health Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" sx={{ color: colors.success.main, fontWeight: 600 }}>
                        {healthScore}%
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          height: 8,
                          backgroundColor: alpha(colors.success.main, 0.2),
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${healthScore}%`,
                            height: '100%',
                            backgroundColor: colors.success.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sentiment
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {sentiment}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Analysis
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Action Items
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {analysis.analysis?.actionItems?.length || analysis.insights?.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Identified
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Level
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {riskLevel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assessment
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: `1px solid ${alpha(colors.grey[700], 0.2)}` }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
                Analysis Overview
              </TabButton>
              <TabButton active={activeTab === 'sentiment'} onClick={() => setActiveTab('sentiment')}>
                Sentiment Analysis
              </TabButton>
              <TabButton active={activeTab === 'risk'} onClick={() => setActiveTab('risk')}>
                Risk Assessment
              </TabButton>
              <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')}>
                Action Items
              </TabButton>
              <TabButton active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')}>
                Recommendations
              </TabButton>
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
} 