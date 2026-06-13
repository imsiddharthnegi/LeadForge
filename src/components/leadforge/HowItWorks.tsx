import { motion } from "framer-motion";
import { Search, Zap, Download, ArrowRight } from "lucide-react";

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
    emphasis: true,
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

  const scrollToInput = () => {
    const inputPanel = document.querySelector("[data-input-panel]") || document.querySelector("form");
    if (inputPanel) {
      inputPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-12 pb-8 px-6 lg:px-10">
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
        className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {/* Horizontal connector line — desktop only */}
        <div
          className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: "calc(100% / 6)",
            right: "calc(100% / 6)",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.18) 15%, rgba(34,211,238,0.18) 85%, transparent 100%)",
          }}
        >
          {/* Animated flow dots */}
          {[0, 1, 2].map((dotIdx) => (
            <motion.div
              key={dotIdx}
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#22d3ee",
                boxShadow: "0 0 8px rgba(34,211,238,0.5)",
              }}
              animate={{
                left: ["0%", "100%"],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: dotIdx * 1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {steps.map((step, i) => {
          const Icon = step.icon;
          const isEmphasis = step.emphasis;
          return (
            <motion.div key={i} variants={item}>
              <div
                className="group relative glass-card rounded-xl p-6 h-full text-center transition-all duration-300"
                style={{
                  border: isEmphasis
                    ? "1px solid rgba(34,211,238,0.20)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isEmphasis
                    ? "0 4px 16px rgba(0,0,0,0.4), 0 0 24px -4px rgba(34,211,238,0.12), inset 0 1px 0 0 hsl(0 0% 100% / 0.06)"
                    : undefined,
                }}
              >
                {/* Number badge — teal monochromatic gradient */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: "linear-gradient(135deg, #22d3ee, #67e8f9)",
                    color: "#0d1117",
                    boxShadow: "0 4px 12px rgba(34,211,238,0.3)",
                  }}
                >
                  {i + 1}
                </div>

                {/* Icon — larger container, teal tinted bg */}
                <div
                  className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl group-hover:scale-110 transition-all duration-300"
                  style={{
                    background: "rgba(34,211,238,0.10)",
                    border: "1px solid rgba(34,211,238,0.25)",
                    color: "#22d3ee",
                  }}
                >
                  <Icon size={22} />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-[hsl(var(--text-secondary))]">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        viewport={{ once: true }}
        className="flex justify-center mt-8"
      >
        <motion.button
          onClick={scrollToInput}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-6 h-11 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: "#22d3ee",
            color: "#0d1117",
            boxShadow: "0 8px 24px -6px rgba(34,211,238,0.4)",
          }}
        >
          Start Generating Leads
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </section>
  );
}
