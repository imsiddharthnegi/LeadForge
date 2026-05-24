import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function HeroStrip() {
  return (
    <header className="relative z-10 px-4 sm:px-6 lg:px-10 py-8 border-b border-white/[0.07]">
      <div className="flex items-start justify-between gap-6">
        {/* Left: Title + Subtitle */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight"
          >
            Lead Generation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-2 text-base text-[hsl(var(--text-secondary))]"
          >
            Generate enriched B2B leads powered by AI
          </motion.p>
        </div>

        {/* Right: New Session Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex items-center gap-2 px-4 h-10 rounded-input bg-cyan-brand/10 hover:bg-cyan-brand/15 border border-cyan-brand/30 text-cyan-brand font-semibold text-sm transition-colors shrink-0"
        >
          <Plus size={16} />
          <span>New Session</span>
        </motion.button>
      </div>
    </header>
  );
}
