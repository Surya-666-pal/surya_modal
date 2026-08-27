import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';
import { VIBE_MAPPING } from '../services/vibeMapping';

// Mock data for group rooms – you can replace with real API later.
const GROUP_ROOMS = [
  {
    id: 'room-1',
    name: 'Spiritual Retreat – Varanasi',
    location: 'Varanasi, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1581338838442-1e3de4c8a4d9?q=80&w=1000&auto=format&fit=crop',
    vibes: ['spiritual_ghats'],
    rating: 4.9,
  },
  {
    id: 'room-2',
    name: 'Heritage Fort Experience – Jaipur',
    location: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    vibes: ['heritage_forts'],
    rating: 4.92,
  },
  {
    id: 'room-3',
    name: 'Lake & Tea Hill Escape – Darjeeling',
    location: 'Darjeeling, West Bengal',
    image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1000&auto=format&fit=crop',
    vibes: ['lakes_tea_hills'],
    rating: 4.88,
  },
];

// Animation variants for the cards
const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function GroupRoomSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700">
        {/* Floating particles */}
        <motion.div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => {
            const size = Math.random() * 3 + 2;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            return (
              <motion.div
                key={i}
                className="bg-saffron opacity-20 rounded-full"
                style={{ width: size, height: size, top: `${top}%`, left: `${left}%`, position: 'absolute' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, delay: Math.random() * 2 }}
              />
            );
          })}
        </motion.div>
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        style={{
          background: 'linear-gradient(90deg, rgba(255,215,0,0.04), rgba(255,165,0,0.08), rgba(255,215,0,0.04))',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Decorative top wave */}
      <motion.svg
        viewBox="0 0 1440 120"
        className="absolute top-0 left-0 w-full h-24"
        preserveAspectRatio="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <motion.path
          d="M0,120 C360,0 1080,0 1440,120 L1440,0 L0,0 Z"
          fill="rgba(255,215,0,0.06)"
        />
      </motion.svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl font-black text-white mb-8"
        >
          Explore Group Rooms
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-stone-200 text-base sm:text-lg max-w-2xl mx-auto mb-12"
        >
          Curated experiences for families, friends, and adventure groups — discover a shared itinerary that matches your vibe.
        </motion.p>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {GROUP_ROOMS.map((room, i) => (
            <motion.div
              key={room.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              variants={cardVariant}
            >
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-saffron" />
                    <span>{room.location}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold drop-shadow-md">{room.name}</h3>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                {/* Vibe badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {room.vibes.map(vId => {
                    const v = VIBE_MAPPING[vId];
                    if (!v) return null;
                    return (
                      <span
                        key={vId}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold"
                      >
                        <span>{v.emoji}</span>
                        <span>{v.label}</span>
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-0.5 text-xs font-bold text-stone-800">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s < Math.floor(room.rating) ? 'text-amber-500 fill-amber-500' : 'text-stone-200 fill-stone-200'}`}
                      />
                    ))}
                    <span className="ml-1 text-stone-600">{room.rating}</span>
                  </div>
                  <motion.span
                    animate={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium text-saffron flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
