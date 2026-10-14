import React, { useState, useEffect } from 'react';
import {
  Car,
  ShieldCheck,
  Sparkles,
  MapPin,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Shield,
  FileText,
  RotateCcw,
  Zap,
  Users
} from 'lucide-react';
import {
  RentalVehicle,
  RentalCity,
  RentalBooking,
  RentalCategory,
  RentalMode
} from '../../types';
import { RentalCard } from './RentalCard';
import { RentalFilters } from './RentalFilters';
import { CityExplorationRow } from './CityExplorationRow';
import { RentalDetailModal } from './RentalDetailModal';
import { RentalBookingModal } from './RentalBookingModal';
import { MyRentalsView } from './MyRentalsView';

interface RentalsPageProps {
  initialCity?: string;
  initialCategory?: RentalCategory;
  onNavigateToPlanner?: () => void;
}

export const RentalsPage: React.FC<RentalsPageProps> = ({
  initialCity,
  initialCategory,
  onNavigateToPlanner
}) => {
  // Navigation Tabs: 'explore' | 'my_bookings'
  const [activeTab, setActiveTab] = useState<'explore' | 'my_bookings'>('explore');

  // Filter States
  const [cities, setCities] = useState<RentalCity[]>([]);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [bookings, setBookings] = useState<RentalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState<string>(initialCity || 'all');
  const [selectedCategory, setSelectedCategory] = useState<RentalCategory>(initialCategory || 'all');
  const [selectedMode, setSelectedMode] = useState<RentalMode | 'all'>('all');
  
  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysLaterStr = threeDaysLater.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(threeDaysLaterStr);
  const [searchQuery, setSearchQuery] = useState('');
  const [transmission, setTransmission] = useState('all');
  const [fuelType, setFuelType] = useState('all');
  const [seats, setSeats] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<RentalVehicle | null>(null);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<RentalVehicle | null>(null);
  const [bookingMode, setBookingMode] = useState<RentalMode>('self_drive');

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch cities
      const citiesRes = await fetch('/api/rentals/cities');
      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        setCities(citiesData.cities || []);
      }

      // 2. Fetch vehicles
      const vehiclesRes = await fetch('/api/rentals');
      if (vehiclesRes.ok) {
        const vData = await vehiclesRes.json();
        setVehicles(vData.vehicles || []);
      }

      // 3. Fetch current bookings
      const bookingsRes = await fetch('/api/rentals/bookings');
      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        setBookings(bData.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load rental data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter vehicles on client side based on inputs
  const filteredVehicles = vehicles.filter((v) => {
    // City
    if (selectedCity !== 'all') {
      if (v.cityKey.toLowerCase() !== selectedCity.toLowerCase() && !v.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
    }

    // Category
    if (selectedCategory !== 'all') {
      if (v.category !== selectedCategory) return false;
    }

    // Rental Mode
    if (selectedMode !== 'all') {
      if (!v.allowedModes.includes(selectedMode)) return false;
    }

    // Transmission
    if (transmission !== 'all') {
      if (v.transmission !== transmission) return false;
    }

    // Fuel
    if (fuelType !== 'all') {
      if (v.fuelType !== fuelType) return false;
    }

    // Seats
    if (seats !== 'all') {
      const minS = parseInt(seats, 10);
      if (minS === 2 && v.seats !== 2) return false;
      if (minS === 5 && (v.seats < 4 || v.seats > 5)) return false;
      if (minS === 7 && v.seats < 7) return false;
    }

    // Max Price
    if (v.pricePerDaySelfDrive > maxPrice) return false;

    // Verified
    if (verifiedOnly && !v.verified) return false;

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.features.some((f) => f.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSelectedCity('all');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSearchQuery('');
    setTransmission('all');
    setFuelType('all');
    setSeats('all');
    setMaxPrice(10000);
    setVerifiedOnly(false);
  };

  const handleOpenDetails = (vehicle: RentalVehicle) => {
    setSelectedVehicleForDetails(vehicle);
  };

  const handleOpenBooking = (vehicle: RentalVehicle, mode?: RentalMode) => {
    setSelectedVehicleForDetails(null);
    setSelectedVehicleForBooking(vehicle);
    setBookingMode(mode || (selectedMode !== 'all' ? selectedMode : 'self_drive'));
  };

  const handleBookingSuccess = (newBooking: RentalBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/rentals/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? data.booking : b))
        );
      }
    } catch (err) {
      console.error('Failed to cancel rental:', err);
    }
  };

  return (
    <div id="safarsetu-rentals-module" className="min-h-screen bg-[#faf8f5] text-slate-900 pb-20">
      {/* Top Banner / Hero Header */}
      <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 text-left relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>SafarSetu Verified Fleets & Chauffeurs</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Find the right ride for your journey
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Cars, 4x4 SUVs, touring bikes, scooters, and chauffeur-storyteller rides with <strong>0% middleman markup</strong> and verified commercial permits across India.
              </p>
            </div>

            {/* Tab switchers: Explore vs My Bookings */}
            <div className="flex items-center gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
              <button
                id="tab-explore-fleet"
                onClick={() => setActiveTab('explore')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'explore'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Explore Fleet</span>
              </button>

              <button
                id="tab-my-rentals"
                onClick={() => setActiveTab('my_bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
                  activeTab === 'my_bookings'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Bookings</span>
                {bookings.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Value Badges Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Commercial Yellow-Plate Fleets</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Zero Middleman Commission</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Free Cancellation (24h prior)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <span>24x7 Pan-India Roadside Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {activeTab === 'explore' ? (
          <>
            {/* Search & Filter Component */}
            <RentalFilters
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              pickupDate={pickupDate}
              onChangePickupDate={setPickupDate}
              returnDate={returnDate}
              onChangeReturnDate={setReturnDate}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
              transmission={transmission}
              onChangeTransmission={setTransmission}
              fuelType={fuelType}
              onChangeFuelType={setFuelType}
              seats={seats}
              onChangeSeats={setSeats}
              maxPrice={maxPrice}
              onChangeMaxPrice={setMaxPrice}
              verifiedOnly={verifiedOnly}
              onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredVehicles.length}
            />

            {/* Popular City Exploration Row */}
            <CityExplorationRow
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
            />

            {/* Vehicle Results Grid */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-slate-950">
                    Available Fleet
                  </h2>
                  <p className="text-xs text-slate-600">
                    Inspected for highway compliance, clean interiors, and sanitization before handover.
                  </p>
                </div>

                {onNavigateToPlanner && (
                  <button
                    onClick={onNavigateToPlanner}
                    className="text-xs font-bold text-orange-700 hover:text-orange-900 transition flex items-center gap-1"
                  >
                    <span>Need Full Trip Itinerary? Open Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {filteredVehicles.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-subtle-card space-y-4 max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">
                      No vehicles found matching your criteria
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Try expanding your budget, selecting "All India", or clearing selected filters.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVehicles.map((vehicle) => (
                    <RentalCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onViewDetails={handleOpenDetails}
                      onBookNow={(v) => handleOpenBooking(v)}
                      selectedMode={selectedMode !== 'all' ? selectedMode : 'self_drive'}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* My Rentals Tab */
          <MyRentalsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onExploreRentals={() => setActiveTab('explore')}
          />
        )}
      </div>

      {/* Vehicle Detail Modal */}
      {selectedVehicleForDetails && (
        <RentalDetailModal
          vehicle={selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onBookNow={(v, mode) => handleOpenBooking(v, mode)}
          initialMode={selectedMode !== 'all' ? selectedMode : 'self_drive'}
        />
      )}

      {/* Vehicle Booking Modal */}
      {selectedVehicleForBooking && (
        <RentalBookingModal
          vehicle={selectedVehicleForBooking}
          initialMode={bookingMode}
          initialPickupDate={pickupDate}
          initialReturnDate={returnDate}
          onClose={() => setSelectedVehicleForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};
