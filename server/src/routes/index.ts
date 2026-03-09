import { Router } from 'express';
import feedbackRoutes from './feedbackRoutes';
import responseRoutes from './responseRoutes';
import testRoutes from './testRoutes';

const router = Router();

router.use('/feedback', feedbackRoutes);
router.use('/response', responseRoutes);
router.use('/test', testRoutes);

export default router;
