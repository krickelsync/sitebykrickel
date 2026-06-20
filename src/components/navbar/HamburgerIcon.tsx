import { motion } from "framer-motion";

/** Animated 3-bar hamburger that morphs into an X. */
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-6 h-6 flex flex-col justify-center items-center relative">
    <motion.span
      className="block w-5 h-0.5 bg-foreground absolute"
      animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.span
      className="block w-5 h-0.5 bg-foreground absolute"
      animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    />
    <motion.span
      className="block w-5 h-0.5 bg-foreground absolute"
      animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 6 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

export default HamburgerIcon;