import {prisma} from "../../config/prisma";
import { CreateAnalyseDTO } from "./analysis.types";

export const getAllFeedback = async () => {

  const feedback_met = await prisma.feedback.findMany();


  if (!feedback_met || feedback_met.length === 0) {
    console.log("No feedback found → returning []");
    return [];
  }

  return feedback_met;
};

export const getAllSentiment = async () => {

const sentiment_got = await prisma.feedback.groupBy({
  by:['sentiment'],
  _count:{
    sentiment:true,
  },
});

return sentiment_got;
  
};



