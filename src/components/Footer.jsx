import React from 'react';
import { Compass, Heart, Shield, Globe, MapPin, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 border-t border-forest-800 text-stone-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-forest-800">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-saffron flex items-center justify-center shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline">
                <span className="font-serif font-extrabold text-2xl text-white">Bharat</span>
                <span className="font-script text-3xl text-saffron ml-1.5 transform -rotate-3">
                  Yatra
                </span>
              </div>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
              An AI-powered inclusive travel companion for India. Discovering the unmapped heritage, empowering accessibility for all, and safeguarding every traveler.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 border border-forest-700 text-xs text-amber-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart India Hackathon 2026</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li><a href="#destinations" className="hover:text-saffron transition-colors">Heritage Circuits</a></li>
              <li><a href="#destinations" className="hover:text-saffron transition-colors">Himalayan Trails</a></li>
              <li><a href="#destinations" className="hover:text-saffron transition-colors">Spiritual Ghats</a></li>
              <li><a href="#destinations" className="hover:text-saffron transition-colors">Coastal Backwaters</a></li>
              <li><a href="#features" className="hover:text-saffron transition-colors">Offline Audio Guides</a></li>
            </ul>
          </div>

          {/* Column 3: Inclusivity & Safety */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Safety & Inclusivity
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li><a href="#features" className="hover:text-saffron transition-colors">ISL Sign Language Tours</a></li>
              <li><a href="#features" className="hover:text-saffron transition-colors">Wheelchair Accessible Spots</a></li>
              <li><a href="#features" className="hover:text-saffron transition-colors">24/7 SOS Panic Mesh</a></li>
              <li><a href="#features" className="hover:text-saffron transition-colors">Verified Local Guides</a></li>
              <li><a href="#features" className="hover:text-saffron transition-colors">Women Solo Travel Safe</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter / Stay Connected */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              Stay Connected
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Get monthly curated cultural trail recommendations and safety advisories.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="bg-forest-800 border border-forest-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-saffron w-full"
              />
              <button 
                className="bg-saffron hover:bg-amber-600 text-white p-2 rounded-xl transition-colors"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 text-center sm:text-left">
          <div>
            <p className="font-medium text-stone-300">
              © 2026 Bharat Yatra · Made for SIH 2026 · DSU Harohalli
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-saffron transition-colors">Ministry Data Attribution</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
