import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { MapPin, Star, Sparkles, Compass, ArrowRight, Heart, SearchX, Search, Zap, Eye, Globe2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VIBE_CHIPS, VIBE_MAPPING } from '../services/vibeMapping';
import { searchMultipleVibes, clearPlacesCache } from '../services/placesService';
import GroupRoomSection from '../components/GroupRoomSection';

// Default featured gems
const allGems = [
  {
    id: 1,
    name: "Living Root Bridges & Mawlynnong",
    state: "Meghalaya",
    category: "Nature & Tribal Wisdom",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Low (Uncrowded)",
    rating: 4.97,
    description: "Bio-engineered botanical wonders woven across centuries by the Khasi tribes over rushing crystal waterfalls."
  },
  {
    id: 2,
    name: "Gandikota Grand Canyon",
    state: "Andhra Pradesh",
    category: "Geological Marvel",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Peaceful",
    rating: 4.88,
    description: "Spectacular gorge carved by the Penna River through red granite rocks with a 13th-century hilltop fortress."
  },
  {
    id: 3,
    name: "Ziro Valley Pine & Apatani Culture",
    state: "Arunachal Pradesh",
    category: "Indigenous Heritage",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Hidden Gem",
    rating: 4.95,
    description: "Pristine pine-clad basin celebrated for traditional sustainable paddy-cum-pisciculture farming and tribal folklore."
  },
  {
    id: 4,
    name: "Orchha Betwa Palaces & Cenotaphs",
    state: "Madhya Pradesh",
    category: "Medieval Architecture",
    image: "https://images.unsplash.com/photo-1600100397608-f010e4224716?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Moderate",
    rating: 4.91,
    description: "Grand 16th-century Bundela royal palaces rising majestically along the serene boulder-strewn Betwa riverbank."
  },
  {
    id: 5,
    name: "Dhanushkodi Ghost Island",
    state: "Tamil Nadu",
    category: "Coastal Legend",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Peaceful",
    rating: 4.86,
    description: "The land's end where the Indian Ocean meets the Bay of Bengal, surrounded by ancient submerged mythology."
  },
  {
    id: 6,
    name: "Tawang Monastery & Sela Pass",
    state: "Arunachal Pradesh",
    category: "Himalayan Sanctuary",
    image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=1000&auto=format&fit=crop",
    crowdLevel: "Serene",
    rating: 4.98,
    description: "India's largest Buddhist monastery perched at 10,000 feet amidst fluttering prayer flags and glacial lakes."
  }
];

const POPULAR_CITIES = [
  "Varanasi", "Jaipur", "Delhi", "Kerala", "Hampi",
  "Ladakh", "Spiti", "Rishikesh", "Udaipur", "Goa"
];

// Floating particles for hero background
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 3,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

// ─── Animated Card Component ───────────────────────────────────────────────────
function GemCard({ gem, index, onClick }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 18,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -18,
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const crowdColors = {
    'Hidden Gem': 'from-violet-600 to-purple-700',
    'Low (Uncrowded)': 'from-emerald-600 to-teal-700',
    'Peaceful': 'from-sky-500 to-blue-600',
    'Serene': 'from-indigo-500 to-violet-600',
    'Moderate': 'from-amber-500 to-orange-600',
    'Vibrant': 'from-rose-500 to-pink-600',
    'Popular': 'from-red-500 to-rose-600',
    'Extreme Adventure': 'from-red-600 to-red-800',
  };
  const crowdGradient = crowdColors[gem.crowdLevel] || 'from-stone-500 to-stone-700';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{
        duration: 0.55,
        delay: (index % 6) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: hovered ? mousePos.y : 0,
        rotateY: hovered ? mousePos.x : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        animate={{
          boxShadow: hovered
            ? '0 30px 70px -10px rgba(0,0,0,0.35), 0 0 0 1.5px rgba(240,147,43,0.5)'
            : '0 4px 24px -4px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl overflow-hidden border border-stone-200 flex flex-col relative"
      >
        {/* Glowing top border on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-saffron via-amber-400 to-saffron z-20 origin-left"
        />

        {/* Image Panel */}
        <div className="relative h-64 overflow-hidden bg-stone-200">
          <motion.img
            src={gem.image}
            alt={gem.name}
            animate={{ scale: hovered ? 1.10 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop'; }}
          />

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-br from-saffron/15 via-transparent to-amber-900/20"
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <motion.span
              animate={{ y: hovered ? -2 : 0 }}
              transition={{ duration: 0.3 }}
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${crowdGradient} text-white text-[11px] font-bold shadow-lg backdrop-blur-md`}
            >
              {gem.crowdLevel}
            </motion.span>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.88 }}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </motion.button>
          </div>

          {/* Shimmer scan line on hover */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={hovered ? { y: '200%' } : { y: '-100%' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none z-10"
          />

          {/* Bottom info overlay */}
          <motion.div
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-4 right-4 text-white z-10"
          >
            <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-saffron" />
              <span>{gem.state}</span>
            </div>
            <h3 className="font-serif text-xl font-bold drop-shadow-md leading-tight">{gem.name}</h3>
          </motion.div>

          {/* Hover CTA overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="px-5 py-2.5 rounded-full bg-saffron text-white font-bold text-xs flex items-center gap-2 shadow-2xl"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Plan This Circuit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow relative">
          {/* Radial glow on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-32 bg-saffron/10 rounded-full blur-2xl pointer-events-none"
          />

          <span className="text-[11px] font-mono uppercase tracking-widest text-saffron font-bold block mb-2 relative z-10">
            {gem.category}
          </span>

          {/* Vibe Badge(s) */}
          {gem.vibes && gem.vibes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
              {gem.vibes.map(vibeId => {
                const v = VIBE_MAPPING[vibeId];
                if (!v) return null;
                return (
                  <motion.span
                    key={vibeId}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-bold"
                  >
                    <span>{v.emoji}</span>
                    <span>{v.label}</span>
                  </motion.span>
                );
              })}
            </div>
          )}

          <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mb-4 flex-grow relative z-10">
            {gem.description}
          </p>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1 text-xs font-bold text-stone-800">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(gem.rating) ? 'text-amber-500 fill-amber-500' : 'text-stone-200 fill-stone-200'}`}
                />
              ))}
              <span className="ml-1 text-stone-600">{gem.rating}</span>
            </div>

            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-bold text-saffron flex items-center gap-1"
            >
              <span>Plan Circuit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Shimmer Skeleton ──────────────────────────────────────────────────────────
function SkeletonCard({ i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm flex flex-col"
    >
      <div className="h-64 relative overflow-hidden bg-stone-100">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear', delay: i * 0.15 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-2.5 w-20 bg-stone-100 rounded-full overflow-hidden relative">
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.1 + i * 0.1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
        <div className="h-4 w-3/4 bg-stone-100 rounded-full" />
        <div className="h-3 w-full bg-stone-100 rounded-full" />
        <div className="h-3 w-2/3 bg-stone-100 rounded-full" />
        <div className="pt-3 border-t border-stone-100 flex justify-between">
          <div className="h-3 w-16 bg-stone-100 rounded-full" />
          <div className="h-3 w-20 bg-stone-100 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HiddenGemsPage() {
  const navigate = useNavigate();
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [filteredGems, setFilteredGems] = useState(allGems);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [city, setCity] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [resultCount, setResultCount] = useState(null);
  const debounceRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const springY = useSpring(heroY, { stiffness: 80, damping: 20 });

  const toggleVibe = useCallback((vibeId) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId) ? prev.filter(v => v !== vibeId) : [...prev, vibeId]
    );
  }, []);

  const commitCity = useCallback((newCity) => {
    const trimmed = (newCity || '').trim();
    clearPlacesCache();
    setCity(trimmed);
    setCityInput(trimmed);
    setSelectedVibes(prev => [...prev]);
  }, []);

  const handleDetectLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse-geocode using Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          if (!res.ok) throw new Error("Reverse geocoding failed");
          const data = await res.json();
          
          const address = data.address || {};
          const resolvedCity = address.city || address.town || address.village || address.county || address.state || '';
          
          if (resolvedCity) {
            commitCity(resolvedCity);
          } else {
            alert("Could not identify your city name from coordinates, using fallback: Delhi");
            commitCity("Delhi");
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          alert("Error resolving city name. Defaulting to Delhi.");
          commitCity("Delhi");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation access failed:", error);
        setIsDetectingLocation(false);
        alert("Location access denied or timed out. Defaulting to Delhi.");
        commitCity("Delhi");
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  useEffect(() => {
    let isCancelled = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (selectedVibes.length === 0) {
      setFilteredGems(allGems);
      setResultCount(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const currentVibes = [...selectedVibes];
        const searchCity = city || 'India';
        const results = await searchMultipleVibes(currentVibes, searchCity);
        if (!isCancelled) {
          const final = Array.isArray(results) && results.length > 0 ? results : [];
          setFilteredGems(final);
          setResultCount(final.length);
        }
      } catch (err) {
        console.error('[HiddenGemsPage] ❌ Vibe filter error:', err);
        if (!isCancelled) { setFilteredGems([]); setResultCount(0); }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 400);

    return () => {
      isCancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedVibes, city]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <div className="min-h-screen bg-[#faf8f5] overflow-x-hidden">

      {/* ── Hero Section ──────────────────────────────────────── */}
      <div ref={heroRef} className="relative pt-28 pb-24 overflow-hidden">

        {/* Parallax background layer */}
        <motion.div
          style={{ y: springY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e1f1d] via-[#1a3530] to-[#0e1a18]" />
          {/* Bokeh circles */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: `${120 + i * 40}px`,
                height: `${120 + i * 40}px`,
                left: `${10 + i * 12}%`,
                top: `${5 + (i % 3) * 28}%`,
                background: i % 3 === 0
                  ? 'rgba(240,147,43,0.12)'
                  : i % 3 === 1
                    ? 'rgba(16,185,129,0.08)'
                    : 'rgba(99,102,241,0.08)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-saffron/40"
              style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(p.id) * 20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron/40 bg-saffron/10 text-saffron text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <Compass className="w-4 h-4" />
            </motion.div>
            <span>Off-The-Beaten Track India</span>
            <motion.span
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-saffron"
            />
          </motion.div>

          {/* Title with word-by-word reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-5"
          >
            Discover India's{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-amber-400 to-yellow-300">
                Hidden Gems
              </span>
              {/* Underline glow */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-saffron to-amber-400 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Step away from crowded tourist circuits into <span className="text-amber-300 font-semibold">authentic</span>, untamed, and soul-stirring cultural sanctuaries across incredible India.
          </motion.p>

          {/* Stats row */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap"
          >
            {[
              { value: '500+', label: 'Hidden Spots', icon: MapPin },
              { value: '28', label: 'States Covered', icon: Globe2 },
              { value: '4.9★', label: 'Avg Rating', icon: Star },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center gap-0.5 text-white"
              >
                <stat.icon className="w-4 h-4 text-saffron mb-1" />
                <span className="font-leaguespartan text-2xl font-black text-saffron">{stat.value}</span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#faf8f5" />
          </svg>
        </div>
      </div>

      {/* ── Controls & Filter Section ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* City Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto mb-6"
        >
          <div className="relative flex items-center group">
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
              className="absolute left-4 text-saffron pointer-events-none z-10"
            >
              <Search className="w-4 h-4" />
            </motion.div>
             <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitCity(cityInput); }}
              placeholder="Search by city, region or state (e.g. Varanasi, Kerala, Jaipur)"
              className="w-full bg-white border-2 border-stone-200 focus:border-saffron rounded-2xl pl-11 pr-32 py-3.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-all shadow-sm focus:shadow-[0_0_0_4px_rgba(240,147,43,0.1)]"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleDetectLocation}
                title="Detect my current location"
                className="p-1.5 rounded-xl border border-stone-200 hover:border-saffron/40 hover:text-saffron text-stone-500 transition-colors cursor-pointer bg-stone-50 hover:bg-saffron/5"
              >
                {isDetectingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin text-saffron" />
                ) : (
                  <MapPin className="w-4 h-4 text-saffron" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => commitCity(cityInput)}
                className="px-4 py-1.5 rounded-xl bg-saffron text-white text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer shadow-sm"
              >
                Search
              </motion.button>
            </div>
          </div>

          {/* City chips */}
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {city && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => { clearPlacesCache(); setCity(''); setCityInput(''); }}
                className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                ✕ Clear: {city}
              </motion.button>
            )}
            {POPULAR_CITIES.map((c, ci) => (
              <motion.button
                key={c}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.04 }}
                whileHover={{ scale: 1.07, y: -1 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => commitCity(c)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  city === c
                    ? 'bg-forest-900 text-white shadow-md'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-saffron/50 hover:text-saffron'
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Vibe Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2.5 overflow-x-auto pb-6 mb-3 no-scrollbar justify-start sm:justify-center"
        >
          {VIBE_CHIPS.map((vibe, vi) => {
            const isActive = selectedVibes.includes(vibe.id);
            return (
              <motion.button
                key={vibe.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + vi * 0.06, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => toggleVibe(vibe.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-forest-900 text-white shadow-lg'
                    : 'bg-white border-2 border-stone-200 text-stone-600 hover:border-saffron/60 hover:text-saffron'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`vibe-bg-${vibe.id}`}
                    className="absolute inset-0 bg-gradient-to-r from-forest-900 to-forest-800"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{vibe.emoji} {vibe.label}</span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-saffron text-white text-[10px] font-black"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

{/* ── Group Room Section ───────────────────────────────────── */}
<GroupRoomSection />

        {/* Result count badge */}
        <AnimatePresence>
          {resultCount !== null && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/8 border border-forest-900/15 text-stone-600 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-saffron" />
                {resultCount > 0
                  ? `Found ${resultCount} hidden gems${city ? ` in ${city}` : ''}`
                  : `No spots found${city ? ` in ${city}` : ''} for selected vibes`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeletons */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, i) => <SkeletonCard key={`skel-${i}`} i={i} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!isLoading && filteredGems.length === 0 && selectedVibes.length > 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center mb-5 shadow-inner"
              >
                <SearchX className="w-9 h-9 text-stone-400" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2">No Gems Found</h3>
              <p className="text-stone-500 text-sm max-w-md mb-6">
                No hidden spots matched your selected vibes{city ? ` in ${city}` : ''} — try another filter or broaden your search.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVibes([])}
                className="px-6 py-2.5 rounded-full bg-forest-900 text-white text-xs font-bold shadow-lg hover:bg-forest-800 transition-colors"
              >
                Show All Gems
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gems Grid */}
        <AnimatePresence mode="wait">
          {!isLoading && filteredGems.length > 0 && (
            <motion.div
              key={`grid-${selectedVibes.join('-')}-${city}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredGems.map((gem, index) => (
                <GemCard
                  key={gem.id || gem.place_id || gem.name}
                  gem={gem}
                  index={index}
                  onClick={() => navigate('/planner', { state: { destination: `${gem.name}, ${gem.state}` } })}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
