"use client"

import * as React from "react"
import { ResumeDraftState } from "@/types/resume-draft"
import { Trash2, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EditableExperienceSectionProps {
  draft: ResumeDraftState
  updateDraft: (fn: (draft: ResumeDraftState) => void) => void
}

export function EditableExperienceSection({ draft, updateDraft }: EditableExperienceSectionProps) {
  return (
    <div className="space-y-4 relative group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          Experience ({draft.data.experience.length})
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-blue)] animate-[pulse-slow_3s_ease-in-out_infinite]" />
        </label>
        <div className="flex items-center gap-2">
           <input 
             type="checkbox" 
             id="toggle-experience"
             checked={draft.visibility.experience}
             onChange={(e) => updateDraft((d) => { d.visibility.experience = e.target.checked })}
             className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-blue)] focus:ring-[var(--neon-blue)]/50 w-4 h-4 cursor-pointer transition-colors"
           />
           <label htmlFor="toggle-experience" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wider">Show</label>
        </div>
      </div>

      <AnimatePresence>
        {draft.visibility.experience && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-8 border-l border-[var(--neon-blue)]/20 pl-6 py-4 mt-2">
              {draft.data.experience.map((exp, expIndex) => (
                <div key={exp.id} className="space-y-4 relative group/item hover-lift bg-white/[0.01] hover:bg-white/[0.03] p-4 rounded-xl border border-transparent hover:border-white/10 transition-all duration-500">
                  <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)]/50 group-hover/item:bg-[var(--neon-blue)] group-hover/item:shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-300" />
                  
                  <div className="flex flex-col gap-2">
                    <input
                      value={exp.title}
                      onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].title = e.target.value })}
                      className="font-bold text-xl text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--neon-cyan)] px-0 py-1 focus:ring-0 w-full transition-colors"
                      placeholder="Job Title"
                    />
                    <div className="flex flex-wrap gap-2 text-sm text-[var(--neon-cyan)]/60 font-medium">
                      <input
                        value={exp.company}
                        onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].company = e.target.value })}
                        className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--neon-cyan)] px-0 py-1 focus:ring-0 flex-1 min-w-[200px] transition-colors"
                        placeholder="Company Name"
                      />
                      <span className="py-1">|</span>
                      <input
                        value={exp.location}
                        onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].location = e.target.value })}
                        className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--neon-cyan)] px-0 py-1 focus:ring-0 w-32 transition-colors"
                        placeholder="Location"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-3 group/bullet">
                        <span className="text-[var(--neon-blue)] mt-2.5 opacity-80 group-hover/bullet:opacity-100 group-hover/bullet:-translate-y-px transition-all duration-300">▹</span>
                        <textarea
                          value={bullet}
                          onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].bullets[bulletIndex] = e.target.value })}
                          className="flex-1 bg-black/20 border border-transparent hover:border-white/10 hover:bg-black/40 focus:bg-white/[0.03] focus:border-[var(--neon-cyan)]/50 rounded-lg px-3 py-2 text-sm font-medium text-white/90 focus:outline-none resize-y min-h-[50px] transition-all duration-300 transform-gpu focus:-translate-y-[1px] shadow-inner leading-relaxed"
                          rows={2}
                        />
                        <button 
                          onClick={() => updateDraft((d) => { d.data.experience[expIndex].bullets.splice(bulletIndex, 1) })}
                          className="text-white/20 hover:text-red-400 p-2 transition-colors mt-0.5 rounded-lg hover:bg-red-500/10 opacity-0 group-hover/item:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => updateDraft((d) => { d.data.experience[expIndex].bullets.push("Engineered and synthesized new architecture parameters...") })}
                      className="text-[11px] font-bold uppercase tracking-widest text-[var(--neon-blue)]/70 hover:text-[var(--neon-blue)] flex items-center gap-1.5 transition-all duration-300 pl-6 pt-2 hover:translate-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Inject Telemetry Node
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

