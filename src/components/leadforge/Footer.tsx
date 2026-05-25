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
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-xs text-[hsl(var(--text-muted))] font-mono tracking-wide">
            LeadForge · Powered by Groq AI ·{" "}
            <a
              href="https://github.com/imsiddharthnegi/LeadForge"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-brand/70 hover:text-cyan-brand transition-colors"
            >
              <Github size={12} />
              GitHub
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
