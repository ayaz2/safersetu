import React, { useState } from 'react';
import { CustomerReview } from '../../types';
import { StarRating } from './StarRating';
import { ShieldCheck, ThumbsUp, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReviewCardProps {
  review: CustomerReview;
  onHelpfulClick?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpfulClick }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHelpful = async () => {
    if (hasVotedHelpful || isSubmitting) return;
    setIsSubmitting(true);
    setHelpfulCount(prev => prev + 1);
    setHasVotedHelpful(true);

    try {
      await fetch(`/api/reviews/${review.id}/helpful`, { method: 'POST' });
    } catch {
      // Keep optimistic update
    } finally {
      setIsSubmitting(false);
      if (onHelpfulClick) {
        onHelpfulClick(review.id);
      }
    }
  };

  return (
    <article
      id={`review-card-${review.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-subtle-card hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full relative group"
    >
      <div>
        {/* Top Header: Star Rating & Relative Time */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <StarRating rating={review.rating} size="md" />
          <span className="text-xs font-medium text-slate-600 tracking-wide">
            {review.displayRelativeTime || review.date}
          </span>
        </div>

        {/* Review Title */}
        <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 leading-snug mb-2.5 group-hover:text-orange-950 transition-colors">
          {review.title}
        </h3>

        {/* Review Text */}
        <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-sans line-clamp-5">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Footer Area: Author, Location, Trip Badges, Helpful */}
      <div className="pt-5 mt-5 border-t border-slate-100/90 space-y-3">
        {/* Author & Verification Line */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-slate-900 truncate">
                {review.authorName}
              </span>
              {review.verified ? (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                  title="Verified booking confirmed via SafarSetu PNR"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Traveler
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-full"
                  title="Sample traveler feedback in prototype dataset"
                >
                  <Sparkles className="w-2.5 h-2.5 text-slate-500" />
                  Sample Traveler
                </span>
              )}
            </div>

            {/* Traveler Location & Destination Badge */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {review.location}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">
                {review.tripDestination}
                {review.tripType ? ` (${review.tripType})` : ''}
              </span>
            </div>
          </div>

          {/* Helpful Upvote Button */}
          <button
            type="button"
            onClick={handleHelpful}
            disabled={hasVotedHelpful || isSubmitting}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
              hasVotedHelpful
                ? 'bg-orange-50 text-orange-700 border-orange-200 cursor-default'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
            }`}
            aria-label={`Mark review as helpful. Currently ${helpfulCount} people found this helpful.`}
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${
                hasVotedHelpful ? 'fill-orange-600 text-orange-600' : 'text-slate-500'
              }`}
            />
            <span>{helpfulCount}</span>
          </button>
        </div>

        {/* Response from SafarSetu if any */}
        {review.responseFromSafarSetu && (
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-2.5 text-xs text-amber-900 mt-2">
            <span className="font-semibold text-amber-950 block mb-0.5">SafarSetu Response:</span>
            {review.responseFromSafarSetu}
          </div>
        )}
      </div>
    </article>
  );
};
