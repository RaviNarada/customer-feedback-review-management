import { Request, Response, NextFunction } from "express";
import * as analysisService from "./analysis.service";

export const getFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const feedbacks = await analysisService.getAllFeedback();
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

