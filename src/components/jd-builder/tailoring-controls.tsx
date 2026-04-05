"use client"

import * as React from "react"
import { ParsedJobDescription } from "@/types/job-description"
import { TailoringDecision } from "@/types/tailored-resume"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ShieldCheck, Zap, Eye, ArrowUpDown, PenLine, Sparkles, Target } from "lucide-react"
import { motion } from "framer-motion"

interface TailoringControlsProps {
  parsedJD: ParsedJobDescription
  decisions: TailoringDecision[]
  matchScore: number
}

export function TailoringControls({ parsedJD, decisions, matchScore }: TailoringControlsProps) {  
  
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
    <div className="space-y-6">
      {/* Match Score */}
      <GlassPanel hover className="p-6 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[var(--neon-cyan)] to-transparent pointer-events-none group-hover:opacity-20 transition-opacity duration-700 ease-out" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-[var(--neon-cyan)]" />
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">Match Accuracy</span>
            </div>
            <span className="text-4xl font-black text-white tabular-nums tracking-tight">
              {matchScore}
              <span className="text-sm font-bold text-[var(--neon-cyan)] tracking-widest ml-1">%</span>
            </span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-cyan)] shadow-[0_0_10px_rgba(52,211,153,0.3)]"
            />
          </div>
          <p className="text-[11px] text-white/50 uppercase tracking-widest mt-4 font-medium leading-relaxed">
            Computed via semantic overlap and deep keyword vectorization.
          </p>
        </div>
      </GlassPanel>

      {/* Extracted Keywords */}
      <GlassPanel className="p-6 relative">
        <h4 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-6 flex items-center gap-3">
           <Zap className="w-4 h-4 text-[var(--neon-blue)]" /> Detected Vectors
        </h4>
        
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {parsedJD.must_have_skills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-cyan)] font-bold block mb-3 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] opacity-70" /> Core Requirements
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedJD.must_have_skills.map((skill, i) => (
                  <motion.span variants={item} key={i} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 rounded-xl hover:bg-[var(--neon-cyan)]/20 transition-colors">
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {parsedJD.preferred_skills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-blue)] font-bold block mb-3 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-blue)] opacity-50" /> Preferred Attributes
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedJD.preferred_skills.map((skill, i) => (
                  <motion.span variants={item} key={i} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--neon-blue)]/5 text-[var(--neon-blue)] border border-[var(--neon-blue)]/10 rounded-xl hover:bg-[var(--neon-blue)]/10 transition-colors">
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {parsedJD.tools_technologies.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-purple)] font-bold block mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-purple)] opacity-50" /> Technical Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedJD.tools_technologies.map((tool, i) => (
                  <motion.span variants={item} key={i} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--neon-purple)]/5 text-[var(--neon-purple)] border border-[var(--neon-purple)]/10 rounded-xl hover:bg-[var(--neon-purple)]/10 transition-colors">
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </GlassPanel>

      {/* Tailoring Decisions Log */}
      {decisions.length > 0 && (
        <GlassPanel className="p-6">
          <h4 className="text-sm font-bold text-white uppercase tracking-[0.15em] mb-6 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-emerald-400" /> AI Tailoring Log
          </h4>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
            {decisions.map((decision, i) => (
              <motion.div variants={item} key={i} className="flex items-start gap-4 text-sm p-3 -mx-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
                <div className="mt-1 shrink-0 w-6 h-6 rounded bg-black/40 border border-white/5 flex items-center justify-center">
                  {decision.type === "rewrite" && <PenLine className="w-3.5 h-3.5 text-[var(--neon-cyan)]" />}
                  {decision.type === "reorder" && <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />}
                  {decision.type === "emphasize" && <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  {decision.type === "hide" && <ShieldCheck className="w-3.5 h-3.5 text-red-400" />}
                  {decision.type === "keyword_inject" && <Sparkles className="w-3.5 h-3.5 text-[var(--neon-purple)]" />}
                </div>
                <div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest block mb-0.5 group-hover:text-white/70 transition-colors">{decision.section}</span>
                  <p className="text-xs text-white/70 leading-relaxed font-medium group-hover:text-white transition-colors">{decision.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </GlassPanel>
      )}
    </div>
  )
}
