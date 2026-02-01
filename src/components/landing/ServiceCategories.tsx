import { motion } from "framer-motion";
import { AlertTriangle, Wrench, CircleDot, Battery, Fuel, Car } from "@/components/icons/AppIcons";
import type { LucideIcon } from "@/components/icons/AppIcons";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  delay: number;
}

const ServiceCard = ({ icon: Icon, title, description, price, delay }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
  >
    {/* Hover Glow */}
    <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-primary font-bold">{price}</span>
        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
          Learn more →
        </span>
      </div>
    </div>
  </motion.div>
);

const ServiceCategories = () => {
  const services = [
    {
      icon: AlertTriangle,
      title: "Emergency Roadside",
      description: "Immediate assistance for breakdowns, accidents, and urgent mechanical issues.",
      price: "From $45",
    },
    {
      icon: CircleDot,
      title: "Tire Services",
      description: "Flat tire repair, tire changes, and pressure checks delivered to you.",
      price: "From $35",
    },
    {
      icon: Battery,
      title: "Battery & Electrical",
      description: "Jump starts, battery replacement, and electrical diagnostics.",
      price: "From $40",
    },
    {
      icon: Fuel,
      title: "Fuel Delivery",
      description: "Ran out of gas? We'll bring fuel directly to your location.",
      price: "From $25",
    },
    {
      icon: Wrench,
      title: "Full Service Repair",
      description: "Comprehensive repairs including engine, brakes, and transmission.",
      price: "From $75",
    },
    {
      icon: Car,
      title: "Towing Service",
      description: "Professional towing to your preferred repair shop or dealership.",
      price: "From $85",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What We Can Fix
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From quick fixes to complete overhauls, our certified mechanics handle it all. 
            Filter by service type to find exactly what you need.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Filter Pills Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {["All Services", "Emergency", "Full Service", "Specific Parts"].map((filter, index) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceCategories;
