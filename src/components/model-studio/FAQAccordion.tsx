import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "[FAQ 1 QUESTION]",
    answer: "[FAQ 1 ANSWER]",
  },
  {
    question: "[FAQ 2 QUESTION]",
    answer: "[FAQ 2 ANSWER]",
  },
  {
    question: "[FAQ 3 QUESTION]",
    answer: "[FAQ 3 ANSWER]",
  },
  {
    question: "[FAQ 4 QUESTION]",
    answer: "[FAQ 4 ANSWER]",
  },
  {
    question: "[FAQ 5 QUESTION]",
    answer: "[FAQ 5 ANSWER]",
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
