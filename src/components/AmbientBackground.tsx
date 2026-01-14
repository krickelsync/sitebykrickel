import { motion } from "framer-motion";

interface AmbientBackgroundProps {
  /** Show subtle grid overlay */
  showGrid?: boolean;
  /** Show noise texture */
  showNoise?: boolean;
  /** Primary blob intensity (0-1) */
  primaryIntensity?: number;
  /** Additional className for the container */
  className?: string;
  /** Children to render on top */
  children?: React.ReactNode;
}

const AmbientBackground = ({
  showGrid = false,
  showNoise = true,
  primaryIntensity = 0.15,
  className = "",
  children,
}: AmbientBackgroundProps) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient layer */}
      <div 
        className="fixed inset-0 -z-50"
        style={{
          background: `radial-gradient(ellipse at top, hsl(240 10% 6%) 0%, hsl(var(--background)) 50%, hsl(var(--background-deep)) 100%)`
        }}
      />

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
        {/* Primary blob - top center, accent color */}
        <motion.div
          className="absolute"
          style={{
            width: '900px',
            height: '1200px',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `hsl(var(--primary) / ${primaryIntensity})`,
            borderRadius: '50%',
            filter: 'blur(150px)',
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 2, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary blob - left side, purple tint */}
        <motion.div
          className="absolute hidden md:block"
          style={{
            width: '600px',
            height: '800px',
            top: '30%',
            left: '-10%',
            background: 'hsl(280 60% 50% / 0.08)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
            rotate: [0, -1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary blob - right side, blue tint */}
        <motion.div
          className="absolute hidden md:block"
          style={{
            width: '500px',
            height: '700px',
            top: '50%',
            right: '-5%',
            background: 'hsl(220 70% 50% / 0.06)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, -15, 0],
            rotate: [0, 1.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Bottom accent - subtle pulsing glow */}
        <motion.div
          className="absolute"
          style={{
            width: '1000px',
            height: '400px',
            bottom: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'hsl(var(--primary) / 0.08)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Noise texture overlay */}
      {showNoise && <div className="noise-overlay" />}

      {/* Grid overlay */}
      {showGrid && <div className="grid-overlay" />}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AmbientBackground;
