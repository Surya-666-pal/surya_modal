import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Send, Mic, MicOff, Bot, User, MapPin,
  AlertTriangle, RefreshCw, Sparkles, Loader2
} from 'lucide-react';
import { sendChatToGemini, startTripChat } from '../services/geminiChatService';
import ItineraryDisplay from './ItineraryDisplay';
import { extractSlotsWithGemini } from '../services/slotExtraction';
import { generateFullItineraryFromSlots } from '../services/aiPlannerWorkflow';
import { CURATED_FALLBACK_GEMS } from '../services/vibeMapping';

// Resolves a place name to its corresponding curated image URL
function getPlaceImage(name) {
  if (!name) return null;
  const normName = name.toLowerCase().trim();
  
  // 1. Loop through pre-coded CURATED_FALLBACK_GEMS categories
  for (const category of Object.values(CURATED_FALLBACK_GEMS)) {
    for (const place of category) {
      if (place.name.toLowerCase().includes(normName) || normName.includes(place.name.toLowerCase())) {
        return place.image;
      }
    }
  }
  
  // 2. Custom mappings for other popular monuments
  const keywordMappings = {
    'taj mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop',
    'kashi vishwanath': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1000&auto=format&fit=crop',
    'assi ghat': 'https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1000&auto=format&fit=crop',
    'sarnath': 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=1000&auto=format&fit=crop',
    'jaipur': 'https://images.unsplash.com/photo-1477584322811-0aa81395567b?q=80&w=1000&auto=format&fit=crop',
    'hampi': 'https://images.unsplash.com/photo-1600100397608-f010e4224716?q=80&w=1000&auto=format&fit=crop',
    'kerala': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop',
    'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop',
    'munnar': 'https://images.unsplash.com/photo-1593693411515-c202e97429b6?q=80&w=1000&auto=format&fit=crop',
    'spiti': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop',
    'amber fort': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop',
    'hawa mahal': 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1000&auto=format&fit=crop',
    'city palace': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
    'jantar mantar': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop',
    'chittorgarh': 'https://images.unsplash.com/photo-1623682687826-fe06bf64e6d8?q=80&w=1000&auto=format&fit=crop',
    'mehrangarh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1000&auto=format&fit=crop',
    'udaipur lake': 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000&auto=format&fit=crop',
    'backwaters': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop'
  };

  for (const [key, url] of Object.entries(keywordMappings)) {
    if (normName.includes(key)) {
      return url;
    }
  }
  
  return null;
}

// Helper: Format Gemini markdown-style text to readable JSX with enhanced premium typography & inline place photos
function FormattedMessage({ text }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-800 font-sans tracking-wide">
      {lines.map((line, i) => {
        // Extract bold place name to search for photo
        const boldMatch = line.match(/\*\*(.+?)\*\*/);
        const placeName = boldMatch ? boldMatch[1] : null;
        const placeImage = getPlaceImage(placeName);

        // Bold headers: replace **text** with clean high-contrast styled text
        const boldLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-serif font-black text-forest-900 tracking-tight text-sm sm:text-base">$1</strong>');
        
        // Bullet points
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return (
            <div key={i} className="flex gap-3 items-start pl-1.5 py-1 hover:bg-stone-50/50 rounded-xl transition-colors">
              {placeImage ? (
                <img 
                  src={placeImage} 
                  alt={placeName || "Place"} 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-stone-200/80 shadow-sm shrink-0 mt-0.5" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span className="text-saffron font-bold mt-1 shrink-0 text-base leading-none">•</span>
              )}
              <span 
                className="font-sans text-stone-700 font-medium"
                dangerouslySetInnerHTML={{ __html: boldLine.replace(/^[\*\-] /, '') }} 
              />
            </div>
          );
        }
        
        // Numbered lists
        if (/^\d+\. /.test(line.trim())) {
          const num = line.match(/^(\d+)\./)?.[1];
          return (
            <div key={i} className="flex gap-3 items-start pl-1.5 py-1 hover:bg-stone-50/50 rounded-xl transition-colors">
              {placeImage ? (
                <img 
                  src={placeImage} 
                  alt={placeName || "Place"} 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-stone-200/80 shadow-sm shrink-0 mt-0.5" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span className="text-saffron font-serif font-black text-sm shrink-0 leading-none mt-0.5">{num}.</span>
              )}
              <span 
                className="font-sans text-stone-700 font-medium"
                dangerouslySetInnerHTML={{ __html: boldLine.replace(/^\d+\. /, '') }} 
              />
            </div>
          );
        }
        
        // Special Callout/Tip Box formatting
        if (line.trim().startsWith('> ') || line.trim().includes('💡') || line.trim().includes('🍽')) {
          const rawLine = line.replace(/^> /, '');
          return (
            <div key={i} className="my-3 p-3.5 bg-amber-50/70 border-l-4 border-saffron rounded-r-2xl font-sans text-stone-700 font-medium shadow-sm flex items-start gap-2.5">
              <span dangerouslySetInnerHTML={{ __html: boldLine.replace(/^> /, '') }} />
            </div>
          );
        }

        // Empty line = spacer
        if (line.trim() === '') return <div key={i} className="h-1.5" />;
        
        // Normal line
        return (
          <p 
            key={i} 
            className="font-sans text-stone-700 font-medium"
            dangerouslySetInnerHTML={{ __html: boldLine }} 
          />
        );
      })}
    </div>
  );
}

export default function TripPlannerChat() {
  const [slots, setSlots] = useState({
    start_city: null,
    days: null,
    budget: 'Balanced Comfort',
    group_size: 2,
    interests: ['heritage_forts', 'spiritual_ghats', 'street_food'],
    accessibility_needs: []
  });
  const [chatHistory, setChatHistory] = useState([]); // { role: 'user'|'model', text: string }
  const [messages, setMessages] = useState([]);        // UI messages with id, timestamp, etc.
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentWorkflowNode, setCurrentWorkflowNode] = useState(null); // 'extraction' | 'fetching' | 'routing' | 'narrative' | 'chat' | null
  const [initError, setInitError] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const slotsRef = useRef(slots);
  const chatHistoryRef = useRef(chatHistory);
  const voiceModeRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  useEffect(() => {
    voiceModeRef.current = isVoiceMode;
  }, [isVoiceMode]);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectUserLocationForChat = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsDetectingLocation(true);
    setInputMsg("📍 Detecting your current location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          if (!res.ok) throw new Error("Reverse geocoding failed");
          const data = await res.json();
          const address = data.address || {};
          const resolvedCity = address.city || address.town || address.village || address.county || address.state || '';
          
          if (resolvedCity) {
            setInputMsg(`Plan a 3-day trip starting from ${resolvedCity}`);
          } else {
            setInputMsg("Plan a 3-day trip starting from Delhi");
          }
        } catch (e) {
          setInputMsg("Plan a 3-day trip starting from Delhi");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Location lookup failed:", error);
        setInputMsg("Plan a 3-day trip starting from Delhi");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-speech engine to speak AI outputs out loud
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel(); // Stop active speaking

      // Clean raw text to prevent speaking symbols/formatting
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/💡|🍽|📍|⭐|🙏|🏰|🌿|🏔️|🍛|🪔/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Automatically restart listening when AI finishes speaking if voiceMode is active
      utterance.onend = () => {
        if (voiceModeRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Speech auto-restart error:", e);
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis failed:", e);
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // On mount: get AI greeting via Gemini
  useEffect(() => {
    let mounted = true;

    async function init() {
      setIsTyping(true);
      try {
        const greeting = await startTripChat();
        if (!mounted) return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages([{ id: 'init', sender: 'ai', text: greeting, timestamp: now }]);
        setChatHistory([{ role: 'model', text: greeting }]);
      } catch (err) {
        if (!mounted) return;
        console.error("Trip chat init error:", err);
        setInitError(true);
        const fallbackGreeting = "Namaste! 🙏 I'm your Bharat AI Architect.\n\nTell me:\n• Which city or region would you like to visit?\n• How many days?\n• What interests you — Heritage, Nature, Spiritual, Adventure, Food?\n\nLet's plan your dream Bharat journey!";
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages([{ id: 'init', sender: 'ai', text: fallbackGreeting, timestamp: now }]);
        setChatHistory([{ role: 'model', text: fallbackGreeting }]);
      } finally {
        if (mounted) setIsTyping(false);
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  // Helper function to process any text message (either typed or spoken)
  const processUserMessage = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message to UI state
    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: trimmedText, timestamp: nowStr };
    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    // Node 1: Extract slots
    setCurrentWorkflowNode('extraction');

    let updatedSlots = { ...slotsRef.current };
    try {
      // Run slot extraction to parse destination city & trip duration (days)
      const extraction = await extractSlotsWithGemini(
        trimmedText,
        slotsRef.current,
        chatHistoryRef.current.map(h => ({ role: h.role, text: h.text }))
      );
      if (extraction && extraction.slots) {
        updatedSlots = extraction.slots;
        setSlots(updatedSlots);
      }
    } catch (err) {
      console.warn("[TripPlannerChat] Slot extraction error:", err);
    }

    // Check if the user is explicitly requesting a plan/itinerary generation
    const isAskingForItinerary = 
      trimmedText.toLowerCase().includes('plan') || 
      trimmedText.toLowerCase().includes('itinerary') || 
      trimmedText.toLowerCase().includes('days') || 
      trimmedText.toLowerCase().includes('trip') ||
      trimmedText.toLowerCase().includes('tour') ||
      trimmedText.toLowerCase().includes('route') ||
      trimmedText.toLowerCase().includes('schedule') ||
      Boolean(updatedSlots.days); // If they specified a number of days

    // Generate itinerary only if they specify a city and request a plan
    if (updatedSlots.start_city && isAskingForItinerary) {
      try {
        const finalSlots = {
          ...updatedSlots,
          days: updatedSlots.days || 3 // Default to 3 days if not specified
        };

        // Node 2: Fetching candidate landmarks
        setCurrentWorkflowNode('fetching');
        await new Promise(resolve => setTimeout(resolve, 800)); // n8n Node latency simulation

        // Node 3: Routing, Geographical clustering and OSRM Road Optimizer
        setCurrentWorkflowNode('routing');
        const plan = await generateFullItineraryFromSlots(finalSlots);
        await new Promise(resolve => setTimeout(resolve, 850)); // n8n Node latency simulation

        // Node 4: Writing cultural folklore stories
        setCurrentWorkflowNode('narrative');
        await new Promise(resolve => setTimeout(resolve, 600)); // n8n Node latency simulation

        const aiMessageText = `I have successfully designed a custom **${finalSlots.days}-day** itinerary for **${finalSlots.start_city}**!

I searched for the most famous places near ${finalSlots.start_city} and separated them across each day with the best geographically optimized road route. You can explore the daily schedules and maps below:`;

        // Update chat history with user input and model reply
        setChatHistory(prev => [
          ...prev,
          { role: 'user', text: trimmedText },
          { role: 'model', text: aiMessageText }
        ]);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: aiMessageText,
            type: 'itinerary',
            itineraryData: plan,
            timestamp: nowStr
          }
        ]);
        
        // Speak response out loud
        speakResponse(aiMessageText);
        
        setCurrentWorkflowNode(null);
        setIsTyping(false);
        return;
      } catch (err) {
        console.error("[TripPlannerChat] Failed to generate itinerary:", err);
      }
    }

    // Default conversational chat if no destination city is found yet
    const updatedHistory = [...chatHistoryRef.current, { role: 'user', text: trimmedText }];
    try {
      // Node 2 (Conversational): Chat response node
      setCurrentWorkflowNode('chat');
      const reply = await sendChatToGemini(chatHistoryRef.current, trimmedText);
      setChatHistory([...updatedHistory, { role: 'model', text: reply }]);
      setMessages(prev => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: 'ai', text: reply, timestamp: nowStr }
      ]);
      
      // Speak response out loud
      speakResponse(reply);
    } catch (err) {
      console.error("Gemini chat error:", err);
      const errMsg = "I'm having trouble connecting to the AI right now. Please check your network and try again.";
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, sender: 'ai', text: errMsg, timestamp: nowStr, isError: true }
      ]);
    } finally {
      setCurrentWorkflowNode(null);
      setIsTyping(false);
    }
  };

  // Web Speech API (voice input) setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-IN';
      
      rec.onstart = () => {
        setIsListening(true);
        latestTranscriptRef.current = ''; // Clear buffer on start
        setInputMsg('');
      };
      
      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        setInputMsg(transcript);
        latestTranscriptRef.current = transcript;
      };
      
      rec.onend = () => {
        setIsListening(false);
        const speechText = latestTranscriptRef.current.trim();
        if (speechText) {
          processUserMessage(speechText);
          latestTranscriptRef.current = ''; // Clear transcript buffer
        } else if (voiceModeRef.current) {
          // If no speech was detected (silence) and voice mode is active,
          // restart listening after a short delay so the live loop stays active
          setTimeout(() => {
            if (voiceModeRef.current) {
              try {
                rec.start();
              } catch (e) {}
            }
          }, 1000);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []); // Run ONCE on mount to prevent aborting/re-binding active speech listeners

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    
    try {
      if (isVoiceMode) { 
        setIsVoiceMode(false);
        setIsListening(false);
        recognitionRef.current.stop();
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } else { 
        setIsVoiceMode(true);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        recognitionRef.current.start(); 
      }
    } catch (err) {
      console.warn("Speech start/stop error:", err);
      setIsListening(false);
      setIsVoiceMode(false);
    }
  };

  // Send message to Gemini and display reply
  const handleSend = async (e) => {
    e?.preventDefault();
    const text = inputMsg.trim();
    if (!text || isTyping) return;
    await processUserMessage(text);
  };

  // Quick suggestion chips
  const suggestions = [
    "📍 Use My Current Location",
    "3 days in Varanasi on budget",
    "Best time to visit Ladakh",
    "Hidden gems in Rajasthan",
    "Kerala backwaters itinerary",
    "Hampi one day plan",
  ];

  return (
    <div className="flex flex-col bg-white sm:rounded-3xl border border-stone-200/80 shadow-card-lift overflow-hidden font-sans" style={{ height: 'calc(100vh - 7rem)' }}>

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="bg-forest-900 text-white px-5 py-4 flex items-center justify-between border-b border-forest-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-saffron text-white shadow-md shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-black text-lg sm:text-xl text-white leading-tight flex items-center gap-2 flex-wrap">
              AI Trip Planner
              <span className="text-[10px] font-mono bg-saffron/20 border border-saffron/40 text-saffron px-2 py-0.5 rounded-full hidden sm:inline-block">
                Gemini 2.0 Flash
              </span>
            </h2>
            <p className="text-xs text-stone-300 font-medium">Design Your Dream Bharat Journey</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-forest-800/80 px-3 py-1.5 rounded-full border border-forest-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:block">Live</span>
        </div>
      </div>

      {/* ─── Message Feed ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-5 bg-stone-50/60">

        {/* API error notice */}
        {initError && (
          <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Running in offline mode — some responses may be limited.</span>
          </div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender label */}
            <div className={`flex items-center gap-1.5 text-[11px] text-stone-400 font-medium mb-1 px-1 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.sender === 'ai'
                ? <Bot className="w-3.5 h-3.5 text-saffron" />
                : <User className="w-3.5 h-3.5 text-stone-500" />
              }
              <span>{m.sender === 'ai' ? 'Bharat AI Architect' : 'You'}</span>
              <span>· {m.timestamp}</span>
            </div>

            {/* Bubble */}
            <div className={`max-w-[90%] sm:max-w-[80%] p-4 ${
              m.sender === 'user'
                ? 'bg-saffron text-white rounded-2xl rounded-tr-sm shadow-md'
                : m.isError
                  ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl rounded-tl-sm shadow-sm'
                  : 'bg-white text-stone-900 border border-stone-200 rounded-2xl rounded-tl-sm shadow-sm'
            }`}>
              {m.sender === 'user'
                ? <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{m.text}</p>
                : <FormattedMessage text={m.text} />
              }
            </div>
          </motion.div>
        ))}

        {/* Typing/Workflow indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]"
            >
              <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center shadow shrink-0 mt-1">
                <Bot className="w-4 h-4 text-saffron" />
              </div>
              <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-3 flex-grow">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <RefreshCw className="w-3.5 h-3.5 text-saffron animate-spin shrink-0" />
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider font-mono">
                    n8n Workflow Execution
                  </span>
                </div>
                
                {/* Node Status Pipeline */}
                <div className="space-y-2 font-mono text-[10px] sm:text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${currentWorkflowNode === 'extraction' ? 'bg-amber-500 animate-pulse shadow-saffron-glow' : 'bg-emerald-500'}`} />
                    <span className={currentWorkflowNode === 'extraction' ? 'text-forest-900 font-bold' : 'text-stone-400'}>
                      [Node 1: SlotExtractor] → Extracting params
                    </span>
                  </div>
                  
                  {currentWorkflowNode !== 'chat' && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          currentWorkflowNode === 'fetching' ? 'bg-amber-500 animate-pulse shadow-saffron-glow' : 
                          ['routing', 'narrative'].includes(currentWorkflowNode) ? 'bg-emerald-500' : 'bg-stone-200'
                        }`} />
                        <span className={currentWorkflowNode === 'fetching' ? 'text-forest-900 font-bold' : 'text-stone-400'}>
                          [Node 2: PlacesFetcher] → Retrieving landmark spots
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          currentWorkflowNode === 'routing' ? 'bg-amber-500 animate-pulse shadow-saffron-glow' : 
                          currentWorkflowNode === 'narrative' ? 'bg-emerald-500' : 'bg-stone-200'
                        }`} />
                        <span className={currentWorkflowNode === 'routing' ? 'text-forest-900 font-bold' : 'text-stone-400'}>
                          [Node 3: RouteOptimizer] → Geo-clustering & OSRM
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          currentWorkflowNode === 'narrative' ? 'bg-amber-500 animate-pulse shadow-saffron-glow' : 'bg-stone-200'
                        }`} />
                        <span className={currentWorkflowNode === 'narrative' ? 'text-forest-900 font-bold' : 'text-stone-400'}>
                          [Node 4: NarrativeWriter] → Writing cultural legends
                        </span>
                      </div>
                    </>
                  )}
                  
                  {currentWorkflowNode === 'chat' && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="text-forest-900 font-bold">
                        [Node 2: GeminiChat] → Generating response
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Quick Suggestion Chips ───────────────────────── */}
      {messages.length <= 1 && !isTyping && (
        <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 bg-stone-50/60 border-t border-stone-100">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                if (s === "📍 Use My Current Location") {
                  handleDetectUserLocationForChat();
                } else {
                  setInputMsg(s);
                }
              }}
              disabled={isDetectingLocation && s === "📍 Use My Current Location"}
              className="text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border border-saffron/40 text-saffron bg-saffron/5 hover:bg-saffron/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              {s === "📍 Use My Current Location" && isDetectingLocation && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-saffron" />
              )}
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ─── Input Bar ───────────────────────────────────── */}
      <div className="px-3 py-3 sm:px-4 sm:py-3 bg-white border-t border-stone-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
            }`}
            title={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-saffron" />}
          </button>

          {/* Text Input or Sound Wave Animation */}
          {isListening ? (
            <div className="flex-1 bg-saffron/10 border border-saffron/30 rounded-2xl px-4 py-2 flex items-center justify-between gap-4 h-[42px] overflow-hidden">
              <span className="text-xs sm:text-sm font-semibold text-saffron flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="truncate">Listening: "{inputMsg || 'Speak now...'}"</span>
              </span>
              {/* Animated Sound Wave Bars */}
              <div className="flex items-end gap-1 h-5 shrink-0">
                {[0.2, 0.4, 0.6, 0.4, 0.2].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    animate={{ scaleY: [0.3, 1.8, 0.3] }}
                    transition={{ duration: 0.65, repeat: Infinity, delay }}
                    className="w-1 h-full bg-saffron rounded-full origin-bottom"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  try {
                    recognitionRef.current?.stop();
                  } catch (e) {}
                  setIsListening(false);
                  setInputMsg('');
                  latestTranscriptRef.current = '';
                }}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer shrink-0"
              >
                Cancel
              </button>
            </div>
          ) : (
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
              placeholder="Ask me anything — 5 days Kerala, best forts in Rajasthan..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron/40 transition-all"
            />
          )}

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!inputMsg.trim() || isTyping || isListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-2xl bg-saffron hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-saffron/20 transition-colors cursor-pointer shrink-0"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
