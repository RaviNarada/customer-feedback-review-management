import React from "react";
import type { Trainer } from "./types";

interface TrainerCardProps {
    trainer: Trainer;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(trainer.rating));

    return (
        <div className="trainer-card">
            <div className="card-glow" />
            <div className="card-header">
                <div className="avatar">{trainer.avatar}</div>
                <div className="card-title">
                    <h3>{trainer.name}</h3>
                    <span className="course-badge">{trainer.course}</span>
                </div>
            </div>

            <p className="bio">{trainer.bio}</p>

            <div className="card-stats">
                <div className="stat">
                    <span className="stat-value">{trainer.students}</span>
                    <span className="stat-label">Students</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                    <span className="stat-value">{trainer.experience}</span>
                    <span className="stat-label">Experience</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                    <span className="stat-value">{trainer.rating.toFixed(1)}</span>
                    <span className="stat-label">Rating</span>
                </div>
            </div>

            <div className="stars">
                {stars.map((filled, i) => (
                    <span key={i} className={`star ${filled ? "filled" : "empty"}`}>
            ★
          </span>
                ))}
            </div>
        </div>
    );
};

export default TrainerCard;