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
    const name  = req.body?.name;

    const sentiments = await analysisService.getAllSentiment(name);
    res.status(200).json(sentiments);
  } catch (error) {
    next(error);
  }
};

export const test = async (req:Request,res:Response)=>{
  console.log("hello world");
  res.status(200).json({success:true,data:"hello world"})
};

export const fileDownload = async (req:Request,res:Response) => {
  try {
    console.log("Request body:", req.body);
    console.log("Name received:", req.body.name);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 🔥 Prisma Query
    const data = await analysisService.secureDbRetrieval(name);

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    // 🔥 Convert JSON → CSV
    let csv = await analysisService.fileSender(data);

    // 🔥 Send as downloadable file
    res.header("Content-Type", "text/csv");
    res.attachment(`report-${name}.csv`);
    return res.send(csv);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

