export type SentimentValue = 'VERY_POOR' | 'POOR' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD';

export interface Course {
  id: string;
  title: string;
  hasFeedback: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  expertise: string;
  courses: Course[];
}

export interface FeedbackFormData {
  courseId: string;
  rating: number;
  contentQuality: SentimentValue | '';
  trainerKnowledge: SentimentValue | '';
  communication: SentimentValue | '';
  practicalRelevance: SentimentValue | '';
  overallStructure: SentimentValue | '';
}

export const SENTIMENT_OPTIONS = [
  { value: 'VERY_POOR' as SentimentValue, label: 'Very Poor' },
  { value: 'POOR' as SentimentValue, label: 'Poor' },
  { value: 'NEUTRAL' as SentimentValue, label: 'Neutral' },
  { value: 'GOOD' as SentimentValue, label: 'Good' },
  { value: 'VERY_GOOD' as SentimentValue, label: 'Very Good' },
];

export const SENTIMENT_SCORE: Record<SentimentValue, number> = {
  VERY_POOR: 1,
  POOR: 2,
  NEUTRAL: 3,
  GOOD: 4,
  VERY_GOOD: 5,
};

export const SENTIMENT_COLOR: Record<SentimentValue, string> = {
  VERY_POOR: '#ef4444',
  POOR: '#f97316',
  NEUTRAL: '#eab308',
  GOOD: '#22c55e',
  VERY_GOOD: '#e94e77',
};
