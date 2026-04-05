"use client"

import * as React from "react"
import { TailoredResumeState } from "@/types/tailored-resume"
import { Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TailoredSummarySectionProps {
  draft: TailoredResumeState
  updateDraft: (fn: (d: TailoredResumeState) => void) => void
}

export function TailoredSummarySection({ draft, updateDraft }: TailoredSummarySectionProps) {
  
  const allKeywords = React.useMemo(() => {
    if (!draft.parsed_jd) return []
    return [
      ...draft.parsed_jd.must_have_skills,
      ...draft.parsed_jd.preferred_skills,
      ...draft.parsed_jd.tools_technologies
    ].map(k => k.toLowerCase())
  }, [draft.parsed_jd])

  const analysis = React.useMemo(() => {
    const text = draft.data.personal.summary || ""
    const lower = text.toLowerCase()
    const matches = allKeywords.filter(k => lower.includes(k))
    return {
      hasMatch: matches.length > 0
    }
  }, [draft.data.personal.summary, allKeywords])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white tracking-widest uppercase">Abstract Overview</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="jd-toggle-summary"
            checked={draft.visibility.summary}
            onChange={(e) => updateDraft((d) => { d.visibility.summary = e.target.checked })}
            className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-cyan)] focus:ring-[var(--neon-cyan)]/50 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="jd-toggle-summary" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Show</label>
        </div>
      </div>

      <AnimatePresence>
        {draft.visibility.summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative group/summary"
          >
            <textarea
              value={draft.data.personal.summary}
              onChange={(e) => updateDraft((d) => { d.data.personal.summary = e.target.value })}
              rows={5}
              className={`w-full bg-white/[0.02] border focus:outline-none rounded-xl px-4 py-3 text-sm text-white/90 resize-none min-h-[140px] transition-all duration-300 ease-out focus:-translate-y-0.5 focus:shadow-xl ${
                analysis.hasMatch 
                  ? 'border-[var(--neon-cyan)]/40 hover:border-[var(--neon-cyan)]/60 focus:border-[var(--neon-cyan)] bg-gradient-to-r from-[var(--neon-cyan)]/[0.03] to-transparent shadow-[inset_4px_0_0_var(--neon-cyan)]' 
                  : 'border-white/5 hover:border-white/20 focus:border-white/40'
              }`}
            />
            {analysis.hasMatch && (
              <div className="absolute top-2 right-2 pointer-events-none opacity-0 group-hover/summary:opacity-100 transition-opacity flex items-center gap-1.5 bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Keyword Match
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
