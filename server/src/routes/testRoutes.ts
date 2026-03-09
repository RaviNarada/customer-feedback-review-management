import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

router.get('/db-test', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test table existence
    const feedbackCount = await prisma.feedback.count();
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    
    res.json({
      success: true,
      data: {
        database: 'connected',
        tables: {
          feedback: feedbackCount,
          users: userCount,
          courses: courseCount
        }
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Database test failed'
    });
  }
});

export default router;
