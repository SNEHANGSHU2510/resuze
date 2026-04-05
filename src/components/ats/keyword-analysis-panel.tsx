"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { KeywordAnalysis } from "@/types/ats-report"
import { Check, X } from "lucide-react"
import { motion } from "framer-motion"

export function KeywordAnalysisPanel({ keywords }: { keywords: KeywordAnalysis }) {
  
  // Premium restraint: faster staggers, buttery bezier easing instead of bouncy springs
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.1 }
    }
  }

  const tag = {
    hidden: { opacity: 0, y: 4 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const } 
    }
  }

  return (
    <GlassPanel hover className="p-7">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.04]">
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Keyword Telemetry</h3>
        <span className="text-sm font-bold tracking-widest text-[var(--neon-cyan)] px-3 py-1 rounded-full bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">{keywords.keyword_coverage_percent}% coverage</span>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {keywords.matched_keywords.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-cyan)] font-bold block mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] opacity-80" />
              Verified Core Nodes ({keywords.matched_keywords.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {keywords.matched_keywords.map((kw, i) => (
                <motion.span 
                  variants={tag} 
                  whileHover={{ y: -1, transition: { duration: 0.2 } }} 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 rounded-xl cursor-default transition-all hover:bg-[var(--neon-cyan)]/15 hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_2px_8px_rgba(52,211,153,0.15)]"
                >
                  <Check className="w-3.5 h-3.5 opacity-80" /> {kw}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {keywords.missing_keywords.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold block mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-50" />
              Missing Core Nodes ({keywords.missing_keywords.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {keywords.missing_keywords.map((kw, i) => (
                <motion.span 
                  variants={tag} 
                  whileHover={{ y: -1, transition: { duration: 0.2 } }} 
                  key={i} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-400/5 text-red-300 border border-red-400/10 rounded-xl cursor-default transition-all hover:bg-red-400/10 hover:border-red-400/30"
                >
                  <X className="w-3.5 h-3.5 opacity-80" /> {kw}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {keywords.matched_tools.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-blue)] font-bold block mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-blue)] opacity-80" />
              Verified Architecture ({keywords.matched_tools.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {keywords.matched_tools.map((kw, i) => (
                <motion.span 
                  variants={tag} 
                  whileHover={{ y: -1, transition: { duration: 0.2 } }} 
                  key={i} 
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] border border-[var(--neon-blue)]/20 rounded-xl cursor-default transition-all hover:bg-[var(--neon-blue)]/15 hover:border-[var(--neon-blue)]/40 hover:shadow-[0_2px_8px_rgba(56,189,248,0.15)]"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {keywords.missing_tools.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold block mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-50" />
              Missing Architecture ({keywords.missing_tools.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {keywords.missing_tools.map((kw, i) => (
                <motion.span 
                  variants={tag} 
                  whileHover={{ y: -1, transition: { duration: 0.2 } }} 
                  key={i} 
                  className="px-3 py-1.5 text-xs font-medium bg-amber-400/5 text-amber-300 border border-amber-400/10 rounded-xl cursor-default transition-all hover:bg-amber-400/10 hover:border-amber-400/30"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </GlassPanel>
  )
}
