import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearServices() {
  try {
    await prisma.service.deleteMany({});
    console.log('All services have been deleted.');
  } catch (error) {
    console.error('Error deleting services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearServices();
