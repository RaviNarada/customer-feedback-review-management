import {prisma} from "../../config/prisma";
import { CreateAnalyseDTO } from "./analysis.types";
import { Parser } from "json2csv";


export const getAllFeedback = async () => {

  const feedback_met = await prisma.feedback.findMany();


  if (!feedback_met || feedback_met.length === 0) {
    console.log("No feedback found → returning []");
    return [];
  }

  return feedback_met;
};

export const getAllSentiment = async (name:string) => {

  const sentiment_got = await prisma.feedback.groupBy({
    by:['sentiment'],
    where:{
        course:{
          trainer:{
            name:name
          }
        }
    },
    _count:{
      sentiment:true
    }
});

return sentiment_got;
  
};

export const secureDbRetrieval = async (name:string) => {
  
    const data = await prisma.feedback.findMany({
    where: {
      course: {
        trainer: {
          name: name
        }
      }
    },
    include: {
      trainee: {
        select: { name: true }
      },
      course: {
        select: {
          title: true,
          // trainer: {
          //   select: { name: true }
          // }
        }
      }
    }
  });

  // const data = await prisma.feedback.findMany();

  return data;

} 

export const fileSender = async (data:any)=> {
    const parser = new Parser();
    const csv = parser.parse(data);

    return csv;
}



