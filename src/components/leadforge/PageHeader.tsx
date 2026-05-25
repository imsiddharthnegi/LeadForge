import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageHeader({ eyebrow, title, subtitle, right }: {
  eyebrow: string; title: string; subtitle?: string; right?: ReactNode;
}) {
  return (
    <header className="px-6 lg:px-10 pt-4 pb-3 flex items-end justify-between gap-6 flex-wrap">
      <div>
        <motion.span
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.25em] text-cyan-brand uppercase"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="font-display text-3xl md:text-4xl font-semibold tracking-tight mt-2"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="text-sm text-[hsl(var(--text-secondary))] mt-2 max-w-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {right}
    </header>
  );
}
