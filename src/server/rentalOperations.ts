import { Request, Response, Express } from 'express';
import {
  RentalVehicle,
  RentalCity,
  RentalBooking,
  RentalCategory,
  RentalMode,
  VehicleStatus
} from '../types';

// =========================================================================
// 1. INVENTORY REPOSITORIES (CITIES, VEHICLES, BOOKINGS)
// =========================================================================

export const rentalCitiesStore: RentalCity[] = [
  {
    key: 'goa',
    name: 'Goa',
    state: 'Goa',
    tagline: 'Coastal Highways & Sun-Drenched Palm Boulevards',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Scooters & Bikes', startingPrice: 499 },
      { name: 'Open 4x4 SUVs', startingPrice: 3499 },
      { name: 'Hatchbacks & Sedans', startingPrice: 1599 }
    ],
    popularPickups: ['Dabolim Airport (GOI)', 'Mopa Airport (GOX)', 'Madgaon Railway Station', 'Panjim City Hub', 'North Goa Calangute Delivery'],
    startingPrice: 499,
    activeVehiclesCount: 8
  },
  {
    key: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Outer Ring Road, Historic Golconda & Ramappa Heritage Trails',
    image: 'https://images.unsplash.com/photo-1605307049929-37f2a1b9bcfe?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'SUVs & MUVs', startingPrice: 2899 },
      { name: 'Premium EVs', startingPrice: 2499 },
      { name: 'Chauffeur Storytellers', startingPrice: 3200 }
    ],
    popularPickups: ['RGIA Shamshabad Airport', 'Secunderabad Junction', 'Hitec City Metro Hub', 'Gachibowli Hotel Delivery'],
    startingPrice: 1499,
    activeVehiclesCount: 7
  },
  {
    key: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'Royal Forts, Desert Corridors & Shekhawati Haveli Circuits',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Royal Sedans', startingPrice: 1899 },
      { name: '7-Seater Royal Chauffeur', startingPrice: 3499 },
      { name: 'Desert Safari 4x4', startingPrice: 3999 }
    ],
    popularPickups: ['Jaipur International Airport (JAI)', 'Jaipur Junction', 'MI Road Central Hub', 'Amer Heritage Hub'],
    startingPrice: 1699,
    activeVehiclesCount: 6
  },
  {
    key: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Western Ghats Getaways, Mysuru Expressways & Coorg Coffee Trails',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Electric SUVs', startingPrice: 2699 },
      { name: 'Touring Motorcycles', startingPrice: 1299 },
      { name: 'Compact Automatics', startingPrice: 1499 }
    ],
    popularPickups: ['Kempegowda Airport (BLR)', 'Indiranagar Hub', 'Electronic City Hub', 'Whitefield Delivery'],
    startingPrice: 1299,
    activeVehiclesCount: 7
  },
  {
    key: 'kochi',
    name: 'Kochi (Kerala)',
    state: 'Kerala',
    tagline: 'Munnar Tea Curves, Spice Sanctuaries & Coastal Alleppey Drives',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Green EV Sedans', startingPrice: 2199 },
      { name: 'Hill-Climb SUVs', startingPrice: 3199 },
      { name: 'Storyteller Chauffeur Vans', startingPrice: 4200 }
    ],
    popularPickups: ['Cochin International Airport (COK)', 'Ernakulam Junction', 'Fort Kochi Heritage Hub', 'Munnar Valley Drop'],
    startingPrice: 1599,
    activeVehiclesCount: 6
  },
  {
    key: 'leh',
    name: 'Leh (Ladakh)',
    state: 'Ladakh',
    tagline: 'Khardung La High Passes, Pangong Tso & Nubra Dunes',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Himalayan 450 Motorcycles', startingPrice: 1899 },
      { name: '4x4 Expedition SUVs', startingPrice: 4999 },
      { name: 'Oxygen-Equipped Innova', startingPrice: 4499 }
    ],
    popularPickups: ['Kushok Bakula Rimpochee Airport (IXL)', 'Leh Main Bazaar Hub', 'Choglamsar Tourist Desk'],
    startingPrice: 1899,
    activeVehiclesCount: 5
  },
  {
    key: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    tagline: 'Yamuna Expressway to Taj Mahal, Golden Triangle & Hills Gateway',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'Luxury Sedans', startingPrice: 2499 },
      { name: '7-Seater Express SUVs', startingPrice: 3299 },
      { name: 'Electric Cabs', startingPrice: 1999 }
    ],
    popularPickups: ['IGI Airport Terminal 3', 'Aerocity Hub', 'New Delhi Railway Station', 'Noida Expressway Hub'],
    startingPrice: 1599,
    activeVehiclesCount: 6
  },
  {
    key: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    tagline: 'Atal Tunnel, Solang Alpine Routes & Rohtang Pass Expeditions',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
    popularCategories: [
      { name: 'All-Terrain 4x4', startingPrice: 3799 },
      { name: 'Touring Bikes (Bullet / Himalayan)', startingPrice: 1499 },
      { name: 'Snow-Chain Equipped SUVs', startingPrice: 3999 }
    ],
    popularPickups: ['Mall Road Hub', 'Old Manali Delivery', 'Kullu Bhuntar Airport (KUU)'],
    startingPrice: 1499,
    activeVehiclesCount: 5
  }
];

export const rentalVehiclesStore: RentalVehicle[] = [
  // GOA
  {
    id: 'V-GOA-01',
    name: 'Mahindra Thar 4x4 Hard Top',
    category: 'suv',
    brand: 'Mahindra',
    modelYear: 2024,
    city: 'Goa',
    cityKey: 'goa',
    pickupHubs: ['Dabolim Airport (GOI)', 'Mopa Airport (GOX)', 'Panjim Hub', 'Hotel Delivery'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 4,
    doors: 3,
    bootSpaceBags: 2,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '13.5 km/l',
    ac: true,
    airbags: 2,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 3499,
    pricePerDayChauffeur: 4299,
    pricePerDayStoryteller: 4899,
    securityDeposit: 5000,
    kmPolicy: 'Unlimited Kilometers',
    fuelPolicy: 'Same-to-Same tank policy',
    minAge: 21,
    licenseRequirement: 'Valid 4-Wheeler Indian DL (Min 1 yr) or IDP for foreign nationals',
    providerId: 'PROV-GOA-COASTAL',
    providerName: 'Goa Coastal Wheels (Govt Registered Operator)',
    providerRating: 4.88,
    reviewsCount: 142,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet • All-Goa Commercial Permit',
    status: 'AVAILABLE',
    features: ['Fastag Installed', 'Bluetooth Apple CarPlay / Android Auto', 'Hill Descent Control', '4x4 Shift-on-Fly', '24x7 Roadside Assistance'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-GOA-02',
    name: 'Royal Enfield Classic 350 (Dark Stealth)',
    category: 'bike_scooter',
    brand: 'Royal Enfield',
    modelYear: 2024,
    city: 'Goa',
    cityKey: 'goa',
    pickupHubs: ['Mopa Airport (GOX)', 'Dabolim Airport (GOI)', 'Calangute Delivery', 'Madgaon Station'],
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 2,
    doors: 0,
    bootSpaceBags: 1,
    transmission: 'manual',
    fuelType: 'petrol',
    mileageOrRange: '36 km/l',
    ac: false,
    airbags: 0,
    allowedModes: ['self_drive'],
    pricePerDaySelfDrive: 899,
    pricePerDayChauffeur: 0,
    pricePerDayStoryteller: 0,
    securityDeposit: 2000,
    kmPolicy: 'Unlimited Kilometers',
    fuelPolicy: 'Full-to-Full or Same-to-Same',
    minAge: 20,
    licenseRequirement: 'Valid 2-Wheeler Indian DL (with gear) or International Permit',
    providerId: 'PROV-GOA-BIKES',
    providerName: 'Mandovi Moto Rentals (Yellow Plate Certified)',
    providerRating: 4.92,
    reviewsCount: 208,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified 2-Wheeler • Two Helmets Included',
    status: 'AVAILABLE',
    features: ['2 DOT-Certified Helmets', 'Mobile Mount with Fast USB Charger', 'Luggage Carrier Rack', 'Comprehensive Theft & Accident Insurance'],
    interstatePermitsIncluded: false
  },
  {
    id: 'V-GOA-03',
    name: 'Honda Activa 6G Premium',
    category: 'bike_scooter',
    brand: 'Honda',
    modelYear: 2024,
    city: 'Goa',
    cityKey: 'goa',
    pickupHubs: ['Calangute', 'Anjuna', 'Panjim Ferry Point', 'Dabolim Airport'],
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 2,
    doors: 0,
    bootSpaceBags: 1,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '48 km/l',
    ac: false,
    airbags: 0,
    allowedModes: ['self_drive'],
    pricePerDaySelfDrive: 499,
    pricePerDayChauffeur: 0,
    pricePerDayStoryteller: 0,
    securityDeposit: 1000,
    kmPolicy: 'Unlimited Kilometers',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 18,
    licenseRequirement: 'Valid 2-Wheeler DL',
    providerId: 'PROV-GOA-BIKES',
    providerName: 'Mandovi Moto Rentals',
    providerRating: 4.85,
    reviewsCount: 310,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • 2 Helmets Included',
    status: 'AVAILABLE',
    features: ['2 ISI Helmets', 'Large Underseat Boot', 'Combi-Brake Safety System', 'Mobile Phone Holder'],
    interstatePermitsIncluded: false
  },
  {
    id: 'V-GOA-04',
    name: 'Maruti Suzuki Baleno Alpha AT',
    category: 'car',
    brand: 'Maruti Suzuki',
    modelYear: 2024,
    city: 'Goa',
    cityKey: 'goa',
    pickupHubs: ['Mopa Airport (GOX)', 'Dabolim Airport (GOI)', 'Panjim Hub'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '22.3 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 1899,
    pricePerDayChauffeur: 2699,
    pricePerDayStoryteller: 3199,
    securityDeposit: 3000,
    kmPolicy: '300 km/day (₹8/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid 4-Wheeler LMV License',
    providerId: 'PROV-GOA-COASTAL',
    providerName: 'Goa Coastal Wheels',
    providerRating: 4.79,
    reviewsCount: 88,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet',
    status: 'AVAILABLE',
    features: ['360 View Camera', 'Head Up Display', 'Fastag', 'Apple CarPlay & Android Auto', 'Chilled Glovebox'],
    interstatePermitsIncluded: true
  },

  // HYDERABAD
  {
    id: 'V-HYD-01',
    name: 'Toyota Innova Crysta 2.4 ZX',
    category: 'suv',
    brand: 'Toyota',
    modelYear: 2024,
    city: 'Hyderabad',
    cityKey: 'hyderabad',
    pickupHubs: ['RGIA Shamshabad Airport', 'Secunderabad Junction', 'Hitec City Delivery', 'Gachibowli Hub'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 7,
    doors: 4,
    bootSpaceBags: 4,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '14.8 km/l',
    ac: true,
    airbags: 7,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 3499,
    pricePerDayChauffeur: 4299,
    pricePerDayStoryteller: 4999,
    securityDeposit: 6000,
    kmPolicy: 'Unlimited Kilometers for Trips >= 3 Days',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 22,
    licenseRequirement: 'Valid Indian LMV Driving License (Min 1.5 yrs) + ID',
    providerId: 'PROV-HYD-ROYAL',
    providerName: 'Nizam Heritage Mobility & Chauffeurs',
    providerRating: 4.95,
    reviewsCount: 312,
    verified: true,
    verificationBadgeText: 'SafarSetu Certified Premium Partner • Police Cleared Chauffeurs',
    status: 'AVAILABLE',
    features: ['Leather Captain Seats', 'Dual Zone Climate Control', 'Rear AC Vents', 'Fastag Pre-loaded', 'Emergency SOS Pager', 'First Aid & O2 Kit'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-HYD-02',
    name: 'Tata Nexon EV Max (Empowered Edition)',
    category: 'ev_luxury',
    brand: 'Tata Motors',
    modelYear: 2024,
    city: 'Hyderabad',
    cityKey: 'hyderabad',
    pickupHubs: ['RGIA Shamshabad Airport', 'Hitec City Metro Station', 'Banjara Hills Hub'],
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'ev',
    mileageOrRange: '437 km Certified Range (Fast DC Charge 10-80% in 45m)',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 2499,
    pricePerDayChauffeur: 3299,
    pricePerDayStoryteller: 3899,
    securityDeposit: 4000,
    kmPolicy: 'Unlimited Kilometers with Free Charging at 50+ Partner Hubs',
    fuelPolicy: 'Delivered at 90%+ charge; return with 20%+',
    minAge: 21,
    licenseRequirement: 'Valid LMV DL',
    providerId: 'PROV-HYD-EV',
    providerName: 'GreenSetu Eco Fleet Hyderabad',
    providerRating: 4.91,
    reviewsCount: 164,
    verified: true,
    verificationBadgeText: 'SafarSetu Eco-Certified 100% Electric Fleet',
    status: 'AVAILABLE',
    features: ['Free Tata Power RFID Charging Card', 'Sunroof', 'Air Purifier AQI Display', 'Ventilated Front Seats', 'Harman 8-Speaker Audio'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-HYD-03',
    name: 'Hyundai Creta SX (O) Turbo',
    category: 'suv',
    brand: 'Hyundai',
    modelYear: 2024,
    city: 'Hyderabad',
    cityKey: 'hyderabad',
    pickupHubs: ['RGIA Airport Hub', 'Jubilee Hills Hub', 'Kukatpally'],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '17.4 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 2699,
    pricePerDayChauffeur: 3399,
    pricePerDayStoryteller: 3999,
    securityDeposit: 4000,
    kmPolicy: '350 km/day (₹9/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid 4-Wheeler DL',
    providerId: 'PROV-HYD-ROYAL',
    providerName: 'Nizam Heritage Mobility',
    providerRating: 4.87,
    reviewsCount: 92,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet',
    status: 'AVAILABLE',
    features: ['Panoramic Sunroof', 'Bose Premium Sound', 'Level 2 ADAS Safety', 'Fastag Installed'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-HYD-04',
    name: 'Force Urbania Luxury Tourist Van (12 Seater)',
    category: 'tempo_group',
    brand: 'Force Motors',
    modelYear: 2024,
    city: 'Hyderabad',
    cityKey: 'hyderabad',
    pickupHubs: ['RGIA Shamshabad Airport', 'Secunderabad', 'Doorstep Hotel Pickup'],
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 12,
    doors: 3,
    bootSpaceBags: 10,
    transmission: 'manual',
    fuelType: 'diesel',
    mileageOrRange: '11.5 km/l',
    ac: true,
    airbags: 4,
    allowedModes: ['with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 0,
    pricePerDayChauffeur: 6499,
    pricePerDayStoryteller: 7499,
    securityDeposit: 0,
    kmPolicy: '300 km/day included (₹18/km beyond)',
    fuelPolicy: 'Included or Actuals on Trip Type',
    minAge: 25,
    licenseRequirement: 'Chauffeur Driven Only (Commercial Passenger Badge)',
    providerId: 'PROV-HYD-ROYAL',
    providerName: 'Nizam Heritage Mobility & Chauffeurs',
    providerRating: 4.96,
    reviewsCount: 78,
    verified: true,
    verificationBadgeText: 'SafarSetu Certified Group Carrier • All-India Tourist Permit',
    status: 'AVAILABLE',
    features: ['Reclining Business Class Seats', 'Individual AC Vents & USB Ports', 'PA Microphone for Storyteller Guide', 'Luggage Compartment Rack', 'Large Panoramic Windows'],
    interstatePermitsIncluded: true
  },

  // JAIPUR (RAJASTHAN)
  {
    id: 'V-JAI-01',
    name: 'Mahindra Scorpio-N Z8 L 4x4',
    category: 'suv',
    brand: 'Mahindra',
    modelYear: 2024,
    city: 'Jaipur',
    cityKey: 'jaipur',
    pickupHubs: ['Jaipur International Airport (JAI)', 'Jaipur Railway Station', 'MI Road Central Hub', 'Amer Road Hotel Delivery'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 7,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '14.2 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 3699,
    pricePerDayChauffeur: 4499,
    pricePerDayStoryteller: 5199,
    securityDeposit: 5000,
    kmPolicy: 'Unlimited Kilometers across Rajasthan Circuit',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid Indian LMV License',
    providerId: 'PROV-JAI-DESERT',
    providerName: 'Rajputana Royal Wheels (Rajasthan Tourism Approved)',
    providerRating: 4.94,
    reviewsCount: 184,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • RTDC Certified Partner',
    status: 'AVAILABLE',
    features: ['Sony 12-Speaker Immersive Audio', '4XPLOR Desert Terrain Modes', 'Sunroof', 'Wireless Charging', 'Dual Front & Rear Camera'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-JAI-02',
    name: 'Maruti Suzuki Dzire VXi',
    category: 'car',
    brand: 'Maruti Suzuki',
    modelYear: 2024,
    city: 'Jaipur',
    cityKey: 'jaipur',
    pickupHubs: ['Jaipur Airport', 'Jaipur Station', 'Sindhi Camp'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'manual',
    fuelType: 'petrol',
    mileageOrRange: '23.5 km/l',
    ac: true,
    airbags: 2,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 1599,
    pricePerDayChauffeur: 2299,
    pricePerDayStoryteller: 2899,
    securityDeposit: 2500,
    kmPolicy: '300 km/day (₹7/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 20,
    licenseRequirement: 'Valid 4-Wheeler License',
    providerId: 'PROV-JAI-DESERT',
    providerName: 'Rajputana Royal Wheels',
    providerRating: 4.78,
    reviewsCount: 140,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet',
    status: 'AVAILABLE',
    features: ['Rear AC Vents', 'Bluetooth Stereo', 'Fastag Pre-installed', 'Exceptional Fuel Economy'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-JAI-03',
    name: 'Royal Enfield Bullet 350 (Military Black)',
    category: 'bike_scooter',
    brand: 'Royal Enfield',
    modelYear: 2024,
    city: 'Jaipur',
    cityKey: 'jaipur',
    pickupHubs: ['MI Road Hub', 'C-Scheme', 'Jaipur Airport'],
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 2,
    doors: 0,
    bootSpaceBags: 1,
    transmission: 'manual',
    fuelType: 'petrol',
    mileageOrRange: '37 km/l',
    ac: false,
    airbags: 0,
    allowedModes: ['self_drive'],
    pricePerDaySelfDrive: 999,
    pricePerDayChauffeur: 0,
    pricePerDayStoryteller: 0,
    securityDeposit: 2000,
    kmPolicy: 'Unlimited Kilometers',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 20,
    licenseRequirement: 'Valid 2-Wheeler DL',
    providerId: 'PROV-JAI-DESERT',
    providerName: 'Rajputana Royal Wheels',
    providerRating: 4.88,
    reviewsCount: 95,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • 2 Helmets Included',
    status: 'AVAILABLE',
    features: ['2 ISI Helmets', 'Pannier Saddle Bags', 'Phone Mount with USB Charger'],
    interstatePermitsIncluded: false
  },

  // KOCHI & KERALA
  {
    id: 'V-KOC-01',
    name: 'Tata Safari Dark Edition (7 Seater)',
    category: 'suv',
    brand: 'Tata Motors',
    modelYear: 2024,
    city: 'Kochi (Kerala)',
    cityKey: 'kochi',
    pickupHubs: ['Cochin International Airport (COK)', 'Ernakulam Town Station', 'Fort Kochi Hub', 'Munnar Drop Option'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 7,
    doors: 4,
    bootSpaceBags: 4,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '14.5 km/l',
    ac: true,
    airbags: 7,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 3799,
    pricePerDayChauffeur: 4599,
    pricePerDayStoryteller: 5299,
    securityDeposit: 5000,
    kmPolicy: 'Unlimited Kilometers across Kerala Western Ghats',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 22,
    licenseRequirement: 'Valid LMV License',
    providerId: 'PROV-KOC-SPICE',
    providerName: 'Malabar Heritage Chauffeurs & Rentals',
    providerRating: 4.96,
    reviewsCount: 220,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • Kerala Tourism Accredited',
    status: 'AVAILABLE',
    features: ['Panoramic Sunroof with Mood Lighting', 'JBL 10-Speaker Audio', 'Ventilated 1st & 2nd Row Seats', 'Hill Hold & Descend Control'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-KOC-02',
    name: 'Hyundai i20 Asta IVT',
    category: 'car',
    brand: 'Hyundai',
    modelYear: 2024,
    city: 'Kochi (Kerala)',
    cityKey: 'kochi',
    pickupHubs: ['Cochin Airport', 'Fort Kochi', 'Alleppey Boat Jetty Delivery'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 2,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '19.6 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 1799,
    pricePerDayChauffeur: 2499,
    pricePerDayStoryteller: 3099,
    securityDeposit: 3000,
    kmPolicy: '300 km/day (₹8/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid LMV License',
    providerId: 'PROV-KOC-SPICE',
    providerName: 'Malabar Heritage Chauffeurs & Rentals',
    providerRating: 4.82,
    reviewsCount: 114,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet',
    status: 'AVAILABLE',
    features: ['Smooth CVT Automatic', 'Bose Sound System', 'Rear Parking Camera', 'Fastag'],
    interstatePermitsIncluded: true
  },

  // LEH & LADAKH
  {
    id: 'V-LEH-01',
    name: 'Royal Enfield Himalayan 450 (Kamet White)',
    category: 'bike_scooter',
    brand: 'Royal Enfield',
    modelYear: 2024,
    city: 'Leh (Ladakh)',
    cityKey: 'leh',
    pickupHubs: ['Kushok Bakula Rimpochee Airport (IXL)', 'Leh Main Market Hub', 'Choglamsar Hub'],
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 2,
    doors: 0,
    bootSpaceBags: 2,
    transmission: 'manual',
    fuelType: 'petrol',
    mileageOrRange: '30 km/l (Altitude Tuned Sherpa 450 Engine)',
    ac: false,
    airbags: 0,
    allowedModes: ['self_drive'],
    pricePerDaySelfDrive: 1899,
    pricePerDayChauffeur: 0,
    pricePerDayStoryteller: 0,
    securityDeposit: 5000,
    kmPolicy: 'Unlimited Kilometers across Leh-Ladakh & Zanskar',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid Motorcycle DL + Leh Taxi Union Self-Drive Permit (Included)',
    providerId: 'PROV-LEH-HIMALAYAN',
    providerName: 'Himalayan High Pass Expeditions (Leh Bike Union Member)',
    providerRating: 4.97,
    reviewsCount: 380,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • High-Altitude Expedition Ready',
    status: 'AVAILABLE',
    features: ['Aluminum Hard Panniers Included', 'Knobby Off-Road Dual Sport Tires', 'Handlebar Crash Guards', 'TFT Tripper Navigation Screen', '2 ECE High Altitude Helmets'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-LEH-02',
    name: 'Toyota Fortuner 4x4 Sigma 4 (Expedition Rig)',
    category: 'suv',
    brand: 'Toyota',
    modelYear: 2024,
    city: 'Leh (Ladakh)',
    cityKey: 'leh',
    pickupHubs: ['Leh Airport (IXL)', 'Leh Fort Road Hotel Delivery'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 7,
    doors: 4,
    bootSpaceBags: 5,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '12 km/l (Cold Start Glow Plugs & Fuel Heater)',
    ac: true,
    airbags: 7,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 5499,
    pricePerDayChauffeur: 6499,
    pricePerDayStoryteller: 7299,
    securityDeposit: 8000,
    kmPolicy: 'Unlimited Kilometers in Ladakh Protected Areas',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 23,
    licenseRequirement: 'Valid 4-Wheeler License (Min 2 yrs)',
    providerId: 'PROV-LEH-HIMALAYAN',
    providerName: 'Himalayan High Pass Expeditions',
    providerRating: 4.98,
    reviewsCount: 210,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • Oxygen Concentrator & Satellite Pager Included',
    status: 'AVAILABLE',
    features: ['Portable Medical Oxygen Cylinder', 'Snorkel Air Intake for River Crossings', '4x4 Low-Range Transfer Case', 'Snow Chains Kit', 'Inner Line Permits Assistance'],
    interstatePermitsIncluded: true
  },

  // BENGALURU
  {
    id: 'V-BLR-01',
    name: 'BMW 3 Series Gran Limousine (Luxury)',
    category: 'ev_luxury',
    brand: 'BMW',
    modelYear: 2024,
    city: 'Bengaluru',
    cityKey: 'bengaluru',
    pickupHubs: ['Kempegowda International Airport (BLR)', 'Indiranagar Hub', 'Whitefield Luxury Hotel Delivery'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '15.3 km/l',
    ac: true,
    airbags: 8,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 6999,
    pricePerDayChauffeur: 8499,
    pricePerDayStoryteller: 9499,
    securityDeposit: 10000,
    kmPolicy: '250 km/day (₹25/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 24,
    licenseRequirement: 'Valid 4-Wheeler DL (Min 2 yrs)',
    providerId: 'PROV-BLR-APEX',
    providerName: 'Apex Luxury Mobility Bengaluru',
    providerRating: 4.95,
    reviewsCount: 125,
    verified: true,
    verificationBadgeText: 'SafarSetu Luxury Tier Verified • White-Glove Handover',
    status: 'AVAILABLE',
    features: ['Harman Kardon Surround Sound', 'Panoramic Glass Roof', 'Curved Display Cockpit', 'Executive Rear Lounge Seating'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-BLR-02',
    name: 'Ather 450X Gen 3 (Smart EV Scooter)',
    category: 'bike_scooter',
    brand: 'Ather',
    modelYear: 2024,
    city: 'Bengaluru',
    cityKey: 'bengaluru',
    pickupHubs: ['Indiranagar Hub', 'Koramangala Hub', 'Jayanagar'],
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 2,
    doors: 0,
    bootSpaceBags: 1,
    transmission: 'automatic',
    fuelType: 'ev',
    mileageOrRange: '105 km TrueRange on single charge',
    ac: false,
    airbags: 0,
    allowedModes: ['self_drive'],
    pricePerDaySelfDrive: 599,
    pricePerDayChauffeur: 0,
    pricePerDayStoryteller: 0,
    securityDeposit: 1500,
    kmPolicy: 'Unlimited Kilometers with Free Ather Grid Fast Charging',
    fuelPolicy: 'Free Charging at 80+ Ather Grids in Bengaluru',
    minAge: 18,
    licenseRequirement: 'Valid 2-Wheeler DL',
    providerId: 'PROV-BLR-APEX',
    providerName: 'Ather City Mobility Partners',
    providerRating: 4.89,
    reviewsCount: 240,
    verified: true,
    verificationBadgeText: 'SafarSetu Eco Verified • Free Fast Charging Included',
    status: 'AVAILABLE',
    features: ['Google Maps On-Dashboard Touchscreen', 'Warp Mode Acceleration', 'Reverse Assist', '2 Certified Helmets Included'],
    interstatePermitsIncluded: false
  },

  // DELHI NCR
  {
    id: 'V-DEL-01',
    name: 'Toyota Fortuner Legender 4x4',
    category: 'suv',
    brand: 'Toyota',
    modelYear: 2024,
    city: 'Delhi NCR',
    cityKey: 'delhi',
    pickupHubs: ['IGI Airport T3', 'Aerocity Hub', 'New Delhi Station', 'Gurugram Cyber Hub Delivery'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 7,
    doors: 4,
    bootSpaceBags: 4,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '13.8 km/l',
    ac: true,
    airbags: 7,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 4499,
    pricePerDayChauffeur: 5499,
    pricePerDayStoryteller: 6299,
    securityDeposit: 6000,
    kmPolicy: '350 km/day (₹12/km beyond)',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 22,
    licenseRequirement: 'Valid LMV DL',
    providerId: 'PROV-DEL-CAPITAL',
    providerName: 'Capital Chauffeurs & Highway Fleets',
    providerRating: 4.91,
    reviewsCount: 165,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • National Highway Fastag Ready',
    status: 'AVAILABLE',
    features: ['Wireless Charging', 'JBL Premium 11-Speaker Audio', 'Dual Tone Roof', 'Ventilated Front Seats'],
    interstatePermitsIncluded: true
  },
  {
    id: 'V-DEL-02',
    name: 'Hyundai Verna SX (O) Turbo DCT',
    category: 'car',
    brand: 'Hyundai',
    modelYear: 2024,
    city: 'Delhi NCR',
    cityKey: 'delhi',
    pickupHubs: ['IGI Airport', 'Connaught Place', 'Noida Expressway'],
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'petrol',
    mileageOrRange: '20.6 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver'],
    pricePerDaySelfDrive: 2299,
    pricePerDayChauffeur: 2999,
    pricePerDayStoryteller: 3599,
    securityDeposit: 3500,
    kmPolicy: '300 km/day included',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid LMV License',
    providerId: 'PROV-DEL-CAPITAL',
    providerName: 'Capital Chauffeurs',
    providerRating: 4.84,
    reviewsCount: 96,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified Fleet',
    status: 'AVAILABLE',
    features: ['Level 2 ADAS (Smart Cruise & Lane Keep)', 'Heated & Ventilated Front Seats', 'Switchable Infotainment & Climate Controller'],
    interstatePermitsIncluded: true
  },

  // MANALI
  {
    id: 'V-MAN-01',
    name: 'Mahindra Thar Roxx 4x4 (5-Door)',
    category: 'suv',
    brand: 'Mahindra',
    modelYear: 2024,
    city: 'Manali',
    cityKey: 'manali',
    pickupHubs: ['Mall Road Hub', 'Old Manali Delivery', 'Kullu Bhuntar Airport (KUU)'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&auto=format&fit=crop&q=80'
    ],
    seats: 5,
    doors: 4,
    bootSpaceBags: 3,
    transmission: 'automatic',
    fuelType: 'diesel',
    mileageOrRange: '13 km/l',
    ac: true,
    airbags: 6,
    allowedModes: ['self_drive', 'with_driver', 'driver_storyteller'],
    pricePerDaySelfDrive: 3999,
    pricePerDayChauffeur: 4899,
    pricePerDayStoryteller: 5599,
    securityDeposit: 5000,
    kmPolicy: 'Unlimited Kilometers in Himachal & Rohtang Corridor',
    fuelPolicy: 'Same-to-Same tank',
    minAge: 21,
    licenseRequirement: 'Valid LMV License',
    providerId: 'PROV-MAN-ALPINE',
    providerName: 'Pir Panjal Alpine Rides',
    providerRating: 4.93,
    reviewsCount: 144,
    verified: true,
    verificationBadgeText: 'SafarSetu Verified • Snow Chain Kit & Green Rohtang Permit Included',
    status: 'AVAILABLE',
    features: ['Snow Chains in Trunk', 'All-Terrain M/T Tires', 'Panoramic Sunroof', 'Harman Kardon 9-Speaker Audio', 'Differential Lock 4x4'],
    interstatePermitsIncluded: true
  }
];

export const rentalBookingsStore: RentalBooking[] = [
  {
    id: 'RB-98402',
    pnr: 'SFR-RNT-7491',
    vehicleId: 'V-HYD-01',
    vehicleName: 'Toyota Innova Crysta 2.4 ZX',
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
    vehicleCategory: 'suv',
    rentalMode: 'driver_storyteller',
    city: 'Hyderabad',
    pickupLocation: 'RGIA Shamshabad Airport (Terminal 1 Arrivals)',
    dropLocation: 'Hitec City Hotel Hub',
    pickupDate: '2026-10-14',
    pickupTime: '09:00 AM',
    returnDate: '2026-10-18',
    returnTime: '06:00 PM',
    days: 4,
    travelerName: 'Priya Sundaram',
    travelerPhone: '+91 98401 23456',
    travelerEmail: 'priya.sundaram@gmail.com',
    licenseNumber: 'TS-09-2018-0044192',
    pricingBreakdown: {
      baseRental: 13996,
      driverAllowance: 3200,
      storytellerFee: 2800,
      deliveryFee: 0,
      taxes: 1250,
      refundableDeposit: 0,
      totalAmount: 21246
    },
    paymentStatus: 'PAID',
    paymentMethod: 'UPI (Google Pay)',
    bookingStatus: 'CONFIRMED',
    chauffeurPartnerId: 'ptr-1',
    chauffeurName: 'Suresh Kurup (Certified Storyteller Chauffeur)',
    createdAt: '2026-09-12T14:30:00Z'
  }
];

// =========================================================================
// 2. HELPER CALCULATORS & CONCURRENCY VALIDATORS
// =========================================================================

/**
 * Calculates number of rental days based on dates
 */
export function calculateRentalDays(pickupDate: string, returnDate: string): number {
  try {
    const d1 = new Date(pickupDate).getTime();
    const d2 = new Date(returnDate).getTime();
    if (isNaN(d1) || isNaN(d2)) return 1;
    const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  } catch {
    return 1;
  }
}

/**
 * Double booking validator: checks if a vehicle already has a conflicting confirmed or active booking
 */
export function isVehicleAvailableForDates(vehicleId: string, pickupDate: string, returnDate: string): boolean {
  const reqStart = new Date(pickupDate).getTime();
  const reqEnd = new Date(returnDate).getTime();

  // Find any overlapping confirmed bookings
  const conflicting = rentalBookingsStore.find(b => {
    if (b.vehicleId !== vehicleId) return false;
    if (b.bookingStatus === 'CANCELLED' || b.bookingStatus === 'REFUNDED' || b.bookingStatus === 'FAILED') return false;
    
    const bStart = new Date(b.pickupDate).getTime();
    const bEnd = new Date(b.returnDate).getTime();
    
    // Overlap condition: reqStart <= bEnd AND reqEnd >= bStart
    return (reqStart <= bEnd && reqEnd >= bStart);
  });

  return !conflicting;
}

/**
 * Server-authoritative price calculation
 */
export function calculateRentalPricing(
  vehicle: RentalVehicle,
  days: number,
  mode: RentalMode,
  needsDoorstepDelivery: boolean = false
) {
  let dailyRate = vehicle.pricePerDaySelfDrive;
  let driverAllowance = 0;
  let storytellerFee = 0;
  let refundableDeposit = vehicle.securityDeposit;

  if (mode === 'with_driver') {
    dailyRate = vehicle.pricePerDayChauffeur || (vehicle.pricePerDaySelfDrive + 800);
    driverAllowance = 800 * days;
    refundableDeposit = Math.round(vehicle.securityDeposit * 0.5); // reduced deposit with chauffeur
  } else if (mode === 'driver_storyteller') {
    dailyRate = vehicle.pricePerDayStoryteller || (vehicle.pricePerDaySelfDrive + 1500);
    driverAllowance = 800 * days;
    storytellerFee = 700 * days;
    refundableDeposit = 0; // zero deposit when escorted by certified storyteller chauffeur
  }

  const baseRental = vehicle.pricePerDaySelfDrive * days;
  const deliveryFee = needsDoorstepDelivery ? 350 : 0;
  const subtotal = (dailyRate * days) + deliveryFee;
  // Transparent GST 5% on commercial tourist passenger rentals in India
  const taxes = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + taxes + refundableDeposit;

  return {
    dailyRate,
    days,
    baseRental,
    driverAllowance,
    storytellerFee,
    deliveryFee,
    taxes,
    refundableDeposit,
    totalAmount
  };
}

// =========================================================================
// 3. REST API ROUTE HANDLERS
// =========================================================================

export function registerRentalRoutes(app: Express) {

  // 1. Get all rental cities
  app.get('/api/rentals/cities', (req: Request, res: Response) => {
    res.json({
      cities: rentalCitiesStore,
      count: rentalCitiesStore.length
    });
  });

  // 2. Get rental categories
  app.get('/api/rentals/categories', (req: Request, res: Response) => {
    const categories = [
      { key: 'all', label: 'All Fleet', icon: 'Sparkles', count: rentalVehiclesStore.length },
      { key: 'suv', label: 'SUVs & 4x4', icon: 'Car', count: rentalVehiclesStore.filter(v => v.category === 'suv').length },
      { key: 'car', label: 'Cars & Sedans', icon: 'Car', count: rentalVehiclesStore.filter(v => v.category === 'car').length },
      { key: 'bike_scooter', label: 'Bikes & Scooters', icon: 'Bike', count: rentalVehiclesStore.filter(v => v.category === 'bike_scooter').length },
      { key: 'ev_luxury', label: 'Electric & Luxury', icon: 'Zap', count: rentalVehiclesStore.filter(v => v.category === 'ev_luxury').length },
      { key: 'tempo_group', label: 'Group Vans (12S+)', icon: 'Users', count: rentalVehiclesStore.filter(v => v.category === 'tempo_group').length }
    ];
    res.json(categories);
  });

  // 3. Search & List Vehicles with filters
  app.get('/api/rentals', (req: Request, res: Response) => {
    const {
      city,
      category,
      mode,
      transmission,
      fuelType,
      seats,
      minPrice,
      maxPrice,
      pickupDate,
      returnDate,
      verifiedOnly
    } = req.query;

    let filtered = rentalVehiclesStore.filter(v => v.status === 'AVAILABLE');

    // Filter by City
    if (city && city !== 'all') {
      const c = String(city).toLowerCase().trim();
      filtered = filtered.filter(v =>
        v.cityKey.toLowerCase() === c ||
        v.city.toLowerCase().includes(c)
      );
    }

    // Filter by Category
    if (category && category !== 'all') {
      filtered = filtered.filter(v => v.category === category);
    }

    // Filter by Rental Mode
    if (mode && mode !== 'all') {
      filtered = filtered.filter(v => v.allowedModes.includes(mode as RentalMode));
    }

    // Filter by Transmission
    if (transmission && transmission !== 'all') {
      filtered = filtered.filter(v => v.transmission === transmission);
    }

    // Filter by Fuel Type
    if (fuelType && fuelType !== 'all') {
      filtered = filtered.filter(v => v.fuelType === fuelType);
    }

    // Filter by Seats
    if (seats && seats !== 'all') {
      const minSeats = parseInt(String(seats), 10);
      if (!isNaN(minSeats)) {
        if (minSeats === 7) {
          filtered = filtered.filter(v => v.seats >= 7);
        } else if (minSeats === 5) {
          filtered = filtered.filter(v => v.seats >= 4 && v.seats <= 5);
        } else if (minSeats === 2) {
          filtered = filtered.filter(v => v.seats === 2);
        }
      }
    }

    // Filter by Price range
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) filtered = filtered.filter(v => v.pricePerDaySelfDrive >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) filtered = filtered.filter(v => v.pricePerDaySelfDrive <= max);
    }

    // Verified only
    if (verifiedOnly === 'true') {
      filtered = filtered.filter(v => v.verified);
    }

    // Availability filter if dates are provided
    if (pickupDate && returnDate) {
      const pDate = String(pickupDate);
      const rDate = String(returnDate);
      filtered = filtered.filter(v => isVehicleAvailableForDates(v.id, pDate, rDate));
    }

    res.json({
      total: filtered.length,
      vehicles: filtered
    });
  });

  // 4. Get single vehicle by ID
  app.get('/api/rentals/:id', (req: Request, res: Response) => {
    const vehicle = rentalVehiclesStore.find(v => v.id === req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Rental vehicle not found.' });
    }
    res.json(vehicle);
  });

  // 5. Calculate Price Endpoint (Server-Side Calculation)
  app.post('/api/rentals/calculate-price', (req: Request, res: Response) => {
    const { vehicleId, pickupDate, returnDate, mode, needsDoorstepDelivery } = req.body;
    const vehicle = rentalVehiclesStore.find(v => v.id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    const days = calculateRentalDays(pickupDate, returnDate);
    const pricing = calculateRentalPricing(vehicle, days, mode || 'self_drive', Boolean(needsDoorstepDelivery));

    res.json({
      vehicleId,
      vehicleName: vehicle.name,
      days,
      pricing
    });
  });

  // 6. Book Vehicle Endpoint (Double Booking Prevention & Strict Pricing)
  app.post('/api/rentals/book', (req: Request, res: Response) => {
    const {
      vehicleId,
      rentalMode,
      city,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      travelerName,
      travelerPhone,
      travelerEmail,
      licenseNumber,
      paymentMethod,
      needsDoorstepDelivery
    } = req.body;

    if (!vehicleId || !travelerName || !travelerPhone || !pickupDate || !returnDate) {
      return res.status(400).json({ error: 'Missing required booking details.' });
    }

    const vehicle = rentalVehiclesStore.find(v => v.id === vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Selected vehicle not found.' });
    }

    if (vehicle.status !== 'AVAILABLE') {
      return res.status(409).json({ error: `Vehicle is currently ${vehicle.status.toLowerCase()} and cannot be booked.` });
    }

    // Concurrency / Overlap check
    const isAvailable = isVehicleAvailableForDates(vehicleId, pickupDate, returnDate);
    if (!isAvailable) {
      return res.status(409).json({
        error: 'This vehicle was just reserved for the selected dates by another traveler. Please choose alternate dates or explore similar vehicles.'
      });
    }

    const days = calculateRentalDays(pickupDate, returnDate);
    const mode: RentalMode = (rentalMode as RentalMode) || 'self_drive';
    const pricing = calculateRentalPricing(vehicle, days, mode, Boolean(needsDoorstepDelivery));

    // Generate unique PNR & Booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `RB-${Date.now().toString().slice(-5)}${randomSuffix.toString().slice(0, 2)}`;
    const pnr = `SFR-RNT-${randomSuffix}`;

    const newBooking: RentalBooking = {
      id: bookingId,
      pnr,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleImage: vehicle.images[0],
      vehicleCategory: vehicle.category,
      rentalMode: mode,
      city: city || vehicle.city,
      pickupLocation: pickupLocation || vehicle.pickupHubs[0],
      dropLocation: dropLocation || vehicle.pickupHubs[0],
      pickupDate,
      pickupTime: pickupTime || '10:00 AM',
      returnDate,
      returnTime: returnTime || '10:00 AM',
      days,
      travelerName,
      travelerPhone,
      travelerEmail: travelerEmail || 'traveler@safarsetu.in',
      licenseNumber: licenseNumber || 'TS-DL-PENDING-VERIFY',
      pricingBreakdown: {
        baseRental: pricing.baseRental,
        driverAllowance: pricing.driverAllowance,
        storytellerFee: pricing.storytellerFee,
        deliveryFee: pricing.deliveryFee,
        taxes: pricing.taxes,
        refundableDeposit: pricing.refundableDeposit,
        totalAmount: pricing.totalAmount
      },
      paymentStatus: 'PAID',
      paymentMethod: paymentMethod || 'UPI (Verified)',
      bookingStatus: 'CONFIRMED',
      chauffeurPartnerId: mode !== 'self_drive' ? 'ptr-1' : undefined,
      chauffeurName: mode !== 'self_drive' ? 'Suresh Kurup (Certified Storyteller Chauffeur)' : undefined,
      createdAt: new Date().toISOString()
    };

    rentalBookingsStore.unshift(newBooking);

    res.status(201).json({
      success: true,
      message: 'Rental booking successfully confirmed with SafarSetu 0% markup guarantee.',
      booking: newBooking
    });
  });

  // 7. Get user's rental bookings
  app.get('/api/rentals/bookings', (req: Request, res: Response) => {
    const { phone, email } = req.query;
    let list = rentalBookingsStore;

    if (phone) {
      list = list.filter(b => b.travelerPhone.includes(String(phone)));
    } else if (email) {
      list = list.filter(b => b.travelerEmail.toLowerCase() === String(email).toLowerCase());
    }

    res.json({
      count: list.length,
      bookings: list
    });
  });

  // 8. Get specific booking by ID or PNR
  app.get('/api/rentals/bookings/:idOrPnr', (req: Request, res: Response) => {
    const q = req.params.idOrPnr.toLowerCase();
    const booking = rentalBookingsStore.find(b => b.id.toLowerCase() === q || b.pnr.toLowerCase() === q);
    if (!booking) {
      return res.status(404).json({ error: 'Rental booking not found.' });
    }
    res.json(booking);
  });

  // 9. Cancel booking
  app.post('/api/rentals/bookings/:id/cancel', (req: Request, res: Response) => {
    const booking = rentalBookingsStore.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';

    res.json({
      message: 'Booking cancelled successfully. 100% refund initiated to source payment method.',
      booking
    });
  });

  // 10. Update vehicle status (Provider / Admin)
  app.patch('/api/rentals/vehicles/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const vehicle = rentalVehiclesStore.find(v => v.id === req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    if (['AVAILABLE', 'BOOKED', 'UNAVAILABLE', 'MAINTENANCE', 'BLOCKED'].includes(status)) {
      vehicle.status = status as VehicleStatus;
      return res.json({ message: `Vehicle status updated to ${status}`, vehicle });
    }

    res.status(400).json({ error: 'Invalid vehicle status.' });
  });

  // 11. Admin verify vehicle
  app.patch('/api/rentals/vehicles/:id/verify', (req: Request, res: Response) => {
    const vehicle = rentalVehiclesStore.find(v => v.id === req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found.' });
    }

    vehicle.verified = true;
    vehicle.verificationBadgeText = 'SafarSetu Verified • All Documents Cleared';
    res.json({ message: 'Vehicle verified successfully.', vehicle });
  });
}
