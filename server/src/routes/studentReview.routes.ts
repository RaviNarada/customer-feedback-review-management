import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getTrainers, submitFeedback, getFeedback } from '../controllers/studentReview.controller';

const router = Router();

router.use(authMiddleware);
router.get('/trainers', getTrainers);
router.post('/feedback', submitFeedback);
router.get('/feedback/:courseId', getFeedback);

export default router;
