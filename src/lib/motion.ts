import type { Variants } from "framer-motion";

/** Standard fade-up entry used across section content. */
export const fadeUp: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.01 },
  },
};

/** Slightly larger travel for cards / grid items. */
export const fadeUpLg: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.01 },
  },
};

/** Container that staggers its children's entry. */
export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0 },
  },
});