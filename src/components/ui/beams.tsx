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
  // Generate stable beam configurations
  const beams = useMemo(() => {
    const result = [];
    for (let i = 0; i < beamNumber; i++) {
      const seed = i * 1000;
      
      // Base position evenly distributed with noise
      const basePosition = (i / beamNumber) * 100;
      const noise = (seededRandom(seed + 1) - 0.5) * noiseIntensity * 20;
      const position = Math.max(-5, Math.min(105, basePosition + noise));
      
      // Beam characteristics
      const opacity = 0.4 + seededRandom(seed + 2) * 0.6;
      const width = beamWidth * (0.6 + seededRandom(seed + 3) * 0.8);
      const blur = beamHeight * (0.5 + seededRandom(seed + 4) * 0.5);
      const delay = seededRandom(seed + 5) * (3 / speed);
      const duration = (3 + seededRandom(seed + 6) * 4) / speed;
      const brightness = 0.8 + seededRandom(seed + 7) * 0.4;
      
      result.push({ position, opacity, width, blur, delay, duration, brightness });
    }
    return result;
  }, [beamNumber, noiseIntensity, beamWidth, beamHeight, speed]);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgb = hexToRgb(lightColor);

  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg) scale(${1 + scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Beams container with screen blend */}
      <div 
        className="absolute inset-0"
        style={{
          mixBlendMode: 'screen',
        }}
      >
        {beams.map((beam, index) => (
          <div
            key={index}
            className="absolute h-full"
            style={{
              left: `${beam.position}%`,
              width: `${beam.width * 2}%`,
              transform: 'translateX(-50%)',
              background: `
                linear-gradient(90deg, 
                  transparent 0%,
                  rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${beam.opacity * 0.1}) 15%,
                  rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${beam.opacity * 0.4}) 30%,
                  rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${beam.opacity}) 50%,
                  rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${beam.opacity * 0.4}) 70%,
                  rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${beam.opacity * 0.1}) 85%,
                  transparent 100%
                )
              `,
              filter: `blur(${beam.blur}px) brightness(${beam.brightness})`,
              animation: `beam-animate-${index} ${beam.duration}s ease-in-out ${beam.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Vignette / Mask overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, 
            transparent 0%, 
            transparent 30%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.7) 80%,
            rgba(0, 0, 0, 0.95) 100%
          )`,
        }}
      />

      {/* Grain/noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* CSS Keyframes for each beam */}
      <style>{`
        ${beams.map((beam, index) => `
          @keyframes beam-animate-${index} {
            0%, 100% { 
              opacity: ${beam.opacity * 0.3}; 
              filter: blur(${beam.blur}px) brightness(${beam.brightness * 0.7});
            }
            50% { 
              opacity: ${beam.opacity}; 
              filter: blur(${beam.blur * 0.8}px) brightness(${beam.brightness * 1.2});
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
