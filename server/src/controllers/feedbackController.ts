import { Request, Response } from 'express';
import { FeedbackService } from '../services/feedbackService';
import { ApiResponse, FeedbackQuery } from '../types';

const feedbackService = new FeedbackService();

export class FeedbackController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await feedbackService.getStats();
      
      const response: ApiResponse<any> = {
        success: true,
        data: stats
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats'
      };
      
      res.status(500).json(response);
    }
  }

  async getFeedbacks(req: Request, res: Response) {
    try {
      const { filter, search } = req.query as FeedbackQuery;
      
      console.log('Query params:', { filter, search }); // Debug log
      
      const feedbacks = await feedbackService.getFeedbacks({
        filter: filter as 'all' | 'replied' | 'pending',
        search: search as string
      });
      
      console.log('Found feedbacks:', feedbacks.length); // Debug log
      
      const response: ApiResponse<any> = {
        success: true,
        data: feedbacks
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error in getFeedbacks:', error); // Debug log
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch feedbacks'
      };
      
      res.status(500).json(response);
    }
  }

  async getFeedbackById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const feedbackId = parseInt(id);
      
      if (isNaN(feedbackId)) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Invalid feedback ID'
        };
        return res.status(400).json(response);
      }
      
      const feedback = await feedbackService.getFeedbackById(feedbackId);
      
      if (!feedback) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Feedback not found'
        };
        return res.status(404).json(response);
      }
      
      const response: ApiResponse<any> = {
        success: true,
        data: feedback
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch feedback'
      };
      
      res.status(500).json(response);
    }
  }
}
