import React from 'react';
import SearchBar from './SearchBar';
import type { Trainer } from './types/types';

interface SidebarProps {
  trainers: Trainer[];
  search: string;
  onSearchChange: (val: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ trainers, search, onSearchChange }) => {
  const totalCourses = trainers.reduce((acc, t) => acc + t.courses.length, 0);
  const reviewsGiven = trainers.reduce(
    (acc, t) => acc + t.courses.filter((c) => c.hasFeedback).length,
    0
  );
  const progress = totalCourses > 0 ? Math.round((reviewsGiven / totalCourses) * 100) : 0;

  const statBlock = (label: string, value: number | string) => (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ fontSize: '22px', fontWeight: 700, color: '#e94e77', fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
    </div>
  );

  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        position: 'sticky',
        top: '24px',
        alignSelf: 'flex-start',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Title */}
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '6px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Trainee Portal
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: '20px',
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            lineHeight: 1.2,
          }}
        >
          Review<br />Dashboard
        </h2>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={onSearchChange} />

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Stats */}
      <div>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '10px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Overview
        </div>
        {statBlock('Trainers', trainers.length)}
        {statBlock('Total Courses', totalCourses)}
        {statBlock('Reviews Given', `${reviewsGiven} / ${totalCourses}`)}
      </div>

      {/* Progress Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Completion</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e94e77' }}>{progress}%</span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '99px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #e94e77, #c0386a)',
              borderRadius: '99px',
              transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
