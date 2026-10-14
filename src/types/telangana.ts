export type TelanganaAttractionCategory = 
  | 'Heritage'
  | 'Forts'
  | 'Temples'
  | 'Museums'
  | 'Nature'
  | 'Lakes'
  | 'Waterfalls'
  | 'Adventure'
  | 'Culture'
  | 'Food'
  | 'Markets';

export type PassTicketStatus = 
  | 'INCLUDED'
  | 'BOOKED'
  | 'TICKET_REQUIRED'
  | 'TICKET_AVAILABLE'
  | 'NOT_ELIGIBLE'
  | 'EXTERNAL_TICKET';

export type PassUsageStatus = 
  | 'ACTIVE'
  | 'PARTIALLY_USED'
  | 'USED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'PARTIALLY_CONFIRMED';

export type TripStyleType = 'Budget' | 'Comfort' | 'Premium' | 'Luxury';
export type TravelerGroupType = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Senior' | 'International';

export interface TelanganaAttraction {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  category: TelanganaAttractionCategory;
  image: string;
  gallery?: string[];
  description: string;
  location: string;
  openingHours: {
    openTime: string; // "09:00"
    closeTime: string; // "17:30"
    openDisplay: string; // "9:00 AM - 5:30 PM"
    closedDays?: string[]; // e.g. ["Friday"]
  };
  recommendedDurationHours: number;
  entryFee: number;
  ticketStatus: PassTicketStatus;
  passEligible: boolean;
  officialTicketSource?: string;
  accessibilityInfo?: string;
  bestTimeToVisit: string;
  nearbyAttractionIds?: string[];
}

export interface TelanganaDestination {
  id: string;
  name: string;
  tagline: string;
  image: string;
  shortDescription: string;
  bestKnownFor: string[];
  recommendedDuration: string;
  startingBudgetPerDay: number;
  accessibilityRating: string;
  popularAttractionIds: string[];
  coordinates: { lat: number; lng: number };
}

export interface TelanganaTransportOption {
  id: string;
  from: string;
  to: string;
  mode: 'Train' | 'Bus' | 'Cab' | 'Rental' | 'Flight' | 'Self-Drive';
  providerName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  baseFare: number;
  taxes: number;
  serviceFee: number;
  totalFare: number;
  availabilityStatus: 'Available' | 'Limited' | 'Sold Out';
  categoryDetails: string;
}

export interface TelanganaLocalTransit {
  id: string;
  city: string;
  mode: 'Metro' | 'Prepaid Cab' | 'Auto Rickshaw' | 'Rental Scooter' | 'Chauffeur Van';
  averageFareDisplay: string;
  hourlyRate?: number;
  description: string;
  recommendedFor: string;
  icon: string;
}

export interface TelanganaStay {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  type: 'Hotel' | 'Resort' | 'Homestay' | 'Heritage Stay';
  tier: 'Budget' | 'Mid-range' | 'Luxury';
  image: string;
  gallery?: string[];
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  location: string;
  distanceFromKeyAttraction: string;
  amenities: string[];
  roomType: string;
  cancellationPolicy: string;
  checkIn: string;
  checkOut: string;
  verifiedPartner: boolean;
}

export interface TelanganaGuide {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  photo: string;
  languages: string[];
  specializations: string[];
  rating: number;
  reviewsCount: number;
  yearsExperience: number;
  bio: string;
  rates: {
    twoHour: number;
    halfDay: number;
    fullDay: number;
  };
  availabilityStatus: 'Available' | 'Busy';
  verifiedTourismDepartment: boolean;
}

export interface TelanganaRentalVehicle {
  id: string;
  name: string;
  category: 'Car' | 'SUV' | 'Bike' | 'Scooter' | 'Luxury';
  seats: number;
  transmission: 'Manual' | 'Automatic';
  fuelType: 'Petrol' | 'Diesel' | 'EV';
  image: string;
  pricePerDay: number;
  securityDeposit: number;
  kmPolicy: string;
  provider: string;
  rating: number;
  verifiedStatus: boolean;
  mode: 'Self-Drive' | 'Chauffeur-Driven';
}

export interface ItineraryActivity {
  id: string;
  attractionId?: string;
  title: string;
  time: string; // e.g. "10:00"
  durationHours: number;
  type: 'attraction' | 'meal' | 'transit' | 'rest' | 'custom';
  cost: number;
  ticketStatus?: PassTicketStatus;
  notes?: string;
  location?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  destinationId: string;
  destinationName: string;
  title: string;
  activities: ItineraryActivity[];
}

export interface ScheduleConflict {
  id: string;
  type: 'closing_hours' | 'travel_delay' | 'overlap' | 'budget_warning';
  title: string;
  message: string;
  severity: 'warning' | 'error';
  dayNumber: number;
  activityId?: string;
  suggestedAction?: string;
}

export interface TelanganaTravelPassData {
  passId: string; // "TS-728192"
  tripId: string; // "TS-TRIP-92831"
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  tripDates: string; // "14 Oct - 18 Oct, 2026"
  travelersCount: number;
  tripStyle: TripStyleType;
  travelerType: TravelerGroupType;
  destinations: string[];
  attractions: {
    attractionId: string;
    name: string;
    category: string;
    ticketStatus: PassTicketStatus;
    passEligible: boolean;
    visited: boolean;
    visitedTimestamp?: string;
    verifiedByStaff?: string;
    entryFee: number;
  }[];
  transport: {
    segments: {
      from: string;
      to: string;
      mode: string;
      pnr?: string;
      provider: string;
      fare: number;
    }[];
    localTransitSummary?: string;
  };
  stay: {
    stayId: string;
    name: string;
    destinationName: string;
    nights: number;
    roomType: string;
    bookingRef: string;
    totalCost: number;
  }[];
  guide?: {
    guideId: string;
    name: string;
    languages: string[];
    duration: string;
    bookingRef: string;
    fee: number;
  };
  rental?: {
    vehicleId: string;
    vehicleName: string;
    days: number;
    bookingRef: string;
    totalAmount: number;
  };
  totalBudget: {
    transportCost: number;
    staysCost: number;
    attractionsCost: number;
    guideCost: number;
    rentalCost: number;
    taxesAndService: number;
    grandTotal: number;
  };
  passStatus: PassUsageStatus;
  qrPayloadUrl: string;
  createdAt: string;
  emergencyContact: {
    touristPolice: string;
    telanganaTourismHelpline: string;
    sheTeams: string;
  };
}
