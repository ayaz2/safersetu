import { Express, Request, Response } from 'express';
import { 
  TELANGANA_DESTINATIONS, 
  TELANGANA_ATTRACTIONS, 
  TELANGANA_TRANSPORTS, 
  TELANGANA_LOCAL_TRANSIT, 
  TELANGANA_STAYS, 
  TELANGANA_GUIDES, 
  TELANGANA_RENTALS,
  TELANGANA_CULTURAL_TRAILS 
} from '../data/telanganaData';
import { TelanganaTravelPassData } from '../types/telangana';

// In-memory persistent registry for Telangana Passes
export const telanganaPassesStore: TelanganaTravelPassData[] = [
  {
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
      {
        attractionId: "charminar",
        name: "Charminar & Laad Bazaar",
        category: "Heritage",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: true,
        visitedTimestamp: "Oct 14, 2026 - 10:15 AM",
        verifiedByStaff: "TS-STAFF-HYD-04",
        entryFee: 25
      },
      {
        attractionId: "golconda-fort",
        name: "Golconda Fort & Whispering Galleries",
        category: "Forts",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: true,
        visitedTimestamp: "Oct 14, 2026 - 03:45 PM",
        verifiedByStaff: "TS-STAFF-GOL-02",
        entryFee: 50
      },
      {
        attractionId: "chowmahalla-palace",
        name: "Chowmahalla Palace",
        category: "Heritage",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: false,
        entryFee: 100
      },
      {
        attractionId: "ramappa-temple",
        name: "UNESCO Ramappa Temple (Rudreshwara)",
        category: "Temples",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: false,
        entryFee: 25
      },
      {
        attractionId: "thousand-pillar-temple",
        name: "Thousand Pillar Temple (Rudreswara Swamy)",
        category: "Temples",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: false,
        entryFee: 0
      },
      {
        attractionId: "laknavaram-lake",
        name: "Laknavaram Lake & Suspension Bridges",
        category: "Lakes",
        ticketStatus: "INCLUDED",
        passEligible: true,
        visited: false,
        entryFee: 50
      }
    ],
    transport: {
      segments: [
        {
          from: "Hyderabad (SC)",
          to: "Warangal (WL)",
          mode: "Vande Bharat Express (Train 20701)",
          pnr: "IRCTC-89124-TS",
          provider: "Indian Railways",
          fare: 1302
        }
      ],
      localTransitSummary: "Dedicated Chauffeur Van (Hyderabad) + Auto Rickshaw (Warangal)"
    },
    stay: [
      {
        stayId: "stay-hyd-heritage-homestay",
        name: "Banjara Deccan Heritage Homestay",
        destinationName: "Hyderabad",
        nights: 2,
        roomType: "Deccan Deluxe Double Suite",
        bookingRef: "HOTEL-TS-HYD-981",
        totalCost: 4900
      },
      {
        stayId: "stay-wgl-laknavaram-resort",
        name: "Haritha Laknavaram Island Eco-Cottages",
        destinationName: "Warangal",
        nights: 2,
        roomType: "Waterfront Wooden Eco-Cottage",
        bookingRef: "HOTEL-TS-WGL-312",
        totalCost: 5200
      }
    ],
    guide: {
      guideId: "guide-wgl-shailaja",
      name: "Dr. Shailaja Reddy",
      languages: ["Telugu", "English", "Hindi"],
      duration: "Full Day (Warangal & Ramappa)",
      bookingRef: "GUIDE-TS-419",
      fee: 3400
    },
    rental: {
      vehicleId: "rental-ts-swift",
      vehicleName: "Maruti Swift ZXi (Petrol)",
      days: 4,
      bookingRef: "RENTAL-TS-208",
      totalAmount: 6600
    },
    totalBudget: {
      transportCost: 1302,
      staysCost: 10100,
      attractionsCost: 250,
      guideCost: 3400,
      rentalCost: 6600,
      taxesAndService: 890,
      grandTotal: 22542
    },
    passStatus: "PARTIALLY_USED",
    qrPayloadUrl: "https://safarsetu.in/pass/TS-820194",
    createdAt: "2026-10-10T11:24:00.000Z",
    emergencyContact: {
      touristPolice: "112 / +91 40-27852435",
      telanganaTourismHelpline: "1800-425-46464",
      sheTeams: "100 / WhatsApp: +91 94906 17444"
    }
  }
];

export function registerTelanganaRoutes(
  app: Express, 
  getGeminiClient: () => any, 
  bookingsStore: any[]
) {
  // Destinations
  app.get("/api/telangana/destinations", (req: Request, res: Response) => {
    res.json({
      count: TELANGANA_DESTINATIONS.length,
      destinations: TELANGANA_DESTINATIONS
    });
  });

  // Attractions
  app.get("/api/telangana/attractions", (req: Request, res: Response) => {
    const { destinationId, category, passEligible } = req.query;
    let list = [...TELANGANA_ATTRACTIONS];

    if (destinationId && destinationId !== 'all') {
      list = list.filter(a => a.destinationId === destinationId);
    }
    if (category && category !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === String(category).toLowerCase());
    }
    if (passEligible === 'true') {
      list = list.filter(a => a.passEligible);
    }

    res.json({
      count: list.length,
      attractions: list
    });
  });

  // Transport Options
  app.get("/api/telangana/transport", (req: Request, res: Response) => {
    res.json({
      intercity: TELANGANA_TRANSPORTS,
      localTransit: TELANGANA_LOCAL_TRANSIT
    });
  });

  // Stays
  app.get("/api/telangana/stays", (req: Request, res: Response) => {
    const { destinationId, tier } = req.query;
    let list = [...TELANGANA_STAYS];
    if (destinationId && destinationId !== 'all') {
      list = list.filter(s => s.destinationId === destinationId);
    }
    if (tier && tier !== 'all') {
      list = list.filter(s => s.tier.toLowerCase() === String(tier).toLowerCase());
    }
    res.json({
      count: list.length,
      stays: list
    });
  });

  // Guides
  app.get("/api/telangana/guides", (req: Request, res: Response) => {
    const { destinationId } = req.query;
    let list = [...TELANGANA_GUIDES];
    if (destinationId && destinationId !== 'all') {
      list = list.filter(g => g.destinationId === destinationId);
    }
    res.json({
      count: list.length,
      guides: list
    });
  });

  // Rentals
  app.get("/api/telangana/rentals", (req: Request, res: Response) => {
    const { category } = req.query;
    let list = [...TELANGANA_RENTALS];
    if (category && category !== 'all') {
      list = list.filter(r => r.category.toLowerCase() === String(category).toLowerCase());
    }
    res.json({
      count: list.length,
      rentals: list
    });
  });

  // Cultural Trails
  app.get("/api/telangana/cultural-trails", (req: Request, res: Response) => {
    res.json({
      trails: TELANGANA_CULTURAL_TRAILS
    });
  });

  // Passes - List
  app.get("/api/telangana/passes", (req: Request, res: Response) => {
    res.json({
      count: telanganaPassesStore.length,
      passes: telanganaPassesStore
    });
  });

  // Passes - Fetch Specific Pass by ID
  app.get("/api/telangana/passes/:passId", (req: Request, res: Response) => {
    const pass = telanganaPassesStore.find(p => p.passId.toUpperCase() === req.params.passId.toUpperCase());
    if (!pass) {
      return res.status(404).json({ error: `Telangana Travel Pass ${req.params.passId} not found.` });
    }
    res.json(pass);
  });

  // Passes - Create New Pass
  app.post("/api/telangana/passes", (req: Request, res: Response) => {
    const {
      travelerName,
      travelerPhone,
      travelerEmail,
      tripDates,
      travelersCount,
      tripStyle,
      travelerType,
      destinations,
      attractions,
      transport,
      stay,
      guide,
      rental,
      totalBudget
    } = req.body;

    if (!travelerName || !destinations || destinations.length === 0) {
      return res.status(400).json({ error: "Missing required traveler or destination information." });
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const passId = `TS-${randomNum}`;
    const tripId = `TS-TRIP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: TelanganaTravelPassData = {
      passId,
      tripId,
      travelerName,
      travelerPhone: travelerPhone || "+91 98401 23456",
      travelerEmail: travelerEmail || "traveler@safarsetu.in",
      tripDates: tripDates || "Oct 14 - Oct 18, 2026",
      travelersCount: Number(travelersCount) || 2,
      tripStyle: tripStyle || "Comfort",
      travelerType: travelerType || "Couple",
      destinations,
      attractions: (attractions || []).map((a: any) => ({
        attractionId: a.attractionId || a.id,
        name: a.name,
        category: a.category || "Heritage",
        ticketStatus: a.ticketStatus || "INCLUDED",
        passEligible: a.passEligible !== false,
        visited: false,
        entryFee: Number(a.entryFee) || 0
      })),
      transport: transport || { segments: [] },
      stay: stay || [],
      guide,
      rental,
      totalBudget: totalBudget || {
        transportCost: 0,
        staysCost: 0,
        attractionsCost: 0,
        guideCost: 0,
        rentalCost: 0,
        taxesAndService: 0,
        grandTotal: 0
      },
      passStatus: "ACTIVE",
      qrPayloadUrl: `https://safarsetu.in/pass/${passId}`,
      createdAt: new Date().toISOString(),
      emergencyContact: {
        touristPolice: "112 / +91 40-27852435",
        telanganaTourismHelpline: "1800-425-46464",
        sheTeams: "100 / WhatsApp: +91 94906 17444"
      }
    };

    telanganaPassesStore.unshift(newPass);

    // Also register in SafarSetu's core bookings store so it shows up in "My Trips"
    const bookingRecord = {
      id: passId,
      pnr: `${tripId}-TS`,
      destinationKey: "telangana",
      destinationName: `Telangana Tourism (${destinations.join(' & ')})`,
      origin: "Hyderabad",
      dates: tripDates,
      nights: stay && stay.length > 0 ? stay.reduce((acc: number, s: any) => acc + (s.nights || 1), 0) : 4,
      guests: Number(travelersCount) || 2,
      durationDays: 5,
      transportTitle: transport?.segments?.[0]?.mode || "Custom Multimodal Transit",
      stayName: stay?.[0]?.name || "Verified Telangana Stay",
      driverName: guide?.name || "Assigned Storyteller Driver",
      totalCost: `₹${(newPass.totalBudget.grandTotal || 18500).toLocaleString('en-IN')}`,
      numericTotal: newPass.totalBudget.grandTotal || 18500,
      status: "Confirmed",
      paymentMethod: "Telangana Pass Express UPI",
      timestamp: new Date().toLocaleDateString('en-IN'),
      travelerName,
      travelerPhone
    };

    bookingsStore.unshift(bookingRecord);

    res.status(201).json({
      message: "Telangana Travel Pass generated successfully.",
      pass: newPass,
      bookingRecord
    });
  });

  // Passes - Verify / Mark Usage (Gate Scanner simulation)
  app.post("/api/telangana/passes/:passId/verify", (req: Request, res: Response) => {
    const pass = telanganaPassesStore.find(p => p.passId.toUpperCase() === req.params.passId.toUpperCase());
    if (!pass) {
      return res.status(404).json({ error: `Pass ${req.params.passId} not found.` });
    }

    const { attractionId, staffId, action } = req.body;

    if (action === 'mark_attraction_used') {
      const attraction = pass.attractions.find(a => a.attractionId === attractionId);
      if (!attraction) {
        return res.status(404).json({ error: "Attraction not found on this pass." });
      }

      if (attraction.visited) {
        return res.status(400).json({
          error: "Attraction entry already used for this pass.",
          alreadyVisitedAt: attraction.visitedTimestamp
        });
      }

      attraction.visited = true;
      attraction.visitedTimestamp = new Date().toLocaleDateString('en-IN') + ' - ' + new Date().toLocaleTimeString('en-IN');
      attraction.verifiedByStaff = staffId || "TS-GATE-STAFF";

      // Update pass status
      const totalCount = pass.attractions.length;
      const visitedCount = pass.attractions.filter(a => a.visited).length;
      if (visitedCount === totalCount) {
        pass.passStatus = "USED";
      } else if (visitedCount > 0) {
        pass.passStatus = "PARTIALLY_USED";
      }

      return res.json({
        success: true,
        message: `Attraction entry successfully validated and marked used for ${attraction.name}.`,
        pass
      });
    }

    // Default verify status inspection
    const visitedCount = pass.attractions.filter(a => a.visited).length;
    res.json({
      valid: pass.passStatus === 'ACTIVE' || pass.passStatus === 'PARTIALLY_USED',
      passStatus: pass.passStatus,
      travelerName: pass.travelerName,
      travelersCount: pass.travelersCount,
      totalAttractions: pass.attractions.length,
      visitedAttractions: visitedCount,
      remainingAttractions: pass.attractions.length - visitedCount,
      pass
    });
  });

  // AI Itinerary Suggestion for Telangana
  app.post("/api/telangana/ai/suggest", async (req: Request, res: Response) => {
    const { durationDays, budgetLevel, style, preferences } = req.body;
    const client = getGeminiClient();

    if (client) {
      try {
        const prompt = `Generate a realistic, optimized day-by-day travel itinerary for Telangana tourism.
Duration: ${durationDays || 4} days.
Budget Level: ${budgetLevel || 'Comfort'}.
Style: ${style || 'Heritage & Cultural'}.
Preferences: ${preferences || 'Key attractions in Hyderabad and Warangal, authentic food, zero commission stays'}.

Return ONLY valid JSON in this structure:
{
  "title": "...",
  "summary": "...",
  "recommendedDestinations": ["Hyderabad", "Warangal"],
  "days": [
    {
      "dayNumber": 1,
      "title": "...",
      "destination": "Hyderabad",
      "activities": [
        {
          "time": "09:30 AM",
          "title": "...",
          "attractionId": "charminar",
          "durationHours": 2,
          "cost": 25,
          "notes": "..."
        }
      ]
    }
  ],
  "estimatedBudget": {
    "transport": 1200,
    "stays": 6000,
    "attractions": 300,
    "total": 7500
  }
}`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.6,
            responseMimeType: 'application/json'
          }
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          return res.json(parsed);
        }
      } catch (err: any) {
        console.warn("Gemini Telangana suggestion failed, falling back to grounded plan:", err?.message);
      }
    }

    // Grounded fallback plan
    res.json({
      title: "Telangana Heritage & UNESCO Jewels (Curated)",
      summary: "A balanced 4-day journey taking you through the regal Nizami heritage of Hyderabad and the 13th-century Kakatiya stone marvels of Warangal.",
      recommendedDestinations: ["Hyderabad", "Warangal"],
      days: [
        {
          dayNumber: 1,
          title: "Regal Hyderabad: Charminar & Chowmahalla Palace",
          destination: "Hyderabad",
          activities: [
            { time: "09:30 AM", title: "Charminar & Laad Bazaar Heritage Walk", attractionId: "charminar", durationHours: 2, cost: 25, notes: "Morning Irani chai & Osmania biscuits at Nimrah Cafe." },
            { time: "01:30 PM", title: "Chowmahalla Palace & Vintage Cars", attractionId: "chowmahalla-palace", durationHours: 2, cost: 100, notes: "Explore Khilwat Mubarak and Belgian crystal chandeliers." },
            { time: "05:00 PM", title: "Hussain Sagar Lake & Sunset Buddha Ferry", attractionId: "hussain-sagar", durationHours: 1.5, cost: 80, notes: "Speedboat ride to Gibraltar Rock." }
          ]
        },
        {
          dayNumber: 2,
          title: "Citadels of Diamonds: Golconda & Qutb Shahi Tombs",
          destination: "Hyderabad",
          activities: [
            { time: "09:30 AM", title: "Golconda Fort & Whispering Galleries", attractionId: "golconda-fort", durationHours: 3, cost: 50, notes: "Acoustic engineering demonstration at Fateh Darwaza." },
            { time: "02:30 PM", title: "Qutb Shahi Tombs Restored Necropolis", attractionId: "qutb-shahi-tombs", durationHours: 2, cost: 40, notes: "Persian dome architecture and landscaped gardens." }
          ]
        },
        {
          dayNumber: 3,
          title: "Kakatiya Dynasty: Thousand Pillar & Warangal Fort",
          destination: "Warangal",
          activities: [
            { time: "07:30 AM", title: "Vande Bharat Express to Warangal", durationHours: 1.5, cost: 650, notes: "Comfortable early morning scenic rail transit." },
            { time: "11:00 AM", title: "Thousand Pillar Temple & Monolithic Nandi", attractionId: "thousand-pillar-temple", durationHours: 1.5, cost: 0, notes: "Black basalt carving and trikuta architecture." },
            { time: "03:30 PM", title: "Warangal Fort & Kakatiya Kala Thoranam", attractionId: "warangal-fort", durationHours: 2, cost: 25, notes: "The stone arch symbol of Telangana state emblem." }
          ]
        },
        {
          dayNumber: 4,
          title: "UNESCO Ramappa & Laknavaram Lake",
          destination: "Warangal",
          activities: [
            { time: "09:00 AM", title: "UNESCO Ramappa Temple (Rudreshwara)", attractionId: "ramappa-temple", durationHours: 2.5, cost: 25, notes: "Floating bricks and earthquake-resistant sandbox plinth." },
            { time: "02:00 PM", title: "Laknavaram Lake & Suspension Bridges", attractionId: "laknavaram-lake", durationHours: 3, cost: 50, notes: "Island walk across suspension bridges and boat cruise." }
          ]
        }
      ],
      estimatedBudget: {
        transport: 1300,
        stays: 7000,
        attractions: 390,
        total: 8690
      }
    });
  });
}
