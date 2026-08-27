import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Award, DownloadCloud, Heart, Globe, Settings, MapPin, 
  Sparkles, ShieldCheck, Camera, Calendar, Compass, FileCheck, 
  Map, MessageSquare, ShieldAlert
} from 'lucide-react';

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop");
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'packs' | 'stamps'

  // 3D Parallax Tilt States
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5, rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width; // 0 to 1
    const y = (e.clientY - card.top) / card.height; // 0 to 1
    
    // Rotate card: tilt max 12 degrees
    const rotateX = (y - 0.5) * -16; 
    const rotateY = (x - 0.5) * 16;
    
    setCoords({ x, y, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0.5, y: 0.5, rotateX: 0, rotateY: 0 });
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  const stampList = [
    { city: "Varanasi", date: "Oct 14, 2026", type: "Spiritual Path", seal: "🪔", rotation: "-rotate-6", color: "border-orange-500 text-orange-600 bg-orange-500/5" },
    { city: "Hampi", date: "Nov 02, 2026", type: "ASI Heritage", seal: "🏰", rotation: "rotate-12", color: "border-amber-600 text-amber-700 bg-amber-600/5" },
    { city: "Agra", date: "Dec 18, 2026", type: "Monument Express", seal: "🕌", rotation: "-rotate-12", color: "border-rose-500 text-rose-600 bg-rose-500/5" },
    { city: "Jaipur", date: "Aug 27, 2026", type: "Pink Palace Entry", seal: "👑", rotation: "rotate-6", color: "border-pink-500 text-pink-600 bg-pink-500/5" }
  ];

  const handlePhotoUpload = () => {
    const photos = [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
    ];
    const currentIndex = photos.indexOf(profilePhoto);
    const nextIndex = (currentIndex + 1) % photos.length;
    setProfilePhoto(photos[nextIndex]);
  };

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen relative overflow-hidden font-sans">
      {/* Floating Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-saffron/10 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -50, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Interactive 3D Parallax Holographic Passport Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered 
              ? `perspective(1200px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.01, 1.01, 1.01)` 
              : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isHovered
              ? '0 30px 60px -15px rgba(27, 58, 47, 0.5), 0 0 50px rgba(240, 147, 43, 0.25)'
              : '0 20px 40px -20px rgba(27, 58, 47, 0.3)'
          }}
          className="relative bg-gradient-to-br from-stone-900 via-forest-950 to-stone-950 rounded-3xl overflow-hidden border-2 border-stone-850 p-[2px] mb-10 transition-shadow duration-300"
        >
          {/* Saffron Double-Gold Border Foil */}
          <div className="absolute inset-2.5 rounded-[22px] border border-dashed border-saffron/20 pointer-events-none" />

          {/* Interactive Light Flare Sheen Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-500 z-20"
            style={{
              background: isHovered
                ? `radial-gradient(circle 350px at ${coords.x * 100}% ${coords.y * 100}%, rgba(240, 147, 43, 0.22) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 100%)`
                : 'radial-gradient(circle 350px at 50% 50%, rgba(240, 147, 43, 0.05) 0%, transparent 100%)'
            }}
          />

          {/* Banner Photo Overlay */}
          <div className="h-44 sm:h-52 w-full relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop" 
              alt="Indian Palace Banner" 
              className="w-full h-full object-cover opacity-25 filter saturate-[0.8] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-3 z-10 bg-stone-950/80 p-2 rounded-2xl border border-saffron/35 backdrop-blur-md shadow-lg shadow-black/45">
              <img 
                src="/explorer_badge.jpg" 
                alt="Government Travel Ambassador Gold Badge" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-saffron/60 object-cover shadow shadow-saffron/20"
              />
              <div className="text-left">
                <span className="block text-[8px] font-kongquest text-saffron tracking-wider leading-tight">Travel Ambassador</span>
                <span className="block text-[9px] font-engebrechtre text-stone-300 tracking-widest leading-none mt-0.5 uppercase font-bold">Verified v1.02</span>
              </div>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="relative px-6 pb-8 sm:px-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 sm:-mt-20 z-10">
            {/* Avatar Column */}
            <div className="relative group shrink-0">
              {/* Rotating outer color-gradient ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-saffron via-amber-500 to-emerald-500 p-[3px] shadow-lg"
              />
              
              {/* Actual Avatar Image */}
              <div className="absolute inset-[3px] rounded-full overflow-hidden bg-stone-900 border-2 border-stone-950 shadow-inner">
                <img 
                  src={profilePhoto} 
                  alt="Traveller Avatar" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Holographic Seal Over Profile Photo */}
              <div className="absolute top-1 left-1 bg-gradient-to-r from-saffron to-amber-500 border border-saffron/60 text-white rounded-full px-2 py-0.5 text-[8px] font-engebrechtre tracking-widest pointer-events-none transform -rotate-12 shadow-md uppercase">
                ASI Certified
              </div>

              {/* Camera Upload Action Button */}
              <button 
                onClick={handlePhotoUpload}
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-saffron hover:bg-amber-600 text-white border-2 border-stone-950 shadow-md transition-all duration-300 hover:scale-110 cursor-pointer"
                title="Simulate Photo Upload"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="text-center md:text-left flex-grow space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="font-airstream text-4xl sm:text-5xl text-stone-100 tracking-wide leading-none drop-shadow-md">
                    Aarav Sharma
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-engebrechtre tracking-widest uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inclusivity Ally</span>
                  </span>
                </div>
                
                <p className="text-xs text-stone-400 font-medium">
                  📍 Bangalore, Karnataka · 14 States Explored · ISL Trained Companion
                </p>
              </div>

              {/* Glowing Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-stone-850 pt-5">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center sm:text-left transition-all hover:bg-white/10 hover:border-saffron/30"
                >
                  <span className="font-kongquest text-lg sm:text-xl text-saffron block leading-none">28</span>
                  <p className="text-[9px] text-stone-500 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Monuments Visited</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center sm:text-left transition-all hover:bg-white/10 hover:border-saffron/30"
                >
                  <span className="font-kongquest text-lg sm:text-xl text-stone-100 block leading-none">06</span>
                  <p className="text-[9px] text-stone-500 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Offline state packs</p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center sm:text-left transition-all hover:bg-white/10 hover:border-saffron/30"
                >
                  <span className="font-kongquest text-lg sm:text-xl text-emerald-450 block leading-none">LVL 4</span>
                  <p className="text-[9px] text-stone-500 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Explorer Tier</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Switcher Grid */}
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl max-w-lg mx-auto mb-10 shadow-inner overflow-x-auto gap-1 border border-stone-200">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              activeTab === 'badges' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🏆 Badges
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              activeTab === 'packs' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📦 Offline Packs
          </button>
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap ${
              activeTab === 'stamps' 
                ? 'text-forest-900 bg-white shadow font-black' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🪔 Visa Stamps
          </button>
        </div>

        {/* Animated Contents Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { name: "Travel Ambassador", desc: "Official Ministry of Tourism Representative", image: "/explorer_badge.jpg", color: "from-saffron/10 to-transparent", border: "hover:border-saffron/30", status: "Accredited" },
                { name: "Ganga Ghats Pilgrim", desc: "Visited Varanasi, Haridwar & Rishikesh", icon: "🪔", color: "from-orange-500/10 to-transparent", border: "hover:border-orange-500/30", status: "Unlocked" },
                { name: "Himalayan Nomad", desc: "Crossed 3 high passes above 12,000 ft", icon: "🏔️", color: "from-blue-500/10 to-transparent", border: "hover:border-blue-500/30", status: "Unlocked" },
                { name: "ASI Historian", desc: "Explored 20+ ASI UNESCO sites", icon: "🏛️", color: "from-amber-600/10 to-transparent", border: "hover:border-amber-500/30", status: "Unlocked" }
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariant}
                  whileHover={{ y: -6, scale: 1.03, boxShadow: "0 15px 30px -5px rgba(240, 147, 43, 0.1), 0 8px 10px -6px rgba(240, 147, 43, 0.05)" }}
                  className={`bg-white rounded-3xl p-6 border border-stone-200 text-center relative overflow-hidden transition-all duration-300 ${badge.border} flex flex-col justify-between h-48 cursor-pointer`}
                >
                  <div className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b ${badge.color}`} />
                  <div className="relative z-10 flex flex-col items-center">
                    {badge.image ? (
                      <img src={badge.image} alt={badge.name} className="w-12 h-12 rounded-full border border-saffron/45 mb-2.5 shadow object-cover" />
                    ) : (
                      <div className="text-4xl mb-3 transform hover:rotate-12 transition-transform duration-300">{badge.icon}</div>
                    )}
                    <h4 className="font-coolvetica text-base font-medium tracking-tight text-stone-900">{badge.name}</h4>
                    <p className="text-[11px] text-stone-500 mt-2 leading-relaxed font-semibold">{badge.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron/10 border border-saffron/30 text-saffron text-[8px] font-kongquest uppercase tracking-wider mx-auto mt-2">
                    <span>★ {badge.status}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'packs' && (
            <motion.div
              key="packs"
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              {[
                { state: "Uttar Pradesh Heritage Pack", size: "142 MB", date: "Updated 2 days ago", coverage: "Varanasi, Agra, Sarnath" },
                { state: "Himachal Valley Trails & GPS", size: "210 MB", date: "Updated 1 week ago", coverage: "Spiti, Keylong, Kaza" },
                { state: "Karnataka UNESCO Circuit", size: "98 MB", date: "Updated 3 weeks ago", coverage: "Hampi, Pattadakal, Mysore" }
              ].map((pack, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariant}
                  whileHover={{ x: 6 }}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-saffron/40"
                >
                  <div className="space-y-1">
                    <h4 className="font-dustismo text-base tracking-wide text-stone-900">{pack.state}</h4>
                    <p className="text-[11px] text-stone-500 font-semibold">{pack.size} · {pack.date}</p>
                    <span className="inline-block text-[10px] text-stone-400 font-medium">Coverage: {pack.coverage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-engebrechtre tracking-widest uppercase border border-emerald-100 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Ready Offline</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'stamps' && (
            <motion.div
              key="stamps"
              variants={containerVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stampList.map((stamp, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariant}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className={`border-2 border-dashed rounded-full w-42 h-42 flex flex-col items-center justify-center p-4 text-center mx-auto transition-all duration-300 shadow-inner ${stamp.rotation} ${stamp.color}`}
                >
                  <span className="text-3xl mb-1">{stamp.seal}</span>
                  <h4 className="font-raustila text-xl text-stone-900 leading-none">{stamp.city}</h4>
                  <span className="text-[8px] font-engebrechtre tracking-widest uppercase text-stone-400 mt-1.5 block">{stamp.type}</span>
                  <div className="border-t border-dashed border-current w-2/3 my-1.5 opacity-60" />
                  <span className="text-[9px] font-engebrechtre tracking-wide block">{stamp.date}</span>
                  <span className="text-[7px] font-engebrechtre tracking-widest text-emerald-600 mt-1 uppercase">APPROVED</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
