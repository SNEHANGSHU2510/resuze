"use client"

import * as React from "react"
import { ResumeDraftState } from "@/types/resume-draft"
import { GlowButton } from "@/components/ui/glow-button"
import { Save, Loader2, FileCheck, Copy } from "lucide-react"

interface BuilderToolbarProps {
  draft: ResumeDraftState
  updateDraft: (fn: (draft: ResumeDraftState) => void) => void
  onSave: () => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
}

export function BuilderToolbar({ draft, updateDraft, onSave, isSaving, lastSaved }: BuilderToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-md sticky top-4 z-40 shadow-2xl">
      <div className="flex-1 w-full max-w-sm">
         <input 
           value={draft.title}
           onChange={(e) => updateDraft(d => { d.title = e.target.value })}
           className="bg-transparent border-none text-xl font-bold text-white focus:ring-1 focus:ring-primary/50 w-full px-2 py-1 rounded"
           placeholder="Resume Title (e.g. Senior SWE - Google)"
         />
         <div className="text-xs text-muted-foreground px-2 flex items-center gap-2">
           <span>Template: <span className="text-white capitalize">{draft.templateSlug.replace(/-/g, ' ')}</span></span>
           {lastSaved && <span className="text-emerald-400">| Last saved {lastSaved.toLocaleTimeString()}</span>}
         </div>
      </div>

      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <select
           value={draft.templateSlug}
           onChange={(e) => updateDraft(d => { d.templateSlug = e.target.value })}
           className="bg-white/5 border border-white/10 text-sm text-white rounded-md px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary/50 outline-none"
        >
          <option value="ats-classic">ATS Classic</option>
          <option value="corporate-modern">Corporate Modern</option>
          <option value="executive-glass">Executive Glass</option>
        </select>

        <GlowButton onClick={onSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save Draft"}
        </GlowButton>
      </div>
    </div>
  )
}
