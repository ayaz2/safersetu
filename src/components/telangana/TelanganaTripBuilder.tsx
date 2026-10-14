import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Car, 
  Home, 
  UserCheck, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  DollarSign,
  ArrowLeft,
  X,
  Info
} from 'lucide-react';
import { 
  TELANGANA_DESTINATIONS, 
  TELANGANA_ATTRACTIONS, 
  TELANGANA_TRANSPORTS, 
  TELANGANA_LOCAL_TRANSIT, 
  TELANGANA_STAYS, 
  TELANGANA_GUIDES, 
  TELANGANA_RENTALS 
} from '../../data/telanganaData';
import { 
  TelanganaDestination, 
  TelanganaAttraction, 
  TelanganaStay, 
  TelanganaGuide, 
  TelanganaRentalVehicle,
  TelanganaTransportOption,
  ItineraryDay,
  ItineraryActivity,
  ScheduleConflict,
  TripStyleType,
  TravelerGroupType,
  TelanganaTravelPassData
} from '../../types/telangana';

interface TelanganaTripBuilderProps {
  onPassGenerated: (pass: TelanganaTravelPassData) => void;
  onCancel: () => void;
  initialDestinationIds?: string[];
  initialAttractionIds?: string[];
}

export const TelanganaTripBuilder: React.FC<TelanganaTripBuilderProps> = ({
  onPassGenerated,
  onCancel,
  initialDestinationIds = ['hyderabad', 'warangal'],
  initialAttractionIds = ['charminar', 'golconda-fort', 'chowmahalla-palace', 'ramappa-temple', 'thousand-pillar-temple', 'laknavaram-lake']
}) => {
  // Step navigation inside builder
  const [activeTab, setActiveTab] = useState<'destinations' | 'itinerary' | 'transport' | 'stays' | 'guide' | 'rentals' | 'budget'>('destinations');

  // Trip Core Preferences
  const [travelerName, setTravelerName] = useState('Priya Sundaram');
  const [travelerPhone, setTravelerPhone] = useState('+91 98401 23456');
  const [tripDates, setTripDates] = useState('Oct 14 - Oct 18, 2026');
  const [travelersCount, setTravelersCount] = useState(2);
  const [tripStyle, setTripStyle] = useState<TripStyleType>('Comfort');
  const [travelerType, setTravelerType] = useState<TravelerGroupType>('Couple');
  const [durationDays, setDurationDays] = useState<number>(4);

  // Selected Components
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>(initialDestinationIds);
  const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>(initialAttractionIds);
  const [selectedTransportId, setSelectedTransportId] = useState<string>('tr-hyd-wgl-vb');
  const [selectedStayId, setSelectedStayId] = useState<string>('stay-hyd-heritage-homestay');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('guide-wgl-shailaja');
  const [selectedRentalId, setSelectedRentalId] = useState<string>('rental-ts-swift');

  // User Budget Limit & Alert
  const [maxBudgetLimit, setMaxBudgetLimit] = useState<number>(25000);
  const [isGeneratingPass, setIsGeneratingPass] = useState(false);

  // Category filter for attraction explorer
  const [attractionCategoryFilter, setAttractionCategoryFilter] = useState<string>('all');

  // Days & Itinerary Schedule State
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      date: "Day 1 (Arrival & Old City)",
      destinationId: "hyderabad",
      destinationName: "Hyderabad",
      title: "Charminar, Palaces & Nizami Heritage",
      activities: [
        { id: "act-1", attractionId: "charminar", title: "Charminar & Laad Bazaar", time: "09:30", durationHours: 1.5, type: "attraction", cost: 25 },
        { id: "act-2", attractionId: "chowmahalla-palace", title: "Chowmahalla Palace & Vintage Cars", time: "11:30", durationHours: 2.0, type: "attraction", cost: 100 },
        { id: "act-3", title: "Authentic Dum Biryani & Irani Chai Lunch", time: "14:00", durationHours: 1.5, type: "meal", cost: 350 },
        { id: "act-4", attractionId: "hussain-sagar", title: "Hussain Sagar Lake & Sunset Buddha Ferry", time: "17:30", durationHours: 1.5, type: "attraction", cost: 80 }
      ]
    },
    {
      dayNumber: 2,
      date: "Day 2 (Citadels & Whispering Domes)",
      destinationId: "hyderabad",
      destinationName: "Hyderabad",
      title: "Golconda Fort & Qutb Shahi Restored Necropolis",
      activities: [
        { id: "act-5", attractionId: "golconda-fort", title: "Golconda Fort & Whispering Galleries", time: "09:00", durationHours: 3.0, type: "attraction", cost: 50 },
        { id: "act-6", attractionId: "qutb-shahi-tombs", title: "Qutb Shahi Heritage Park & Tombs", time: "14:30", durationHours: 2.0, type: "attraction", cost: 40 }
      ]
    },
    {
      dayNumber: 3,
      date: "Day 3 (Kakatiya Stone Heritage)",
      destinationId: "warangal",
      destinationName: "Warangal",
      title: "Vande Bharat Transit & UNESCO Ramappa Temple",
      activities: [
        { id: "act-7", title: "Vande Bharat Express (SC ➔ WL)", time: "06:00", durationHours: 1.5, type: "transit", cost: 651 },
        { id: "act-8", attractionId: "ramappa-temple", title: "UNESCO Ramappa Temple (Floating Bricks)", time: "10:30", durationHours: 2.5, type: "attraction", cost: 25 },
        { id: "act-9", attractionId: "laknavaram-lake", title: "Laknavaram Lake & Suspension Bridges", time: "15:00", durationHours: 2.5, type: "attraction", cost: 50 }
      ]
    },
    {
      dayNumber: 4,
      date: "Day 4 (Ancient Citadel & Return)",
      destinationId: "warangal",
      destinationName: "Warangal",
      title: "Thousand Pillar Temple & Warangal Fort",
      activities: [
        { id: "act-10", attractionId: "thousand-pillar-temple", title: "Thousand Pillar Temple (Rudreswara)", time: "08:30", durationHours: 1.5, type: "attraction", cost: 0 },
        { id: "act-11", attractionId: "warangal-fort", title: "Warangal Fort Ruins & Stone Thoranam", time: "11:00", durationHours: 2.0, type: "attraction", cost: 25 }
      ]
    }
  ]);

  // Destination toggle
  const toggleDestination = (destId: string) => {
    if (selectedDestinationIds.includes(destId)) {
      if (selectedDestinationIds.length === 1) return; // keep at least 1
      setSelectedDestinationIds(prev => prev.filter(id => id !== destId));
    } else {
      setSelectedDestinationIds(prev => [...prev, destId]);
    }
  };

  // Attraction toggle
  const toggleAttraction = (attraction: TelanganaAttraction) => {
    if (selectedAttractionIds.includes(attraction.id)) {
      setSelectedAttractionIds(prev => prev.filter(id => id !== attraction.id));
      // Remove from itinerary if present
      setItineraryDays(prev => prev.map(d => ({
        ...d,
        activities: d.activities.filter(a => a.attractionId !== attraction.id)
      })));
    } else {
      setSelectedAttractionIds(prev => [...prev, attraction.id]);
      // Add to Day 1 or relevant day
      setItineraryDays(prev => {
        const targetDay = prev.find(d => d.destinationId === attraction.destinationId) || prev[0];
        const newAct: ItineraryActivity = {
          id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          attractionId: attraction.id,
          title: attraction.name,
          time: attraction.openingHours.openTime || "10:00",
          durationHours: attraction.recommendedDurationHours || 2.0,
          type: "attraction",
          cost: attraction.entryFee,
          ticketStatus: attraction.ticketStatus
        };
        return prev.map(d => d.dayNumber === targetDay.dayNumber ? {
          ...d,
          activities: [...d.activities, newAct]
        } : d);
      });
    }
  };

  // Reorder activities in day
  const moveActivity = (dayNumber: number, actIndex: number, direction: 'up' | 'down') => {
    setItineraryDays(prev => prev.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      const acts = [...day.activities];
      const targetIndex = direction === 'up' ? actIndex - 1 : actIndex + 1;
      if (targetIndex < 0 || targetIndex >= acts.length) return day;
      const temp = acts[actIndex];
      acts[actIndex] = acts[targetIndex];
      acts[targetIndex] = temp;
      return { ...day, activities: acts };
    }));
  };

  // Remove activity from day
  const removeActivity = (dayNumber: number, actId: string) => {
    setItineraryDays(prev => prev.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      return { ...day, activities: day.activities.filter(a => a.id !== actId) };
    }));
  };

  // Update activity time
  const updateActivityTime = (dayNumber: number, actId: string, newTime: string) => {
    setItineraryDays(prev => prev.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.map(a => a.id === actId ? { ...a, time: newTime } : a)
      };
    }));
  };

  // Move activity to another day
  const moveActivityToDay = (currentDayNumber: number, actId: string, targetDayNumber: number) => {
    if (currentDayNumber === targetDayNumber) return;
    let activityToMove: ItineraryActivity | undefined;
    setItineraryDays(prev => {
      const fromDay = prev.find(d => d.dayNumber === currentDayNumber);
      if (fromDay) {
        activityToMove = fromDay.activities.find(a => a.id === actId);
      }
      if (!activityToMove) return prev;

      return prev.map(day => {
        if (day.dayNumber === currentDayNumber) {
          return { ...day, activities: day.activities.filter(a => a.id !== actId) };
        }
        if (day.dayNumber === targetDayNumber) {
          return { ...day, activities: [...day.activities, activityToMove!] };
        }
        return day;
      });
    });
  };

  // SMART CONFLICT VALIDATOR
  const conflicts: ScheduleConflict[] = useMemo(() => {
    const list: ScheduleConflict[] = [];

    itineraryDays.forEach(day => {
      day.activities.forEach(act => {
        if (act.attractionId) {
          const matchedAtt = TELANGANA_ATTRACTIONS.find(a => a.id === act.attractionId);
          if (matchedAtt && matchedAtt.openingHours) {
            const openTimeStr = matchedAtt.openingHours.openTime; // e.g. "09:30"
            const closeTimeStr = matchedAtt.openingHours.closeTime; // e.g. "17:30"

            const [actH, actM] = act.time.split(':').map(Number);
            const actTotalMins = actH * 60 + actM;
            const actEndMins = actTotalMins + act.durationHours * 60;

            const [closeH, closeM] = closeTimeStr.split(':').map(Number);
            const closeTotalMins = closeH * 60 + closeM;

            const [openH, openM] = openTimeStr.split(':').map(Number);
            const openTotalMins = openH * 60 + openM;

            if (actTotalMins < openTotalMins) {
              list.push({
                id: `conf-early-${act.id}`,
                type: 'closing_hours',
                title: `${matchedAtt.name} Not Yet Open`,
                message: `${matchedAtt.name} opens at ${matchedAtt.openingHours.openDisplay.split(' ')[0]}. Your visit is scheduled earlier at ${act.time}.`,
                severity: 'warning',
                dayNumber: day.dayNumber,
                activityId: act.id,
                suggestedAction: `Adjust start time to ${openTimeStr}`
              });
            } else if (actEndMins > closeTotalMins) {
              list.push({
                id: `conf-late-${act.id}`,
                type: 'closing_hours',
                title: `Closing Hours Conflict: ${matchedAtt.name}`,
                message: `${matchedAtt.name} closes at ${matchedAtt.openingHours.openDisplay.split('–')[1]?.trim() || '5:30 PM'}. Your planned visit ending at ${Math.floor(actEndMins/60)}:${String(actEndMins%60).padStart(2,'0')} exceeds closing time.`,
                severity: 'error',
                dayNumber: day.dayNumber,
                activityId: act.id,
                suggestedAction: `Adjust start time to 2 hours before closing`
              });
            }
          }
        }
      });
    });

    return list;
  }, [itineraryDays]);

  // LIVE DYNAMIC BUDGET CALCULATIONS
  const selectedTransport = TELANGANA_TRANSPORTS.find(t => t.id === selectedTransportId);
  const selectedStay = TELANGANA_STAYS.find(s => s.id === selectedStayId);
  const selectedGuide = TELANGANA_GUIDES.find(g => g.id === selectedGuideId);
  const selectedRental = TELANGANA_RENTALS.find(r => r.id === selectedRentalId);

  const budgetBreakdown = useMemo(() => {
    const transportCost = (selectedTransport ? selectedTransport.totalFare : 650) * travelersCount;
    const staysCost = (selectedStay ? selectedStay.pricePerNight : 2200) * (durationDays || 4);
    const attractionsCost = selectedAttractionIds.reduce((sum, id) => {
      const att = TELANGANA_ATTRACTIONS.find(a => a.id === id);
      return sum + (att ? att.entryFee * travelersCount : 0);
    }, 0);
    const guideCost = selectedGuide ? selectedGuide.rates.fullDay : 0;
    const rentalCost = selectedRental ? selectedRental.pricePerDay * (durationDays || 4) : 0;
    const subtotal = transportCost + staysCost + attractionsCost + guideCost + rentalCost;
    const taxesAndService = Math.round(subtotal * 0.05); // standard 5% GST
    const grandTotal = subtotal + taxesAndService;

    return {
      transportCost,
      staysCost,
      attractionsCost,
      guideCost,
      rentalCost,
      taxesAndService,
      grandTotal,
      isOverBudget: grandTotal > maxBudgetLimit,
      overAmount: grandTotal - maxBudgetLimit
    };
  }, [selectedTransport, selectedStay, selectedGuide, selectedRental, selectedAttractionIds, travelersCount, durationDays, maxBudgetLimit]);

  // Auto-Fix Conflict Helper
  const handleAutoFixConflict = (conflict: ScheduleConflict) => {
    if (conflict.activityId) {
      updateActivityTime(conflict.dayNumber, conflict.activityId, "10:00");
    }
  };

  // GENERATE PASS
  const handleGeneratePass = async () => {
    setIsGeneratingPass(true);
    try {
      const payload = {
        travelerName,
        travelerPhone,
        travelerEmail: "traveler@safarsetu.in",
        tripDates,
        travelersCount,
        tripStyle,
        travelerType,
        destinations: selectedDestinationIds.map(id => TELANGANA_DESTINATIONS.find(d => d.id === id)?.name || id),
        attractions: selectedAttractionIds.map(id => {
          const att = TELANGANA_ATTRACTIONS.find(a => a.id === id);
          return {
            attractionId: id,
            name: att?.name || id,
            category: att?.category || "Heritage",
            ticketStatus: att?.ticketStatus || "INCLUDED",
            passEligible: att?.passEligible !== false,
            entryFee: att?.entryFee || 25
          };
        }),
        transport: {
          segments: selectedTransport ? [
            {
              from: selectedTransport.from,
              to: selectedTransport.to,
              mode: selectedTransport.mode + ' (' + selectedTransport.providerName + ')',
              pnr: `IRCTC-${Math.floor(10000 + Math.random() * 90000)}-TS`,
              provider: selectedTransport.providerName,
              fare: selectedTransport.totalFare * travelersCount
            }
          ] : [],
          localTransitSummary: "Telangana Local Chauffeur / Metro Corridors Active"
        },
        stay: selectedStay ? [
          {
            stayId: selectedStay.id,
            name: selectedStay.name,
            destinationName: selectedStay.destinationName,
            nights: durationDays,
            roomType: selectedStay.roomType,
            bookingRef: `HOTEL-TS-${Math.floor(100 + Math.random() * 900)}`,
            totalCost: selectedStay.pricePerNight * durationDays
          }
        ] : [],
        guide: selectedGuide ? {
          guideId: selectedGuide.id,
          name: selectedGuide.name,
          languages: selectedGuide.languages,
          duration: "Full Day (Certified Storyteller)",
          bookingRef: `GUIDE-TS-${Math.floor(100 + Math.random() * 900)}`,
          fee: selectedGuide.rates.fullDay
        } : undefined,
        rental: selectedRental ? {
          vehicleId: selectedRental.id,
          vehicleName: selectedRental.name,
          days: durationDays,
          bookingRef: `RENTAL-TS-${Math.floor(100 + Math.random() * 900)}`,
          totalAmount: selectedRental.pricePerDay * durationDays
        } : undefined,
        totalBudget: {
          transportCost: budgetBreakdown.transportCost,
          staysCost: budgetBreakdown.staysCost,
          attractionsCost: budgetBreakdown.attractionsCost,
          guideCost: budgetBreakdown.guideCost,
          rentalCost: budgetBreakdown.rentalCost,
          taxesAndService: budgetBreakdown.taxesAndService,
          grandTotal: budgetBreakdown.grandTotal
        }
      };

      const res = await fetch('/api/telangana/passes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        onPassGenerated(json.pass);
      } else {
        // Fallback pass if network error
        const fallbackPass: TelanganaTravelPassData = {
          passId: `TS-${Math.floor(100000 + Math.random() * 900000)}`,
          tripId: `TS-TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
          travelerName,
          travelerPhone,
          travelerEmail: "traveler@safarsetu.in",
          tripDates,
          travelersCount,
          tripStyle,
          travelerType,
          destinations: payload.destinations,
          attractions: payload.attractions.map(a => ({ ...a, visited: false })),
          transport: payload.transport,
          stay: payload.stay,
          guide: payload.guide,
          rental: payload.rental,
          totalBudget: payload.totalBudget,
          passStatus: 'ACTIVE',
          qrPayloadUrl: 'https://safarsetu.in/pass/TS-DEMO',
          createdAt: new Date().toISOString(),
          emergencyContact: {
            touristPolice: '112 / +91 40-27852435',
            telanganaTourismHelpline: '1800-425-46464',
            sheTeams: '100 / WhatsApp: +91 94906 17444'
          }
        };
        onPassGenerated(fallbackPass);
      }
    } catch (e) {
      // Offline fallback
      const fallbackPass: TelanganaTravelPassData = {
        passId: `TS-${Math.floor(100000 + Math.random() * 900000)}`,
        tripId: `TS-TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
        travelerName,
        travelerPhone,
        travelerEmail: "traveler@safarsetu.in",
        tripDates,
        travelersCount,
        tripStyle,
        travelerType,
        destinations: selectedDestinationIds,
        attractions: selectedAttractionIds.map(id => ({
          attractionId: id,
          name: TELANGANA_ATTRACTIONS.find(a => a.id === id)?.name || id,
          category: 'Heritage',
          ticketStatus: 'INCLUDED',
          passEligible: true,
          visited: false,
          entryFee: 25
        })),
        transport: { segments: [] },
        stay: [],
        totalBudget: {
          transportCost: budgetBreakdown.transportCost,
          staysCost: budgetBreakdown.staysCost,
          attractionsCost: budgetBreakdown.attractionsCost,
          guideCost: budgetBreakdown.guideCost,
          rentalCost: budgetBreakdown.rentalCost,
          taxesAndService: budgetBreakdown.taxesAndService,
          grandTotal: budgetBreakdown.grandTotal
        },
        passStatus: 'ACTIVE',
        qrPayloadUrl: 'https://safarsetu.in/pass/TS-FALLBACK',
        createdAt: new Date().toISOString(),
        emergencyContact: {
          touristPolice: '112',
          telanganaTourismHelpline: '1800-425-46464',
          sheTeams: '100'
        }
      };
      onPassGenerated(fallbackPass);
    } finally {
      setIsGeneratingPass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Return to Telangana Showcase"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Customization Engine
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Zero Surcharge • Direct Government Verified Rates
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 mt-1">
              Build Your Custom Telangana Journey
            </h1>
          </div>
        </div>

        {/* Quick Trip Preferences Summary */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Solo</option>
              <option value={2}>2 Couple</option>
              <option value={4}>4 Family</option>
              <option value={6}>6 Group</option>
            </select>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value={3}>3 Days</option>
              <option value={4}>4 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={tripStyle}
              onChange={(e) => setTripStyle(e.target.value as TripStyleType)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="Budget">Budget Tier</option>
              <option value="Comfort">Comfort Tier</option>
              <option value="Premium">Premium Tier</option>
              <option value="Luxury">Luxury Heritage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conflicts & Smart Validation Banner (if any) */}
      {conflicts.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Smart Itinerary Conflict Detected ({conflicts.length} alert{conflicts.length > 1 ? 's' : ''})
              </h3>
              <p className="text-xs text-amber-900/80">
                SafarSetu validated your timetable against official monument opening hours. We won&apos;t silently alter your plans.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {conflicts.map(conf => (
              <div key={conf.id} className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">Day {conf.dayNumber}: {conf.title}</span>
                  <p className="text-slate-600 mt-0.5">{conf.message}</p>
                </div>
                {conf.suggestedAction && (
                  <button
                    onClick={() => handleAutoFixConflict(conf)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shrink-0"
                  >
                    Auto-Adjust Time
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Over-Limit Warning Banner (if any) */}
      {budgetBreakdown.isOverBudget && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-rose-900">
                Trip estimate (₹{budgetBreakdown.grandTotal.toLocaleString('en-IN')}) exceeds your set budget limit of ₹{maxBudgetLimit.toLocaleString('en-IN')} by ₹{budgetBreakdown.overAmount.toLocaleString('en-IN')}.
              </p>
              <p className="text-rose-700 mt-0.5">
                Tip: Switching to a verified Haritha homestay or self-drive vehicle easily recovers ₹2,000–₹4,000 without sacrificing itinerary coverage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('stays')}
            className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shrink-0"
          >
            Review Stays &amp; Transit
          </button>
        </div>
      )}

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-[720px] gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'destinations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Destinations &amp; Sights</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-700 px-1.5 py-0.2 rounded font-mono">
              {selectedAttractionIds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'itinerary'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Schedule &amp; Timing</span>
            {conflicts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('transport')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'transport'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>3. Multimodal Transit</span>
          </button>

          <button
            onClick={() => setActiveTab('stays')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'stays'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>4. Stays</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>5. Guide / Storyteller</span>
          </button>

          <button
            onClick={() => setActiveTab('rentals')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'rentals'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-500" />
            <span>6. Rentals</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-amber-600 text-white shadow-xs font-black'
                : 'bg-amber-50 text-amber-950 hover:bg-amber-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Budget &amp; Pass</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DESTINATIONS & ATTRACTIONS PICKER */}
      {activeTab === 'destinations' && (
        <div className="space-y-6">
          
          {/* Destination Chips */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Selected Telangana Regions (Click to Add / Remove)
            </h3>
            <div className="flex items-center gap-2.5 flex-wrap">
              {TELANGANA_DESTINATIONS.map(dest => {
                const isSelected = selectedDestinationIds.includes(dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => toggleDestination(dest.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{dest.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attraction Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {['all', 'Heritage', 'Forts', 'Temples', 'Lakes', 'Museums', 'Nature', 'Waterfalls'].map(cat => (
              <button
                key={cat}
                onClick={() => setAttractionCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
                  attractionCategoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'All Sights' : cat}
              </button>
            ))}
          </div>

          {/* Attractions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TELANGANA_ATTRACTIONS
              .filter(att => selectedDestinationIds.includes(att.destinationId))
              .filter(att => attractionCategoryFilter === 'all' || att.category.toLowerCase() === attractionCategoryFilter.toLowerCase())
              .map(att => {
                const isSelected = selectedAttractionIds.includes(att.id);
                return (
                  <div
                    key={att.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <img
                        src={att.image}
                        alt={att.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                          {att.destinationName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          {att.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
                          Pass: {att.ticketStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {att.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {att.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{att.openingHours.openDisplay}</span>
                          </span>
                          <span>•</span>
                          <span>Fee: ₹{att.entryFee}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAttraction(att)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-100 text-amber-950 hover:bg-rose-100 hover:text-rose-900'
                            : 'bg-slate-900 text-white hover:bg-amber-600'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-700" />
                            <span>Included in Trip (Click to Remove)</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Itinerary &amp; Pass</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveTab('itinerary')}
              className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Next: Customize Daily Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL DAY-BY-DAY ITINERARY BUILDER */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Smart Schedule Controls:</strong> Reorder activities with the arrow buttons, change arrival times, or reassign stops across days.
              </span>
            </div>
            <span className="font-bold text-amber-900 shrink-0">
              {durationDays} Days Planned
            </span>
          </div>

          <div className="space-y-6">
            {itineraryDays.slice(0, durationDays).map((day) => (
              <div key={day.dayNumber} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                
                {/* Day Header */}
                <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-white">
                        {day.title}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {day.destinationName} • {day.activities.length} planned stop{day.activities.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {day.activities.length > 0 ? (
                    day.activities.map((act, idx) => {
                      const matchedAttraction = act.attractionId ? TELANGANA_ATTRACTIONS.find(a => a.id === act.attractionId) : null;
                      return (
                        <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                          
                          {/* Time & Activity Details */}
                          <div className="flex items-start gap-3">
                            <div className="w-20 shrink-0">
                              <input
                                type="time"
                                value={act.time}
                                onChange={(e) => updateActivityTime(day.dayNumber, act.id, e.target.value)}
                                className="w-full text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              />
                              <p className="text-[10px] text-slate-400 mt-0.5">{act.durationHours}h duration</p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                  {act.title}
                                </span>
                                {matchedAttraction && (
                                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                                    {matchedAttraction.category}
                                  </span>
                                )}
                              </div>
                              {matchedAttraction && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Hours: {matchedAttraction.openingHours.openDisplay} • Entry: ₹{matchedAttraction.entryFee} (Included in Pass)
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Controls: Move Up/Down, Reassign Day, Delete */}
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {/* Reassign day selector */}
                            <select
                              value={day.dayNumber}
                              onChange={(e) => moveActivityToDay(day.dayNumber, act.id, Number(e.target.value))}
                              className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg px-2 py-1"
                              title="Shift to another day"
                            >
                              {itineraryDays.slice(0, durationDays).map(d => (
                                <option key={d.dayNumber} value={d.dayNumber}>
                                  Day {d.dayNumber}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => moveActivity(day.dayNumber, idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => moveActivity(day.dayNumber, idx, 'down')}
                              disabled={idx === day.activities.length - 1}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => removeActivity(day.dayNumber, act.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition ml-1"
                              title="Remove Activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No stops scheduled on this day yet. Select sights from tab 1 to fill this day.
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('destinations')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Back to Sights
            </button>
            <button
              onClick={() => setActiveTab('transport')}
              className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Next: Select Multimodal Transit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: MULTIMODAL TRANSPORT */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Intercity Travel Corridors
            </h3>
            <p className="text-xs text-slate-500">
              Verified train, bus, and dedicated private chauffeur connections between Hyderabad and Telangana districts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TELANGANA_TRANSPORTS.map(opt => {
              const isSelected = selectedTransportId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedTransportId(opt.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-slate-900 text-white">
                        {opt.mode}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        ₹{opt.totalFare} / person
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">
                      {opt.providerName}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span>{opt.from} ➔ {opt.to}</span>
                      <span>•</span>
                      <span>{opt.duration}</span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      {opt.categoryDetails}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {opt.availabilityStatus}
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-700' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Selected' : 'Tap to Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Local Connectivity */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-serif font-bold text-base text-slate-950">
              City Local Transit Corridors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TELANGANA_LOCAL_TRANSIT.map(transit => (
                <div key={transit.id} className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{transit.city} {transit.mode}</span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                      {transit.averageFareDisplay}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{transit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('itinerary')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Back to Schedule
            </button>
            <button
              onClick={() => setActiveTab('stays')}
              className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Next: Select Accommodations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFIED STAYS */}
      {activeTab === 'stays' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Verified Telangana Accommodations (0% Middleman Margin)
            </h3>
            <p className="text-xs text-slate-500">
              Choose between heritage palaces, authentic rural homestays, or state tourism Haritha eco-cottages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TELANGANA_STAYS.map(stay => {
              const isSelected = selectedStayId === stay.id;
              return (
                <div
                  key={stay.id}
                  onClick={() => setSelectedStayId(stay.id)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={stay.image}
                        alt={stay.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white">
                          {stay.type}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          {stay.rating} ★ ({stay.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        {stay.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{stay.location}</span>
                      </p>
                      <p className="text-[11px] text-amber-800 font-medium">
                        {stay.distanceFromKeyAttraction}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {stay.amenities.slice(0, 3).map(am => (
                          <span key={am} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Tariff</span>
                      <p className="text-base font-black text-slate-900">₹{stay.pricePerNight} <span className="text-xs font-normal text-slate-500">/ night</span></p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? '✓ Selected' : 'Choose Stay'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('transport')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Back to Transport
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Next: Storyteller Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: STORYTELLER GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Department-Certified Storyteller Guides
            </h3>
            <p className="text-xs text-slate-500">
              Transform stone monuments into living history with authorized scholars fluent in English, Telugu, Hindi, and Urdu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TELANGANA_GUIDES.map(guide => {
              const isSelected = selectedGuideId === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer p-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{guide.name}</h4>
                        <p className="text-xs text-amber-700 font-semibold">{guide.destinationName} Specialist</p>
                        <p className="text-[11px] text-slate-400">{guide.yearsExperience} yrs experience • {guide.rating} ★</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {guide.bio}
                    </p>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Specializations</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {guide.specializations.map(sp => (
                          <span key={sp} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Languages</p>
                      <p className="text-xs text-slate-700 font-semibold">
                        {guide.languages.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Full Day Fee</span>
                      <p className="text-base font-black text-slate-900">₹{guide.rates.fullDay}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? '✓ Selected' : 'Choose Guide'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('stays')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Back to Stays
            </button>
            <button
              onClick={() => setActiveTab('rentals')}
              className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Next: Rental Mobility Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: RENTAL VEHICLES */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-slate-950">
              Telangana Self-Drive &amp; Chauffeur Fleet
            </h3>
            <p className="text-xs text-slate-500">
              Optionally add a car, SUV, adventure motorcycle, or EV scooter to your pass with zero security deposit hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TELANGANA_RENTALS.map(v => {
              const isSelected = selectedRentalId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedRentalId(isSelected ? '' : v.id)}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                      <img
                        src={v.image}
                        alt={v.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white">
                          {v.category} • {v.mode}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-slate-900">{v.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{v.seats} Seats</span>
                        <span>•</span>
                        <span>{v.transmission}</span>
                        <span>•</span>
                        <span>{v.fuelType}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-semibold">{v.kmPolicy}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Daily Rate</span>
                      <p className="text-base font-black text-slate-900">₹{v.pricePerDay}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isSelected ? '✓ Added' : 'Add to Pass'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setActiveTab('guide')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Back to Guide
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <span>Review Budget &amp; Issue Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: LIVE BUDGET & ISSUE PASS */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          
          {/* User Traveler Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Primary Traveler &amp; Pass Credential Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Mobile Phone (WhatsApp Pass Sync)</label>
                <input
                  type="text"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400">Target Budget Limit (₹)</label>
                <input
                  type="number"
                  value={maxBudgetLimit}
                  onChange={(e) => setMaxBudgetLimit(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Detailed Budget Breakdown Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-950">
                Transparent Cost Itemization
              </h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                0% Middleman Margin Guaranteed
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex items-center justify-between text-slate-600">
                <span>Intercity Transit ({selectedTransport?.providerName || 'Transit'} × {travelersCount} travelers)</span>
                <span className="font-bold text-slate-900">₹{budgetBreakdown.transportCost}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between text-slate-600">
                <span>Accommodations ({selectedStay?.name || 'Stay'} × {durationDays} nights)</span>
                <span className="font-bold text-slate-900">₹{budgetBreakdown.staysCost}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between text-slate-600">
                <span>Monuments &amp; Attractions Admission ({selectedAttractionIds.length} spots)</span>
                <span className="font-bold text-slate-900">₹{budgetBreakdown.attractionsCost}</span>
              </div>

              {budgetBreakdown.guideCost > 0 && (
                <div className="py-2.5 flex items-center justify-between text-slate-600">
                  <span>Certified Storyteller Guide ({selectedGuide?.name})</span>
                  <span className="font-bold text-slate-900">₹{budgetBreakdown.guideCost}</span>
                </div>
              )}

              {budgetBreakdown.rentalCost > 0 && (
                <div className="py-2.5 flex items-center justify-between text-slate-600">
                  <span>Vehicle Rental ({selectedRental?.name} × {durationDays} days)</span>
                  <span className="font-bold text-slate-900">₹{budgetBreakdown.rentalCost}</span>
                </div>
              )}

              <div className="py-2.5 flex items-center justify-between text-slate-600">
                <span>State Tourism Regulatory Tax &amp; GST (5%)</span>
                <span className="font-bold text-slate-900">₹{budgetBreakdown.taxesAndService}</span>
              </div>

              <div className="pt-4 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-slate-900">Total Consolidated Telangana Pass</span>
                  <p className="text-[11px] text-slate-500">Includes all selected transport, stays, admissions &amp; guides</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif font-black text-slate-950">
                    ₹{budgetBreakdown.grandTotal.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Target Limit: ₹{maxBudgetLimit.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Pass Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate QR pass generation with offline caching support.</span>
              </div>

              <button
                onClick={handleGeneratePass}
                disabled={isGeneratingPass}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                {isGeneratingPass ? (
                  <span>Generating Unified Pass...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Issue Telangana Travel Pass</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
