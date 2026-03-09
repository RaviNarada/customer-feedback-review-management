import React from "react";
import { useNavigate } from "react-router-dom";
import { Trainer } from "./types/types";

interface TrainerCardProps {
  trainer: Trainer;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => {
  const navigate = useNavigate();

  const initials = trainer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 20px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Trainer Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #e94e77, #5b247a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {trainer.name}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#e94e77",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "2px",
            }}
          >
            {trainer.expertise}
          </div>
        </div>
      </div>

      {/* Courses */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {trainer.courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "3px",
                }}
              >
                Course
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {course.title}
              </div>
            </div>

            <button
              onClick={() =>
                navigate(
                  course.hasFeedback
                    ? `/student-dashboard/view-feedback/${course.id}`
                    : `/student-dashboard/feedback/${course.id}`
                )
              }
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s ease",
                ...(course.hasFeedback
                  ? {
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }
                  : {
                      background: "linear-gradient(135deg, #e94e77, #c0356a)",
                      color: "#fff",
                      boxShadow: "0 4px 15px rgba(233,78,119,0.35)",
                    }),
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                if (course.hasFeedback) {
                  btn.style.background = "rgba(255,255,255,0.15)";
                } else {
                  btn.style.transform = "scale(1.03)";
                }
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                if (course.hasFeedback) {
                  btn.style.background = "rgba(255,255,255,0.1)";
                } else {
                  btn.style.transform = "scale(1)";
                }
              }}
            >
              {course.hasFeedback ? "✓ View Feedback" : "Give Feedback"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerCard;
