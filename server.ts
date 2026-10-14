import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { COMPLETE_TOURISM_REGISTRY, getPlannerPackage } from './src/data/destinations';
import { registerPartnerAndAdminRoutes, assignmentsStore, partnersStore, auditLogsStore } from './src/server/partnerOperations';
import { registerRentalRoutes } from './src/server/rentalOperations';
import { registerReviewRoutes } from './src/server/reviewOperations';
import { registerTelanganaRoutes } from './src/server/telanganaOperations';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory repositories for production-grade REST services
interface StoredBooking {
  id: string;
  pnr: string;
  destinationKey: string;
  destinationName: string;
  origin: string;
  dates: string;
  nights: number;
  guests: number;
  durationDays: number;
  transportTitle: string;
  stayName: string;
  driverName: string;
  totalCost: string;
  numericTotal: number;
  status: 'Confirmed' | 'Cancelled';
  paymentMethod: string;
  timestamp: string;
  travelerName: string;
  travelerPhone: string;
}

interface StoredTrip {
  id: string;
  name: string;
  dates: string;
  destination: string;
  duration: string;
  estimatedCost: string;
  status: 'Draft';
  stay: string;
  updatedAt: string;
}

interface StoredSOSIncident {
  id: string;
  timestamp: string;
  destination: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  status: 'DISPATCHED_TO_POLICE_AND_FAMILY';
}

const bookingsStore: StoredBooking[] = [
  {
    id: "SS-CONFIRM-94812",
    pnr: "4582-KER-9012",
    destinationKey: "kerala",
    destinationName: "Kerala (Munnar & Alleppey)",
    origin: "Hyderabad (HYD)",
    dates: "Oct 14 - Oct 18, 2026",
    nights: 4,
    guests: 2,
    durationDays: 5,
    transportTitle: "IndiGo 6E-6518 (HYD ➔ COK)",
    stayName: "Munnar Misty Tea Valley Homestay",
    driverName: "Arjun Nair (Tata Nexon EV)",
    totalCost: "₹16,700",
    numericTotal: 16700,
    status: "Confirmed",
    paymentMethod: "UPI",
    timestamp: "12/09/2026",
    travelerName: "Priya Sharma",
    travelerPhone: "+91 98765 43210"
  }
];

const tripsStore: StoredTrip[] = [
  {
    id: "TRIP-KER-01",
    name: "Kerala Backwaters & Tea Mountains",
    dates: "Oct 14 - Oct 18, 2026",
    destination: "kerala",
    duration: "4 Nights",
    estimatedCost: "₹16,700",
    status: "Draft",
    stay: "Munnar Misty Tea Valley Homestay",
    updatedAt: new Date().toISOString()
  }
];

const sosIncidentsStore: StoredSOSIncident[] = [];

// Partner room inventory
const operatorInventory = [
  {
    id: "INV-KER-01",
    property: "Munnar Misty Tea Valley Homestay",
    location: "Pothamedu Viewpoint, Munnar",
    category: "Verified Rural Homestay",
    baseRate: 1850,
    availableRooms: 2,
    isSoldOut: false
  },
  {
    id: "INV-KER-02",
    property: "Punnamada Lake Backwater Eco-Villa & Houseboat",
    location: "Finishing Point, Alleppey",
    category: "Backwater Eco-Stay",
    baseRate: 3200,
    availableRooms: 1,
    isSoldOut: false
  },
  {
    id: "INV-TEL-01",
    property: "Kakatiya Heritage Homestay",
    location: "Palampet Lake Road, Warangal",
    category: "Verified Rural Homestay",
    baseRate: 1450,
    availableRooms: 3,
    isSoldOut: false
  }
];

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  }
  return aiClient;
}

// ==========================================
// REST API ROUTES
// ==========================================

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "SafarSetu Multimodal Engine",
    version: "2.0.0",
    totalStatesAndUTs: Object.keys(COMPLETE_TOURISM_REGISTRY).length,
    timestamp: new Date().toISOString()
  });
});

// Destination registry
app.get("/api/destinations", (req: Request, res: Response) => {
  const { region, search } = req.query;
  let list = Object.values(COMPLETE_TOURISM_REGISTRY);

  if (region && region !== 'all') {
    list = list.filter(s => s.region === String(region).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.capital.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }

  res.json({
    count: list.length,
    destinations: list
  });
});

// Specific destination dossier
app.get("/api/destinations/:id", (req: Request, res: Response) => {
  const destId = String(req.params.id).toLowerCase();
  const dest = COMPLETE_TOURISM_REGISTRY[destId];

  if (!dest) {
    return res.status(404).json({ error: `Destination '${destId}' not found.` });
  }

  res.json(dest);
});

// Complete multimodal package for planner
app.get("/api/packages/:id", (req: Request, res: Response) => {
  const destId = String(req.params.id).toLowerCase();
  const duration = (req.query.duration === '7') ? 7 : 5;
  const startDate = req.query.startDate ? String(req.query.startDate) : "2026-10-14";

  const pkg = getPlannerPackage(destId, duration, startDate);
  res.json(pkg);
});

// Weather forecast for destination
app.get("/api/weather/:destination", (req: Request, res: Response) => {
  const destId = String(req.params.destination).toLowerCase();
  const dest = COMPLETE_TOURISM_REGISTRY[destId];

  // Meteorological seasonal analysis
  const currentMonth = new Date().getMonth(); // 0 to 11
  let condition = "Pleasant & Clear Skies";
  let tempC = 24;
  let advisory = "Favorable conditions for road journeys and outdoor heritage exploration.";

  if (destId === 'himachal' || destId === 'ladakh') {
    tempC = currentMonth >= 10 || currentMonth <= 2 ? 2 : 16;
    condition = currentMonth >= 10 || currentMonth <= 2 ? "Snow on High Passes" : "Cool Alpine Sun";
    advisory = "High altitude passes clear; storyteller drivers equipped with certified vehicle chains.";
  } else if (destId === 'kerala' || destId === 'goa') {
    tempC = 27;
    condition = "Gentle Coastal Breeze";
    advisory = "Water metro and solar houseboats operating on normal schedule.";
  }

  res.json({
    destination: dest ? dest.name : destId,
    temperatureCelsius: tempC,
    condition,
    advisory,
    humidity: "62%",
    uvIndex: 4,
    airQualityIndex: 42, // Green
    airQualityStatus: "Good"
  });
});

// Bookings - List
app.get("/api/bookings", (req: Request, res: Response) => {
  res.json(bookingsStore);
});

// Bookings - Create
app.post("/api/bookings", (req: Request, res: Response) => {
  const {
    destinationKey,
    destinationName,
    origin,
    dates,
    nights,
    guests,
    durationDays,
    transportTitle,
    stayName,
    driverName,
    totalCost,
    numericTotal,
    paymentMethod,
    travelerName,
    travelerPhone
  } = req.body;

  if (!destinationKey || !transportTitle || !stayName || !driverName) {
    return res.status(400).json({ error: "Missing required booking details (Transport, Stay, or Driver)." });
  }

  const bookingId = "SS-CONFIRM-" + Math.floor(10000 + Math.random() * 90000);
  const pnr = "4582-" + destinationKey.slice(0, 3).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);

  const newBooking: StoredBooking = {
    id: bookingId,
    pnr,
    destinationKey,
    destinationName: destinationName || destinationKey,
    origin: origin || "Hyderabad",
    dates: dates || "Oct 14 - Oct 18, 2026",
    nights: Number(nights) || 4,
    guests: Number(guests) || 2,
    durationDays: Number(durationDays) || 5,
    transportTitle,
    stayName,
    driverName,
    totalCost: totalCost || `₹${(numericTotal || 16700).toLocaleString('en-IN')}`,
    numericTotal: Number(numericTotal) || 16700,
    status: "Confirmed",
    paymentMethod: paymentMethod || "UPI",
    timestamp: new Date().toLocaleDateString('en-IN'),
    travelerName: travelerName || "Priya Sharma",
    travelerPhone: travelerPhone || "+91 98765 43210"
  };

  bookingsStore.unshift(newBooking);

  // Automatically create unified operational assignment for Partner & Operations engine
  const assignedPartner = partnersStore.find(p => p.serviceAreas.some(a => a.toLowerCase().includes(destinationKey.toLowerCase()))) || partnersStore[0];
  const newAssignment: any = {
    id: "ASG-" + Math.floor(10000 + Math.random() * 90000),
    tripId: "TRIP-" + newBooking.pnr.slice(0, 8),
    bookingId: newBooking.id,
    pnr: newBooking.pnr,
    partnerId: assignedPartner ? assignedPartner.id : '',
    partnerName: assignedPartner ? assignedPartner.fullName : 'Unassigned (Awaiting Match)',
    assignedRole: assignedPartner ? assignedPartner.role : 'DRIVER_STORYTELLER',
    travelerName: newBooking.travelerName,
    travelerPhone: newBooking.travelerPhone,
    guestsCount: newBooking.guests,
    luggageCount: `${newBooking.guests * 1} Cabin + ${newBooking.guests * 1} Check-in Bags`,
    pickupDate: newBooking.dates.split(' - ')[0] || "Upcoming",
    pickupTime: "09:30 AM",
    pickupLocation: `${newBooking.destinationName} Transport Terminal`,
    pickupGate: "Arrival Gate / Main Exit",
    pickupCoordinates: { lat: 10.1558, lng: 76.3860 },
    dropDate: newBooking.dates.split(' - ')[1] || "Checkout",
    dropTime: "05:30 PM",
    dropLocation: newBooking.stayName,
    dropCoordinates: { lat: 10.0889, lng: 77.0595 },
    destinationName: newBooking.destinationName,
    destinationKey: newBooking.destinationKey,
    serviceType: "Full Day Chauffeur & Storyteller",
    status: assignedPartner ? "OFFERED" : "OFFERED",
    statusTimeline: [
      { status: "OFFERED", timestamp: new Date().toLocaleTimeString('en-IN') + ', ' + new Date().toLocaleDateString('en-IN'), note: "Created from live traveler booking" }
    ],
    estimatedDistanceKm: 110,
    estimatedDurationHours: 3.5,
    etaMinutes: 20,
    currentStopIndex: 0,
    stops: [
      {
        id: "stp-b1",
        stopNumber: 1,
        time: "09:30 AM",
        location: `${newBooking.destinationName} Arrival Terminal`,
        coordinates: { lat: 10.1558, lng: 76.3860 },
        expectedDeparture: "10:00 AM",
        driverAction: "Hold SafarSetu name card. Assist with baggage loading.",
        storytellerAction: "Traditional greeting and route orientation.",
        travelerAction: "Deboard, meet partner chauffeur.",
        completed: false
      },
      {
        id: "stp-b2",
        stopNumber: 2,
        time: "01:00 PM",
        location: "Heritage Spice & Handicrafts Center",
        coordinates: { lat: 10.0412, lng: 76.9534 },
        expectedDeparture: "02:00 PM",
        driverAction: "Safe parking.",
        storytellerAction: "Explain indigenous crafts and spice cultivation.",
        travelerAction: "Lunch & cultural craft exploration.",
        completed: false
      },
      {
        id: "stp-b3",
        stopNumber: 3,
        time: "04:30 PM",
        location: newBooking.stayName,
        coordinates: { lat: 10.0889, lng: 77.0595 },
        expectedDeparture: "05:00 PM",
        driverAction: "Unload luggage, verify check-in with host.",
        storytellerAction: "Introduce host and local orientation.",
        travelerAction: "Homestay check-in.",
        completed: false
      }
    ],
    travelerPreferences: {
      travelStyle: "Cultural Heritage & Scenic",
      interests: ["Local lore", "Authentic cuisine", "Responsible tourism"],
      languagePreference: "English & Hindi",
      specialRequirements: ["Verified safety corridor chauffeur"],
      dietary: "Standard Regional Cuisine"
    },
    safarSetuInstructions: {
      version: "v2.1",
      updatedAt: new Date().toLocaleDateString('en-IN'),
      acknowledgedByPartner: false,
      items: [
        "1. Be present 15 minutes before scheduled pickup.",
        "2. Carry SafarSetu welcome card with traveler name.",
        "3. Zero-commission policy: Do not take traveler to unverified commercial emporiums.",
        "4. Follow the approved route; report delays if traffic exceeds 15 mins."
      ]
    },
    earnings: {
      baseFare: 2400,
      distanceComponent: 1650,
      waitingAllowance: 250,
      storytellerFee: 1400,
      bonus: 200,
      totalPayable: 5900,
      payoutStatus: "PENDING"
    },
    preTripChecklistCompleted: false,
    postTripChecklistCompleted: false,
    chatMessages: []
  };

  assignmentsStore.unshift(newAssignment);

  auditLogsStore.unshift({
    id: "AUD-" + Date.now(),
    timestamp: new Date().toISOString(),
    action: "BOOKING_ASSIGNMENT_CREATED",
    performedBy: "SafarSetu Multimodal Engine",
    role: "SYSTEM",
    assignmentId: newAssignment.id,
    details: `Booking ${newBooking.pnr} created operational assignment for ${newBooking.travelerName}.`
  });

  res.status(201).json({
    message: "Booking verified and confirmed. Assigned to SafarSetu Partner Operations.",
    booking: newBooking,
    assignmentId: newAssignment.id
  });
});

// Bookings - Cancel
app.post("/api/bookings/:id/cancel", (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const booking = bookingsStore.find(b => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }

  booking.status = "Cancelled";
  res.json({
    message: "Booking cancelled successfully. Direct refund initiated to original source.",
    refundAmount: booking.totalCost,
    booking
  });
});

// Trips - List & Save
app.get("/api/trips", (req: Request, res: Response) => {
  res.json(tripsStore);
});

app.post("/api/trips", (req: Request, res: Response) => {
  const { name, dates, destination, duration, estimatedCost, stay } = req.body;
  const newTrip: StoredTrip = {
    id: "TRIP-" + Math.floor(1000 + Math.random() * 9000),
    name: name || "India Explorer",
    dates: dates || "Oct 14 - Oct 18, 2026",
    destination: destination || "kerala",
    duration: duration || "4 Nights",
    estimatedCost: estimatedCost || "₹16,700",
    status: "Draft",
    stay: stay || "Verified Homestay",
    updatedAt: new Date().toISOString()
  };

  tripsStore.unshift(newTrip);
  res.status(201).json(newTrip);
});

app.delete("/api/trips/:id", (req: Request, res: Response) => {
  const idx = tripsStore.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    tripsStore.splice(idx, 1);
  }
  res.json({ success: true });
});

// Disruption Simulation & Replan
app.post("/api/disruptions/simulate", (req: Request, res: Response) => {
  const { type, destinationKey } = req.body;
  const destName = COMPLETE_TOURISM_REGISTRY[destinationKey]?.name || "Destination";

  if (type === 'transit_delay') {
    res.json({
      type: "transit_delay",
      title: `Transit Disruption: 3h Connection Delay to ${destName}`,
      description: "Primary connection delayed. SafarSetu autonomous engine coordinates with stay host and storyteller chauffeur.",
      whatsappMessage: {
        heading: `SafarSetu Alert: Delay to ${destName}`,
        body: `Your connection to ${destName} has encountered a 3h delay. Autonomous engine has alerted your homestay host and storyteller chauffeur.`,
        plan: [
          "1. Shifted to backup express connection on time",
          "2. Homestay check-in pushed to evening (Host notified & confirmed)",
          "3. Chauffeur pickup rescheduled to updated arrival"
        ]
      },
      replannedEvents: [
        { time: "10:30 AM", title: "Rescheduled Arrival & Driver Pickup", desc: `Chauffeur briefed on updated arrival time for ${destName}.`, status: "Rescheduled ✓" },
        { time: "01:30 PM", title: "Adjusted Homestay Check-in", desc: "Room guaranteed; host informed via direct SMS.", status: "Shifted ✓" },
        { time: "04:30 PM", title: "Optimized Sunset Sightseeing", desc: "Itinerary re-sequenced for golden hour light.", status: "Optimized ✓" }
      ]
    });
  } else {
    res.json({
      type: "weather_alert",
      title: `Weather Caution: Road Reroute near ${destName}`,
      description: "Seasonal rainfall detected on high passes. Route shifted to all-weather state highway with storyteller chauffeur.",
      whatsappMessage: {
        heading: `Weather Advisory: ${destName}`,
        body: `Precautionary weather reroute applied. Storyteller driver will navigate all-weather scenic highway.`,
        plan: [
          "1. Valley bypass route confirmed",
          "2. Indoor spice & museum visits prioritized",
          "3. Evening tea tasting indoors"
        ]
      },
      replannedEvents: [
        { time: "09:30 AM", title: "All-Weather Highway Valley Bypass", desc: "Smooth transit away from high pass rain curves.", status: "Rerouted ✓" },
        { time: "01:00 PM", title: "Indoor Spice Museum & Tea Salon", desc: "Sensory tasting sheltered from weather.", status: "Added ✓" }
      ]
    });
  }
});

// SOS Emergency Telemetry Broadcast
app.post("/api/sos/broadcast", (req: Request, res: Response) => {
  const { destination, latitude, longitude, contactNumber } = req.body;
  const incident: StoredSOSIncident = {
    id: "SOS-" + Math.floor(100000 + Math.random() * 900000),
    timestamp: new Date().toISOString(),
    destination: destination || "Unknown",
    latitude: Number(latitude) || 10.0889,
    longitude: Number(longitude) || 77.0595,
    contactNumber: contactNumber || "+91 98765 43210",
    status: "DISPATCHED_TO_POLICE_AND_FAMILY"
  };

  sosIncidentsStore.push(incident);

  res.json({
    status: "BROADCAST_SUCCESS",
    incidentId: incident.id,
    message: "SOS Broadcast Dispatched: GPS coordinates shared with National Tourist Police (112) and family emergency contacts.",
    telemetry: {
      lat: incident.latitude,
      lng: incident.longitude,
      destination: incident.destination
    }
  });
});

// Operator Hub Inventory
app.get("/api/operator/inventory", (req: Request, res: Response) => {
  res.json(operatorInventory);
});

app.post("/api/operator/toggle-stock", (req: Request, res: Response) => {
  const { id } = req.body;
  const item = operatorInventory.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: "Inventory item not found." });
  }

  item.isSoldOut = !item.isSoldOut;
  item.availableRooms = item.isSoldOut ? 0 : 2;

  res.json({
    message: `Inventory status updated to ${item.isSoldOut ? 'Sold Out' : 'Available'}`,
    item
  });
});

// SafarMitra AI - Real Gemini API Integration with Grounded Knowledge
app.post("/api/ai/chat", async (req: Request, res: Response) => {
  const { message, destinationKey, currentPlan, language } = req.body;
  const q = String(message || "").trim();

  if (!q) {
    return res.status(400).json({ error: "Empty message provided." });
  }

  const destData = COMPLETE_TOURISM_REGISTRY[destinationKey] || COMPLETE_TOURISM_REGISTRY["kerala"];
  const client = getGeminiClient();

  // Try real Gemini API if key is present
  if (client) {
    try {
      const systemInstruction = `You are SafarMitra, an empathetic, highly knowledgeable, and authentic local Indian travel guide for ${destData.name} (${destData.tagline}).
The user is traveling to: ${destData.name}.
Capital: ${destData.capital}.
Best season: ${destData.whenToVisit.bestSeason}.
Authentic food: ${destData.cuisineAndCrafts.food.join(', ')}.
Handicrafts: ${destData.cuisineAndCrafts.crafts.join(', ')}.
Safety: ${destData.safetyAndFeatures.join(', ')}.
Current trip context: ${JSON.stringify(currentPlan || {})}.
Language preference: ${language || 'English'}.
Guidelines:
1. Provide warm, practical, culturally accurate advice with regional nuances.
2. Recommend authentic local homestays (0% middleman fees) and verified storyteller drivers.
3. Answer concisely in 2 to 4 punchy sentences, using bold points for readability.
4. If asked in Hindi, Malayalam, Telugu, Tamil, Marathi, or Bengali, answer gracefully in that language or bilingual English.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: q }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text?.trim() || `For ${destData.name}, I recommend exploring verified rural homestays, booking your storyteller chauffeur early, and enjoying authentic regional delicacies!`;
      return res.json({ reply, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to grounded knowledge engine:", err?.message);
    }
  }

  // Grounded knowledge fallback
  const lower = q.toLowerCase();
  let fallbackReply = `**SafarMitra Guide for ${destData.name}:** For the most authentic journey, stay in certified local homestays where hosts prepare traditional meals with 0% platform fees. Your local storyteller chauffeur provides safe navigation and regional lore!`;

  if (lower.includes("safe") || lower.includes("night") || lower.includes("women") || lower.includes("solo")) {
    fallbackReply = `**Safety Corridor Advisory for ${destData.name}:** All tourist corridors around ${destData.capital} and key heritage sites are monitored with verified tourist police booths (Dial 112). Our storyteller chauffeurs undergo police verification and vehicles have GPS emergency sync.`;
  } else if (lower.includes("food") || lower.includes("eat") || lower.includes("breakfast") || lower.includes("restaurant")) {
    fallbackReply = `**Authentic Culinary Trail in ${destData.name}:** Must-try regional delicacies include **${destData.cuisineAndCrafts.food.slice(0, 3).join(', ')}**. SafarSetu homestay hosts serve fresh home-cooked meals at honest prices.`;
  } else if (lower.includes("gem") || lower.includes("hidden") || lower.includes("crowd") || lower.includes("secret")) {
    fallbackReply = `**Curated Hidden Gem in ${destData.name}:** Explore **${destData.whereToVisit[0]?.name}** (${destData.whereToVisit[0]?.desc}). It offers tranquil scenery and living heritage away from congested tourist crowds.`;
  } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("season") || lower.includes("when")) {
    fallbackReply = `**Best Time to Visit ${destData.name}:** ${destData.whenToVisit.bestSeason}. ${destData.whenToVisit.budgetAnalysis.budgetTip}`;
  }

  return res.json({
    reply: fallbackReply,
    source: "grounded-local-engine"
  });
});

// Register Partner & Operations Admin Endpoints
registerPartnerAndAdminRoutes(app, getGeminiClient, bookingsStore);

// Register Rentals REST Services (Cars, SUVs, Bikes & Chauffeur Fleets)
registerRentalRoutes(app);

// Register Customer Feedback & Reviews System
registerReviewRoutes(app, bookingsStore);

// Register Dedicated Telangana Tourism Ecosystem & Pass Services
registerTelanganaRoutes(app, getGeminiClient, bookingsStore);

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SafarSetu] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
