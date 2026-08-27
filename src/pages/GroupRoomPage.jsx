import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Check, MessageSquare, ThumbsUp, DollarSign, Share2, Copy, Sparkles, Send, Image, MapPin } from 'lucide-react';
import { io } from 'socket.io-client';

export default function GroupRoomPage() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Aarav (Lead)", text: "Hey team! Added morning boat ride at Assi Ghat for Day 1.", time: "10:14 AM" },
    { id: 2, user: "Priya", text: "Looks amazing! Make sure we book the ramp-accessible VIP jetty for dadi.", time: "10:16 AM" },
    { id: 3, user: "Rohan", text: "Just added dinner at Keshari sweets to the voting poll!", time: "10:18 AM" },
    { id: 4, user: "Aarav (Lead)", image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?q=80&w=600&auto=format&fit=crop", time: "10:20 AM" }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'map'
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  // Multiplayer Sync Lobby States
  const [inRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('BHARAT-ROOM-2026-X9');
  const [tripName, setTripName] = useState('Kashi Spiritual Expedition 2026');
  const [createTripName, setCreateTripName] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');

  const fileInputRef = useRef(null);
  const watchIdRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const socketRef = useRef(null);

  // Live SocketIO connection sync
  useEffect(() => {
    if (!inRoom) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl, { 
      transports: ['websocket'],
      reconnectionAttempts: 5 
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("Socket.io connected successfully to room:", roomCode);
    });

    socket.emit('join_room', { 
      room_id: roomCode, 
      username: 'You' 
    });

    socket.on('room_history', (history) => {
      if (history && history.length > 0) {
        setMessages(history);
      }
    });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('user_joined', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          user: "System",
          text: `👋 ${data.username} joined the room!`,
          time: "Just now"
        }
      ]);
    });

    socket.on('connect_error', (err) => {
      console.error("Socket.io connection error detail:", err);
      console.warn("Socket connection failed, using local simulation:", err.message);
    });

    return () => {
      socket.emit('leave_room', { room_id: roomCode });
      socket.off('connect');
      socket.off('room_history');
      socket.off('receive_message');
      socket.off('user_joined');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [inRoom, roomCode]);

  // Dynamic Leaflet CSS Injection and Geolocation teardown on unmount
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(link);
    };
  }, []);

  const startLocationSharing = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsSharingLocation(true);
    
    setMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      user: "System",
      text: "📍 You started sharing your live location in this room.",
      time: "Just now"
    }]);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
      },
      (error) => {
        console.warn("Live location sharing error:", error);
        // Fallback coordinates (Varanasi Assi Ghat) if blocked
        setUserCoords({ lat: 25.3176, lng: 82.9739 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopLocationSharing = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharingLocation(false);
    setUserCoords(null);
    
    setMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      user: "System",
      text: "❌ You stopped sharing your live location.",
      time: "Just now"
    }]);
  };

  // Interactive Map Rendering Effect
  useEffect(() => {
    if (activeTab === 'map' && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const centerLat = userCoords?.lat || 25.3176;
        const centerLng = userCoords?.lng || 82.9739;

        const map = L.map('live-room-map').setView([centerLat, centerLng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;

        // Group travelers (Aarav, Priya, Rohan)
        const travelBuddies = [
          { name: "Aarav (Lead)", lat: 25.3185, lng: 82.9750, color: '#f0932b', initial: 'A' },
          { name: "Priya", lat: 25.3168, lng: 82.9720, color: '#8b5cf6', initial: 'P' },
          { name: "Rohan", lat: 25.3195, lng: 82.9715, color: '#ec4899', initial: 'R' }
        ];

        travelBuddies.forEach(buddy => {
          const buddyIcon = L.divIcon({
            className: 'custom-leaflet-icon',
            html: `<div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[11px] shadow-lg" style="background-color: ${buddy.color};">${buddy.initial}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          L.marker([buddy.lat, buddy.lng], { icon: buddyIcon })
            .addTo(map)
            .bindPopup(`<b>${buddy.name}</b><br>Live walking near Assi Ghat`);
        });

        // Add user marker if sharing location
        if (isSharingLocation && userCoords) {
          const userIcon = L.divIcon({
            className: 'custom-leaflet-icon',
            html: `<div class="w-9 h-9 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg animate-pulse">You</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });
          L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>You</b><br>Broadcasting live coordinates")
            .openPopup();
          map.setView([userCoords.lat, userCoords.lng], 15);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, isSharingLocation, userCoords]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    
    const textMsg = newMsg.trim();
    setNewMsg('');

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', {
        room_id: roomCode,
        sender: 'You',
        text: textMsg
      });
    } else {
      // Local fallback simulation if server is offline
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: "You",
        text: textMsg,
        time: "Just now"
      }]);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send_message', {
          room_id: roomCode,
          sender: 'You',
          image: imageData
        });
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          user: "You",
          image: imageData,
          time: "Just now"
        }]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input selection
  };

  const handleShareImageMessage = (imgSrc) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Shared Landmark',
        text: 'Check out this tourist spot from our travel sync room!',
        url: imgSrc
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(imgSrc);
      alert("Image link copied to clipboard!");
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inRoom) {
    return (
      <div className="pt-28 pb-20 bg-[#faf8f5] min-h-screen flex items-center justify-center font-sans">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 border border-forest-900/20 text-forest-900 font-bold text-xs uppercase tracking-widest mb-4 shadow-sm">
              <Users className="w-4 h-4 text-saffron animate-pulse" />
              <span>Co-travel Multiplayer Sync Lobby</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-none mb-3">
              Synchronize Your Bharat Yatra
            </h1>
            <p className="text-stone-600 text-sm max-w-lg mx-auto">
              Create a shared trip workspace or join your group’s session using a room code. Experience real-time itinerary voting, shared UPI splitter, live location maps, and group chat!
            </p>
          </div>

          {/* Lobby Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Create Room Card */}
            <motion.div 
              whileHover={{ y: -6, boxShadow: '0 30px 60px -15px rgba(27,58,47,0.15)' }}
              className="bg-white rounded-[32px] p-8 border border-stone-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center mb-6">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  Create Sync Room
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed mb-6">
                  Initialize a brand new multiplayer collaboration room for your friends, family, or travel group. You'll get a unique invite link and room code.
                </p>
                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Trip Name / Destination
                  </label>
                  <input
                    type="text"
                    value={createTripName}
                    onChange={(e) => setCreateTripName(e.target.value)}
                    placeholder="e.g. Kashi Spiritual Expedition 2026"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-saffron rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (!createTripName.trim()) {
                    alert("Please enter a Trip Name to create a room.");
                    return;
                  }
                  setTripName(createTripName.trim());
                  // Generate random room code
                  const code = `BHARAT-ROOM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                  setRoomCode(code);
                  setInRoom(true);
                }}
                className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-saffron animate-spin-slow" />
                <span>Initialize Group Room</span>
              </button>
            </motion.div>

            {/* Join Room Card */}
            <motion.div 
              whileHover={{ y: -6, boxShadow: '0 30px 60px -15px rgba(240,147,43,0.15)' }}
              className="bg-white rounded-[32px] p-8 border border-stone-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-forest-900/10 text-forest-900 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-saffron animate-pulse" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                  Join Existing Room
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed mb-6">
                  Access an active trip sync lobby created by your travel lead. Get instant updates on route selections, expense logs, and shared location mesh.
                </p>
                <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Invite / Room Code
                  </label>
                  <input
                    type="text"
                    value={joinRoomCode}
                    onChange={(e) => setJoinRoomCode(e.target.value)}
                    placeholder="e.g. BHARAT-ROOM-2026-X9"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-saffron rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!joinRoomCode.trim()) {
                    alert("Please enter a valid Room Code to join.");
                    return;
                  }
                  setRoomCode(joinRoomCode.toUpperCase().trim());
                  // Set fallback trip name for join
                  setTripName("Varanasi Group Expedition 2026");
                  setInRoom(true);
                }}
                className="w-full py-3 rounded-xl bg-saffron hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Join Co-Travel Sync</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-forest-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-saffron font-bold text-xs uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Multiplayer Sync Room Active</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white">
              {tripName}
            </h1>
            <p className="text-xs text-stone-300 mt-1">Room Code: <span className="font-mono text-saffron font-bold select-all bg-forest-800 px-2 py-0.5 rounded border border-forest-700">{roomCode}</span> · 4 Active Travelers</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyRoomCode}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-saffron" />
              <span>{copied ? "Link Copied!" : "Invite Friends"}</span>
            </button>
            <div className="flex -space-x-2">
              {['A', 'P', 'R', 'Y'].map((letter, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-amber-600 text-white font-bold text-xs flex items-center justify-center border-2 border-forest-900 shadow">
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Collaborative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary Voting & UPI Split */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Voting Polls */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card-lift">
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-4 flex items-center justify-between">
                <span>Group Activity Voting</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">2 Active Polls</span>
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-stone-900">Sunrise Rowing vs Motor Cruise</span>
                    <span className="text-xs font-bold text-saffron">3/4 Voted</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 mb-3">
                    <div className="bg-saffron h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-forest-900 text-white text-xs font-semibold flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-saffron" />
                      <span>Traditional Rowing (3 votes)</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-600 text-xs font-semibold">
                      <span>Motor Cruiser (1 vote)</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-stone-900">Keshari Sweets Malaiyo Tasting Stop</span>
                    <span className="text-xs font-bold text-emerald-600">Unanimous (4/4)</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 mb-2">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-xs text-stone-500">Scheduled for Day 2 at 04:30 PM</span>
                </div>
              </div>
            </div>

            {/* UPI Split Expense Ledger */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-card-lift">
              <h2 className="font-serif text-xl font-bold text-stone-900 mb-4 flex items-center justify-between">
                <span>UPI Group Expense Splitter</span>
                <span className="text-xs text-stone-500 font-mono">₹8,400 Total Logged</span>
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50">
                  <div>
                    <div className="font-semibold text-stone-900">VIP Assi Jetty Passes</div>
                    <div className="text-[11px] text-stone-500">Paid by Aarav · ₹3,200</div>
                  </div>
                  <div className="text-right font-bold text-saffron">₹800 / person</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50">
                  <div>
                    <div className="font-semibold text-stone-900">Certified Heritage Historian Fee</div>
                    <div className="text-[11px] text-stone-500">Paid by Priya · ₹4,000</div>
                  </div>
                  <div className="text-right font-bold text-saffron">₹1,000 / person</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xs font-bold text-stone-700">Your Share Remaining:</span>
                <span className="font-serif font-black text-lg text-emerald-600">₹2,100 (One-click UPI)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Room Chat & Map Sync */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-card-lift flex flex-col h-[580px]">
            {/* Header / Tabs */}
            <div className="flex flex-col gap-3 pb-4 border-b border-stone-100 mb-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Chat Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'map'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Live Map Tracking
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-stone-600">Online</span>
                </div>
              </div>

              {/* Location Sharing Toggle Switch */}
              <div className="flex items-center justify-between bg-stone-50 border border-stone-200/60 p-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 shrink-0 ${isSharingLocation ? 'text-emerald-500 animate-bounce' : 'text-stone-400'}`} />
                  <span className="text-xs font-bold text-stone-700">Share Live Location</span>
                </div>
                <button
                  type="button"
                  onClick={isSharingLocation ? stopLocationSharing : startLocationSharing}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center cursor-pointer ${
                    isSharingLocation ? 'bg-emerald-500 justify-end' : 'bg-stone-300 justify-start'
                  }`}
                >
                  <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            {activeTab === 'chat' ? (
              <>
                {/* Message Feed */}
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 mb-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm ${
                        m.user === "System"
                          ? 'bg-amber-50/70 border border-amber-200/80 text-amber-900 text-center font-bold font-mono py-2 rounded-xl mx-4'
                          : m.user === "You"
                            ? 'bg-amber-500 text-white ml-8 rounded-br-sm'
                            : 'bg-stone-100 text-stone-800 mr-8 rounded-bl-sm'
                      }`}
                    >
                      {m.user !== "System" && (
                        <div className="flex justify-between items-center font-bold text-[11px] mb-1 opacity-80">
                          <span>{m.user}</span>
                          <span>{m.time}</span>
                        </div>
                      )}
                      
                      {m.image ? (
                        <div className="relative group/img mt-1.5 rounded-xl overflow-hidden shadow-sm border border-stone-200">
                          <img 
                            src={m.image} 
                            alt="Shared media" 
                            className="w-full max-h-44 object-cover hover:scale-102 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=600&auto=format&fit=crop'; }}
                          />
                          <button
                            type="button"
                            onClick={() => handleShareImageMessage(m.image)}
                            title="Share / Copy Image Link"
                            className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white hover:scale-105 transition-all cursor-pointer shadow-md flex items-center justify-center"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p>{m.text}</p>
                      )}
                    </div>
                  ))}
                </div>
    
                {/* Input Bar */}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                />
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload & Share Image"
                    className="p-2 rounded-xl border border-stone-200 hover:border-saffron/40 text-stone-500 hover:text-saffron bg-stone-50 hover:bg-saffron/5 transition-colors cursor-pointer shrink-0"
                  >
                    <Image className="w-4 h-4 text-saffron" />
                  </button>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-saffron"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-saffron hover:bg-amber-600 text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-grow flex flex-col gap-3 min-h-0">
                <div id="live-room-map" className="w-full flex-grow rounded-2xl border border-stone-200 shadow-inner z-10" />
                <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 border border-stone-100 p-2 rounded-xl shrink-0">
                  <span>🟢 Showing Aarav, Priya, Rohan coordinates</span>
                  <span>{isSharingLocation ? "📍 You are broadcasting" : "🔴 You are offline"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
