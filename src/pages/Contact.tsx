import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SUPPORT_EMAIL = "support@ezorder.pk";
const WHATSAPP_BUSINESS = "923001234567";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // POST /api/contact with formData
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Get in <span className="text-primary">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Have questions about EZORDER? We're here to help. Reach out through any of the channels below.
            </motion.p>
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Contact Information
                </h2>
                <p className="mt-2 text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Email</h3>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${WHATSAPP_BUSINESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +92 300 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-elevated p-6 sm:p-8"
            >
              <h2 className="font-heading text-xl font-bold text-foreground">
                Send us a Message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill out the form below and we'll get back to you.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Honeypot field - hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-full opacity-0"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="mt-1.5"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="mt-1.5"
                    maxLength={255}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 123 4567"
                    className="mt-1.5"
                    maxLength={20}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="mt-1.5 min-h-[120px]"
                    maxLength={1000}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
