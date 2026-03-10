import { Star } from 'lucide-react';

export function StarRating({ rating, filledColor = '#ec4899', emptyColor = '#4b5563' }: { rating: number; filledColor?: string; emptyColor?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={16}
          fill={i <= rating ? filledColor : 'none'}
          color={i <= rating ? filledColor : emptyColor}
        />
      ))}
    </div>
  );
}