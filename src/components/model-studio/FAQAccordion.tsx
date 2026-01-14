import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Do I need face references?",
    answer: "No — optional for consistent models.",
  },
  {
    question: "How many uploads?",
    answer: "Up to 4 product images.",
  },
  {
    question: "How many outputs?",
    answer: "Choose 1–6 each time.",
  },
  {
    question: "For social & marketplaces?",
    answer: "Yes — presets & ready ratios.",
  },
  {
    question: "Bad results?",
    answer: "Try another angle or preset.",
  },
  {
    question: "Safe to use?",
    answer: "Use your own images — commercial use okay.",
  },
];

interface FAQAccordionProps {
  onCtaClick?: () => void;
}

const FAQAccordion = ({ onCtaClick }: FAQAccordionProps) => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-white/5 rounded-xl bg-card/40 backdrop-blur-sm px-5 md:px-6 data-[state=open]:border-primary/20 transition-colors duration-200"
            >
              <AccordionTrigger className="text-left text-sm md:text-base font-medium text-foreground hover:no-underline py-4 md:py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 md:pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* CTA after FAQ */}
      {onCtaClick && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Button
            onClick={onCtaClick}
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            Still have questions? Get Access
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FAQAccordion;
