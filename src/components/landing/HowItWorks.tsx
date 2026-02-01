import { motion } from "framer-motion";
import { MapPin, Search, MessageCircle, CheckCircle2 } from "@/components/icons/AppIcons";

const steps = [
  {
    icon: MapPin,
    title: "Share Location",
    description: "Open the app and we'll automatically detect your GPS location, or enter it manually.",
  },
  {
    icon: Search,
    title: "Find Mechanic",
    description: "Browse available mechanics nearby, filter by specialty, and view ratings.",
  },
  {
    icon: MessageCircle,
    title: "Connect & Chat",
    description: "Message your mechanic directly, share photos of the issue, and get a quote.",
  },
  {
    icon: CheckCircle2,
    title: "Get Fixed",
    description: "Track their arrival in real-time and get back on the road fast.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-card/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Help in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting roadside assistance has never been easier. Our streamlined process 
            gets you from stranded to saved in minutes.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-background border border-border rounded-2xl p-6 text-center relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
