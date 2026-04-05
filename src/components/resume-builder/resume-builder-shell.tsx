"use client"

import * as React from "react"
import { ResumeDraftState } from "@/types/resume-draft"
import { BuilderToolbar } from "./builder-toolbar"
import { EditableSummarySection } from "./editable-summary-section"
import { EditableExperienceSection } from "./editable-experience-section"
import { EditableProjectsSection } from "./editable-projects-section"
import { ResumeLivePreview } from "./resume-live-preview"
import { ExportPDFButton } from "@/components/export/export-pdf-button"
import { useToast } from "@/components/ui/toast-provider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface ResumeBuilderShellProps {
  initialDraft: ResumeDraftState
}

export function ResumeBuilderShell({ initialDraft }: ResumeBuilderShellProps) {
  const [draft, setDraft] = React.useState<ResumeDraftState>(initialDraft)
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [savedResumeId, setSavedResumeId] = React.useState<string | null>(null)
  const previewRef = React.useRef<HTMLDivElement>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  // Unsaved changes warning
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  const updateDraft = React.useCallback((fn: (d: ResumeDraftState) => void) => {
    setDraft((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      fn(clone)
      setHasUnsavedChanges(true)
      return clone
    })
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const { data, error } = await supabase.from("resumes").insert({
        user_id: userData.user.id,
        title: draft.title || "Untitled Document",
        source_type: "manual",
        resume_json: {
          template_slug: draft.templateSlug,
          data: draft.data,
          visibility: draft.visibility
        }
      }).select().single()

      if (error) throw error
      if (data) setSavedResumeId(data.id)
      
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast("success", "Resume draft saved successfully")
      // Soft refresh to update state externally if needed
      router.refresh()
    } catch (err) {
      console.error(err)
      toast("error", "Failed to save resume. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 selection:bg-[var(--neon-blue)]/30 selection:text-white">
      
      {/* Premium Header Controller */}
      <motion.div 
        initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center justify-between p-5 bg-[#0d1f18]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-3xl mb-10 sticky top-6 z-40 transform-gpu"
      >
        <div className="flex-1 w-full max-w-sm group">
           <input 
             value={draft.title}
             onChange={(e) => updateDraft(d => { d.title = e.target.value })}
             className="bg-transparent border-none text-xl font-bold text-white focus:ring-[1px] focus:ring-[var(--neon-blue)]/50 focus:bg-white/[0.02] w-full px-3 py-1.5 rounded-xl mb-1 transition-all"
             placeholder="Resume Title (e.g. Senior SWE - Google)"
           />
           <div className="text-xs text-white/40 px-3 flex items-center gap-2">
             <span>Template: <span className="text-[var(--neon-blue)] capitalize font-semibold">{draft.templateSlug.replace(/-/g, ' ')}</span></span>
             {lastSaved && <span className="text-[var(--neon-cyan)] font-medium">| Last saved {lastSaved.toLocaleTimeString()}</span>}
           </div>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <select
             value={draft.templateSlug}
             onChange={(e) => updateDraft(d => { d.templateSlug = e.target.value })}
             className="bg-black/40 border border-white/10 text-sm font-medium text-white rounded-xl px-4 py-2.5 cursor-pointer focus:ring-[1px] focus:ring-[var(--neon-blue)]/50 outline-none hover:border-white/20 transition-all shadow-inner"
          >
            <option value="ats-classic" className="bg-[#0a1a14]">ATS Classic</option>
            <option value="corporate-modern" className="bg-[#0a1a14]">Corporate Modern</option>
            <option value="executive-glass" className="bg-[#0a1a14]">Executive Glass</option>
          </select>

          <ExportPDFButton
            getExportElement={() => previewRef.current}
            resumeId={savedResumeId || undefined}
            title={draft.title || "Resume"}
            compact
          />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="group relative px-6 py-2.5 outline-none disabled:opacity-50 hover-lift isolate"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-blue)] via-[var(--neon-cyan)] to-[var(--neon-blue)] rounded-xl opacity-80 group-hover:opacity-100 bg-[length:200%_auto] group-hover:animate-[gradient-x_3s_linear_infinite] transition-opacity -z-10" />
             <div className="absolute -inset-1 bg-[var(--neon-cyan)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity -z-20" />
             
             <span className="text-[#050b14] font-bold text-sm flex items-center gap-2 tracking-wide">
               {isSaving ? "Saving State..." : "Commit Build"}
             </span>
          </button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 relative mt-6">
        {/* Left Side: Editor Flow */}
        <motion.div 
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-12 shrink-0"
        >
           <div className="bg-[#0a1510]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/[0.04] space-y-12 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,0.01)] relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-[2.5rem] pointer-events-none" />
             
             <EditableSummarySection draft={draft} updateDraft={updateDraft} />
             <EditableExperienceSection draft={draft} updateDraft={updateDraft} />
             <EditableProjectsSection draft={draft} updateDraft={updateDraft} />

             {/* Footer Toggles */}
             <div className="space-y-6 pt-6 border-t border-white/5 relative z-10">
               <div>
                 <div className="flex items-center justify-between group">
                   <label className="text-sm font-bold text-white tracking-widest uppercase transition-colors group-hover:text-white">Expertise Vectors</label>
                   <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="toggle-skills"
                        checked={draft.visibility.skills}
                        onChange={(e) => updateDraft((d) => { d.visibility.skills = e.target.checked })}
                        className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-cyan)] focus:ring-[var(--neon-cyan)]/50 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="toggle-skills" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wider">Show Global Array</label>
                   </div>
                 </div>
                 <p className="text-xs text-white/30 mt-2 font-medium">
                   {draft.data.skills.length} skills injected via Master Profile.
                 </p>
               </div>
               
               <div>
                 <div className="flex items-center justify-between group">
                   <label className="text-sm font-bold text-white tracking-widest uppercase transition-colors group-hover:text-white">Academic History</label>
                   <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="toggle-education"
                        checked={draft.visibility.education}
                        onChange={(e) => updateDraft((d) => { d.visibility.education = e.target.checked })}
                        className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-cyan)] focus:ring-[var(--neon-cyan)]/50 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="toggle-education" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer tracking-wider">Show Nodes</label>
                   </div>
                 </div>
                 <p className="text-xs text-white/30 mt-2 font-medium">
                   {draft.data.education.length} academic items successfully loaded.
                 </p>
               </div>
             </div>

           </div>
        </motion.div>

        {/* Right Side: Live Template Renderer */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
           className="relative"
        >
          {/* Subtle glow behind document */}
          <div className="absolute inset-0 bg-[var(--neon-cyan)]/10 blur-[100px] pointer-events-none -z-10" />
          <div className="sticky top-[120px]">
             <ResumeLivePreview draft={draft} previewRef={previewRef} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

