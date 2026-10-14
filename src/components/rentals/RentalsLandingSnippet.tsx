import React from 'react';
import {
  Car,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Compass,
  Zap,
  Users,
  Star
} from 'lucide-react';
import { RentalCategory } from '../../types';

interface RentalsLandingSnippetProps {
  onOpenRentals: (cityKey?: string, category?: RentalCategory) => void;
}

export const RentalsLandingSnippet: React.FC<RentalsLandingSnippetProps> = ({
  onOpenRentals
}) => {
  const featuredRides = [
    {
      id: 'V-GOA-01',
      name: 'Mahindra Thar 4x4',
      city: 'Goa',
      cityKey: 'goa',
      category: 'suv',
      price: '₹3,499/day',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      badge: 'Open Desert & Beach Spec'
    },
    {
      id: 'V-HYD-01',
      name: 'Toyota Innova Crysta ZX',
      city: 'Hyderabad',
      cityKey: 'hyderabad',
      category: 'suv',
      price: '₹3,499/day',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
      badge: 'Chauffeur Storyteller Escort'
    },
    {
      id: 'V-LEH-01',
      name: 'Royal Enfield Himalayan 450',
      city: 'Leh (Ladakh)',
      cityKey: 'leh',
      category: 'bike_scooter',
      price: '₹1,899/day',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
      badge: 'High Altitude Expedition Ready'
    },
    {
      id: 'V-HYD-02',
      name: 'Tata Nexon EV Max',
      city: 'Hyderabad',
      cityKey: 'hyderabad',
      category: 'ev_luxury',
      price: '₹2,499/day',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80',
      badge: '100% Green Electric • Free Charging'
    }
  ];

  const quickCities = [
    { key: 'goa', name: 'Goa', tag: 'From ₹499/day' },
    { key: 'hyderabad', name: 'Hyderabad', tag: 'From ₹1,499/day' },
    { key: 'jaipur', name: 'Jaipur', tag: 'From ₹1,599/day' },
    { key: 'kochi', name: 'Kochi (Kerala)', tag: 'From ₹1,599/day' },
    { key: 'leh', name: 'Leh-Ladakh', tag: 'From ₹1,899/day' },
    { key: 'bengaluru', name: 'Bengaluru', tag: 'From ₹599/day' }
  ];

  return (
    <section
      id="rentals-feature-section"
      className="py-16 bg-[#faf8f5] border-t border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>New On SafarSetu • Direct Fleet Mobility</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
              Find the right ride for your journey
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Rent verified self-drive cars, 4x4 SUVs, adventure bikes, and storyteller-guided rides across India's top travel corridors. Zero middleman commission with commercial permit compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-explore-all-rentals-banner"
              onClick={() => onOpenRentals()}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xs hover:shadow"
            >
              <Car className="w-4 h-4 text-orange-400" />
              <span>Explore All Rental Fleets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Destination Corridor Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Popular Rental Corridors:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {quickCities.map((c) => (
              <button
                key={c.key}
                onClick={() => onOpenRentals(c.key)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/85 hover:border-slate-400 text-slate-800 font-semibold text-xs transition flex items-center gap-2 shadow-subtle-card group"
              >
                <Compass className="w-3.5 h-3.5 text-orange-600 group-hover:rotate-45 transition-transform" />
                <span>{c.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({c.tag})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Vehicle Showcase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredRides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => onOpenRentals(ride.cityKey, ride.category as RentalCategory)}
              className="group bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-subtle-card hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={ride.image}
                  alt={ride.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />

                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-xs">
                    {ride.city}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="text-[10px] text-orange-300 font-bold">{ride.badge}</div>
                  <h3 className="font-serif font-bold text-base text-white leading-tight">
                    {ride.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Starting from</span>
                  <span className="font-extrabold text-sm text-slate-950">{ride.price}</span>
                </div>

                <span className="text-xs font-bold text-orange-700 group-hover:text-orange-900 flex items-center gap-1 transition">
                  <span>View Rides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Guaranteed Standards Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle-card grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-slate-950 font-bold">100% Commercial Fleet</strong>
              <span className="text-slate-600 text-[11px]">
                Valid commercial yellow-plates with interstate national tourist permits.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-slate-950 font-bold">Storyteller Chauffeur Option</strong>
              <span className="text-slate-600 text-[11px]">
                Escorted by police-verified local driver-storytellers who know regional hidden treasures.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-slate-950 font-bold">0% Middleman Commission</strong>
              <span className="text-slate-600 text-[11px]">
                Direct pricing with transparent security deposit return and free 24-hour cancellation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
