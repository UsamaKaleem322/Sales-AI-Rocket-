'use client';

import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { colors } from '@/styles/colors';
import { DashboardCard } from './DashboardCard';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssignmentIcon from '@mui/icons-material/Assignment';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Paper
    sx={{
      backgroundColor: colors.background.paper,
      p: 3,
      borderRadius: 2,
      height: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: color + '1A',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ color }} />
      </Box>
    </Box>
  </Paper>
);

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Senior Account Manager',
    clientCount: 8,
    metrics: {
      proactivity: 'high' as const,
      coordination: 'excellent' as const,
      responseTime: 'prompt' as const,
    },
    tasksCompleted: 24,
  },
  {
    name: 'Mike Johnson',
    role: 'Account Manager',
    clientCount: 6,
    metrics: {
      proactivity: 'medium' as const,
      coordination: 'good' as const,
      responseTime: 'average' as const,
    },
    tasksCompleted: 18,
  },
  {
    name: 'John Smith',
    role: 'Junior Account Manager',
    clientCount: 4,
    metrics: {
      proactivity: 'low' as const,
      coordination: 'needsAttn' as const,
      responseTime: 'delayed' as const,
    },
    tasksCompleted: 10,
  },
  {
    name: 'Emily Davis',
    role: 'Senior Account Manager',
    clientCount: 7,
    metrics: {
      proactivity: 'high' as const,
      coordination: 'excellent' as const,
      responseTime: 'prompt' as const,
    },
    tasksCompleted: 22,
  },
];

export const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Monitor team performance and client health metrics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value="4"
            icon={PeopleIcon}
            color={colors.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="High Performers"
            value="2"
            icon={TrendingUpIcon}
            color={colors.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Need Attention"
            value="1"
            icon={WarningAmberIcon}
            color={colors.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tasks"
            value="74"
            icon={AssignmentIcon}
            color={colors.primary.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={3} key={member.name}>
            <DashboardCard {...member} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}; 