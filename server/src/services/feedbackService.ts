import { PrismaClient } from '../../generated/prisma';
import { FeedbackDto, StatsDto, FeedbackQuery, ResponseDto } from '../types';

const prisma = new PrismaClient();

export class FeedbackService {
  async getStats(): Promise<StatsDto> {
    const total = await prisma.feedback.count();
    const replied = await prisma.feedback.count({
      where: { response: { isNot: null } }
    });
    const pending = total - replied;
    
    const avgRatingResult = await prisma.feedback.aggregate({
      _avg: { rating: true }
    });
    
    const avgRating = Math.round((avgRatingResult._avg.rating || 0) * 10) / 10;
    
    return { total, replied, pending, avgRating };
  }

  async getFeedbacks(query: FeedbackQuery): Promise<FeedbackDto[]> {
    const { filter = 'all', search = '' } = query;
    
    console.log('Service called with:', { filter, search }); // Debug log
    
    const whereClause: any = {};
    
    if (filter === 'replied') {
      whereClause.response = { isNot: null };
    } else if (filter === 'pending') {
      whereClause.response = null;
    }
    
    if (search.trim()) {
      whereClause.OR = [
        { trainee: { name: { contains: search, mode: 'insensitive' } } },
        { course: { title: { contains: search, mode: 'insensitive' } } },
        { review: { contains: search, mode: 'insensitive' } } 
      ];
      console.log('Search whereClause:', JSON.stringify(whereClause, null, 2)); // Debug log
    }
    
    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      include: {
        trainee: true,
        course: true,
        response: {
          include: {
            admin: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Database query returned:', feedbacks.length, 'results'); // Debug log
    
    return feedbacks.map(feedback => ({
      id: feedback.id,
      studentName: feedback.trainee.name,
      rating: feedback.rating,
      ratingLabel: this.getRatingLabel(feedback.sentiment),
      comment: feedback.review,
      course: feedback.course.title,
      date: feedback.createdAt.toISOString().slice(0, 10),
      status: feedback.response ? 'replied' : 'pending',
      response: feedback.response ? {
        adminName: feedback.response.admin.name,
        message: feedback.response.message,
        date: feedback.response.createdAt.toISOString().slice(0, 10)
      } : null
    }));
  }

  async getFeedbackById(id: number) {
    return await prisma.feedback.findUnique({
      where: { id },
      include: {
        trainee: true,
        course: true,
        response: {
          include: {
            admin: true
          }
        }
      }
    });
  }

  private getRatingLabel(sentiment: string): string {
    const sentimentMap: { [key: string]: string } = {
      'VERY_POOR': 'Very Poor',
      'POOR': 'Poor',
      'NEUTRAL': 'Neutral',
      'GOOD': 'Good',
      'VERY_GOOD': 'Very Good'
    };
    return sentimentMap[sentiment] || 'Neutral';
  }
}
