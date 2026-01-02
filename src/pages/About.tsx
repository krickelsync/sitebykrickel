import { motion } from "framer-motion";
import { Palette, Code, Brain, TrendingUp, Lightbulb, RefreshCw, Target } from "lucide-react";
import Spline from "@splinetool/react-spline";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SkillBar from "@/components/SkillBar";
import ExpertiseCard from "@/components/ExpertiseCard";
import WhyChooseCard from "@/components/WhyChooseCard";
import AnimatedText from "@/components/AnimatedText";
import profileImage from "@/assets/elfan-profile.jpg";
import workingImage from "@/assets/elfan-working.jpg";

const About = () => {
  const creativeSkills = [
    { name: "Photoshop", percentage: 100 },
    { name: "Illustrator", percentage: 90 },
    { name: "Figma (UI/UX)", percentage: 75 },
    { name: "Premiere Pro", percentage: 70 },
    { name: "Blender (3D)", percentage: 60 },
  ];

  const devSkills = [
    { name: "Front-End", percentage: 75, description: "React, Tailwind CSS, TypeScript/JS" },
    { name: "Back-End", percentage: 65, description: "Next.js, E-commerce Integration" },
  ];

  const expertise = [
    {
      icon: Palette,
      title: "Graphic Designer",
      items: ["Logo Design", "Clothing Design", "Packaging Design", "Technical Measurable", "UX/UI Basics", "Campaign Design"],
    },
    {
      icon: Code,
      title: "Web Designer/Dev",
      items: ["E-commerce", "Portfolio", "Company Profile"],
    },
    {
      icon: Brain,
      title: "Artificial Intelligence",
      items: ["Prompt Engineering", "Machine Learning Basics", "AI Literacy"],
    },
    {
      icon: TrendingUp,
      title: "Financial Analysis",
      items: ["Fundamental & Technical Analysis", "Risk Management (SnR)", "Crypto & Forex Markets"],
    },
  ];

  const softSkills = [
    {
      icon: Lightbulb,
      title: "Critical Thinker",
      description: "I don't just solve problems; I analyze the root cause.",
    },
    {
      icon: RefreshCw,
      title: "Adaptive Learner",
      description: "In a world of AI and Web3, I stay ahead of the curve through continuous learning.",
    },
    {
      icon: Target,
      title: "Precision Focused",
      description: "Whether it's pixel-perfect CSS or analyzing market charts.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Spline Full-Page Fixed Background */}
      <div className="fixed inset-0 w-screen h-screen z-0">
        <Spline
          scene="https://prod.spline.design/Zkl1fjrHtunP9HZZ/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient Overlay for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/30 via-background/50 to-background/80" />

      {/* All Page Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex items-end pb-20 md:pb-32 pt-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-5xl"
            >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6">
                <AnimatedText text="I'm Elfan Tinar." variant="wave" glowOnHover />
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-mono max-w-3xl">
                <span className="text-primary">18 Years Old.</span>{" "}
                <span className="text-primary">5 Years Experience</span> in Graphic Designer, 
                creative bridging the gap between design, technology, and artificial intelligence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="py-20 md:py-32 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={profileImage}
                    alt="Elfan Tinar"
                    className="w-full h-full object-cover"
                  />
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
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
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

                {/* Working image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative aspect-video overflow-hidden rounded-xl mt-8"
                >
                  <img
                    src={workingImage}
                    alt="Elfan working"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 md:py-32 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
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
                  {creativeSkills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      percentage={skill.percentage}
                      delay={index}
                    />
                  ))}
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
                  {devSkills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      percentage={skill.percentage}
                      description={skill.description}
                      delay={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialized Expertise */}
        <section className="py-20 md:py-32 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-mono text-xs text-primary tracking-widest uppercase">
                // Specialized Expertise
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
                Areas of Focus
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {expertise.map((item, index) => (
                <ExpertiseCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  items={item.items}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Me */}
        <section className="py-20 md:py-32 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-mono text-xs text-primary tracking-widest uppercase">
                // Soft Skills
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
                Why Choose Me
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {softSkills.map((skill, index) => (
                <WhyChooseCard
                  key={skill.title}
                  icon={skill.icon}
                  title={skill.title}
                  description={skill.description}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default About;
