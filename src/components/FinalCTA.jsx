import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';

export default function FinalCTA({ onOpenPlanner }) {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-forest-900 text-white flex items-center justify-center">
      {/* Background Image with Dark Vignette/Overlay */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src="/assets/hero-traveler.png"
          alt="Scenic Indian landscape"
          className="w-full h-full object-cover object-bottom filter brightness-[0.35] contrast-125 scale-105"
          onError={(e) => {
            e.currentTarget.src = "/ChatGPT Image Aug 22, 2026, 03_38_35 PM.png";
          }}
        />
      </div>

      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/60 to-forest-900/90"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron/20 rounded-full blur-[130px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Ready In Under 60 Seconds</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Your Journey Starts Here
          </h2>

          {/* Subtext */}
          <p className="text-stone-200 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10 text-balance">
            Discover the unmapped trails, sacred rivers, and vibrant bazaars of Bharat. Designed with inclusive accessibility and offline power.
          </p>

          {/* Saffron Pulsing Glowing CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenPlanner}
              className="px-10 py-5 rounded-full bg-gradient-to-r from-saffron via-amber-500 to-saffron text-white font-bold text-lg tracking-wide flex items-center justify-center gap-3 shadow-saffron-glow animate-glow hover:brightness-110 transition-all duration-300 group"
            >
              <span>Start Planning with AI</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-300 border-t border-white/10 pt-8">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Itinerary Generator</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>24/7 Tourist SOS Protocol</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <HeartHandshake className="w-4 h-4 text-saffron" />
              <span>Inclusive & ISL Empowered</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
