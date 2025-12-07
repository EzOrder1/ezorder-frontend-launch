import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Building2, User, Mail, Phone, MapPin, Clock, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const cuisineOptions = [
  "Pakistani",
  "Chinese",
  "Fast Food",
  "BBQ",
  "Desi",
  "Continental",
  "Italian",
  "Indian",
  "Middle Eastern",
  "Other",
];

const timezones = [
  "Asia/Karachi (PKT)",
  "Asia/Dubai (GST)",
  "Europe/London (GMT)",
  "America/New_York (EST)",
];

const GetStarted = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    cuisine: "",
    openingHours: "",
    closingHours: "",
    timezone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Logo must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.businessName.trim() || !formData.ownerName.trim() || 
        !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // POST /api/restaurant/register with formData and logoFile
      
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-16 lg:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-lg text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">
                Registration Successful!
              </h1>
              <p className="mt-4 text-muted-foreground">
                Thank you for registering with EZORDER. We've sent a verification email to{" "}
                <strong className="text-foreground">{formData.email}</strong>.
              </p>
              <div className="mt-6 card-elevated p-6">
                <h3 className="font-heading font-semibold text-foreground">Next Steps:</h3>
                <ol className="mt-4 space-y-3 text-left text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      1
                    </span>
                    Check your email and click the verification link
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    Set up your menu items in the admin dashboard
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      3
                    </span>
                    Share your WhatsApp ordering link with customers
                  </li>
                </ol>
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/login">Go to Admin Login</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

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
              Get Started with{" "}
              <span className="text-primary">EZORDER</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              Register your restaurant and start accepting orders via WhatsApp today. 
              Setup takes less than 5 minutes.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-12 max-w-2xl"
          >
            <div className="card-elevated p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="font-heading font-semibold text-foreground">
                      Business Information
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Your Restaurant Name"
                        className="mt-1.5"
                        maxLength={100}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cuisine">Cuisine Type</Label>
                      <Select
                        value={formData.cuisine}
                        onValueChange={(value) => handleSelectChange("cuisine", value)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineOptions.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Full restaurant address"
                      className="mt-1.5 min-h-[80px]"
                      maxLength={300}
                      required
                    />
                  </div>
                </div>

                {/* Owner Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="font-heading font-semibold text-foreground">
                      Owner Information
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Full name"
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
                  </div>

                  <div>
                    <Label htmlFor="phone">WhatsApp Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 123 4567"
                      className="mt-1.5"
                      maxLength={20}
                      required
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      This number will receive order notifications
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="font-heading font-semibold text-foreground">
                      Operating Hours
                    </h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="openingHours">Opening Time</Label>
                      <Input
                        id="openingHours"
                        name="openingHours"
                        type="time"
                        value={formData.openingHours}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="closingHours">Closing Time</Label>
                      <Input
                        id="closingHours"
                        name="closingHours"
                        type="time"
                        value={formData.closingHours}
                        onChange={handleChange}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => handleSelectChange("timezone", value)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <h2 className="font-heading font-semibold text-foreground">
                      Logo (Optional)
                    </h2>
                  </div>

                  <div>
                    <Label htmlFor="logo">Upload Logo</Label>
                    <div className="mt-1.5 flex items-center gap-4">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="cursor-pointer"
                      />
                      {logoFile && (
                        <span className="text-sm text-muted-foreground">
                          {logoFile.name}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Max 5MB. Recommended: Square image, at least 200x200px
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Restaurant Account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/admin/login" className="font-medium text-primary hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default GetStarted;
