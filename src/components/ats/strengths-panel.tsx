"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ATSStrength } from "@/types/ats-report"
import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function StrengthsPanel({ strengths }: { strengths: ATSStrength[] }) {
  if (strengths.length === 0) return null

  const impactColor = {
    high: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/10",
    medium: "text-[var(--neon-blue)] border-[var(--neon-blue)]/20 bg-[var(--neon-blue)]/10",
    low: "text-white/50 border-white/10 bg-white/5",
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } 
    }
  }

  return (
    <GlassPanel hover className="p-7 group">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[var(--neon-cyan)]" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Signal Strengths</h3>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {strengths.map((s, i) => (
          <motion.div key={i} variants={item} className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/[0.02] transition-colors group/item">
            <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded border shrink-0 mt-0.5 tracking-wider ${impactColor[s.impact]}`}>
              {s.impact} Rank
            </span>
            <div>
              <span className="text-xs text-[var(--neon-cyan)] font-bold uppercase tracking-wider block mb-1 group-hover/item:text-white transition-colors">{s.category}</span>
              <p className="text-xs text-white/50 leading-relaxed font-medium group-hover/item:text-white/80 transition-colors">{s.message}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </GlassPanel>
  )
}
