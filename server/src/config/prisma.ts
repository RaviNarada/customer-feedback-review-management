import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Logs SQL queries and errors
});

// Also export as default for compatibility
export default prisma;
