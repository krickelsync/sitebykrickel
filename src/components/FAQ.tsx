import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "./shared/SectionHeader";

const faqs = [
  {
    question: "Do I get the theme file?",
    answer: "No, this is a Setup Service. We install everything directly on your store via Collaborator Access. You get a fully functional, ready-to-sell store without dealing with any code or theme files.",
  },
  {
    question: "Can I use my own 3D logo?",
    answer: "Yes, for the Ultimate Package, you provide the .glb file and we'll integrate it with auto-rotation and interactive features. We recommend keeping the file size under 5MB for optimal performance.",
  },
  {
    question: "How does the 48-hour delivery work?",
    answer: "Once you provide your Shopify store access and brand assets, we begin immediately. Standard packages are completed in 24 hours, while Ultimate packages (with more customizations) take 2-3 days.",
  },
  {
    question: "What if I need changes after delivery?",
    answer: "Standard Drop includes 1 minor revision. Ultimate Hype includes 3 major revisions. Additional revisions can be purchased separately. VIP Priority support gets faster response times.",
  },
  {
    question: "Do you provide the music for the Global Music Player?",
    answer: "You provide the audio files (royalty-free recommended). We set up the glass UI player with equalizer visualization, volume controls, and continuous playback across your entire store.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-24 md:py-32 border-t border-muted">
      <div className="container px-4">
        <SectionHeader
          eyebrow="FAQ"
          title="QUESTIONS?"
          accent="WE GOT ANSWERS."
        />

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.01 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="font-display text-left text-base md:text-lg uppercase tracking-tight hover:text-primary transition-colors py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-mono text-sm text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
