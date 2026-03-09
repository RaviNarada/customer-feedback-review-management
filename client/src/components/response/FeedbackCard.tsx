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
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 cursor-pointer transition-all hover:border-[#5b247a]/40 hover:shadow-md" onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <User size={20} className="text-gray-500" />
          <span className="font-['Syne'] font-bold text-gray-800">{feedback.studentName}</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold" style={{ background: color + '22', color, border: `1px solid ${color}55` }}>
            {feedback.ratingLabel}
          </span>
          <StarRating rating={feedback.rating} />
        </div>
        <div className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold ${
          feedback.status === 'replied' 
            ? 'bg-green-500/[0.13] text-green-600 border border-green-500/20' 
            : 'bg-red-500/[0.13] text-red-600 border border-red-500/20'
        }`}>
          <MessageSquare size={13} />
          {feedback.status === 'replied' ? 'Replied' : 'Pending'}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-3">{feedback.comment}</p>
      <div className="flex items-center gap-3.5 text-gray-500 text-xs">
        <span className="flex items-center gap-1.5"><BookOpen size={13} /> {feedback.course}</span>
        <span className="flex items-center gap-1.5"><Clock size={13} /> {feedback.date}</span>
      </div>
    </div>
  );
}