import { 
  TelanganaDestination, 
  TelanganaAttraction, 
  TelanganaTransportOption, 
  TelanganaLocalTransit, 
  TelanganaStay, 
  TelanganaGuide, 
  TelanganaRentalVehicle 
} from '../types/telangana';

export const TELANGANA_DESTINATIONS: TelanganaDestination[] = [
  {
    id: "hyderabad",
    name: "Hyderabad",
    tagline: "The City of Pearls & Nawabi Splendor",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Centuries-old Islamic citadel, bustling bazaars of Charminar, opulent Chowmahalla, and modern cyber corridors.",
    bestKnownFor: ["Charminar", "Golconda Fort", "Hyderabadi Dum Biryani", "Chowmahalla Palace", "Qutb Shahi Tombs"],
    recommendedDuration: "2–3 Days",
    startingBudgetPerDay: 2800,
    accessibilityRating: "High (Metro, App Cabs, Railway Hub)",
    popularAttractionIds: ["charminar", "golconda-fort", "chowmahalla-palace", "salarjung-museum", "qutb-shahi-tombs", "hussain-sagar", "ramoji-film-city"],
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: "warangal",
    name: "Warangal",
    tagline: "Kakatiya Dynasty's Stone Heritage & UNESCO Wonders",
    image: "https://images.unsplash.com/photo-1600100397608-f010e08e1f57?w=800&auto=format&fit=crop&q=80",
    shortDescription: "The historic capital of the Kakatiyas, renowned for the UNESCO-recognized Ramappa Temple, Thousand Pillar Temple, and stone gateways.",
    bestKnownFor: ["UNESCO Ramappa Temple", "Thousand Pillar Temple", "Warangal Fort", "Laknavaram Lake", "Pakhal Wildlife Sanctuary"],
    recommendedDuration: "2 Days",
    startingBudgetPerDay: 2100,
    accessibilityRating: "Good (Direct Superfast Trains, State Highway)",
    popularAttractionIds: ["ramappa-temple", "thousand-pillar-temple", "warangal-fort", "laknavaram-lake", "pakhal-lake", "bhadrakali-temple"],
    coordinates: { lat: 17.9689, lng: 79.5941 }
  },
  {
    id: "yadadri-bhongir",
    name: "Yadadri & Bhongir",
    tagline: "Sacred Hill Shrines & Ancient Monolithic Citadel",
    image: "https://images.unsplash.com/photo-1621648083818-4e4cf32c1c69?w=800&auto=format&fit=crop&q=80",
    shortDescription: "The grand temple city of Yadagirigutta dedicated to Lord Narasimha, and the dramatic 500-ft single monolith egg-rock of Bhongir Fort.",
    bestKnownFor: ["Yadadri Lakshmi Narasimha Temple", "Bhongir Fort Monolith", "Kolanupaka Jain Temple", "Surendrapuri Mythological Theme Park"],
    recommendedDuration: "1–2 Days",
    startingBudgetPerDay: 1800,
    accessibilityRating: "Excellent (60 km from Hyderabad, 6-lane expressway)",
    popularAttractionIds: ["yadadri-temple", "bhongir-fort", "kolanupaka-temple"],
    coordinates: { lat: 17.5898, lng: 78.9482 }
  },
  {
    id: "nagarjuna-sagar",
    name: "Nagarjuna Sagar & Nalgonda",
    tagline: "World's Largest Masonry Dam & Ancient Buddhist Island",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Majestic dam waters on the Krishna River, boat safari to Nagarjunakonda Buddhist relics island, and Ethipothala cascading falls.",
    bestKnownFor: ["Nagarjuna Sagar Dam", "Nagarjunakonda Island Museum", "Ethipothala Waterfalls", "Devarakonda Fort"],
    recommendedDuration: "1–2 Days",
    startingBudgetPerDay: 2000,
    accessibilityRating: "Moderate (Direct Buses & Private Cabs, 150 km from Hyderabad)",
    popularAttractionIds: ["nagarjuna-sagar-dam", "nagarjunakonda-island", "ethipothala-falls"],
    coordinates: { lat: 16.5772, lng: 79.3129 }
  },
  {
    id: "nizamabad",
    name: "Nizamabad & Alisagar",
    tagline: "Lakeside Sanctuaries & Sacred Godavari Confluence",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Historic fort, serene deer park at Alisagar, Ashok Sagar gardens, and Basara Saraswati Temple on the banks of Godavari.",
    bestKnownFor: ["Nizamabad Fort", "Alisagar Deer Sanctuary", "Basar Gnana Saraswati Temple", "Ashok Sagar"],
    recommendedDuration: "1–2 Days",
    startingBudgetPerDay: 1900,
    accessibilityRating: "Good (Direct trains from Secunderabad)",
    popularAttractionIds: ["nizamabad-fort", "alisagar-lake", "basar-saraswati-temple"],
    coordinates: { lat: 18.6725, lng: 78.0941 }
  },
  {
    id: "adilabad",
    name: "Adilabad & Kuntala Falls",
    tagline: "Dense Teak Reserves & Roaring Cascades",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Telangana's wild northern frontier featuring Kuntala Falls (highest in Telangana), Pochera Falls, and Kawal Tiger Reserve.",
    bestKnownFor: ["Kuntala Waterfalls", "Pochera Falls", "Kawal Tiger Reserve", "Jainath Temple"],
    recommendedDuration: "2 Days",
    startingBudgetPerDay: 2200,
    accessibilityRating: "Moderate (NH44 highway scenic road trip)",
    popularAttractionIds: ["kuntala-falls", "pochera-falls", "kawal-tiger-reserve"],
    coordinates: { lat: 19.6641, lng: 78.5320 }
  },
  {
    id: "ananthagiri-hills",
    name: "Ananthagiri Hills & Vikarabad",
    tagline: "Misty Coffee Trails & Trekking Escapes",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Scenic dense forest hills just 80 km from Hyderabad. Birthplace of the Musi river, ancient Anantha Padmanabha Swamy shrine, and valley viewpoints.",
    bestKnownFor: ["Ananthagiri Viewpoint", "Anantha Padmanabha Swamy Temple", "Kotepally Reservoir Kayaking", "Forest Trekking Corridors"],
    recommendedDuration: "1–2 Days",
    startingBudgetPerDay: 1700,
    accessibilityRating: "Very High (Scenic 2-hour drive from Hyderabad)",
    popularAttractionIds: ["ananthagiri-viewpoint", "anantha-padmanabha-temple", "kotepally-kayaking"],
    coordinates: { lat: 17.3060, lng: 77.8637 }
  },
  {
    id: "medak",
    name: "Medak & Singur Dam",
    tagline: "Gothic Cathedral Architecture & Wetland Sanctuaries",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
    shortDescription: "Home to the colossal Medak Cathedral (one of the largest in Asia), historic Medak Fort, and Pocharam Wildlife Sanctuary.",
    bestKnownFor: ["Medak Cathedral", "Medak Fort", "Pocharam Wildlife Sanctuary & Dam", "Edupayala Vana Durga Bhavani"],
    recommendedDuration: "1 Day",
    startingBudgetPerDay: 1600,
    accessibilityRating: "High (100 km from Hyderabad via NH765D)",
    popularAttractionIds: ["medak-cathedral", "medak-fort", "pocharam-sanctuary"],
    coordinates: { lat: 18.0499, lng: 78.2618 }
  }
];

export const TELANGANA_ATTRACTIONS: TelanganaAttraction[] = [
  // Hyderabad
  {
    id: "charminar",
    name: "Charminar & Laad Bazaar",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    description: "Built in 1591 CE by Sultan Muhammad Quli Qutb Shah to commemorate the end of a plague, this grand four-minaret monument stands at the bustling cultural heart of old Hyderabad.",
    location: "Char Kaman, Ghansi Bazaar, Hyderabad",
    openingHours: {
      openTime: "09:30",
      closeTime: "17:30",
      openDisplay: "9:30 AM – 5:30 PM (All Days)"
    },
    recommendedDurationHours: 1.5,
    entryFee: 25,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Ground floor accessible; upper minarets require steep spiral stairs.",
    bestTimeToVisit: "Morning 09:30 AM for quiet photography, or 04:30 PM for vibrant bazaar lighting."
  },
  {
    id: "golconda-fort",
    name: "Golconda Fort & Whispering Galleries",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Forts",
    image: "https://images.unsplash.com/photo-1600100397608-f010e08e1f57?w=800&auto=format&fit=crop&q=80",
    description: "Legendary diamond trade capital where the Koh-i-Noor and Hope diamonds originated. Marvel at the acoustic engineering where a clap at the entrance dome can be heard 1 km away at Bala Hissar.",
    location: "Ibrahim Bagh, Hyderabad",
    openingHours: {
      openTime: "09:00",
      closeTime: "17:30",
      openDisplay: "9:00 AM – 5:30 PM (Sound & Light Show: 6:30 PM & 8:00 PM)"
    },
    recommendedDurationHours: 3.0,
    entryFee: 50,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Steep granite rock climb of 360 steps to reach the top citadel. Good footwear recommended.",
    bestTimeToVisit: "03:00 PM – 06:30 PM for panoramic sunset over Hyderabad skyline and evening light show."
  },
  {
    id: "chowmahalla-palace",
    name: "Chowmahalla Palace",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    description: "The opulent seat of the Asaf Jahi dynasty. Marvel at the grand Khilwat Mubarak durbar hall, 19 exquisite Belgian crystal chandeliers, and vintage 1912 Rolls Royce Silver Ghost.",
    location: "Motigall, Khilwat, Hyderabad",
    openingHours: {
      openTime: "10:00",
      closeTime: "17:00",
      openDisplay: "10:00 AM – 5:00 PM (Closed on Fridays)",
      closedDays: ["Friday"]
    },
    recommendedDurationHours: 2.0,
    entryFee: 100,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Courtyards and ground halls are wheelchair accessible.",
    bestTimeToVisit: "11:00 AM – 01:00 PM."
  },
  {
    id: "salarjung-museum",
    name: "Salar Jung Museum",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Museums",
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80",
    description: "One of the world's largest one-man art collections, housed in 38 galleries. Features the famous Veiled Rebecca marble sculpture by Benzoni and the 19th-century musical clock.",
    location: "Darulshifa, Hyderabad",
    openingHours: {
      openTime: "10:00",
      closeTime: "17:00",
      openDisplay: "10:00 AM – 5:00 PM (Closed on Fridays)",
      closedDays: ["Friday"]
    },
    recommendedDurationHours: 2.5,
    entryFee: 50,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Wheelchairs and elevators available in all wings.",
    bestTimeToVisit: "10:30 AM to catch the 12:00 PM musical clock strike."
  },
  {
    id: "qutb-shahi-tombs",
    name: "Qutb Shahi Heritage Park & Tombs",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1621648083818-4e4cf32c1c69?w=800&auto=format&fit=crop&q=80",
    description: "Restored royal necropolis of the Qutb Shahi rulers, set within sprawling Persian-style landscaped gardens. Blend of Persian, Pashtun, and Hindu architectural motifs.",
    location: "Ibrahim Bagh, near Golconda, Hyderabad",
    openingHours: {
      openTime: "09:30",
      closeTime: "17:30",
      openDisplay: "9:30 AM – 5:30 PM (All Days)"
    },
    recommendedDurationHours: 2.0,
    entryFee: 40,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Paved garden pathways; ramps available at primary pavilions.",
    bestTimeToVisit: "Late afternoon for golden hour reflections on stucco domes."
  },
  {
    id: "hussain-sagar",
    name: "Hussain Sagar Lake & Buddha Statue",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Lakes",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    description: "Heart-shaped historic lake built in 1563 CE. Take a speedboat or ferry safari to the 18-meter monolithic granite statue of Gautama Buddha on Gibraltar Rock.",
    location: "Necklace Road / Tank Bund, Hyderabad",
    openingHours: {
      openTime: "08:00",
      closeTime: "22:00",
      openDisplay: "8:00 AM – 10:00 PM (Boating till 8:30 PM)"
    },
    recommendedDurationHours: 1.5,
    entryFee: 80,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Boarding jetties equipped with handrails and life jackets.",
    bestTimeToVisit: "05:30 PM – 07:30 PM for cool evening lake breeze and illuminated city skyline."
  },
  {
    id: "ramoji-film-city",
    name: "Ramoji Film City",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80",
    description: "Certified by Guinness World Records as the world's largest film studio complex (2,000 acres). Features film sets, live stunt shows, action rides, and thematic gardens.",
    location: "Anaspur Village, Hayathnagar, Hyderabad",
    openingHours: {
      openTime: "09:00",
      closeTime: "17:30",
      openDisplay: "9:00 AM – 5:30 PM"
    },
    recommendedDurationHours: 6.0,
    entryFee: 1450,
    ticketStatus: "TICKET_AVAILABLE",
    passEligible: false,
    officialTicketSource: "Ramoji Official & SafarSetu Integrated Partner",
    bestTimeToVisit: "Full day required; arrive at 09:00 AM opening."
  },

  // Warangal
  {
    id: "ramappa-temple",
    name: "UNESCO Ramappa Temple (Rudreshwara)",
    destinationId: "warangal",
    destinationName: "Warangal",
    category: "Temples",
    image: "https://images.unsplash.com/photo-1600100397608-f010e08e1f57?w=800&auto=format&fit=crop&q=80",
    description: "Inscribed as a UNESCO World Heritage Site in 2021. Built in 1213 CE under Kakatiya general Recharla Rudra, it features revolutionary lightweight 'floating bricks', sandbox foundations that resist earthquakes, and exquisite carved dancing bracket figures (Madanikas).",
    location: "Palampet, Mulugu District (near Warangal)",
    openingHours: {
      openTime: "06:00",
      closeTime: "18:00",
      openDisplay: "6:00 AM – 6:00 PM (All Days)"
    },
    recommendedDurationHours: 2.5,
    entryFee: 25,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Sandstone steps up to the main star-shaped plinth.",
    bestTimeToVisit: "Morning 07:00 AM – 10:00 AM for tranquil spiritual ambiance and direct sunlight on eastern sculptures."
  },
  {
    id: "thousand-pillar-temple",
    name: "Thousand Pillar Temple (Rudreswara Swamy)",
    destinationId: "warangal",
    destinationName: "Warangal",
    category: "Temples",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80",
    description: "12th-century Kakatiya masterpiece with three shrines (Trikutalayam) dedicated to Shiva, Vishnu, and Surya. Features a magnificent monolithic carved black basalt Nandi bull.",
    location: "Hanamkonda, Warangal",
    openingHours: {
      openTime: "06:00",
      closeTime: "20:00",
      openDisplay: "6:00 AM – 8:00 PM"
    },
    recommendedDurationHours: 1.5,
    entryFee: 0,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Wheelchair accessible paved courtyard.",
    bestTimeToVisit: "08:00 AM or 05:30 PM for temple evening aarti."
  },
  {
    id: "warangal-fort",
    name: "Warangal Fort & Kakatiya Kala Thoranam",
    destinationId: "warangal",
    destinationName: "Warangal",
    category: "Forts",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
    description: "Ruins of the Kakatiya capital fortress with three concentric circular fortifications. The iconic Kakatiya arch (Kala Thoranam) stands here as the official emblem of the Government of Telangana.",
    location: "Mathwada, Warangal",
    openingHours: {
      openTime: "09:00",
      closeTime: "17:30",
      openDisplay: "9:00 AM – 5:30 PM"
    },
    recommendedDurationHours: 2.0,
    entryFee: 25,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Flat archaeological garden lawns.",
    bestTimeToVisit: "04:00 PM – 05:30 PM."
  },
  {
    id: "laknavaram-lake",
    name: "Laknavaram Lake & Suspension Bridges",
    destinationId: "warangal",
    destinationName: "Warangal",
    category: "Lakes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    description: "Lush eco-tourism haven with 13 emerald green islands surrounded by dense Eturnagaram forests. Features scenic suspension rope bridges connecting the islands and speedboat safaris.",
    location: "Govindaraopet, Mulugu District (near Warangal)",
    openingHours: {
      openTime: "08:30",
      closeTime: "17:30",
      openDisplay: "8:30 AM – 5:30 PM"
    },
    recommendedDurationHours: 3.0,
    entryFee: 50,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Suspension bridge walkway; Haritha eco-resort dining on-site.",
    bestTimeToVisit: "Morning 09:00 AM or late afternoon sunset cruise."
  },

  // Yadadri & Bhongir
  {
    id: "yadadri-temple",
    name: "Yadagirigutta Sri Lakshmi Narasimha Temple",
    destinationId: "yadadri-bhongir",
    destinationName: "Yadadri & Bhongir",
    category: "Temples",
    image: "https://images.unsplash.com/photo-1621648083818-4e4cf32c1c69?w=800&auto=format&fit=crop&q=80",
    description: "Magnificently reconstructed Dravidian black stone hill shrine dedicated to Lord Narasimha. A blend of ancient cave sanctum and monumental sculptured pillars carved by 500+ master artisans.",
    location: "Yadagirigutta Hill, Yadadri Bhuvanagiri District",
    openingHours: {
      openTime: "04:00",
      closeTime: "21:30",
      openDisplay: "4:00 AM – 9:30 PM (Darshan timings: 6:00 AM - 1:00 PM, 3:00 PM - 9:00 PM)"
    },
    recommendedDurationHours: 2.5,
    entryFee: 0,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Hilltop escalators, lifts, and free shuttle bus service available for senior citizens.",
    bestTimeToVisit: "Early morning 06:30 AM or evening 05:00 PM."
  },
  {
    id: "bhongir-fort",
    name: "Bhongir Fort (Bhuvanagiri Monolith)",
    destinationId: "yadadri-bhongir",
    destinationName: "Yadadri & Bhongir",
    category: "Forts",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    description: "Perched atop a massive monolithic egg-shaped rock 500 feet high, built in the 10th century by Western Chalukya ruler Tribhuvanamalla Vikramaditya VI. Panoramic 360-degree views of Telangana plains.",
    location: "Bhuvanagiri Town (45 km from Hyderabad)",
    openingHours: {
      openTime: "10:00",
      closeTime: "17:00",
      openDisplay: "10:00 AM – 5:00 PM"
    },
    recommendedDurationHours: 2.5,
    entryFee: 25,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Demanding rock staircase climb. Carry plenty of water and wear non-slip sports shoes.",
    bestTimeToVisit: "10:00 AM or winter afternoons. Avoid noon during summer."
  },

  // Nagarjuna Sagar
  {
    id: "nagarjuna-sagar-dam",
    name: "Nagarjuna Sagar Dam & Crest Gates",
    destinationId: "nagarjuna-sagar",
    destinationName: "Nagarjuna Sagar & Nalgonda",
    category: "Lakes",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    description: "Built between 1955 and 1967 across the Krishna River, this is the world's tallest masonry dam (124 meters high) with 26 massive radial crest gates.",
    location: "Nagarjuna Sagar, Nalgonda District",
    openingHours: {
      openTime: "09:00",
      closeTime: "17:30",
      openDisplay: "9:00 AM – 5:30 PM"
    },
    recommendedDurationHours: 2.0,
    entryFee: 20,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Viewpoint terraces accessible by road.",
    bestTimeToVisit: "Monsoon & post-monsoon (August – December) when crest gates release massive sheets of water."
  },
  {
    id: "nagarjunakonda-island",
    name: "Nagarjunakonda Buddhist Island Museum",
    destinationId: "nagarjuna-sagar",
    destinationName: "Nagarjuna Sagar & Nalgonda",
    category: "Museums",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
    description: "Island museum reachable only by a scenic 45-minute river launch ride. Houses salvage archaeological relics of Nagarjuna's 2nd-century Mahayana Buddhist university.",
    location: "Island in Nagarjuna Sagar Reservoir",
    openingHours: {
      openTime: "09:30",
      closeTime: "16:00",
      openDisplay: "9:30 AM – 4:00 PM (Closed on Fridays)",
      closedDays: ["Friday"]
    },
    recommendedDurationHours: 3.5,
    entryFee: 150,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Requires boarding state ferry boat at Vijayapuri jetty.",
    bestTimeToVisit: "Board the 09:30 AM or 11:30 AM boat from Launch Station."
  },

  // Adilabad
  {
    id: "kuntala-falls",
    name: "Kuntala Waterfalls (Highest in Telangana)",
    destinationId: "adilabad",
    destinationName: "Adilabad & Kuntala Falls",
    category: "Waterfalls",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    description: "Cascading 150 feet down two rocky tiers on the Kadam river through the dense Sahyadri mountain ranges, making it the highest waterfall in Telangana.",
    location: "Neredigonda Mandal, Adilabad District",
    openingHours: {
      openTime: "09:00",
      closeTime: "17:00",
      openDisplay: "9:00 AM – 5:00 PM"
    },
    recommendedDurationHours: 3.0,
    entryFee: 30,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Requires descending approximately 400 stone steps.",
    bestTimeToVisit: "September to December (lush post-monsoon water volume)."
  },

  // Ananthagiri Hills
  {
    id: "ananthagiri-viewpoint",
    name: "Ananthagiri Forest Ridge & Valley View",
    destinationId: "ananthagiri-hills",
    destinationName: "Ananthagiri Hills & Vikarabad",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    description: "Misty forest trails, red soil paths, and scenic sunrise vantage points overlooking the dense Eastern Ghats valley. Origin point of the sacred Musi River.",
    location: "Vikarabad, 80 km west of Hyderabad",
    openingHours: {
      openTime: "06:00",
      closeTime: "18:30",
      openDisplay: "Open Sunrise to Sunset"
    },
    recommendedDurationHours: 2.0,
    entryFee: 0,
    ticketStatus: "INCLUDED",
    passEligible: true,
    accessibilityInfo: "Easy trail walking suitable for all ages.",
    bestTimeToVisit: "Early morning 06:00 AM for sunrise mist."
  }
];

export const TELANGANA_TRANSPORTS: TelanganaTransportOption[] = [
  // Intercity: Hyderabad to Warangal
  {
    id: "tr-hyd-wgl-vb",
    from: "Hyderabad (SC / HYB)",
    to: "Warangal (WL)",
    mode: "Train",
    providerName: "Vande Bharat Express (Train 20701)",
    departureTime: "06:00 AM",
    arrivalTime: "07:35 AM",
    duration: "1h 35m",
    baseFare: 620,
    taxes: 31,
    serviceFee: 0,
    totalFare: 651,
    availabilityStatus: "Available",
    categoryDetails: "Chair Car (AC), breakfast snack included"
  },
  {
    id: "tr-hyd-wgl-garuda",
    from: "Hyderabad (MGBS)",
    to: "Warangal (Hanamkonda)",
    mode: "Bus",
    providerName: "TSRTC Garuda Plus Multi-Axle AC",
    departureTime: "07:30 AM",
    arrivalTime: "10:15 AM",
    duration: "2h 45m",
    baseFare: 380,
    taxes: 19,
    serviceFee: 0,
    totalFare: 399,
    availabilityStatus: "Available",
    categoryDetails: "Reclining AC, water bottle & live GPS tracking"
  },
  {
    id: "tr-hyd-wgl-cab",
    from: "Hyderabad (Doorstep)",
    to: "Warangal (Doorstep)",
    mode: "Cab",
    providerName: "SafarSetu Intercity Verified Sedan (Dzire / Etios)",
    departureTime: "Flexible / On-Demand",
    arrivalTime: "2h 40m door-to-door",
    duration: "2h 40m",
    baseFare: 2600,
    taxes: 130,
    serviceFee: 0,
    totalFare: 2730,
    availabilityStatus: "Available",
    categoryDetails: "Dedicated chauffeur, toll taxes included, zero surge"
  },

  // Intercity: Hyderabad to Yadadri
  {
    id: "tr-hyd-yad-cab",
    from: "Hyderabad (Doorstep)",
    to: "Yadagirigutta & Bhongir",
    mode: "Cab",
    providerName: "SafarSetu Day Trip Chauffeur (Ertiga / Innova)",
    departureTime: "07:00 AM",
    arrivalTime: "08:15 AM",
    duration: "1h 15m",
    baseFare: 2100,
    taxes: 105,
    serviceFee: 0,
    totalFare: 2205,
    availabilityStatus: "Available",
    categoryDetails: "60 km expressway drive, driver waits during darshan"
  },

  // Intercity: Hyderabad to Nagarjuna Sagar
  {
    id: "tr-hyd-ngs-cab",
    from: "Hyderabad (Doorstep)",
    to: "Nagarjuna Sagar Dam",
    mode: "Cab",
    providerName: "SafarSetu Scenic Chauffeur (Sedan)",
    departureTime: "06:30 AM",
    arrivalTime: "09:45 AM",
    duration: "3h 15m",
    baseFare: 3200,
    taxes: 160,
    serviceFee: 0,
    totalFare: 3360,
    availabilityStatus: "Available",
    categoryDetails: "150 km corridor, includes waiting at Dam and Jetty"
  },

  // Intercity: Hyderabad to Ananthagiri Hills
  {
    id: "tr-hyd-ana-cab",
    from: "Hyderabad (Doorstep)",
    to: "Vikarabad / Ananthagiri",
    mode: "Cab",
    providerName: "SafarSetu Weekend Getaway Chauffeur",
    departureTime: "Flexible",
    arrivalTime: "1h 50m",
    duration: "1h 50m",
    baseFare: 1900,
    taxes: 95,
    serviceFee: 0,
    totalFare: 1995,
    availabilityStatus: "Available",
    categoryDetails: "80 km smooth drive through western Telangana greenery"
  }
];

export const TELANGANA_LOCAL_TRANSIT: TelanganaLocalTransit[] = [
  {
    id: "transit-hyd-metro",
    city: "Hyderabad",
    mode: "Metro",
    averageFareDisplay: "₹20 – ₹60 per ride",
    description: "Red, Blue, and Green corridors connecting Miyapur, Hitec City, Secunderabad, and MGBS.",
    recommendedFor: "Traffic-free transit between Hitec City, Begumpet, and Old City fringes",
    icon: "Train"
  },
  {
    id: "transit-hyd-daycab",
    city: "Hyderabad",
    mode: "Chauffeur Van",
    averageFareDisplay: "₹2,400 / full 8h day",
    hourlyRate: 300,
    description: "Dedicated AC sedan with verified storyteller chauffeur for Charminar, Golconda, and museum circuits.",
    recommendedFor: "Families, couples, and heritage visitors desiring effortless multi-stop touring",
    icon: "Car"
  },
  {
    id: "transit-wgl-auto",
    city: "Warangal",
    mode: "Auto Rickshaw",
    averageFareDisplay: "₹50 – ₹150 fixed metered rate",
    description: "Fast local transit between Warangal Railway Station, Hanamkonda, and Thousand Pillar Temple.",
    recommendedFor: "Solo travelers & budget duos exploring city sights",
    icon: "Car"
  }
];

export const TELANGANA_STAYS: TelanganaStay[] = [
  // Hyderabad Stays
  {
    id: "stay-hyd-taj-falaknuma",
    name: "Taj Falaknuma Palace (Nizam's Royal Suites)",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    type: "Heritage Stay",
    tier: "Luxury",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 28500,
    rating: 4.9,
    reviewsCount: 682,
    location: "Engine Bowli, Falaknuma, Hyderabad",
    distanceFromKeyAttraction: "4 km from Charminar",
    amenities: ["Horse-drawn carriage arrival", "Heritage palace historian tour", "Fine dining 101-seat dining table", "Royal spa", "Infinity pool"],
    roomType: "Palace King Room with Garden Courtyard",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    checkIn: "14:00",
    checkOut: "12:00",
    verifiedPartner: true
  },
  {
    id: "stay-hyd-heritage-homestay",
    name: "Banjara Deccan Heritage Homestay",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    type: "Homestay",
    tier: "Mid-range",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 2450,
    rating: 4.8,
    reviewsCount: 310,
    location: "Road No. 12, Banjara Hills, Hyderabad",
    distanceFromKeyAttraction: "7 km from Golconda Fort",
    amenities: ["Traditional home-cooked breakfast", "Private leafy balcony", "High-speed Wi-Fi", "Curated heritage city map", "Zero commission direct booking"],
    roomType: "Deccan Deluxe Double Suite",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    checkIn: "12:00",
    checkOut: "11:00",
    verifiedPartner: true
  },
  {
    id: "stay-hyd-haritha-taramati",
    name: "Telangana Tourism Haritha Taramati Baradari",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    type: "Resort",
    tier: "Mid-range",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 2200,
    rating: 4.5,
    reviewsCount: 420,
    location: "Near Golconda Fort, Gandipet Road, Hyderabad",
    distanceFromKeyAttraction: "1.5 km from Golconda Fort",
    amenities: ["Historic music pavilion views", "Open-air theatre", "Restaurant serving authentic Telangana cuisine", "Spacious gardens", "Government verified"],
    roomType: "Deluxe Heritage AC Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    checkIn: "12:00",
    checkOut: "11:00",
    verifiedPartner: true
  },

  // Warangal Stays
  {
    id: "stay-wgl-haritha-kakatiya",
    name: "Haritha Kakatiya Heritage Hotel",
    destinationId: "warangal",
    destinationName: "Warangal",
    type: "Hotel",
    tier: "Mid-range",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 1950,
    rating: 4.6,
    reviewsCount: 380,
    location: "Kazipet Road, Hanamkonda, Warangal",
    distanceFromKeyAttraction: "2.5 km from Thousand Pillar Temple",
    amenities: ["Central location", "Multi-cuisine restaurant", "Room service", "Tour desk for Ramappa bookings", "Verified Haritha property"],
    roomType: "Executive AC Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    checkIn: "12:00",
    checkOut: "11:00",
    verifiedPartner: true
  },
  {
    id: "stay-wgl-laknavaram-resort",
    name: "Haritha Laknavaram Island Eco-Cottages",
    destinationId: "warangal",
    destinationName: "Warangal",
    type: "Resort",
    tier: "Mid-range",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 2600,
    rating: 4.7,
    reviewsCount: 290,
    location: "Island No. 2, Laknavaram Lake, Mulugu",
    distanceFromKeyAttraction: "Directly on Laknavaram Island",
    amenities: ["Island water views", "Private wooden deck", "Boat transfer included", "Campfire facility", "Local Telangana farm dining"],
    roomType: "Waterfront Wooden Eco-Cottage",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
    checkIn: "13:00",
    checkOut: "11:00",
    verifiedPartner: true
  },
  {
    id: "stay-wgl-palampet-homestay",
    name: "Ramappa Rural Heritage Farmstay",
    destinationId: "warangal",
    destinationName: "Warangal",
    type: "Homestay",
    tier: "Budget",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 1450,
    rating: 4.8,
    reviewsCount: 165,
    location: "Palampet Village (Walkable to Ramappa Temple)",
    distanceFromKeyAttraction: "400m from UNESCO Ramappa Temple",
    amenities: ["Organic farm vegetables", "Traditional Sarva Pindi breakfast", "Local village guide accompaniment", "Clean solar-powered rooms"],
    roomType: "Village Cottage Suite",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    checkIn: "11:00",
    checkOut: "10:00",
    verifiedPartner: true
  },

  // Yadadri & Bhongir Stay
  {
    id: "stay-yad-haritha-hilltop",
    name: "Haritha Yadagirigutta Hillside Guest House",
    destinationId: "yadadri-bhongir",
    destinationName: "Yadadri & Bhongir",
    type: "Hotel",
    tier: "Budget",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    pricePerNight: 1600,
    rating: 4.4,
    reviewsCount: 220,
    location: "Hill Bottom Road, Yadagirigutta",
    distanceFromKeyAttraction: "1 km from Yadadri Temple shrine",
    amenities: ["Temple shuttle stop", "Pure vegetarian South Indian restaurant", "24h hot water", "Family suite options"],
    roomType: "Deluxe Twin Room",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
    checkIn: "12:00",
    checkOut: "11:00",
    verifiedPartner: true
  }
];

export const TELANGANA_GUIDES: TelanganaGuide[] = [
  {
    id: "guide-hyd-venkat",
    name: "Venkat Rao Kulkarni",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    languages: ["Telugu", "English", "Hindi", "Urdu"],
    specializations: ["Qutb Shahi & Nizami History", "Charminar Architectural Secret Vaults", "Old City Irani Cafe Lore"],
    rating: 4.95,
    reviewsCount: 420,
    yearsExperience: 14,
    bio: "State-certified senior historian and storyteller. Led historical walks for international university delegations and heritage trusts.",
    rates: {
      twoHour: 1100,
      halfDay: 1900,
      fullDay: 3200
    },
    availabilityStatus: "Available",
    verifiedTourismDepartment: true
  },
  {
    id: "guide-wgl-shailaja",
    name: "Dr. Shailaja Reddy",
    destinationId: "warangal",
    destinationName: "Warangal",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    languages: ["Telugu", "English", "Hindi"],
    specializations: ["UNESCO Ramappa Temple Architecture", "Kakatiya Engineering & Sandbox Tech", "Local Tribal Legends"],
    rating: 4.98,
    reviewsCount: 310,
    yearsExperience: 11,
    bio: "Archaeology scholar specializing in 13th-century Kakatiya temple sculptures, acoustic pillars, and the mystery of floating bricks.",
    rates: {
      twoHour: 1200,
      halfDay: 2100,
      fullDay: 3400
    },
    availabilityStatus: "Available",
    verifiedTourismDepartment: true
  },
  {
    id: "guide-hyd-salman",
    name: "Mirza Salman Baig",
    destinationId: "hyderabad",
    destinationName: "Hyderabad",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    languages: ["Urdu", "Hindi", "English", "Telugu"],
    specializations: ["Golconda Fort Acoustic Whispering", "Diamond Route Lore", "Chowmahalla Royal Regalia"],
    rating: 4.9,
    reviewsCount: 265,
    yearsExperience: 9,
    bio: "Born in the shadows of Golconda Fort. Mirza brings 400 years of royal Nizami court legends to life with theatrical storytelling.",
    rates: {
      twoHour: 950,
      halfDay: 1750,
      fullDay: 2800
    },
    availabilityStatus: "Available",
    verifiedTourismDepartment: true
  }
];

export const TELANGANA_RENTALS: TelanganaRentalVehicle[] = [
  {
    id: "rental-ts-swift",
    name: "Maruti Swift ZXi (Petrol)",
    category: "Car",
    seats: 5,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80",
    pricePerDay: 1650,
    securityDeposit: 3000,
    kmPolicy: "Unlimited KMs",
    provider: "SafarSetu Telangana Mobility Fleet",
    rating: 4.8,
    verifiedStatus: true,
    mode: "Self-Drive"
  },
  {
    id: "rental-ts-creta",
    name: "Hyundai Creta SX (Automatic)",
    category: "SUV",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
    pricePerDay: 2800,
    securityDeposit: 5000,
    kmPolicy: "Unlimited KMs",
    provider: "SafarSetu Telangana Mobility Fleet",
    rating: 4.9,
    verifiedStatus: true,
    mode: "Self-Drive"
  },
  {
    id: "rental-ts-innova",
    name: "Toyota Innova Crysta (Chauffeur Included)",
    category: "SUV",
    seats: 7,
    transmission: "Manual",
    fuelType: "Diesel",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80",
    pricePerDay: 3900,
    securityDeposit: 0,
    kmPolicy: "300 KM / Day (Extra @ ₹14/km)",
    provider: "SafarSetu Verified Storyteller Chauffeur Fleet",
    rating: 4.95,
    verifiedStatus: true,
    mode: "Chauffeur-Driven"
  },
  {
    id: "rental-ts-himalayan",
    name: "Royal Enfield Himalayan 450",
    category: "Bike",
    seats: 2,
    transmission: "Manual",
    fuelType: "Petrol",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80",
    pricePerDay: 1400,
    securityDeposit: 2500,
    kmPolicy: "250 KM / Day",
    provider: "SafarSetu Telangana Motor Explorers",
    rating: 4.85,
    verifiedStatus: true,
    mode: "Self-Drive"
  },
  {
    id: "rental-ts-ola-s1",
    name: "Ola S1 Pro Electric Scooter",
    category: "Scooter",
    seats: 2,
    transmission: "Automatic",
    fuelType: "EV",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
    pricePerDay: 650,
    securityDeposit: 1500,
    kmPolicy: "140 KM Range / Charge",
    provider: "SafarSetu Green Eco Fleet",
    rating: 4.75,
    verifiedStatus: true,
    mode: "Self-Drive"
  }
];

export const TELANGANA_CULTURAL_TRAILS = [
  {
    id: "cul-biryani-trail",
    title: "The Nizami Culinary Odyssey",
    type: "Food & Flavors",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    summary: "Taste world-famous slow-cooked Hyderabadi Dum Biryani, spicy Mirchi ka Salan, crispy Sarva Pindi rice snacks, and piping hot Irani Chai paired with Osmania biscuits.",
    highlights: ["Authentic Shadab & Shah Ghouse Dum Biryani", "Morning Irani Chai at Nimrah Cafe overlooking Charminar", "Sarva Pindi rural breakfast demo in Warangal"]
  },
  {
    id: "cul-ikat-weavers",
    title: "Pochampally Ikat Silk Weaver Villages",
    type: "Living Crafts",
    image: "https://images.unsplash.com/photo-1600100397608-f010e08e1f57?w=600&auto=format&fit=crop&q=80",
    summary: "Witness traditional geometric Tie-and-Dye handloom weaving recognized by UNWTO as one of the Best Tourism Villages in the world.",
    highlights: ["Live handloom weaving masterclass", "Direct weaver purchase with 0% middleman margins", "UNESCO recognized Pochampally Silk Village"]
  },
  {
    id: "cul-kakatiya-echoes",
    title: "Kakatiya Dynasty's Stone Symphony",
    type: "UNESCO Architecture",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80",
    summary: "Discover why Marco Polo called Kakatiya architecture 'the brightest star in the galaxy of medieval temples'.",
    highlights: ["Sandbox earthquake-resistant foundations", "Floating brick masonry that floats on water", "Black basalt dancing Madanika brackets"]
  }
];
