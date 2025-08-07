'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { colors } from '@/styles/colors';
import { useState } from 'react';

interface AddAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  onAnalysisComplete?: (analysis: any) => void;
}

const clients = [
  'Acme Corporation',
  'TechStart Inc',
  'Global Solutions',
  'Innovative Systems',
];

const teamMembers = [
  'Sarah Chen',
  'Mike Johnson',
  'John Smith',
  'Emily Davis',
];

const CustomSelect = ({ label, icon: Icon, value, onChange, options }: any) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Icon sx={{ color: colors.primary.main, fontSize: 20 }} />
      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    <Select
      fullWidth
      value={value}
      onChange={onChange}
      displayEmpty
      sx={{
        backgroundColor: alpha(colors.background.default, 0.6),
        backdropFilter: 'blur(8px)',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(colors.grey[700], 0.2),
          borderWidth: 2,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.primary.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.primary.main,
          borderWidth: 2,
        },
        '& .MuiSelect-select': {
          color: 'text.primary',
          py: 1.5,
        },
        transition: 'all 0.2s ease-in-out',
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: colors.background.paper,
            backgroundImage: 'none',
            border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
            boxShadow: `0 4px 20px ${alpha(colors.background.default, 0.7)}`,
            '& .MuiMenuItem-root': {
              color: 'text.primary',
              '&:hover': {
                backgroundColor: alpha(colors.primary.main, 0.1),
              },
              '&.Mui-selected': {
                backgroundColor: alpha(colors.primary.main, 0.15),
                '&:hover': {
                  backgroundColor: alpha(colors.primary.main, 0.2),
                },
              },
            },
          },
        },
      }}
      renderValue={(selected) => {
        if (!selected) {
          return <Typography color="text.secondary">Select {label.toLowerCase()}</Typography>;
        }
        return selected;
      }}
    >
      {options.map((option: string) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </Box>
);

export const AddAnalysisModal = ({ open, onClose, onAnalysisComplete }: AddAnalysisModalProps) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!selectedClient || !selectedTeamMember || !transcription.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: selectedClient,
          teamMember: selectedTeamMember,
          transcription: transcription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze meeting');
      }

      // Call the callback with the analysis results
      if (onAnalysisComplete) {
        onAnalysisComplete({
          client: selectedClient,
          teamMember: selectedTeamMember,
          transcription: transcription.trim(),
          analysis: data.analysis,
          timestamp: data.timestamp,
        });
      }

      // Reset form and close modal
      setSelectedClient('');
      setSelectedTeamMember('');
      setTranscription('');
      onClose();

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze meeting');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    if (!isAnalyzing) {
      setSelectedClient('');
      setSelectedTeamMember('');
      setTranscription('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.paper,
          backgroundImage: 'none',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(colors.background.default, 0.4)}`,
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 3, 
          pb: 2,
          color: 'text.primary',
          borderBottom: `1px solid ${alpha(colors.grey[700], 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.15)}, ${alpha(colors.primary.dark, 0.05)})`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.3)}`,
            }}
          >
            <AnalyticsIcon sx={{ color: '#fff' }} />
          </Box>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            Add Meeting Analysis
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5 }}>
          Upload a meeting transcription to generate insights for your dashboard.
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={isAnalyzing}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
            bgcolor: alpha(colors.grey[700], 0.1),
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: alpha(colors.primary.main, 0.1),
            },
            '&:disabled': {
              opacity: 0.5,
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isAnalyzing && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: alpha(colors.background.paper, 0.9),
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                borderRadius: 3,
              }}
            >
              <CircularProgress size={60} sx={{ color: colors.primary.main, mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                Analyzing Meeting...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Our AI is processing your transcription and generating insights.
                <br />
                This may take a few moments.
              </Typography>
            </Box>
          )}

          <CustomSelect
            label="Client"
            icon={BusinessIcon}
            value={selectedClient}
            onChange={(e: any) => setSelectedClient(e.target.value)}
            options={clients}
          />

          <CustomSelect
            label="Team Member"
            icon={PersonIcon}
            value={selectedTeamMember}
            onChange={(e: any) => setSelectedTeamMember(e.target.value)}
            options={teamMembers}
          />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DescriptionIcon sx={{ color: colors.primary.main, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                Meeting Transcription
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Paste your meeting transcription here..."
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              disabled={isAnalyzing}
              sx={{
                backgroundColor: alpha(colors.background.default, 0.6),
                backdropFilter: 'blur(8px)',
                '& .MuiOutlinedInput-root': {
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: alpha(colors.grey[700], 0.2),
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                    borderWidth: 2,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(colors.grey[700], 0.1),
                  },
                },
                '& .MuiOutlinedInput-input': {
                  '&::placeholder': {
                    color: alpha(colors.grey[400], 0.8),
                  },
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedClient || !selectedTeamMember || !transcription.trim()}
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: '#4caf50',
              backgroundImage: `linear-gradient(135deg, #4caf50, #388e3c)`,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#388e3c',
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${alpha('#4caf50', 0.4)}`,
              },
              '&:disabled': {
                backgroundColor: alpha(colors.grey[700], 0.3),
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {isAnalyzing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                Analyzing...
              </Box>
            ) : (
              'Analyze Now'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}; 