import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, PhoneCall, MapPin, Radio, AlertTriangle, 
  CheckCircle, ShieldCheck, Share2, Wifi, Compass, Loader2
} from 'lucide-react';

export default function SafetyPage() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [telemetryStep, setTelemetryStep] = useState(0);
  const [gpsCoords, setGpsCoords] = useState({ lat: '28.6139', lng: '77.2090', accuracy: '3m' });

  // Fetch user's real coordinate location via Geolocation API
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude.toFixed(4),
            lng: position.coords.longitude.toFixed(4),
            accuracy: `${Math.round(position.coords.accuracy)}m`
          });
        },
        (error) => {
          console.warn("Geolocation failed, using default coordinates:", error.message);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, [sosTriggered]);

  // Simulate GPS coordinates micro-variations when SOS is triggered (simulating satellites locks)
  useEffect(() => {
    const interval = setInterval(() => {
      if (sosTriggered) {
        setGpsCoords(prev => ({
          lat: (parseFloat(prev.lat) + (Math.random() - 0.5) * 0.00015).toFixed(4),
          lng: (parseFloat(prev.lng) + (Math.random() - 0.5) * 0.00015).toFixed(4),
          accuracy: `${Math.floor(Math.random() * 2) + 2}m`
        }));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [sosTriggered]);

  // Simulate n8n/workflow dispatch stages
  useEffect(() => {
    let timer;
    if (sosTriggered) {
      setTelemetryStep(1);
      timer = setInterval(() => {
        setTelemetryStep(prev => {
          if (prev >= 4) {
            clearInterval(timer);
            return 4;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      setTelemetryStep(0);
    }
    return () => clearInterval(timer);
  }, [sosTriggered]);

  const dispatchStages = [
    { text: "System Idle. Ready to transmit emergency beacon.", status: "idle" },
    { text: "Acquiring highly-accurate satellite GPS fix...", status: "loading" },
    { text: "Broadcasting encrypted SMS mesh payload to emergency contacts...", status: "loading" },
    { text: "Routing emergency dispatcher tunnel to local Tourist Patrol...", status: "loading" },
    { text: "Tourist Patrol dispatched! Help is arriving at your coordinate pin.", status: "success" }
  ];

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen relative overflow-hidden font-sans">
      
      {/* ─── Pulsing Emergency Vignette Overlay ───────────────── */}
      <AnimatePresence>
        {sosTriggered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="fixed inset-0 pointer-events-none z-40 border-[16px] md:border-[24px] border-rose-600/40 shadow-[inset_0_0_80px_rgba(225,29,72,0.4)]"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 border border-rose-300 text-rose-800 font-engebrechtre text-sm uppercase tracking-wider mb-4 shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>24/7 National Tourist Emergency Mesh</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-coolvetica text-5xl sm:text-6xl font-normal text-stone-900 tracking-tight"
          >
            Travel Safe Across Bharat
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 text-base sm:text-lg mt-3"
          >
            One-touch panic beacon, verified state tourist police dispatch, automated SMS geofencing, and offline emergency protocols.
          </motion.p>
        </div>

        {/* SOS Panel */}
        <div className="max-w-xl mx-auto bg-white rounded-[32px] p-8 border border-stone-200/80 shadow-card-lift text-center mb-12 relative overflow-hidden">
          
          {/* Inner Grid Background lines (Cyberpunk/Military Tech look) */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          <div className="relative z-10">
            {/* Concentric Animated Radar Waves */}
            <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
              
              {/* Outer Radar Waves */}
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  className={`absolute rounded-full border ${sosTriggered ? 'border-rose-500/50 bg-rose-500/5' : 'border-stone-300/60 bg-stone-100/20'}`}
                  initial={{ width: 140, height: 140, opacity: 0.8 }}
                  animate={{ 
                    width: [140, 240], 
                    height: [140, 240], 
                    opacity: [0.8, 0],
                    scale: [1, 1.25]
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    delay: num * 0.7,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Pulsing Core Ring */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-36 h-36 rounded-full border-2 -z-10 ${sosTriggered ? 'border-rose-400 bg-rose-50/70 shadow-rose-500/10' : 'border-stone-200 bg-stone-50/50'}`}
              />

              {/* Main Emergency Button */}
              <motion.button
                onClick={() => setSosTriggered(!sosTriggered)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-32 h-32 rounded-full font-black text-white text-lg tracking-wider uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-2xl relative cursor-pointer outline-none border-none select-none z-10 ${
                  sosTriggered
                    ? 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-600/40 ring-4 ring-rose-200'
                    : 'bg-gradient-to-br from-stone-850 to-stone-950 shadow-stone-950/40 hover:shadow-stone-950/60'
                }`}
              >
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                {sosTriggered ? (
                  <>
                    <Radio className="w-8 h-8 animate-pulse text-white" />
                    <span className="font-engebrechtre font-bold text-sm tracking-wider text-rose-100">SOS ACTIVE</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-9 h-9 text-rose-500 animate-pulse" />
                    <span className="font-engebrechtre font-bold text-sm tracking-wider text-stone-100">PRESS SOS</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* GPS Telemetry Readouts */}
            <div className="mb-6">
              <h3 className="font-coolvetica text-2xl font-normal text-stone-950 uppercase tracking-wide">
                {sosTriggered ? "EMERGENCY BEACON LIVE" : "Tourist Panic Beacon"}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mt-1">
                {sosTriggered 
                  ? "Transmitting satellite geofence signal. Dispatched teams are tracking this coordinate node."
                  : "Tap in case of danger to alert local Tourist Police patrols and broadcast coordinates."}
              </p>
            </div>

            {/* Coordinates HUD Panel */}
            <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-left font-engebrechtre text-base tracking-wider space-y-2.5 relative shadow-inner">
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Live Telemetry</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{sosTriggered ? "SIGNAL TRANSMITTING" : "READY"}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                  <span className="text-stone-400">LAT:</span>
                  <span className="font-bold text-stone-800">{gpsCoords.lat}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                  <span className="text-stone-400">LNG:</span>
                  <span className="font-bold text-stone-800">{gpsCoords.lng}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span className="text-stone-400">ACCURACY:</span>
                  <span className="font-bold text-stone-800">{gpsCoords.accuracy}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="text-stone-400">CHANNEL:</span>
                  <span className="font-bold text-stone-800">{sosTriggered ? "SMS MESH" : "STANDBY"}</span>
                </div>
              </div>
            </div>

            {/* Workflow Dispatch Stages Panel */}
            <AnimatePresence>
              {sosTriggered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-stone-200/80 pt-5 text-left space-y-3"
                >
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-mono">
                    Emergency Dispatch Pipeline
                  </span>
                  
                  <div className="space-y-2">
                    {dispatchStages.slice(1).map((stage, idx) => {
                      const stepIndex = idx + 1;
                      const isActive = telemetryStep === stepIndex;
                      const isCompleted = telemetryStep > stepIndex;
                      
                      return (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isActive ? (
                            <Loader2 className="w-4 h-4 text-saffron animate-spin shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-stone-300 bg-stone-100 shrink-0" />
                          )}
                          <span className={`font-semibold ${
                            isCompleted ? 'text-stone-500 line-through' :
                            isActive ? 'text-stone-900 font-bold' : 'text-stone-400'
                          }`}>
                            {stage.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Emergency Help Cards Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-coolvetica text-3xl font-normal text-stone-900 uppercase tracking-wide">
            Unified Emergency Help Desk
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Tap to establish a priority gateway with government travel support desks.
          </p>
        </div>

        {/* Emergency Helpline Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "National Tourist Helpline", number: "1363", subtitle: "24/7 Multilingual Support (12 Languages)", color: "text-amber-600 border-amber-200 bg-amber-50/50 hover:border-amber-400 hover:shadow-amber-100" },
            { title: "Unified National Emergency", number: "112", subtitle: "Police, Ambulance & Fire Response Desk", color: "text-rose-600 border-rose-200 bg-rose-50/50 hover:border-rose-400 hover:shadow-rose-100" },
            { title: "Women Helpline (National)", number: "1091", subtitle: "Dedicated Solo Female Traveler Safety Cell", color: "text-purple-600 border-purple-200 bg-purple-50/50 hover:border-purple-400 hover:shadow-purple-100" },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`bg-white rounded-[24px] p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 ${item.color}`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  {item.title}
                </span>
                <div className="font-engebrechtre text-5xl font-bold mb-2 tracking-wide">
                  {item.number}
                </div>
                <p className="text-stone-500 text-xs leading-relaxed font-medium">{item.subtitle}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <a
                  href={`tel:${item.number}`}
                  className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-saffron" />
                  <span>Connect Emergency Desk</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
