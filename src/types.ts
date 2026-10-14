export type RegionKey = 'all' | 'south' | 'north' | 'west' | 'east' | 'northeast' | 'central' | 'ut';

export interface WhenToVisitInfo {
  bestSeason: string;
  budgetAnalysis: {
    lowestPriceWindow: string;
    averageSavings: string;
    budgetTip: string;
  };
}

export interface DayItineraryItem {
  day: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface WhereToVisitItem {
  name: string;
  type: string;
  desc: string;
}

export interface CuisineAndCrafts {
  food: string[];
  crafts: string[];
}

export interface StateSafetyInfo {
  touristPoliceHelpline?: string;
  ambulance?: string;
  womanTravelerRating?: string;
  corridors?: string[];
}

export interface StateTourism {
  id: string;
  name: string;
  tagline: string;
  capital: string;
  region: RegionKey;
  image: string;
  badge: string;
  duration: string;
  description: string;
  isUT?: boolean;
  whenToVisit: WhenToVisitInfo & {
    shoulderSeason?: string;
    climateNote?: string;
    budgetAnalysis?: {
      lowestPriceWindow?: string;
      averageSavings?: string;
      budgetTip?: string;
      typicalCost?: string;
      safarSetuCost?: string;
      tip?: string;
    };
  };
  itinerary5Day: DayItineraryItem[];
  itinerary7Day: DayItineraryItem[];
  itinerary5Days?: DayItineraryItem[];
  itinerary7Days?: DayItineraryItem[];
  whereToVisit: WhereToVisitItem[];
  placesToVisit?: { name: string; tag?: string; desc: string; bestTime?: string }[];
  cuisineAndCrafts: CuisineAndCrafts;
  foodAndCrafts?: {
    food: { dish: string; desc: string }[];
    crafts: { item: string; origin: string }[];
  };
  safetyAndFeatures: string[];
  safety?: StateSafetyInfo;
}

export interface TransportOption {
  id: string;
  destinationKey: string;
  mode: 'Flight' | 'Train' | 'Bus' | 'Cab';
  title: string;
  operator: string;
  duration: string;
  departure: string;
  arrival: string;
  price: number;
  reliabilityScore: number;
  reliabilityBadge: string;
  carbon: string;
  recommended: boolean;
}

export interface StayOption {
  id: string;
  destinationKey: string;
  name: string;
  tier: 'homestay' | 'budget' | 'heritage';
  category: string;
  hostName: string;
  location: string;
  rating: string;
  reviews: number;
  price: number;
  image: string;
  features: string[];
  isAvailable?: boolean;
}

export interface DriverOption {
  id: string;
  destinationKey: string;
  name: string;
  role: string;
  vehicle: string;
  vehicleType: string;
  rating: string;
  reviews: number;
  fixedFullTripPrice: number;
  languages: string[];
  specialties: string;
  storytellerBio: string;
  stories: string[];
  safetyFeatures: string[];
}

export interface LocalTransitOption {
  mode: string;
  fare: string;
  time: string;
  route: string;
  safetyBadge: string;
  tip: string;
}

export interface CuratedSpot {
  title: string;
  tag: string;
  desc: string;
}

export interface TimelineEvent {
  time: string;
  title: string;
  desc: string;
  status: string;
  cost?: number;
}

export interface TimelineDayGroup {
  day: string;
  date: string;
  events: TimelineEvent[];
}

export interface DestinationPlannerPackage {
  destinationKey: string;
  name: string;
  tripId: string;
  pnr: string;
  transports: TransportOption[];
  stays: StayOption[];
  drivers: DriverOption[];
  localTransit: LocalTransitOption[];
  gems: CuratedSpot[];
  eats: CuratedSpot[];
  timeline5Day: TimelineDayGroup[];
  timeline7Day: TimelineDayGroup[];
}

export interface TripBookingState {
  tripId: string;
  pnr: string;
  origin: string;
  destination: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  calculatedNights: number;
  travelersCount: number;
  durationDays: 5 | 7;
  persona: string;
  transport: TransportOption | null;
  stay: StayOption | null;
  driver: DriverOption | null;
  totalCost: number;
  bookingStatus: 'draft' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod: string;
  createdAt: string;
}

export type PartnerRole = 'DRIVER' | 'LOCAL_STORYTELLER' | 'DRIVER_STORYTELLER' | 'PARTNER_ADMIN' | 'FLEET_MANAGER';
export type PartnerCapability = 'DRIVER_ONLY' | 'STORYTELLER_ONLY' | 'DRIVER_AND_STORYTELLER';
export type PartnerVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED' | 'EXPIRED';
export type PartnerAvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'ON_TRIP' | 'OFF_DUTY';

export interface UserSession {
  id?: string;
  name: string;
  phone: string;
  role: 'traveler' | 'host' | 'partner' | 'admin';
  partnerRole?: PartnerRole;
  partnerId?: string;
}

export type AssignmentStatus =
  | 'OFFERED'
  | 'ACCEPTED'
  | 'READY'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'PICKED_UP'
  | 'IN_PROGRESS'
  | 'DROPPED_OFF'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'INCIDENT';

export interface OperationalStop {
  id: string;
  stopNumber: number;
  time: string;
  location: string;
  coordinates: { lat: number; lng: number };
  expectedDeparture: string;
  driverAction: string;
  storytellerAction: string;
  travelerAction: string;
  specialInstruction?: string;
  completed: boolean;
  completedAt?: string;
  storyNotes?: {
    narrative: string;
    culturalHighlights: string[];
    localEatsTip: string;
    etiquette: string;
  };
}

export interface PartnerAssignment {
  id: string;
  tripId: string;
  bookingId: string;
  pnr: string;
  partnerId: string;
  partnerName: string;
  assignedRole: PartnerRole;
  travelerName: string;
  travelerPhone: string; // masked in UI
  guestsCount: number;
  luggageCount: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  pickupGate: string;
  pickupCoordinates: { lat: number; lng: number };
  dropDate: string;
  dropTime: string;
  dropLocation: string;
  dropCoordinates: { lat: number; lng: number };
  destinationName: string;
  destinationKey: string;
  serviceType: 'Airport Pickup & Chauffeur' | 'Storyteller Escort' | 'Full Day Chauffeur & Storyteller';
  status: AssignmentStatus;
  statusTimeline: { status: AssignmentStatus; timestamp: string; note?: string }[];
  estimatedDistanceKm: number;
  estimatedDurationHours: number;
  etaMinutes?: number;
  currentStopIndex: number;
  stops: OperationalStop[];
  travelerPreferences: {
    travelStyle: string;
    interests: string[];
    languagePreference: string;
    specialRequirements: string[];
    dietary: string;
  };
  safarSetuInstructions: {
    version: string;
    updatedAt: string;
    items: string[];
    acknowledgedByPartner: boolean;
  };
  earnings: {
    baseFare: number;
    distanceComponent: number;
    waitingAllowance: number;
    storytellerFee: number;
    bonus: number;
    totalPayable: number;
    payoutStatus: 'PENDING' | 'PROCESSING' | 'PAID';
  };
  delayReport?: {
    reportedAt: string;
    reason: string;
    delayMinutes: number;
    message: string;
    acknowledgedByOps: boolean;
  };
  emergencyReport?: {
    reportedAt: string;
    type: string;
    description: string;
    status: 'ACTIVE' | 'RESOLVED';
  };
  activeDisruptionAlert?: {
    title: string;
    originalStop: string;
    replannedStop: string;
    reason: string;
    acknowledged: boolean;
  };
  preTripChecklistCompleted: boolean;
  postTripChecklistCompleted: boolean;
  chatMessages: PartnerChatMessage[];
}

export interface PartnerChatMessage {
  id: string;
  senderRole: 'traveler' | 'driver' | 'storyteller' | 'support' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  delivered: boolean;
  read: boolean;
}

export interface PartnerDocument {
  id: string;
  type: 'DRIVING_LICENSE' | 'VEHICLE_RC' | 'COMMERCIAL_INSURANCE' | 'AADHAAR_DIGILOCKER' | 'POLICE_VERIFICATION' | 'TOURISM_PERMIT';
  title: string;
  documentNumber: string;
  validUntil: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRING_SOON' | 'EXPIRED' | 'REJECTED';
  issuer: string;
  uploadedAt: string;
}

export interface PartnerProfileData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: PartnerRole;
  capability: PartnerCapability;
  avatarUrl: string;
  rating: number;
  ratingsBreakdown: {
    professionalism: number;
    punctuality: number;
    cleanliness: number;
    localKnowledge: number;
    communication: number;
  };
  totalTrips: number;
  completedTrips: number;
  cancellationRate: string;
  onTimeRate: string;
  verificationStatus: PartnerVerificationStatus;
  languages: string[];
  yearsExperience: number;
  serviceAreas: string[];
  specialties: string[];
  bio: string;
  vehicle?: {
    type: string;
    model: string;
    registrationNumber: string;
    capacity: number;
    isAC: boolean;
    luggageBagsCapacity: number;
    permitType: string;
    insuranceValid: boolean;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bankAccount: {
    bankName: string;
    maskedAccountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  availabilityStatus: PartnerAvailabilityStatus;
}

export interface PartnerPayoutRecord {
  id: string;
  payoutDate: string;
  amount: number;
  referenceNumber: string;
  status: 'PAID' | 'PROCESSING' | 'PENDING';
  period: string;
  tripIds: string[];
}

export interface PartnerSupportTicket {
  id: string;
  partnerId: string;
  category: 'Trip Problem' | 'Traveler Problem' | 'Vehicle Problem' | 'Payment Problem' | 'Safety Problem' | 'Technical';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  assignmentId?: string;
  details: string;
}

export interface BookingRecord {
  id: string;
  destinationKey: string;
  destinationName: string;
  origin: string;
  dates: string;
  nights: number;
  guests: number;
  transport: string;
  stay: string;
  driver: string;
  totalCost: string;
  numericTotal?: number;
  status: 'Confirmed' | 'Cancelled';
  paymentMethod: string;
  pnr: string;
  timestamp: string;
}

export interface SavedDraft {
  id: string;
  origin: string;
  destinationKey: string;
  destinationName: string;
  dates: string;
  nights: number;
  persona: string;
  durationDays: 5 | 7;
  transportId?: string;
  stayId?: string;
  driverId?: string;
  updatedAt: string;
}

export interface SavedTripDraft {
  id: string;
  name: string;
  dates: string;
  destination: string;
  duration: string;
  estimatedCost: string;
  status: 'Draft';
  stay: string;
}

// ==========================================
// RENTALS DOMAIN TYPES (CARS, SUVS, BIKES)
// ==========================================
export type RentalCategory = 'all' | 'car' | 'suv' | 'bike_scooter' | 'ev_luxury' | 'tempo_group';

export type RentalMode = 'self_drive' | 'with_driver' | 'driver_storyteller';

export type VehicleTransmission = 'manual' | 'automatic';

export type VehicleFuelType = 'petrol' | 'diesel' | 'ev' | 'hybrid';

export type VehicleStatus = 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE' | 'MAINTENANCE' | 'BLOCKED';

export type RentalBookingStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'FAILED';

export interface RentalVehicle {
  id: string;
  name: string;
  category: RentalCategory;
  brand: string;
  modelYear: number;
  city: string;
  cityKey: string;
  pickupHubs: string[];
  images: string[];
  seats: number;
  doors: number;
  bootSpaceBags: number;
  transmission: VehicleTransmission;
  fuelType: VehicleFuelType;
  mileageOrRange: string;
  ac: boolean;
  airbags: number;
  allowedModes: RentalMode[];
  pricePerDaySelfDrive: number;
  pricePerDayChauffeur: number;
  pricePerDayStoryteller: number;
  securityDeposit: number;
  kmPolicy: string;
  fuelPolicy: string;
  minAge: number;
  licenseRequirement: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  reviewsCount: number;
  verified: boolean;
  verificationBadgeText: string;
  status: VehicleStatus;
  features: string[];
  interstatePermitsIncluded: boolean;
}

export interface RentalCity {
  key: string;
  name: string;
  state: string;
  tagline: string;
  image: string;
  popularCategories: { name: string; startingPrice: number }[];
  popularPickups: string[];
  startingPrice: number;
  activeVehiclesCount: number;
}

export interface RentalBookingPricing {
  baseRental: number;
  driverAllowance: number;
  storytellerFee: number;
  deliveryFee: number;
  taxes: number;
  refundableDeposit: number;
  totalAmount: number;
}

export interface RentalBooking {
  id: string;
  pnr: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleCategory: RentalCategory;
  rentalMode: RentalMode;
  city: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  days: number;
  travelerName: string;
  travelerPhone: string;
  travelerEmail: string;
  licenseNumber: string;
  pricingBreakdown: RentalBookingPricing;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  bookingStatus: RentalBookingStatus;
  chauffeurPartnerId?: string;
  chauffeurName?: string;
  createdAt: string;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
export type ReviewSource = 'demo' | 'user_submission' | 'booking_verified';
export type ReviewTripType = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Corporate' | 'International' | 'Domestic';

export interface CustomerReview {
  id: string;
  userId?: string;
  bookingId?: string;
  rating: number; // 3.5, 4, 4.5, 5
  title: string;
  comment: string;
  authorName: string;
  location: string;
  tripDestination: string;
  tripType?: ReviewTripType;
  date: string; // e.g. "2026-08-20" or relative date like "2 days ago"
  displayRelativeTime?: string;
  verified: boolean;
  verificationBadgeText?: string;
  source: ReviewSource;
  status: ReviewStatus;
  helpfulCount: number;
  reportCount?: number;
  responseFromSafarSetu?: string;
  createdAt: string;
}

export interface ReviewRatingStats {
  averageRating: number;
  totalReviews: number;
  fiveStarsCount: number;
  fiveStarsPct: number;
  fourAndHalfCount: number;
  fourStarsCount: number;
  fourStarsPct: number;
  threeAndHalfCount: number;
  threeStarsCount: number;
  threeStarsPct: number;
  twoStarsCount: number;
  twoStarsPct: number;
  oneStarCount: number;
  oneStarPct: number;
  destinations: string[];
}

