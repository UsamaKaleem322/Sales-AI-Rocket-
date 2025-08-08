import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'ADMIN' | 'TEAM_MEMBER';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'TEAM_MEMBER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'TEAM_MEMBER';
  }
}
