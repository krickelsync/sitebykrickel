"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const beamsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const beams: HTMLDivElement[] = [];

    // Clear existing beams
    container.innerHTML = "";
    beamsRef.current = [];

    // Create beams
    for (let i = 0; i < beamNumber; i++) {
      const beam = document.createElement("div");
      beam.style.position = "absolute";
      beam.style.width = `${beamWidth}px`;
      beam.style.height = `${beamHeight}%`;
      beam.style.background = `linear-gradient(180deg, ${lightColor}00 0%, ${lightColor}40 20%, ${lightColor}80 50%, ${lightColor}40 80%, ${lightColor}00 100%)`;
      beam.style.left = `${(i / beamNumber) * 100}%`;
      beam.style.top = "-20%";
      beam.style.opacity = "0";
      beam.style.filter = `blur(${beamWidth * 0.5}px)`;
      beam.style.transform = `rotate(${rotation}deg) scaleX(${scale})`;
      beam.style.transformOrigin = "top center";
      beam.style.willChange = "transform, opacity";
      
      container.appendChild(beam);
      beams.push(beam);
      beamsRef.current.push(beam);
    }

    // Animate beams
    beams.forEach((beam, index) => {
      const delay = (index / beamNumber) * (2 / speed);
      const duration = 3 / speed;
      const randomOffset = Math.random() * noiseIntensity * 10;

      gsap.set(beam, {
        x: randomOffset,
      });

      gsap.to(beam, {
        y: "140%",
        opacity: 0.6 + Math.random() * 0.4,
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: "none",
        onRepeat: () => {
          gsap.set(beam, {
            x: (Math.random() - 0.5) * noiseIntensity * 20,
          });
        },
      });

      // Opacity pulsing
      gsap.to(beam, {
        opacity: 0.2 + Math.random() * 0.3,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });

    return () => {
      beams.forEach((beam) => {
        gsap.killTweensOf(beam);
      });
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}
