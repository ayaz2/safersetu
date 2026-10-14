import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CustomerReview, ReviewRatingStats } from '../../types';
import { DEMO_CUSTOMER_REVIEWS, calculateReviewStats } from '../../data/demoReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewRatingSummary } from './ReviewRatingSummary';
import { ReviewFilters } from './ReviewFilters';
import { WriteReviewModal } from './WriteReviewModal';
import { ChevronLeft, ChevronRight, Grid3X3, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';

interface CustomerReviewsSectionProps {
  onWriteReviewClick?: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = () => {
  // Reviews state initialized with demo dataset
  const [allReviews, setAllReviews] = useState<CustomerReview[]>(DEMO_CUSTOMER_REVIEWS);
  const [stats, setStats] = useState<ReviewRatingStats>(() => calculateReviewStats(DEMO_CUSTOMER_REVIEWS));
  const [loading, setLoading] = useState<boolean>(false);

  // Filter states
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedTripType, setSelectedTripType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Carousel & Pagination states
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [gridVisibleCount, setGridVisibleCount] = useState<number>(9);

  // Modal state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Fetch from server on mount
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews?status=APPROVED&limit=150');
      if (res.ok) {
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setAllReviews(data.reviews);
          if (data.stats) {
            setStats(data.stats);
          }
        }
      }
    } catch {
      // Fallback already in state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filtered reviews computation
  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      // Rating filter
      if (selectedRating !== 'all') {
        if (selectedRating === '5' && review.rating !== 5) return false;
        if (selectedRating === '4.5' && review.rating !== 4.5) return false;
        if (selectedRating === '4' && review.rating !== 4) return false;
        if (selectedRating === '3.5' && review.rating !== 3.5) return false;
      }

      // Destination filter
      if (selectedDestination !== 'all') {
        if (!review.tripDestination.toLowerCase().includes(selectedDestination.toLowerCase())) {
          return false;
        }
      }

      // Trip type filter
      if (selectedTripType !== 'all') {
        if (!review.tripType || review.tripType.toLowerCase() !== selectedTripType.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = review.title.toLowerCase().includes(q);
        const matchComment = review.comment.toLowerCase().includes(q);
        const matchAuthor = review.authorName.toLowerCase().includes(q);
        const matchDest = review.tripDestination.toLowerCase().includes(q);
        const matchLoc = review.location.toLowerCase().includes(q);
        if (!matchTitle && !matchComment && !matchAuthor && !matchDest && !matchLoc) {
          return false;
        }
      }

      return true;
    });
  }, [allReviews, selectedRating, selectedDestination, selectedTripType, searchQuery]);

  // Reset carousel index when filters change
  useEffect(() => {
    setCarouselIndex(0);
    setGridVisibleCount(9);
  }, [selectedRating, selectedDestination, selectedTripType, searchQuery]);

  // Check if any filter is active
  const isFiltered =
    selectedRating !== 'all' ||
    selectedDestination !== 'all' ||
    selectedTripType !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedRating('all');
    setSelectedDestination('all');
    setSelectedTripType('all');
    setSearchQuery('');
  };

  // Carousel navigation: 3 cards per view on desktop
  const CARDS_PER_SLIDE = 3;
  const totalSlides = Math.ceil(filteredReviews.length / CARDS_PER_SLIDE);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, totalSlides - 1)));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const currentCarouselReviews = useMemo(() => {
    const start = carouselIndex * CARDS_PER_SLIDE;
    return filteredReviews.slice(start, start + CARDS_PER_SLIDE);
  }, [filteredReviews, carouselIndex]);

  // Grid load more
  const handleLoadMore = () => {
    setGridVisibleCount((prev) => prev + 9);
  };

  return (
    <section
      id="customer-reviews-section"
      aria-label="Customer Reviews and Traveler Feedback"
      className="py-14 sm:py-18 bg-slate-50/60 border-t border-b border-slate-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Summary Header */}
        <ReviewRatingSummary
          stats={stats}
          onOpenWriteReview={() => setIsWriteModalOpen(true)}
        />

        {/* Filters and Controls */}
        <ReviewFilters
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          selectedDestination={selectedDestination}
          onSelectDestination={setSelectedDestination}
          selectedTripType={selectedTripType}
          onSelectTripType={setSelectedTripType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          destinationsList={stats.destinations}
          totalFilteredCount={filteredReviews.length}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* View Mode Switcher (Carousel vs Grid) */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Display Mode:
            </span>
            <div className="inline-flex rounded-xl p-1 bg-slate-200/70 border border-slate-300/60 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Carousel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Browse All Grid ({filteredReviews.length})
              </button>
            </div>
          </div>

          {/* Carousel Arrows when in carousel mode */}
          {viewMode === 'carousel' && totalSlides > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Slide {carouselIndex + 1} of {totalSlides}
              </span>
              <button
                type="button"
                onClick={handlePrevSlide}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs active:scale-95 transition-all"
                aria-label="Previous reviews slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs active:scale-95 transition-all"
                aria-label="Next reviews slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && allReviews.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-2" />
            <p className="text-sm font-medium">Loading traveler reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto my-8">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">No Reviews Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              No traveler reviews matched your selected criteria or keyword query.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          /* ============================================================ */
          /* CAROUSEL VIEW: 3 cards on desktop, 2 on tablet, 1 on mobile */
          /* ============================================================ */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {currentCarouselReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Carousel Dot Indicators */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {Array.from({ length: Math.min(12, totalSlides) }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      carouselIndex === idx
                        ? 'w-6 bg-slate-900'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
                {totalSlides > 12 && (
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    +{totalSlides - 12} more
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* EXPANDED GRID VIEW: progressive Load More                    */
          /* ============================================================ */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredReviews.slice(0, gridVisibleCount).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Load More Button */}
            {gridVisibleCount < filteredReviews.length && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300/90 font-semibold px-6 py-2.5 rounded-xl text-sm shadow-2xs hover:shadow-xs transition-all"
                >
                  <span>
                    Load More Reviews ({filteredReviews.length - gridVisibleCount} remaining)
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prototype Transparency Notice */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 text-center">
          <p className="text-[11px] text-slate-500 font-medium max-w-xl mx-auto flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
            <span>
              All demo reviews are clearly identified in this prototype dataset. Ratings and distributions are dynamically computed without hard-coded numbers.
            </span>
          </p>
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        destinations={stats.destinations}
        onReviewSubmitted={fetchReviews}
      />
    </section>
  );
};
