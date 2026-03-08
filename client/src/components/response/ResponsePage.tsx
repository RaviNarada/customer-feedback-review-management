import { useEffect, useState } from 'react';
import './response.css';
import { Header } from './Header';
import { StatsGrid } from './StatsGrid';
import { FilterDropdown } from './FilterDropdown';
import { SearchBox } from './SearchBox';
import { FeedbackCard } from './FeedbackCard';
import { Modal } from './Modal';
import { fetchStats, fetchFeedbacks, submitResponse } from './lib/api';
import type { Feedback, Stats } from './lib/api';

export default function ResponsePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<'all' | 'replied' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const [s, f] = await Promise.all([fetchStats(), fetchFeedbacks(filter, search)]);
    setStats(s);
    setFeedbacks(f);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  const handleSubmit = async (id: number, message: string) => {
    await submitResponse(id, message);
    // refresh
    await load();
  };

  return (
    <div className="response-page">
      <Header />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Trainee Feedback</h1>
          <p className="hero-subtitle">Review and respond to student feedback for trainers</p>
          <StatsGrid stats={stats} />
        </div>
      </div>

      <div className="response-container">
        <div className="controls">
          <SearchBox value={search} onChange={e => setSearch(e.target.value)} />
          <FilterDropdown
            options={[
              { value: 'all', label: 'All Feedbacks' },
              { value: 'replied', label: 'Replied' },
              { value: 'pending', label: 'Pending' }
            ]}
            selected={filter}
            onChange={(v) => setFilter(v as any)}
          />
        </div>

        <div className="feedback-list">
          {loading && <div className="loading">Loading feedback…</div>}
          {!loading && feedbacks.length === 0 && <div className="empty">No feedback found.</div>}
          {!loading && feedbacks.map(f => (
            <FeedbackCard key={f.id} feedback={f} onClick={() => setSelected(f)} />
          ))}
        </div>
      </div>

      {selected && (
        <Modal
          feedback={selected}
          onClose={() => setSelected(null)}
          onSubmit={async (id, message) => {
            await handleSubmit(id, message);
          }}
        />
      )}
    </div>
  );
}