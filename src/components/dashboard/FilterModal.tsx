'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  alpha,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { colors } from '@/styles/colors';
import { useAnalysisStore } from '@/lib/store';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
}

export const FilterModal = ({ open, onClose }: FilterModalProps) => {
  const { filters, setFilters, clearFilters, loadAnalyses } = useAnalysisStore();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = async () => {
    setFilters(localFilters);
    await loadAnalyses();
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({
      client: '',
      teamMember: '',
      sentiment: '',
      riskLevel: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleResetFilters = async () => {
    clearFilters();
    await loadAnalyses();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.background.paper,
          borderRadius: 3,
          border: `1px solid ${alpha(colors.grey[700], 0.2)}`,
        },
      }}
    >
      <DialogTitle sx={{ color: 'text.primary', fontWeight: 600 }}>
        Filter Analyses
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Client Filter */}
          <TextField
            label="Client"
            value={localFilters.client}
            onChange={(e) => setLocalFilters({ ...localFilters, client: e.target.value })}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(colors.background.default, 0.5),
                '& fieldset': {
                  borderColor: alpha(colors.grey[700], 0.2),
                },
                '&:hover fieldset': {
                  borderColor: colors.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary.main,
                },
              },
            }}
          />

          {/* Team Member Filter */}
          <TextField
            label="Team Member"
            value={localFilters.teamMember}
            onChange={(e) => setLocalFilters({ ...localFilters, teamMember: e.target.value })}
            fullWidth
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(colors.background.default, 0.5),
                '& fieldset': {
                  borderColor: alpha(colors.grey[700], 0.2),
                },
                '&:hover fieldset': {
                  borderColor: colors.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary.main,
                },
              },
            }}
          />

          {/* Sentiment Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Sentiment</InputLabel>
            <Select
              value={localFilters.sentiment}
              onChange={(e) => setLocalFilters({ ...localFilters, sentiment: e.target.value })}
              label="Sentiment"
              sx={{
                backgroundColor: alpha(colors.background.default, 0.5),
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(colors.grey[700], 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
              }}
            >
              <MenuItem value="">All Sentiments</MenuItem>
              <MenuItem value="positive">Positive</MenuItem>
              <MenuItem value="neutral">Neutral</MenuItem>
              <MenuItem value="negative">Negative</MenuItem>
            </Select>
          </FormControl>

          {/* Risk Level Filter */}
          <FormControl fullWidth size="small">
            <InputLabel>Risk Level</InputLabel>
            <Select
              value={localFilters.riskLevel}
              onChange={(e) => setLocalFilters({ ...localFilters, riskLevel: e.target.value })}
              label="Risk Level"
              sx={{
                backgroundColor: alpha(colors.background.default, 0.5),
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(colors.grey[700], 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary.main,
                },
              }}
            >
              <MenuItem value="">All Risk Levels</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="From Date"
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(colors.background.default, 0.5),
                  '& fieldset': {
                    borderColor: alpha(colors.grey[700], 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="To Date"
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(colors.background.default, 0.5),
                  '& fieldset': {
                    borderColor: alpha(colors.grey[700], 0.2),
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary.main,
                  },
                },
              }}
            />
          </Box>

          {/* Active Filters Display */}
          {Object.values(localFilters).some(filter => filter !== '') && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {localFilters.client && (
                  <Chip
                    label={`Client: ${localFilters.client}`}
                    size="small"
                    onDelete={() => setLocalFilters({ ...localFilters, client: '' })}
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                )}
                {localFilters.teamMember && (
                  <Chip
                    label={`Team: ${localFilters.teamMember}`}
                    size="small"
                    onDelete={() => setLocalFilters({ ...localFilters, teamMember: '' })}
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                )}
                {localFilters.sentiment && (
                  <Chip
                    label={`Sentiment: ${localFilters.sentiment}`}
                    size="small"
                    onDelete={() => setLocalFilters({ ...localFilters, sentiment: '' })}
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                )}
                {localFilters.riskLevel && (
                  <Chip
                    label={`Risk: ${localFilters.riskLevel}`}
                    size="small"
                    onDelete={() => setLocalFilters({ ...localFilters, riskLevel: '' })}
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                )}
                {(localFilters.dateFrom || localFilters.dateTo) && (
                  <Chip
                    label={`Date: ${localFilters.dateFrom || 'Any'} - ${localFilters.dateTo || 'Any'}`}
                    size="small"
                    onDelete={() => setLocalFilters({ ...localFilters, dateFrom: '', dateTo: '' })}
                    sx={{
                      backgroundColor: alpha(colors.primary.main, 0.1),
                      color: colors.primary.main,
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClearFilters}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: alpha(colors.grey[700], 0.1),
            },
          }}
        >
          Clear All
        </Button>
        <Button
          onClick={handleResetFilters}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: alpha(colors.grey[700], 0.1),
            },
          }}
        >
          Reset
        </Button>
        <Button
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: alpha(colors.grey[700], 0.1),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApplyFilters}
          variant="contained"
          sx={{
            backgroundColor: '#4caf50',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 