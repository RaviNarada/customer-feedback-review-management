import {
  MessageSquare, CheckCircle, AlertCircle, BarChart2
} from 'lucide-react';
import { StatCard } from './StatCard';
import type { Stats } from './lib/api';

export function StatsGrid({ stats }: { stats: Stats | null }) {
  return (
    <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
      <StatCard icon={<MessageSquare size={24} />} value={stats?.total ?? '—'} label="Total" color="#818cf8" />
      <StatCard icon={<CheckCircle size={24} />} value={stats?.replied ?? '—'} label="Replied" color="#34d399" />
      <StatCard icon={<AlertCircle size={24} />} value={stats?.pending ?? '—'} label="Pending" color="#f87171" />
      <StatCard icon={<BarChart2 size={24} />} value={stats?.avgRating ?? '—'} label="Avg Rating" color="#fbbf24" />
    </div>
  );
}