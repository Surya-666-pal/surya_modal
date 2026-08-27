import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Calendar, MapPin, Check, Star, ShieldCheck, ArrowRight, 
  QrCode, Download, Search, Filter, Clock, Sparkles, UserCheck, 
  Compass, ChevronRight, X, ExternalLink, RefreshCw
} from 'lucide-react';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [downloadedId, setDownloadedId] = useState(null);

  const bookings = [
    {
      id: "BK-88219",
      monument: "Kashi Vishwanath Corridor & Ganga Aarti VIP Pass",
      city: "Varanasi, UP",
      date: "Oct 14, 2026",
      time: "05:30 AM - 09:00 PM",
      status: "Confirmed",
      category: "epass",
      type: "ASI Heritage & Temple Trust",
      price: "₹450",
      visitors: 2,
      audioGuide: "Hindi / English",
      qrCodeData: "VIP-KASHI-2026-88219",
      bgGradient: "from-amber-500/10 via-saffron/5 to-transparent",
      accentColor: "emerald"
    },
    {
      id: "BK-77402",
      monument: "Certified Historian Guide: Hampi Stone Chariot",
      city: "Hampi, Karnataka",
      date: "Nov 02, 2026",
      time: "09:00 AM - 01:00 PM",
      status: "Verified Guide Assigned",
      category: "guide",
      type: "Ministry Certified Guide",
      guideName: "Dr. Ramesh Rao (ASI Certified)",
      price: "₹1,200",
      visitors: 4,
      audioGuide: "Kannada / English",
      qrCodeData: "GUIDE-HAMPI-2026-77402",
      bgGradient: "from-blue-500/10 via-indigo/5 to-transparent",
      accentColor: "blue"
    },
    {
      id: "BK-91043",
      monument: "Taj Mahal Sunrise Entry & Royal Gardens",
      city: "Agra, UP",
      date: "Dec 18, 2026",
      time: "06:00 AM - 09:00 AM",
      status: "Confirmed",
      category: "epass",
      type: "ASI Express E-Gate Ticket",
      price: "₹1,100",
      visitors: 2,
      audioGuide: "Multi-language Audio App",
      qrCodeData: "TAJ-SUNRISE-2026-91043",
      bgGradient: "from-rose-500/10 via-orange/5 to-transparent",
      accentColor: "emerald"
    },
    {
      id: "BK-65120",
      monument: "Ajanta & Ellora Caves Electric Shuttle & Priority Entry",
      city: "Aurangabad, MH",
      date: "Jan 05, 2027",
      time: "10:00 AM - 04:00 PM",
      status: "Confirmed",
      category: "epass",
      type: "Eco-Pass & ASI Heritage",
      price: "₹650",
      visitors: 3,
      audioGuide: "Marathi / English",
      qrCodeData: "AJANTA-ECO-2027-65120",
      bgGradient: "from-teal-500/10 via-emerald/5 to-transparent",
      accentColor: "emerald"
    }
  ];

  const filteredBookings = bookings.filter(b => {
    const matchesTab = activeTab === 'all' || b.category === activeTab;
    const matchesSearch = b.monument.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = (id) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
  };

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-saffron/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-saffron/20 to-emerald-500/20 border border-amber-400/30 text-forest-900 font-bold text-xs uppercase tracking-widest mb-4 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-saffron animate-spin-slow" />
            <span>Official Government ASI E-Passes & Guide Portal</span>
          </motion.div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
            Your Bookings & <span className="bg-gradient-to-r from-saffron to-amber-600 bg-clip-text text-transparent">Digital Passes</span>
          </h1>
          <p className="text-stone-600 text-base sm:text-lg mt-3">
            Direct government ticketing integration with instant QR admission, Zero surge markup, and Ministry-verified expert guides.
          </p>
        </motion.div>

        {/* Quick Stats Summary Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto"
        >
          {[
            { label: "Active Passes", value: "4 E-Passes", icon: Ticket, color: "text-saffron" },
            { label: "Verified Guides", value: "1 Reserved", icon: ShieldCheck, color: "text-emerald-600" },
            { label: "Express Access", value: "Zero Queue", icon: Zap, color: "text-amber-500" },
            { label: "Surge Markup", value: "₹0 Free", icon: Check, color: "text-forest-900" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-3.5"
            >
              <div className={`p-2.5 rounded-xl bg-stone-100 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-500">{stat.label}</div>
                <div className="font-serif font-black text-stone-900 text-sm sm:text-base">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs & Search Controls */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex bg-stone-200/70 p-1.5 rounded-2xl w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Bookings', count: bookings.length },
              { id: 'epass', label: 'ASI E-Passes', count: bookings.filter(b => b.category === 'epass').length },
              { id: 'guide', label: 'Certified Guides', count: bookings.filter(b => b.category === 'guide').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'text-forest-900 shadow-md bg-white' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-forest-900 text-white' : 'bg-stone-300/80 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search booking or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200/80 rounded-2xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bookings List Cards with Framer Motion Stagger */}
        <motion.div 
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((b) => (
              <motion.div 
                key={b.id} 
                layout
                variants={itemVariant}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card-lift relative overflow-hidden group hover:border-saffron/40 transition-colors"
              >
                {/* Decorative Background Gradient Accent */}
                <div className={`absolute top-0 right-0 w-80 h-full bg-gradient-to-l ${b.bgGradient} opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Info Section */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                        b.status.includes('Confirmed') 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>{b.status}</span>
                      </span>
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {b.id}
                      </span>
                      <span className="text-xs font-medium text-stone-500 bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-1 rounded-full">
                        {b.type}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-forest-900 transition-colors">
                      {b.monument}
                    </h3>

                    {b.guideName && (
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{b.guideName}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                      <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                        <MapPin className="w-3.5 h-3.5 text-saffron" />
                        <span>{b.city}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                        <Calendar className="w-3.5 h-3.5 text-saffron" />
                        <span>{b.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
                        <Clock className="w-3.5 h-3.5 text-saffron" />
                        <span>{b.time}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-stone-100 gap-4 shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Paid</div>
                      <span className="font-serif text-2xl sm:text-3xl font-black text-forest-900">{b.price}</span>
                      <div className="text-[11px] text-stone-500 font-medium">{b.visitors} Visitor Pass(es)</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(b.id)}
                        className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-all cursor-pointer flex items-center justify-center border border-stone-200"
                        title="Download PDF E-Ticket"
                      >
                        {downloadedId === b.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTicket(b)}
                        className="px-5 py-2.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md shadow-forest-900/20 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4 text-saffron" />
                        <span>View QR Ticket</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBookings.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8"
            >
              <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-stone-800">No bookings match your search</h4>
              <p className="text-xs text-stone-500 mt-1">Try switching tabs or searching for a different city or monument.</p>
              <button 
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-saffron text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* QR Code Ticket Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 z-10 text-center overflow-hidden"
            >
              {/* Modal Decorative Wave */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-saffron via-amber-500 to-emerald-500" />

              <button 
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified ASI E-Pass</span>
              </div>

              <h3 className="font-serif text-xl font-black text-stone-900 mb-1">
                {selectedTicket.monument}
              </h3>
              <p className="text-xs text-stone-500 mb-6">{selectedTicket.city} · {selectedTicket.date}</p>

              {/* QR Display Area */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 max-w-xs mx-auto mb-6 relative">
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-stone-300 shadow-inner flex flex-col items-center justify-center">
                  <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-stone-900 rounded-lg place-items-center">
                    {/* Simulated Stylized QR Code Pattern */}
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full rounded-sm ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-saffron'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-stone-600 mt-3">
                  {selectedTicket.qrCodeData}
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1 mb-6 text-left bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Audio Guide:</span>
                  <span>{selectedTicket.audioGuide}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Time Window:</span>
                  <span>{selectedTicket.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-700">Pass Type:</span>
                  <span>{selectedTicket.type}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleDownload(selectedTicket.id)}
                  className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadedId === selectedTicket.id ? "Saved to Phone!" : "Save PDF"}</span>
                </button>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper icon component for stats
function Zap(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
