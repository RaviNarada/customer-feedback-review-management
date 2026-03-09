import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController';

const router = Router();
const feedbackController = new FeedbackController();

router.get('/stats', feedbackController.getStats.bind(feedbackController));

router.get('/', feedbackController.getFeedbacks.bind(feedbackController));

router.get('/:id', feedbackController.getFeedbackById.bind(feedbackController));

export default router;
