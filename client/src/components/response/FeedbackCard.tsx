// import { User, MessageSquare, Star } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Feedback } from './lib/api';
import { User, MessageSquare, BookOpen, Clock } from 'lucide-react';

const ratingColors: Record<string, string> = {
  'Very Good':  '#22c55e',
  'Good':       '#84cc16',
  'Neutral':    '#f59e0b',
  'Poor':       '#f97316',
  'Very Poor':  '#ef4444',
};

export function FeedbackCard({ feedback, onClick }: { feedback: Feedback; onClick: () => void }) {
  const color = ratingColors[feedback.ratingLabel] ?? '#94a3b8';
  return (
    <div className="feedback-card" onClick={onClick}>
      <div className="feedback-card-header">
        <div className="feedback-card-left">
          <User size={20} className="user-icon" />
          <span className="student-name">{feedback.studentName}</span>
          <span className="rating-badge" style={{ background: color + '22', color, border: `1px solid ${color}55` }}>
            {feedback.ratingLabel}
          </span>
          <StarRating rating={feedback.rating} />
        </div>
        <div className={`status-badge ${feedback.status}`}>
          <MessageSquare size={13} />
          {feedback.status === 'replied' ? 'Replied' : 'Pending'}
        </div>
      </div>
      <p className="feedback-comment">{feedback.comment}</p>
      <div className="feedback-meta">
        <span><BookOpen size={13} /> {feedback.course}</span>
        <span><Clock size={13} /> {feedback.date}</span>
      </div>
    </div>
  );
}