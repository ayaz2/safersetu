import React from 'react';
import { X, Calendar, MapPin, CheckCircle, Ban, ArrowRight, FileText } from 'lucide-react';
import { BookingRecord, SavedDraft } from '../../types';

interface MyTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  savedDrafts: SavedDraft[];
  onCancelBooking: (id: string) => void;
  onLoadDraft: (draft: SavedDraft) => void;
  onSelectBookingForPass: (booking: BookingRecord) => void;
}

export const MyTripsModal: React.FC<MyTripsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  savedDrafts,
  onCancelBooking,
  onLoadDraft,
  onSelectBookingForPass
}) => {
  const [activeTab, setActiveTab] = React.useState<'confirmed' | 'drafts'>('confirmed');

  if (!isOpen) return null;

  return (
    <div id="my-trips-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="my-trips-modal" className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#faf8f5]">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-950">My Journeys & Vouchers</h3>
            <p className="text-xs text-slate-500">Access confirmed travel passes, DigiLocker credentials & saved drafts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-bold bg-white">
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'confirmed' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confirmed Passes ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'drafts' ? 'border-slate-950 text-slate-950' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>Saved Drafts ({savedDrafts.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'confirmed' && (
            <>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <p className="text-sm">No confirmed travel passes yet.</p>
                  <p className="text-xs">Configure your journey in the 6-step planner and confirm your first pass!</p>
                </div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {b.status}
                          </span>
                          <span className="font-mono text-slate-400 text-[11px]">{b.id}</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-slate-950 mt-1">
                          {b.origin} → {b.destinationName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-slate-950 block">{b.totalCost}</span>
                        <span className="text-[10px] text-slate-500">{b.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.dates} ({b.nights}N)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>PNR: {b.pnr}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onSelectBookingForPass(b);
                          onClose();
                        }}
                        className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-orange-700 transition flex items-center gap-1"
                      >
                        <span>View Pass & Voucher</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'drafts' && (
            <>
              {savedDrafts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <p className="text-sm">No saved journey drafts yet.</p>
                  <p className="text-xs">Click "Save Draft" in the top bar of the planner to save your route.</p>
                </div>
              ) : (
                savedDrafts.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl bg-[#faf8f5] border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-950 block">{d.origin} → {d.destinationName}</span>
                      <span className="text-[11px] text-slate-500 block">{d.dates} • Saved {d.updatedAt}</span>
                    </div>
                    <button
                      onClick={() => {
                        onLoadDraft(d);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition"
                    >
                      Load in Planner
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
