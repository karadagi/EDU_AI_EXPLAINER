
import React from 'react';
import { motion } from 'framer-motion';

interface FloorPlanProps {
  stage: 'footprint' | 'zoning' | 'furnishing' | 'raster';
  progress?: number; // 0 to 1 for intermediate learning states
  className?: string;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({ stage, progress = 1, className = "" }) => {
  const isFootprint = stage === 'footprint' || stage === 'raster';
  const isZoning = stage === 'zoning';
  const isFurnishing = stage === 'furnishing';

  // Base dimensions for the classroom
  const width = 200;
  const height = 280;

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full drop-shadow-sm"
        style={{ filter: stage === 'raster' ? 'url(#pixelate)' : 'none' }}
      >
        <defs>
          <filter id="pixelate" x="0" y="0">
            <feFlood x="4" y="4" height="2" width="2" />
            <feComposite width="10" height="10" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>
        </defs>

        {/* Footprint Background */}
        <rect x="10" y="10" width={width - 20} height={height - 20} fill="#DCDCDC" />

        {/* Zoning Elements - Conditional Visibility & Progress */}
        {(isZoning || isFurnishing) && (
          <g opacity={progress}>
            {/* Board */}
            <rect x="10" y="80" width="10" height="80" fill="#FFFF00" />
            {/* Lockers */}
            <rect x="120" y="10" width="70" height="15" fill="#FFA500" />
            {/* Teacher Desk */}
            <rect x="20" y="200" width="30" height="40" fill="#FF00FF" />
            {/* Student Desk Zones */}
            <rect x="70" y="40" width="100" height="40" fill="#00FF00" opacity={0.6} />
            <rect x="70" y="100" width="100" height="40" fill="#00FF00" opacity={0.6} />
            <rect x="70" y="160" width="100" height="40" fill="#00FF00" opacity={0.6} />
            <rect x="70" y="220" width="100" height="40" fill="#00FF00" opacity={0.6} />
          </g>
        )}

        {/* Furnishing Details */}
        {isFurnishing && (
          <g opacity={progress}>
            {/* Individual Desks/Chairs */}
            {[40, 100, 160, 220].map((y, row) => (
               <g key={row}>
                 {[80, 120, 160].map((x, col) => (
                    <g key={col}>
                      <rect x={x} y={y + 10} width="20" height="15" fill="none" stroke="black" strokeWidth="1" />
                      <circle cx={x + 10} cy={y + 30} r="4" fill="none" stroke="black" strokeWidth="1" />
                    </g>
                 ))}
               </g>
            ))}
            {/* Door Arc */}
            <path d="M 40 10 A 30 30 0 0 1 70 40" fill="none" stroke="black" strokeDasharray="4 2" />
          </g>
        )}

        {/* Walls */}
        <path
          d={`M 10 10 L 190 10 L 190 270 L 10 270 Z`}
          fill="none"
          stroke="black"
          strokeWidth="4"
        />

        {/* Door - Red */}
        <line x1="40" y1="10" x2="70" y2="10" stroke="#FF0000" strokeWidth="6" />

        {/* Opening - Cyan */}
        <line x1="40" y1="270" x2="160" y2="270" stroke="#00FFFF" strokeWidth="6" />
      </svg>
    </div>
  );
};
