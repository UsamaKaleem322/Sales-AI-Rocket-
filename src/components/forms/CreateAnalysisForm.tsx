'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

interface CreateAnalysisFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAnalysisForm = ({ open, onClose, onSuccess }: CreateAnalysisFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'sales' as 'sales' | 'performance' | 'market' | 'customer',
    title: '',
    data: '',
    prompt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          data: formData.data ? JSON.parse(formData.data) : {},
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
        onClose();
        setFormData({ type: 'sales', title: '', data: '', prompt: '' });
      } else {
        setError(result.error || 'Failed to create analysis');
      }
    } catch (err) {
      setError('Failed to create analysis. Please check your data format.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Analysis</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <FormControl fullWidth>
              <InputLabel>Analysis Type</InputLabel>
              <Select
                value={formData.type}
                label="Analysis Type"
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <MenuItem value="sales">Sales Analysis</MenuItem>
                <MenuItem value="performance">Performance Analysis</MenuItem>
                <MenuItem value="market">Market Analysis</MenuItem>
                <MenuItem value="customer">Customer Analysis</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Analysis Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Data (JSON format)"
              multiline
              rows={4}
              value={formData.data}
              onChange={(e) => handleChange('data', e.target.value)}
              placeholder='{"revenue": 100000, "customers": 500, "growth": 15}'
              helperText="Enter your data in JSON format"
            />

            <TextField
              fullWidth
              label="Custom Prompt (Optional)"
              multiline
              rows={3}
              value={formData.prompt}
              onChange={(e) => handleChange('prompt', e.target.value)}
              placeholder="Provide specific instructions for the AI analysis..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.title}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            {loading ? 'Creating...' : 'Create Analysis'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAnalysisForm;