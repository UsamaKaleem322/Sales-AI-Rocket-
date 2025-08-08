import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/lib/registry';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meeting Intelligence Dashboard',
  description: 'Monitor team performance and client health metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeRegistry options={{ key: 'mui' }}>
            {children}
          </ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}