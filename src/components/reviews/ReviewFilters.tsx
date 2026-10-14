import React from 'react';
import { Star, Filter, Search, RotateCcw, MapPin, Users } from 'lucide-react';
import { ReviewTripType } from '../../types';

interface ReviewFiltersProps {
  selectedRating: string; // 'all' | '5' | '4.5' | '4' | '3.5' | '4_plus'
  onSelectRating: (rating: string) => void;
  selectedDestination: string; // 'all' or destination name
  onSelectDestination: (dest: string) => void;
  selectedTripType: string; // 'all' or trip type
  onSelectTripType: (tripType: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  destinationsList: string[];
  totalFilteredCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  selectedRating,
  onSelectRating,
  selectedDestination,
  onSelectDestination,
  selectedTripType,
  onSelectTripType,
  searchQuery,
  onSearchChange,
  destinationsList,
  totalFilteredCount,
  onResetFilters,
  isFiltered
}) => {
  const ratingChips = [
    { label: 'All Ratings', value: 'all' },
    { label: '5.0 Stars', value: '5', icon: true },
    { label: '4.5 Stars', value: '4.5', icon: true },
    { label: '4.0 Stars', value: '4', icon: true },
    { label: '3.5 Stars', value: '3.5', icon: true }
  ];

  const tripTypes: { label: string; value: string }[] = [
    { label: 'All Trips', value: 'all' },
    { label: 'Family', value: 'Family' },
    { label: 'Couple', value: 'Couple' },
    { label: 'Solo', value: 'Solo' },
    { label: 'Friends', value: 'Friends' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-7 space-y-3.5">
      {/* Top Row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews by topic, driver, homestay, city..."
            className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-slate-900 placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns: Destination & Trip Type */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Destination Selector */}
          <div className="relative">
            <select
              value={selectedDestination}
              onChange={(e) => onSelectDestination(e.target.value)}
              className="appearance-none bg-slate-50/80 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold pl-8 pr-7 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 transition-colors cursor-pointer"
            >
              <option value="all">All Destinations</option>
              {destinationsList.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Trip Type Selector */}
          <div className="relative">
            <select
              value={selectedTripType}
              onChange={(e) => onSelectTripType(e.target.value)}
              className="appearance-none bg-slate-50/80 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold pl-8 pr-7 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 transition-colors cursor-pointer"
            >
              {tripTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <Users className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 px-2.5 py-2 rounded-xl hover:bg-orange-50 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Rating Chips */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" />
            Rating:
          </span>
          {ratingChips.map((chip) => {
            const isActive = selectedRating === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onSelectRating(chip.value)}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {chip.icon && (
                  <Star
                    className={`w-3 h-3 ${
                      isActive ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-500'
                    }`}
                  />
                )}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showing Count */}
        <span className="text-xs font-medium text-slate-600 ml-auto">
          Showing <strong className="text-slate-900">{totalFilteredCount}</strong> matching reviews
        </span>
      </div>
    </div>
  );
};
