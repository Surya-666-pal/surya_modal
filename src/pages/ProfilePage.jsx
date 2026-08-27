import React from 'react';
import { motion } from 'framer-motion';
import { User, Award, DownloadCloud, Heart, Globe, Settings, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-saffron via-amber-500 to-amber-300 p-1">
              <div className="w-full h-full rounded-full bg-forest-900 flex items-center justify-center font-serif text-3xl font-bold text-white">
                AS
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-saffron text-white border-2 border-forest-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Aarav Sharma</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-xs font-bold">
                Level 4 Heritage Explorer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mb-4">
              Bangalore, Karnataka · 14 States Explored · ISL Ally Traveler
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-xs text-stone-300 border-t border-forest-800 pt-4">
              <div>
                <span className="font-bold text-white text-base">28</span>
                <p className="text-[11px] text-stone-400">Monuments Visited</p>
              </div>
              <div>
                <span className="font-bold text-white text-base">6</span>
                <p className="text-[11px] text-stone-400">Offline State Packs</p>
              </div>
              <div>
                <span className="font-bold text-white text-base">12</span>
                <p className="text-[11px] text-stone-400">Local Guide Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Downloaded Offline State Packs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card-lift">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-saffron" />
              <span>Downloaded Offline Packs (Zero Data)</span>
            </h3>

            <div className="space-y-3">
              {[
                { state: "Uttar Pradesh Heritage Pack", size: "142 MB", date: "Updated 2 days ago" },
                { state: "Himachal Valley Trails & GPS", size: "210 MB", date: "Updated 1 week ago" },
                { state: "Karnataka UNESCO Circuit", size: "98 MB", date: "Updated 3 weeks ago" },
              ].map((pack, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{pack.state}</h4>
                    <p className="text-[11px] text-stone-500">{pack.size} · {pack.date}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Ready Offline
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explorer Badges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card-lift">
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-saffron" />
              <span>Cultural Explorer Badges</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Ganga Ghats Pilgrim", desc: "Visited Varanasi, Haridwar & Rishikesh", icon: "🪔" },
                { name: "Himalayan Nomad", desc: "Crossed 3 high passes above 12,000 ft", icon: "🏔️" },
                { name: "ASI Historian", desc: "Explored 20+ ASI UNESCO sites", icon: "🏛️" },
                { name: "ISL Inclusivity Champion", desc: "Completed 5 ISL assisted monument circuits", icon: "🤟" },
              ].map((badge, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <h4 className="font-bold text-stone-900 text-xs">{badge.name}</h4>
                  <p className="text-[10px] text-stone-500 mt-1 leading-tight">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
