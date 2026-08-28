import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, Camera, Check, X, Upload, RotateCcw, 
  FileCheck, Globe, Award, DownloadCloud, MapPin, Eye, Zap, Shield
} from 'lucide-react';

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop";

const PRESET_AVATARS = [
  { id: '1', name: 'Nomad Traveler', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Himalayan Explorer', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Culture Pilgrim', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Solo Adventurer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' },
  { id: '5', name: 'Heritage Scholar', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
  { id: '6', name: 'Trail Guide', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop' },
];

export default function ProfilePage() {
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem('bharat_yatra_profile_photo') || DEFAULT_AVATAR;
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('bharat_yatra_user_name') || 'Aarav Sharma';
  });

  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'packs' | 'stamps'
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fileInputRef = useRef(null);

  // 3D Parallax Tilt States for Skeuomorphic Glass Slab
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5, rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width;
    const y = (e.clientY - card.top) / card.height;
    
    // Tactile 3D tilt calculation
    const rotateX = (y - 0.5) * -18; 
    const rotateY = (x - 0.5) * 18;
    
    setCoords({ x, y, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0.5, y: 0.5, rotateX: 0, rotateY: 0 });
  };

  const notify = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updatePhoto = (newPhotoUrl) => {
    setProfilePhoto(newPhotoUrl);
    localStorage.setItem('bharat_yatra_profile_photo', newPhotoUrl);
    setIsPhotoModalOpen(false);
    notify('Profile photo updated & saved in memory!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        updatePhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      updatePhoto(customUrlInput.trim());
      setCustomUrlInput('');
    }
  };

  const resetToDefault = () => {
    updatePhoto(DEFAULT_AVATAR);
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 220, damping: 18 }
    }
  };

  const stampList = [
    { city: "Varanasi", date: "Oct 14, 2026", type: "Spiritual Path", seal: "🪔", rotation: "-rotate-6", color: "border-orange-500 text-orange-600 bg-orange-500/10 shadow-[inset_0_2px_8px_rgba(249,115,22,0.2)]" },
    { city: "Hampi", date: "Nov 02, 2026", type: "ASI Heritage", seal: "🏰", rotation: "rotate-12", color: "border-amber-600 text-amber-700 bg-amber-600/10 shadow-[inset_0_2px_8px_rgba(217,119,6,0.2)]" },
    { city: "Agra", date: "Dec 18, 2026", type: "Monument Express", seal: "🕌", rotation: "-rotate-12", color: "border-rose-500 text-rose-600 bg-rose-500/10 shadow-[inset_0_2px_8px_rgba(244,63,94,0.2)]" },
    { city: "Jaipur", date: "Aug 27, 2026", type: "Pink Palace Entry", seal: "👑", rotation: "rotate-6", color: "border-pink-500 text-pink-600 bg-pink-500/10 shadow-[inset_0_2px_8px_rgba(236,72,153,0.2)]" }
  ];

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-[#10241e] via-[#0d1d18] to-[#081310] min-h-screen relative overflow-hidden font-sans text-stone-100 selection:bg-saffron selection:text-black">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Floating Dynamic Liquid Glass Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, 80, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-saffron/20 via-amber-500/15 to-transparent blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -70, 0],
            y: [0, 70, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-emerald-500/20 via-teal-400/15 to-transparent blur-[120px]"
        />
        {/* Subtle noise grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Toast Notification (Liquid Glass Pill) */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 bg-white/15 backdrop-blur-2xl text-white px-5 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] border border-white/30 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-saffron to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-saffron/40">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold drop-shadow">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= SKEUOMORPHIC LIQUID GLASS PASSPORT CARD ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered 
              ? `perspective(1200px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.015, 1.015, 1.015)` 
              : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative rounded-[32px] p-[2px] mb-12 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.85),0_0_50px_rgba(240,147,43,0.15)] group"
        >
          {/* Beveled Metallic Gold & Glass Border Frame */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/40 via-saffron/30 to-black/80 pointer-events-none" />

          {/* Liquid Glass Inner Container */}
          <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-br from-[#1b3a2f]/85 via-[#132c23]/90 to-[#0b1b15]/95 backdrop-blur-[36px] border border-white/20 p-6 sm:p-8 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_8px_rgba(0,0,0,0.7)]">
            
            {/* Skeuomorphic Stitched Gold Foil Border Track */}
            <div className="absolute inset-3 rounded-[24px] border-2 border-dashed border-saffron/30 pointer-events-none" />

            {/* Specular Liquid Glass Dynamic Glint Sweep (Mouse-Tracking) */}
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-300 z-20"
              style={{
                background: isHovered
                  ? `radial-gradient(circle 380px at ${coords.x * 100}% ${coords.y * 100}%, rgba(255, 255, 255, 0.45) 0%, rgba(240, 147, 43, 0.3) 35%, rgba(16, 185, 129, 0.15) 70%, transparent 100%)`
                  : 'radial-gradient(circle 380px at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 100%)'
              }}
            />

            {/* Top Gloss Highlight Reflection (Liquid Glass Top Rim) */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

            {/* Banner Artwork Area */}
            <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-white/15 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.4)]">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop" 
                alt="Indian Palace Banner" 
                className="w-full h-full object-cover opacity-35 filter saturate-[0.85] contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b15] via-[#0b1b15]/40 to-transparent" />
              
              {/* Skeuomorphic Embossed Metal Security Badge (Top Right) */}
              <div className="absolute top-4 right-4 flex items-center gap-3 z-10 bg-gradient-to-b from-stone-900/90 to-stone-950/95 p-2 rounded-2xl border-2 border-saffron/45 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-md">
                <div className="relative">
                  <img 
                    src="/explorer_badge.jpg" 
                    alt="Official Travel Ambassador Gold Badge" 
                    className="w-11 h-11 rounded-full border border-saffron/70 object-cover shadow-[0_4px_10px_rgba(240,147,43,0.3)]"
                  />
                  {/* Subtle glass reflection overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                </div>
                <div className="text-left pr-1">
                  <span className="block text-[8px] font-kongquest text-saffron tracking-wider leading-tight drop-shadow">Travel Ambassador</span>
                  <span className="block text-[9px] font-engebrechtre text-stone-300 tracking-widest leading-none mt-0.5 uppercase font-bold">Verified v1.02</span>
                </div>
              </div>
            </div>

            {/* Profile Card Body */}
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 sm:-mt-20 z-10 px-2 sm:px-4">
              
              {/* Dynamic Skeuomorphic Avatar Lens */}
              <div className="relative group shrink-0">
                {/* 3D Physical Bevel Shadow */}
                <div className="absolute -inset-1.5 rounded-full bg-black/60 blur-md pointer-events-none" />

                {/* Rotating Metallic Liquid Glass Color Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="w-34 h-34 sm:w-38 sm:h-38 rounded-full bg-gradient-to-tr from-saffron via-amber-400 to-emerald-400 p-[3.5px] shadow-[0_12px_30px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.6)]"
                />
                
                {/* Actual Avatar Frame (Tactile Camera Lens) */}
                <div 
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute inset-[4px] rounded-full overflow-hidden bg-stone-950 border-2 border-stone-900 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] cursor-pointer"
                  title="Click to customize profile picture"
                >
                  <img 
                    src={profilePhoto} 
                    alt="Traveller Avatar" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Convex Glass Specular Reflection Highlight */}
                  <div className="absolute top-0 inset-x-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none" />

                  {/* Hover interactive overlay */}
                  <div className="absolute inset-0 bg-stone-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[3px]">
                    <Camera className="w-6 h-6 text-saffron mb-0.5 animate-bounce" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-200">Change Photo</span>
                  </div>
                </div>

                {/* Holographic Embossed Seal Over Photo */}
                <div className="absolute top-1 left-1 bg-gradient-to-r from-saffron via-amber-500 to-amber-600 border border-white/60 text-white rounded-full px-2.5 py-0.5 text-[8px] font-engebrechtre tracking-widest pointer-events-none transform -rotate-12 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] uppercase font-bold">
                  ASI Certified
                </div>

                {/* Tactile Skeuomorphic Camera Action Button */}
                <button 
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute bottom-1 right-1 p-3 rounded-full bg-gradient-to-b from-saffron to-amber-600 text-white border border-amber-300 shadow-[0_6px_0_#92400e,0_10px_20px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.7)] transition-all duration-200 hover:scale-105 active:translate-y-1 active:shadow-[0_2px_0_#92400e,0_4px_10px_rgba(0,0,0,0.6)] cursor-pointer"
                  title="Open Photo Customizer"
                >
                  <Camera className="w-4 h-4 text-white drop-shadow" />
                </button>
              </div>

              {/* Profile Details Header */}
              <div className="text-center md:text-left flex-grow space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="font-airstream text-4xl sm:text-5xl text-white tracking-wide leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                      {userName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[9px] font-engebrechtre tracking-widest uppercase shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] backdrop-blur-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inclusivity Ally</span>
                    </span>
                  </div>
                  
                  <p className="text-xs text-stone-300 font-medium drop-shadow">
                    📍 Bangalore, Karnataka · 14 States Explored · ISL Trained Companion
                  </p>
                </div>

                {/* Skeuomorphic Liquid Glass Stats Tiles */}
                <div className="grid grid-cols-3 gap-3.5 sm:gap-4 pt-3">
                  
                  {/* Tile 1 */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/12 to-white/5 border border-white/20 p-3.5 text-center sm:text-left shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                  >
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="font-kongquest text-lg sm:text-2xl text-saffron block leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">28</span>
                    <p className="text-[9px] text-stone-400 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Monuments Visited</p>
                  </motion.div>
                  
                  {/* Tile 2 */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/12 to-white/5 border border-white/20 p-3.5 text-center sm:text-left shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                  >
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="font-kongquest text-lg sm:text-2xl text-stone-100 block leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">06</span>
                    <p className="text-[9px] text-stone-400 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Offline state packs</p>
                  </motion.div>

                  {/* Tile 3 */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/12 to-white/5 border border-white/20 p-3.5 text-center sm:text-left shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                  >
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    <span className="font-kongquest text-lg sm:text-2xl text-emerald-400 block leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">LVL 4</span>
                    <p className="text-[9px] text-stone-400 font-engebrechtre tracking-widest mt-1.5 uppercase font-bold">Explorer Tier</p>
                  </motion.div>

                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ================= SKEUOMORPHIC INSET SEGMENTED TAB SWITCHER ================= */}
        <div className="relative rounded-2xl p-1.5 max-w-lg mx-auto mb-10 bg-stone-950/70 border border-white/15 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-2xl flex gap-1.5">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap relative ${
              activeTab === 'badges' 
                ? 'text-white bg-gradient-to-b from-white/25 via-white/15 to-white/5 border border-white/35 shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] font-black' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🏆 Badges
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap relative ${
              activeTab === 'packs' 
                ? 'text-white bg-gradient-to-b from-white/25 via-white/15 to-white/5 border border-white/35 shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] font-black' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📦 Offline Packs
          </button>
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-2.5 px-4 text-xs font-coolvetica uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap relative ${
              activeTab === 'stamps' 
                ? 'text-white bg-gradient-to-b from-white/25 via-white/15 to-white/5 border border-white/35 shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.6)] font-black' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🪔 Visa Stamps
          </button>
        </div>

        {/* ================= SKEUOMORPHIC LIQUID GLASS CONTENT PANELS ================= */}
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
                { name: "Travel Ambassador", desc: "Official Ministry of Tourism Representative", image: "/explorer_badge.jpg", color: "from-saffron/20 to-transparent", border: "border-saffron/50", status: "Accredited" },
                { name: "Ganga Ghats Pilgrim", desc: "Visited Varanasi, Haridwar & Rishikesh", icon: "🪔", color: "from-orange-500/20 to-transparent", border: "border-orange-500/40", status: "Unlocked" },
                { name: "Himalayan Nomad", desc: "Crossed 3 high passes above 12,000 ft", icon: "🏔️", color: "from-blue-500/20 to-transparent", border: "border-blue-500/40", status: "Unlocked" },
                { name: "ASI Historian", desc: "Explored 20+ ASI UNESCO sites", icon: "🏛️", color: "from-amber-500/20 to-transparent", border: "border-amber-500/40", status: "Unlocked" }
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariant}
                  whileHover={{ y: -8, scale: 1.03, boxShadow: "0 25px 45px -10px rgba(0,0,0,0.8), 0 0 30px rgba(240,147,43,0.25)" }}
                  className={`rounded-3xl p-6 relative overflow-hidden bg-gradient-to-b from-white/12 to-white/5 border ${badge.border} shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.5)] backdrop-blur-2xl text-center flex flex-col justify-between h-52 cursor-pointer transition-all duration-300 group`}
                >
                  {/* Gloss Specular Arc */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    {badge.image ? (
                      <div className="relative mb-3">
                        <img src={badge.image} alt={badge.name} className="w-14 h-14 rounded-full border-2 border-saffron shadow-[0_6px_15px_rgba(240,147,43,0.4)] object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-2.5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">{badge.icon}</div>
                    )}
                    <h4 className="font-coolvetica text-base font-medium tracking-tight text-white drop-shadow">{badge.name}</h4>
                    <p className="text-[11px] text-stone-300 mt-1.5 leading-relaxed font-semibold drop-shadow">{badge.desc}</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-saffron/20 border border-saffron/40 text-saffron text-[8px] font-kongquest uppercase tracking-wider mx-auto mt-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
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
                  whileHover={{ x: 8, scale: 1.01 }}
                  className="relative rounded-3xl p-5 bg-gradient-to-b from-white/12 to-white/5 border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-saffron/50"
                >
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-3xl" />
                  
                  <div className="space-y-1 relative z-10">
                    <h4 className="font-dustismo text-base tracking-wide text-white drop-shadow">{pack.state}</h4>
                    <p className="text-[11px] text-stone-300 font-semibold">{pack.size} · {pack.date}</p>
                    <span className="inline-block text-[10px] text-stone-400 font-medium">Coverage: {pack.coverage}</span>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-engebrechtre tracking-widest uppercase border border-emerald-400/40 flex items-center gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
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
                  whileHover={{ scale: 1.08, rotate: 0 }}
                  className={`border-2 border-dashed rounded-full w-42 h-42 flex flex-col items-center justify-center p-4 text-center mx-auto transition-all duration-300 backdrop-blur-xl ${stamp.rotation} ${stamp.color}`}
                >
                  <span className="text-3xl mb-1 drop-shadow">{stamp.seal}</span>
                  <h4 className="font-raustila text-2xl text-white leading-none drop-shadow">{stamp.city}</h4>
                  <span className="text-[8px] font-engebrechtre tracking-widest uppercase text-stone-300 mt-1.5 block">{stamp.type}</span>
                  <div className="border-t border-dashed border-current w-2/3 my-1.5 opacity-60" />
                  <span className="text-[9px] font-engebrechtre tracking-wide block text-stone-200">{stamp.date}</span>
                  <span className="text-[7px] font-engebrechtre tracking-widest text-emerald-400 mt-1 uppercase font-bold">APPROVED</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ================= SKEUOMORPHIC LIQUID GLASS PHOTO CUSTOMIZER MODAL ================= */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative rounded-3xl p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#18352b]/95 to-[#0d201a]/98 border border-white/30 shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.4)] backdrop-blur-3xl z-10 space-y-6 overflow-hidden text-white"
            >
              {/* Header Specular Gloss Bar */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-saffron via-amber-400 to-emerald-400" />
              <div className="absolute top-2 inset-x-0 h-20 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

              <div className="flex justify-between items-start pt-1 relative z-10">
                <div>
                  <h3 className="font-serif text-2xl font-black text-white drop-shadow">
                    Customize Profile Photo
                  </h3>
                  <p className="text-xs text-stone-300 font-medium mt-0.5">
                    Upload your personal photo or select a verified avatar preset.
                  </p>
                </div>
                <button 
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white border border-white/15 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Active Preview Inset Container */}
              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] relative z-10">
                <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-saffron to-emerald-400 shrink-0 shadow-lg">
                  <img src={profilePhoto} alt="Current Preview" className="w-full h-full object-cover rounded-full" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Active Avatar</span>
                  <h4 className="font-serif font-black text-white text-base">{userName}</h4>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved in Local Storage
                  </span>
                </div>
              </div>

              {/* Physical Skeuomorphic Upload Button */}
              <div className="space-y-2 relative z-10">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-300">
                  Upload Photo From Device
                </label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-saffron/25 to-saffron/10 hover:from-saffron/35 hover:to-saffron/20 border-2 border-dashed border-saffron/60 text-amber-200 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)] active:scale-[0.99] cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-saffron animate-pulse" />
                  <span>Choose Image File (JPG, PNG, WebP)</span>
                </button>
              </div>

              {/* Curated Preset Avatars Grid */}
              <div className="space-y-2.5 relative z-10">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-300">
                  Or Pick a Curated Traveler Avatar
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = profilePhoto === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => updatePhoto(avatar.url)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group shadow-[0_6px_12px_rgba(0,0,0,0.5)] ${
                          isSelected ? 'border-saffron ring-2 ring-saffron/60 scale-105' : 'border-white/20 hover:border-white/60'
                        }`}
                        title={avatar.name}
                      >
                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-saffron/40 flex items-center justify-center text-white backdrop-blur-[1px]">
                            <Check className="w-5 h-5 drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image Web Link Input */}
              <form onSubmit={handleCustomUrlSubmit} className="space-y-2 relative z-10">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-stone-300">
                  Or Paste Image Web URL
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-saffron to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white text-xs font-bold shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
              </form>

              {/* Reset to Default */}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center relative z-10">
                <button 
                  onClick={resetToDefault}
                  className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
                <button 
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 text-xs font-bold transition-colors cursor-pointer"
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
