import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getTrainers, submitFeedback, getFeedback } from '../controllers/studentReview.controller';

const router = Router();

router.use(protect);
router.get('/trainers', getTrainers);
router.post('/feedback', submitFeedback);
router.get('/feedback/:courseId', getFeedback);

export default router;
