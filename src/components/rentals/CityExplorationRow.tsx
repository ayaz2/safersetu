import React from 'react';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { RentalCity } from '../../types';

interface CityExplorationRowProps {
  cities: RentalCity[];
  selectedCity: string;
  onSelectCity: (cityKey: string) => void;
}

export const CityExplorationRow: React.FC<CityExplorationRowProps> = ({
  cities,
  selectedCity,
  onSelectCity
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-600" />
            <span>Curated Road Trip Hubs</span>
          </span>
          <h2 className="font-serif font-bold text-2xl text-slate-950">
            Popular Destination Fleets
          </h2>
          <p className="text-xs text-slate-600 max-w-xl mt-0.5">
            Discover travel-ready cars, SUVs, and touring bikes stationed at major airport terminals and heritage corridors.
          </p>
        </div>

        <button
          onClick={() => onSelectCity('all')}
          className={`text-xs font-bold transition flex items-center gap-1 ${
            selectedCity === 'all' ? 'text-slate-950 underline' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <span>View All India</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Scrollable City Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cities.map((city) => {
          const isSelected = selectedCity === city.key;
          return (
            <button
              key={city.key}
              id={`city-card-${city.key}`}
              onClick={() => onSelectCity(isSelected ? 'all' : city.key)}
              className={`group relative rounded-2xl overflow-hidden aspect-[4/3] text-left transition-all duration-300 border ${
                isSelected
                  ? 'ring-2 ring-slate-950 border-transparent shadow-md'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-subtle-card hover:shadow'
              }`}
            >
              {/* Background Image */}
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/10" />

              {/* Top Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-900 backdrop-blur-xs">
                  {city.activeVehiclesCount} Rides Available
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                  <span>{city.state}</span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                  {city.name}
                </h3>
                <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5 hidden sm:block">
                  {city.tagline}
                </p>

                <div className="mt-1.5 flex items-center justify-between pt-1.5 border-t border-white/20 text-xs">
                  <span className="text-[11px] text-slate-200">From</span>
                  <span className="font-extrabold text-amber-300">
                    ₹{city.startingPrice.toLocaleString('en-IN')}<span className="text-[9px] font-normal text-slate-300">/day</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
