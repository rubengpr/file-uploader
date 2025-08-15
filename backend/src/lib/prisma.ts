import { PrismaClient } from '@prisma/client'

// Create a single Prisma instance for the entire app
const prisma = new PrismaClient()

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
});

export default prisma