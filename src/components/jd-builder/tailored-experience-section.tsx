"use client"

import * as React from "react"
import { TailoredResumeState } from "@/types/tailored-resume"
import { Trash2, Plus, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TailoredExperienceSectionProps {
  draft: TailoredResumeState
  updateDraft: (fn: (d: TailoredResumeState) => void) => void
}

export function TailoredExperienceSection({ draft, updateDraft }: TailoredExperienceSectionProps) {
  
  const allKeywords = React.useMemo(() => {
    if (!draft.parsed_jd) return []
    return [
      ...draft.parsed_jd.must_have_skills,
      ...draft.parsed_jd.preferred_skills,
      ...draft.parsed_jd.tools_technologies
    ].map(k => k.toLowerCase())
  }, [draft.parsed_jd])

  const analyzeBullet = (text: string) => {
    const lower = text.toLowerCase()
    const matches = allKeywords.filter(k => lower.includes(k))
    return {
      hasMatch: matches.length > 0,
      matches
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-6">
        <label className="text-sm font-bold text-white tracking-widest uppercase">Experience ({draft.data.experience.length})</label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="jd-toggle-experience"
            checked={draft.visibility.experience}
            onChange={(e) => updateDraft((d) => { d.visibility.experience = e.target.checked })}
            className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-blue)] focus:ring-[var(--neon-blue)]/50 w-4 h-4 cursor-pointer"
          />
          <label htmlFor="jd-toggle-experience" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Show</label>
        </div>
      </div>

      <AnimatePresence>
        {draft.visibility.experience && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 border-l-2 border-white/5 pl-5 py-2 relative"
          >
            {draft.data.experience.map((exp, expIndex) => (
              <div key={exp.id} className="space-y-3 relative group">
                <div className="absolute -left-[27px] top-2 w-3 h-3 rounded-full bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)]/50 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all group-hover:bg-[var(--neon-blue)] group-hover:scale-125" />
                <input
                  value={exp.title}
                  onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].title = e.target.value })}
                  className="font-bold text-white bg-transparent border-none p-0 focus:ring-0 w-full text-lg focus:outline-none placeholder-white/20"
                  placeholder="Job Title"
                />
                <div className="flex gap-2 text-sm text-[var(--neon-cyan)]/80 font-medium">
                  <input
                    value={exp.company}
                    onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].company = e.target.value })}
                    className="bg-transparent border-none p-0 focus:ring-0 flex-1 min-w-0 focus:outline-none placeholder-[var(--neon-cyan)]/30"
                    placeholder="Company"
                  />
                </div>

                <div className="space-y-2.5 mt-2">
                  <AnimatePresence>
                    {exp.bullets.map((bullet, bulletIndex) => {
                      const analysis = analyzeBullet(bullet)
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          key={bulletIndex} 
                          className="flex items-start gap-3 relative group/bullet"
                        >
                          <span className={`mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${analysis.hasMatch ? 'bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]' : 'bg-white/20'}`} />
                          <div className="relative flex-1">
                            <textarea
                              value={bullet}
                              onChange={(e) => updateDraft((d) => { d.data.experience[expIndex].bullets[bulletIndex] = e.target.value })}
                              className={`w-full bg-white/[0.02] border focus:outline-none rounded-lg px-4 py-3 text-sm text-white/90 resize-none min-h-[64px] transition-all duration-300 ease-out focus:-translate-y-0.5 focus:shadow-lg ${
                                analysis.hasMatch 
                                  ? 'border-[var(--neon-cyan)]/40 hover:border-[var(--neon-cyan)]/60 focus:border-[var(--neon-cyan)] bg-gradient-to-r from-[var(--neon-cyan)]/[0.03] to-transparent shadow-[inset_4px_0_0_var(--neon-cyan)]' 
                                  : 'border-white/5 hover:border-white/20 focus:border-white/40'
                              }`}
                              rows={2}
                            />
                            {analysis.hasMatch && (
                              <div className="absolute top-2 right-2 pointer-events-none opacity-0 group-hover/bullet:opacity-100 transition-opacity flex items-center gap-1.5 bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-md">
                                <Sparkles className="w-3 h-3" /> Keyword Match
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => updateDraft((d) => { d.data.experience[expIndex].bullets.splice(bulletIndex, 1) })}
                            className="text-white/20 hover:text-red-400 p-2 transition-colors mt-1 opacity-0 group-hover/bullet:opacity-100 bg-white/5 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  
                  <button
                    onClick={() => updateDraft((d) => { d.data.experience[expIndex].bullets.push("") })}
                    className="text-[10px] font-bold tracking-widest uppercase text-[var(--neon-blue)] hover:text-white flex items-center gap-1.5 transition-colors pl-5 pt-2 hover:translate-x-1"
                  >
                    <Plus className="w-3 h-3" /> Insert Objective
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
