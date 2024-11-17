"use client";

import { cn } from "@/lib/utils";
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { CornerRightUp, ChevronRight  } from 'lucide-react';
import SparklesText from "@/components/ui/sparkles-text";
import GridPattern from "@/components/ui/grid-pattern";


const Welcome: React.FC = () => {
  const handleLearnMoreClick = () => {
    const section = document.getElementById("descriptionSection"); // ID de la section suivante
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col h-full items-start justify-center max-w-screen-2xlw-screen pt-32 p-5">
      <div className="flex flex-col items-center justify-start text-center max-w-3xl mb-4">
          <SparklesText text="TobIb" />
      </div>

      <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-10">Votre IA d'Assistant Médical </h2>
      <div className="text-xl text-gray-700 dark:text-gray-300 text-start mb-6">
        <p>TobIb aide à diagnostiquer les symptômes, fournir des conseils de santé et bien-être et offrir des recommandations de santé personnalisées.</p>
      </div>


        <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 w-full">
        <Link to="/login" className="w-full md:w-auto">
          <Button className="w-full px-4 py-2 mb-2 md:mb-0">
            <span>S'authentifier?</span>
            <CornerRightUp />
          </Button>
        </Link>
        <Button variant="outline" className="md:w-auto w-full px-4 py-2" onClick={handleLearnMoreClick}>
          <span>Savoir plus...</span>
          <ChevronRight />
        </Button>
      </div>

        <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
              "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
            )}
          />


    </div>
  );
};

export default Welcome;
