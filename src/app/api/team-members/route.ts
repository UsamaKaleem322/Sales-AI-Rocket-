import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const teamMembers = await prisma.user.findMany({
      where: {
        role: 'TEAM_MEMBER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
