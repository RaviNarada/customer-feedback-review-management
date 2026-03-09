import { Router } from "express";
import {
  getTrainersWithFeedbackStatus,
  submitFeedback,
  getFeedbackByCourse,
} from "./student-review.controller";
import { mockAuthMiddleware } from "./mock-auth.middleware";

const router = Router();

router.use(mockAuthMiddleware);

router.get("/trainers", getTrainersWithFeedbackStatus);
router.post("/feedback", submitFeedback);
router.get("/feedback/:courseId", getFeedbackByCourse);

export default router;
