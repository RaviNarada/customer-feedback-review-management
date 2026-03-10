import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TrainerCard from "./TrainerCard";
import type { Trainer, Course } from "./types";
import "./Trainerdashboard.css";

const TrainerDashboard: React.FC = () => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course>("All");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Fetch trainers from backend
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trainers`);
                const data = await res.json();
                setTrainers(data.data);
            } catch (err) {
                console.error("Failed to fetch trainers", err);
            }
        };

        fetchTrainers();
    }, []);

    const courses = useMemo(
        () => [...new Set(trainers.map((t) => t.course))],
        [trainers]
    );

    const filtered = useMemo(() => {
        return trainers.filter((t) => {
            const matchCourse = selectedCourse === "All" || t.course === selectedCourse;

            const matchSearch =
                t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.course.toLowerCase().includes(search.toLowerCase());

            return matchCourse && matchSearch;
        });
    }, [trainers, selectedCourse, search]);

    return (
        <div className="dashboard-root">
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

                    <div className="search-wrap" style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span className="search-icon">🔍</span>
                            <input
                                className="search-input"
                                placeholder="Search by name or course…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-8 py-3 rounded-full bg-pink-500/22 hover:bg-pink-500/40 border border-pink-500/40 text-purple-100 font-bold cursor-pointer transition-all duration-200 hover:scale-105"
                        >
                            Logout 🚪
                        </button>
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

                <button 
                    onClick={() => navigate('/admin-dashboard/sentiment-dashboard')}
                    className="fixed bottom-8 right-8 px-16 py-6 rounded-full bg-pink-500/20 border border-pink-500/40 text-purple-100 font-bold cursor-pointer transition-all duration-300 ease-in-out text-base shadow-lg hover:bg-pink-500/40 hover:shadow-xl hover:-translate-y-1 z-10"
                >
                    📊 View Analytics
                </button>
            </main>
        </div>
    );
};

export default TrainerDashboard;