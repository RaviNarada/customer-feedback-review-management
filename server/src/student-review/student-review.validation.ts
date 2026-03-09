import { Request, Response, NextFunction } from "express";

export interface FeedbackBody {
  courseId: string;
  rating: number;
  contentQuality: string;
  trainerKnowledge: string;
  communication: string;
  practicalRelevance: string;
  overallStructure: string;
}

const VALID_SENTIMENT_VALUES = [
  "VERY_POOR",
  "POOR",
  "NEUTRAL",
  "GOOD",
  "VERY_GOOD",
];

export const validateFeedbackBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    courseId,
    rating,
    contentQuality,
    trainerKnowledge,
    communication,
    practicalRelevance,
    overallStructure,
  }: FeedbackBody = req.body;

  const errors: string[] = [];

  if (!courseId || typeof courseId !== "string") {
    errors.push("courseId is required");
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    errors.push("rating must be a number between 1 and 5");
  }

  const structuredFields: Record<string, string> = {
    contentQuality,
    trainerKnowledge,
    communication,
    practicalRelevance,
    overallStructure,
  };

  for (const [field, value] of Object.entries(structuredFields)) {
    if (!value || !VALID_SENTIMENT_VALUES.includes(value)) {
      errors.push(
        `${field} is required and must be one of: ${VALID_SENTIMENT_VALUES.join(", ")}`
      );
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, errors });
    return;
  }

  next();
};
