import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Palette, Code, Brain, TrendingUp, Lightbulb, RefreshCw, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillBar from "@/components/SkillBar";
import ExpertiseCard from "@/components/ExpertiseCard";
import WhyChooseCard from "@/components/WhyChooseCard";
import AnimatedText from "@/components/AnimatedText";
import profileImage from "@/assets/elfan-profile.jpg";
import workingImage from "@/assets/elfan-working.jpg";

const About = () => {
  const bioSectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: bioSectionRef,
    offset: ["start end", "end start"]
  });
  
  // Photo moves slower than content (parallax effect)
  const photoY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  // Working image parallax - moves in opposite direction
  const workingImageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const creativeSkills = [{
    name: "Photoshop",
    percentage: 100
  }, {
    name: "Illustrator",
    percentage: 90
  }, {
    name: "Figma (UI/UX)",
    percentage: 75
  }, {
    name: "Premiere Pro",
    percentage: 70
  }, {
    name: "Blender (3D)",
    percentage: 60
  }];
  const devSkills = [{
    name: "Front-End",
    percentage: 75,
    description: "React, Tailwind CSS, TypeScript/JS"
  }, {
    name: "Back-End",
    percentage: 65,
    description: "Next.js, E-commerce Integration"
  }];
  const expertise = [{
    icon: Palette,
    title: "Graphic Designer",
    items: ["Logo Design", "Clothing Design", "Packaging Design", "Technical Measurable", "UX/UI Basics", "Campaign Design"]
  }, {
    icon: Code,
    title: "Web Designer/Dev",
    items: ["E-commerce", "Portfolio", "Company Profile"]
  }, {
    icon: Brain,
    title: "Artificial Intelligence",
    items: ["Prompt Engineering", "Machine Learning Basics", "AI Literacy"]
  }, {
    icon: TrendingUp,
    title: "Financial Analysis",
    items: ["Fundamental & Technical Analysis", "Risk Management (SnR)", "Crypto & Forex Markets"]
  }];
  const softSkills = [{
    icon: Lightbulb,
    title: "Critical Thinker",
    description: "I don't just solve problems; I analyze the root cause."
  }, {
    icon: RefreshCw,
    title: "Adaptive Learner",
    description: "In a world of AI and Web3, I stay ahead of the curve through continuous learning."
  }, {
    icon: Target,
    title: "Precision Focused",
    description: "Whether it's pixel-perfect CSS or analyzing market charts."
  }];
  return <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Spline */}
      <section className="relative flex flex-col">
        {/* Spline 3D Interactive Area */}
        <div className="relative w-full h-[45vh] md:h-[55vh] pt-32 md:pt-40">
          <spline-viewer 
            hint 
            url="https://prod.spline.design/Zkl1fjrHtunP9HZZ/scene.splinecode"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        </div>

        {/* Hero Content - Below Spline with overlap */}
        <div className="relative z-10 container mx-auto px-4 py-8 -mt-32 md:-mt-40">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.5
        }} className="max-w-4xl bg-background/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-glass-border">
            
            <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl">
              <span className="text-primary">18 Years Old.</span>{" "}
              <span className="text-primary">5 Years Experience</span> in Graphic Designer, 
              creative bridging the gap between design, technology, and artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section ref={bioSectionRef} className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Photo with Parallax */}
            <motion.div 
              style={{ y: photoY }}
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }} 
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <img src={profileImage} alt="Elfan Tinar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }} 
                viewport={{ once: true }} 
                className="absolute -bottom-6 -right-6 glass-card p-4 max-w-[200px]"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="text-primary">5+ years</span> of hands-on experience in design & development
                </p>
              </motion.div>
            </motion.div>

            {/* Bio Text */}
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                A Unique Perspective
              </h2>
              <div className="space-y-4 font-mono text-sm text-muted-foreground leading-relaxed">
                <p>
                  I bring a unique perspective to the digital landscape with 5 years of hands-on experience. 
                  <span className="text-foreground"> I don't just make things look good; I make them work.</span>
                </p>
                <p>
                  My journey started early, allowing me to master the balance between striking visuals and robust code.
                </p>
              </div>

              {/* Working image with parallax */}
              <motion.div 
                style={{ y: workingImageY }}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }} 
                viewport={{ once: true }} 
                className="relative aspect-video overflow-hidden rounded-xl mt-8"
              >
                <img src={workingImage} alt="Elfan working" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/10" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 md:py-32 bg-muted/5">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              // Skills & Expertise
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              What I Bring to the Table
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Creative Skills */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-mono text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                  // Creative
                </h3>
              </div>
              <div className="space-y-6">
                {creativeSkills.map((skill, index) => <SkillBar key={skill.name} name={skill.name} percentage={skill.percentage} delay={index} />)}
              </div>
            </div>

            {/* Dev Stack */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="font-mono text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                  // Dev Stack
                </h3>
              </div>
              <div className="space-y-6">
                {devSkills.map((skill, index) => <SkillBar key={skill.name} name={skill.name} percentage={skill.percentage} description={skill.description} delay={index} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Expertise */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              // Specialized Expertise
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              Areas of Focus
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => <ExpertiseCard key={item.title} icon={item.icon} title={item.title} items={item.items} delay={index} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-20 md:py-32 bg-muted/5">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <span className="font-mono text-xs text-primary tracking-widest uppercase">
              // Soft Skills
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              Why Choose Me
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {softSkills.map((skill, index) => <WhyChooseCard key={skill.title} icon={skill.icon} title={skill.title} description={skill.description} delay={index} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;