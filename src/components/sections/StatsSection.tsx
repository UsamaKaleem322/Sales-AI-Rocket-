'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  alpha,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
  WarningAmber as WarningAmberIcon,
  Assignment as AssignmentIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  TrendingDown as TrendingDownIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useAnalysisStore, AnalysisResult } from '@/lib/store';
import { colors } from '@/styles/colors';
import { AddAnalysisModal } from '@/components/dashboard/AddAnalysisModal';
import { FilterModal } from '@/components/dashboard/FilterModal';
import { ClientManagementModal } from '@/components/dashboard/ClientManagementModal';
import { AnalyticsSection } from './AnalyticsSection';
import { useEffect } from 'react';

// StatCard component
const StatCard = ({ title, value, icon: Icon, color }: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) => (
  <Paper
      sx={{ 
      p: 3,
      background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
      border: `1px solid ${alpha(color, 0.2)}`,
      borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
          <Box 
            sx={{ 
          width: 56,
          height: 56,
              borderRadius: 2, 
          backgroundColor: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ color: color, fontSize: 28 }} />
      </Box>
    </Box>
  </Paper>
);

// TeamMemberCard component
const TeamMemberCard = ({ name, role, performance, meetings, healthScore, trend }: {
  name: string;
  role: string;
  performance: string;
  meetings: number;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
}) => (
  <Paper
    sx={{
      p: 3,
      background: `linear-gradient(135deg, ${alpha(colors.background.paper, 0.8)} 0%, ${alpha(colors.background.paper, 0.6)} 100%)`,
      border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
      borderRadius: 3,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.15)}`,
        borderColor: colors.primary.main,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PeopleIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
        <Box>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={performance}
        size="small"
        sx={{
          backgroundColor: performance === 'Excellent' 
            ? alpha(colors.success.main, 0.1)
            : performance === 'Good'
            ? alpha(colors.primary.main, 0.1)
            : alpha(colors.warning.main, 0.1),
          color: performance === 'Excellent'
            ? colors.success.main
            : performance === 'Good'
            ? colors.primary.main
            : colors.warning.main,
          fontWeight: 500,
        }}
      />
    </Box>

    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Health Score
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ color: colors.success.main, fontWeight: 600 }}>
          {healthScore}%
        </Typography>
        <Box sx={{ flex: 1, height: 6, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${healthScore}%`,
              height: '100%',
              backgroundColor: colors.success.main,
              borderRadius: 3,
            }}
          />
        </Box>
      </Box>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ChatIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
        <Typography variant="body2" color="text.secondary">
          {meetings} meetings
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {trend === 'up' && <TrendingUpIcon sx={{ color: colors.success.main, fontSize: 20 }} />}
        {trend === 'down' && <TrendingDownIcon sx={{ color: colors.error.main, fontSize: 20 }} />}
        {trend === 'stable' && <AccessTimeIcon sx={{ color: colors.warning.main, fontSize: 20 }} />}
      </Box>
    </Box>
  </Paper>
);

// AnalysisCard component
const AnalysisCard = ({ analysis, onDelete, isTeamView = false }: { 
  analysis: AnalysisResult; 
  onDelete?: (id: string) => void;
  isTeamView?: boolean;
}) => {
  const router = useRouter();
  
  // Handle both data structures
  const sentiment = analysis.analysis?.sentiment || analysis.metrics?.sentiment || 'neutral';
  const healthScore = analysis.analysis?.healthScore || analysis.metrics?.score || 0;
  const riskLevel = analysis.analysis?.riskLevel || analysis.metrics?.riskLevel || 'Low';
  const summary = analysis.analysis?.summary || analysis.insights || [];
  
  // Extract client and team member from title or use fallbacks
  const titleParts = analysis.title?.split(' - ') || [];
  const client = analysis.client || titleParts[0] || 'Unknown Client';
  const teamMember = analysis.teamMember || titleParts[1] || 'Unknown Team Member';
  const timestamp = analysis.timestamp || analysis.createdAt || new Date().toISOString();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(analysis.id);
    }
  };

  const handleCardClick = () => {
    // Navigate to analysis detail page using Next.js router
    router.push(`/analysis/${analysis.id}`);
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 360, // Increased height to prevent content cutoff
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(colors.background.paper, 0.8)} 0%, ${alpha(colors.background.paper, 0.6)} 100%)`,
        border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${alpha(colors.primary.main, 0.15)}`,
          borderColor: colors.primary.main,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
          <Box>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
              {client}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {teamMember}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              fontWeight: 500,
            }}
          />
          {onDelete && !isTeamView && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(colors.error.main, 0.1),
                  color: colors.error.main,
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Health Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ color: colors.success.main, fontWeight: 600 }}>
            {healthScore}%
          </Typography>
          <Box sx={{ flex: 1, height: 6, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 3, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${healthScore}%`,
                height: '100%',
                backgroundColor: colors.success.main,
                borderRadius: 3,
              }}
            />
          </Box>
        </Box>
      </Box>
        
      <Box sx={{ mb: 2, flex: 1, minHeight: 0 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Key Points
        </Typography>
        {Array.isArray(summary) && summary.length > 0 ? (
          <Box>
            <Typography 
              variant="body2" 
              color="text.primary" 
              sx={{ 
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
              }}
            >
              {summary[0]}
            </Typography>
            {summary.length > 1 && (
              <Typography variant="body2" color="text.secondary">
                +{summary.length - 1} more points
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
            No summary available
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(timestamp).toLocaleDateString()}
          </Typography>
        </Box>
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
            fontWeight: 500,
          }}
        />
      </Box>
    </Paper>
  );
};

// Team member data
const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Senior Account Manager',
    performance: 'Excellent',
    meetings: 12,
    healthScore: 95,
    trend: 'up' as const,
  },
  {
    name: 'Mike Johnson',
    role: 'Account Executive',
    performance: 'Good',
    meetings: 8,
    healthScore: 87,
    trend: 'stable' as const,
  },
  {
    name: 'Emily Davis',
    role: 'Client Success Manager',
    performance: 'Excellent',
    meetings: 15,
    healthScore: 92,
    trend: 'up' as const,
  },
  {
    name: 'David Wilson',
    role: 'Sales Director',
    performance: 'Good',
    meetings: 10,
    healthScore: 84,
    trend: 'down' as const,
  },
];

interface StatsSectionProps {
  isTeamView?: boolean;
  currentUser?: any;
}

export default function StatsSection({ isTeamView = false, currentUser }: StatsSectionProps) {
  const router = useRouter();
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const [view, setView] = useState(isTeamView ? 'analysis' : 'overview');
  const { addAnalysis, analyses, loadAnalyses, isLoading, error, filters, deleteAnalysis } = useAnalysisStore();
  
  const isAdmin = currentUser?.role === 'ADMIN';

  // Load analyses on component mount
  useEffect(() => {
    loadAnalyses();
  }, [loadAnalyses]);

  // Filter analyses based on team view
  const filteredAnalyses = useMemo(() => {
    if (isTeamView && currentUser) {
      // For team view, only show analyses for the current user
      return analyses.filter(analysis => {
        const titleParts = analysis.title?.split(' - ') || [];
        const teamMember = analysis.teamMember || titleParts[1] || '';
        return teamMember.toLowerCase().includes(currentUser.name?.toLowerCase() || '');
      });
    }
    return analyses;
  }, [analyses, isTeamView, currentUser]);

  const handleOpenAnalysisModal = () => {
    setIsAnalysisModalOpen(true);
  };

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
  };

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleOpenClientModal = () => {
    setIsClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
  };

  const handleAnalysisComplete = async (analysisData: any) => {
    // Add the analysis to the store (which will save to database)
    const analysisResult: AnalysisResult = {
      id: Date.now().toString(),
      type: 'meeting', // Add required type field
      title: `${analysisData.client || 'Unknown Client'} - ${analysisData.teamMember || 'Unknown Team Member'}`, // Format: "Client - Team Member"
      client: analysisData.client,
      teamMember: analysisData.teamMember,
      transcription: analysisData.transcription,
      analysis: analysisData.analysis,
      timestamp: analysisData.timestamp,
    };
    await addAnalysis(analysisResult);
    
    // Reload analyses to get the latest data
    await loadAnalyses();
    
    // Show success message (you could add a toast notification here)
    console.log('Analysis completed:', analysisResult);
  };

  const handleDeleteAnalysis = async (id: string) => {
    setAnalysisToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (analysisToDelete) {
      try {
        await deleteAnalysis(analysisToDelete);
        // Reload analyses to get the latest data
        await loadAnalyses();
        console.log('Analysis deleted successfully');
      } catch (error) {
        console.error('Failed to delete analysis:', error);
      }
    }
    setIsDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };

  const handleCardClick = (id: string) => {
    router.push(`/clients/${id}`);
  };

  const handleAnalysisCardClick = (analysis: AnalysisResult) => {
    // Navigate to analysis detail page
    router.push(`/analysis/${analysis.id}`);
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: string) => {
    setView(newValue);
  };

  // Calculate dashboard stats from filtered data
  const totalAnalyses = filteredAnalyses.length;
  const positiveAnalyses = filteredAnalyses.filter(a => {
    // Handle both data structures
    if (a.analysis && a.analysis.sentiment) {
      return a.analysis.sentiment === 'positive';
    }
    // For database structure, check if sentiment exists in metrics
    if (a.metrics && a.metrics.sentiment) {
      return a.metrics.sentiment === 'positive';
    }
    return false;
  }).length;
  
  const highRiskAnalyses = filteredAnalyses.filter(a => {
    // Handle both data structures
    if (a.analysis && a.analysis.riskLevel) {
      return a.analysis.riskLevel === 'High';
    }
    // For database structure, check if risk level exists
    if (a.metrics && a.metrics.riskLevel) {
      return a.metrics.riskLevel === 'High';
    }
    return false;
  }).length;
  
  const totalActionItems = filteredAnalyses.reduce((sum, a) => {
    // Handle both data structures
    if (a.analysis && a.analysis.actionItems) {
      return sum + a.analysis.actionItems.length;
    }
    // For database structure, check if action items exist in insights
    if (a.insights && Array.isArray(a.insights)) {
      return sum + a.insights.length;
    }
    return sum;
  }, 0);

  return (
    <Box sx={{ backgroundColor: colors.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                {isTeamView ? 'My Analysis Dashboard' : 'Dashboard'}
        </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {isTeamView ? 'View and manage your analysis insights' : 'Monitor team performance and analysis insights'}
        </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {!isTeamView ? (
                <Tabs 
                  value={view} 
                  onChange={handleViewChange}
                  sx={{
                    minHeight: 40,
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#4caf50',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      minHeight: 40,
                      padding: '8px 16px',
                      '&.Mui-selected': {
                        color: '#4caf50',
                      },
                    },
                  }}
                >
                  <Tab 
                    icon={<PeopleIcon sx={{ fontSize: 20, mr: 1 }} />}
                    iconPosition="start"
                    label="Team View" 
                    value="team" 
                  />
                  <Tab 
                    icon={<AnalyticsIcon sx={{ fontSize: 20, mr: 1 }} />}
                    iconPosition="start"
                    label="Analysis View" 
                    value="analysis" 
                  />
                  <Tab 
                    icon={<AssessmentIcon sx={{ fontSize: 20, mr: 1 }} />}
                    iconPosition="start"
                    label="Analytics" 
                    value="analytics" 
                  />
                </Tabs>
              ) : (
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  My Analysis View
                </Typography>
              )}
              {isAdmin && (
                <Button
                  variant="outlined"
                  startIcon={<BusinessIcon />}
                  onClick={handleOpenClientModal}
                  sx={{
                    borderColor: alpha(colors.primary.main, 0.3),
                    color: colors.primary.main,
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      borderColor: colors.primary.main,
                      backgroundColor: alpha(colors.primary.main, 0.1),
                    },
                  }}
                >
                  Manage Clients
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenAnalysisModal}
                sx={{
                  backgroundColor: '#4caf50',
                  backgroundImage: `linear-gradient(45deg, #4caf50, #388e3c)`,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  height: 40,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#388e3c',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha('#4caf50', 0.4)}`,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Add Analysis
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              placeholder={isTeamView ? "Search my analyses..." : (view === 'team' ? "Search team members..." : "Search analyses...")}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: colors.background.paper,
                  '& fieldset': {
                    borderColor: alpha(colors.grey[700], 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                    borderWidth: 2,
                  },
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterModal}
              sx={{
                borderColor: alpha(colors.grey[700], 0.3),
                color: 'text.primary',
                textTransform: 'none',
                px: 3,
                fontSize: '0.95rem',
                '&:hover': {
                  borderColor: colors.primary.main,
                  backgroundColor: alpha(colors.primary.main, 0.05),
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Filters
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Analyses"
                value={totalAnalyses.toString()}
                icon={GroupsIcon}
                color={colors.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Positive Sentiment"
                value={positiveAnalyses.toString()}
                icon={TrendingUpIcon}
                color={colors.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="High Risk"
                value={highRiskAnalyses.toString()}
                icon={WarningAmberIcon}
                color={colors.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Action Items"
                value={totalActionItems.toString()}
                icon={AssignmentIcon}
                color={colors.primary.main}
              />
            </Grid>
          </Grid>

          {view === 'team' ? (
            <Grid container spacing={3}>
              {teamMembers.map((member) => (
                <Grid item xs={12} sm={6} md={3} key={member.name}>
                  <Box
                    onClick={() => handleCardClick('techcorp')}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <TeamMemberCard {...member} />
                  </Box>
            </Grid>
          ))}
        </Grid>
          ) : view === 'analytics' ? (
            <AnalyticsSection />
          ) : (
            <Grid container spacing={3}>
              {filteredAnalyses.length > 0 ? (
                filteredAnalyses.map((analysis) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={analysis.id}>
                    <Box
                      onClick={() => handleAnalysisCardClick(analysis)}
                      sx={{ 
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                      }}
                    >
                      <AnalysisCard 
                        analysis={analysis} 
                        onDelete={isAdmin ? handleDeleteAnalysis : undefined} 
                        isTeamView={isTeamView}
                      />
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        backgroundColor: colors.background.paper,
                        borderRadius: 2,
                        p: 6,
                        border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                        No Analyses Yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first analysis to see insights and metrics here.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleOpenAnalysisModal}
                        sx={{
                          backgroundColor: '#4caf50',
                          textTransform: 'none',
                          px: 3,
                          '&:hover': {
                            backgroundColor: '#388e3c',
                          },
                        }}
                      >
                        Create First Analysis
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Container>

      <AddAnalysisModal
        open={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        onAnalysisComplete={handleAnalysisComplete}
      />
      
      <FilterModal
        open={isFilterModalOpen}
        onClose={handleCloseFilterModal}
      />

      <ClientManagementModal
        open={isClientModalOpen}
        onClose={handleCloseClientModal}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            Are you sure you want to delete this analysis? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}