'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  alpha,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '@/styles/colors';
import { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface ClientManagementModalProps {
  open: boolean;
  onClose: () => void;
  onClientAdded?: (client: Client) => void;
}

export const ClientManagementModal = ({ open, onClose, onClientAdded }: ClientManagementModalProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name.trim()) {
      setError('Client name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const addedClient = await response.json();
        setClients([addedClient, ...clients]);
        setNewClient({ name: '', email: '', phone: '', company: '' });
        setSuccess('Client added successfully');
        if (onClientAdded) {
          onClientAdded(addedClient);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add client');
      }
    } catch (error) {
      setError('Failed to add client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter(client => client.id !== clientId));
        setSuccess('Client deleted successfully');
      }
    } catch (error) {
      setError('Failed to delete client');
    }
  };

  const handleClose = () => {
    setNewClient({ name: '', email: '', phone: '', company: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
            <BusinessIcon sx={{ color: '#fff' }} />
          </Box>
          <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
            Manage Clients
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5 }}>
          Add and manage your client database.
        </Typography>
        <IconButton
          onClick={handleClose}
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

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Add New Client Form */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Add New Client
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Client Name *"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
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
                  fullWidth
                  label="Phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'text.primary',
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
              <TextField
                fullWidth
                label="Company"
                value={newClient.company}
                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddClient}
                disabled={isLoading || !newClient.name.trim()}
                sx={{
                  backgroundColor: colors.primary.main,
                  '&:hover': {
                    backgroundColor: colors.primary.dark,
                  },
                  textTransform: 'none',
                }}
              >
                Add Client
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Existing Clients List */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Existing Clients ({clients.length})
            </Typography>
            <List sx={{ bgcolor: alpha(colors.background.default, 0.3), borderRadius: 2 }}>
              {clients.map((client) => (
                <ListItem key={client.id} sx={{ borderBottom: `1px solid ${alpha(colors.grey[700], 0.1)}` }}>
                  <ListItemText
                    primary={client.name}
                    secondary={
                      <Box>
                        {client.email && <Typography variant="body2" color="text.secondary">{client.email}</Typography>}
                        {client.company && <Typography variant="body2" color="text.secondary">{client.company}</Typography>}
                        {client.phone && <Typography variant="body2" color="text.secondary">{client.phone}</Typography>}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClient(client.id)}
                      sx={{
                        color: colors.error.main,
                        '&:hover': {
                          backgroundColor: alpha(colors.error.main, 0.1),
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {clients.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No clients found"
                    secondary="Add your first client above"
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
