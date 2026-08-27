import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: "Spiti Valley & Chandra Taal",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop",
    vibe: "Adventure & High Altitude",
    rating: 4.9,
    reviews: "1.4k",
    tag: "Trending Trek"
  },
  {
    id: 2,
    name: "Varanasi Subah Ghats",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?q=80&w=1000&auto=format&fit=crop",
    vibe: "Spiritual & Timeless Heritage",
    rating: 4.95,
    reviews: "3.2k",
    tag: "Cultural Soul"
  },
  {
    id: 3,
    name: "Munnar Rolling Tea Estates",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
    vibe: "Nature, Mist & Serenity",
    rating: 4.88,
    reviews: "2.1k",
    tag: "Ecotourism"
  },
  {
    id: 4,
    name: "Hampi Monumental Ruins",
    state: "Karnataka",
    image: "https://images.unsplash.com/photo-1600100397608-f010e4224716?q=80&w=1000&auto=format&fit=crop",
    vibe: "UNESCO Ancient Architecture",
    rating: 4.92,
    reviews: "1.8k",
    tag: "ASI Protected"
  },
  {
    id: 5,
    name: "Dawki Umngot Crystal River",
    state: "Meghalaya",
    image: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000&auto=format&fit=crop",
    vibe: "Transparent Waters & Living Bridges",
    rating: 4.96,
    reviews: "950",
    tag: "Hidden Gem"
  },
  {
    id: 6,
    name: "Pangong Lake & Nubra Valley",
    state: "Ladakh",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop",
    vibe: "Dramatic Passes & Stargazing",
    rating: 4.97,
    reviews: "2.8k",
    tag: "Must Visit"
  },
  {
    id: 7,
    name: "Amber Fort & Jaipur Palaces",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop",
    vibe: "Royal Rajputana Grandeur",
    rating: 4.89,
    reviews: "4.1k",
    tag: "Royal Heritage"
  }
];

export default function DestinationCarousel({ onSelectDestination }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="destinations" className="py-24 sm:py-32 bg-stone-50 relative overflow-hidden border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Navigation Arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron/10 border border-saffron/30 text-saffron font-bold text-xs uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Handpicked Gems</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
              Where Will You Go?
            </h2>
            <p className="text-stone-600 text-base sm:text-lg mt-3 max-w-xl">
              From snow-crowned Himalayan valleys to sun-drenched coastal backwaters and ancient monoliths.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-3.5 rounded-full bg-white border border-stone-200 hover:border-saffron hover:bg-amber-50 text-stone-700 hover:text-saffron shadow-sm transition-all duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3.5 rounded-full bg-white border border-stone-200 hover:border-saffron hover:bg-amber-50 text-stone-700 hover:text-saffron shadow-sm transition-all duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-[300px] sm:w-[340px] flex-shrink-0 snap-start group cursor-pointer"
              onClick={() => onSelectDestination && onSelectDestination(dest)}
            >
              <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-card-lift hover:shadow-card-lift-hover hover:border-saffron/50 transition-all duration-500 flex flex-col h-full">
                {/* Image Container with Parallax Zoom */}
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Gradient Overlay for image readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                  {/* Top Tag & Like Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-stone-800 uppercase tracking-wider shadow-sm">
                      {dest.tag}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-black/40 hover:bg-saffron text-white backdrop-blur-md flex items-center justify-center transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 text-saffron" />
                      <span>{dest.state}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-xs text-stone-500 font-medium mb-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-tealAccent" />
                      <span>{dest.vibe}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-stone-800 text-xs font-bold">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{dest.rating}</span>
                      <span className="text-stone-400 font-normal">({dest.reviews})</span>
                    </div>

                    <span className="text-xs font-bold text-saffron flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Destinations Link */}
        <div className="mt-10 text-center">
          <a
            href="#planner"
            className="inline-flex items-center gap-2 font-serif font-bold text-forest-800 hover:text-saffron text-lg transition-colors group"
          >
            <span>View All 3,600+ Destinations & Audio Circuits</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 text-saffron" />
          </a>
        </div>
      </div>
    </section>
  );
}
