import { motion } from "framer-motion";

export function LeadCardSkeleton({ index }: { index: number }) {
  const shimmerGradient = "linear-gradient(90deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-3)) 50%, hsl(var(--surface-2)) 100%)";

  const SkeletonLine = ({ width = "w-full", height = "h-4", delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay }}
      className={`rounded-card ${width} ${height} bg-gradient-to-r`}
      style={{ backgroundImage: shimmerGradient, backgroundSize: "200% 100%" }}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-[hsl(var(--surface-2))] rounded-card border border-white/[0.07] p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-2/3" height="h-5" delay={0} />
          <SkeletonLine width="w-1/3" height="h-4" delay={0.1} />
        </div>
        <SkeletonLine width="w-16" height="h-7" delay={0.2} />
      </div>

      {/* Contact info row */}
      <div className="flex gap-2 items-center">
        <SkeletonLine width="w-32" height="h-4" delay={0.15} />
        <span className="text-[hsl(var(--text-muted))]">·</span>
        <SkeletonLine width="w-24" height="h-4" delay={0.2} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07]" />

      {/* Contact details */}
      <div className="space-y-3">
        <SkeletonLine width="w-full" height="h-4" delay={0.25} />
        <SkeletonLine width="w-full" height="h-4" delay={0.3} />
      </div>

      {/* Outreach hook */}
      <div className="bg-[hsl(var(--surface-3))] rounded-card p-4 space-y-2">
        <SkeletonLine width="w-3/4" height="h-4" delay={0.35} />
        <SkeletonLine width="w-full" height="h-4" delay={0.4} />
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {[0, 1, 2].map((i) => (
          <SkeletonLine key={i} width="w-20" height="h-6" delay={0.4 + i * 0.05} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
        <SkeletonLine width="w-24" height="h-3" delay={0.55} />
        <SkeletonLine width="w-8" height="h-8" delay={0.6} />
      </div>
    </motion.div>
  );
}
