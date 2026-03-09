import React from "react";
import SearchBar from "./SearchBar";

interface SidebarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalTrainers: number;
  totalCourses: number;
  completedFeedbacks: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  onSearchChange,
  totalTrainers,
  totalCourses,
  completedFeedbacks,
}) => {
  return (
    <aside
      style={{
        width: "280px",
        flexShrink: 0,
        position: "sticky",
        top: "24px",
        alignSelf: "flex-start",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "28px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      {/* Logo / Title */}
      <div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#e94e77",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          Trainee Portal
        </div>
        <div
          style={{
            fontSize: "22px",
            fontFamily: "'Playfair Display', serif",
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Feedback<br />Dashboard
        </div>
      </div>

      {/* Search */}
      <div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "10px",
          }}
        >
          Search
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* Stats */}
      <div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "14px",
          }}
        >
          Overview
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Trainers", value: totalTrainers, icon: "👨‍🏫" },
            { label: "Courses", value: totalCourses, icon: "📚" },
            {
              label: "Reviews Given",
              value: `${completedFeedbacks}/${totalCourses}`,
              icon: "✅",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "10px",
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span>{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "10px",
          }}
        >
          Completion
        </div>
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width:
                totalCourses > 0
                  ? `${(completedFeedbacks / totalCourses) * 100}%`
                  : "0%",
              background:
                "linear-gradient(90deg, #e94e77, #5b247a)",
              borderRadius: "999px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {totalCourses > 0
            ? `${Math.round((completedFeedbacks / totalCourses) * 100)}% complete`
            : "No courses yet"}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
