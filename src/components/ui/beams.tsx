"use client";

import { useMemo } from "react";

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  className?: string;
}

export default function Beams({
  beamWidth = 1.5,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  className = "",
}: BeamsProps) {
  // Generate random but stable beam positions using noiseIntensity
  const beams = useMemo(() => {
    const result = [];
    for (let i = 0; i < beamNumber; i++) {
      // Base position evenly distributed
      const basePosition = (i / beamNumber) * 100;
      // Add noise to position
      const noise = (Math.random() - 0.5) * noiseIntensity * 10;
      const position = Math.max(0, Math.min(100, basePosition + noise));
      
      // Random opacity variation
      const opacity = 0.3 + Math.random() * 0.7;
      
      // Random width variation based on beamWidth
      const width = beamWidth * (0.5 + Math.random());
      
      // Random blur variation based on beamHeight
      const blur = beamHeight * (0.8 + Math.random() * 0.4);
      
      // Random delay for animation
      const delay = Math.random() * (2 / speed);
      
      result.push({ position, opacity, width, blur, delay });
    }
    return result;
  }, [beamNumber, noiseIntensity, beamWidth, beamHeight, speed]);

  // Convert hex to rgba for gradient
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg) scale(${1 + scale})`,
        transformOrigin: 'center center'
      }}
    >
      {beams.map((beam, index) => (
        <div
          key={index}
          className="absolute top-0 h-full"
          style={{
            left: `${beam.position}%`,
            width: `${beam.width}%`,
            background: `linear-gradient(180deg, 
              transparent 0%, 
              ${hexToRgba(lightColor, beam.opacity * 0.15)} 20%,
              ${hexToRgba(lightColor, beam.opacity)} 50%,
              ${hexToRgba(lightColor, beam.opacity * 0.15)} 80%,
              transparent 100%
            )`,
            filter: `blur(${beam.blur}px)`,
            opacity: beam.opacity,
            animation: `beam-pulse ${4 / speed}s ease-in-out ${beam.delay}s infinite`,
          }}
        />
      ))}
      
      {/* CSS Keyframes */}
      <style>{`
        @keyframes beam-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
