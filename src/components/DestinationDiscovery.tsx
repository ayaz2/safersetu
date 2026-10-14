import React, { useState } from 'react';
import { Search, Tag, Compass } from 'lucide-react';
import { COMPLETE_TOURISM_REGISTRY } from '../data/destinations';
import { RegionKey, StateTourism } from '../types';

interface DestinationDiscoveryProps {
  onOpenDossier: (stateId: string) => void;
  onPlanTripAroundState: (stateId: string) => void;
}

export const DestinationDiscovery: React.FC<DestinationDiscoveryProps> = ({
  onOpenDossier,
  onPlanTripAroundState
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allDestinations = Object.values(COMPLETE_TOURISM_REGISTRY);

  const filtered = allDestinations.filter(st => {
    let matchesRegion = true;
    if (selectedRegion === 'south') matchesRegion = st.region === 'south';
    else if (selectedRegion === 'north') matchesRegion = st.region === 'north';
    else if (selectedRegion === 'west') matchesRegion = st.region === 'west';
    else if (selectedRegion === 'east') matchesRegion = st.region === 'east' || st.region === 'northeast';
    else if (selectedRegion === 'ut') matchesRegion = st.isUT === true || st.region === 'ut';

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      st.name.toLowerCase().includes(q) ||
      st.capital.toLowerCase().includes(q) ||
      st.description.toLowerCase().includes(q);

    return matchesRegion && matchesSearch;
  });

  return (
    <section id="destination-discovery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 text-left">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-700">
            Curated Destination Dossiers
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-950">
            Where will India take you?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Strictly verified destination profiles with complete 5-day & 7-day day-by-day itineraries, authentic homestays, and vetted local storyteller drivers.
          </p>
        </div>

        {/* Region Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            All States & UTs ({allDestinations.length})
          </button>
          <button
            onClick={() => setSelectedRegion('south')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'south' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            South India
          </button>
          <button
            onClick={() => setSelectedRegion('north')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'north' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            North & Himalayas
          </button>
          <button
            onClick={() => setSelectedRegion('west')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'west' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            West Coast
          </button>
          <button
            onClick={() => setSelectedRegion('east')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'east' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            East & Northeast
          </button>
          <button
            onClick={() => setSelectedRegion('ut')}
            className={`px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap ${selectedRegion === 'ut' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
          >
            Union Territories
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
        <input 
          type="text" 
          id="state-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search state, UT, or capital (e.g. Kerala, Telangana, Ladakh, Goa)..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 shadow-xs"
        />
      </div>

      {/* Destination Cards Grid */}
      <div id="state-cards-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
        {filtered.map((st: StateTourism) => {
          const budgetSaving = st.whenToVisit?.budgetAnalysis?.averageSavings || "Save up to 40%";
          return (
            <div 
              key={st.id} 
              className="card-zoom-container bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-subtle-card hover:shadow-hover-card transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img 
                    src={st.image} 
                    alt={st.name} 
                    className="card-zoom-img w-full h-full object-cover" 
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs uppercase tracking-wider">
                      {st.badge || (st.isUT ? "Union Territory" : "State Partner")}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-semibold text-slate-300">{st.duration} • {st.capital}</span>
                    <h3 className="font-serif font-bold text-xl text-white drop-shadow leading-snug">{st.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {st.description}
                  </p>

                  <div className="p-2.5 bg-[#faf8f5] rounded-xl text-[11px] text-slate-700 flex items-center justify-between border border-slate-200/70">
                    <span className="font-bold flex items-center gap-1.5 text-slate-900">
                      <Tag className="w-3.5 h-3.5 text-orange-600" /> Best Value:
                    </span>
                    <span className="font-semibold text-emerald-800">{budgetSaving}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button 
                  onClick={() => onOpenDossier(st.id)} 
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs text-center"
                >
                  Explore Dossier
                </button>
                <button 
                  onClick={() => onPlanTripAroundState(st.id)} 
                  title="Configure in Planner" 
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center"
                >
                  <Compass className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
