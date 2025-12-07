import { motion } from "framer-motion";
import { UtensilsCrossed, MessageCircle, Bell } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Browse Menu",
    description: "Customers view your digital menu through a simple link or QR code. Easy access from anywhere.",
    icon: UtensilsCrossed,
  },
  {
    step: 2,
    title: "Order on WhatsApp",
    description: "Place orders via text or voice message in any supported language. AI handles the conversation naturally.",
    icon: MessageCircle,
  },
  {
    step: 3,
    title: "Dashboard Notifies",
    description: "Receive instant notifications on your admin dashboard. Manage orders and track everything in real-time.",
    icon: Bell,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted py-16 lg:py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-sm font-semibold uppercase tracking-wider text-primary"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Simple 3-Step Ordering
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Get started in minutes. No complex setup or technical knowledge required.
          </motion.p>
        </div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute left-1/2 top-16 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-primary via-secondary to-primary lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Step number */}
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary font-heading text-2xl font-bold text-primary-foreground shadow-glow-primary">
                  {item.step}
                </div>

                {/* Card */}
                <div className="mt-8 card-elevated p-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
