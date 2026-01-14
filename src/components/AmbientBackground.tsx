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
  // Light mode uses much softer blob intensities
  const lightPrimaryIntensity = 0.06;
  const lightSecondaryIntensity = 0.04;
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient layer - different for light/dark */}
      <div 
        className="fixed inset-0 -z-50 bg-gradient-to-b from-background via-background to-background-deep dark:from-[hsl(240_10%_6%)] dark:via-background dark:to-background-deep light:from-slate-50 light:via-white light:to-slate-100"
      />

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
        {/* Primary blob - top center, accent color */}
        <motion.div
          className="absolute dark:opacity-100 light:opacity-60"
          style={{
            width: '900px',
            height: '1200px',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
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
        >
          {/* Use CSS for light/dark background colors */}
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `hsl(var(--primary) / ${primaryIntensity})`,
            }}
          />
        </motion.div>

        {/* Secondary blob - left side, purple/violet tint */}
        <motion.div
          className="absolute hidden md:block dark:opacity-100 light:opacity-50"
          style={{
            width: '600px',
            height: '800px',
            top: '30%',
            left: '-10%',
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
        >
          <div 
            className="w-full h-full rounded-full dark:bg-[hsl(280_60%_50%/0.08)] light:bg-[hsl(263_70%_50%/0.05)]"
          />
        </motion.div>

        {/* Tertiary blob - right side, blue/indigo tint */}
        <motion.div
          className="absolute hidden md:block dark:opacity-100 light:opacity-50"
          style={{
            width: '500px',
            height: '700px',
            top: '50%',
            right: '-5%',
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
        >
          <div 
            className="w-full h-full rounded-full dark:bg-[hsl(220_70%_50%/0.06)] light:bg-[hsl(239_84%_67%/0.04)]"
          />
        </motion.div>

        {/* Bottom accent - subtle pulsing glow */}
        <motion.div
          className="absolute dark:opacity-100 light:opacity-40"
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

      {/* Noise texture overlay - hidden in light mode via CSS */}
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
