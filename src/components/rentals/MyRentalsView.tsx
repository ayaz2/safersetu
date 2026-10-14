import React, { useState } from 'react';
import {
  Car,
  Calendar,
  MapPin,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Phone,
  Sparkles
} from 'lucide-react';
import { RentalBooking } from '../../types';

interface MyRentalsViewProps {
  bookings: RentalBooking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreRentals: () => void;
}

export const MyRentalsView: React.FC<MyRentalsViewProps> = ({
  bookings,
  onCancelBooking,
  onExploreRentals
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = bookings.filter(b =>
    b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.travelerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = async (id: string, pnr: string) => {
    if (window.confirm(`Are you sure you want to cancel reservation ${pnr}? Full refund will be initiated to your payment source.`)) {
      setCancellingId(id);
      try {
        await onCancelBooking(id);
      } finally {
        setCancellingId(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Cancelled & Refunded</span>
          </span>
        );
      case 'READY_FOR_PICKUP':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Ready for Pickup</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-2xl text-slate-950">
            My Rental Reservations
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage your verified self-drive vehicles and chauffeur-driven rides across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by PNR or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-subtle-card space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-950">
              No Active Rental Bookings Found
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              Ready for your next journey? Discover verified Thar 4x4s, Himalayan tourers, Innova Crystas and electric fleets with 0% middleman commission.
            </p>
          </div>
          <button
            onClick={onExploreRentals}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Explore Vehicles Across India</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-subtle-card space-y-4 hover:shadow-md transition"
            >
              {/* Header with PNR and status */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.vehicleImage}
                    alt={booking.vehicleName}
                    className="w-14 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                      PNR: {booking.pnr}
                    </span>
                    <h3 className="font-bold text-base text-slate-950 leading-tight">
                      {booking.vehicleName}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {booking.city} Corridor • {booking.rentalMode.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>{getStatusBadge(booking.bookingStatus)}</div>
              </div>

              {/* Trip details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Pickup</span>
                  <div className="font-semibold text-slate-900">{booking.pickupDate}</div>
                  <div className="text-[11px] text-slate-500">{booking.pickupTime}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Return</span>
                  <div className="font-semibold text-slate-900">{booking.returnDate}</div>
                  <div className="text-[11px] text-slate-500">{booking.returnTime}</div>
                </div>

                <div className="col-span-2 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate"><strong>Hub:</strong> {booking.pickupLocation}</span>
                </div>

                {booking.chauffeurName && (
                  <div className="col-span-2 text-[11px] text-orange-900 bg-orange-50/70 p-2 rounded-lg font-medium">
                    <strong>Chauffeur:</strong> {booking.chauffeurName}
                  </div>
                )}
              </div>

              {/* Financial Breakdown & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Total Paid ({booking.paymentMethod})</div>
                  <div className="font-extrabold text-base text-slate-950">
                    ₹{booking.pricingBreakdown.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {booking.bookingStatus !== 'CANCELLED' && (
                    <button
                      disabled={cancellingId === booking.id}
                      onClick={() => handleCancel(booking.id, booking.pnr)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition"
                    >
                      {cancellingId === booking.id ? 'Processing...' : 'Cancel Booking'}
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    ID: {booking.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
