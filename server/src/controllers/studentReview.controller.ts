import { Request, Response } from 'express';
import { PrismaClient, SentimentFive } from '../../generated/prisma';

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

    // Validate required fields
    if (
      !courseId ||
      !rating ||
      !contentQuality ||
      !trainerKnowledge ||
      !communication ||
      !practicalRelevance ||
      !overallStructure
    ) {
      res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
      return;
    }

    // Check for existing feedback
    const existing = await prisma.feedback.findFirst({ 
      where: { 
        traineeId, 
        courseId: Number(courseId) 
      } 
    });
    
    if (existing) {
      res.status(409).json({ 
        success: false, 
        message: 'You have already submitted feedback for this course' 
      });
      return;
    }

    // Helper function to map sentiment to readable text
    const getSentimentText = (value: string): string => {
      const map: Record<string, string> = {
        'VERY_POOR': 'Very Poor',
        'POOR': 'Poor',
        'NEUTRAL': 'Neutral',
        'GOOD': 'Good',
        'VERY_GOOD': 'Very Good'
      };
      return map[value] || value;
    };

    // Helper function to map sentiment to number (1-5)
    const sentimentToNumber = (value: string): number => {
      const map: Record<string, number> = {
        'VERY_POOR': 1,
        'POOR': 2,
        'NEUTRAL': 3,
        'GOOD': 4,
        'VERY_GOOD': 5
      };
      return map[value] || 3;
    };

    // Convert each sentiment to number for average calculation
    const contentQualityNum = sentimentToNumber(contentQuality);
    const trainerKnowledgeNum = sentimentToNumber(trainerKnowledge);
    const communicationNum = sentimentToNumber(communication);
    const practicalRelevanceNum = sentimentToNumber(practicalRelevance);
    const overallStructureNum = sentimentToNumber(overallStructure);
    
    // Calculate average
    const average = (
      contentQualityNum +
      trainerKnowledgeNum +
      communicationNum +
      practicalRelevanceNum +
      overallStructureNum
    ) / 5;

    console.log('Calculated average rating:', average); 
    
    // Round to 1 decimal place
    const averageRounded = Math.round(average * 10) / 10;

    // Create a readable review string
    // const review = 
    //   `📋 FEEDBACK BREAKDOWN\n` +
    //   `━━━━━━━━━━━━━━━━━━━━\n` +
    //   `⭐ Overall Rating: ${rating}/5\n\n` +
    //   `📊 DETAILED RATINGS:\n` +
    //   `• Content Quality: ${contentQualityNum}/5 (${getSentimentText(contentQuality)})\n` +
    //   `• Trainer Knowledge: ${trainerKnowledgeNum}/5 (${getSentimentText(trainerKnowledge)})\n` +
    //   `• Communication: ${communicationNum}/5 (${getSentimentText(communication)})\n` +
    //   `• Practical Relevance: ${practicalRelevanceNum}/5 (${getSentimentText(practicalRelevance)})\n` +
    //   `• Overall Structure: ${overallStructureNum}/5 (${getSentimentText(overallStructure)})\n\n` +
    //   `📈 AVERAGE RATING: ${averageRounded}/5\n` +
    //   `━━━━━━━━━━━━━━━━━━━━\n` +
    //   `Submitted: ${new Date().toLocaleString()}`;

    const review = `Content:${contentQualityNum} Trainer:${trainerKnowledgeNum} Comm:${communicationNum} Practical:${practicalRelevanceNum} Structure:${overallStructureNum}`;

    // Calculate overall sentiment based on average - ensure it's never undefined
    let sentiment: SentimentFive;
    
    if (average >= 4.5) {
      sentiment = 'VERY_GOOD';
    } else if (average >= 3.5) {
      sentiment = 'GOOD';
    } else if (average >= 2.5) {
      sentiment = 'NEUTRAL';
    } else if (average >= 1.5) {
      sentiment = 'POOR';
    } else {
      sentiment = 'VERY_POOR';
    }

    // Create feedback in database
    const feedback = await prisma.feedback.create({
      data: {
        traineeId,
        courseId: Number(courseId),
        rating: Number(rating),
        review: review,  // Store the formatted review string
        sentiment: sentiment, // Now guaranteed to be a valid SentimentFive enum value
      },
    });

    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      data: feedback 
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit feedback' 
    });
  }
};

export const getFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const traineeId = (req as any).user.id;
    const { courseId } = req.params;
    const feedback = await prisma.feedback.findFirst({ 
      where: { 
        traineeId, 
        courseId: Number(courseId) 
      } 
    });
    
    if (!feedback) {
      res.status(404).json({ 
        success: false, 
        message: 'Feedback not found' 
      });
      return;
    }
    
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch feedback' 
    });
  }
};