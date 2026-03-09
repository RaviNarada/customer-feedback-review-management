import type React from 'react';

export function StatCard({ icon, value, label, color }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl px-6 py-7 text-center backdrop-blur-[10px]">
      <div className="mb-3 flex justify-center" style={{ color }}>{icon}</div>
      <div className="font-['Syne'] text-4xl font-extrabold text-white leading-none my-2">{value}</div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}