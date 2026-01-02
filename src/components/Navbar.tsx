import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo3D from "./Logo3D";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [{
    name: "Features",
    href: "#features",
    external: false
  }, {
    name: "Pricing",
    href: "#pricing",
    external: false
  }, {
    name: "Showcase",
    href: "/showcase",
    external: false
  }, {
    name: "Demo",
    href: "https://kcklsite.myshopify.com/",
    external: true
  }, {
    name: "About Me",
    href: "https://krickel.carrd.co/",
    external: true
  }];
  return <motion.nav initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.6,
    ease: "easeOut"
  }} className="fixed top-0 left-0 right-0 z-50 glass overflow-visible">
      <div className="container mx-auto px-4 overflow-visible">
        <div className="flex items-center justify-between h-20 overflow-visible">
          {/* 3D Logo */}
          <a href="#" className="flex items-center justify-center overflow-visible" style={{ overflow: 'visible' }}>
            <Logo3D />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <a key={link.name} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                {link.name}
              </a>)}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#pricing" className="glass-card px-6 py-2.5 font-mono text-sm hover:bg-primary/10 transition-all duration-300 hover:glow-border">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden pb-6">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => <a key={link.name} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} onClick={() => setIsOpen(false)} className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.name}
                </a>)}
              <a href="#pricing" onClick={() => setIsOpen(false)} className="glass-card px-6 py-2.5 font-mono text-sm text-center mt-2">
                Get Started
              </a>
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navbar;