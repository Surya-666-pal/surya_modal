import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Bot, 
  Users, 
  ShieldAlert, 
  HandMetal, 
  BadgeCheck, 
  DownloadCloud,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import featuresVideoSrc from '../assets/features-video.mp4';

const features = [
  {
    id: 1,
    icon: Bot,
    title: "AI Trip Planner",
    tagline: "Tailored to your tempo & budget",
    description: "Generate multi-day hyper-personalized itineraries in seconds. Our AI balances travel times, cultural landmarks, local food joints, and rest periods seamlessly.",
    badge: "AI Powered",
    iconBg: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    stats: "3.2k itineraries generated today",
    perks: ["Smart route optimization", "Crowd & weather prediction", "Day-by-day customizable map"]
  },
  {
    id: 2,
    icon: Users,
    title: "Group Travel Room",
    tagline: "Collaborate & sync in real-time",
    description: "Plan together with friends and family. Share live routes, split expenses effortlessly with UPI integration, and vote on activities in interactive group boards.",
    badge: "Multiplayer",
    iconBg: "bg-teal-500/20 text-teal-300 border-teal-400/40",
    stats: "Live voting & expense tracking",
    perks: ["One-click UPI split ledger", "Real-time itinerary sync", "Shared media & notes hub"]
  },
  {
    id: 3,
    icon: ShieldAlert,
    title: "24/7 SOS Safety Guard",
    tagline: "Real-time tourist emergency mesh",
    description: "Instant panic button connecting you to local tourist police, nearest hospitals, and automated SMS alerts to trusted contacts with live GPS coordinates.",
    badge: "Safety First",
    iconBg: "bg-rose-500/20 text-rose-300 border-rose-400/40",
    stats: "100% Nationwide police network",
    perks: ["Direct 112 & 1363 emergency hook", "Offline geofence safety ping", "Verified women solo travel mesh"]
  },
  {
    id: 4,
    icon: HandMetal,
    title: "ISL Accessibility Suite",
    tagline: "India's 1st Sign Language Travel Hub",
    description: "Equipped with Indian Sign Language (ISL) video guides for 300+ monuments, wheelchair accessibility filters, braille markers, and low-mobility routes.",
    badge: "Inclusive 100%",
    iconBg: "bg-purple-500/20 text-purple-300 border-purple-400/40",
    stats: "300+ ASI monuments with ISL",
    perks: ["Certified ISL video guides", "Step-free & ramp route audit", "Sensory-friendly quiet hours"]
  },
  {
    id: 5,
    icon: BadgeCheck,
    title: "Verified Local Guides",
    tagline: "Ministry-certified regional storytellers",
    description: "Book verified local historians and cultural custodians who know the untold legends of every alley, temple, and fortress. Zero commission markup.",
    badge: "Verified",
    iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
    stats: "4.9/5 Guide traveler rating",
    perks: ["Ministry of Tourism certified", "Direct in-app booking", "Multi-dialect storytellers"]
  },
  {
    id: 6,
    icon: DownloadCloud,
    title: "100% Offline Maps & Audio",
    tagline: "Zero mobile connectivity required",
    description: "Heading into remote valleys or dense reserves? Download complete state packs with offline turn-by-turn navigation and rich immersive audio tours.",
    badge: "Zero Data Needed",
    iconBg: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    stats: "28 State offline packs ready",
    perks: ["Full turn-by-turn GPS offline", "Binaural 3D monument audio", "Emergency maps preloaded"]
  },
];

export default function Features({ onSelectFeature }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Parallax Scroll-linked horizon slide animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"]
  });

  const sectionSlideY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const sectionScale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  // Guarantee background video autoplay in continuous loop
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Features video autoplay prevented:", err);
        });
      }
    }
  }, []);

  // Auto slideshow advancing right to left every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const activeFeature = features[currentIndex];
  const nextFeature = features[(currentIndex + 1) % features.length];
  const Icon = activeFeature.icon;
  const NextIcon = nextFeature.icon;

  return (
    <motion.section 
      ref={sectionRef}
      id="features" 
      style={{ y: sectionSlideY, scale: sectionScale }}
      className="py-24 sm:py-32 relative overflow-hidden bg-forest-900 z-30 rounded-t-[40px] sm:rounded-t-[56px] lg:rounded-t-[72px] -mt-6 sm:-mt-10 border-t-2 border-white/25 shadow-[0_-30px_70px_rgba(0,0,0,0.85)] origin-top"
    >
      {/* Background Video Layer - Playing in continuous loop (1000051516_gwr_video_mvp.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={featuresVideoSrc || "/features-video.mp4"}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => {
            console.error("Features background video failed to load:", e);
          }}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
        >
          <source src="/features-video.mp4" type="video/mp4" />
          <source src="/assets/features-video.mp4" type="video/mp4" />
          <source src="/1000051516_gwr_video_mvp.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark/Teal Tint for Video Atmosphere & Card Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-forest-900/60 to-black/80 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading styled with Don Graffiti & Allura, Description, & Selector */}
          <div className="lg:col-span-5 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/90 border border-saffron/40 text-saffron font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
              <span>Built For Every Explorer</span>
            </motion.div>

            {/* Heading: "Everything You Need," in Don Graffiti + "in one app" in Allura */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-4 select-none"
            >
              <h2 className="font-dongraffiti text-4xl sm:text-5xl md:text-6xl text-white tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Everything You Need,
              </h2>
              <div className="font-allura text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-saffron to-amber-400 drop-shadow-[0_4px_15px_rgba(240,147,43,0.45)] leading-none pl-1 transform -rotate-1 origin-left mt-0.5">
                in one app
              </div>
            </motion.div>

            {/* Saffron Underline Accent */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="h-1.5 bg-saffron rounded-full mb-5 shadow-sm"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-stone-200 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-lg drop-shadow"
            >
              From spontaneous solo getaways to accessible family expeditions, Bharat Yatra bundles India’s most advanced travel AI, verified guides, and safety protocols into a single unified companion.
            </motion.p>

            {/* Interactive Module Selector Pills */}
            <div className="space-y-2 mb-8 hidden sm:block">
              {features.map((f, idx) => {
                const ItemIcon = f.icon;
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={f.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-full p-3 rounded-2xl border text-left text-xs transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-saffron text-white border-saffron shadow-lg scale-[1.02]'
                        : 'bg-black/40 hover:bg-black/60 border-white/15 text-stone-200 backdrop-blur-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white text-saffron' : 'bg-white/10 text-white'}`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <span className="font-leaguespartan font-bold text-sm tracking-wide">{f.title}</span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold text-white tracking-wider bg-black/30 px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Slideshow Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-saffron' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Auto Slideshow with Glass Transparency Effect */}
          <div 
            className="lg:col-span-7 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Navigation Controls */}
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/25 text-stone-200 hover:text-saffron shadow-md transition-all cursor-pointer backdrop-blur-md"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/25 text-stone-200 hover:text-saffron shadow-md transition-all cursor-pointer backdrop-blur-md"
                  aria-label="Next feature"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Widget Showcase Card with Glass Transparency Effect */}
            <div className="relative min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, x: 60, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="bg-white/15 backdrop-blur-2xl border border-white/35 rounded-3xl p-7 sm:p-9 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white"
                >
                  <div>
                    {/* Top Row: Icon + Badge + League Spartan Canva Title */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-14 h-14 rounded-2xl ${activeFeature.iconBg} border flex items-center justify-center shadow-lg backdrop-blur-md`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-saffron uppercase tracking-wider block drop-shadow-sm">
                            {activeFeature.badge}
                          </span>
                          <h3 className="font-leaguespartan text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                            {activeFeature.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-amber-200 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-sans drop-shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>{activeFeature.tagline}</span>
                    </div>

                    <p className="text-stone-100 text-sm sm:text-base leading-relaxed mb-6 font-normal drop-shadow-sm">
                      {activeFeature.description}
                    </p>

                    {/* Perks List with Glassy Tiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {activeFeature.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-white bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-sm">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer with Live Stat & Action */}
                  <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-sans drop-shadow">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{activeFeature.stats}</span>
                    </span>

                    <button
                      onClick={() => onSelectFeature && onSelectFeature(activeFeature)}
                      className="px-5 py-2.5 rounded-full bg-saffron hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105 font-leaguespartan tracking-wide"
                    >
                      <span>Explore {activeFeature.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Peek Next Widget (Stacked Below with Glass Transparency) */}
            <div 
              onClick={handleNext}
              className="mt-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 shadow-lg flex items-center justify-between cursor-pointer transition-all duration-300 text-white"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${nextFeature.iconBg} border shadow-sm backdrop-blur-md`}>
                  <NextIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-300 uppercase font-sans">Up Next</span>
                  <div className="text-sm font-leaguespartan font-bold text-white drop-shadow-sm">{nextFeature.title}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-saffron flex items-center gap-1">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        </div>
      </div>
    </motion.section>
  );
}
