import React, { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import TrainerCard from "./TrainerCard";
import type { Trainer, Course } from "./types";
import "./TrainerDashboard.css";

const SAMPLE_TRAINERS: Trainer[] = [
    {
        id: 1,
        name: "Arjun Mehta",
        course: "Web Development",
        rating: 5,
        avatar: "AM",
        students: 312,
        experience: "7 yrs",
        bio: "Full-stack wizard specialising in React, Node.js, and scalable cloud architectures.",
    },
    {
        id: 2,
        name: "Priya Sharma",
        course: "Data Science",
        rating: 4,
        avatar: "PS",
        students: 278,
        experience: "5 yrs",
        bio: "Passionate about turning raw data into actionable insights using Python & Tableau.",
    },
    {
        id: 3,
        name: "Carlos Rivera",
        course: "UI/UX Design",
        rating: 5,
        avatar: "CR",
        students: 198,
        experience: "6 yrs",
        bio: "Award-winning designer crafting delightful user experiences for global products.",
    },
    {
        id: 4,
        name: "Mei Lin",
        course: "Machine Learning",
        rating: 4,
        avatar: "ML",
        students: 241,
        experience: "4 yrs",
        bio: "Deep learning researcher with publications on NLP and computer vision.",
    },
    {
        id: 5,
        name: "Tariq Hassan",
        course: "Cybersecurity",
        rating: 5,
        avatar: "TH",
        students: 167,
        experience: "8 yrs",
        bio: "Certified ethical hacker helping organisations stay one step ahead of threats.",
    },
    {
        id: 6,
        name: "Ananya Iyer",
        course: "Mobile Development",
        rating: 3,
        avatar: "AI",
        students: 143,
        experience: "3 yrs",
        bio: "Flutter & React Native specialist building buttery-smooth cross-platform apps.",
    },
    {
        id: 7,
        name: "Lucas Fernandez",
        course: "DevOps",
        rating: 4,
        avatar: "LF",
        students: 189,
        experience: "6 yrs",
        bio: "CI/CD pipeline architect with deep expertise in Kubernetes and Terraform.",
    },
    {
        id: 8,
        name: "Nadia Kowalski",
        course: "Web Development",
        rating: 4,
        avatar: "NK",
        students: 256,
        experience: "5 yrs",
        bio: "Frontend performance enthusiast and accessibility advocate.",
    },
    {
        id: 9,
        name: "Rohan Gupta",
        course: "Data Science",
        rating: 5,
        avatar: "RG",
        students: 304,
        experience: "9 yrs",
        bio: "Statistician turned data scientist with a knack for compelling data storytelling.",
    },
];

const TrainerDashboard: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<Course>("All");
    const [search, setSearch] = useState("");

    const courses = useMemo(
        () => [...new Set(SAMPLE_TRAINERS.map((t) => t.course))],
        []
    );

    const filtered = useMemo(() => {
        return SAMPLE_TRAINERS.filter((t) => {
            const matchCourse = selectedCourse === "All" || t.course === selectedCourse;
            const matchSearch =
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.course.toLowerCase().includes(search.toLowerCase());
            return matchCourse && matchSearch;
        });
    }, [selectedCourse, search]);

    return (
        <div className="dashboard-root">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />

            <Sidebar
                courses={courses}
                selected={selectedCourse}
                onSelect={setSelectedCourse}
                trainerCount={filtered.length}
            />

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h1 className="page-title">Trainer Directory</h1>
                        <p className="page-sub">
                            {filtered.length} trainer{filtered.length !== 1 ? "s" : ""} found
                        </p>
                    </div>
                    <div className="search-wrap">
                        <span className="search-icon">🔍</span>
                        <input
                            className="search-input"
                            placeholder="Search by name or course…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </header>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎓</div>
                        <p>No trainers match your filters.</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {filtered.map((trainer) => (
                            <TrainerCard key={trainer.id} trainer={trainer} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrainerDashboard;