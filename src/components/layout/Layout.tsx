'use client';

import { Box } from '@mui/material';
import { Header } from './Header';
import { colors } from '@/styles/colors';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export default function Layout({ children, hideHeader = false }: LayoutProps) {
  return (
    <Box sx={{ 
      backgroundColor: colors.background.default, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {!hideHeader && <Header />}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}