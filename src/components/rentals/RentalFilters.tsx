import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Car,
  Bike,
  Zap,
  Users,
  Check,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { RentalCategory, RentalMode, RentalCity } from '../../types';

interface RentalFiltersProps {
  cities: RentalCity[];
  selectedCity: string;
  onSelectCity: (cityKey: string) => void;
  selectedCategory: RentalCategory;
  onSelectCategory: (cat: RentalCategory) => void;
  selectedMode: RentalMode | 'all';
  onSelectMode: (mode: RentalMode | 'all') => void;
  pickupDate: string;
  onChangePickupDate: (date: string) => void;
  returnDate: string;
  onChangeReturnDate: (date: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  transmission: string;
  onChangeTransmission: (val: string) => void;
  fuelType: string;
  onChangeFuelType: (val: string) => void;
  seats: string;
  onChangeSeats: (val: string) => void;
  maxPrice: number;
  onChangeMaxPrice: (val: number) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const RentalFilters: React.FC<RentalFiltersProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  selectedCategory,
  onSelectCategory,
  selectedMode,
  onSelectMode,
  pickupDate,
  onChangePickupDate,
  returnDate,
  onChangeReturnDate,
  searchQuery,
  onChangeSearchQuery,
  transmission,
  onChangeTransmission,
  fuelType,
  onChangeFuelType,
  seats,
  onChangeSeats,
  maxPrice,
  onChangeMaxPrice,
  verifiedOnly,
  onToggleVerifiedOnly,
  onResetFilters,
  totalResultsCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories: { key: RentalCategory; label: string; icon: any }[] = [
    { key: 'all', label: 'All Fleet', icon: Sparkles },
    { key: 'suv', label: 'SUVs & 4x4', icon: Car },
    { key: 'car', label: 'Sedan & Hatch', icon: Car },
    { key: 'bike_scooter', label: 'Bikes & Scooters', icon: Bike },
    { key: 'ev_luxury', label: 'Electric & Luxury', icon: Zap },
    { key: 'tempo_group', label: 'Group Vans (12S+)', icon: Users }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle-card p-4 sm:p-6 space-y-5 text-left">
      {/* Primary Search Bar Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* City Selector */}
        <div className="md:col-span-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pickup Destination
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-orange-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-rental-city"
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none"
            >
              <option value="all">All India Destinations</option>
              {cities.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Inputs */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pickup Date
            </label>
            <div className="relative">
              <input
                id="filter-pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => onChangePickupDate(e.target.value)}
                className="w-full pl-3 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Return Date
            </label>
            <div className="relative">
              <input
                id="filter-return-date"
                type="date"
                value={returnDate}
                onChange={(e) => onChangeReturnDate(e.target.value)}
                className="w-full pl-3 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Search Input for Model / Brand */}
        <div className="md:col-span-3">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Search Model or Brand
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-search-query"
              type="text"
              placeholder="e.g. Thar, Innova, Himalayan, EV..."
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Filter Trigger / Advanced toggle */}
        <div className="md:col-span-2 flex items-end gap-2 pt-4 md:pt-0">
          <button
            id="toggle-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              showAdvanced
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {showAdvanced ? <X className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Category Tabs & Mode Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`cat-btn-${cat.key}`}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-950'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Rental Mode Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Mode:
          </span>
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1">
            <button
              onClick={() => onSelectMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedMode === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectMode('self_drive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedMode === 'self_drive' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Self-Drive
            </button>
            <button
              onClick={() => onSelectMode('with_driver')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedMode === 'with_driver' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              With Chauffeur
            </button>
            <button
              onClick={() => onSelectMode('driver_storyteller')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedMode === 'driver_storyteller'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-orange-800 hover:text-orange-950'
              }`}
              title="Escorted by verified local storytelling guide"
            >
              + Storyteller
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-fade-in">
          {/* Transmission */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => onChangeTransmission(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="all">Any Transmission</option>
              <option value="automatic">Automatic Only</option>
              <option value="manual">Manual Only</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Fuel Type
            </label>
            <select
              value={fuelType}
              onChange={(e) => onChangeFuelType(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="all">Any Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="ev">100% Electric (EV)</option>
            </select>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Seating Capacity
            </label>
            <select
              value={seats}
              onChange={(e) => onChangeSeats(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="all">Any Seating</option>
              <option value="2">2 Seater (Bikes & Scooters)</option>
              <option value="5">4-5 Seater (Sedans & Compacts)</option>
              <option value="7">6-7+ Seater (Innova / Fortuner / SUVs)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase mb-1">
              <span>Max Budget:</span>
              <span className="text-slate-900 font-extrabold">₹{maxPrice.toLocaleString('en-IN')}/day</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer mt-1"
            />
          </div>

          {/* Checkboxes: Verified Only & Reset */}
          <div className="sm:col-span-2 md:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={onToggleVerifiedOnly}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
              />
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Show SafarSetu Verified Fleets Only</span>
              </span>
            </label>

            <button
              onClick={onResetFilters}
              className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-950">{totalResultsCount}</strong> travel-ready vehicles
          {selectedCity !== 'all' ? ` in ${cities.find(c => c.key === selectedCity)?.name || selectedCity}` : ' across India'}
        </span>
        <span className="text-emerald-700 font-semibold text-[11px]">
          ✓ Free cancellation up to 24h before pickup
        </span>
      </div>
    </div>
  );
};
