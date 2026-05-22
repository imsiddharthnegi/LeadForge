import { motion } from "framer-motion";

const shimmerAnimation = {
  initial: { backgroundPosition: "0% 0%" },
  animate: { backgroundPosition: "100% 100%" },
};

export function LeadCardSkeleton({ index }: { index: number }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: index * 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const shimmerStyle = {
    backgroundImage: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.08) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative glass rounded-xl p-5 lg:p-6"
    >
      {/* Left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-white/20 animate-pulse" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <motion.div
              variants={item}
              className="h-6 bg-white/10 rounded-md w-3/4 animate-pulse"
              style={shimmerStyle}
            />
            <motion.div
              variants={item}
              className="h-4 bg-white/5 rounded-md w-1/2 animate-pulse"
              style={shimmerStyle}
            />
          </div>
          <motion.div
            variants={item}
            className="h-7 w-20 bg-white/10 rounded-full shrink-0 animate-pulse"
            style={shimmerStyle}
          />
        </div>

        {/* Links row */}
        <div className="flex gap-2">
          <motion.div
            variants={item}
            className="h-6 w-24 bg-white/5 rounded-md animate-pulse"
            style={shimmerStyle}
          />
          <motion.div
            variants={item}
            className="h-6 w-6 bg-white/5 rounded-md animate-pulse"
            style={shimmerStyle}
          />
        </div>

        {/* Contact info container skeleton */}
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
          <motion.div
            variants={item}
            className="h-9 bg-white/5 rounded-md animate-pulse"
            style={shimmerStyle}
          />
          <motion.div
            variants={item}
            className="h-9 bg-white/5 rounded-md animate-pulse"
            style={shimmerStyle}
          />
        </div>

        {/* AI content section skeleton */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-violet-brand/[0.08] to-cyan-brand/[0.08] border border-white/[0.08] space-y-3">
          <div>
            <motion.div
              variants={item}
              className="h-3 w-16 bg-white/10 rounded-md animate-pulse mb-2"
              style={shimmerStyle}
            />
            <motion.div
              variants={item}
              className="h-4 bg-white/5 rounded-md w-full animate-pulse"
              style={shimmerStyle}
            />
          </div>
          <div>
            <motion.div
              variants={item}
              className="h-3 w-20 bg-white/10 rounded-md animate-pulse mb-2"
              style={shimmerStyle}
            />
            <motion.div
              variants={item}
              className="h-4 bg-white/5 rounded-md w-full animate-pulse"
              style={shimmerStyle}
            />
            <motion.div
              variants={item}
              className="h-4 bg-white/5 rounded-md w-4/5 animate-pulse mt-2"
              style={shimmerStyle}
            />
          </div>
        </div>

        {/* Tech stack skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={item}
              className="h-6 w-16 bg-white/5 rounded-md animate-pulse"
              style={shimmerStyle}
            />
          ))}
        </div>

        {/* Bottom bar skeleton */}
        <motion.div
          variants={item}
          className="flex items-center justify-between pt-3 border-t border-white/[0.05]"
        >
          <motion.div
            className="h-3 w-24 bg-white/5 rounded-md animate-pulse"
            style={shimmerStyle}
          />
          <motion.div className="h-8 w-8 bg-white/5 rounded-md animate-pulse" style={shimmerStyle} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
