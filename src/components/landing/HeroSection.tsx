import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, Shield } from "@/components/icons/AppIcons";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-xl"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-primary/10 blur-xl"
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Trusted by 50,000+ drivers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Roadside Help,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                Anytime, Anywhere
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Connect with certified mechanics in minutes. From flat tires to engine trouble, 
              get professional help delivered to your location with real-time tracking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button variant="hero" size="xl">
                <MapPin className="w-5 h-5" />
                Get Help Now
              </Button>
              <Button variant="outline" size="xl">
                Join as Mechanic
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Zap, label: "5 min avg response" },
                { icon: Shield, label: "Verified mechanics" },
                { icon: MapPin, label: "GPS tracking" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PhoneMockup = () => {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Phone Frame */}
      <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[640px] bg-card rounded-[3rem] border-4 border-border shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl z-10" />
        
        {/* Screen Content */}
        <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden bg-background">
          {/* Status Bar */}
          <div className="h-12 bg-card/50 flex items-center justify-between px-6 pt-2">
            <span className="text-xs text-muted-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-muted-foreground rounded-sm">
                <div className="w-2/3 h-full bg-success rounded-sm" />
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="relative h-48 bg-secondary">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50 Q 30 30 50 50 T 90 50' stroke='%23666' fill='none' stroke-width='2'/%3E%3Cpath d='M50 10 Q 70 30 50 50 T 50 90' stroke='%23666' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover'
              }} />
            </div>
            
            {/* User Location Pin */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full" />
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ripple" />
              </div>
            </motion.div>

            {/* Mechanic Pin */}
            <motion.div
              className="absolute top-1/3 right-1/4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-background">
                <span className="text-xs">🔧</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-4 space-y-4">
            {/* Handle */}
            <div className="w-12 h-1 bg-border rounded-full mx-auto" />
            
            {/* Mechanic Card */}
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                👨‍🔧
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">Mike's Auto</span>
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Online</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>⭐ 4.9</span>
                  <span>•</span>
                  <span>3 min away</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-primary font-bold">$45</span>
                <p className="text-xs text-muted-foreground">Service fee</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-secondary py-3 rounded-xl text-sm font-medium text-foreground">
                💬 Chat
              </button>
              <button className="flex-1 bg-gradient-primary py-3 rounded-xl text-sm font-medium text-primary-foreground">
                Request Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full -z-10" />
    </motion.div>
  );
};

export default HeroSection;
