import { useState } from 'react';
import { X, User, BookOpen, Clock, Send } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Feedback } from './lib/api';
import './modal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feedback Details</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-feedback-card">
          <div className="modal-feedback-top">
            <div className="modal-student">
              <User size={22} className="user-icon-lg" />
              <span className="student-name-lg">{feedback.studentName}</span>
            </div>
            <span className="rating-badge-lg" style={{ background: color, color: '#fff' }}>
              {feedback.ratingLabel}
            </span>
          </div>
          <StarRating rating={feedback.rating} />
          <p className="modal-comment">{feedback.comment}</p>
          <hr className="divider" />
          <div className="feedback-meta">
            <span><BookOpen size={13} /> {feedback.course}</span>
            <span>•</span>
            <span><Clock size={13} /> {feedback.date}</span>
          </div>
        </div>

        {feedback.response && (
          <div className="existing-response">
            <p className="existing-response-label">✓ Previous response by {feedback.response.adminName}</p>
            <p>{feedback.response.message}</p>
          </div>
        )}

        <div className="response-section">
          <h3>{feedback.response ? 'Update your response' : 'Write your response'}</h3>
          <textarea
            className="response-textarea"
            placeholder="Type your response to this feedback..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            disabled={success}
          />
        </div>

        <div className="modal-footer">
          {success ? (
            <div className="success-msg">✓ Response saved!</div>
          ) : (
            <button className="submit-btn" onClick={handleSubmit} disabled={loading || !text.trim()}>
              <Send size={17} />
              {loading ? 'Submitting...' : 'Submit Response'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}