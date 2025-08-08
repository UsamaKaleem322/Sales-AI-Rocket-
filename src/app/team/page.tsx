'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StatsSection from '@/components/sections/StatsSection';

export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect admin users to main dashboard
    if (session.user?.role === 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <StatsSection isTeamView={true} currentUser={session.user} />
    </Layout>
  );
}
