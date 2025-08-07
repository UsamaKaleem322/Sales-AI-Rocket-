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
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAnalysisStore, AnalysisResult } from '@/lib/store';
import { colors } from '@/styles/colors';
import { AddAnalysisModal } from '@/components/dashboard/AddAnalysisModal';
import { FilterModal } from '@/components/dashboard/FilterModal';
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {role}
        </Typography>
        <Chip
          label={performance}
          size="small"
          sx={{
            backgroundColor: performance === 'Excellent' ? alpha(colors.success.main, 0.1) : 
                           performance === 'Good' ? alpha(colors.warning.main, 0.1) : 
                           alpha(colors.error.main, 0.1),
            color: performance === 'Excellent' ? colors.success.main : 
                   performance === 'Good' ? colors.warning.main : 
                   colors.error.main,
            fontWeight: 500,
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {trend === 'up' && <TrendingUpIcon sx={{ color: colors.success.main, fontSize: 20 }} />}
        {trend === 'down' && <TrendingDownIcon sx={{ color: colors.error.main, fontSize: 20 }} />}
        {trend === 'stable' && <AccessTimeIcon sx={{ color: colors.warning.main, fontSize: 20 }} />}
      </Box>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Meetings
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {meetings}
        </Typography>
          </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Health Score
        </Typography>
        <Typography variant="h6" sx={{ color: colors.success.main, fontWeight: 600 }}>
          {healthScore}%
          </Typography>
        </Box>
    </Box>

    <Box sx={{ width: '100%', height: 6, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 3, overflow: 'hidden' }}>
      <Box
        sx={{
          width: `${healthScore}%`,
          height: '100%',
          backgroundColor: colors.success.main,
          borderRadius: 3,
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </Box>
  </Paper>
);

// AnalysisCard component
const AnalysisCard = ({ analysis }: { analysis: AnalysisResult }) => (
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
      <Box>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: 0.5 }}>
          {analysis.client}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {analysis.teamMember}
        </Typography>
      </Box>
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
          {analysis.analysis.healthScore}%
        </Typography>
        <Box sx={{ flex: 1, height: 6, backgroundColor: alpha(colors.success.main, 0.1), borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${analysis.analysis.healthScore}%`,
              height: '100%',
              backgroundColor: colors.success.main,
              borderRadius: 3,
            }}
          />
        </Box>
      </Box>
        </Box>
        
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Key Points
      </Typography>
      <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
        {analysis.analysis.summary[0]}
      </Typography>
      {analysis.analysis.summary.length > 1 && (
        <Typography variant="body2" color="text.secondary">
          +{analysis.analysis.summary.length - 1} more points
        </Typography>
      )}
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {new Date(analysis.timestamp).toLocaleDateString()}
      </Typography>
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
          fontWeight: 500,
        }}
      />
    </Box>
  </Paper>
);

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

export default function StatsSection() {
  const router = useRouter();
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [view, setView] = useState('team');
  const { addAnalysis, analyses, loadAnalyses, isLoading, error, filters } = useAnalysisStore();

  // Load analyses on component mount
  useEffect(() => {
    loadAnalyses();
  }, [loadAnalyses]);

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

  const handleAnalysisComplete = async (analysisData: any) => {
    // Add the analysis to the store (which will save to database)
    const analysisResult: AnalysisResult = {
      id: Date.now().toString(),
      ...analysisData,
    };
    await addAnalysis(analysisResult);
    
    // Reload analyses to get the latest data
    await loadAnalyses();
    
    // Show success message (you could add a toast notification here)
    console.log('Analysis completed:', analysisResult);
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

  // Calculate dashboard stats from real data
  const totalAnalyses = analyses.length;
  const positiveAnalyses = analyses.filter(a => a.analysis.sentiment === 'positive').length;
  const highRiskAnalyses = analyses.filter(a => a.analysis.riskLevel === 'High').length;
  const totalActionItems = analyses.reduce((sum, a) => sum + a.analysis.actionItems.length, 0);

  return (
    <Box sx={{ backgroundColor: colors.background.default, minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
                Dashboard
        </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Monitor team performance and analysis insights
        </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
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
              </Tabs>
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
              placeholder={view === 'team' ? "Search team members..." : "Search analyses..."}
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
          ) : (
            <Grid container spacing={3}>
              {analyses.length > 0 ? (
                analyses.map((analysis) => (
                  <Grid item xs={12} sm={6} md={3} key={analysis.id}>
                    <Box
                      onClick={() => handleAnalysisCardClick(analysis)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <AnalysisCard analysis={analysis} />
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
    </Box>
  );
}