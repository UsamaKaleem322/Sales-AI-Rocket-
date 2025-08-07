'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Fab,
} from '@mui/material';
import { Add, TrendingUp, Assessment, Insights, Delete } from '@mui/icons-material';
import CreateAnalysisForm from '@/components/forms/CreateAnalysisForm';
import { AnalysisResponse } from '@/lib/openai';

const AnalysisCard = ({ analysis, onDelete }: { analysis: AnalysisResponse; onDelete: (id: string) => void }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'success';
      case 'performance': return 'primary';
      case 'market': return 'warning';
      case 'customer': return 'info';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down': return <TrendingUp sx={{ color: 'error.main', transform: 'rotate(180deg)' }} />;
      default: return <Assessment sx={{ color: 'warning.main' }} />;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {analysis.title}
            </Typography>
            <Chip 
              label={analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)} 
              color={getTypeColor(analysis.type) as any}
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>
          <IconButton 
            size="small" 
            onClick={() => onDelete(analysis.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {analysis.summary}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getTrendIcon(analysis.metrics.trend)}
              <Typography variant="h6" color="primary.main">
                {analysis.metrics.score}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={analysis.metrics.score} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Key Insights:
          </Typography>
          {analysis.insights.slice(0, 2).map((insight, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
              • {insight}
            </Typography>
          ))}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(analysis.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AnalysisSection = () => {
  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analysis');
      const result = await response.json();
      if (result.success) {
        setAnalyses(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAnalyses(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h2" gutterBottom>
              AI Analysis Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              AI-powered insights and recommendations for your business
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            size="large"
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            New Analysis
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress sx={{ width: '50%' }} />
          </Box>
        ) : analyses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Insights sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No analyses yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Create your first AI analysis to get started with intelligent insights
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
              size="large"
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#388e3c',
                },
              }}
            >
              Create Analysis
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {analyses.map((analysis) => (
              <Grid item xs={12} md={6} lg={4} key={analysis.id}>
                <AnalysisCard analysis={analysis} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Fab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
          aria-label="add"
          onClick={() => setFormOpen(true)}
        >
          <Add />
        </Fab>
        
        <CreateAnalysisForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={fetchAnalyses}
        />
      </Container>
    </Box>
  );
};

export default AnalysisSection;