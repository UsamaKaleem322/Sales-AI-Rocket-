'use client';

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { colors } from '@/styles/colors';

interface DashboardCardProps {
  name: string;
  role: string;
  clientCount: number;
  metrics: {
    proactivity: 'high' | 'medium' | 'low';
    coordination: 'excellent' | 'good' | 'needsAttn';
    responseTime: 'prompt' | 'average' | 'delayed';
  };
  tasksCompleted: number;
}

const getMetricColor = (metric: string, value: string) => {
  const colorMap: Record<string, Record<string, string>> = {
    proactivity: {
      high: colors.success.main,
      medium: colors.warning.main,
      low: colors.error.main,
    },
    coordination: {
      excellent: colors.success.main,
      good: colors.warning.main,
      needsAttn: colors.error.main,
    },
    responseTime: {
      prompt: colors.success.main,
      average: colors.warning.main,
      delayed: colors.error.main,
    },
  };
  return colorMap[metric]?.[value] || colors.text.darkSecondary;
};

export const DashboardCard = ({
  name,
  role,
  clientCount,
  metrics,
  tasksCompleted,
}: DashboardCardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: colors.background.paper,
        borderRadius: 2,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Clients: {clientCount} | Tasks: {tasksCompleted}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Proactivity
            </Typography>
            <Chip
              label={metrics.proactivity}
              size="small"
              sx={{
                backgroundColor: getMetricColor('proactivity', metrics.proactivity) + '1A',
                color: getMetricColor('proactivity', metrics.proactivity),
                fontSize: '0.7rem',
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Coordination
            </Typography>
            <Chip
              label={metrics.coordination}
              size="small"
              sx={{
                backgroundColor: getMetricColor('coordination', metrics.coordination) + '1A',
                color: getMetricColor('coordination', metrics.coordination),
                fontSize: '0.7rem',
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Response Time
            </Typography>
            <Chip
              label={metrics.responseTime}
              size="small"
              sx={{
                backgroundColor: getMetricColor('responseTime', metrics.responseTime) + '1A',
                color: getMetricColor('responseTime', metrics.responseTime),
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};