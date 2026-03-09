import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search trainers...',
}) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          pointerEvents: 'none',
          opacity: 0.5,
        }}
      >
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px 10px 40px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '14px',
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s ease, background 0.2s ease',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(233,78,119,0.6)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        }}
      />
    </div>
  );
};

export default SearchBar;
