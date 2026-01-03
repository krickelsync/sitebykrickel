import { motion } from "framer-motion";

interface HamburgerIconProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerIcon = ({ isOpen, onClick }: HamburgerIconProps) => {
  return (
    <button 
      onClick={onClick} 
      className="md:hidden p-2 relative w-10 h-10 flex items-center justify-center"
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-5 flex flex-col justify-between">
        <motion.span
          className="block w-full h-0.5 bg-foreground rounded-full origin-center"
          animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.span
          className="block w-full h-0.5 bg-foreground rounded-full"
          animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
        <motion.span
          className="block w-full h-0.5 bg-foreground rounded-full origin-center"
          animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </button>
  );
};

export default HamburgerIcon;
