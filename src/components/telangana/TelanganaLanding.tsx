import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Car, 
  Home, 
  CheckCircle, 
  QrCode, 
  Search, 
  ChevronRight, 
  Building2, 
  Utensils, 
  Palette, 
  HeartHandshake, 
  Eye, 
  ScanLine,
  PhoneCall,
  Flame,
  Award
} from 'lucide-react';
import { 
  TELANGANA_DESTINATIONS, 
  TELANGANA_ATTRACTIONS, 
  TELANGANA_STAYS, 
  TELANGANA_GUIDES, 
  TELANGANA_CULTURAL_TRAILS,
  TELANGANA_RENTALS
} from '../../data/telanganaData';
import { TelanganaDestination, TelanganaAttraction, TelanganaTravelPassData } from '../../types/telangana';
import { TelanganaPassScannerModal } from './TelanganaPassScannerModal';

interface TelanganaLandingProps {
  onStartCustomTrip: (destinationIds?: string[], attractionIds?: string[]) => void;
  onViewPass: (pass: TelanganaTravelPassData) => void;
}

export const TelanganaLanding: React.FC<TelanganaLandingProps> = ({
  onStartCustomTrip,
  onViewPass
}) => {
  const [activeAttractionCategory, setActiveAttractionCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState<TelanganaDestination | null>(null);

  const filteredAttractions = TELANGANA_ATTRACTIONS.filter(att => {
    const matchesCategory = activeAttractionCategory === 'all' || att.category.toLowerCase() === activeAttractionCategory.toLowerCase();
    const matchesSearch = att.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          att.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDemoPass = () => {
    // Navigate to demo pass directly
    fetch('/api/telangana/passes/TS-820194')
      .then(res => res.json())
      .then(data => {
        if (data && data.passId) {
          onViewPass(data);
        }
      })
      .catch(() => {
        // Fallback demo pass object
        onViewPass({
          passId: "TS-820194",
          tripId: "TS-TRIP-7491",
          travelerName: "Priya Sundaram",
          travelerPhone: "+91 98401 23456",
          travelerEmail: "priya.traveler@safarsetu.in",
          tripDates: "Oct 14 - Oct 18, 2026",
          travelersCount: 2,
          tripStyle: "Comfort",
          travelerType: "Couple",
          destinations: ["Hyderabad", "Warangal"],
          attractions: [
            { attractionId: "charminar", name: "Charminar & Laad Bazaar", category: "Heritage", ticketStatus: "INCLUDED", passEligible: true, visited: true, visitedTimestamp: "Oct 14, 2026 - 10:15 AM", entryFee: 25 },
            { attractionId: "golconda-fort", name: "Golconda Fort & Whispering Galleries", category: "Forts", ticketStatus: "INCLUDED", passEligible: true, visited: true, visitedTimestamp: "Oct 14, 2026 - 03:45 PM", entryFee: 50 },
            { attractionId: "ramappa-temple", name: "UNESCO Ramappa Temple", category: "Temples", ticketStatus: "INCLUDED", passEligible: true, visited: false, entryFee: 25 }
          ],
          transport: { segments: [] },
          stay: [],
          totalBudget: { transportCost: 1302, staysCost: 10100, attractionsCost: 250, guideCost: 3400, rentalCost: 6600, taxesAndService: 890, grandTotal: 22542 },
          passStatus: "PARTIALLY_USED",
          qrPayloadUrl: "https://safarsetu.in/pass/TS-820194",
          createdAt: new Date().toISOString(),
          emergencyContact: {
            touristPolice: "112",
            telanganaTourismHelpline: "1800-425-46464",
            sheTeams: "100"
          }
        });
      });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 text-left animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950 text-white pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated State Ecosystem • Government of Telangana &amp; SafarSetu</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              Discover <span className="text-amber-400 italic font-normal">Telangana</span>, Your Way.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience the diamond citadels of the Nizams, 13th-century Kakatiya stone temples, and UNESCO marvels. Built with zero hidden commissions, department-certified storyteller guides, and the unified digital <strong className="text-amber-300">Telangana Travel Pass</strong>.
            </p>
          </div>

          {/* Core Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartCustomTrip()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Build My Custom Telangana Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenDemoPass}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition backdrop-blur-xs flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>View Active Travel Pass</span>
            </button>

            <button
              onClick={() => setScannerModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
              title="Gate Staff & Partner Entry Scanner"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gate Terminal Simulator</span>
            </button>
          </div>

          {/* Proof Badges Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">100%</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Zero-Commission Local Stays</p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">8 Districts</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Direct Multimodal Corridors</p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">UNESCO</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Ramappa World Heritage Site</p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xs">
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">1 Unified</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">QR Pass for Stays &amp; Sights</p>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK PRE-SET ITINERARY PRESETS (1-CLICK LOAD INTO BUILDER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Curated Itinerary Blueprints
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1.5">
              Ready-Made Telangana Journeys
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any curated route to load directly into the customization engine where you can modify days, transport, and stays.
            </p>
          </div>
          <button
            onClick={() => onStartCustomTrip()}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Customise from scratch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Blueprint 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                  4 Days • Heritage &amp; Nizam
                </span>
                <span className="text-xs font-bold text-slate-900">₹8,500 / person</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-950">
                Jewels of the Nizams &amp; Golconda
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Charminar, Chowmahalla Palace, Qutb Shahi Tombs, Salar Jung Museum, and Golconda Fort evening acoustic light show.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <p>• Stay: Banjara Deccan Heritage Homestay</p>
                <p>• Guide: Mirza Salman Baig (Nizami Historian)</p>
                <p>• Transit: Hyderabad Metro + Chauffeur Van</p>
              </div>
            </div>

            <button
              onClick={() => onStartCustomTrip(['hyderabad'], ['charminar', 'golconda-fort', 'chowmahalla-palace', 'salar-jung', 'qutb-shahi-tombs', 'hussain-sagar'])}
              className="w-full py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Customize This Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blueprint 2 */}
          <div className="bg-white rounded-3xl border border-amber-300 ring-2 ring-amber-400/20 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Most Popular
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  5 Days • UNESCO &amp; Kakatiya
                </span>
                <span className="text-xs font-bold text-slate-900">₹11,400 / person</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-950">
                Grand Deccan &amp; UNESCO Ramappa
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless twin-hub corridor: Hyderabad palaces &rarr; Vande Bharat Express to Warangal Thousand Pillar &amp; UNESCO Ramappa Temple.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <p>• Stay: Haritha Laknavaram Island Cottages</p>
                <p>• Guide: Dr. Shailaja Reddy (Kakatiya Epigraphist)</p>
                <p>• Transit: Vande Bharat Rail + Chauffeur Swift</p>
              </div>
            </div>

            <button
              onClick={() => onStartCustomTrip(['hyderabad', 'warangal'], ['charminar', 'golconda-fort', 'ramappa-temple', 'thousand-pillar-temple', 'laknavaram-lake'])}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Customize This Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blueprint 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                  3 Days • Nature &amp; Serenity
                </span>
                <span className="text-xs font-bold text-slate-900">₹7,200 / person</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-950">
                Nagarjuna Sagar &amp; Krishna River Cruise
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nagarjunakonda Buddhist Island Museum, world&apos;s tallest masonry dam, Ethipothala cascading falls, and riverboat safari.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <p>• Stay: Haritha Vijay Vihar Lake Resort</p>
                <p>• Guide: K. Ramana (Buddhist Heritage)</p>
                <p>• Transit: Scenic Highway Road Trip</p>
              </div>
            </div>

            <button
              onClick={() => onStartCustomTrip(['nagarjunasagar'], ['nagarjuna-dam', 'nagarjunakonda', 'ethipothala-falls'])}
              className="w-full py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>Customize This Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* REGIONAL DESTINATIONS REGISTRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Geographic Corridors
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1.5">
            Key Telangana Destinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tap any region to inspect sights or jump directly into the itinerary customizer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TELANGANA_DESTINATIONS.map(dest => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                      {dest.tagline}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold drop-shadow-md">
                    <span>{dest.recommendedDuration}</span>
                    <span>~₹{dest.startingBudgetPerDay}/day</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-amber-800 transition">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dest.shortDescription}
                  </p>
                  
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Key Highlights</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {dest.bestKnownFor.slice(0, 3).map(att => (
                        <span key={att} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {att}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onStartCustomTrip([dest.id])}
                  className="flex-1 py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                >
                  <span>Build Trip</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ATTRACTION EXPLORER & SIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
              Monuments &amp; Natural Marvels
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1.5">
              Verified Telangana Attraction Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Filter official opening hours, entry fees, and pass eligibility status.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ramappa, Golconda, Biryani..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {['all', 'Heritage', 'Forts', 'Temples', 'Lakes', 'Museums', 'Nature', 'Waterfalls'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveAttractionCategory(cat)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                activeAttractionCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Attractions' : cat}
            </button>
          ))}
        </div>

        {/* Attractions Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAttractions.map(att => (
            <div
              key={att.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={att.image}
                    alt={att.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                      {att.destinationName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      {att.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                      Pass: {att.ticketStatus}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-base text-slate-950">
                    {att.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {att.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{att.openingHours.openDisplay}</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      Entry: ₹{att.entryFee}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Avg visit: {att.recommendedDurationHours}h
                </span>
                <button
                  onClick={() => onStartCustomTrip([att.destinationId], [att.id])}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1"
                >
                  <span>Add to Trip</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CULTURAL & TEXTILE TRAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Living Culture &amp; Heritage
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 mt-1.5">
            Handlooms, Culinary Legacy &amp; Folklore
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Experience authentic Telangana craft villages, GI-tagged Pochampally weavers, and royal Nizami cuisines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TELANGANA_CULTURAL_TRAILS.map(trail => (
            <div key={trail.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                  <img
                    src={trail.image}
                    alt={trail.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-900/80 text-white">
                      {trail.type}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-base text-slate-950">
                    {trail.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {trail.summary}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Authentic Experiences</p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {trail.highlights.map(h => (
                        <li key={h} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Curated Telangana Experience
                </span>
                <button
                  onClick={() => onStartCustomTrip()}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                >
                  <span>Explore Trail</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* UNIFIED TRAVEL PASS EXPLAINER CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2.5 py-1 rounded">
                Revolutionary Travel Infrastructure
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                One Digital Pass for All of Telangana
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                Skip ticketing lines at Charminar, Golconda Fort, and Ramappa Temple. Consolidate your Vande Bharat rail seats, Haritha island cottages, and certified storyteller guides into a single verifiable QR barcode readable offline.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                  <p className="font-bold text-xs text-amber-300">Direct Gate Admission</p>
                  <p className="text-[11px] text-slate-300 mt-1">Instant barcode scan at monument turnstiles.</p>
                </div>
                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                  <p className="font-bold text-xs text-amber-300">100% Offline Valid</p>
                  <p className="text-[11px] text-slate-300 mt-1">Cryptographic token functions without cell signal.</p>
                </div>
                <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                  <p className="font-bold text-xs text-amber-300">Emergency Security</p>
                  <p className="text-[11px] text-slate-300 mt-1">Integrated with Tourist Police 112 &amp; SHE Teams.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl text-center space-y-4">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl flex items-center justify-center shadow-lg">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-amber-400">DEMO PASS AVAILABLE</p>
                <p className="text-[11px] text-slate-300">Pass ID: TS-820194</p>
              </div>
              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={handleOpenDemoPass}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-xs"
                >
                  View Demo Pass
                </button>
                <button
                  onClick={() => setScannerModalOpen(true)}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition"
                >
                  Test Entry Gate Scanner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gate Scanner Simulator Modal */}
      <TelanganaPassScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        initialPassId="TS-820194"
      />

    </div>
  );
};
