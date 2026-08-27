import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sliders, 
  Cpu, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  MapPin,
  Layers,
  Zap
} from 'lucide-react';

const steps = [
  {
    step: "01",
    title: "Tell Us Your Vibe",
    subtitle: "Preferences & Accessibility",
    description: "Select your interests (heritage, spiritual, food, trek), trip duration, budget tier, and any accessibility requirements (ISL, wheelchair, sensory).",
    icon: Sliders,
    badge: "Step 1",
    tags: ["🏛️ Heritage", "🪔 Spiritual", "🏔️ Trek", "♿ ISL Ready"],
    accentColor: "from-amber-400 to-saffron"
  },
  {
    step: "02",
    title: "Get Your AI Itinerary",
    subtitle: "Curated in Under 5 Seconds",
    description: "Our multilingual AI crafts an optimized day-by-day itinerary considering real-time weather, crowd levels, monument timings, and scenic pitstops.",
    icon: Cpu,
    badge: "Step 2",
    tags: ["⚡ Multi-Route Sync", "🌤️ Live Weather", "⏱️ Timing Audit"],
    accentColor: "from-teal-400 to-tealAccent"
  },
  {
    step: "03",
    title: "Travel Safe, Explore Free",
    subtitle: "Live Navigation & Guard",
    description: "Enjoy zero-buffer offline guides, verified local storytellers on-demand, and an active 24/7 SOS safety mesh protecting every kilometer of your journey.",
    icon: Compass,
    badge: "Step 3",
    tags: ["🛡️ 24/7 SOS Mesh", "📶 100% Offline", "🗣️ Audio Tours"],
    accentColor: "from-rose-400 to-saffron"
  }
];

export default function HowItWorks({ onOpenPlanner }) {
  const [hoveredStep, setHoveredStep] = useState(null);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-forest-900 text-white relative overflow-hidden z-20">
      {/* Dynamic Atmospheric Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-saffron/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-tealAccent/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-saffron/40 text-saffron font-bold text-xs uppercase tracking-widest mb-4 backdrop-blur-md shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron animate-pulse" />
            <span>Seamless 3-Step Journey</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-leaguespartan text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
          >
            How Bharat Yatra Works
          </motion.h2>

          {/* Saffron Underline Accent */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="h-1.5 bg-saffron rounded-full mx-auto mt-4 mb-5 shadow-sm"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-stone-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto"
          >
            From the initial spark of wanderlust to the final memory on your camera roll, our AI-powered travel companion makes every step effortless.
          </motion.p>
        </div>

        {/* 3-Step Process with Connecting Animated Flight Route Line */}
        <div className="relative">
          {/* Connecting SVG Path Line for Desktop with Moving Saffron Waypoint Pulse */}
          <div className="hidden lg:block absolute top-28 left-[12%] right-[12%] h-14 -z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 900 60" fill="none">
              {/* Static Background Dash Route */}
              <path
                d="M 20 30 Q 230 70, 450 30 T 880 30"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              
              {/* Animated Saffron Draw Route */}
              <motion.path
                d="M 20 30 Q 230 70, 450 30 T 880 30"
                stroke="rgba(240, 147, 43, 0.85)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isHovered = hoveredStep === idx;

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.18, ease: [0.215, 0.61, 0.355, 1] }}
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                  whileHover={{ y: -8 }}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Step Circular Badge & Floating Animated Icon */}
                  <div className="relative mb-8">
                    {/* Glowing outer backdrop ring */}
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-saffron/20 via-amber-400/20 to-tealAccent/20 blur-md group-hover:blur-xl transition-all duration-500 scale-95 group-hover:scale-110" />

                    <motion.div 
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.4
                      }}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-forest-800 to-forest-900 border-2 border-white/25 group-hover:border-saffron flex items-center justify-center shadow-2xl shadow-black/60 relative z-10 transition-colors duration-300"
                    >
                      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-saffron group-hover:text-amber-300 transition-transform duration-300 group-hover:scale-110" />
                    </motion.div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-1.5 -right-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-forest-900 z-20 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                  </div>

                  {/* Liquid Glass Frosted Card */}
                  <div className="liquid-glass-peek group-hover:bg-white/15 rounded-3xl p-7 sm:p-8 border border-white/20 group-hover:border-saffron/60 w-full h-full flex flex-col justify-between transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                    <div>
                      {/* Step Subtitle */}
                      <span className="text-xs font-mono uppercase tracking-widest text-saffron mb-1.5 block font-bold">
                        {item.subtitle}
                      </span>
                      
                      {/* Step Title */}
                      <h3 className="font-leaguespartan text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      {/* Step Description */}
                      <p className="text-stone-300 text-sm leading-relaxed mb-6 font-normal">
                        {item.description}
                      </p>

                      {/* Interactive Micro-Tags Preview */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-stone-200 group-hover:border-white/25 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Guarantee */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-amber-300/90 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-saffron animate-pulse" />
                      <span>Instant AI Assistance & Sync</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action inside How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenPlanner}
            className="font-dustismo inline-flex items-center gap-3 px-9 py-4 rounded-full glass-btn-primary text-white font-bold text-base tracking-wide shadow-xl cursor-pointer group"
          >
            <span>Try AI Route Generator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-white" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
