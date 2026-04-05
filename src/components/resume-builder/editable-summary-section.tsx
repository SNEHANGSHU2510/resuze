"use client"

import * as React from "react"
import { ResumeDraftState } from "@/types/resume-draft"
import { motion, AnimatePresence } from "framer-motion"

interface EditableSummarySectionProps {
  draft: ResumeDraftState
  updateDraft: (fn: (draft: ResumeDraftState) => void) => void
}

export function EditableSummarySection({ draft, updateDraft }: EditableSummarySectionProps) {
  return (
    <div className="space-y-4 relative group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          Professional Summary
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-blue)] animate-pulse" />
        </label>
        <div className="flex items-center gap-2">
           <input 
             type="checkbox" 
             id="toggle-summary"
             checked={draft.visibility.summary}
             onChange={(e) => updateDraft((d) => { d.visibility.summary = e.target.checked })}
             className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-blue)] focus:ring-[var(--neon-blue)]/50 w-4 h-4 cursor-pointer transition-colors"
           />
           <label htmlFor="toggle-summary" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wider">Show</label>
        </div>
      </div>
      
      <AnimatePresence>
        {draft.visibility.summary && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <textarea
              value={draft.data.personal.summary}
              onChange={(e) => updateDraft((d) => { d.data.personal.summary = e.target.value })}
              rows={5}
              className="w-full bg-black/40 border border-[var(--neon-blue)]/10 rounded-xl px-5 py-4 text-[14px] font-medium text-white placeholder:text-white/20 hover:border-[var(--neon-blue)]/30 hover:bg-white/[0.02] focus:outline-none focus:ring-[1px] focus:ring-[var(--neon-cyan)]/50 focus:border-[var(--neon-cyan)]/50 focus:bg-white/[0.03] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 transform-gpu hover:-translate-y-[1px] focus:-translate-y-[2px] leading-relaxed resize-y min-h-[120px]"
              placeholder="Enter a professional summary..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
