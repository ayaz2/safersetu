import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Check, 
  Plane, 
  Home, 
  UserCheck, 
  Calendar, 
  ArrowRight, 
  Bookmark, 
  CheckCircle,
  FileCheck
} from 'lucide-react';

import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { HeroSection } from './components/HeroSection';
import { TripConfigurator } from './components/TripConfigurator';
import { DestinationDiscovery } from './components/DestinationDiscovery';
import { TravelByInterest } from './components/TravelByInterest';
import { HowItWorks } from './components/HowItWorks';
import { ValueTransparency } from './components/ValueTransparency';
import { Footer } from './components/Footer';
import { HostPortal } from './components/HostPortal';
import { PartnerPortal } from './components/partner/PartnerPortal';
import { AdminOperationsPortal } from './components/admin/AdminOperationsPortal';
import { FloatingSOSBeacon } from './components/FloatingSOSBeacon';

import { Step1Transport } from './components/planner/Step1Transport';
import { Step2Stays } from './components/planner/Step2Stays';
import { Step3Driver } from './components/planner/Step3Driver';
import { Step4Itinerary } from './components/planner/Step4Itinerary';
import { Step5Review } from './components/planner/Step5Review';
import { Step6Pass } from './components/planner/Step6Pass';
import { SafarMitraTab } from './components/planner/SafarMitraTab';

import { StateModal } from './components/modals/StateModal';
import { MyTripsModal } from './components/modals/MyTripsModal';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { SOSModal } from './components/modals/SOSModal';
import { AuthModal } from './components/modals/AuthModal';

import { RentalsPage } from './components/rentals/RentalsPage';
import { RentalsLandingSnippet } from './components/rentals/RentalsLandingSnippet';
import { TripPlannerRentalBanner } from './components/rentals/TripPlannerRentalBanner';
import { CustomerReviewsSection } from './components/reviews/CustomerReviewsSection';
import { TelanganaModule } from './components/telangana/TelanganaModule';

import { 
  COMPLETE_TOURISM_REGISTRY, 
  getDestinationPackage, 
  generateDynamicTimeline 
} from './data/destinations';
import { 
  TransportOption, 
  StayOption, 
  DriverOption, 
  BookingRecord, 
  SavedDraft, 
  UserSession, 
  StateTourism,
  RentalCategory
} from './types';

export default function App() {
  // Navigation & Primary Views
  const [currentView, setCurrentView] = useState<'landing' | 'planner' | 'operator' | 'partner' | 'admin_ops' | 'rentals' | 'telangana'>('landing');
  const [rentalPreselectedCity, setRentalPreselectedCity] = useState<string | undefined>(undefined);
  const [rentalPreselectedCategory, setRentalPreselectedCategory] = useState<RentalCategory | undefined>(undefined);
  const [plannerStep, setPlannerStep] = useState<
    'transport' | 'stays' | 'driver' | 'itinerary' | 'review' | 'confirmation' | 'ai-guide'
  >('transport');

  // Trip Configuration State
  const [origin, setOrigin] = useState('Hyderabad');
  const [destinationKey, setDestinationKey] = useState('kerala');
  const [datesText, setDatesText] = useState('Oct 14 - Oct 18, 2026');
  const [calculatedNights, setCalculatedNights] = useState(4);
  const [persona, setPersona] = useState('couple');
  const [activeTags, setActiveTags] = useState<string[]>(['Backwaters & Lakes']);
  const [durationDays, setDurationDays] = useState<5 | 7>(5);

  // Selected Planner Items
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
  const [selectedStay, setSelectedStay] = useState<StayOption | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Disruption Simulator State
  const [activeDisruption, setActiveDisruption] = useState<{
    type: 'transit_delay' | 'weather_alert';
    title: string;
    description: string;
  } | null>(null);

  // Bookings & Storage
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
  const [activeBookingForPass, setActiveBookingForPass] = useState<BookingRecord | null>(null);
  const [draftSavedFeedback, setDraftSavedFeedback] = useState(false);

  // User & Settings
  const [user, setUser] = useState<UserSession | null>({
    id: 'usr-1',
    name: 'Priya Sundaram',
    phone: '+91 98401 23456',
    role: 'traveler'
  });
  const [isOffline, setIsOffline] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Modals
  const [stateModalData, setStateModalData] = useState<StateTourism | null>(null);
  const [myTripsOpen, setMyTripsOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'traveler' | 'host'>('traveler');

  // Load destination package based on destinationKey
  const currentPackage = getDestinationPackage(destinationKey);
  const destinationName = currentPackage.name;

  // Auto-select defaults when destination package changes
  useEffect(() => {
    if (currentPackage.transports.length > 0) {
      const rec = currentPackage.transports.find(t => t.recommended) || currentPackage.transports[0];
      setSelectedTransport(rec);
    }
    if (currentPackage.stays.length > 0) {
      setSelectedStay(currentPackage.stays[0]);
    }
    if (currentPackage.storytellerDrivers.length > 0) {
      setSelectedDriver(currentPackage.storytellerDrivers[0]);
    }
    setActiveDisruption(null);
  }, [destinationKey]);

  // Load initial bookings from server
  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
          if (data.length > 0 && !activeBookingForPass) {
            setActiveBookingForPass(data[0]);
          }
        }
      })
      .catch(() => {
        // Fallback default booking for demonstration
        const defaultBooking: BookingRecord = {
          id: 'SS-KRL-2026-9812',
          pnr: 'IRCTC-98214-KL',
          origin: 'Hyderabad',
          destinationKey: 'kerala',
          destinationName: 'Kerala',
          dates: 'Oct 14 - Oct 18, 2026',
          guests: 2,
          nights: 4,
          transport: 'Vande Bharat Express (Train 20631)',
          stay: 'Kumarakom Vembanad Heritage Homestay',
          driver: 'Suresh Kurup (Certified Storyteller Chauffeur)',
          totalCost: '₹16,700',
          status: 'Confirmed',
          paymentMethod: 'BHIM UPI',
          timestamp: 'Oct 10, 2026, 11:20 AM'
        };
        setBookings([defaultBooking]);
        setActiveBookingForPass(defaultBooking);
      });
  }, []);

  // Compute guests count
  const guestsCount = persona === 'family' ? 4 : persona === 'couple' ? 2 : 1;

  // Generate dynamic timeline
  const timeline = generateDynamicTimeline(destinationKey, durationDays, datesText);

  // Scroll to element helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Passion tag toggle
  const togglePassionTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Switch destination from Dossier or styles
  const handleOpenDossier = (stateId: string) => {
    const found = COMPLETE_TOURISM_REGISTRY[stateId];
    if (found) {
      setStateModalData(found);
    }
  };

  const handlePlanTripAroundState = (stateId: string) => {
    if (stateId.toLowerCase() === 'telangana') {
      setCurrentView('telangana');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setDestinationKey(stateId);
    setCurrentView('planner');
    setPlannerStep('transport');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStyle = (style: 'coastal' | 'heritage' | 'mountains' | 'food') => {
    if (style === 'coastal') handleOpenDossier('kerala');
    else if (style === 'heritage') handleOpenDossier('telangana');
    else if (style === 'mountains') handleOpenDossier('himachal');
    else if (style === 'food') handleOpenDossier('kerala');
  };

  // Save Draft
  const handleSaveDraft = async () => {
    const draft: SavedDraft = {
      id: 'draft-' + Date.now(),
      origin,
      destinationKey,
      destinationName,
      dates: datesText,
      nights: calculatedNights,
      persona,
      durationDays,
      transportId: selectedTransport?.id,
      stayId: selectedStay?.id,
      driverId: selectedDriver?.id,
      updatedAt: 'Just now'
    };

    setSavedDrafts(prev => [draft, ...prev]);
    setDraftSavedFeedback(true);
    setTimeout(() => setDraftSavedFeedback(false), 3000);

    try {
      await fetch('/api/trips/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
    } catch (e) {
      // Saved in state
    }
  };

  // Load Saved Draft
  const handleLoadDraft = (draft: SavedDraft) => {
    setOrigin(draft.origin);
    setDestinationKey(draft.destinationKey);
    setDatesText(draft.dates);
    setCalculatedNights(draft.nights);
    setPersona(draft.persona);
    setDurationDays(draft.durationDays);
    setCurrentView('planner');
    setPlannerStep('transport');
  };

  // Open Rentals with preselected city/category
  const handleOpenRentals = (cityKey?: string, category?: RentalCategory) => {
    setRentalPreselectedCity(cityKey);
    setRentalPreselectedCategory(category);
    setCurrentView('rentals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Disruption Handlers
  const handleTriggerDisruption = (type: 'transit_delay' | 'weather_alert') => {
    if (type === 'transit_delay') {
      setActiveDisruption({
        type: 'transit_delay',
        title: 'Inbound Train Delayed by 3 Hours (Fog/Signal Clearance)',
        description: `Your express service to ${destinationName} is delayed. SafarSetu has verified your homestay host will keep late check-in open with zero penalty, and your storyteller driver will arrive at the new ETA.`
      });
    } else {
      setActiveDisruption({
        type: 'weather_alert',
        title: 'Mountain Pass Weather Reroute Activated',
        description: `Local district road safety authority has flagged high-altitude fog. Your certified storyteller chauffeur has shifted route to a scenic lower valley corridor.`
      });
    }
    setWhatsAppModalOpen(true);
  };

  const handleResetDisruption = () => {
    setActiveDisruption(null);
  };

  // Confirm Booking
  const handleConfirmBooking = async () => {
    const transportCost = selectedTransport ? selectedTransport.price * guestsCount : 0;
    const stayCost = selectedStay ? selectedStay.price * calculatedNights : 0;
    const driverCost = selectedDriver ? selectedDriver.fixedFullTripPrice : 0;
    const totalCostNumber = transportCost + stayCost + driverCost;

    const newBooking: BookingRecord = {
      id: `SS-${destinationKey.slice(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      pnr: `IRCTC-${Math.floor(10000 + Math.random() * 90000)}-IN`,
      origin,
      destinationKey,
      destinationName,
      dates: datesText,
      guests: guestsCount,
      nights: calculatedNights,
      transport: selectedTransport ? selectedTransport.title : 'Self Arranged',
      stay: selectedStay ? selectedStay.name : 'Homestay',
      driver: selectedDriver ? `${selectedDriver.name} (${selectedDriver.role})` : 'Assigned Chauffeur',
      totalCost: `₹${totalCostNumber.toLocaleString('en-IN')}`,
      status: 'Confirmed',
      paymentMethod,
      timestamp: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      if (res.ok) {
        const saved = await res.json();
        setBookings(prev => [saved.booking || newBooking, ...prev]);
        setActiveBookingForPass(saved.booking || newBooking);
      } else {
        setBookings(prev => [newBooking, ...prev]);
        setActiveBookingForPass(newBooking);
      }
    } catch (e) {
      setBookings(prev => [newBooking, ...prev]);
      setActiveBookingForPass(newBooking);
    }

    setPlannerStep('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Booking
  const handleCancelBooking = async (id: string) => {
    try {
      await fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
    } catch (e) {
      // Handled
    }
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-[#faf8f5] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white box-border">
      
      {/* Offline Alert Banner */}
      <OfflineBanner
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />

      {/* Global Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMyTrips={() => setMyTripsOpen(true)}
        onOpenSafarMitra={() => {
          setCurrentView('planner');
          setPlannerStep('ai-guide');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollTo={scrollToSection}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onOpenAuth={() => {
          setAuthRole('traveler');
          setAuthModalOpen(true);
        }}
        onOpenHostAuth={() => {
          setAuthRole('host');
          setAuthModalOpen(true);
        }}
        user={user}
        onLogout={() => setUser(null)}
        savedTripsCount={bookings.length + savedDrafts.length}
        onTriggerSOS={() => setSosModalOpen(true)}
        selectedLanguage={selectedLanguage}
        onChangeLanguage={(lang) => setSelectedLanguage(lang)}
      />

      {/* MAIN VIEW SWITCHER */}
      <main className="flex-1 pb-16 w-full max-w-full box-border">
        
        {/* ============================================================ */}
        {/* VIEW 1: HOMEPAGE / LANDING VIEW                             */}
        {/* ============================================================ */}
        {currentView === 'landing' && (
          <div className="space-y-16 sm:space-y-24 w-full box-border">
            
            {/* Hero Section */}
            <HeroSection
              onPlanTripClick={() => {
                setCurrentView('planner');
                setPlannerStep('transport');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreClick={() => scrollToSection('destination-discovery')}
            />

            {/* Quick Trip Configurator Card */}
            <TripConfigurator
              origin={origin}
              onOriginChange={(val) => setOrigin(val)}
              destination={destinationKey}
              onDestinationChange={(val) => setDestinationKey(val)}
              datesText={datesText}
              onDatesChange={(val) => setDatesText(val)}
              calculatedNights={calculatedNights}
              persona={persona}
              onPersonaChange={(val) => setPersona(val)}
              onBuildTrip={() => {
                setCurrentView('planner');
                setPlannerStep('transport');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              activeTags={activeTags}
              onToggleTag={togglePassionTag}
            />

            {/* Dedicated State Spotlight: Telangana Tourism Travel Ecosystem */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 text-left z-10 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                      Dedicated State Ecosystem
                    </span>
                    <span className="text-xs text-amber-200/90 font-semibold">
                      Official Digital Travel Pass Active
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                    Experience Telangana Tourism
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Explore Charminar, Golconda, UNESCO Ramappa Temple, Haritha Lakeside Resorts, and verified local storyteller guides with a single consolidated QR pass and conflict-free schedule builder.
                  </p>
                </div>
                <div className="flex items-center gap-3 z-10 shrink-0 w-full md:w-auto">
                  <button
                    id="hero-enter-telangana-btn"
                    onClick={() => {
                      setCurrentView('telangana');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Enter Telangana Tourism</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </section>

            {/* Curated Destination Dossiers Explorer */}
            <DestinationDiscovery
              onOpenDossier={handleOpenDossier}
              onPlanTripAroundState={handlePlanTripAroundState}
            />

            {/* Rentals & Self-Drive Fleet Showcase */}
            <RentalsLandingSnippet onOpenRentals={handleOpenRentals} />

            {/* Travel by Interest */}
            <TravelByInterest onSelectStyle={handleSelectStyle} />

            {/* How It Works (Multimodal Architecture) */}
            <HowItWorks />

            {/* Value & Cost Transparency Card */}
            <ValueTransparency
              onConfigureClick={() => {
                setCurrentView('planner');
                setPlannerStep('transport');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Customer Feedback & Reviews Section */}
            <CustomerReviewsSection />

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: UNIFIED TRIP PLANNER WORKSPACE                      */}
        {/* ============================================================ */}
        {currentView === 'planner' && (
          <div id="planner-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            
            {/* Planner Top Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-subtle-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <Compass className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                      Destination Workspace
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      Strict Data Isolation
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-950">
                      Journey to {destinationName}
                    </h2>
                    
                    {/* Destination Switcher */}
                    <div className="relative">
                      <select
                        value={destinationKey}
                        onChange={(e) => setDestinationKey(e.target.value)}
                        className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                      >
                        {Object.values(COMPLETE_TOURISM_REGISTRY).map(st => (
                          <option key={st.id} value={st.id}>
                            Change to {st.name} ({st.capital})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save Draft */}
              <div className="flex items-center gap-2.5">
                <button
                  id="save-draft-btn"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                {draftSavedFeedback && (
                  <span className="text-xs font-bold text-emerald-700 animate-fade-in flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>
            </div>

            {/* 6-Step Sequential Progress Indicator Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-subtle-card overflow-x-auto scrollbar-none">
              <div className="flex items-center justify-between min-w-[700px] text-xs font-bold">
                
                {/* Step 1 */}
                <button
                  id="tab-transport-btn"
                  onClick={() => setPlannerStep('transport')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'transport'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedTransport
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>1. Transport</span>
                  {selectedTransport && plannerStep !== 'transport' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 2 */}
                <button
                  id="tab-stays-btn"
                  onClick={() => setPlannerStep('stays')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'stays'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedStay
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>2. Stays</span>
                  {selectedStay && plannerStep !== 'stays' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 3 */}
                <button
                  id="tab-driver-btn"
                  onClick={() => setPlannerStep('driver')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'driver'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : selectedDriver
                      ? 'text-slate-900 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>3. Storyteller Driver</span>
                  {selectedDriver && plannerStep !== 'driver' && (
                    <Check className="w-3 h-3 text-emerald-600 ml-1" />
                  )}
                </button>

                {/* Step 4 */}
                <button
                  id="tab-itinerary-btn"
                  onClick={() => setPlannerStep('itinerary')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'itinerary'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>4. Itinerary ({durationDays}D)</span>
                </button>

                {/* Step 5 */}
                <button
                  id="tab-review-btn"
                  onClick={() => setPlannerStep('review')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'review'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>5. Review</span>
                </button>

                {/* Step 6 */}
                <button
                  id="tab-confirmation-btn"
                  onClick={() => setPlannerStep('confirmation')}
                  className={`flex-1 py-3 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                    plannerStep === 'confirmation'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>6. Pass</span>
                </button>

                {/* SafarMitra AI Tab */}
                <button
                  id="tab-ai-companion-btn"
                  onClick={() => setPlannerStep('ai-guide')}
                  className={`py-3 px-4 rounded-xl transition flex items-center justify-center gap-1.5 ml-2 ${
                    plannerStep === 'ai-guide'
                      ? 'bg-orange-600 text-white shadow-xs font-black'
                      : 'bg-orange-100 text-orange-950 hover:bg-orange-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SafarMitra AI</span>
                </button>

              </div>
            </div>

            {/* PLANNER STEP CONTENTS */}
            <div className="pt-2">
              
              {/* STEP 1: TRANSPORT */}
              {plannerStep === 'transport' && (
                <div className="space-y-4">
                  <Step1Transport
                    transports={currentPackage.transports}
                    selectedTransport={selectedTransport}
                    onSelectTransport={(t) => {
                      setSelectedTransport(t);
                      setPlannerStep('stays');
                    }}
                    origin={origin}
                    destinationName={destinationName}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPlannerStep('stays')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Stays</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: STAYS */}
              {plannerStep === 'stays' && (
                <div className="space-y-4">
                  <Step2Stays
                    stays={currentPackage.stays}
                    selectedStay={selectedStay}
                    onSelectStay={(s) => {
                      setSelectedStay(s);
                      setPlannerStep('driver');
                    }}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setPlannerStep('transport')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      Back to Transport
                    </button>
                    <button
                      onClick={() => setPlannerStep('driver')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Driver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: STORYTELLER DRIVER */}
              {plannerStep === 'driver' && (
                <div className="space-y-4">
                  <TripPlannerRentalBanner
                    destinationName={destinationName}
                    destinationKey={destinationKey}
                    onExploreRentals={handleOpenRentals}
                  />

                  <Step3Driver
                    drivers={currentPackage.storytellerDrivers}
                    selectedDriver={selectedDriver}
                    onSelectDriver={(d) => {
                      setSelectedDriver(d);
                      setPlannerStep('itinerary');
                    }}
                    localTransit={currentPackage.localTransit}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => setPlannerStep('stays')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                    >
                      Back to Stays
                    </button>
                    <button
                      onClick={() => setPlannerStep('itinerary')}
                      className="px-6 py-3 bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
                    >
                      <span>Proceed to Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ITINERARY (5D / 7D) */}
              {plannerStep === 'itinerary' && (
                <div className="space-y-4">
                  <Step4Itinerary
                    timeline={timeline}
                    durationDays={durationDays}
                    onChangeDuration={(d) => setDurationDays(d)}
                    tripId={`SS-${destinationKey.slice(0, 3).toUpperCase()}-2026-PLAN`}
                    onTriggerDisruption={handleTriggerDisruption}
                    activeDisruption={activeDisruption}
                    onResetDisruption={handleResetDisruption}
                    onPreviewWhatsApp={() => setWhatsAppModalOpen(true)}
                    onApplyReplan={() => {
                      setActiveDisruption(null);
                      setWhatsAppModalOpen(false);
                    }}
                    onProceedToReview={() => setPlannerStep('review')}
                  />
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {plannerStep === 'review' && (
                <div className="space-y-4">
                  <Step5Review
                    origin={origin}
                    destinationName={destinationName}
                    datesText={datesText}
                    nights={calculatedNights}
                    guests={guestsCount}
                    transport={selectedTransport}
                    stay={selectedStay}
                    driver={selectedDriver}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={(val) => setPaymentMethod(val)}
                    onConfirmBooking={handleConfirmBooking}
                    onGoToStep={(s) => setPlannerStep(s)}
                  />
                </div>
              )}

              {/* STEP 6: CONFIRMATION PASS */}
              {plannerStep === 'confirmation' && (
                <div className="space-y-4">
                  <Step6Pass
                    booking={activeBookingForPass}
                    onOpenMyTrips={() => setMyTripsOpen(true)}
                    onViewTimeline={() => setPlannerStep('itinerary')}
                  />
                </div>
              )}

              {/* SPECIAL TAB: SAFARMITRA AI */}
              {plannerStep === 'ai-guide' && (
                <div className="space-y-4">
                  <SafarMitraTab
                    destinationKey={destinationKey}
                    destinationName={destinationName}
                    gems={currentPackage.hiddenGems}
                    eats={currentPackage.iconicEats}
                    selectedLanguage={selectedLanguage}
                    currentTripState={{
                      origin,
                      destinationName,
                      dates: datesText,
                      nights: calculatedNights,
                      transport: selectedTransport?.title,
                      stay: selectedStay?.name,
                      driver: selectedDriver?.name
                    }}
                  />
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: HOST & OPERATOR ZERO COMMISSION PORTAL              */}
        {/* ============================================================ */}
        {currentView === 'operator' && (
          <HostPortal
            currentStays={currentPackage.stays}
            onBackToApp={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 4: DRIVER & STORYTELLER PARTNER OPERATIONS PORTAL      */}
        {/* ============================================================ */}
        {currentView === 'partner' && (
          <PartnerPortal
            onExitPortal={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 5: CENTRALIZED OPERATIONS & DISPATCH CONTROL DESK      */}
        {/* ============================================================ */}
        {currentView === 'admin_ops' && (
          <AdminOperationsPortal
            onExit={() => setCurrentView('landing')}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 6: RENTALS & ROAD TRIP MOBILITY FLEET                   */}
        {/* ============================================================ */}
        {currentView === 'rentals' && (
          <RentalsPage
            initialCity={rentalPreselectedCity}
            initialCategory={rentalPreselectedCategory}
            onNavigateToPlanner={() => {
              setCurrentView('planner');
              setPlannerStep('transport');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 7: DEDICATED TELANGANA TOURISM TRAVEL ECOSYSTEM         */}
        {/* ============================================================ */}
        {currentView === 'telangana' && (
          <TelanganaModule
            onBackToSafarSetu={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBookingAdded={(booking) => {
              setBookings(prev => [booking, ...prev]);
            }}
          />
        )}

      </main>

      {/* Floating Tourist SOS Emergency Beacon */}
      <FloatingSOSBeacon onTriggerSOS={() => setSosModalOpen(true)} />

      {/* Global Footer */}
      <Footer
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMyTrips={() => setMyTripsOpen(true)}
        onTriggerSOS={() => setSosModalOpen(true)}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onScrollTo={scrollToSection}
      />

      {/* ============================================================ */}
      {/* INTERACTIVE MODALS                                           */}
      {/* ============================================================ */}

      {/* 1. State Tourism Dossier Modal (5 Detailed Tabs) */}
      <StateModal
        stateData={stateModalData}
        onClose={() => setStateModalData(null)}
        onPlanTripAroundState={handlePlanTripAroundState}
      />

      {/* 2. My Trips & Saved Drafts Drawer Modal */}
      <MyTripsModal
        isOpen={myTripsOpen}
        onClose={() => setMyTripsOpen(false)}
        bookings={bookings}
        savedDrafts={savedDrafts}
        onCancelBooking={handleCancelBooking}
        onLoadDraft={handleLoadDraft}
        onSelectBookingForPass={(b) => {
          setActiveBookingForPass(b);
          setCurrentView('planner');
          setPlannerStep('confirmation');
        }}
      />

      {/* 3. WhatsApp Autonomous Replan Notification Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        destinationName={destinationName}
        onConfirmReplan={() => setActiveDisruption(null)}
      />

      {/* 4. Tourist SOS Emergency Center Modal */}
      <SOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        destinationName={destinationName}
        emergencyPhone={currentPackage.safetyCorridors?.touristPoliceHelpline || "112 / +91 1800-425-4747"}
      />

      {/* 5. Authentication & Host Login Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(session) => {
          setUser(session);
          if (session.role === 'host') {
            setCurrentView('operator');
          }
        }}
        initialRole={authRole}
      />

    </div>
  );
}
