import { ChevronDown } from 'lucide-react';
import React from 'react';

export function FilterDropdown({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="dropdown">
      <button className="dropdown-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {options.find(o => o.value === selected)?.label}
        <ChevronDown size={16} />
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          {options.map(o => (
            <div
              key={o.value}
              className={`dropdown-item ${selected === o.value ? 'active' : ''}`}
              onClick={() => {
                onChange(o.value);
                setDropdownOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}