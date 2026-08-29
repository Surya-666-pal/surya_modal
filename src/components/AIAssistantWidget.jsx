import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, Send, User, Loader2, MessageSquare, Compass, ShieldAlert, Volume2, Mic, MicOff, CheckCircle2, RotateCw } from 'lucide-react';
import { chatWithGeminiAgent } from '../services/geminiAgent';
import { 
  processPlannerMessage, 
  startPlannerConversation, 
  loadPlannerSession, 
  savePlannerSession 
} from '../services/aiPlannerWorkflow';
import { useNavigate } from 'react-router-dom';

export default function AIAssistantWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [plannerState, setPlannerState] = useState(() => loadPlannerSession() || startPlannerConversation());
  const [messages, setMessages] = useState(() => {
    const saved = loadPlannerSession();
    return saved?.messages || [
      {
        role: 'assistant',
        text: 'Namaste! 🙏 I am your Bharat Yatra Gemini AI Guide. Which city or region in India would you like to explore, or ask me about routes, heritage, and local cuisines!'
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Step 2: Initialize Web Speech API for voice transcript
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
        setIsVoiceListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('[AIAssistantWidget] Speech recognition error:', err);
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use text input.");
      return;
    }

    if (isVoiceListening) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsVoiceListening(true);
      } catch (e) {
        console.warn("Speech recognition already running");
      }
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query || isLoading) return;

    setInputText('');
    setIsLoading(true);

    // Check if query is travel planning vs general question
    const isPlanningRelated = 
      plannerState.stage === 'COLLECTING_SLOTS' ||
      plannerState.stage === 'AWAITING_CONFIRMATION' ||
      plannerState.stage === 'GENERATED' ||
      query.toLowerCase().includes('plan') ||
      query.toLowerCase().includes('trip') ||
      query.toLowerCase().includes('itinerary') ||
      query.toLowerCase().includes('days') ||
      query.toLowerCase().includes('explore');

    try {
      if (isPlanningRelated) {
        // Steps 2 to 11 full pipeline
        const updatedState = await processPlannerMessage(query, plannerState);
        setPlannerState(updatedState);
        setMessages(updatedState.messages);

        // If newly generated, dispatch event so PlannerPage updates live
        if (updatedState.stage === 'GENERATED' && updatedState.planData) {
          window.dispatchEvent(new CustomEvent('bharat_yatra_plan_updated', { detail: updatedState.planData }));
        }
      } else {
        // General conversational response
        const userMsg = { role: 'user', text: query };
        const updatedMsgs = [...messages, userMsg];
        setMessages(updatedMsgs);

        const history = updatedMsgs.slice(-6);
        const reply = await chatWithGeminiAgent(query, history);
        const nextMsgs = [...updatedMsgs, { role: 'assistant', text: reply }];
        setMessages(nextMsgs);

        const nextState = { ...plannerState, messages: nextMsgs };
        setPlannerState(nextState);
        savePlannerSession(nextState);
      }
    } catch (err) {
      console.error("[AIAssistantWidget] Chat error:", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I encountered a momentary issue processing your request. Please try again, or ask about another city or vibe!"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    const fresh = startPlannerConversation();
    setPlannerState(fresh);
    setMessages(fresh.messages);
  };

  return (
    <>
      {/* Floating Agent Trigger Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3 rounded-full bg-forest-900 border-2 border-saffron/80 text-white font-bold text-xs flex items-center gap-2.5 shadow-[0_8px_30px_rgba(240,147,43,0.4)] backdrop-blur-xl cursor-pointer group"
          aria-label="Open Gemini AI Travel Agent"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-saffron to-amber-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="font-leaguespartan text-sm tracking-wide">Gemini AI Guide</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.button>
      </div>

      {/* Interactive AI Agent Chat Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] sm:w-[420px] bg-forest-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[600px] h-[75vh]"
          >
            {/* Header */}
            <div className="p-4 bg-forest-800/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-saffron to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-leaguespartan font-bold text-base text-white flex items-center gap-1.5">
                    <span>Bharat Yatra AI Agent</span>
                    <span className="text-[9px] bg-saffron text-white px-2 py-0.5 rounded-full font-bold uppercase">
                      Gemini 2.0
                    </span>
                  </h4>
                  <p className="text-[11px] text-stone-300">Live Multilingual India Travel Expert</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetConversation}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Reset trip conversation"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-saffron/20 text-saffron flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[84%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-saffron text-white rounded-tr-none font-medium'
                        : 'bg-white/10 text-stone-100 border border-white/10 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}

                    {/* Quick navigation link when trip is generated */}
                    {msg.text.includes("is ready!") && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/planner');
                        }}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-saffron text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:bg-amber-600 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>View Roadmap in AI Planner</span>
                      </button>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/20 text-stone-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs pl-8">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-saffron" />
                  <span>Gemini is architecting your journey...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-2 bg-black/20 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {[
                "🪔 Varanasi 3-Day Heritage & Aarti Plan",
                "🎟️ Kashi Vishwanath Govt VIP Passes & Timings",
                "🚗 Varanasi Vehicle Rent & Daily Budget",
                "🏛️ Sarnath ASI Monument Entry Fees & Museum",
                "Spiti Valley 5-day adventure trek",
                "Kerala backwaters 4 days with family",
                "Yes, generate my itinerary!"
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setInputText(suggestion);
                  }}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-stone-300 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Footer with Text & Voice (Web Speech API) */}
            <form onSubmit={handleSendMessage} className="p-3 bg-forest-900 border-t border-white/10 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isVoiceListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-forest-800 text-stone-300 hover:text-white border border-white/15'
                }`}
                title={isVoiceListening ? "Listening... click to stop" : "Voice input (Speak in your language)"}
                aria-label="Voice input"
              >
                {isVoiceListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isVoiceListening ? "Listening to your voice..." : "Type city, days, budget, or vibes..."}
                className="flex-1 bg-forest-800/80 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-saffron"
              />
              
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-2xl bg-saffron hover:bg-amber-600 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
