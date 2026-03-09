import { Request, Response } from "express";
import * as trainerService from "./trainer.service";
import * as feedbackService from "./feedback.service";
import { validateFeedbackBody } from "./student-review.validation";

export const getTrainersWithFeedbackStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const trainers = await trainerService.getTrainersWithFeedbackStatus(traineeId);
    res.json({ success: true, data: trainers });
  } catch (error) {
    console.error("[student-review] getTrainers error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch trainers" });
  }
};

export const submitFeedback = [
  validateFeedbackBody,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const traineeId = (req as any).user.id;
      const feedback = await feedbackService.createFeedback(traineeId, req.body);
      res.status(201).json({ success: true, data: feedback });
    } catch (error: any) {
      if (error.message === "DUPLICATE_FEEDBACK") {
        res.status(409).json({
          success: false,
          message: "You have already submitted feedback for this course",
        });
        return;
      }
      console.error("[student-review] submitFeedback error:", error);
      res.status(500).json({ success: false, message: "Failed to submit feedback" });
    }
  },
];

export const getFeedbackByCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const { courseId } = req.params;
    const feedback = await feedbackService.getFeedbackByCourse(traineeId, courseId);
    if (!feedback) {
      res.status(404).json({ success: false, message: "Feedback not found" });
      return;
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error("[student-review] getFeedback error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch feedback" });
  }
};
