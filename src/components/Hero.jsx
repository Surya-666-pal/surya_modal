import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, ChevronDown, ShieldCheck, MapPin } from 'lucide-react';
import heroVideoSrc from '../assets/hero-video.mp4';
import travelBadgeImg from '../assets/travel-badge.jpg';

export default function Hero({ onOpenPlanner, onExploreGems }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Guarantee autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .catch((error) => {
            console.warn("Video autoplay prevented by browser:", error);
          });
      }
    }
  }, []);

  // Staggered container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const scrollToStats = () => {
    const statsSection = document.getElementById('stats-strip');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-forest-900 z-0 pt-28 pb-20 md:py-32"
    >
      {/* Background Video Layer with Parallax Scale */}
      <motion.div 
        style={{ scale: videoScale }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none origin-center"
      >
        <video
          ref={videoRef}
          src={heroVideoSrc || "/hero-video.mp4"}
          poster="/assets/hero-traveler.png"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => {
            console.error("Hero background video failed to load:", e);
          }}
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Cinematic Gradient Overlays - z-10 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-forest-900/90 via-forest-900/40 to-transparent w-full md:w-3/5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-36 z-10 bg-gradient-to-t from-forest-900 via-forest-900/80 to-transparent pointer-events-none"></div>

      {/* Foreground Hero Content Container with Parallax slide - Left Aligned, z-20 */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl lg:max-w-3xl text-left">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Eyebrow Label with subtle transparent glass effect */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-saffron/40 text-saffron font-bold text-xs sm:text-sm tracking-[0.22em] uppercase shadow-lg backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
                <span>AI-POWERED TRAVEL COMPANION</span>
              </span>
            </motion.div>

            {/* Headline: "Explore Bharat," in Kong Quest + "without limits" in Mr Bedfort Font */}
            <motion.div variants={itemVariants} className="mb-6 select-none">
              {/* "Explore Bharat," in Kong Quest */}
              <h1 className="font-kongquest text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-wide leading-[1.08] drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] pb-1">
                Explore Bharat,
              </h1>

              {/* "without limits" in Mr Bedfort Font */}
              <div className="font-mrbedfort text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-saffron to-amber-400 drop-shadow-[0_4px_15px_rgba(240,147,43,0.45)] leading-tight pl-2 transform -rotate-1 origin-left mt-1">
                without limits
              </div>
            </motion.div>

            {/* Subheadline styled in Canva Airstream NF Font */}
            <motion.p
              variants={itemVariants}
              className="font-airstream text-stone-100 text-base sm:text-lg lg:text-xl font-normal leading-relaxed tracking-wide mb-8 max-w-xl text-balance drop-shadow-md"
            >
              Plan smart. Travel safe. Discover India's hidden stories — in your language, on your terms.
            </motion.p>

            {/* CTA Button Row with Dustismo Roman Bold Font & Glassmorphism */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA: "Plan My Trip" in Dustismo Roman Bold with Saffron Glassmorphic Effect */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenPlanner}
                className="font-dustismo px-8 py-4 rounded-full glass-btn-primary text-white font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 text-white" />
              </motion.button>

              {/* Secondary CTA: "Explore Hidden Gems" in Dustismo Roman Bold with Translucent Glassmorphism */}
              <motion.a
                href="#destinations"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="font-dustismo px-8 py-4 rounded-full glass-btn-secondary hover:bg-white/20 text-white font-bold text-base tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-amber-300" />
                <span className="text-white drop-shadow-sm">
                  Explore Hidden Gems
                </span>
              </motion.a>
            </motion.div>

            {/* Feature Badges with Translucent Glass Frost */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-200"
            >
              <div className="flex items-center gap-1.5 bg-black/40 hover:bg-black/50 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Govt. Verified Data</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 hover:bg-black/50 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-colors">
                <span className="w-2 h-2 rounded-full bg-saffron animate-ping" />
                <span className="font-medium">ISL Sign Language Ready</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 hover:bg-black/50 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md transition-colors">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="font-medium">100% Offline Navigation</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Travel Emblem Badge in Bottom Right Corner (Masking video watermark seamlessly) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
        whileHover={{ scale: 1.08, rotate: 3 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto"
      >
        <div className="relative group cursor-pointer">
          {/* Subtle Ambient Pulse Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/40 via-saffron/40 to-amber-500/40 blur-md group-hover:blur-lg transition-all duration-300 animate-pulse" />
          
          {/* Circular Badge Masked to remove background black */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-amber-400/90 shadow-[0_10px_35px_rgba(0,0,0,0.85)] bg-black/90 flex items-center justify-center">
            <img
              src={travelBadgeImg || "/assets/travel-badge.jpg"}
              alt="Bharat Yatra Travel Emblem - Explore Dream Discover Repeat"
              className="w-full h-full object-cover scale-[1.04] select-none pointer-events-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Scroll Down Indicator with Animated Bouncing Chevron */}
      <motion.button
        onClick={scrollToStats}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-300 hover:text-saffron transition-colors cursor-pointer group z-30"
        aria-label="Scroll down to statistics"
      >
        <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 group-hover:text-saffron">
          SCROLL
        </span>
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-5 h-5 text-saffron" />
        </motion.div>
      </motion.button>
    </section>
  );
}
