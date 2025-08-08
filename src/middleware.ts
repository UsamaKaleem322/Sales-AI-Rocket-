import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = req.nextUrl.pathname === '/';
    const isTeamPage = req.nextUrl.pathname === '/team';

    // If user is authenticated and trying to access auth pages, redirect them
    if (token && isAuthPage) {
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      } else {
        return NextResponse.redirect(new URL('/team', req.url));
      }
    }

    // Role-based access control for authenticated users
    if (token) {
      // Admin can access all pages
      if (token.role === 'ADMIN') {
        return NextResponse.next();
      }

      // Team members can access team page and analysis pages
      if (token.role === 'TEAM_MEMBER') {
        // Allow access to team page and analysis pages
        if (req.nextUrl.pathname.startsWith('/analysis') || req.nextUrl.pathname === '/team') {
          return NextResponse.next();
        }
        // Redirect to team page for admin dashboard
        if (isAdminPage) {
          return NextResponse.redirect(new URL('/team', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
