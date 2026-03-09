export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ResponseDto {
  adminName: string;
  message: string;
  date: string;
}

export interface FeedbackDto {
  id: number;
  studentName: string;
  rating: number;
  ratingLabel: string;
  comment: string;
  course: string;
  date: string;
  status: 'replied' | 'pending';
  response?: ResponseDto | null;
}

export interface StatsDto {
  total: number;
  replied: number;
  pending: number;
  avgRating: number;
}

export interface CreateResponseDto {
  message: string;
}

export interface FeedbackQuery {
  filter?: 'all' | 'replied' | 'pending';
  search?: string;
}

export type SentimentFive = 'VERY_POOR' | 'POOR' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD';
export type Role = 'ADMIN' | 'TRAINEE';
