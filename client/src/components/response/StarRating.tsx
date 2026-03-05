import { Star } from 'lucide-react';

const STAR_FILLED_COLOR = '#ec4899';
const STAR_EMPTY_COLOR = '#4b5563';

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={16}
          fill={i <= rating ? STAR_FILLED_COLOR : 'none'}
          color={i <= rating ? STAR_FILLED_COLOR : STAR_EMPTY_COLOR}
        />
      ))}
    </div>
  );
}