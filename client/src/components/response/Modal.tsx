import { useState } from 'react';
import { X, User, BookOpen, Clock, Send } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Feedback } from './lib/api';

const ratingColors: Record<string, string> = {
  'Very Good':  '#22c55e',
  'Good':       '#84cc16',
  'Neutral':    '#f59e0b',
  'Poor':       '#f97316',
  'Very Poor':  '#ef4444',
};

export function Modal({ feedback, onClose, onSubmit }: {
  feedback: Feedback;
  onClose: () => void;
  onSubmit: (id: number, message: string) => Promise<void>;
}) {
  const [text, setText] = useState(feedback.response?.message ?? '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const color = ratingColors[feedback.ratingLabel] ?? '#94a3b8';

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    await onSubmit(feedback.id, text);
    setSuccess(true);
    setLoading(false);
    setTimeout(onClose, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-6" onClick={onClose}>
<div className="bg-[rgba(42,2,69,0.95)] border border-[#4b0082]/30 rounded-[20px] w-full max-w-[720px] max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.7)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-[#4b0082]/30">
          <h2 className="font-['Syne'] text-lg font-bold text-white">Feedback Details</h2>
          <button className="bg-transparent border-none text-white/70 cursor-pointer p-1 rounded-lg hover:text-white transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 mx-7 bg-[rgba(255,255,255,0.1)] border border-[#6a0dad]/30 rounded-[14px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <User size={22} className="text-white" />
              <span className="font-['Syne'] font-bold text-white text-lg">{feedback.studentName}</span>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: color }}>
              {feedback.ratingLabel}
            </span>
          </div>
          <StarRating rating={feedback.rating} filledColor="#ffffff" emptyColor="rgba(255,255,255,0.4)" />
          <p className="text-white/90 text-sm leading-relaxed my-3">{feedback.comment}</p>
          <hr className="border-none border-t border-[#4b0082]/30 my-3" />
          <div className="flex items-center gap-3.5 text-white/70 text-xs">
            <span className="flex items-center gap-1.5"><BookOpen size={13} /> {feedback.course}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {feedback.date}</span>
          </div>
        </div>

        {feedback.response && (
          <div className="mt-4 mx-7 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <p className="font-semibold mb-1.5 text-green-600">✓ Previous response by {feedback.response.adminName}</p>
            <p>{feedback.response.message}</p>
          </div>
        )}

        <div className="px-7 pt-5">
          <h3 className="font-['Syne'] font-bold mb-3 text-white">{feedback.response ? 'Update your response' : 'Write your response'}</h3>
          <textarea
            className="w-full bg-[rgba(255,255,255,0.1)] border border-[#6a0dad]/30 rounded-xl p-4 text-white font-['DM_Sans'] text-sm resize-vertical outline-none transition-colors focus:border-[#a52bbf] placeholder:text-white/60 disabled:opacity-60 min-h-[130px]"
            placeholder="Type your response to this feedback..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            disabled={success}
          />
        </div>

        <div className="flex justify-end px-7 pt-4 pb-6">
          {success ? (
            <div className="text-green-600 font-semibold text-sm flex items-center gap-2">✓ Response saved!</div>
          ) : (
            <button 
              className="flex items-center gap-2.5 px-7 py-3 bg-gradient-to-br from-[#2d0a6b] to-[#e94e77] border-none rounded-xl text-white font-['Syne'] font-bold text-sm cursor-pointer hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none" 
              onClick={handleSubmit} 
              disabled={loading || !text.trim()}
            >
              <Send size={17} />
              {loading ? 'Submitting...' : 'Submit Response'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}