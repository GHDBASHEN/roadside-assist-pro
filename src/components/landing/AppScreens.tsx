import { motion } from "framer-motion";
import { Star, MessageCircle, FileText, Clock } from "@/components/icons/AppIcons";

const AppScreens = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">App Preview</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Designed for Simplicity
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Intuitive interfaces for both iOS and Android. Get help with just a few taps.
          </p>
        </motion.div>

        {/* Screens Carousel */}
        <div className="flex gap-6 justify-center items-end flex-wrap">
          {/* Chat Screen */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="w-[200px] md:w-[240px]"
          >
            <PhoneScreen title="Chat">
              <div className="space-y-3 p-3">
                <ChatBubble isUser={false} message="Hi! I can see your location. What seems to be the issue?" />
                <ChatBubble isUser={true} message="My car won't start. I think it's the battery." />
                <ChatBubble isUser={false} message="No problem! I have jumper cables and replacement batteries. I'll be there in 5 mins." />
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 bg-secondary rounded-full px-3 py-2 text-xs text-muted-foreground">
                    Type a message...
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </PhoneScreen>
          </motion.div>

          {/* Main Screen - Larger */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="w-[220px] md:w-[280px]"
          >
            <PhoneScreen title="Find Mechanic" isLarge>
              <div className="h-28 bg-secondary/50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow" />
                </div>
              </div>
              <div className="p-3 space-y-2">
                <MechanicCard name="John's Auto" rating={4.9} distance="2 min" specialty="Engine" />
                <MechanicCard name="Quick Fix" rating={4.7} distance="5 min" specialty="Tires" />
              </div>
            </PhoneScreen>
          </motion.div>

          {/* History Screen */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-[200px] md:w-[240px]"
          >
            <PhoneScreen title="Booking History">
              <div className="p-3 space-y-2">
                <HistoryCard date="Jan 28" service="Battery Jump" price="$45" status="completed" />
                <HistoryCard date="Jan 15" service="Tire Change" price="$65" status="completed" />
                <HistoryCard date="Dec 30" service="Oil Change" price="$85" status="completed" />
                <div className="pt-2 text-center">
                  <button className="text-xs text-primary font-medium">View All History</button>
                </div>
              </div>
            </PhoneScreen>
          </motion.div>

          {/* Reviews Screen */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="w-[200px] md:w-[240px] hidden lg:block"
          >
            <PhoneScreen title="Reviews">
              <div className="p-3 space-y-3">
                <ReviewCard name="Sarah M." rating={5} text="Super fast and professional. Fixed my flat in 10 minutes!" />
                <ReviewCard name="Mike T." rating={5} text="Great communication, fair pricing." />
                <ReviewCard name="Lisa K." rating={4} text="Helpful and friendly service." />
              </div>
            </PhoneScreen>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PhoneScreen = ({ children, title, isLarge = false }: { children: React.ReactNode; title: string; isLarge?: boolean }) => (
  <div className={`bg-card border border-border rounded-[2rem] overflow-hidden shadow-lg ${isLarge ? 'h-[420px]' : 'h-[360px]'}`}>
    {/* Status Bar */}
    <div className="h-8 bg-secondary/50 flex items-center justify-center">
      <div className="w-16 h-1 bg-border rounded-full" />
    </div>
    {/* Header */}
    <div className="h-10 bg-card border-b border-border flex items-center justify-center">
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
    {/* Content */}
    <div className="overflow-hidden">
      {children}
    </div>
  </div>
);

const ChatBubble = ({ isUser, message }: { isUser: boolean; message: string }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${
      isUser 
        ? 'bg-primary text-primary-foreground rounded-br-sm' 
        : 'bg-secondary text-foreground rounded-bl-sm'
    }`}>
      {message}
    </div>
  </div>
);

const MechanicCard = ({ name, rating, distance, specialty }: { name: string; rating: number; distance: string; specialty: string }) => (
  <div className="bg-secondary rounded-xl p-2 flex items-center gap-2">
    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
      👨‍🔧
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-foreground">{name}</p>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Star className="w-3 h-3 text-primary fill-primary" />
        <span>{rating}</span>
        <span>•</span>
        <span>{distance}</span>
      </div>
    </div>
    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{specialty}</span>
  </div>
);

const HistoryCard = ({ date, service, price, status }: { date: string; service: string; price: string; status: string }) => (
  <div className="bg-secondary rounded-xl p-2 flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
      <FileText className="w-4 h-4 text-success" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-foreground">{service}</p>
      <p className="text-[10px] text-muted-foreground">{date}</p>
    </div>
    <div className="text-right">
      <p className="text-xs font-medium text-foreground">{price}</p>
      <p className="text-[10px] text-success capitalize">{status}</p>
    </div>
  </div>
);

const ReviewCard = ({ name, rating, text }: { name: string; rating: number; text: string }) => (
  <div className="bg-secondary rounded-xl p-2">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded-full bg-primary/20" />
      <span className="text-xs font-medium text-foreground">{name}</span>
      <div className="flex ml-auto">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-3 h-3 text-primary fill-primary" />
        ))}
      </div>
    </div>
    <p className="text-[10px] text-muted-foreground">{text}</p>
  </div>
);

export default AppScreens;
