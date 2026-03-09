import { Router } from 'express';
import {
  getTrainersWithFeedbackStatus,
  submitFeedback,
  getFeedbackByCourse,
} from '../../../server/src/student-review/student-review.controller';
import { mockAuthMiddleware } from './mock-auth.middleware';

const studentReviewRouter = Router();

studentReviewRouter.use(mockAuthMiddleware);
studentReviewRouter.get('/trainers', getTrainersWithFeedbackStatus);
studentReviewRouter.post('/feedback', submitFeedback);
studentReviewRouter.get('/feedback/:courseId', getFeedbackByCourse);

export { studentReviewRouter };