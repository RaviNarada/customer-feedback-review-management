import React from 'react';
import { Search } from 'lucide-react';

export function SearchBox({ value, onChange }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-1 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
      <Search size={16} className="text-gray-500 flex-shrink-0" />
      <input
        className="bg-transparent border-none outline-none text-gray-700 text-sm w-full placeholder:text-gray-400"
        placeholder="Search by trainee, course, or feedback..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
}