import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 32,
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <span
            key={star}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            style={{
              fontSize: size,
              cursor: readonly ? 'default' : 'pointer',
              color: filled ? '#e94e77' : 'rgba(255,255,255,0.18)',
              filter: filled ? 'drop-shadow(0 0 8px rgba(233,78,119,0.75))' : 'none',
              transition: 'all 0.15s ease',
              transform: !readonly && hovered === star ? 'scale(1.35)' : 'scale(1)',
              display: 'inline-block',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
