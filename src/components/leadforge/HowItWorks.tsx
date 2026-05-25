import { motion } from "framer-motion";
import { Search, Zap, Download } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Niche",
    description: "Specify your target market and parameters",
  },
  {
    icon: Zap,
    title: "AI Enriches",
    description: "Groq AI analyzes and scores leads intelligently",
  },
  {
    icon: Download,
    title: "Export to CRM",
    description: "Download CSV or copy outreach hooks instantly",
  },
];

export function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
  };

  return (
    <section className="py-16 px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight mb-3">How It Works</h2>
        <p className="text-[hsl(var(--text-secondary))] max-w-2xl mx-auto">
          Generate enriched B2B leads in three simple steps using AI-powered intelligence
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={i} variants={item}>
              <div className="group relative glass-card rounded-xl p-6 h-full text-center hover:border-cyan-brand/50 transition-all duration-300">
                {/* Number indicator */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-brand to-violet-brand flex items-center justify-center font-bold text-black text-sm">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-brand/10 border border-cyan-brand/30 text-cyan-brand group-hover:scale-110 group-hover:bg-cyan-brand/20 transition-all duration-300">
                  <Icon size={20} />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-[hsl(var(--text-secondary))]">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
