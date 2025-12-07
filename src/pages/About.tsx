import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Globe, Server, Database } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're committed to making food ordering accessible and efficient for everyone.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Leveraging cutting-edge AI to create seamless ordering experiences.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description: "Every feature we build starts with understanding restaurant and customer needs.",
  },
  {
    icon: Globe,
    title: "Globally Accessible",
    description: "Breaking language barriers with multilingual support for diverse communities.",
  },
];

const techStack = [
  { name: "FastAPI", description: "High-performance Python backend" },
  { name: "MongoDB", description: "Flexible document database" },
  { name: "GreenAPI", description: "WhatsApp Business integration" },
  { name: "Gemini AI", description: "Advanced language understanding" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Making Food Ordering{" "}
              <span className="text-primary">Effortless</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              EZORDER was born from a simple idea: ordering food should be as easy as 
              sending a message to a friend. We combine the power of AI with the familiarity 
              of WhatsApp to create a seamless ordering experience.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                Our Mission
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                Empowering Restaurants Through Technology
              </h2>
              <p className="mt-6 text-muted-foreground">
                We believe every restaurant, from local favorites to growing chains, deserves 
                access to powerful ordering technology. EZORDER eliminates the need for 
                expensive apps or complex integrations.
              </p>
              <p className="mt-4 text-muted-foreground">
                Our AI-powered WhatsApp bot understands natural language in multiple languages, 
                making it easy for customers to order exactly what they want. For restaurant 
                owners, our dashboard provides real-time insights and complete order management.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {values.map((value, index) => (
                <div key={value.title} className="card-elevated p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-heading font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-sm font-semibold uppercase tracking-wider text-primary"
            >
              Technology
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl"
            >
              Built with Modern Architecture
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground"
            >
              We use industry-leading technologies to ensure reliability, speed, and scalability.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {techStack.map((tech) => (
              <div key={tech.name} className="card-elevated p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-heading font-semibold text-foreground">
                  {tech.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Want to Learn More?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Have questions about EZORDER or want to discuss how we can help your restaurant? 
              We'd love to hear from you.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-button bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
