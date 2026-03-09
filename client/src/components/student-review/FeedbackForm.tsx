import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FeedbackFormData,
  SentimentValue,
  SENTIMENT_OPTIONS,
} from "./types/types";
import { submitFeedback } from "./services/feedback.api";
import StarRating from "./StarRating";

const QUESTIONS: {
  key: keyof Omit<FeedbackFormData, "courseId" | "rating">;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    key: "contentQuality",
    label: "Content Quality",
    icon: "📝",
    description: "How would you rate the quality and relevance of course content?",
  },
  {
    key: "trainerKnowledge",
    label: "Trainer Knowledge",
    icon: "🧠",
    description: "How well did the trainer demonstrate subject matter expertise?",
  },
  {
    key: "communication",
    label: "Communication",
    icon: "💬",
    description: "How clearly and effectively did the trainer communicate?",
  },
  {
    key: "practicalRelevance",
    label: "Practical Relevance",
    icon: "⚙️",
    description: "How applicable was the training to real-world scenarios?",
  },
  {
    key: "overallStructure",
    label: "Overall Training Structure",
    icon: "📊",
    description: "How well was the training organized and structured?",
  },
];

type FormState = Omit<FeedbackFormData, "courseId">;

const initialState: FormState = {
  rating: 0,
  contentQuality: "",
  trainerKnowledge: "",
  communication: "",
  practicalRelevance: "",
  overallStructure: "",
};

const FeedbackForm: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.rating) newErrors.rating = "Please select a star rating";
    QUESTIONS.forEach((q) => {
      if (!form[q.key]) newErrors[q.key] = "Please select an option";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!courseId) return;

    try {
      setSubmitting(true);
      setApiError(null);
      await submitFeedback({ ...form, courseId } as FeedbackFormData);
      setSubmitted(true);
      setTimeout(() => navigate("/student-dashboard"), 2500);
    } catch (err: any) {
      setApiError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #2d0a6b 0%, #5b247a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.12)",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap');`}</style>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
          <h2
            style={{
              fontSize: "28px",
              fontFamily: "'Playfair Display', serif",
              color: "#fff",
              margin: "0 0 10px",
            }}
          >
            Feedback Submitted!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>
            Thank you for your feedback. Redirecting to dashboard...
          </p>
          <div
            style={{
              marginTop: "24px",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #e94e77, #5b247a)",
                borderRadius: "999px",
                animation: "progress 2.5s linear forwards",
              }}
            />
          </div>
          <style>{`@keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #2d0a6b 0%, #5b247a 50%, #2d0a6b 100%)",
          padding: "40px 24px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/student-dashboard")}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              borderRadius: "10px",
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: "13px",
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Back to Dashboard
          </button>

          {/* Form card */}
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "40px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#e94e77",
                marginBottom: "8px",
              }}
            >
              Feedback Form
            </div>
            <h1
              style={{
                fontSize: "30px",
                fontFamily: "'Playfair Display', serif",
                color: "#fff",
                margin: "0 0 8px",
              }}
            >
              Share Your Experience
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "14px",
                marginBottom: "36px",
              }}
            >
              Your honest feedback helps improve the quality of training.
            </p>

            {/* Star Rating */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  marginBottom: "12px",
                }}
              >
                Overall Rating
              </label>
              <StarRating
                value={form.rating}
                onChange={(r) => {
                  setForm((f) => ({ ...f, rating: r }));
                  setErrors((e) => ({ ...e, rating: undefined }));
                }}
                size={36}
              />
              {errors.rating && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                marginBottom: "32px",
              }}
            />

            {/* Questions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <div style={{ marginBottom: "12px" }}>
                    <label
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{q.icon}</span>
                      {q.label}
                    </label>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "13px",
                        margin: "4px 0 0 26px",
                      }}
                    >
                      {q.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {SENTIMENT_OPTIONS.map((opt) => {
                      const selected = form[q.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setForm((f) => ({ ...f, [q.key]: opt.value as SentimentValue }));
                            setErrors((e) => ({ ...e, [q.key]: undefined }));
                          }}
                          style={{
                            padding: "8px 18px",
                            borderRadius: "999px",
                            border: selected
                              ? "1px solid #e94e77"
                              : "1px solid rgba(255,255,255,0.15)",
                            background: selected
                              ? "rgba(233,78,119,0.2)"
                              : "rgba(255,255,255,0.05)",
                            color: selected ? "#fff" : "rgba(255,255,255,0.6)",
                            fontSize: "13px",
                            fontWeight: selected ? 600 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors[q.key] && (
                    <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px" }}>
                      {errors[q.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* API Error */}
            {apiError && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "14px 18px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "12px",
                  color: "#fca5a5",
                  fontSize: "14px",
                }}
              >
                ⚠️ {apiError}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: "36px",
                width: "100%",
                padding: "16px",
                background: submitting
                  ? "rgba(233,78,119,0.4)"
                  : "linear-gradient(135deg, #e94e77, #c0356a)",
                border: "none",
                borderRadius: "14px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: submitting ? "none" : "0 8px 24px rgba(233,78,119,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {submitting ? "Submitting..." : "Submit Feedback →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
