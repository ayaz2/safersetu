import React from 'react';
import {
  ShieldCheck,
  Star,
  Users,
  Fuel,
  Gauge,
  Zap,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
  Briefcase
} from 'lucide-react';
import { RentalVehicle, RentalMode } from '../../types';

interface RentalCardProps {
  vehicle: RentalVehicle;
  onViewDetails: (vehicle: RentalVehicle) => void;
  onBookNow: (vehicle: RentalVehicle) => void;
  selectedMode?: RentalMode;
}

export const RentalCard: React.FC<RentalCardProps> = ({
  vehicle,
  onViewDetails,
  onBookNow,
  selectedMode = 'self_drive'
}) => {
  // Determine displayed price based on selected mode
  let displayPrice = vehicle.pricePerDaySelfDrive;
  let modeLabel = 'Self-Drive';

  if (selectedMode === 'with_driver' && vehicle.allowedModes.includes('with_driver')) {
    displayPrice = vehicle.pricePerDayChauffeur || (vehicle.pricePerDaySelfDrive + 800);
    modeLabel = 'With Chauffeur';
  } else if (selectedMode === 'driver_storyteller' && vehicle.allowedModes.includes('driver_storyteller')) {
    displayPrice = vehicle.pricePerDayStoryteller || (vehicle.pricePerDaySelfDrive + 1500);
    modeLabel = 'Chauffeur + Storyteller';
  } else if (vehicle.pricePerDaySelfDrive === 0 && vehicle.pricePerDayChauffeur > 0) {
    displayPrice = vehicle.pricePerDayChauffeur;
    modeLabel = 'Chauffeur Driven';
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'suv':
        return 'SUV & 4x4';
      case 'car':
        return 'Sedan / Hatchback';
      case 'bike_scooter':
        return 'Motorcycle / Scooter';
      case 'ev_luxury':
        return 'Electric / Luxury';
      case 'tempo_group':
        return 'Group Van (12S+)';
      default:
        return 'Vehicle';
    }
  };

  return (
    <div
      id={`rental-card-${vehicle.id}`}
      className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-subtle-card hover:shadow-md transition-all duration-300 flex flex-col justify-between group text-left"
    >
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-md">
            {getCategoryBadge(vehicle.category)}
          </span>

          {vehicle.verified && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Partner</span>
            </span>
          )}
        </div>

        {/* Bottom Image Info: City & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div>
            <span className="text-[11px] font-medium text-slate-200 flex items-center gap-1">
              <Compass className="w-3 h-3 text-orange-400" />
              <span>{vehicle.city}</span>
            </span>
            <h3 className="font-serif font-bold text-lg text-white leading-tight drop-shadow-xs">
              {vehicle.name}
            </h3>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{vehicle.providerRating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-300 font-normal">({vehicle.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold">{vehicle.seats} Seats</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold capitalize">{vehicle.transmission}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            {vehicle.fuelType === 'ev' ? (
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="font-semibold capitalize">{vehicle.fuelType}</span>
          </div>

          {vehicle.bootSpaceBags > 0 && (
            <div className="flex items-center gap-1.5 text-slate-600 col-span-2 text-[11px]">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Boot: ~{vehicle.bootSpaceBags} Luggage Bags</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-500 text-[11px] justify-end">
            <span className="font-medium text-slate-700">{vehicle.kmPolicy.split(' ')[0]}</span>
            <span>km</span>
          </div>
        </div>

        {/* Feature Tags / Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-50 text-orange-800 border border-orange-200/60">
            {modeLabel}
          </span>
          {vehicle.features.slice(0, 2).map((feat, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700"
            >
              {feat}
            </span>
          ))}
          {vehicle.allowedModes.includes('driver_storyteller') && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              Storyteller Escort Ready
            </span>
          )}
        </div>

        {/* Provider Snippet */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between">
          <span className="truncate max-w-[200px]">By {vehicle.providerName}</span>
          {vehicle.securityDeposit > 0 ? (
            <span className="text-slate-600 font-medium">₹{vehicle.securityDeposit.toLocaleString('en-IN')} dep.</span>
          ) : (
            <span className="text-emerald-700 font-bold">Zero Deposit</span>
          )}
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-950">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500">/day</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block -mt-0.5">
              0% SafarSetu Commission
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`btn-details-${vehicle.id}`}
              onClick={() => onViewDetails(vehicle)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              title="View full specifications & policies"
            >
              Details
            </button>
            <button
              id={`btn-book-${vehicle.id}`}
              onClick={() => onBookNow(vehicle)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1 shadow-xs hover:shadow"
            >
              <span>Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
