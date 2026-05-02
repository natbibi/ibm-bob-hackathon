'use client';

import { useEffect, useState } from 'react';

interface HealthRingProps {
  score: number;
}

export default function HealthRing({ score }: HealthRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="bg-[#1E1E2E] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center h-full">
      <div className="relative w-[200px] h-[200px]">
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#374151"
            strokeWidth="18"
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="18"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-[800ms] ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-6xl font-bold transition-colors duration-300"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-gray-400 text-sm mt-1">/ 100</span>
          <span className="text-gray-500 text-xs mt-2">Health Score</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px ${color}40);
          }
          50% {
            filter: drop-shadow(0 0 16px ${color}60);
          }
        }
      `}</style>
    </div>
  );
}

// Made with Bob
