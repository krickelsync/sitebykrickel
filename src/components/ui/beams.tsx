"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current?.parentElement) {
        setDimensions({
          width: containerRef.current.parentElement.offsetWidth || 1920,
          height: containerRef.current.parentElement.offsetHeight || 1080,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Generate curved beam paths
  const generatePaths = () => {
    const paths: string[] = [];
    const { width, height } = dimensions;
    
    for (let i = 0; i < beamNumber; i++) {
      const startX = (width / beamNumber) * i + (Math.random() - 0.5) * noiseIntensity * 50;
      const startY = -height * 0.2;
      const controlX1 = startX + (Math.random() - 0.5) * noiseIntensity * 100;
      const controlY1 = height * 0.3;
      const controlX2 = startX + (Math.random() - 0.5) * noiseIntensity * 100;
      const controlY2 = height * 0.7;
      const endX = startX + (Math.random() - 0.5) * noiseIntensity * 80;
      const endY = height * 1.2;
      
      paths.push(`M${startX} ${startY} C${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`);
    }
    return paths;
  };

  const paths = generatePaths();
  const animationDuration = 3 / speed;

  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ transform: `rotate(${rotation}deg) scale(${scale > 0.5 ? 1 : scale * 2 + 0.5})` }}
    >
      <svg
        ref={containerRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {paths.map((_, index) => (
            <motion.linearGradient
              key={`gradient-${index}`}
              id={`beam-gradient-${index}`}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: 0, y1: 0, x2: 0, y2: dimensions.height * 0.3 }}
              animate={{
                x1: [0, 0, 0],
                y1: [-dimensions.height * 0.2, dimensions.height * 0.5, dimensions.height * 1.2],
                x2: [0, 0, 0],
                y2: [dimensions.height * 0.1, dimensions.height * 0.8, dimensions.height * 1.5],
              }}
              transition={{
                duration: animationDuration + (Math.random() * 0.5),
                delay: (index / beamNumber) * animationDuration * 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <stop offset="0%" stopColor={lightColor} stopOpacity="0" />
              <stop offset="30%" stopColor={lightColor} stopOpacity="0.6" />
              <stop offset="50%" stopColor={lightColor} stopOpacity="1" />
              <stop offset="70%" stopColor={lightColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
            </motion.linearGradient>
          ))}
        </defs>

        {/* Glow layer */}
        <g filter="url(#beam-glow)">
          {paths.map((path, index) => (
            <motion.path
              key={`glow-${index}`}
              d={path}
              stroke={`url(#beam-gradient-${index})`}
              strokeWidth={beamWidth * beamHeight * 0.3}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 0.6, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: animationDuration + (Math.random() * 0.5),
                delay: (index / beamNumber) * animationDuration * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* Core beams */}
        {paths.map((path, index) => (
          <motion.path
            key={`beam-${index}`}
            d={path}
            stroke={`url(#beam-gradient-${index})`}
            strokeWidth={beamWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 0.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: animationDuration + (Math.random() * 0.5),
              delay: (index / beamNumber) * animationDuration * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Blur filter for glow */}
        <defs>
          <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={beamWidth * 2} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
