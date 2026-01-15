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

// Seeded random for consistent results
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = "#ffffff",
  speed = 2,
  noiseIntensity = 1.75,
  scale = 0.2,
  rotation = 0,
  className = "",
}: BeamsProps) {
  // Generate stable diagonal beam configurations
  const beams = useMemo(() => {
    const result = [];
    for (let i = 0; i < beamNumber; i++) {
      const seed = i * 1000;
      
      // DIAGONAL beams - spread across with varied angles
      const baseAngle = -60 + (i / beamNumber) * 120; // -60° to +60°
      const angleNoise = (seededRandom(seed) - 0.5) * noiseIntensity * 15;
      const angle = baseAngle + angleNoise;
      
      // Position offset from center
      const xOffset = (seededRandom(seed + 1) - 0.5) * 100;
      
      // WIDE beam width (React Bits style - chunky)
      const width = beamWidth * 8 * (0.6 + seededRandom(seed + 2) * 0.8);
      
      // Opacity & animation
      const opacity = 0.15 + seededRandom(seed + 3) * 0.25;
      const delay = seededRandom(seed + 4) * (4 / speed);
      const duration = (6 + seededRandom(seed + 5) * 6) / speed;
      
      result.push({ angle, xOffset, width, opacity, delay, duration });
    }
    return result;
  }, [beamNumber, noiseIntensity, beamWidth, speed]);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden bg-black ${className}`}
      style={{ 
        transform: `scale(${1 + scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Main beams layer with rotation */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {beams.map((beam, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: '50%',
              top: '-50%',
              width: `${beam.width}%`,
              height: '200%',
              transform: `translateX(${beam.xOffset}%) rotate(${beam.angle}deg)`,
              transformOrigin: 'center center',
              background: `linear-gradient(90deg, 
                transparent 0%,
                rgba(255,255,255,0.03) 20%,
                ${lightColor} 50%,
                rgba(255,255,255,0.03) 80%,
                transparent 100%
              )`,
              opacity: beam.opacity,
              filter: `blur(${beamHeight * 2}px)`,
              animation: `beam-fade-${index} ${beam.duration}s ease-in-out ${beam.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* HEAVY Grain overlay - visible noise like React Bits */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Second grain layer for extra texture */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          opacity: 0.25,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* CSS Keyframes for beam animation */}
      <style>{`
        ${beams.map((beam, index) => `
          @keyframes beam-fade-${index} {
            0%, 100% { 
              opacity: ${beam.opacity * 0.5}; 
            }
            50% { 
              opacity: ${beam.opacity * 1.2}; 
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
