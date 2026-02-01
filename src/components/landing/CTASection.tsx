import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Wrench } from "@/components/icons/AppIcons";

const CTASection = () => {
  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Hit the Road with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">Confidence?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Download MechGo today and never worry about breakdowns again. 
            Help is always just a tap away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl">
              <MapPin className="w-5 h-5" />
              Get Help Now
            </Button>
            <Button variant="outline" size="xl">
              <Wrench className="w-5 h-5" />
              Become a Mechanic
            </Button>
          </div>

          {/* App Store Badges */}
          <div className="flex gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-card border border-border rounded-xl px-6 py-3 flex items-center gap-3 cursor-pointer"
            >
              <div className="text-2xl">🍎</div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Download on the</p>
                <p className="text-sm font-semibold text-foreground">App Store</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-card border border-border rounded-xl px-6 py-3 flex items-center gap-3 cursor-pointer"
            >
              <div className="text-2xl">▶️</div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">Get it on</p>
                <p className="text-sm font-semibold text-foreground">Google Play</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
