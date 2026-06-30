import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "./shared/SectionHeader";
import { typography, textSize } from "@/components/ui/typography";

const faqs = [
  { question: "Is this a real Shopify theme?", answer: "Yes. SYNC is a real, fully Shopify 2.0 compatible theme that installs into any Shopify store." },
  { question: "Do I need coding knowledge?", answer: "No. Everything is editable inside Shopify Customize . colors, typography, spacing, and sections." },
  { question: "Can I customize everything?", answer: "Yes. The theme is built block-based, so you can rearrange product pages, homepage, and section layouts freely." },
  { question: "Is it mobile responsive?", answer: "Every layout is built mobile-first and tested across iOS Safari and Android Chrome." },
  { question: "Do I get future updates?", answer: "Yes. Lifetime updates are included with every license." },
  { question: "Can you install the theme for me?", answer: "Yes . choose the Done-for-you Setup package and we'll handle install, branding, and product setup." },
  { question: "Is this good for streetwear and fashion brands?", answer: "Absolutely. The theme is designed for creative fashion, streetwear, and lifestyle brands that need editorial layouts." },
  { question: "Can I use it for multiple stores?", answer: "The single license covers one store. For multiple stores, the All Access tier covers unlimited usage." },
];

const FAQ = () => {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-28 border-t border-muted">
      <div className="container mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="QUESTIONS?"
          accent="WE GOT ANSWERS."
        />

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-2 md:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-4 md:px-6 border border-border/60 rounded-xl bg-transparent"
              >
                <AccordionTrigger className={`font-display text-left uppercase tracking-tight hover:text-primary transition-colors py-4 md:py-6 hover:no-underline ${typography.h3}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground pb-4 md:pb-6 ${typography.body}`}>
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
