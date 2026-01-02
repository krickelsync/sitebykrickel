import { useRef, useState, useCallback } from "react";

interface MagneticState {
  x: number;
  y: number;
}

interface UseMagneticEffectOptions {
  strength?: number;
  radius?: number;
  repel?: boolean;
}

export const useMagneticEffect = ({
  strength = 0.3,
  radius = 150,
  repel = false,
}: UseMagneticEffectOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<MagneticState>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < radius) {
        const factor = (1 - distance / radius) * strength;
        const multiplier = repel ? -1 : 1;
        
        setPosition({
          x: distanceX * factor * multiplier,
          y: distanceY * factor * multiplier,
        });
      }
    },
    [strength, radius, repel]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};
