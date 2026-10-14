import React, { useState } from 'react';
import { Home, Star, MapPin, Check } from 'lucide-react';
import { StayOption } from '../../types';

interface Step2StaysProps {
  stays: StayOption[];
  selectedStay: StayOption | null;
  onSelectStay: (stay: StayOption) => void;
}

export const Step2Stays: React.FC<Step2StaysProps> = ({
  stays,
  selectedStay,
  onSelectStay
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'homestay' | 'budget' | 'heritage'>('all');

  const filteredStays = stays.filter(s => {
    if (tierFilter === 'all') return true;
    return s.tier === tierFilter;
  });

  return (
    <div id="content-stays" className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle-card text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500 mr-1">Filter Tier:</span>
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${tierFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            All Stays
          </button>
          <button
            onClick={() => setTierFilter('homestay')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1 ${tierFilter === 'homestay' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            <Home className="w-3.5 h-3.5 text-orange-500" />
            <span>Verified Homestays (0% Fee)</span>
          </button>
          <button
            onClick={() => setTierFilter('budget')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${tierFilter === 'budget' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            Budget / Eco-Cottage
          </button>
          <button
            onClick={() => setTierFilter('heritage')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${tierFilter === 'heritage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            Heritage / Resort
          </button>
        </div>
        <span className="text-slate-500 text-[11px] font-medium">Direct Host Channel Sync Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStays.map((stay) => {
          const isSelected = selectedStay?.id === stay.id;
          return (
            <div
              key={stay.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-subtle-card flex flex-col justify-between transition text-left ${isSelected ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-200'}`}
            >
              <div>
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-white/95 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {stay.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white text-slate-900 font-bold text-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{stay.rating}</span>
                    <span className="text-[10px] text-slate-400">({stay.reviews})</span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-slate-950 leading-snug">{stay.name}</h4>
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{stay.location}</span>
                  </div>
                  <div className="text-[11px] text-orange-700 font-semibold">Host: {stay.hostName}</div>
                  <div className="space-y-1 pt-1 text-slate-600">
                    {stay.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Per Night</span>
                  <div className="font-serif font-bold text-lg text-slate-950">
                    ₹{stay.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  onClick={() => onSelectStay(stay)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition ${isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-orange-700 text-white'}`}
                >
                  {isSelected ? '✓ Reserved' : 'Reserve'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
