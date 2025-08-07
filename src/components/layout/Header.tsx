'use client';

import { Box, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { colors } from '@/styles/colors';

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: colors.background.paper,
        borderBottom: `1px solid ${colors.grey[800]},`
      }}
    >
      {/* Left side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          sx={{ color: 'text.secondary' }}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Box>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Meeting Intelligence
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Capture, analyze, and optimize client relationships
          </Typography>
        </Box>
      </Box>

      {/* Right side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: 'text.secondary', position: 'relative' }}>
          <NotificationsIcon />
          <Box
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: colors.error.main,
            }}
          />
        </IconButton>
        <Button
          startIcon={<PersonIcon />}
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Admin
        </Button>
      </Box>
    </Box>
  );
};