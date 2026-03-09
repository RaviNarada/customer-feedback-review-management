import { PrismaClient } from "@prisma/client";
import { FeedbackBody } from "./student-review.validation";

const prisma = new PrismaClient();

export interface FeedbackResult {
  id: string;
  courseId: string;
  traineeId: string;
  rating: number;
  contentQuality: string;
  trainerKnowledge: string;
  communication: string;
  practicalRelevance: string;
  overallStructure: string;
  createdAt: Date;
}

export const createFeedback = async (
  traineeId: string,
  data: FeedbackBody
): Promise<FeedbackResult> => {
  const existing = await prisma.feedback.findFirst({
    where: { traineeId, courseId: data.courseId },
  });

  if (existing) {
    throw new Error("DUPLICATE_FEEDBACK");
  }

  const feedback = await prisma.feedback.create({
    data: {
      traineeId,
      courseId: data.courseId,
      rating: data.rating,
      contentQuality: data.contentQuality as any,
      trainerKnowledge: data.trainerKnowledge as any,
      communication: data.communication as any,
      practicalRelevance: data.practicalRelevance as any,
      overallStructure: data.overallStructure as any,
    },
  });

  return feedback as unknown as FeedbackResult;
};

export const getFeedbackByCourse = async (
  traineeId: string,
  courseId: string
): Promise<FeedbackResult | null> => {
  const feedback = await prisma.feedback.findFirst({
    where: { traineeId, courseId },
  });

  return feedback as unknown as FeedbackResult | null;
};
