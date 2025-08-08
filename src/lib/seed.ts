import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seed() {
  try {
    // Check if users already exist
    const existingUsers = await prisma.user.findMany();
    
    if (existingUsers.length === 0) {
      // Create admin user
      const adminPassword = await bcrypt.hash('adminPassword', 10);
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: adminPassword,
          role: 'ADMIN',
        },
      });

      // Create team member users
      const teamMemberPassword = await bcrypt.hash('teamPassword', 10);
      
      await prisma.user.create({
        data: {
          email: 'sarah@example.com',
          name: 'Sarah Chen',
          password: teamMemberPassword,
          role: 'TEAM_MEMBER',
        },
      });

      await prisma.user.create({
        data: {
          email: 'mike@example.com',
          name: 'Mike Johnson',
          password: teamMemberPassword,
          role: 'TEAM_MEMBER',
        },
      });

      await prisma.user.create({
        data: {
          email: 'emily@example.com',
          name: 'Emily Davis',
          password: teamMemberPassword,
          role: 'TEAM_MEMBER',
        },
      });

      console.log('Users created successfully');
    } else {
      console.log('Users already exist, skipping user creation');
    }

        // Check if clients exist
    const existingClients = await prisma.client.findMany();
    
    if (existingClients.length === 0) {
      // Create sample clients
      await prisma.client.create({
        data: {
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          company: 'Acme Corp',
        },
      });

      await prisma.client.create({
        data: {
          name: 'TechStart Inc',
          email: 'hello@techstart.com',
          company: 'TechStart Inc',
        },
      });

      await prisma.client.create({
        data: {
          name: 'Global Solutions',
          email: 'info@globalsolutions.com',
          company: 'Global Solutions Ltd',
        },
      });

      console.log('Clients created successfully');
    } else {
      console.log('Clients already exist, skipping client creation');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
