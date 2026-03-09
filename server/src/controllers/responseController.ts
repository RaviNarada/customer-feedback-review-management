import { Request, Response } from 'express';
import { ResponseService } from '../services/responseService';
import { ApiResponse, CreateResponseDto } from '../types';

const responseService = new ResponseService();

export class ResponseController {
  async createResponse(req: Request, res: Response) {
    try {
      const { feedbackId } = req.params;
      const { message } = req.body as CreateResponseDto;
      
      if (!message || message.trim() === '') {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Response message is required'
        };
        return res.status(400).json(response);
      }
      
      const feedbackIdNum = parseInt(feedbackId);
      if (isNaN(feedbackIdNum)) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Invalid feedback ID'
        };
        return res.status(400).json(response);
      }
      
      const adminId = 1;
      
      const result = await responseService.createResponse(feedbackIdNum, adminId, { message });
      
      const response: ApiResponse<any> = {
        success: true,
        data: result,
        message: 'Response created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create response'
      };
      
      if (error instanceof Error && error.message === 'Feedback not found') {
        return res.status(404).json(response);
      }
      
      if (error instanceof Error && error.message === 'Response already exists for this feedback') {
        return res.status(409).json(response);
      }
      
      res.status(500).json(response);
    }
  }

  async getResponseByFeedbackId(req: Request, res: Response) {
    try {
      const { feedbackId } = req.params;
      const feedbackIdNum = parseInt(feedbackId);
      
      if (isNaN(feedbackIdNum)) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Invalid feedback ID'
        };
        return res.status(400).json(response);
      }
      
      const response = await responseService.getResponseByFeedbackId(feedbackIdNum);
      
      if (!response) {
        const emptyResponse: ApiResponse<any> = {
          success: true,
          data: null,
          message: 'No response found for this feedback'
        };
        return res.json(emptyResponse);
      }
      
      const apiResponse: ApiResponse<any> = {
        success: true,
        data: response
      };
      
      res.json(apiResponse);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch response'
      };
      
      res.status(500).json(response);
    }
  }

  async updateResponse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body as CreateResponseDto;
      
      if (!message || message.trim() === '') {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Response message is required'
        };
        return res.status(400).json(response);
      }
      
      const responseId = parseInt(id);
      if (isNaN(responseId)) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Invalid response ID'
        };
        return res.status(400).json(response);
      }
      
      const adminId = 1;
      
      const result = await responseService.updateResponse(responseId, adminId, { message });
      
      const response: ApiResponse<any> = {
        success: true,
        data: result,
        message: 'Response updated successfully'
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update response'
      };
      
      if (error instanceof Error && error.message === 'Response not found') {
        return res.status(404).json(response);
      }
      
      if (error instanceof Error && error.message === 'Not authorized to update this response') {
        return res.status(403).json(response);
      }
      
      res.status(500).json(response);
    }
  }

  async deleteResponse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const responseId = parseInt(id);
      
      if (isNaN(responseId)) {
        const response: ApiResponse<any> = {
          success: false,
          error: 'Invalid response ID'
        };
        return res.status(400).json(response);
      }
      
      const adminId = 1;
      
      await responseService.deleteResponse(responseId, adminId);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Response deleted successfully'
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<any> = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete response'
      };
      
      if (error instanceof Error && error.message === 'Response not found') {
        return res.status(404).json(response);
      }
      
      if (error instanceof Error && error.message === 'Not authorized to delete this response') {
        return res.status(403).json(response);
      }
      
      res.status(500).json(response);
    }
  }
}
