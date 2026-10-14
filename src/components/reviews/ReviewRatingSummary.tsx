import React, { useState } from 'react';
import { ReviewRatingStats } from '../../types';
import { StarRating } from './StarRating';
import { PenLine, ChevronDown, ChevronUp, BarChart2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ReviewRatingSummaryProps {
  stats: ReviewRatingStats;
  onOpenWriteReview: () => void;
}

export const ReviewRatingSummary: React.FC<ReviewRatingSummaryProps> = ({
  stats,
  onOpenWriteReview
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
      {/* Trust pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-800 text-xs font-semibold mb-3.5">
        <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
        <span>Traveler Feedback & Community Trust</span>
      </div>

      {/* Primary Section Heading */}
      <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight mb-2.5">
        Travelers love their SafarSetu journey
      </h2>

      {/* Supporting Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 font-sans max-w-2xl mx-auto mb-5">
        Real experiences from travelers exploring India with SafarSetu.
      </p>

      {/* Visual Rating Display */}
      <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 px-5 sm:px-8 py-3.5 shadow-xs">
        <div className="flex items-center gap-2">
          <StarRating rating={stats.averageRating} size="lg" />
          <span className="font-serif font-bold text-xl sm:text-2xl text-slate-900 ml-1">
            {stats.averageRating.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            / 5.0
          </span>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-300" />

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">
            Based on <strong className="font-bold text-slate-950">{stats.totalReviews}</strong> traveler reviews
          </span>

          {/* Toggle breakdown button */}
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors ml-1"
            aria-expanded={showBreakdown}
            aria-controls="rating-breakdown-panel"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{showBreakdown ? 'Hide Stats' : 'View Breakdown'}</span>
            {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-300" />

        {/* Action Button: Write a Review */}
        <button
          type="button"
          onClick={onOpenWriteReview}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
        >
          <PenLine className="w-3.5 h-3.5 text-orange-400" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Expandable Rating Breakdown Panel */}
      {showBreakdown && (
        <div
          id="rating-breakdown-panel"
          className="mt-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto text-left transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900">Rating Distribution</span>
            <span className="text-xs text-slate-600 font-medium">Calculated dynamically</span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm font-medium">
            {/* 5 Stars */}
            <div className="flex items-center gap-2.5">
              <span className="w-14 text-slate-700 font-semibold">5 Stars</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.fiveStarsPct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-600 font-semibold">
                {stats.fiveStarsPct}%
              </span>
              <span className="w-8 text-right text-slate-500 text-xs">
                ({stats.fiveStarsCount})
              </span>
            </div>

            {/* 4.5 & 4 Stars */}
            <div className="flex items-center gap-2.5">
              <span className="w-14 text-slate-700 font-semibold">4 Stars</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/90 rounded-full transition-all duration-500"
                  style={{ width: `${stats.fourStarsPct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-600 font-semibold">
                {stats.fourStarsPct}%
              </span>
              <span className="w-8 text-right text-slate-500 text-xs">
                ({stats.fourStarsCount})
              </span>
            </div>

            {/* 3.5 & 3 Stars */}
            <div className="flex items-center gap-2.5">
              <span className="w-14 text-slate-700 font-semibold">3 Stars</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/70 rounded-full transition-all duration-500"
                  style={{ width: `${stats.threeStarsPct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-600 font-semibold">
                {stats.threeStarsPct}%
              </span>
              <span className="w-8 text-right text-slate-500 text-xs">
                ({stats.threeStarsCount})
              </span>
            </div>

            {/* 2 Stars */}
            <div className="flex items-center gap-2.5">
              <span className="w-14 text-slate-700 font-semibold">2 Stars</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/50 rounded-full"
                  style={{ width: `${stats.twoStarsPct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-600 font-semibold">
                {stats.twoStarsPct}%
              </span>
              <span className="w-8 text-right text-slate-500 text-xs">
                ({stats.twoStarsCount})
              </span>
            </div>

            {/* 1 Star */}
            <div className="flex items-center gap-2.5">
              <span className="w-14 text-slate-700 font-semibold">1 Star</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/40 rounded-full"
                  style={{ width: `${stats.oneStarPct}%` }}
                />
              </div>
              <span className="w-12 text-right text-slate-600 font-semibold">
                {stats.oneStarPct}%
              </span>
              <span className="w-8 text-right text-slate-500 text-xs">
                ({stats.oneStarCount})
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
