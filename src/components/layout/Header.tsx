'use client';

import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { colors } from '@/styles/colors';

export const Header = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

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
          onClick={handleMenuClick}
          sx={{
            color: 'text.primary',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          {session?.user?.name || 'User'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2">
              {session?.user?.email}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2" color="text.secondary">
              Role: {session?.user?.role}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              Sign Out
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};