"use client"

import * as React from "react"
import { TailoredResumeState } from "@/types/tailored-resume"
import { GlowButton } from "@/components/ui/glow-button"
import { Save, Loader2 } from "lucide-react"

interface JDToolbarProps {
  draft: TailoredResumeState | null
  updateDraft: (fn: (draft: TailoredResumeState) => void) => void
  onSave: () => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
}

export function JDToolbar({ draft, updateDraft, onSave, isSaving, lastSaved }: JDToolbarProps) {
  if (!draft) return null

  return (
    <>
      <div className="flex-1 w-full max-w-sm">
        <input
          value={draft.title}
          onChange={(e) => updateDraft((d) => { d.title = e.target.value })}
          className="bg-transparent border-none text-xl font-bold text-white focus:ring-1 focus:ring-[var(--neon-blue)]/50 w-full px-2 py-1 rounded-xl mb-1"
          placeholder="Resume Title"
        />
        <div className="text-xs text-white/40 px-2 flex items-center gap-2">
          <span>Template: <span className="text-[var(--neon-blue)] capitalize">{draft.templateSlug.replace(/-/g, " ")}</span></span>
          <span className="text-white/20">•</span>
          <span>Match: <span className="text-[var(--neon-cyan)] font-bold">{draft.match_score}%</span></span>
          {lastSaved && <span className="text-[var(--neon-cyan)] italic">| Saved {lastSaved.toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <select
          value={draft.templateSlug}
          onChange={(e) => updateDraft((d) => { d.templateSlug = e.target.value })}
          className="glass-heavy border border-white/10 text-sm text-white rounded-xl px-3 py-2 cursor-pointer focus:ring-1 focus:ring-[var(--neon-blue)]/50 outline-none"
        >
          <option value="ats-classic" className="bg-[#0a1a14]">ATS Classic</option>
          <option value="corporate-modern" className="bg-[#0a1a14]">Corporate Modern</option>
          <option value="executive-glass" className="bg-[#0a1a14]">Executive Glass</option>
        </select>

        <GlowButton onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save"}
        </GlowButton>
      </div>
    </>
  )
}
