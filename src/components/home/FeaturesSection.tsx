import { motion } from "framer-motion";
import { Bot, Languages, LayoutDashboard, Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Smart WhatsApp Bot",
    description: "Powered by Gemini 2.5 LLM for intelligent, context-aware conversations. Handles complex orders with natural language understanding.",
    color: "primary",
  },
  {
    icon: Languages,
    title: "Multilingual Input",
    description: "Order via text or voice in English, Roman English, or Urdu. Our AI understands your preferred language naturally.",
    color: "secondary",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    description: "Real-time order notifications, menu management, and analytics. Everything you need to run your restaurant efficiently.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    description: "Customers receive immediate order confirmations. No waiting, no confusion. Fast and reliable every time.",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime. Your data and your customers' orders are always safe.",
    color: "primary",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your WhatsApp ordering system never sleeps. Accept orders around the clock without additional staff.",
    color: "secondary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Everything You Need to Accept Orders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            From intelligent AI ordering to real-time dashboards, EZORDER provides a complete solution for modern restaurants.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group card-elevated p-6 transition-all duration-300 hover:shadow-elevated"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  feature.color === "primary"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
