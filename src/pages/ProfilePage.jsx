import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Award, DownloadCloud, Heart, Globe, Settings, MapPin, 
  Sparkles, ShieldCheck, Camera, Calendar, Compass, FileCheck, 
  Map, MessageSquare, ShieldAlert, Upload, Image, RotateCcw, Check, X, Edit3, Droplets
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

const TOTAL_FRAMES = 120;
const getFramePath = (idx) => `/profile_frames/frame_${String(idx).padStart(3, '0')}.jpg`;

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
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload all extracted frames from gemini_generated_video_a33803a7
  useEffect(() => {
    const loadedImgs = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (i === 0) {
          renderCanvasFrame(0);
        }
      };
      loadedImgs.push(img);
    }
    imagesRef.current = loadedImgs;
  }, []);

  const renderCanvasFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Object-cover aspect fit
    const hRatio = w / img.width;
    const vRatio = h / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (w - img.width * ratio) / 2;
    const centerShiftY = (h - img.height * ratio) / 2;

    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
    );
  };

  // Listen to scroll to update frame index
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      
      setCurrentFrame(frameIdx);
      renderCanvasFrame(frameIdx);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderCanvasFrame(currentFrame);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentFrame]);

  // 3D Parallax Tilt States
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5, rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width;
    const y = (e.clientY - card.top) / card.height;
    
    const rotateX = (y - 0.5) * -12; 
    const rotateY = (x - 0.5) * 12;
    
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
    notify('Profile photo updated successfully!');
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
        staggerChildren: 0.08
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
    { city: "Varanasi", date: "Oct 14, 2026", type: "Spiritual Path", seal: "🪔", rotation: "-rotate-6", color: "border-black text-black bg-white/40" },
    { city: "Hampi", date: "Nov 02, 2026", type: "ASI Heritage", seal: "🏰", rotation: "rotate-12", color: "border-black text-black bg-white/40" },
    { city: "Agra", date: "Dec 18, 2026", type: "Monument Express", seal: "🕌", rotation: "-rotate-12", color: "border-black text-black bg-white/40" },
    { city: "Jaipur", date: "Aug 27, 2026", type: "Pink Palace Entry", seal: "👑", rotation: "rotate-6", color: "border-black text-black bg-white/40" }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden font-sans bg-slate-950">
      {/* Scroll-Scrubbed Video Frames Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-stone-950">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-transparent to-slate-950/80 pointer-events-none" />
      </div>

      {/* Hidden File Input for Direct Local Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 bg-black text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/40 flex items-center gap-3 font-bold"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black drop-shadow-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Floating Liquid Glass Drop Morph Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isHovered 
              ? `perspective(1200px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.01, 1.01, 1.01)` 
              : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative rounded-[42px] sm:rounded-[56px] overflow-hidden p-6 sm:p-10 mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.45)] border border-white/50 backdrop-blur-2xl bg-white/30"
        >
          {/* Liquid Glass Refraction Border & Outer Highlights */}
          <div className="absolute inset-0 rounded-[42px] sm:rounded-[56px] border-2 border-white/70 pointer-events-none shadow-[inset_0_2px_15px_rgba(255,255,255,0.8),inset_0_-2px_20px_rgba(255,255,255,0.4)]" />
          
          {/* Glass Bubble Highlights */}
          <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-white/50 border border-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95)] backdrop-blur-md pointer-events-none animate-pulse" />
          <div className="absolute bottom-4 right-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white/45 border border-white/80 shadow-[inset_0_2px_5px_rgba(255,255,255,0.95)] backdrop-blur-md pointer-events-none" />

          {/* Interactive Light Flare Reflection */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              background: isHovered
                ? `radial-gradient(circle 320px at ${coords.x * 100}% ${coords.y * 100}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)`
                : 'radial-gradient(circle 320px at 50% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 100%)'
            }}
          />

          {/* Card Content Layout */}
          <div className="relative z-10 flex flex-col justify-between min-h-[380px] sm:min-h-[440px] space-y-8">
            
            {/* Top Section: Avatar Lens Portal + Bio Info + Official Seal */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
              
              {/* Circular Lens Portal with Refracted Glass Ring */}
              <div className="relative group shrink-0">
                {/* Thick Liquid Glass Outer Ring */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2.5 bg-white/35 border-2 border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.3),inset_0_2px_10px_rgba(255,255,255,0.9)] backdrop-blur-md">
                  {/* Avatar Lens Image (Click to Customize) */}
                  <div 
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white/90 shadow-inner cursor-pointer relative group"
                    title="Click to customize profile photo"
                  >
                    <img 
                      src={profilePhoto} 
                      alt="Traveller Avatar" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                      <Camera className="w-6 h-6 text-saffron mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">Change</span>
                    </div>
                  </div>
                </div>

                {/* Floating Camera Quick-Upload Action Button */}
                <button 
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="absolute bottom-1 right-1 p-3 rounded-full bg-black hover:bg-stone-800 text-white border-2 border-white shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
                  title="Open Photo Customizer"
                >
                  <Camera className="w-4 h-4 text-saffron" />
                </button>
              </div>

              {/* Traveler Identity & Accreditation Badges (Bold & Black with Shadow) */}
              <div className="text-center md:text-left flex-grow space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="font-serif text-4xl sm:text-6xl text-black font-black tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]">
                      {userName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-black/30 text-black text-[11px] font-black tracking-wider uppercase backdrop-blur-md shadow-md drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 font-black" />
                      <span>Inclusivity Ally</span>
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-base text-black font-black drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)] leading-relaxed">
                    📍 Bangalore, Karnataka · 14 States Explored · ISL Trained Companion
                  </p>
                </div>

                {/* Official Ambassador Badge Pill */}
                <div className="inline-flex items-center gap-3 bg-white/60 border border-black/20 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-lg">
                  <img 
                    src="/explorer_badge.jpg" 
                    alt="Travel Ambassador Medal" 
                    className="w-10 h-10 rounded-full border-2 border-black object-cover shadow"
                  />
                  <div className="text-left">
                    <span className="block text-[9px] font-kongquest text-black uppercase tracking-wider font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">Travel Ambassador</span>
                    <span className="block text-[10px] font-engebrechtre text-black uppercase tracking-widest font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">Verified v1.02 · Ministry Certified</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom 3 Glass Stat Panels with Enhanced Font Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
              
              {/* Stat Box 1: Monuments Visited */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-3xl p-5 sm:p-6 bg-white/45 border border-white/85 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.22),inset_0_2px_6px_rgba(255,255,255,0.9)] text-center sm:text-left transition-all hover:bg-white/65 hover:border-black/50 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-coolvetica text-xs font-black uppercase tracking-wider text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                    Heritage Trail
                  </span>
                  <Award className="w-5 h-5 text-black opacity-90 group-hover:scale-110 transition-transform font-black" />
                </div>
                <span className="font-serif text-4xl sm:text-5xl text-black font-black block leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] tracking-tight">
                  28
                </span>
                <p className="font-engebrechtre text-xs sm:text-sm text-stone-900 font-black tracking-widest mt-2 uppercase drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
                  Monuments Visited
                </p>
              </motion.div>

              {/* Stat Box 2: Offline State Packs */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-3xl p-5 sm:p-6 bg-white/45 border border-white/85 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.22),inset_0_2px_6px_rgba(255,255,255,0.9)] text-center sm:text-left transition-all hover:bg-white/65 hover:border-black/50 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-coolvetica text-xs font-black uppercase tracking-wider text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                    Data Cached
                  </span>
                  <DownloadCloud className="w-5 h-5 text-black opacity-90 group-hover:scale-110 transition-transform font-black" />
                </div>
                <span className="font-serif text-4xl sm:text-5xl text-black font-black block leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] tracking-tight">
                  06
                </span>
                <p className="font-engebrechtre text-xs sm:text-sm text-stone-900 font-black tracking-widest mt-2 uppercase drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
                  Offline state packs
                </p>
              </motion.div>

              {/* Stat Box 3: Explorer Tier */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -3 }}
                className="rounded-3xl p-5 sm:p-6 bg-white/45 border border-white/85 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.22),inset_0_2px_6px_rgba(255,255,255,0.9)] text-center sm:text-left transition-all hover:bg-white/65 hover:border-black/50 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-coolvetica text-xs font-black uppercase tracking-wider text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                    Rank Status
                  </span>
                  <Sparkles className="w-5 h-5 text-black opacity-90 group-hover:scale-110 transition-transform font-black" />
                </div>
                <span className="font-serif text-4xl sm:text-5xl text-black font-black block leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] tracking-tight">
                  LVL 4
                </span>
                <p className="font-engebrechtre text-xs sm:text-sm text-stone-900 font-black tracking-widest mt-2 uppercase drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
                  Explorer Tier
                </p>
              </motion.div>

            </div>

          </div>
        </motion.div>

        {/* Tab Switcher Grid */}
        <div className="flex bg-white/40 backdrop-blur-2xl p-1.5 rounded-2xl max-w-lg mx-auto mb-10 shadow-xl border border-white/60 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${
              activeTab === 'badges' 
                ? 'text-white bg-black shadow-lg font-black' 
                : 'text-black hover:text-stone-900 font-black'
            }`}
          >
            🏆 Badges
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${
              activeTab === 'packs' 
                ? 'text-white bg-black shadow-lg font-black' 
                : 'text-black hover:text-stone-900 font-black'
            }`}
          >
            📦 Offline Packs
          </button>
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider transition-all rounded-xl cursor-pointer text-center whitespace-nowrap drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${
              activeTab === 'stamps' 
                ? 'text-white bg-black shadow-lg font-black' 
                : 'text-black hover:text-stone-900 font-black'
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
                { name: "Travel Ambassador", desc: "Official Ministry of Tourism Representative", image: "/explorer_badge.jpg", color: "from-amber-400/30 to-transparent", border: "hover:border-black", status: "Accredited" },
                { name: "Ganga Ghats Pilgrim", desc: "Visited Varanasi, Haridwar & Rishikesh", icon: "🪔", color: "from-orange-400/30 to-transparent", border: "hover:border-black", status: "Unlocked" },
                { name: "Himalayan Nomad", desc: "Crossed 3 high passes above 12,000 ft", icon: "🏔️", color: "from-sky-400/30 to-transparent", border: "hover:border-black", status: "Unlocked" },
                { name: "ASI Historian", desc: "Explored 20+ ASI UNESCO sites", icon: "🏛️", color: "from-amber-400/30 to-transparent", border: "hover:border-black", status: "Unlocked" }
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariant}
                  whileHover={{ y: -6, scale: 1.03, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)" }}
                  className={`bg-white/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/70 text-center relative overflow-hidden transition-all duration-300 ${badge.border} flex flex-col justify-between h-52 cursor-pointer shadow-xl`}
                >
                  <div className={`absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b ${badge.color}`} />
                  <div className="relative z-10 flex flex-col items-center">
                    {badge.image ? (
                      <img src={badge.image} alt={badge.name} className="w-14 h-14 rounded-full border-2 border-black mb-2.5 shadow-lg object-cover" />
                    ) : (
                      <div className="text-4xl mb-3 transform hover:rotate-12 transition-transform duration-300 drop-shadow-md">{badge.icon}</div>
                    )}
                    <h4 className="font-serif text-base text-black font-black tracking-tight drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">{badge.name}</h4>
                    <p className="text-[11px] text-stone-900 mt-1.5 leading-relaxed font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">{badge.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-wider mx-auto mt-2 shadow-md">
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
                  className="p-6 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/70 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-black/50"
                >
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-black font-black tracking-wide drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">{pack.state}</h4>
                    <p className="text-xs text-stone-900 font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">{pack.size} · {pack.date}</p>
                    <span className="inline-block text-[11px] text-stone-900 font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">Coverage: {pack.coverage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 rounded-full bg-black text-white text-[10px] font-black tracking-widest uppercase border border-white/30 flex items-center gap-1.5 shadow-lg">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
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
                  className={`border-2 border-dashed rounded-full w-42 h-42 flex flex-col items-center justify-center p-4 text-center mx-auto transition-all duration-300 shadow-xl backdrop-blur-2xl ${stamp.rotation} ${stamp.color} border-black text-black`}
                >
                  <span className="text-3xl mb-1 drop-shadow-md">{stamp.seal}</span>
                  <h4 className="font-serif text-xl text-black font-black leading-none drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] uppercase">{stamp.city}</h4>
                  <span className="text-[9px] font-black tracking-widest uppercase text-black mt-1.5 block drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">{stamp.type}</span>
                  <div className="border-t-2 border-dashed border-black w-2/3 my-1.5 opacity-80" />
                  <span className="text-[10px] font-black tracking-wide block text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">{stamp.date}</span>
                  <span className="text-[8px] font-black tracking-widest text-emerald-800 mt-1 uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">APPROVED</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dynamic Profile Photo Customization Modal */}
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
              className="relative bg-white text-black rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 z-10 space-y-6 overflow-hidden"
            >
              {/* Header wave bar */}
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-saffron via-amber-500 to-sky-400" />

              <div className="flex justify-between items-start pt-1">
                <div>
                  <h3 className="font-serif text-xl font-black text-black">
                    Customize Profile Picture
                  </h3>
                  <p className="text-xs text-stone-700 font-bold mt-0.5">
                    Upload your own photo or pick an explorer avatar preset.
                  </p>
                </div>
                <button 
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Active Preview */}
              <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black shadow-md shrink-0">
                  <img src={profilePhoto} alt="Current Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider block">Current Avatar</span>
                  <h4 className="font-serif font-black text-black text-base">{userName}</h4>
                  <span className="text-[11px] text-emerald-700 font-black">Active & Saved in LocalStorage</span>
                </div>
              </div>

              {/* Upload Button Option */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-700">
                  Upload from your Device
                </label>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 border-2 border-dashed border-black/40 text-black font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Upload className="w-4 h-4 text-black" />
                  <span>Choose Photo from Computer / Phone (JPG, PNG)</span>
                </button>
              </div>

              {/* Curated Preset Avatars Grid */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-700">
                  Or Pick a Curated Traveler Avatar
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = profilePhoto === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => updatePhoto(avatar.url)}
                        className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                          isSelected ? 'border-black ring-2 ring-black scale-105 shadow-md' : 'border-stone-200 hover:border-black'
                        }`}
                        title={avatar.name}
                      >
                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                            <Check className="w-5 h-5 font-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image Web Link Input */}
              <form onSubmit={handleCustomUrlSubmit} className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-700">
                  Or Paste Image Web URL
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-black hover:bg-stone-800 text-white text-xs font-black transition-colors cursor-pointer shadow-md"
                  >
                    Apply URL
                  </button>
                </div>
              </form>

              {/* Reset to Default */}
              <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                <button 
                  onClick={resetToDefault}
                  className="text-xs text-stone-600 hover:text-black flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Avatar</span>
                </button>
                <button 
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-black text-xs font-black transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
