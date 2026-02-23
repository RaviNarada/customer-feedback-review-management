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

export const getSentiment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sentiments = await analysisService.getAllSentiment();
    res.status(200).json(sentiments);
  } catch (error) {
    next(error);
  }
};

export const test = async (req:Request,res:Response)=>{
  console.log("hello world");
  res.status(200).json({success:true,data:"hello world"})
};

