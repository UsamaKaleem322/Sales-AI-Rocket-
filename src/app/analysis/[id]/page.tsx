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

const AnalysisOverview = ({ analysis }: { analysis: AnalysisResult }) => (
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
              AI Analysis - {analysis.client}
            </Typography>
            <Chip
              label={analysis.analysis.sentiment}
              size="small"
              sx={{
                backgroundColor: analysis.analysis.sentiment === 'positive' 
                  ? alpha(colors.success.main, 0.1)
                  : analysis.analysis.sentiment === 'negative'
                  ? alpha(colors.error.main, 0.1)
                  : alpha(colors.warning.main, 0.1),
                color: analysis.analysis.sentiment === 'positive'
                  ? colors.success.main
                  : analysis.analysis.sentiment === 'negative'
                  ? colors.error.main
                  : colors.warning.main,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(analysis.timestamp).toLocaleDateString()} • {analysis.teamMember}
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
            {analysis.analysis.healthScore}%
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
        {analysis.analysis.summary.map((point, idx) => (
          <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 1 }}>
            {point}
          </Typography>
        ))}
      </Box>

      {analysis.analysis.actionItems.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Action Items:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, mb: 3 }}>
            {analysis.analysis.actionItems.map((item, idx) => (
              <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 1 }}>
                {item}
              </Typography>
            ))}
          </Box>
        </>
      )}

      {analysis.analysis.recommendations.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Recommendations:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {analysis.analysis.recommendations.map((rec, idx) => (
              <Typography key={idx} component="li" variant="body2" color="text.primary" sx={{ mb: 1 }}>
                {rec}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </Box>
  </Box>
);

const SentimentAnalysis = ({ analysis }: { analysis: AnalysisResult }) => (
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
          label={analysis.analysis.sentiment}
          size="medium"
          sx={{
            backgroundColor: analysis.analysis.sentiment === 'positive' 
              ? alpha(colors.success.main, 0.1)
              : analysis.analysis.sentiment === 'negative'
              ? alpha(colors.error.main, 0.1)
              : alpha(colors.warning.main, 0.1),
            color: analysis.analysis.sentiment === 'positive'
              ? colors.success.main
              : analysis.analysis.sentiment === 'negative'
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
            {analysis.analysis.sentiment === 'positive' ? 85 : analysis.analysis.sentiment === 'negative' ? 35 : 65}%
          </Typography>
          <Box sx={{ flex: 1, height: 8, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 4, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${analysis.analysis.sentiment === 'positive' ? 85 : analysis.analysis.sentiment === 'negative' ? 35 : 65}%`,
                height: '100%',
                backgroundColor: analysis.analysis.sentiment === 'positive' ? colors.success.main : 
                               analysis.analysis.sentiment === 'negative' ? colors.error.main : colors.warning.main,
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        The AI analysis indicates a {analysis.analysis.sentiment} sentiment throughout the meeting, 
        with key points focusing on {analysis.analysis.summary.slice(0, 2).join(' and ')}.
      </Typography>
    </Box>
  </Box>
);

const RiskAssessment = ({ analysis }: { analysis: AnalysisResult }) => (
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
          label={analysis.analysis.riskLevel}
          size="medium"
          sx={{
            backgroundColor: analysis.analysis.riskLevel === 'High' 
              ? alpha(colors.error.main, 0.1)
              : analysis.analysis.riskLevel === 'Medium'
              ? alpha(colors.warning.main, 0.1)
              : alpha(colors.success.main, 0.1),
            color: analysis.analysis.riskLevel === 'High'
              ? colors.error.main
              : analysis.analysis.riskLevel === 'Medium'
              ? colors.warning.main
              : colors.success.main,
            fontWeight: 600,
            fontSize: '1rem',
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Risk Factors Identified
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {analysis.analysis.riskLevel === 'High' && (
            <>
              <Typography variant="body2" color="text.primary">• Potential scope creep identified</Typography>
              <Typography variant="body2" color="text.primary">• Timeline concerns raised</Typography>
              <Typography variant="body2" color="text.primary">• Resource allocation issues</Typography>
            </>
          )}
          {analysis.analysis.riskLevel === 'Medium' && (
            <>
              <Typography variant="body2" color="text.primary">• Minor timeline adjustments needed</Typography>
              <Typography variant="body2" color="text.primary">• Communication improvements suggested</Typography>
            </>
          )}
          {analysis.analysis.riskLevel === 'Low' && (
            <>
              <Typography variant="body2" color="text.primary">• Project on track</Typography>
              <Typography variant="body2" color="text.primary">• Clear communication established</Typography>
            </>
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Based on the meeting content, the AI has identified a {analysis.analysis.riskLevel.toLowerCase()} risk level 
        with {analysis.analysis.actionItems.length} actionable items to address.
      </Typography>
    </Box>
  </Box>
);

const ActionItems = ({ analysis }: { analysis: AnalysisResult }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
      Action Items
    </Typography>
    {analysis.analysis.actionItems.length === 0 ? (
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 4,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No action items identified in this analysis.
        </Typography>
      </Box>
    ) : (
      analysis.analysis.actionItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: colors.background.paper,
            borderRadius: 2,
            p: 3,
            border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                {item}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Assigned: {analysis.teamMember}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {new Date(analysis.timestamp).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Chip
              label="Pending"
              size="small"
              sx={{
                backgroundColor: alpha(colors.warning.main, 0.1),
                color: colors.warning.main,
              }}
            />
          </Box>
        </Box>
      ))
    )}
  </Box>
);

const Recommendations = ({ analysis }: { analysis: AnalysisResult }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
      AI Recommendations
    </Typography>
    {analysis.analysis.recommendations.length === 0 ? (
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 4,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No specific recommendations generated for this analysis.
        </Typography>
      </Box>
    ) : (
      analysis.analysis.recommendations.map((rec, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: colors.background.paper,
            borderRadius: 2,
            p: 3,
            border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          }}
        >
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            {rec}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon sx={{ color: colors.primary.main, fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              AI Generated Recommendation
            </Typography>
          </Box>
        </Box>
      ))
    )}
  </Box>
);

export default function AnalysisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { analyses, loadAnalyses } = useAnalysisStore();

  // Get the specific analysis by ID
  const analysis = analyses.find(a => a.id === params.id);

  // Load analyses if not already loaded
  useEffect(() => {
    if (analyses.length === 0) {
      loadAnalyses();
    }
  }, [analyses.length, loadAnalyses]);

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
                        label={analysis.analysis.sentiment}
                        size="small"
                        sx={{
                          backgroundColor: analysis.analysis.sentiment === 'positive' 
                            ? alpha(colors.success.main, 0.1)
                            : analysis.analysis.sentiment === 'negative'
                            ? alpha(colors.error.main, 0.1)
                            : alpha(colors.warning.main, 0.1),
                          color: analysis.analysis.sentiment === 'positive'
                            ? colors.success.main
                            : analysis.analysis.sentiment === 'negative'
                            ? colors.error.main
                            : colors.warning.main,
                          borderRadius: 1,
                        }}
                      />
                      <Chip
                        label={analysis.analysis.riskLevel}
                        size="small"
                        sx={{
                          backgroundColor: analysis.analysis.riskLevel === 'High' 
                            ? alpha(colors.error.main, 0.1)
                            : analysis.analysis.riskLevel === 'Medium'
                            ? alpha(colors.warning.main, 0.1)
                            : alpha(colors.success.main, 0.1),
                          color: analysis.analysis.riskLevel === 'High'
                            ? colors.error.main
                            : analysis.analysis.riskLevel === 'Medium'
                            ? colors.warning.main
                            : colors.success.main,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {analysis.client} • {analysis.teamMember} • {new Date(analysis.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                      {analysis.analysis.healthScore}%
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
                        {analysis.analysis.healthScore}%
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
                            width: `${analysis.analysis.healthScore}%`,
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
                      {analysis.analysis.sentiment}
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
                      {analysis.analysis.actionItems.length}
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
                      {analysis.analysis.riskLevel}
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