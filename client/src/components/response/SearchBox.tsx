import React from 'react';
import { Search } from 'lucide-react';

export function SearchBox({ value, onChange }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-1 flex items-center gap-3 bg-[rgba(255,255,255,0.1)] border border-[#6a0dad]/40 rounded-xl px-4 py-3">
      <Search size={16} className="text-white/70 flex-shrink-0" />
      <input
        className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/60"
        placeholder="Search by trainee, course, or feedback..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
}