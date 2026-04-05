"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ATSWeakness } from "@/types/ats-report"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export function WeaknessesPanel({ weaknesses }: { weaknesses: ATSWeakness[] }) {
  if (weaknesses.length === 0) return null

  const severityColor = {
    critical: "text-red-400 border-red-400/20 bg-red-400/10",
    moderate: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    minor: "text-white/50 border-white/10 bg-white/5",
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
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
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Signal Vulnerabilities</h3>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {weaknesses.map((w, i) => (
          <motion.div key={i} variants={item} className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-white/[0.02] transition-colors group/item">
            <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded border shrink-0 mt-0.5 tracking-wider ${severityColor[w.severity]}`}>
              {w.severity} Defect
            </span>
            <div>
              <span className="text-xs text-red-300 font-bold uppercase tracking-wider block mb-1 group-hover/item:text-white transition-colors">{w.category}</span>
              <p className="text-xs text-white/50 leading-relaxed font-medium group-hover/item:text-white/80 transition-colors">{w.message}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </GlassPanel>
  )
}
