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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotesIcon from '@mui/icons-material/Notes';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { colors } from '@/styles/colors';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';
import { useAnalysisStore, AnalysisResult } from '@/lib/store';

// Types
interface MeetingData {
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: number;
  health: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string[];
  tags: string[];
}

interface HealthTrend {
  date: string;
  score: number;
  change: number;
}

interface ActionItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate: string;
  assignee: string;
}

interface Note {
  id: string;
  content: string;
  date: string;
  tags: string[];
}

// Sample Data
const meetingsData: MeetingData[] = [
  {
    title: 'Strategic Review',
    date: '2024-01-10',
    time: '14:00',
    duration: '60 min',
    attendees: 3,
    health: 92,
    sentiment: 'positive',
    summary: [
      'Reviewed Q4 deliverables and timeline',
      'Discussed expansion opportunities for 2024',
      'Client very satisfied with current progress'
    ],
    tags: ['positive']
  },
  {
    title: 'Weekly Check-in',
    date: '2024-01-03',
    time: '10:30',
    duration: '45 min',
    attendees: 2,
    health: 78,
    sentiment: 'neutral',
    summary: [
      'Discussed minor delays in feature delivery',
      'Addressed resource allocation concerns',
      'Reviewed upcoming sprint planning'
    ],
    tags: ['neutral', 'Resource Constraints']
  }
];

const healthTrends: HealthTrend[] = [
  { date: '2023-12', score: 85, change: 5 },
  { date: '2024-01', score: 92, change: 7 },
];

const actionItems: ActionItem[] = [
  {
    id: '1',
    title: 'Follow up on resource allocation plan',
    status: 'pending',
    dueDate: '2024-01-20',
    assignee: 'Sarah Chen'
  },
  {
    id: '2',
    title: 'Prepare Q1 2024 roadmap presentation',
    status: 'completed',
    dueDate: '2024-01-15',
    assignee: 'Mike Johnson'
  }
];

const notes: Note[] = [
  {
    id: '1',
    content: 'Client expressed interest in expanding to new markets in Q2 2024',
    date: '2024-01-10',
    tags: ['expansion', 'opportunity']
  },
  {
    id: '2',
    content: 'Need to address technical debt in legacy systems',
    date: '2024-01-03',
    tags: ['technical', 'improvement']
  }
];

const TabButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <Button
    variant="text"
    onClick={onClick}
    sx={{
      color: active ? '#4caf50' : 'text.secondary',
      textTransform: 'none',
      fontSize: '0.95rem',
      fontWeight: 500,
      px: 2,
      py: 1.5,
      borderBottom: active ? `2px solid #4caf50` : '2px solid transparent',
      borderRadius: 0,
      '&:hover': {
        backgroundColor: alpha('#4caf50', 0.05),
      },
    }}
  >
    {children}
  </Button>
);

const MeetingTimeline = ({ analyses }: { analyses: AnalysisResult[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    {analyses.length === 0 ? (
      <Box
        sx={{
          backgroundColor: colors.background.paper,
          borderRadius: 2,
          p: 4,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
          No Analyses Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first analysis to see meeting insights here.
        </Typography>
      </Box>
    ) : (
      analyses.map((analysis, index) => (
        <Box
          key={analysis.id}
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
      ))
    )}
  </Box>
);

const HealthTrends = ({ analyses }: { analyses: AnalysisResult[] }) => {
  const trends = analyses.map(analysis => ({
    date: new Date(analysis.timestamp).toLocaleDateString(),
    score: analysis.analysis.healthScore,
    change: 0, // You could calculate this based on previous analyses
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Health Score Trends
      </Typography>
      {trends.length === 0 ? (
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
            No health data available yet.
          </Typography>
        </Box>
      ) : (
        trends.map((trend, index) => (
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
              <Typography variant="body1" color="text.primary">
                {trend.date}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ color: colors.success.main }}>
                  {trend.score}%
                </Typography>
                <Chip
                  label={`${trend.change > 0 ? '+' : ''}${trend.change}%`}
                  size="small"
                  sx={{
                    backgroundColor: trend.change > 0 ? alpha(colors.success.main, 0.1) : alpha(colors.error.main, 0.1),
                    color: trend.change > 0 ? colors.success.main : colors.error.main,
                  }}
                />
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={trend.score}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(colors.success.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: colors.success.main,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

const ActionItems = ({ analyses }: { analyses: AnalysisResult[] }) => {
  const allActionItems = analyses.flatMap(analysis => 
    analysis.analysis.actionItems.map(item => ({
      id: `${analysis.id}-${item}`,
      title: item,
      status: 'pending' as const,
      dueDate: new Date(analysis.timestamp).toLocaleDateString(),
      assignee: analysis.teamMember,
    }))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Action Items
      </Typography>
      {allActionItems.length === 0 ? (
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
            No action items identified yet.
          </Typography>
        </Box>
      ) : (
        allActionItems.map((item) => (
          <Box
            key={item.id}
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
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Due: {item.dueDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assignee: {item.assignee}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={item.status}
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
};

const NotesAndTags = ({ analyses }: { analyses: AnalysisResult[] }) => {
  const notes = analyses.map(analysis => ({
    id: analysis.id,
    content: analysis.analysis.summary.join(' '),
    date: new Date(analysis.timestamp).toLocaleDateString(),
    tags: [analysis.analysis.sentiment, analysis.analysis.riskLevel],
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Notes & Tags
      </Typography>
      {notes.length === 0 ? (
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
            No notes available yet.
          </Typography>
        </Box>
      ) : (
        notes.map((note) => (
          <Box
            key={note.id}
            sx={{
              backgroundColor: colors.background.paper,
              borderRadius: 2,
              p: 3,
              border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
            }}
          >
            <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
              {note.content}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {note.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {note.date}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

const Analytics = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
      Analytics
    </Typography>
    <Box
      sx={{
        backgroundColor: colors.background.paper,
        borderRadius: 2,
        p: 3,
        border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        textAlign: 'center',
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Analytics dashboard coming soon...
      </Typography>
    </Box>
  </Box>
);

export default function ClientDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('timeline');
  const { analyses } = useAnalysisStore();

  // Get analyses for this specific client (you could pass client ID as param)
  const clientAnalyses = analyses.filter(analysis => 
    analysis.client.toLowerCase().includes('techcorp') || 
    analysis.client.toLowerCase().includes('techstart')
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <MeetingTimeline analyses={clientAnalyses} />;
      case 'health':
        return <HealthTrends analyses={clientAnalyses} />;
      case 'actions':
        return <ActionItems analyses={clientAnalyses} />;
      case 'notes':
        return <NotesAndTags analyses={clientAnalyses} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <MeetingTimeline analyses={clientAnalyses} />;
    }
  };

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
                  Back to Clients
                </Typography>
              </Box>

              <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        TechCorp Inc.
                      </Typography>
                      <Chip
                        label="Low Risk"
                        size="small"
                        sx={{
                          backgroundColor: alpha(colors.success.main, 0.1),
                          color: colors.success.main,
                          borderRadius: 1,
                        }}
                      />
                      <Chip
                        label="Positive Sentiment"
                        size="small"
                        sx={{
                          backgroundColor: alpha(colors.success.main, 0.1),
                          color: colors.success.main,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Technology • Mid-market (200-500 employees)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" sx={{ color: colors.primary.main, fontWeight: 600 }}>
                      $2.4M
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
                      Start Chat
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip
                    label="High Value"
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      color: 'text.primary',
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    label="Strategic"
                    size="small"
                    sx={{
                      backgroundColor: alpha(colors.grey[700], 0.2),
                      color: 'text.primary',
                      borderRadius: 1,
                    }}
                  />
                  <Chip
                    label="Expansion Ready"
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
                        {clientAnalyses.length > 0 ? Math.round(clientAnalyses.reduce((sum, a) => sum + a.analysis.healthScore, 0) / clientAnalyses.length) : 85}%
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
                            width: `${clientAnalyses.length > 0 ? Math.round(clientAnalyses.reduce((sum, a) => sum + a.analysis.healthScore, 0) / clientAnalyses.length) : 85}%`,
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
                      Assigned Lead
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      Sarah Chen
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Primary Contact
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Meetings
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      {clientAnalyses.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Since 2023-06-15
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Next Meeting
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      2024-01-17
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In 7 days
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
              <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>
                Meeting Timeline
              </TabButton>
              <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')}>
                Health Trends
              </TabButton>
              <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')}>
                Action Items
              </TabButton>
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                Notes & Tags
              </TabButton>
              <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
                Analytics
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