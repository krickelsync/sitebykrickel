import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I have to upload face references?",
    answer: "No. Use them if you want consistent faces; otherwise focus on product images.",
  },
  {
    question: "How many photos can I upload?",
    answer: "Clothing Product up to 4. Face References up to 4.",
  },
  {
    question: "How many outputs per generate?",
    answer: "You choose 1–6.",
  },
  {
    question: "Can I use these for IG & marketplaces?",
    answer: "Yes — output ratios are ready: 1:1, 4:5, 3:4, 9:16.",
  },
  {
    question: "What if the results aren't perfect?",
    answer: "Try different pose, lens option, angle preset, or background.",
  },
  {
    question: "Is this safe for commercial use?",
    answer: "Use assets you own or have proper rights & follow platform policies.",
  },
];

const FAQAccordion = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
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
  );
};

export default FAQAccordion;
