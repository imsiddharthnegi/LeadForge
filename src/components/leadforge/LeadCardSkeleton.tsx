import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative glass rounded-xl p-5 lg:p-6"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Header skeleton */}
        <div className="flex items-start gap-4">
          <motion.div
            variants={item}
            className="w-12 h-12 rounded-xl shrink-0 bg-gradient-to-br from-cyan-brand/20 to-violet-brand/20 animate-pulse"
          />
          <div className="flex-1 space-y-2 min-w-0">
            <motion.div variants={item} className="h-6 bg-white/10 rounded-md w-3/4 animate-pulse" />
            <motion.div variants={item} className="h-4 bg-white/5 rounded-md w-1/2 animate-pulse" />
          </div>
          <motion.div variants={item} className="h-7 w-20 bg-white/10 rounded-full shrink-0 animate-pulse" />
        </div>

        {/* Contact buttons skeleton */}
        <div className="flex flex-wrap gap-2">
          <motion.div variants={item} className="h-7 w-32 bg-white/5 rounded-md animate-pulse" />
          <motion.div variants={item} className="h-7 w-28 bg-white/5 rounded-md animate-pulse" />
        </div>

        {/* Meta info skeleton */}
        <div className="space-y-2">
          <motion.div variants={item} className="h-4 bg-white/5 rounded-md w-full animate-pulse" />
          <motion.div variants={item} className="h-4 bg-white/5 rounded-md w-4/5 animate-pulse" />
        </div>

        {/* Tech stack skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={item}
              className="h-6 w-16 bg-white/5 rounded-md animate-pulse"
            />
          ))}
        </div>

        {/* Outreach hook skeleton */}
        <motion.div
          variants={item}
          className="p-4 rounded-lg bg-gradient-to-br from-cyan-brand/[0.03] to-violet-brand/[0.03] space-y-2"
        >
          <motion.div className="h-4 bg-white/5 rounded-md w-full animate-pulse" />
          <motion.div className="h-4 bg-white/5 rounded-md w-4/5 animate-pulse" />
        </motion.div>

        {/* Bottom actions skeleton */}
        <motion.div variants={item} className="flex items-center justify-between">
          <motion.div className="h-4 bg-white/5 rounded-md w-24 animate-pulse" />
          <div className="flex items-center gap-2">
            <motion.div className="h-8 w-24 bg-white/5 rounded-md animate-pulse" />
            <motion.div className="h-8 w-8 bg-white/5 rounded-md animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
