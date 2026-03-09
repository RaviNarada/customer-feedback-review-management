import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTrainers = async (req: Request, res: Response): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const trainers = await prisma.trainer.findMany({
      include: {
        courses: {
          include: {
            feedbacks: { where: { traineeId }, select: { id: true } },
          },
        },
      },
    });
    const result = trainers.map((t: any) => ({
        id: t.id,
        name: t.name,
        expertise: t.expertise,
        courses: t.courses.map((c: any) => ({
          id: c.id,
          title: c.title,
          hasFeedback: c.feedbacks.length > 0,
        })),
      }));
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch trainers' });
  }
};

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const {
      courseId,
      rating,
      contentQuality,
      trainerKnowledge,
      communication,
      practicalRelevance,
      overallStructure,
    } = req.body;

    if (
      !courseId ||
      !rating ||
      !contentQuality ||
      !trainerKnowledge ||
      !communication ||
      !practicalRelevance ||
      !overallStructure
    ) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    const existing = await prisma.feedback.findFirst({ where: { traineeId, courseId } });
    if (existing) {
      res.status(409).json({ success: false, message: 'You have already submitted feedback for this course' });
      return;
    }

    const feedback = await prisma.feedback.create({
      data: {
        traineeId,
        courseId,
        rating: Number(rating),
        contentQuality,
        trainerKnowledge,
        communication,
        practicalRelevance,
        overallStructure,
      },
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

export const getFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const { courseId } = req.params;
    const feedback = await prisma.feedback.findFirst({ where: { traineeId, courseId } });
    if (!feedback) {
      res.status(404).json({ success: false, message: 'Feedback not found' });
      return;
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};
