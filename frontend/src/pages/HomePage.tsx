/**
 * @module HomePage
 * The main landing dashboard for authenticated users.
 * Displays navigational feature cards and general platform information.
 */

import React from 'react';
import { useHomeLogic } from '../hooks/home/useHomeLogic';

import HeroSection from '../components/home/HeroSection';
import FeatureCards from '../components/home/FeatureCards';
import FaqSection from '../components/home/FaqSection';

const HomePage: React.FC = () => {
  const { userRoleText, navigateToIde, navigateToSubmit } = useHomeLogic();

  return (
    <div className="h-full w-full bg-gray-950 text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        <HeroSection userRoleText={userRoleText} />

        <FeatureCards 
          onNavigateIde={navigateToIde} 
          onNavigateSubmit={navigateToSubmit} 
        />

        <FaqSection />

      </div>
    </div>
  );
};

export default HomePage;