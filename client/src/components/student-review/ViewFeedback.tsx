import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FeedbackRecord, SENTIMENT_COLOR, SENTIMENT_SCORE } from "./types/types";
import { fetchFeedbackByCourse } from "./services/feedback.api";
import StarRating from "./StarRating";

const QUESTION_LABELS: Record<string, { label: string; icon: string }> = {
  contentQuality: { label: "Content Quality", icon: "📝" },
  trainerKnowledge: { label: "Trainer Knowledge", icon: "🧠" },
  communication: { label: "Communication", icon: "💬" },
  practicalRelevance: { label: "Practical Relevance", icon: "⚙️" },
  overallStructure: { label: "Overall Training Structure", icon: "📊" },
};

const formatSentiment = (value: string): string =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const ViewFeedback: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    fetchFeedbackByCourse(courseId)
      .then(setFeedback)
      .catch((err) => setError(err.message || "Failed to load feedback"))
      .finally(() => setLoading(false));
  }, [courseId]);

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
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
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

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "80px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid rgba(255,255,255,0.1)",
                  borderTop: "3px solid #e94e77",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
                color: "#fca5a5",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
              {error}
            </div>
          )}

          {!loading && !error && feedback && (
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
                Your Feedback
              </div>
              <h1
                style={{
                  fontSize: "30px",
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                  margin: "0 0 6px",
                }}
              >
                Feedback Summary
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "13px",
                  marginBottom: "32px",
                }}
              >
                Submitted on {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              {/* Star rating */}
              <div
                style={{
                  marginBottom: "32px",
                  padding: "20px 24px",
                  background: "rgba(233,78,119,0.1)",
                  border: "1px solid rgba(233,78,119,0.2)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: "8px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Overall Rating
                  </div>
                  <StarRating value={feedback.rating} readonly size={28} />
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: "48px",
                    fontWeight: 900,
                    fontFamily: "'Playfair Display', serif",
                    color: "#e94e77",
                  }}
                >
                  {feedback.rating}/5
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  marginBottom: "28px",
                }}
              />

              {/* Sentiment answers */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(
                  [
                    "contentQuality",
                    "trainerKnowledge",
                    "communication",
                    "practicalRelevance",
                    "overallStructure",
                  ] as const
                ).map((field) => {
                  const meta = QUESTION_LABELS[field];
                  const value = feedback[field];
                  const color = SENTIMENT_COLOR[value];
                  const score = SENTIMENT_SCORE[value];

                  return (
                    <div
                      key={field}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px 20px",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>{meta.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.6)",
                            marginBottom: "4px",
                          }}
                        >
                          {meta.label}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            marginTop: "4px",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              style={{
                                height: "4px",
                                flex: 1,
                                borderRadius: "999px",
                                background: i <= score ? color : "rgba(255,255,255,0.1)",
                                transition: "background 0.3s ease",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color,
                          padding: "4px 12px",
                          background: `${color}18`,
                          borderRadius: "999px",
                          border: `1px solid ${color}40`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatSentiment(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewFeedback;
