import { motion } from "framer-motion";
import { PreviewLeadCard } from "./PreviewLeadCard";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative w-full flex flex-col gap-6"
    >
      <PreviewLeadCard />
    </motion.div>
  );
}
