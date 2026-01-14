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
        className="fixed inset-0 -z-50 dark:bg-[radial-gradient(ellipse_at_top,hsl(240_10%_6%)_0%,hsl(240_9%_2%)_50%,hsl(240_7%_1%)_100%)] light:bg-gradient-to-b light:from-slate-50 light:via-white light:to-slate-100"
      />

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
        {/* Primary blob - top center, accent color */}
        <motion.div
          className="absolute dark:opacity-100 light:opacity-60"
          style={{
            width: '900px',
            height: '1400px',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            filter: 'blur(150px)',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 1, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Light mode: softer indigo, Dark mode: stronger lime glow */}
          <div 
            className="w-full h-full rounded-full ambient-blob-primary"
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
            className="w-full h-full rounded-full ambient-blob-secondary"
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
            className="w-full h-full rounded-full ambient-blob-tertiary"
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
        >
          <div className="w-full h-full rounded-full ambient-blob-primary" style={{ opacity: 0.5 }} />
        </motion.div>
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
