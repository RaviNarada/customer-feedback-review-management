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
    <div className="relative">
      <button 
        className="flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 cursor-pointer text-sm whitespace-nowrap hover:border-[#5b247a]/40 transition-colors" 
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {options.find(o => o.value === selected)?.label}
        <ChevronDown size={16} />
      </button>
      {dropdownOpen && (
        <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-gray-200 rounded-xl overflow-hidden min-w-[180px] z-50 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
          {options.map(o => (
            <div
              key={o.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 ${
                selected === o.value ? 'text-[#5b247a] bg-[#5b247a]/10' : 'text-gray-700'
              }`}
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