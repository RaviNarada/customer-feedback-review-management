import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export interface CourseWithFeedbackStatus {
  id: string;
  title: string;
  hasFeedback: boolean;
}

export interface TrainerWithCourses {
  id: string;
  name: string;
  expertise: string;
  courses: CourseWithFeedbackStatus[];
}

export const getTrainersWithFeedbackStatus = async (
  traineeId: string
): Promise<TrainerWithCourses[]> => {
  const trainers = await prisma.trainer.findMany({
    include: {
      courses: {
        include: {
          feedbacks: {
            where: { traineeId },
            select: { id: true },
          },
        },
      },
    },
  });

  return trainers.map((trainer) => ({
    id: trainer.id,
    name: trainer.name,
    expertise: trainer.expertise,
    courses: trainer.courses.map((course) => ({
      id: course.id,
      title: course.title,
      hasFeedback: course.feedbacks.length > 0,
    })),
  }));
};
