import { Express, Request, Response } from 'express';
import { CustomerReview, ReviewRatingStats, ReviewStatus } from '../types';
import { DEMO_CUSTOMER_REVIEWS, calculateReviewStats } from '../data/demoReviews';

// In-memory store initialized with the 96 sample demo reviews
let reviewsStore: CustomerReview[] = [...DEMO_CUSTOMER_REVIEWS];

/**
 * Registers REST API endpoints for customer feedback, rating analytics, submission, and admin moderation.
 */
export function registerReviewRoutes(app: Express, bookingsStoreRef?: any[]) {

  // 1. GET /api/reviews - Filtered, paginated review listing with dynamic stats
  app.get('/api/reviews', (req: Request, res: Response) => {
    try {
      const {
        rating,
        destination,
        tripType,
        search,
        status = 'APPROVED',
        limit = '50',
        offset = '0'
      } = req.query;

      // Filter by status (public view defaults to APPROVED; admin can request ALL or PENDING)
      let filtered = reviewsStore.filter((r) => {
        if (status !== 'ALL' && r.status !== status) {
          return false;
        }
        return true;
      });

      // Destination filter
      if (destination && destination !== 'all') {
        const destStr = String(destination).toLowerCase();
        filtered = filtered.filter(r =>
          r.tripDestination.toLowerCase().includes(destStr)
        );
      }

      // Rating filter
      if (rating && rating !== 'all') {
        const rVal = String(rating);
        if (rVal === '5') {
          filtered = filtered.filter(r => r.rating === 5);
        } else if (rVal === '4.5') {
          filtered = filtered.filter(r => r.rating === 4.5);
        } else if (rVal === '4') {
          filtered = filtered.filter(r => r.rating === 4);
        } else if (rVal === '3.5') {
          filtered = filtered.filter(r => r.rating === 3.5);
        } else if (rVal === '4_plus') {
          filtered = filtered.filter(r => r.rating >= 4);
        } else if (rVal === '3_plus') {
          filtered = filtered.filter(r => r.rating >= 3.5);
        }
      }

      // Trip type filter
      if (tripType && tripType !== 'all') {
        const tVal = String(tripType).toLowerCase();
        filtered = filtered.filter(r =>
          r.tripType && r.tripType.toLowerCase() === tVal
        );
      }

      // Search query (search in title, comment, authorName, location)
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(r =>
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.authorName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.tripDestination.toLowerCase().includes(q)
        );
      }

      const totalCount = filtered.length;
      const numLimit = parseInt(String(limit), 10) || 50;
      const numOffset = parseInt(String(offset), 10) || 0;
      const paginated = filtered.slice(numOffset, numOffset + numLimit);

      // Dynamic calculation from ALL approved reviews in the dataset
      const approvedReviews = reviewsStore.filter(r => r.status === 'APPROVED');
      const stats = calculateReviewStats(approvedReviews);

      res.json({
        reviews: paginated,
        totalCount,
        offset: numOffset,
        limit: numLimit,
        stats
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve reviews', details: err?.message });
    }
  });

  // 2. GET /api/reviews/stats - Pure dynamic stats computation
  app.get('/api/reviews/stats', (req: Request, res: Response) => {
    try {
      const approvedReviews = reviewsStore.filter(r => r.status === 'APPROVED');
      const stats = calculateReviewStats(approvedReviews);
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to calculate stats', details: err?.message });
    }
  });

  // 3. POST /api/reviews/submit - Traveler submits a new review (enters PENDING moderation)
  app.post('/api/reviews/submit', (req: Request, res: Response) => {
    try {
      const {
        rating,
        title,
        comment,
        authorName,
        location,
        tripDestination,
        tripType = 'Family',
        bookingId
      } = req.body;

      if (!rating || !title || !comment || !authorName || !tripDestination) {
        return res.status(400).json({
          error: 'Missing required fields: rating, title, comment, authorName, and tripDestination are mandatory.'
        });
      }

      // Genuine verification check:
      // If bookingId matches an existing booking in bookingsStore, verify the review!
      let isVerified = false;
      let badgeText = undefined;
      let source: 'demo' | 'user_submission' | 'booking_verified' = 'user_submission';

      if (bookingId && bookingsStoreRef) {
        const found = bookingsStoreRef.find(b =>
          b.pnr?.toLowerCase() === String(bookingId).toLowerCase() ||
          b.id?.toLowerCase() === String(bookingId).toLowerCase()
        );
        if (found) {
          isVerified = true;
          source = 'booking_verified';
          badgeText = 'Verified SafarSetu Traveler';
        }
      }

      const newReview: CustomerReview = {
        id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bookingId: bookingId || undefined,
        rating: Number(rating),
        title: String(title).trim(),
        comment: String(comment).trim(),
        authorName: String(authorName).trim(),
        location: String(location || 'India').trim(),
        tripDestination: String(tripDestination).trim(),
        tripType,
        date: new Date().toISOString().split('T')[0],
        displayRelativeTime: 'Just now',
        verified: isVerified,
        verificationBadgeText: badgeText,
        source,
        // As requested in Sections 14 & 15: new submissions enter PENDING status for moderation
        status: 'PENDING',
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      };

      // Store in memory
      reviewsStore.unshift(newReview);

      return res.status(201).json({
        success: true,
        message: 'Thank you for your feedback! Your review has been submitted for moderation and will appear once verified.',
        review: newReview
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to submit review', details: err?.message });
    }
  });

  // 4. POST /api/reviews/:id/helpful - Upvote review helpfulness
  app.post('/api/reviews/:id/helpful', (req: Request, res: Response) => {
    const { id } = req.params;
    const review = reviewsStore.find(r => r.id === id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    review.helpfulCount = (review.helpfulCount || 0) + 1;
    res.json({ success: true, helpfulCount: review.helpfulCount });
  });

  // 5. POST /api/reviews/:id/action - Admin review moderation (Approve, Reject, Flag, Delete)
  app.post('/api/reviews/:id/action', (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' | 'REJECT' | 'FLAG' | 'DELETE'

    const idx = reviewsStore.findIndex(r => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (action === 'DELETE') {
      reviewsStore.splice(idx, 1);
      return res.json({ success: true, message: 'Review deleted successfully' });
    }

    if (action === 'APPROVE') {
      reviewsStore[idx].status = 'APPROVED';
    } else if (action === 'REJECT') {
      reviewsStore[idx].status = 'REJECTED';
    } else if (action === 'FLAG') {
      reviewsStore[idx].status = 'FLAGGED';
    } else {
      return res.status(400).json({ error: 'Invalid action. Must be APPROVE, REJECT, FLAG, or DELETE' });
    }

    res.json({
      success: true,
      review: reviewsStore[idx]
    });
  });

  // 6. GET /api/admin/reviews - Admin list of all reviews including PENDING, FLAGGED, REJECTED
  app.get('/api/admin/reviews', (req: Request, res: Response) => {
    const { status = 'ALL' } = req.query;
    let list = [...reviewsStore];
    if (status !== 'ALL') {
      list = list.filter(r => r.status === status);
    }
    const pendingCount = reviewsStore.filter(r => r.status === 'PENDING').length;
    const approvedCount = reviewsStore.filter(r => r.status === 'APPROVED').length;
    const flaggedCount = reviewsStore.filter(r => r.status === 'FLAGGED').length;
    const rejectedCount = reviewsStore.filter(r => r.status === 'REJECTED').length;

    res.json({
      reviews: list,
      counts: {
        total: reviewsStore.length,
        pending: pendingCount,
        approved: approvedCount,
        flagged: flaggedCount,
        rejected: rejectedCount
      }
    });
  });
}
