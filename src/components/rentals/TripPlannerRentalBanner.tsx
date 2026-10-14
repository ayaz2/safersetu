import React from 'react';
import { Car, Compass, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { RentalCategory } from '../../types';

interface TripPlannerRentalBannerProps {
  destinationName: string;
  destinationKey?: string;
  onExploreRentals: (cityKey?: string, category?: RentalCategory) => void;
}

export const TripPlannerRentalBanner: React.FC<TripPlannerRentalBannerProps> = ({
  destinationName,
  destinationKey,
  onExploreRentals
}) => {
  // Map destination names to rental city keys
  const getCityKey = () => {
    if (!destinationName) return 'all';
    const d = destinationName.toLowerCase();
    if (d.includes('goa')) return 'goa';
    if (d.includes('hyderabad') || d.includes('telangana')) return 'hyderabad';
    if (d.includes('jaipur') || d.includes('rajasthan') || d.includes('udaipur')) return 'jaipur';
    if (d.includes('kerala') || d.includes('kochi') || d.includes('munnar') || d.includes('alleppey')) return 'kochi';
    if (d.includes('leh') || d.includes('ladakh')) return 'leh';
    if (d.includes('bengaluru') || d.includes('karnataka') || d.includes('coorg')) return 'bengaluru';
    if (d.includes('delhi') || d.includes('agra') || d.includes('ncr')) return 'delhi';
    if (d.includes('manali') || d.includes('himachal')) return 'manali';
    return 'all';
  };

  const cityKey = getCityKey();

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Self-Drive & Independent Mobility Option</span>
        </div>
        <h4 className="font-serif font-bold text-base sm:text-lg text-white">
          Prefer driving yourself in {destinationName || 'your destination'}?
        </h4>
        <p className="text-xs text-slate-300 max-w-xl">
          Discover verified self-drive Thar 4x4s, Himalayan tourers, electric SUVs, and commercial tourist vans with 0% middleman commission.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onExploreRentals(cityKey)}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Car className="w-4 h-4" />
          <span>View Rentals for this Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
