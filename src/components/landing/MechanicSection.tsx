import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, ToggleRight, Upload, Star, Clock, CreditCard } from "@/components/icons/AppIcons";

const MechanicSection = () => {
  const benefits = [
    { icon: Clock, title: "Flexible Hours", description: "Work when you want, accept jobs that fit your schedule" },
    { icon: CreditCard, title: "Weekly Payouts", description: "Get paid fast with secure, reliable payment processing" },
    { icon: Star, title: "Build Reputation", description: "Grow your business through ratings and reviews" },
  ];

  return (
    <section id="mechanics" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Registration Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative bg-card border border-border rounded-3xl p-6 max-w-md mx-auto">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">👨‍🔧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Join as Mechanic</h4>
                  <p className="text-sm text-muted-foreground">Complete your profile</p>
                </div>
              </div>

              {/* Form Fields Preview */}
              <div className="space-y-4">
                <div className="bg-secondary rounded-xl p-3">
                  <label className="text-xs text-muted-foreground">Business Name</label>
                  <p className="text-foreground font-medium">Mike's Auto Repair</p>
                </div>

                {/* Certifications Upload */}
                <div className="bg-secondary rounded-xl p-4 border-2 border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload Certifications</p>
                      <p className="text-xs text-muted-foreground">ASE, State License, Insurance</p>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="text-xs text-muted-foreground block mb-2">Select Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {["Engine", "Tires", "Electrical", "Brakes", "AC/Heating"].map((specialty, i) => (
                      <span
                        key={specialty}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          i < 3
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between bg-secondary rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <ToggleRight className="w-5 h-5 text-success" />
                    <span className="font-medium text-foreground">Available for Jobs</span>
                  </div>
                  <div className="w-12 h-6 bg-success rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button variant="hero" className="w-full mt-6">
                <Award className="w-5 h-5" />
                Complete Registration
              </Button>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full -z-10" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">For Mechanics</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Grow Your Business With Us
            </h2>
            <p className="text-muted-foreground mb-8">
              Join our network of certified mechanics. Set your own schedule, choose your 
              specialties, and connect with customers who need your expertise.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="outline" size="lg">
              Start Earning Today
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MechanicSection;
