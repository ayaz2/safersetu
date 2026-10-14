import React from 'react';
import { ShieldCheck, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onPlanTripClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlanTripClick, onExploreClick }) => {
  return (
    <section id="hero" className="relative pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full box-border">
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-slate-950 min-h-[560px] sm:min-h-[640px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 text-white shadow-2xl w-full box-border">
        
        {/* Background Imagery */}
        <div className="absolute inset-0 z-0">
          <img 
            id="hero-banner-img"
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&auto=format&fit=crop&q=80" 
            alt="Incredible India Travel Vista" 
            className="w-full h-full object-cover object-center opacity-55 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Hero Liquid Glass Badges */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="liquid-glass-dark inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>All 28 States & 8 Union Territories</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-dark text-xs text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Destination Data Isolation</span>
          </span>
        </div>

        {/* Hero Headlines */}
        <div className="relative z-10 max-w-3xl space-y-4 my-auto pt-6 pb-8 text-left">
          <p className="text-sm sm:text-base font-semibold uppercase tracking-widest text-orange-200">
            Explore India the smart way
          </p>
          <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-white">
            One country. <br/>
            <span className="italic font-normal text-slate-200">A thousand stories.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl leading-relaxed">
            Discover verified destinations, build personalized multimodal journeys, experience certified heritage homestays, and travel with local storyteller drivers.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-4">
          <button
            id="hero-plan-trip-cta"
            onClick={onPlanTripClick}
            className="px-7 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center gap-2.5"
          >
            <span>Plan My Trip</span>
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            id="hero-explore-cta"
            onClick={onExploreClick}
            className="px-6 py-4 rounded-2xl liquid-glass-dark text-white font-semibold text-sm sm:text-base hover:bg-white/20 transition-all duration-200"
          >
            Explore Destinations
          </button>
        </div>

      </div>
    </section>
  );
};
