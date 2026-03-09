import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Trainer } from './types/types';

interface TrainerCardProps {
  trainer: Trainer;
  index: number;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, index }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const initials = trainer.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const completedCount = trainer.courses.filter((c) => c.hasFeedback).length;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        padding: '24px',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(233,78,119,0.2)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #e94e77, #9b2d5a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(233,78,119,0.4)',
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '17px',
              fontWeight: 600,
              color: '#fff',
              fontFamily: "'Playfair Display', serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {trainer.name}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '3px',
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {trainer.expertise}
          </div>
        </div>
        <div
          style={{
            fontSize: '11px',
            color: completedCount === trainer.courses.length ? '#22c55e' : 'rgba(255,255,255,0.4)',
            fontFamily: "'DM Sans', sans-serif",
            flexShrink: 0,
          }}
        >
          {completedCount}/{trainer.courses.length}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />

      {/* Courses */}
      {trainer.courses.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
          No courses assigned.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trainer.courses.map((course) => (
            <div
              key={course.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{ fontSize: '14px' }}>{course.hasFeedback ? '✅' : '📋'}</span>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {course.title}
                </span>
              </div>
              {course.hasFeedback ? (
                <button
                  onClick={() => navigate(`/responses/${course.id}`)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(233,78,119,0.5)',
                    background: 'transparent',
                    color: '#e94e77',
                    fontSize: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(233,78,119,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  View Response
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/trainee-dashboard/feedback/${course.id}`)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e94e77, #c0386a)',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 3px 12px rgba(233,78,119,0.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(233,78,119,0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(233,78,119,0.35)';
                  }}
                >
                  Give Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerCard;
