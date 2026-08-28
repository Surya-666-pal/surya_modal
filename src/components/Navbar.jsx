import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Globe, Menu, X, Shield, Sparkles, ChevronDown, Check, ArrowRight, User, Ticket, HandMetal, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const languages = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी' },
  { code: 'TA', name: 'Tamil', native: 'தமிழ்' },
  { code: 'TE', name: 'Telugu', native: 'తెలుగు' },
  { code: 'BN', name: 'Bengali', native: 'বাংলা' },
  { code: 'MR', name: 'Marathi', native: 'मराठी' },
  { code: 'KN', name: 'Kannada', native: 'ಕನ್ನಡ' },
];

export default function Navbar({ onOpenPlannerModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const [savedAvatar, setSavedAvatar] = useState(() => {
    return localStorage.getItem('bharat_yatra_profile_photo') || null;
  });

  useEffect(() => {
    const checkAvatar = () => {
      setSavedAvatar(localStorage.getItem('bharat_yatra_profile_photo') || null);
    };
    checkAvatar();
    window.addEventListener('storage', checkAvatar);
    return () => window.removeEventListener('storage', checkAvatar);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'AI Trip Planner', href: '/planner' },
    { name: 'Hidden Gems', href: '/hidden-gems' },
    { name: 'Group Room', href: '/group-room' },
    { name: 'ISL Access', href: '/accessibility' },
    { name: 'SOS Safety', href: '/safety' },
    { name: 'Bookings', href: '/bookings' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHomePage
            ? 'glass-nav py-3.5 shadow-xl'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-amber-600 flex items-center justify-center shadow-md shadow-saffron/30 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className="font-serif font-extrabold text-2xl text-white">Bharat</span>
              <span className="font-script text-3xl text-saffron ml-1.5 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                Yatra
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`font-medium text-xs tracking-wide transition-colors relative py-1 group ${
                    isActive ? 'text-saffron font-bold' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-saffron transition-all duration-300 rounded-full ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Pill: Profile + CTA */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Profile Link with Dynamic Avatar */}
            <Link
              to="/profile"
              className={`rounded-full border transition-all flex items-center justify-center overflow-hidden ${
                savedAvatar ? 'w-8 h-8 p-0.5' : 'p-2'
              } ${
                location.pathname === '/profile'
                  ? 'bg-saffron text-white border-saffron shadow-md ring-2 ring-saffron/40'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-stone-200'
              }`}
              aria-label="Profile"
            >
              {savedAvatar ? (
                <img src={savedAvatar} alt="Profile Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>

            {/* Quick Action Button */}
            <button
              onClick={() => navigate('/planner')}
              className="flex items-center gap-2 bg-gradient-to-r from-saffron to-amber-600 hover:from-amber-600 hover:to-saffron text-white px-4 py-2 rounded-full font-semibold text-xs tracking-wide shadow-md shadow-saffron/25 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Trip Bot</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex lg:hidden items-center gap-2">

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden bg-forest-900/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 text-white overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <div className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <span>Bharat</span>
                  <span className="font-script text-2xl text-saffron">Yatra</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">Inclusive AI Travel Companion for India</p>
              </div>

              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-medium flex items-center justify-between py-2 border-b border-white/5 ${
                      location.pathname === link.href ? 'text-saffron font-bold' : 'text-stone-200'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium flex items-center justify-between py-2 border-b border-white/5 ${
                    location.pathname === '/profile' ? 'text-saffron font-bold' : 'text-stone-200'
                  }`}
                >
                  <span>My Profile & Passport</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/planner');
                }}
                className="w-full py-3.5 rounded-xl bg-saffron hover:bg-amber-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-saffron/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan My AI Itinerary</span>
              </button>
              <p className="text-center text-[11px] text-stone-400">
                SIH 2026 Innovation · Empowering 100% Inclusive Travel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
