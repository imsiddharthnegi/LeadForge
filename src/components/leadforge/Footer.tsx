import { Github, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="border-t border-white/[0.05] mt-16 py-8"
    >
      <div className="px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--text-muted))] font-mono">
            Built with React · Gemini AI · Vercel
          </p>
          <a
            href="https://github.com/imsiddharthnegi/LeadForge"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.05] transition-all duration-200"
          >
            <Github size={14} />
            View on GitHub
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
