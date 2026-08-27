import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HandMetal, Accessibility, Eye, Volume2, Sparkles, Check, Play, Download, ShieldCheck } from 'lucide-react';

export default function AccessibilityPage() {
  const [activeTab, setActiveTab] = useState('isl');

  const islVideos = [
    {
      title: "Taj Mahal — Story of Marble & Pietra Dura in ISL",
      duration: "4 mins 20 secs",
      monument: "Agra, Uttar Pradesh",
      thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Qutub Minar & Iron Pillar Architectural Secrets (ISL)",
      duration: "3 mins 45 secs",
      monument: "Delhi",
      thumbnail: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Hampi Stone Chariot & Musical Pillars in ISL",
      duration: "5 mins 10 secs",
      monument: "Karnataka",
      thumbnail: "https://images.unsplash.com/photo-1600100397608-f010e4224716?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 font-bold text-xs uppercase tracking-widest mb-3">
            <HandMetal className="w-3.5 h-3.5" />
            <span>Inclusive 100% · Bharat For Everyone</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Indian Sign Language & Accessibility Hub
          </h1>
          <p className="text-stone-600 text-base sm:text-lg mt-3">
            Pioneering digital inclusivity for deaf, hard-of-hearing, wheelchair users, and neurodiverse explorers across India.
          </p>
        </div>

        {/* Accessibility Features Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {[
            { id: 'isl', label: 'ISL Sign Language Guides', icon: HandMetal },
            { id: 'wheelchair', label: 'Wheelchair & Ramp Routes', icon: Accessibility },
            { id: 'audio', label: 'Descriptive Audio & Braille', icon: Volume2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest-900 text-white shadow-lg shadow-forest-900/20'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 text-saffron" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: ISL Video Showcase */}
        {activeTab === 'isl' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {islVideos.map((vid, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-card-lift group">
                  <div className="relative h-48 bg-stone-900 overflow-hidden">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-[11px] font-mono text-white">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold text-saffron uppercase tracking-wider block mb-1">
                      {vid.monument}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base mb-3 leading-snug">
                      {vid.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                      <span>Verified ISL Interpreter</span>
                      <button className="text-saffron font-bold flex items-center gap-1 hover:underline">
                        <Download className="w-3.5 h-3.5" />
                        <span>Offline</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Wheelchair Navigation */}
        {activeTab === 'wheelchair' && (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-card-lift">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">
              Wheelchair Friendly Monument Directory (ASI Certified)
            </h3>
            <p className="text-stone-600 text-sm mb-6">
              Real-time audit of entry ramps, battery vehicle availability, step-free corridors, and accessible washroom facilities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Kashi Vishwanath Corridor', 'Taj Mahal East Gate', 'Sun Temple Konark Ramp', 'Humayun’s Tomb Garden', 'Mysore Palace North Wing', 'Victoria Memorial Gardens'].map((name, i) => (
                <div key={i} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% Step-Free</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Audio & Sensory */}
        {activeTab === 'audio' && (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-card-lift">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">
              Sensory-Friendly & Descriptive Audio Tours
            </h3>
            <p className="text-stone-600 text-sm mb-6">
              Low-stimulation quiet hours schedule, high-contrast digital guides, and tactile 3D replica maps for visually impaired travelers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Quiet Exploration Hours</h4>
                <p className="text-xs text-stone-600">Monuments with designated early morning low-noise timings for sensory calm.</p>
              </div>
              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
                <h4 className="font-bold text-stone-900 text-sm mb-1">Binaural 3D Audio Descriptions</h4>
                <p className="text-xs text-stone-600">Spatial acoustic narration painting rich visual details of intricate stone carvings.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
