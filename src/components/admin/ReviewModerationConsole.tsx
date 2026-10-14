import React, { useState, useEffect } from 'react';
import { CustomerReview, ReviewStatus } from '../../types';
import { StarRating } from '../reviews/StarRating';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Flag,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

export const ReviewModerationConsole: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [counts, setCounts] = useState<{
    total: number;
    pending: number;
    approved: number;
    flagged: number;
    rejected: number;
  }>({ total: 0, pending: 0, approved: 0, flagged: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'FLAGGED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdminReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (e) {
      console.error('Failed to load admin reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReviews();
  }, [activeTab]);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'FLAG' | 'DELETE') => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        await fetchAdminReviews();
      }
    } catch (e) {
      console.error('Action failed', e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      r.authorName.toLowerCase().includes(q) ||
      r.tripDestination.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Moderation Header & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-xl text-slate-900">
              Customer Feedback Moderation Desk
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold uppercase">
              Trust & Safety
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit submissions, verify traveler booking claims, and moderate public feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdminReviews}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'PENDING'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-amber-700 block">Pending Audit</span>
          <span className="font-mono font-bold text-lg text-amber-900">{counts.pending}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('APPROVED')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">Approved (Live)</span>
          <span className="font-mono font-bold text-lg text-emerald-900">{counts.approved}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('FLAGGED')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'FLAGGED'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/20'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-purple-700 block">Flagged Content</span>
          <span className="font-mono font-bold text-lg text-purple-900">{counts.flagged}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REJECTED')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'REJECTED'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-rose-700 block">Rejected</span>
          <span className="font-mono font-bold text-lg text-rose-900">{counts.rejected}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase block ${activeTab === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
            Total Database
          </span>
          <span className={`font-mono font-bold text-lg ${activeTab === 'ALL' ? 'text-white' : 'text-slate-900'}`}>
            {counts.total}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter audit queue by keyword, author, or destination..."
          className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* Review Moderation List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No reviews found in this moderation queue category.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isLoadingThis = actionLoadingId === r.id;
            return (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRating rating={r.rating} size="sm" />
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {r.title}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : r.status === 'FLAGGED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>

                    {r.verified ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified ({r.bookingId || 'Confirmed'})
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {r.source === 'demo' ? 'Sample Demo Review' : 'Public Submission'}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-700">{r.authorName}</span>
                    <span>•</span>
                    <span>{r.location}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">{r.tripDestination}</span>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {r.status !== 'APPROVED' && (
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleAction(r.id, 'APPROVE')}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-2xs"
                      title="Approve and publish review to public website"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  )}

                  {r.status !== 'FLAGGED' && (
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleAction(r.id, 'FLAG')}
                      className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="Flag for editorial or policy audit"
                    >
                      <Flag className="w-3 h-3" />
                      <span>Flag</span>
                    </button>
                  )}

                  {r.status !== 'REJECTED' && (
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleAction(r.id, 'REJECT')}
                      className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="Reject from public view"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isLoadingThis}
                    onClick={() => handleAction(r.id, 'DELETE')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Permanently remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
