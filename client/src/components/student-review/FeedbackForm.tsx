import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SENTIMENT_OPTIONS } from './types/types';
import type { SentimentValue } from './types/types';
import type { FeedbackFormData } from './types/types';
import { submitFeedback } from './services/feedback.api';
import StarRating from './StarRating';

const QUESTIONS: { key: keyof Omit<FeedbackFormData, 'courseId' | 'rating'>; label: string; emoji: string }[] = [
  { key: 'contentQuality', label: 'Content Quality', emoji: '📚' },
  { key: 'trainerKnowledge', label: 'Trainer Knowledge', emoji: '🧠' },
  { key: 'communication', label: 'Communication', emoji: '💬' },
  { key: 'practicalRelevance', label: 'Practical Relevance', emoji: '⚙️' },
  { key: 'overallStructure', label: 'Overall Structure', emoji: '🏗️' },
];

const FeedbackForm: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FeedbackFormData>({
    courseId: courseId || '',
    rating: 0,
    contentQuality: '',
    trainerKnowledge: '',
    communication: '',
    practicalRelevance: '',
    overallStructure: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setSentiment = (key: keyof Omit<FeedbackFormData, 'courseId' | 'rating'>, val: SentimentValue) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const isValid =
    form.rating > 0 &&
    form.contentQuality !== '' &&
    form.trainerKnowledge !== '' &&
    form.communication !== '' &&
    form.practicalRelevance !== '' &&
    form.overallStructure !== '';

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Please fill in all fields before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await submitFeedback(form);
      setSuccess(true);
      setTimeout(() => navigate('/trainee-dashboard'), 2200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a0540, #3d1060, #1a0540)',
          fontFamily: "'DM Sans', sans-serif",
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
        }}
      >
        {/* Success State */}
        {success ? (
          <div
            style={{
              textAlign: 'center',
              animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px',
              padding: '52px 48px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', margin: '0 0 10px' }}>
              Feedback Submitted!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginBottom: '28px' }}>
              Thank you for your review. Redirecting you back...
            </p>
            <div
              style={{
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '99px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #e94e77, #c0386a)',
                  borderRadius: '99px',
                  animation: 'progressFill 2s linear both',
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              animation: 'fadeUp 0.4s ease both',
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate('/trainee-dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              ← Back to Dashboard
            </button>

            {/* Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '24px',
                padding: '36px 32px',
              }}
            >
              <p style={{ margin: '0 0 6px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                Course Review
              </p>
              <h1 style={{ margin: '0 0 28px', fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700 }}>
                Submit Feedback
              </h1>

              {/* Star Rating */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'rgba(255,255,255,0.75)' }}>
                  Overall Rating
                </label>
                <StarRating value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '24px' }} />

              {/* Sentiment Questions */}
              {QUESTIONS.map((q) => (
                <div key={q.key} style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'rgba(255,255,255,0.75)' }}>
                    {q.emoji} {q.label}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SENTIMENT_OPTIONS.map((opt) => {
                      const selected = form[q.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setSentiment(q.key, opt.value)}
                          style={{
                            padding: '7px 16px',
                            borderRadius: '99px',
                            border: `1px solid ${selected ? '#e94e77' : 'rgba(255,255,255,0.18)'}`,
                            background: selected ? 'rgba(233,78,119,0.18)' : 'rgba(255,255,255,0.05)',
                            color: selected ? '#e94e77' : 'rgba(255,255,255,0.65)',
                            fontSize: '13px',
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: selected ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = 'rgba(233,78,119,0.5)';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                              e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                            }
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#fca5a5',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !isValid}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    !isValid || submitting
                      ? 'rgba(255,255,255,0.1)'
                      : 'linear-gradient(135deg, #e94e77, #c0386a)',
                  color: !isValid || submitting ? 'rgba(255,255,255,0.35)' : '#fff',
                  fontSize: '15px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  cursor: !isValid || submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: isValid && !submitting ? '0 4px 20px rgba(233,78,119,0.4)' : 'none',
                }}
              >
                {submitting && (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                )}
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FeedbackForm;
