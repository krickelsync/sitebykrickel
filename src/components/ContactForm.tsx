import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });

      if (error) throw error;

      setIsSuccess(true);
      reset();
      toast({
        title: "Message sent! ✨",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or email me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-xl mx-auto shiny-card"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-white/10 p-8 rounded-2xl space-y-6 shadow-[0_0_40px_-15px_hsl(var(--primary)/0.2)]"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Your name"
            className="w-full bg-muted/30 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:bg-muted/40 transition-all"
          />
          {errors.name && (
            <p className="text-xs text-red-400 font-mono">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="your@email.com"
            className="w-full bg-muted/30 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:bg-muted/40 transition-all"
          />
          {errors.email && (
            <p className="text-xs text-red-400 font-mono">{errors.email.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="font-mono text-xs uppercase tracking-wider text-foreground/70">
            Message
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={5}
            placeholder="Tell me about your project..."
            className="w-full bg-muted/30 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-white/20 focus:bg-muted/40 transition-all resize-none"
          />
          {errors.message && (
            <p className="text-xs text-red-400 font-mono">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || isSuccess}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full cta-shiny glass-card px-6 py-4 rounded-xl font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-primary/10 transition-all duration-300 animate-pulse-glow hover-scale-premium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Sent!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
