import { PrismaClient } from '../../generated/prisma';
import { CreateResponseDto } from '../types';

const prisma = new PrismaClient();

export class ResponseService {
  async createResponse(feedbackId: number, adminId: number, data: CreateResponseDto) {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });
    
    if (!feedback) {
      throw new Error('Feedback not found');
    }
    
    const existingResponse = await prisma.response.findUnique({
      where: { feedbackId }
    });
    
    if (existingResponse) {
      throw new Error('Response already exists for this feedback');
    }
    
    return await prisma.response.create({
      data: {
        message: data.message,
        adminId,
        feedbackId
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        feedback: {
          include: {
            trainee: true,
            course: true
          }
        }
      }
    });
  }

  async getResponseByFeedbackId(feedbackId: number) {
    return await prisma.response.findUnique({
      where: { feedbackId },
      include: {
        admin: true,
        feedback: {
          include: {
            trainee: true,
            course: true
          }
        }
      }
    });
  }

  async updateResponse(responseId: number, adminId: number, data: CreateResponseDto) {
    const response = await prisma.response.findUnique({
      where: { id: responseId }
    });
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    if (response.adminId !== adminId) {
      throw new Error('Not authorized to update this response');
    }
    
    return await prisma.response.update({
      where: { id: responseId },
      data: {
        message: data.message
      },
      include: {
        admin: true,
        feedback: {
          include: {
            trainee: true,
            course: true
          }
        }
      }
    });
  }

  async deleteResponse(responseId: number, adminId: number) {
    const response = await prisma.response.findUnique({
      where: { id: responseId }
    });
    
    if (!response) {
      throw new Error('Response not found');
    }
    
    if (response.adminId !== adminId) {
      throw new Error('Not authorized to delete this response');
    }
    
    return await prisma.response.delete({
      where: { id: responseId }
    });
  }
}
