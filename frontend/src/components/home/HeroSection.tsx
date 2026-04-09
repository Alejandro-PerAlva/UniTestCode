/**
 * @module HeroSection
 * Presentation component displaying the welcoming banner and application title.
 */

import React from 'react';
import { Code2 } from 'lucide-react';

/**
 * Props for the HeroSection component.
 */
export interface HeroSectionProps {
  /** The localized string representation of the user's role (e.g., "Alumno" or "Profesor"). */
  userRoleText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userRoleText }) => {
  return (
    <div className="flex flex-col items-center text-center gap-6 mt-8">
      <div className="bg-blue-900/30 p-4 rounded-full border border-blue-800/50">
        <Code2 size={48} className="text-blue-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Bienvenido a <span className="text-blue-500">UnitTestCode</span>, {userRoleText}
      </h1>
      <p className="text-lg text-gray-400 max-w-2xl">
        La plataforma definitiva para escribir, depurar y evaluar tu código ensamblador MIPS en tiempo real. 
        Elige una herramienta a continuación para empezar a trabajar.
      </p>
    </div>
  );
};

export default HeroSection;