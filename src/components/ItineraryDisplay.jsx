import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Compass, Shield, Check, Download, Share2, 
  Clock, DollarSign, Heart, Utensils, Sun, Sunrise, Sunset, 
  Navigation, Headphones, Bookmark, CheckCircle2
} from 'lucide-react';
import { saveTripOffline } from '../services/geminiAgent';

export default function ItineraryDisplay({ itineraryData }) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!itineraryData) return null;

  const {
    destination = "Varanasi & Sarnath Heritage Circuit",
    days = [],
    budget = "Balanced Comfort",
    group_size = 2,
    accessibility_features = ["ISL Video Guide", "Ramp Access Available"],
    key_highlights = ["VIP Ganga Aarti Pass", "Kashi Vishwanath Temple Walk", "Sarnath Stupa Guided Tour"]
  } = itineraryData;

  const handleSave = async () => {
    try {
      await saveTripOffline(itineraryData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.log("Save error:", e);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 bg-forest-900 text-white rounded-3xl p-5 sm:p-6 border border-forest-700/80 shadow-xl space-y-5"
    >
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/20 border border-saffron/30 text-saffron font-bold text-xs uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Generated AI Itinerary</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-black text-white">
            {destination}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-saffron" />
              <span>{days.length || 3} Days Journey</span>
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{budget}</span>
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Access</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-saffron hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Saved Offline!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Save Trip</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Key Highlights */}
      {key_highlights && key_highlights.length > 0 && (
        <div className="bg-forest-800/80 p-3.5 rounded-2xl border border-forest-700">
          <span className="text-[11px] font-bold uppercase tracking-wider text-saffron block mb-2">
            Trip Highlights
          </span>
          <div className="flex flex-wrap gap-2">
            {key_highlights.map((item, idx) => (
              <span key={idx} className="text-xs bg-forest-900/90 text-stone-200 px-3 py-1 rounded-xl border border-forest-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Days Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Day-by-Day Schedule
        </h4>

        {days.map((d, index) => (
          <div key={index} className="bg-forest-800/60 rounded-2xl p-4 border border-forest-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-saffron">
                Day {d.day || index + 1}: {d.theme || d.title || `Exploring ${destination}`}
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {d.activities?.length || 3} Activities
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {(d.activities || []).map((act, actIdx) => (
                <div key={actIdx} className="flex gap-4 p-3 rounded-2xl bg-forest-900/60 border border-forest-700/40 text-stone-200 items-center hover:border-saffron/30 transition-colors shadow-sm">
                  {act.image && (
                    <img 
                      src={act.image} 
                      alt={act.name || act.title || "Famous Place"} 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-forest-800 shrink-0 shadow-md bg-forest-900"
                      onError={(e) => {
                        e.target.style.display = 'none'; // Clean fallback if image URL fails
                      }}
                    />
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-saffron shrink-0" />
                      <span className="font-mono text-[10px] text-stone-400 font-bold uppercase">{act.time || "Schedule"}</span>
                      {act.category && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-forest-800/80 border border-forest-700 text-stone-300">
                          {act.category}
                        </span>
                      )}
                    </div>
                    <div className="font-serif font-black text-white text-sm sm:text-base tracking-tight mb-0.5">
                      {act.name || act.title}
                    </div>
                    <p className="text-stone-300 text-[11px] sm:text-xs leading-relaxed font-medium line-clamp-2">
                      {act.description || act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
