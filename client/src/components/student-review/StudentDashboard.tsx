import React, { useEffect, useState } from 'react';
import type { Trainer } from './types/types';
import { fetchTrainersWithStatus } from './services/trainer.api';
import Sidebar from './Sidebar';
import TrainerCard from './TrainerCard';

const StudentDashboard: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTrainersWithStatus();
      setTrainers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = trainers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.expertise.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a0540, #3d1060, #1a0540)',
          fontFamily: "'DM Sans', sans-serif",
          color: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 24px',
            display: 'flex',
            gap: '28px',
            alignItems: 'flex-start',
          }}
        >
          {/* Sidebar */}
          <Sidebar trainers={trainers} search={search} onSearchChange={setSearch} />

          {/* Main Content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* Page Header */}
            <div style={{ marginBottom: '28px', animation: 'fadeUp 0.4s ease both' }}>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Your Trainers
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: '32px',
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Course Feedback
              </h1>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '40px 0' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTop: '3px solid #e94e77',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
                  Loading trainers...
                </span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
                <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.7)' }}>{error}</p>
                <button
                  onClick={load}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e94e77, #c0386a)',
                    color: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  {search ? '🔍' : '📭'}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>
                  {search ? `No trainers match "${search}"` : 'No trainers assigned yet.'}
                </p>
              </div>
            )}

            {/* Cards Grid */}
            {!loading && !error && filtered.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '20px',
                }}
              >
                {filtered.map((trainer, i) => (
                  <TrainerCard key={trainer.id} trainer={trainer} index={i} />
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
