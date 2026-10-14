import React, { useState } from 'react';
import { X, Star, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { ReviewTripType } from '../../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: string[];
  onReviewSubmitted?: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  destinations,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [tripDestination, setTripDestination] = useState(destinations[0] || 'Rajasthan');
  const [tripType, setTripType] = useState<ReviewTripType>('Family');
  const [bookingId, setBookingId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedReviewInfo, setSubmittedReviewInfo] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !comment.trim() || !authorName.trim()) {
      setErrorMessage('Please complete all required fields (Name, Title, and Review text).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
          authorName: authorName.trim(),
          location: location.trim() || 'India',
          tripDestination,
          tripType,
          bookingId: bookingId.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setIsSuccess(true);
      setSubmittedReviewInfo(data.review);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setTitle('');
    setComment('');
    setAuthorName('');
    setLocation('');
    setBookingId('');
    setRating(5);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Message & Moderation Notice */
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-serif font-bold text-2xl text-slate-900">
              Thank You For Your Feedback!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your review has been submitted to SafarSetu&apos;s traveler community pipeline.
            </p>

            {submittedReviewInfo?.verified ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-emerald-950">
                    Booking PNR Verified: {submittedReviewInfo.bookingId}
                  </strong>
                  Your review has been verified against confirmed traveler logs and will display the green &ldquo;Verified Traveler&rdquo; badge upon approval!
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs text-slate-600">
                <strong className="font-semibold block text-slate-800 mb-1">
                  Community Integrity Note:
                </strong>
                To ensure high quality, all reviews pass our standard moderation review before public display.
              </div>
            )}

            <div className="pt-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Review Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-[11px] font-bold mb-2">
                <Sparkles className="w-3 h-3 text-orange-600" />
                Share Your Experience
              </div>
              <h3 id="write-review-title" className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                Write a Review
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Help fellow explorers discover authentic journeys across India.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Overall Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const effectiveRating = hoverRating !== null ? hoverRating : rating;
                  const isFilled = effectiveRating >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 -m-1 focus:outline-hidden transition-transform hover:scale-110"
                      aria-label={`${starVal} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm font-bold text-slate-800">
                  {hoverRating !== null ? hoverRating : rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Unforgettable Munnar tea homestay & storyteller guide"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Feedback *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What was memorable about the itinerary, driver coordination, homestay, or rental car? Any helpful tips for other travelers?"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Destination & Trip Type in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination Visited *
                </label>
                <select
                  value={tripDestination}
                  onChange={(e) => setTripDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                >
                  {destinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Multi-City India">Multi-City India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trip Style
                </label>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as ReviewTripType)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                >
                  <option value="Family">Family</option>
                  <option value="Couple">Couple</option>
                  <option value="Solo">Solo</option>
                  <option value="Friends">Friends</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
            </div>

            {/* Author Name & Location in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Home City / Country
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30"
                />
              </div>
            </div>

            {/* Booking Reference ID for Verification Badge */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-800 mb-0.5 flex items-center justify-between">
                <span>Booking ID / PNR (Optional)</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Enables &ldquo;Verified Traveler&rdquo; Badge
                </span>
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="e.g., 4582-KER-9012 or SS-CONFIRM-94812"
                className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 uppercase"
              />
              <p className="text-[11px] text-slate-600 mt-1">
                Enter your SafarSetu trip or rental PNR to link your review to a confirmed trip.
              </p>
            </div>

            {/* Submission Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
