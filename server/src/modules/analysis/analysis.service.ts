import {prisma} from "../../config/prisma";
import { CreateAnalyseDTO } from "./analysis.types";

export const getAllFeedback = async () => {
  return prisma.FeedbackModel.findMany();
};


