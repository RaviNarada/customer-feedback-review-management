import React from "react";
import type { Course } from "./types";

interface SidebarProps {
    courses: string[];
    selected: Course;
    onSelect: (course: Course) => void;
    trainerCount: number;
}

const NAV_ICONS: Record<string, string> = {
    All: "⬡",
    "Web Development": "🌐",
    "Data Science": "📊",
    "UI/UX Design": "🎨",
    "Machine Learning": "🤖",
    Cybersecurity: "🔐",
    "Mobile Development": "📱",
    DevOps: "⚙️",
};

const Sidebar: React.FC<SidebarProps> = ({ courses, selected, onSelect, trainerCount }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">A</div>
                <div>
                    <div className="brand-name">AdminPanel</div>
                    <div className="brand-sub">Trainer Management</div>
                </div>
            </div>

            <div className="sidebar-section-label">FILTER BY COURSE</div>

            <nav className="sidebar-nav">
                {["All", ...courses].map((course) => (
                    <button
                        key={course}
                        className={`nav-item ${selected === course ? "active" : ""}`}
                        onClick={() => onSelect(course as Course)}
                    >
                        <span className="nav-icon">{NAV_ICONS[course] ?? "📚"}</span>
                        <span className="nav-label">{course}</span>
                        {selected === course && <span className="nav-indicator" />}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="footer-stat">
                    <span className="footer-stat-num">{trainerCount}</span>
                    <span className="footer-stat-label">Trainers Listed</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;