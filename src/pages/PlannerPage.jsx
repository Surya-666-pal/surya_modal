import React from 'react';
import TripPlannerChat from '../components/TripPlannerChat';

export default function PlannerPage() {
  return (
    <div className="pt-24 pb-12 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TripPlannerChat />
      </div>
    </div>
  );
}
