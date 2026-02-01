import { motion } from "framer-motion";
import { Navigation, MessageCircle, FileText, Star, Bell, Shield } from "@/components/icons/AppIcons";

const features = [
  {
    icon: Navigation,
    title: "Real-Time GPS Tracking",
    description: "Watch your mechanic approach in real-time. Know exactly when help will arrive with live location updates.",
    highlight: true,
  },
  {
    icon: MessageCircle,
    title: "In-App Chat",
    description: "Communicate directly with your mechanic. Share photos, describe issues, and coordinate seamlessly.",
  },
  {
    icon: FileText,
    title: "Booking History",
    description: "Access all past repairs, digital receipts, and vehicle health notes in one organized place.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Read honest reviews from other users. Help the community by rating your experience.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get updates on mechanic arrival, service completion, and maintenance reminders.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Pay safely through the app with encrypted transactions. No cash needed.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-card/50 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make roadside assistance simple, transparent, and reliable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                feature.highlight
                  ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30"
                  : "bg-background border-border hover:border-primary/30"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                feature.highlight ? "bg-primary" : "bg-primary/10 group-hover:bg-primary/20"
              } transition-colors`}>
                <feature.icon className={`w-6 h-6 ${
                  feature.highlight ? "text-primary-foreground" : "text-primary"
                }`} />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>

              {feature.highlight && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                    Popular
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
