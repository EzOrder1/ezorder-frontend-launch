import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

const WHATSAPP_NUMBER = "923001234567"; // Replace with actual business number
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to place an order.");

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Now Live in Pakistan
            </div>

            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Order Food Fast via{" "}
              <span className="text-primary">WhatsApp</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground lg:text-xl">
              Browse the menu, order by text or voice (English, Roman English, Urdu), 
              get instant confirmation — all over WhatsApp. No app downloads required.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild variant="hero" size="xl">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order Now
                </a>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/get-started" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free for customers
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Voice ordering
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Multilingual
              </div>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl"></div>
              <img
                src={heroIllustration}
                alt="EZORDER WhatsApp food ordering illustration"
                className="relative rounded-2xl"
                width={600}
                height={400}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
        <div className="h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>
      </div>
    </section>
  );
}
