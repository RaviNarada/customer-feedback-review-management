import React, { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
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

  const stars = [1, 2, 3, 4, 5];
  const active = hovered || value;

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        alignItems: "center",
      }}
    >
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: `${size}px`,
            cursor: readonly ? "default" : "pointer",
            color: star <= active ? "#e94e77" : "rgba(255,255,255,0.2)",
            transition: "color 0.15s ease, transform 0.15s ease",
            transform:
              !readonly && star <= active ? "scale(1.15)" : "scale(1)",
            display: "inline-block",
            filter:
              star <= active
                ? "drop-shadow(0 0 6px rgba(233,78,119,0.6))"
                : "none",
            userSelect: "none",
          }}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          role={readonly ? "img" : "button"}
        >
          ★
        </span>
      ))}
      {!readonly && value > 0 && (
        <span
          style={{
            marginLeft: "8px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {value}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
