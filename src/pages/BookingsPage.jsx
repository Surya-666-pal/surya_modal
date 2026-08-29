import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Calendar, MapPin, Check, Star, ShieldCheck, ArrowRight, 
  QrCode, Download, Search, Filter, Clock, Sparkles, UserCheck, 
  Compass, ChevronRight, X, ExternalLink, RefreshCw, Zap, Users,
  Loader2, CheckCircle2, Car, Fuel, Gauge, Key, Navigation, Bike,
  SlidersHorizontal, IndianRupee, Truck, ShieldAlert, Award
} from 'lucide-react';

const DEFAULT_VEHICLES = [
  {
    id: "VH-101",
    name: "Mahindra Thar 4x4 (Expedition Hardtop)",
    type: "suv_4x4",
    category_label: "4x4 Mountain SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    price_per_day: 4200,
    seats: 4,
    transmission: "Manual / 4WD",
    fuel: "Diesel (15 km/l)",
    rating: 4.92,
    reviews: 328,
    locations: ["manali", "leh", "spiti", "rishikesh", "jaipur"],
    recommended_for: ["manali", "leh", "spiti", "rishikesh"],
    terrain_tag: "High Altitude Passes & Rocky Riverbeds",
    features: ["4WD Low-Range", "All-Terrain Offroad Tyres", "GPS Offline Unit", "Zero Security Deposit", "Roof Carrier Ready"]
  },
  {
    id: "VH-102",
    name: "Royal Enfield Himalayan 450",
    type: "bike",
    category_label: "Adventure Motorcycle",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    price_per_day: 1400,
    seats: 2,
    transmission: "6-Speed Manual",
    fuel: "Petrol (30 km/l)",
    rating: 4.95,
    reviews: 512,
    locations: ["manali", "leh", "spiti", "rishikesh", "goa"],
    recommended_for: ["leh", "manali", "spiti", "rishikesh"],
    terrain_tag: "High Mountain Passes & Hairpin Bends",
    features: ["Dual-Channel Switchable ABS", "Pannier Mounts", "TFT Tripper Navigation", "2 ISI Helmets Included", "24/7 Roadside Assistance"]
  },
  {
    id: "VH-103",
    name: "Honda Activa 6G / Ather 450X",
    type: "scooter",
    category_label: "City & Coastal Scooter",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
    price_per_day: 550,
    seats: 2,
    transmission: "Automatic (CVT)",
    fuel: "Petrol / Electric (55 km/l)",
    rating: 4.86,
    reviews: 840,
    locations: ["goa", "pondicherry", "varanasi", "kochi", "rishikesh", "jaipur"],
    recommended_for: ["goa", "pondicherry", "varanasi", "kochi"],
    terrain_tag: "Beach Corridors & Heritage Old City Streets",
    features: ["Easy Parking", "Front Basket & Storage", "Helmets Included", "Instant Fuel Fill", "Unlimited Kilometres"]
  },
  {
    id: "VH-104",
    name: "Toyota Innova Crysta / Hycross",
    type: "van_mpv",
    category_label: "Luxury 7-Seater MPV",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    price_per_day: 3800,
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel / Hybrid (16 km/l)",
    rating: 4.94,
    reviews: 460,
    locations: ["jaipur", "udaipur", "munnar", "kochi", "bangalore", "varanasi", "manali"],
    recommended_for: ["jaipur", "udaipur", "munnar", "kochi", "bangalore"],
    terrain_tag: "Long Highway Expressways & Family Hill Circuits",
    features: ["Captain Reclining Seats", "Dual Zone Rear AC", "Massive Boot Space", "Chauffeur / Self-Drive", "Pre-Loaded FASTag"]
  },
  {
    id: "VH-105",
    name: "Maruti Suzuki Swift / Dzire ZXi",
    type: "sedan",
    category_label: "Economy Sedan & Hatchback",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
    price_per_day: 1350,
    seats: 5,
    transmission: "Manual / AMT",
    fuel: "Petrol (22.5 km/l)",
    rating: 4.82,
    reviews: 620,
    locations: ["jaipur", "varanasi", "bangalore", "goa", "kochi", "rishikesh"],
    recommended_for: ["jaipur", "varanasi", "bangalore"],
    terrain_tag: "Budget Monument Sightseeing & Smooth City Roads",
    features: ["Best Mileage In Class", "Touchscreen Android Auto / Apple CarPlay", "Reverse Sensor & Camera", "AC Climate Control", "Sanitized & Disinfected"]
  },
  {
    id: "VH-106",
    name: "Tata Nexon EV Max (Long Range)",
    type: "ev",
    category_label: "Eco-Friendly Electric SUV",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop",
    price_per_day: 2200,
    seats: 5,
    transmission: "Automatic Single Speed",
    fuel: "Electric (453 km Range)",
    rating: 4.89,
    reviews: 195,
    locations: ["bangalore", "kochi", "munnar", "goa", "jaipur"],
    recommended_for: ["bangalore", "kochi", "munnar"],
    terrain_tag: "Zero-Emission Ecotourism & Hill Sanctuary Corridors",
    features: ["Zero Emission Green Permit", "Complimentary Fast Charging Pass", "Multi-Mode Regen", "Ventilated Leather Seats", "Harman Acoustic Sound"]
  },
  {
    id: "VH-107",
    name: "Force Urbania 12-Seater Super Luxury Van",
    type: "van_mpv",
    category_label: "Group Executive Van",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    price_per_day: 7800,
    seats: 12,
    transmission: "Manual with ABS & ESP",
    fuel: "Diesel (12 km/l)",
    rating: 4.96,
    reviews: 140,
    locations: ["manali", "leh", "jaipur", "varanasi", "kochi", "bangalore", "rishikesh"],
    recommended_for: ["manali", "leh", "jaipur", "rishikesh"],
    terrain_tag: "Large Group Expeditions & Pilgrimage Circuits",
    features: ["Individual Reclining Captain Seats", "Panoramic Tinted Sightseeing Windows", "Personal USB Fast Charging & Lamp", "High Standing Roof", "Verified Mountain Chauffeur"]
  },
  {
    id: "VH-108",
    name: "Toyota Fortuner 4x4 Legender",
    type: "suv_4x4",
    category_label: "VIP Heavy-Duty 4WD SUV",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop",
    price_per_day: 6900,
    seats: 7,
    transmission: "6-Speed Automatic 4WD",
    fuel: "Diesel (14 km/l)",
    rating: 4.97,
    reviews: 280,
    locations: ["manali", "leh", "spiti", "jaipur", "udaipur", "bangalore"],
    recommended_for: ["leh", "spiti", "jaipur", "udaipur"],
    terrain_tag: "Extreme Terrain & Royal VIP Escort",
    features: ["Dual Range 4WD High/Low", "Downhill Assist Control", "Premium Leather Cockpit", "JBL 11-Speaker Audio", "Unlimited State Radius"]
  }
];

const LOCATION_TERRAIN_GUIDES = {
  manali: {
    title: "🏔️ Manali & Rohtang Pass Terrain Advice",
    recommendation: "High-Altitude Passes, Steep Inclines & Riverbed Crossings",
    bestVehicle: "4x4 Mountain SUVs (Mahindra Thar, Fortuner) & Royal Enfield Adventure Bikes",
    tip: "Rohtang & Atal Tunnel routes have sudden icy patches and steep gradients. 4WD vehicles and high-ground clearance bikes ensure zero breakdown risks."
  },
  leh: {
    title: "🏔️ Leh-Ladakh & Pangong Tso Terrain Advice",
    recommendation: "Khardung La (17,982 ft) High Passes & Rocky Deserts",
    bestVehicle: "4x4 SUVs & 450cc Adventure Motorcycles",
    tip: "Pangong and Nubra Valley require robust low-range 4WD or specialized adventure bikes with dual-channel ABS and high fuel capacity."
  },
  spiti: {
    title: "🏔️ Spiti Valley & Kaza Offroad Advice",
    recommendation: "Unpaved Rugged Tracks & Water Crossings",
    bestVehicle: "Mahindra Thar 4x4 or Toyota Fortuner 4x4",
    tip: "Spiti roads feature loose stones and shallow stream crossings (nullahs). Low-range 4x4 transfer case is strongly advised."
  },
  goa: {
    title: "🏖️ Goa Beach Circuit & Coastal Cruising",
    recommendation: "Narrow Village Roads, Beach Hops & Sunset Drives",
    bestVehicle: "Scooters (Activa/Ather EV) & Compact Hatchbacks",
    tip: "Scooters provide effortless beach-to-beach hopping, free parking near shacks, and agility through palm-lined lanes."
  },
  jaipur: {
    title: "🏰 Jaipur & Rajasthan Royal Expressway Advice",
    recommendation: "Smooth 6-Lane Desert Highways & Palace Circuits",
    bestVehicle: "Toyota Innova Crysta, Fortuner or Luxury Sedans",
    tip: "Intercity drives between Jaipur, Jodhpur, and Udaipur are seamless. Climate-controlled high-speed MPVs and sedans offer top comfort."
  },
  munnar: {
    title: "🌿 Munnar & Western Ghats Hill Roads",
    recommendation: "Misty Hairpin Bends & Rolling Tea Trails",
    bestVehicle: "Tata Nexon EV, Innova Crysta or AWD SUVs",
    tip: "Eco-sensitive hill station roads favor clean electric power and high-traction vehicles with hill-hold assist."
  },
  varanasi: {
    title: "🪔 Varanasi Ghats & Heritage Hubs",
    recommendation: "Old City Alleys & Sarnath Express Highway",
    bestVehicle: "City Scooters (for Ghats) & Swift Sedan (for Sarnath / Airport)",
    tip: "Use lightweight 2-wheelers for Old Varanasi ghat lanes, and comfortable AC sedans for long airport / highway transfers."
  },
  rishikesh: {
    title: "🌊 Rishikesh & Haridwar Valley Trails",
    recommendation: "Ganges River Valleys, Camping Trails & Hill Temples",
    bestVehicle: "Royal Enfield Himalayan or Mahindra Thar 4x4",
    tip: "Great for scenic riverside rides to Devprayag and Neelkanth temple roads."
  },
  bangalore: {
    title: "🌳 Bangalore & Coorg Coffee Plantation Trails",
    recommendation: "City Expressways & Western Ghats Plantation Tracks",
    bestVehicle: "Electric SUVs (Nexon EV) & Luxury MPVs",
    tip: "Abundant EV fast-charging stations across Karnataka highways make electric and hybrid travel exceptionally cost-effective."
  }
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [downloadedId, setDownloadedId] = useState(null);

  const [mainSection, setMainSection] = useState('passes'); // 'passes', 'vehicles', 'match', 'upcoming', or 'sharing'

  // Vehicle Rental States
  const [vehicleLocation, setVehicleLocation] = useState('all');
  const [vehicleType, setVehicleType] = useState('all');
  const [vehicleBudget, setVehicleBudget] = useState('all'); // 'all', 'budget', 'moderate', 'premium', 'luxury'
  const [vehiclesList, setVehiclesList] = useState(DEFAULT_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleBookingSuccess, setVehicleBookingSuccess] = useState(false);
  const [vehiclePickupDate, setVehiclePickupDate] = useState('2026-10-15');
  const [vehicleReturnDate, setVehicleReturnDate] = useState('2026-10-18');
  const [vehiclePickupPoint, setVehiclePickupPoint] = useState('Airport Pickup Terminal');
  const [vehicleDriverMode, setVehicleDriverMode] = useState('self_drive'); // 'self_drive' or 'with_chauffeur'
  const [vehicleBookingRef, setVehicleBookingRef] = useState(null);

  // Match My Trip States
  const [matchDestination, setMatchDestination] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchedTrips, setMatchedTrips] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [matchAttempted, setMatchAttempted] = useState(false);
  const [customRequestSent, setCustomRequestSent] = useState(false);

  // Explore Upcoming Trips States
  const [upcomingDestination, setUpcomingDestination] = useState('');
  const [upcomingMinPrice, setUpcomingMinPrice] = useState('');
  const [upcomingMaxPrice, setUpcomingMaxPrice] = useState('');
  const [upcomingDateFrom, setUpcomingDateFrom] = useState('');
  const [upcomingDateTo, setUpcomingDateTo] = useState('');
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [isFetchingUpcoming, setIsFetchingUpcoming] = useState(false);
  const [selectedAgencyTrip, setSelectedAgencyTrip] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter Vehicles dynamically based on Location, Type, and Budget
  useEffect(() => {
    let list = [...DEFAULT_VEHICLES];

    // 1. Location filter
    if (vehicleLocation && vehicleLocation !== 'all') {
      list = list.filter(v => v.locations.includes(vehicleLocation.toLowerCase()));
    }

    // 2. Type filter
    if (vehicleType && vehicleType !== 'all') {
      list = list.filter(v => v.type === vehicleType);
    }

    // 3. Budget filter
    if (vehicleBudget === 'budget') {
      list = list.filter(v => v.price_per_day <= 1500);
    } else if (vehicleBudget === 'moderate') {
      list = list.filter(v => v.price_per_day > 1500 && v.price_per_day <= 3500);
    } else if (vehicleBudget === 'premium') {
      list = list.filter(v => v.price_per_day > 3500 && v.price_per_day <= 7000);
    } else if (vehicleBudget === 'luxury') {
      list = list.filter(v => v.price_per_day > 7000);
    }

    // 4. Mark location recommendations and prioritize them at top
    list = list.map(v => ({
      ...v,
      is_recommended_for_location: Boolean(vehicleLocation !== 'all' && v.recommended_for.includes(vehicleLocation.toLowerCase()))
    }));

    list.sort((a, b) => {
      if (a.is_recommended_for_location && !b.is_recommended_for_location) return -1;
      if (!a.is_recommended_for_location && b.is_recommended_for_location) return 1;
      return a.price_per_day - b.price_per_day;
    });

    setVehiclesList(list);
  }, [vehicleLocation, vehicleType, vehicleBudget]);

  const handleBookVehicle = (v) => {
    setSelectedVehicle(v);
    setVehicleBookingSuccess(false);
    setVehicleBookingRef(`BY-VH-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmVehicleBooking = () => {
    setVehicleBookingSuccess(true);
  };

  // Fetch upcoming trips helper
  const fetchUpcomingTrips = async () => {
    setIsFetchingUpcoming(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      if (upcomingDestination) params.append('destination', upcomingDestination);
      if (upcomingMinPrice) params.append('min_price', upcomingMinPrice);
      if (upcomingMaxPrice) params.append('max_price', upcomingMaxPrice);
      if (upcomingDateFrom) params.append('date_from', upcomingDateFrom);
      if (upcomingDateTo) params.append('date_to', upcomingDateTo);

      const res = await fetch(`${backendUrl}/api/trips/upcoming?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUpcomingTrips(data.trips || []);
      }
    } catch (err) {
      console.error("Failed to fetch upcoming agency trips:", err);
    } finally {
      setIsFetchingUpcoming(false);
    }
  };

  // Fetch match trips helper
  const handleMatchSearch = async (e) => {
    e.preventDefault();
    if (!matchDestination || !matchDate) return;
    setIsMatching(true);
    setMatchAttempted(false);
    setCustomRequestSent(false);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/trips/match?destination=${encodeURIComponent(matchDestination)}&date=${matchDate}`);
      if (res.ok) {
        const data = await res.json();
        setMatchedTrips(data.trips || []);
        setMatchAttempted(true);
      }
    } catch (err) {
      console.error("Failed to match trips:", err);
    } finally {
      setIsMatching(false);
    }
  };

  // Trigger upcoming fetch when filters or tab change
  useEffect(() => {
    if (mainSection === 'upcoming') {
      fetchUpcomingTrips();
    }
  }, [mainSection, upcomingDestination, upcomingMinPrice, upcomingMaxPrice, upcomingDateFrom, upcomingDateTo]);

  // Stay Sharing States
  const [sharingUserName, setSharingUserName] = useState('');
  const [sharingUserGender, setSharingUserGender] = useState('male');
  const [sharingCity, setSharingCity] = useState('');
  const [sharingArea, setSharingArea] = useState('');
  const [sharingCheckin, setSharingCheckin] = useState('');
  const [sharingCheckout, setSharingCheckout] = useState('');
  const [sharingBudget, setSharingBudget] = useState('');
  const [sharingStayType, setSharingStayType] = useState('Hostel');
  const [sharingGenderPref, setSharingGenderPref] = useState('same-gender');

  const [sharingMatches, setSharingMatches] = useState([]);
  const [isSubmittingSharing, setIsSubmittingSharing] = useState(false);
  const [sharingSubmitted, setSharingSubmitted] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Split Calculator States
  const [calculatorTotal, setCalculatorTotal] = useState('');
  const [calculatorPeople, setCalculatorPeople] = useState('2');
  const [splitResult, setSplitResult] = useState(null);
  const [isCalculatingSplit, setIsCalculatingSplit] = useState(false);

  // Social & Safety States
  const [connectedPartners, setConnectedPartners] = useState([]);
  const [reportedPartners, setReportedPartners] = useState([]);

  // Submit Sharing Request & find matches
  const handleSharingSubmit = async (e) => {
    e.preventDefault();
    if (!sharingCity || !sharingCheckin || !sharingCheckout || !sharingBudget) return;
    setIsSubmittingSharing(true);
    setSharingSubmitted(false);
    setSplitResult(null);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/booking/sharing/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: sharingUserName || 'Guest Traveller',
          user_gender: sharingUserGender,
          city: sharingCity,
          area: sharingArea,
          checkin: sharingCheckin,
          checkout: sharingCheckout,
          budget: parseFloat(sharingBudget),
          stay_type: sharingStayType,
          gender_pref: sharingGenderPref,
          verified: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSharingMatches(data.matches || []);
        setActiveRequest(data.request);
        setSharingSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit stay sharing request:", err);
    } finally {
      setIsSubmittingSharing(false);
    }
  };

  // Split Calculator action
  const handleCalculateSplit = async (e) => {
    e.preventDefault();
    if (!calculatorTotal || !calculatorPeople) return;
    setIsCalculatingSplit(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/booking/sharing/split`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: parseFloat(calculatorTotal),
          num_people: parseInt(calculatorPeople)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSplitResult(data);
      }
    } catch (err) {
      console.error("Failed to calculate split amount:", err);
    } finally {
      setIsCalculatingSplit(false);
    }
  };

  // Connect & safety actions
  const handleConnectRequest = (reqId) => {
    setConnectedPartners(prev => [...prev, reqId]);
  };

  const handleReportPartner = (reqId) => {
    setReportedPartners(prev => [...prev, reqId]);
    alert("Partner has been reported and blocked from your view. Our trust & safety team will review their profile.");
  };

  const bookings = [
    {
      id: "BK-88219",
      monument: "Kashi Vishwanath Corridor & Ganga Aarti VIP Pass",
      city: "Varanasi, UP",
      date: "Oct 14, 2026",
      time: "05:30 AM - 09:00 PM",
      status: "Confirmed",
      category: "epass",
      type: "ASI Heritage & Temple Trust",
      price: "₹450",
      visitors: 2,
      audioGuide: "Hindi / English",
      qrCodeData: "VIP-KASHI-2026-88219",
      bgGradient: "from-amber-500/10 via-saffron/5 to-transparent",
      accentColor: "emerald"
    },
    {
      id: "BK-77402",
      monument: "Certified Historian Guide: Hampi Stone Chariot",
      city: "Hampi, Karnataka",
      date: "Nov 02, 2026",
      time: "09:00 AM - 01:00 PM",
      status: "Verified Guide Assigned",
      category: "guide",
      type: "Ministry Certified Guide",
      guideName: "Dr. Ramesh Rao (ASI Certified)",
      price: "₹1,200",
      visitors: 4,
      audioGuide: "Kannada / English",
      qrCodeData: "GUIDE-HAMPI-2026-77402",
      bgGradient: "from-blue-500/10 via-indigo/5 to-transparent",
      accentColor: "blue"
    },
    {
      id: "BK-91043",
      monument: "Taj Mahal Sunrise Entry & Royal Gardens",
      city: "Agra, UP",
      date: "Dec 18, 2026",
      time: "06:00 AM - 09:00 AM",
      status: "Confirmed",
      category: "epass",
      type: "ASI Express E-Gate Ticket",
      price: "₹1,100",
      visitors: 2,
      audioGuide: "Multi-language Audio App",
      qrCodeData: "TAJ-SUNRISE-2026-91043",
      bgGradient: "from-rose-500/10 via-orange/5 to-transparent",
      accentColor: "emerald"
    },
    {
      id: "BK-65120",
      monument: "Ajanta & Ellora Caves Electric Shuttle & Priority Entry",
      city: "Aurangabad, MH",
      date: "Jan 05, 2027",
      time: "10:00 AM - 04:00 PM",
      status: "Confirmed",
      category: "epass",
      type: "Eco-Pass & ASI Heritage",
      price: "₹650",
      visitors: 3,
      audioGuide: "Marathi / English",
      qrCodeData: "AJANTA-ECO-2027-65120",
      bgGradient: "from-teal-500/10 via-emerald/5 to-transparent",
      accentColor: "emerald"
    }
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesTab = activeTab === 'all' || b.category === activeTab;
    const matchesSearch = b.monument.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = (id) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  };

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-saffron/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-saffron/20 to-emerald-500/20 border border-amber-400/30 text-forest-900 font-bold text-xs uppercase tracking-widest mb-4 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-saffron animate-spin-slow" />
            <span>Official Government ASI E-Passes & Guide Portal</span>
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.22, type: 'spring', stiffness: 140, damping: 18 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight"
          >
            Your Bookings & <span className="bg-gradient-to-r from-saffron to-amber-600 bg-clip-text text-transparent">Digital Passes</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-stone-600 text-base sm:text-lg mt-3"
          >
            Direct government ticketing integration with instant QR admission, Zero surge markup, and Ministry-verified expert guides.
          </motion.p>
        </motion.div>

        {/* Main Section Navigation Switcher */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl max-w-4xl mx-auto mb-10 shadow-inner overflow-x-auto gap-1">
          <button
            onClick={() => setMainSection('passes')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              mainSection === 'passes' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎟 E-Passes & Guides
          </button>
          <button
            onClick={() => setMainSection('vehicles')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              mainSection === 'vehicles' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🚗 Rent Vehicles
          </button>
          <button
            onClick={() => setMainSection('match')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              mainSection === 'match' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🤝 Match My Trip
          </button>
          <button
            onClick={() => setMainSection('upcoming')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              mainSection === 'upcoming' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📅 Upcoming Trips
          </button>
          <button
            onClick={() => setMainSection('sharing')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              mainSection === 'sharing' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🏠 Stay Sharing
          </button>
        </div>

        {mainSection === 'passes' && (
          <>
            {/* Quick Stats Summary Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto"
            >
              {[
                { label: "Active Passes", value: "4 E-Passes", icon: Ticket, color: "text-saffron" },
                { label: "Verified Guides", value: "1 Reserved", icon: ShieldCheck, color: "text-emerald-600" },
                { label: "Express Access", value: "Zero Queue", icon: Zap, color: "text-amber-500" },
                { label: "Surge Markup", value: "₹0 Free", icon: Check, color: "text-forest-900" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3.5"
                >
                  <div className={`p-2.5 rounded-xl bg-stone-100 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-500">{stat.label}</div>
                    <div className="font-serif font-black text-stone-900 text-sm sm:text-base">{stat.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Filter Tabs & Search Controls */}
            <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex bg-stone-200/70 p-1.5 rounded-2xl w-full sm:w-auto">
                {[
                  { id: 'all', label: 'All Bookings', count: bookings.length },
                  { id: 'epass', label: 'ASI E-Passes', count: bookings.filter(b => b.category === 'epass').length },
                  { id: 'guide', label: 'Certified Guides', count: bookings.filter(b => b.category === 'guide').length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === tab.id 
                        ? 'text-forest-900 shadow-md bg-white' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? 'bg-forest-900 text-white' : 'bg-stone-300/80 text-stone-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search booking or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-200/80 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bookings List Cards with Framer Motion Stagger */}
            <motion.div 
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto space-y-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((b) => (
                  <motion.div 
                    key={b.id} 
                    layout
                    variants={itemVariant}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card-lift relative overflow-hidden group hover:border-saffron/40 transition-colors"
                  >
                    {/* Decorative Background Gradient Accent */}
                    <div className={`absolute top-0 right-0 w-80 h-full bg-gradient-to-l ${b.bgGradient} opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity`} />

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      {/* Info Section */}
                      <div className="space-y-3 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                            b.status.includes('Confirmed') 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                            <span>{b.status}</span>
                          </span>
                          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {b.id}
                          </span>
                          <span className="text-xs font-medium text-stone-500 bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-full">
                            {b.type}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-forest-900 transition-colors">
                          {b.monument}
                        </h3>

                        {b.guideName && (
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{b.guideName}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                          <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                            <MapPin className="w-3.5 h-3.5 text-saffron" />
                            <span>{b.city}</span>
                          </span>
                          <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                            <Calendar className="w-3.5 h-3.5 text-saffron" />
                            <span>{b.date}</span>
                          </span>
                          <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                            <Clock className="w-3.5 h-3.5 text-saffron" />
                            <span>{b.time}</span>
                          </span>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100 gap-4 shrink-0">
                        <div className="text-left lg:text-right">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Paid</div>
                          <span className="font-serif text-2xl sm:text-3xl font-black text-forest-900">{b.price}</span>
                          <div className="text-[11px] text-stone-500 font-medium">{b.visitors} Visitor Pass(es)</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload(b.id)}
                            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center border border-stone-200"
                            title="Download PDF E-Ticket"
                          >
                            {downloadedId === b.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTicket(b)}
                            className="px-5 py-2.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md shadow-forest-900/20 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <QrCode className="w-4 h-4 text-saffron" />
                            <span>View QR Ticket</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredBookings.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8"
                >
                  <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h4 className="font-serif text-lg font-bold text-stone-800">No bookings match your search</h4>
                  <p className="text-xs text-stone-500 mt-1">Try switching tabs or searching for a different city or monument.</p>
                  <button 
                    onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                    className="mt-4 px-4 py-2 bg-saffron text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}

        <AnimatePresence mode="wait">
          {mainSection === 'vehicles' && (
            <motion.div
              key="vehicles-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-7xl mx-auto"
            >
              {/* Trust & Guarantee Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                  { label: "Tourist Fleet", value: "Govt. Verified", icon: ShieldCheck, color: "text-emerald-600" },
                  { label: "Deposit Policy", value: "Zero Deposit", icon: Key, color: "text-saffron" },
                  { label: "Navigation Support", value: "Offline GPS Included", icon: Navigation, color: "text-blue-500" },
                  { label: "Insurance", value: "Full Cover Included", icon: Award, color: "text-forest-900" }
                ].map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3.5"
                  >
                    <div className={`p-2.5 rounded-xl bg-stone-100 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-500">{stat.label}</div>
                      <div className="font-serif font-black text-stone-900 text-sm sm:text-base">{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Dynamic Filter Controls Panel */}
              <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
                
                {/* Row 1: Location & Budget Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Location Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-saffron" />
                      <span>1. Select Destination & Terrain Hub</span>
                    </label>
                    <select
                      value={vehicleLocation}
                      onChange={(e) => setVehicleLocation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all cursor-pointer"
                    >
                      <option value="all">🗺️ All India Rental Hubs (Pan-India)</option>
                      <option value="manali">🏔️ Manali & Rohtang Pass (Himachal Pradesh)</option>
                      <option value="leh">🏔️ Leh Ladakh & Pangong Tso (High Altitude)</option>
                      <option value="spiti">🏔️ Spiti Valley & Kaza (Offroad Rocky Circuit)</option>
                      <option value="goa">🏖️ Goa Beach Circuits & Coastal Highway</option>
                      <option value="jaipur">🏰 Jaipur & Rajasthan Royal Expressways</option>
                      <option value="munnar">🌿 Munnar & Western Ghats Hill Roads</option>
                      <option value="varanasi">🪔 Varanasi Ghats & Heritage Highways</option>
                      <option value="rishikesh">🌊 Rishikesh & Haridwar Valley Trails</option>
                      <option value="bangalore">🌳 Bangalore & Coorg Coffee Corridors</option>
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <span>2. Daily Budget Range</span>
                    </label>
                    <select
                      value={vehicleBudget}
                      onChange={(e) => setVehicleBudget(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all cursor-pointer"
                    >
                      <option value="all">💰 All Budgets (Any Price)</option>
                      <option value="budget">🟢 Budget Friendly (Under ₹1,500 / day)</option>
                      <option value="moderate">🟡 Mid-Range Comfort (₹1,500 – ₹3,500 / day)</option>
                      <option value="premium">🟠 Premium & 4x4 Mountain SUVs (₹3,500 – ₹7,000 / day)</option>
                      <option value="luxury">🟣 VIP & Large Group Vans (₹7,000+ / day)</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Vehicle Type Category Filter Pills */}
                <div className="space-y-2.5 pt-2 border-t border-stone-150">
                  <label className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-forest-900" />
                    <span>3. Vehicle Category</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Fleet', icon: SlidersHorizontal },
                      { id: 'suv_4x4', label: '🚙 4x4 Mountain SUVs', icon: Car },
                      { id: 'bike', label: '🏍️ Adventure Bikes', icon: Bike },
                      { id: 'scooter', label: '🛵 Coastal Scooters', icon: Bike },
                      { id: 'sedan', label: '🚗 Sedans & Hatchbacks', icon: Car },
                      { id: 'van_mpv', label: '🚐 Luxury MPVs & Vans', icon: Truck },
                      { id: 'ev', label: '⚡ Eco Electric EVs', icon: Zap }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setVehicleType(item.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          vehicleType === item.id 
                            ? 'bg-forest-900 text-white shadow-md shadow-forest-900/20 scale-105' 
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Dynamic Location Terrain Advisory Tip */}
              {vehicleLocation !== 'all' && LOCATION_TERRAIN_GUIDES[vehicleLocation] && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-saffron/10 to-emerald-500/10 border border-saffron/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-saffron" />
                      <h4 className="font-serif font-black text-stone-900 text-sm sm:text-base">
                        {LOCATION_TERRAIN_GUIDES[vehicleLocation].title}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-relaxed">
                      <strong>Terrain:</strong> {LOCATION_TERRAIN_GUIDES[vehicleLocation].recommendation}
                    </p>
                    <p className="text-xs text-stone-600 font-normal">
                      💡 <em>{LOCATION_TERRAIN_GUIDES[vehicleLocation].tip}</em>
                    </p>
                  </div>
                  <div className="shrink-0 bg-white px-4 py-2 rounded-2xl border border-saffron/40 shadow-sm text-center">
                    <span className="text-[9px] font-black uppercase text-saffron tracking-wider block">Best Match</span>
                    <span className="text-xs font-black text-forest-900">{LOCATION_TERRAIN_GUIDES[vehicleLocation].bestVehicle.split('&')[0]}</span>
                  </div>
                </motion.div>
              )}

              {/* Results Header Count */}
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-stone-600 uppercase tracking-widest">
                  Showing {vehiclesList.length} Verified Vehicles
                </span>
                {(vehicleLocation !== 'all' || vehicleType !== 'all' || vehicleBudget !== 'all') && (
                  <button 
                    onClick={() => { setVehicleLocation('all'); setVehicleType('all'); setVehicleBudget('all'); }}
                    className="text-xs text-saffron hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>

              {/* Vehicles Cards Grid */}
              {vehiclesList.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto space-y-3">
                  <Car className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-serif font-bold text-stone-800 text-lg">No vehicles matched this filter</h4>
                  <p className="text-xs text-stone-500">Try widening your daily budget or choosing 'All Fleet'.</p>
                  <button 
                    onClick={() => { setVehicleLocation('all'); setVehicleType('all'); setVehicleBudget('all'); }}
                    className="px-5 py-2.5 bg-forest-900 text-white rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    View All Vehicles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehiclesList.map((v) => (
                    <motion.div
                      key={v.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className={`bg-white rounded-3xl overflow-hidden border shadow-lg flex flex-col justify-between transition-all duration-300 ${
                        v.is_recommended_for_location 
                          ? 'border-saffron/60 ring-2 ring-saffron/20' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Vehicle Image with Badges */}
                      <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                        <img 
                          src={v.image} 
                          alt={v.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/20" />
                        
                        {/* Top Location Recommendation Badge */}
                        {v.is_recommended_for_location && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-saffron to-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Top Pick for this Terrain</span>
                          </div>
                        )}

                        {/* Category Label Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                          {v.category_label}
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{v.rating} ({v.reviews})</span>
                        </div>
                      </div>

                      {/* Card Body Specs */}
                      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-lg font-black text-stone-900 leading-snug">
                              {v.name}
                            </h3>
                          </div>
                          <span className="inline-block text-[11px] text-saffron font-extrabold uppercase tracking-wide">
                            🏔️ {v.terrain_tag}
                          </span>
                        </div>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center text-xs">
                          <div>
                            <span className="text-[9px] text-stone-400 font-bold uppercase block">Capacity</span>
                            <span className="font-black text-stone-800">{v.seats} Seats</span>
                          </div>
                          <div className="border-x border-stone-200">
                            <span className="text-[9px] text-stone-400 font-bold uppercase block">Gearbox</span>
                            <span className="font-black text-stone-800 truncate block px-1">{v.transmission.split('/')[0]}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 font-bold uppercase block">Economy</span>
                            <span className="font-black text-stone-800 truncate block">{v.fuel.split('(')[0]}</span>
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-1.5 pt-1">
                          {v.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-black" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>

                        {/* Price and Book CTA */}
                        <div className="pt-4 border-t border-stone-150 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-stone-400 font-bold uppercase block leading-none">Daily Tariff</span>
                            <div className="flex items-baseline">
                              <span className="font-serif text-2xl font-black text-forest-900">₹{v.price_per_day.toLocaleString('en-IN')}</span>
                              <span className="text-xs text-stone-500 font-bold ml-1">/ day</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookVehicle(v)}
                            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-saffron to-amber-600 hover:from-amber-600 hover:to-saffron text-white font-extrabold text-xs shadow-md shadow-saffron/20 transition-all cursor-pointer hover:scale-105"
                          >
                            Reserve Now
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

          {mainSection === 'match' && (
            <motion.div
                  key="match-section"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 max-w-3xl mx-auto"
                >
                  {/* Form Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                    <h3 className="font-serif text-2xl font-black text-stone-900 mb-2">
                      Find Agency Trips matching your schedule
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-sm font-medium mb-6">
                      Enter your planned destination and date to check if there are verified travel agency group departures scheduled within ±3 days of your travel windows.
                    </p>

                    <form onSubmit={handleMatchSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5">
                          Planned Destination
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-saffron absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jaipur, Varanasi, Goa..."
                            value={matchDestination}
                            onChange={(e) => setMatchDestination(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5">
                          Departure Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-saffron absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            required
                            value={matchDate}
                            onChange={(e) => setMatchDate(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-2">
                        <button
                          type="submit"
                          disabled={isMatching}
                          className="w-full py-3.5 rounded-2xl bg-saffron hover:bg-amber-600 disabled:bg-stone-300 text-white text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-saffron/20"
                        >
                          {isMatching ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Analyzing travel nodes...</span>
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              <span>Find Agency Matches</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Match Results list */}
                  {matchAttempted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h4 className="font-serif text-lg font-black text-stone-900 border-b border-stone-200 pb-2">
                        Search Results ({matchedTrips.length} Matches Found)
                      </h4>

                      {matchedTrips.map((trip) => (
                        <motion.div
                          key={trip.id}
                          whileHover={{ y: -3 }}
                          className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                <ShieldCheck className="w-3 h-3 text-blue-500" />
                                <span>{trip.agency_name} Verified</span>
                              </span>
                              <span className="text-[10px] font-mono text-stone-400 font-semibold">
                                {trip.id}
                              </span>
                            </div>
                            <h4 className="font-serif font-black text-stone-900 text-lg leading-tight">
                              {trip.trip_name}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-medium pt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-saffron" />
                                <span>{trip.destination}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-saffron" />
                                <span>{trip.start_date} ({trip.duration_days} Days)</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-saffron" />
                                <span className="text-rose-600 font-bold">{trip.seats_left} seats left</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:flex-col md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-stone-100 gap-4">
                            <div className="text-left md:text-right">
                              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block leading-none">Price/person</span>
                              <span className="font-serif text-2xl font-black text-forest-900">₹{trip.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              onClick={() => setSelectedAgencyTrip(trip)}
                              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs cursor-pointer shadow"
                            >
                              Join This Trip
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      {matchedTrips.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 text-center shadow-inner"
                        >
                          <Compass className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
                          <h5 className="font-serif text-base font-bold text-stone-850">
                            Is date/place ke liye koi trip nahi mila
                          </h5>
                          <p className="text-xs text-stone-500 font-medium max-w-md mx-auto mt-1">
                            Aap custom trip request bhej sakte ho, taaki hamari partner agencies aapke schedule ke hisaab se customize group route launch karein.
                          </p>

                          <div className="mt-5">
                            {customRequestSent ? (
                              <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Request Sent! Partner agencies will contact you soon.</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCustomRequestSent(true)}
                                className="px-6 py-3 rounded-2xl bg-saffron hover:bg-amber-600 text-white text-xs font-extrabold cursor-pointer shadow-md shadow-saffron/20"
                              >
                                Send Custom Trip Request
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {mainSection === 'upcoming' && (
                <motion.div
                  key="upcoming-section"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Filters Row */}
                  <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 items-end">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={upcomingDestination}
                        onChange={(e) => setUpcomingDestination(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Min Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={upcomingMinPrice}
                        onChange={(e) => setUpcomingMinPrice(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Max Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        value={upcomingMaxPrice}
                        onChange={(e) => setUpcomingMaxPrice(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Date From
                      </label>
                      <input
                        type="date"
                        value={upcomingDateFrom}
                        onChange={(e) => setUpcomingDateFrom(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-saffron"
                      />
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setUpcomingDestination('');
                          setUpcomingMinPrice('');
                          setUpcomingMaxPrice('');
                          setUpcomingDateFrom('');
                          setUpcomingDateTo('');
                        }}
                        className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl py-2.5 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  {/* Upcoming List Grid */}
                  {isFetchingUpcoming ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin text-saffron mx-auto mb-2" />
                      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Fetching scheduled departures...
                      </span>
                    </div>
                  ) : (
                    <motion.div 
                      variants={containerVariant}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {upcomingTrips.map((trip) => (
                        <motion.div
                          key={trip.id}
                          variants={itemVariant}
                          whileHover={{ y: -6, scale: 1.02, boxShadow: "0 15px 30px -5px rgba(240, 147, 43, 0.12), 0 8px 10px -6px rgba(240, 147, 43, 0.08)" }}
                          className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:border-saffron/45 overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer"
                        >
                          <div className="p-5 space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-blue-750 bg-blue-50 border border-blue-150 px-2 py-0.5 rounded-full">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                <span>{trip.agency_name}</span>
                              </span>
                              <span className="text-[10px] font-bold text-stone-400 uppercase">
                                {trip.duration_days} Days
                              </span>
                            </div>

                            <h4 className="font-serif font-black text-stone-900 text-base leading-tight">
                              {trip.trip_name}
                            </h4>

                            <div className="space-y-1.5 text-xs text-stone-500 font-medium pt-2">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-saffron" />
                                <span>{trip.destination}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-saffron" />
                                <span>Starts: {trip.start_date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-saffron" />
                                <span className="text-rose-600 font-bold">{trip.seats_left} / {trip.total_seats} seats left</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-stone-50 px-5 py-4 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-stone-400 uppercase block">Starting at</span>
                              <span className="font-serif text-lg font-black text-forest-900">₹{trip.price.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              onClick={() => setSelectedAgencyTrip(trip)}
                              className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs cursor-pointer shadow"
                            >
                              Explore & Book
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      {upcomingTrips.length === 0 && (
                        <div className="col-span-full bg-white rounded-3xl border border-stone-200 py-12 text-center p-8">
                          <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                          <h5 className="font-serif text-base font-bold text-stone-800">
                            No agency trips match these filters
                          </h5>
                          <p className="text-xs text-stone-500 mt-1">
                            Try resetting destination, price caps, or travel dates.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {mainSection === 'sharing' && (
                <motion.div
                  key="sharing-section"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 max-w-2xl mx-auto"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl font-black text-stone-900 mb-2">
                        Stay Sharing
                      </h3>
                      <p className="text-stone-500 text-xs font-medium">
                        Akela co-traveller banne ke bajaye co-travellers dhoondhein jo same city aur dates pe stay split karna chahein. Mandatory safety checks aur gender preferences built-in hain.
                      </p>
                    </div>

                    <form onSubmit={handleSharingSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Verma"
                            value={sharingUserName}
                            onChange={(e) => setSharingUserName(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Your Gender
                          </label>
                          <select
                            value={sharingUserGender}
                            onChange={(e) => setSharingUserGender(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Destination City
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-saffron absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Jaipur"
                              value={sharingCity}
                              onChange={(e) => setSharingCity(e.target.value)}
                              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Specific Area (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Assi Ghat"
                            value={sharingArea}
                            onChange={(e) => setSharingArea(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Check-In Date
                          </label>
                          <input
                            type="date"
                            required
                            value={sharingCheckin}
                            onChange={(e) => setSharingCheckin(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Check-Out Date
                          </label>
                          <input
                            type="date"
                            required
                            value={sharingCheckout}
                            onChange={(e) => setSharingCheckout(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Budget / Night (₹)
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 1500"
                            value={sharingBudget}
                            onChange={(e) => setSharingBudget(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Stay Type
                          </label>
                          <select
                            value={sharingStayType}
                            onChange={(e) => setSharingStayType(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          >
                            <option value="PG">PG</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Guesthouse">Guesthouse</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-500 mb-1.5 font-sans">
                            Gender Preference
                          </label>
                          <select
                            value={sharingGenderPref}
                            onChange={(e) => setSharingGenderPref(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:bg-white transition-all"
                          >
                            <option value="same-gender">Same-Gender Only</option>
                            <option value="any">Any Gender</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmittingSharing}
                          className="w-full py-3.5 rounded-2xl bg-saffron hover:bg-amber-600 disabled:bg-stone-300 text-white text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-saffron/20"
                        >
                          {isSubmittingSharing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Evaluating database requests...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              <span>Save Request & Find Matches</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Matching Results list */}
                  {sharingSubmitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h4 className="font-serif text-lg font-black text-stone-900 border-b border-stone-200 pb-2">
                        Stay Share Matching Profiles ({sharingMatches.filter(m => !reportedPartners.includes(m.id)).length} Compatible Profiles)
                      </h4>

                      <motion.div 
                        variants={containerVariant}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {sharingMatches
                          .filter(trip => !reportedPartners.includes(trip.id))
                          .map((partner) => (
                            <motion.div
                              key={partner.id}
                              variants={itemVariant}
                              whileHover={{ y: -6, scale: 1.02, boxShadow: "0 15px 30px -5px rgba(240, 147, 43, 0.12), 0 8px 10px -6px rgba(240, 147, 43, 0.08)" }}
                              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between transition-all duration-300 hover:border-saffron/45 cursor-pointer"
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-saffron flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                                      {partner.user_name.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <h5 className="font-serif font-black text-stone-900 text-sm leading-none">
                                          {partner.user_name}
                                        </h5>
                                        {partner.verified && (
                                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" title="Student ID & Phone Verified" />
                                        )}
                                      </div>
                                      <span className="text-[10px] font-bold text-stone-400 capitalize">
                                        {partner.user_gender} · Wants {partner.stay_type}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-mono text-stone-400 font-semibold">
                                    {partner.id}
                                  </span>
                                </div>

                                <div className="space-y-1.5 text-xs text-stone-500 font-medium bg-stone-50 p-3 rounded-2xl border border-stone-150">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-saffron" />
                                    <span>Area: {partner.area || "Any"} ({partner.city})</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-saffron" />
                                    <span>{partner.checkin} to {partner.checkout}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-saffron" />
                                    <span>Gender Preference: <strong className="capitalize">{partner.gender_pref}</strong></span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-stone-100 pt-3 gap-4">
                                <div>
                                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block leading-none">Budget cap</span>
                                  <span className="font-serif text-lg font-black text-forest-900">₹{partner.budget.toLocaleString('en-IN')}/night</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleReportPartner(partner.id)}
                                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs cursor-pointer"
                                    title="Report / Block Partner"
                                  >
                                    Report
                                  </button>
                                  <button
                                    onClick={() => handleConnectRequest(partner.id)}
                                    disabled={connectedPartners.includes(partner.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                                      connectedPartners.includes(partner.id)
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-forest-900 hover:bg-forest-800 text-white shadow'
                                    }`}
                                  >
                                    {connectedPartners.includes(partner.id) ? "Request Sent!" : "Request to Connect"}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>

                      {sharingMatches.filter(m => !reportedPartners.includes(m.id)).length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 text-center shadow-inner"
                        >
                          <Compass className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
                          <h5 className="font-serif text-base font-bold text-stone-850">
                            Koi match nahi mila abhi
                          </h5>
                          <p className="text-xs text-stone-500 font-medium max-w-md mx-auto mt-1">
                            Aapki request database mein save ho gayi hai. Open list mein safe wait karein, jaise hi koi traveller is date/place pe match karega, aapko alert milega.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
      </div>

      {/* QR Code Ticket Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 z-10 text-center overflow-hidden"
            >
              {/* Modal Decorative Wave */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-saffron via-amber-500 to-emerald-500" />

              <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified ASI E-Pass</span>
              </div>

              <h3 className="font-serif text-xl font-black text-stone-900 mb-1">
                {selectedTicket.monument}
              </h3>
              <p className="text-xs text-stone-500 mb-6">{selectedTicket.city} · {selectedTicket.date}</p>

              {/* QR Display Area */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 max-w-xs mx-auto mb-6 relative">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-stone-300 shadow-inner flex flex-col items-center justify-center">
                  <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-stone-900 rounded-lg place-items-center">
                    {/* Simulated Stylized QR Code Pattern */}
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full rounded-sm ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-saffron'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-stone-600 mt-3">
                  {selectedTicket.qrCodeData}
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1 mb-6 text-left bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Audio Guide:</span>
                  <span>{selectedTicket.audioGuide}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Time Window:</span>
                  <span>{selectedTicket.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Pass Type:</span>
                  <span>{selectedTicket.type}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(selectedTicket.id)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadedId === selectedTicket.id ? "Saved to Phone!" : "Save PDF"}</span>
                </button>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Travel Agency Trip Detail / Booking Modal */}
      <AnimatePresence>
        {selectedAgencyTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedAgencyTrip(null); setBookingSuccess(false); }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 overflow-hidden"
            >
              {/* Modal Decorative Wave */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-saffron via-amber-500 to-emerald-500" />

              <button 
                onClick={() => { setSelectedAgencyTrip(null); setBookingSuccess(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-black text-stone-900">
                    Trip Booked Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-sm mx-auto">
                    Your request has been registered with **{selectedAgencyTrip.agency_name}**. They will send the ticket confirmation voucher and payment invoice to your registered email shortly.
                  </p>
                  <button
                    onClick={() => { setSelectedAgencyTrip(null); setBookingSuccess(false); }}
                    className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-750 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>{selectedAgencyTrip.agency_name} Verified</span>
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                      {selectedAgencyTrip.trip_name}
                    </h3>
                    <p className="text-xs text-stone-500 font-semibold">
                      📍 {selectedAgencyTrip.destination} · 📅 Starts {selectedAgencyTrip.start_date} ({selectedAgencyTrip.duration_days} Days)
                    </p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-saffron uppercase tracking-widest block mb-2">
                      Trip Itinerary Summary
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans font-medium">
                      {selectedAgencyTrip.itinerary_summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Seats Left</span>
                      <span className="text-stone-955 font-black text-base">{selectedAgencyTrip.seats_left} Available</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                      <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider block mb-0.5">Booking Partner</span>
                      <span className="text-stone-955 font-black text-base">{selectedAgencyTrip.booking_platform || "Direct Agency"}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-150 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block leading-none">Total Fare / Person</span>
                      <span className="font-serif text-2xl font-black text-forest-900">₹{selectedAgencyTrip.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button
                      onClick={() => setBookingSuccess(true)}
                      className="px-6 py-3 rounded-2xl bg-saffron hover:bg-amber-600 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-saffron/20"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vehicle Rental Reservation Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedVehicle(null); setVehicleBookingSuccess(false); }}
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 overflow-hidden"
            >
              {/* Top Wave */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-saffron via-amber-500 to-emerald-500" />

              <button 
                onClick={() => { setSelectedVehicle(null); setVehicleBookingSuccess(false); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {vehicleBookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-black text-stone-900">
                    Vehicle Reserved Successfully!
                  </h3>
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Booking Pass ID:</span>
                      <span className="font-mono font-black text-stone-900">{vehicleBookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Vehicle:</span>
                      <span className="font-bold text-stone-900">{selectedVehicle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pickup Date:</span>
                      <span className="font-bold text-stone-900">{vehiclePickupDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Return Date:</span>
                      <span className="font-bold text-stone-900">{vehicleReturnDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Driver Mode:</span>
                      <span className="font-bold text-stone-900 capitalize">{vehicleDriverMode.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pickup Location:</span>
                      <span className="font-bold text-stone-900">{vehiclePickupPoint}</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 font-bold">
                    ✓ Zero security deposit verified. FastTag and road tax pre-cleared.
                  </p>
                  <button
                    onClick={() => { setSelectedVehicle(null); setVehicleBookingSuccess(false); }}
                    className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Govt. Verified Commercial Permit</span>
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                      {selectedVehicle.name}
                    </h3>
                    <p className="text-xs text-saffron font-bold">
                      🏔️ {selectedVehicle.terrain_tag}
                    </p>
                  </div>

                  {/* Date & Location Pickers */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Pickup Date</label>
                      <input 
                        type="date"
                        value={vehiclePickupDate}
                        onChange={(e) => setVehiclePickupDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Return Date</label>
                      <input 
                        type="date"
                        value={vehicleReturnDate}
                        onChange={(e) => setVehicleReturnDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800"
                      />
                    </div>
                  </div>

                  {/* Pickup Point */}
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Pickup Hub Point</label>
                    <select
                      value={vehiclePickupPoint}
                      onChange={(e) => setVehiclePickupPoint(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800"
                    >
                      <option value="Airport Pickup Terminal">✈️ Airport Pickup Terminal (Meet & Greet)</option>
                      <option value="Railway Station Hub">🚆 Main Railway Station Parking</option>
                      <option value="Hotel / Resort Doorstep Delivery">🏨 Hotel / Homestay Doorstep Delivery</option>
                      <option value="City Rental Center">🏢 City Center Rental Garage</option>
                    </select>
                  </div>

                  {/* Driver Mode Selector */}
                  <div className="space-y-1 text-xs">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Driving Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVehicleDriverMode('self_drive')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          vehicleDriverMode === 'self_drive'
                            ? 'border-forest-900 bg-forest-900 text-white shadow-sm'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        🚗 Self Drive
                      </button>
                      <button
                        type="button"
                        onClick={() => setVehicleDriverMode('with_chauffeur')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                          vehicleDriverMode === 'with_chauffeur'
                            ? 'border-forest-900 bg-forest-900 text-white shadow-sm'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        🧑‍✈️ With Local Driver (+₹600/d)
                      </button>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-stone-150 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block leading-none">Daily Rental Rate</span>
                      <span className="font-serif text-2xl font-black text-forest-900">
                        ₹{(selectedVehicle.price_per_day + (vehicleDriverMode === 'with_chauffeur' ? 600 : 0)).toLocaleString('en-IN')}
                        <span className="text-xs text-stone-500 font-normal"> / day</span>
                      </span>
                    </div>
                    <button
                      onClick={handleConfirmVehicleBooking}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-saffron to-amber-600 hover:from-amber-600 hover:to-saffron text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md shadow-saffron/20"
                    >
                      Confirm Reservation
                    </button>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

