import React from 'react';
import { Search } from 'lucide-react';

export function SearchBox({ value, onChange }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="search-box">
      <Search size={16} className="search-icon" />
      <input
        className="search-input"
        placeholder="Search by trainee, course, or feedback..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
}