import React, { useEffect, useState } from "react";
import { Trainer } from "./types/types";
import { fetchTrainersWithStatus } from "./services/trainer.api";
import TrainerCard from "./TrainerCard";
import Sidebar from "./Sidebar";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  ::placeholder { color: rgba(255,255,255,0.3) !important; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 999px; }
`;

const StudentDashboard: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrainersWithStatus();
      setTrainers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCourses = trainers.reduce((sum, t) => sum + t.courses.length, 0);
  const completedFeedbacks = trainers.reduce(
    (sum, t) => sum + t.courses.filter((c) => c.hasFeedback).length,
    0
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #2d0a6b 0%, #5b247a 50%, #2d0a6b 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "fixed",
            top: "-200px",
            right: "-200px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,78,119,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(91,36,122,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "28px",
            padding: "32px",
            maxWidth: "1400px",
            margin: "0 auto",
            alignItems: "flex-start",
          }}
        >
          <Sidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalTrainers={trainers.length}
            totalCourses={totalCourses}
            completedFeedbacks={completedFeedbacks}
          />

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "13px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#e94e77",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "6px",
                }}
              >
                Welcome Back
              </div>
              <h1
                style={{
                  fontSize: "36px",
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff",
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Your Trainers & Courses
              </h1>
              {searchQuery && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Loading state */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "3px solid rgba(255,255,255,0.1)",
                    borderTop: "3px solid #e94e77",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Loading trainers...
                </span>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
                <div
                  style={{
                    color: "#fca5a5",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </div>
                <button
                  onClick={loadTrainers}
                  style={{
                    padding: "10px 24px",
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    borderRadius: "10px",
                    color: "#fca5a5",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredTrainers.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  gap: "12px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  border: "1px dashed rgba(255,255,255,0.15)",
                }}
              >
                <div style={{ fontSize: "48px" }}>
                  {searchQuery ? "🔎" : "👨‍🏫"}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {searchQuery
                    ? `No trainers matching "${searchQuery}"`
                    : "No trainers available yet"}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {searchQuery
                    ? "Try a different search term"
                    : "Check back later"}
                </div>
              </div>
            )}

            {/* Trainer grid */}
            {!loading && !error && filteredTrainers.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredTrainers.map((trainer) => (
                  <TrainerCard key={trainer.id} trainer={trainer} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
