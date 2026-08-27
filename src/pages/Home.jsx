import React from 'react';
import Hero from '../components/Hero';
import StatsStrip from '../components/StatsStrip';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import DestinationCarousel from '../components/DestinationCarousel';
import FinalCTA from '../components/FinalCTA';
import { useNavigate } from 'react-router-dom';

export default function Home({ onOpenPlannerModal }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Section 1: Hero Section */}
      <Hero 
        onOpenPlanner={() => navigate('/planner')} 
        onExploreGems={() => navigate('/hidden-gems')}
      />

      {/* Section 2: Stats & Trust Strip */}
      <StatsStrip />

      {/* Section 3: Features 6-Card Grid */}
      <Features 
        onSelectFeature={() => navigate('/planner')}
      />

      {/* Section 4: How It Works Journey */}
      <HowItWorks 
        onOpenPlanner={() => navigate('/planner')}
      />

      {/* Section 5: Destination Carousel */}
      <DestinationCarousel 
        onSelectDestination={(dest) => navigate('/planner', { state: { destination: dest.name } })}
      />

      {/* Section 6: Final Call to Action */}
      <FinalCTA 
        onOpenPlanner={() => navigate('/planner')}
      />
    </>
  );
}
