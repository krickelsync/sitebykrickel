"use client";

import { useRef, useEffect } from "react";

interface ShinyTextProps {
  text: string;
  speed?: number;
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
  direction?: "left" | "right";
  yoyo?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export default function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  className = "",
}: ShinyTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const duration = 10 / speed;
    const startPos = direction === "left" ? "200%" : "-100%";
    const endPos = direction === "left" ? "-100%" : "200%";

    el.style.setProperty("--shine-start", startPos);
    el.style.setProperty("--shine-end", endPos);
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.animationDirection = yoyo ? "alternate" : "normal";
  }, [speed, delay, direction, yoyo]);

  return (
    <>
      <span
        ref={textRef}
        className={`shiny-text ${pauseOnHover ? "pause-on-hover" : ""} ${className}`}
        style={{
          color: color,
          backgroundImage: `linear-gradient(
            ${direction === "left" ? "90deg" : "-90deg"},
            ${color} 0%,
            ${shineColor} 50%,
            ${color} 100%
          )`,
          backgroundSize: `${spread}% 100%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>
      <style>{`
        .shiny-text {
          animation: shine-move linear infinite;
        }
        .shiny-text.pause-on-hover:hover {
          animation-play-state: paused;
        }
        @keyframes shine-move {
          0% { background-position: var(--shine-start) 0; }
          100% { background-position: var(--shine-end) 0; }
        }
      `}</style>
    </>
  );
}
