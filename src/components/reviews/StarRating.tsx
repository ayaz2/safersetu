import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5, can be fractional like 4.5 or 3.5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showValue?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  className = '',
  showValue = false
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Full star
      stars.push(
        <Star
          key={i}
          className={`${iconSize} fill-amber-400 text-amber-400`}
          aria-hidden="true"
        />
      );
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(
        <div key={i} className="relative inline-block">
          <Star className={`${iconSize} text-slate-200 fill-slate-100`} aria-hidden="true" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${iconSize} fill-amber-400 text-amber-400`} aria-hidden="true" />
          </div>
        </div>
      );
    } else {
      // Empty star
      stars.push(
        <Star
          key={i}
          className={`${iconSize} text-slate-200 fill-slate-100`}
          aria-hidden="true"
        />
      );
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className="ml-1 text-xs font-bold text-slate-800">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
