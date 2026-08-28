import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlightTransition from './components/FlightTransition';
import Home from './pages/Home';
import PlannerPage from './pages/PlannerPage';
import HiddenGemsPage from './pages/HiddenGemsPage';
import GroupRoomPage from './pages/GroupRoomPage';
import AccessibilityPage from './pages/AccessibilityPage';
import SafetyPage from './pages/SafetyPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import TripPlannerModal from './components/TripPlannerModal';
import AIAssistantWidget from './components/AIAssistantWidget';
import ScrollToTop from './components/ScrollToTop';

function AnimatedRoutes({ onOpenPlannerModal }) {
  const location = useLocation();

  return (
    <FlightTransition>
      <Routes location={location}>
        <Route path="/" element={<Home onOpenPlannerModal={onOpenPlannerModal} />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/hidden-gems" element={<HiddenGemsPage />} />
        <Route path="/group-room" element={<GroupRoomPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </FlightTransition>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-cream text-stone-900 font-sans selection:bg-saffron selection:text-white flex flex-col overflow-x-hidden">
        {/* Static Top Navbar */}
        <Navbar onOpenPlannerModal={() => setIsModalOpen(true)} />

        {/* Dynamic Route Content with Flying Saffron Airplane Transition */}
        <main className="flex-grow">
          <AnimatedRoutes onOpenPlannerModal={() => setIsModalOpen(true)} />
        </main>

        {/* Static Footer */}
        <Footer />

        {/* Global Quick Trip Planner Modal */}
        <TripPlannerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Global Live Gemini AI Travel Assistant Widget */}
        <AIAssistantWidget />
      </div>
    </BrowserRouter>
  );
}
