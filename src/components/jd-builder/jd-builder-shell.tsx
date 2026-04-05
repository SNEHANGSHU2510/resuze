"use client"

import * as React from "react"
import { NormalizedResumeData } from "@/types/normalized-resume"
import { JDInputState } from "@/types/job-description"
import { TailoredResumeState } from "@/types/tailored-resume"
import { parseJobDescription } from "@/lib/jd/parse-job-description"
import { buildTailoredResumeDraft } from "@/lib/jd/build-tailored-resume-draft"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

import { JobDescriptionForm } from "./job-description-form"
import { JDToolbar } from "./jd-toolbar"
import { JDLivePreview } from "./jd-live-preview"
import { TailoringControls } from "./tailoring-controls"
import { TailoredSummarySection } from "./tailored-summary-section"
import { TailoredExperienceSection } from "./tailored-experience-section"
import { TailoredProjectsSection } from "./tailored-projects-section"
import { ExportPDFButton } from "@/components/export/export-pdf-button"
import { useToast } from "@/components/ui/toast-provider"
import { motion, AnimatePresence } from "framer-motion"

interface JDBuilderShellProps {
  normalizedData: NormalizedResumeData
}

export function JDBuilderShell({ normalizedData }: JDBuilderShellProps) {
  const [phase, setPhase] = React.useState<"input" | "editing">("input")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)
  const [draft, setDraft] = React.useState<TailoredResumeState | null>(null)
  const [savedResumeId, setSavedResumeId] = React.useState<string | null>(null)
  const previewRef = React.useRef<HTMLDivElement>(null)

  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const updateDraft = React.useCallback((fn: (d: TailoredResumeState) => void) => {
    setDraft((prev) => {
      if (!prev) return prev
      const clone: TailoredResumeState = JSON.parse(JSON.stringify(prev))
      fn(clone)
      return clone
    })
  }, [])

  const handleGenerate = async (input: JDInputState) => {
    setIsGenerating(true)

    // Simulate a brief processing delay to feel intelligent
    await new Promise((r) => setTimeout(r, 800))

    try {
      // 1. Parse the JD
      const parsedJD = parseJobDescription(input)

      // 2. Build tailored draft
      const tailored = buildTailoredResumeDraft(normalizedData, parsedJD, "ats-classic")

      // 3. Save the JD to database
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        const { data: jdRecord } = await supabase.from("job_descriptions").insert({
          user_id: userData.user.id,
          job_title: input.role_title || "Untitled Role",
          company: input.company || null,
          content: input.raw_text,
          parsed_requirements: parsedJD,
        }).select().single()

        if (jdRecord) {
          tailored.jd_id = jdRecord.id
        }
      }

      setDraft(tailored)
      setPhase("editing")
      toast("success", `Tailored resume generated — ${tailored.match_score}% match`)
    } catch (err) {
      console.error("Tailoring failed:", err)
      toast("error", "Failed to generate tailored resume. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!draft) return
    try {
      setIsSaving(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const { data, error } = await supabase.from("resumes").insert({
        user_id: userData.user.id,
        title: draft.title || "Tailored Resume",
        source_type: "jd_tailoring",
        resume_json: {
          template_slug: draft.templateSlug,
          data: draft.data,
          visibility: draft.visibility,
          source: "jd_tailoring",
          jd_id: draft.jd_id,
          match_score: draft.match_score,
        },
      }).select().single()

      if (error) throw error
      if (data) setSavedResumeId(data.id)
      setLastSaved(new Date())
      toast("success", "Tailored resume saved to your vault")
      router.refresh()
    } catch (err) {
      console.error(err)
      toast("error", "Failed to save tailored resume. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartOver = () => {
    setDraft(null)
    setPhase("input")
    setLastSaved(null)
  }

  return (
    <div className="min-h-screen pb-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div
            key="input-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <JobDescriptionForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
            <div>
              <JDLivePreview draft={draft} />
            </div>
          </motion.div>
        )}

        {phase === "editing" && draft && (
          <motion.div
            key="editing-phase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 glass-heavy rounded-2xl mb-6 sticky top-4 z-40 shadow-2xl">
              <JDToolbar
                draft={draft}
                updateDraft={updateDraft}
                onSave={handleSave}
                isSaving={isSaving}
                lastSaved={lastSaved}
              />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <ExportPDFButton
                  getExportElement={() => previewRef.current}
                  resumeId={savedResumeId || undefined}
                  title={draft.title || "Tailored Resume"}
                  compact
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Edit + Intelligence Panels */}
              <div className="lg:col-span-4 space-y-6">
                {/* Tailoring Intelligence */}
                <TailoringControls
                  parsedJD={draft.parsed_jd}
                  decisions={draft.tailoring_decisions}
                  matchScore={draft.match_score}
                />

                {/* Start Over */}
                <button
                  onClick={handleStartOver}
                  className="text-xs text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
                >
                  ← Start over with a different JD
                </button>
              </div>

              {/* Center: Editable Content */}
              <div className="lg:col-span-4">
                <div className="glass-heavy p-5 rounded-2xl border border-white/5 space-y-6 shadow-inner">
                  <TailoredSummarySection draft={draft} updateDraft={updateDraft} />
                  <TailoredExperienceSection draft={draft} updateDraft={updateDraft} />
                  <TailoredProjectsSection draft={draft} updateDraft={updateDraft} />

                  {/* Skills and Education toggles */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-white tracking-widest uppercase">Skills</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="jd-toggle-skills"
                          checked={draft.visibility.skills}
                          onChange={(e) => updateDraft((d) => { d.visibility.skills = e.target.checked })}
                          className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-blue)] focus:ring-[var(--neon-blue)]/50 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="jd-toggle-skills" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Show</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-white tracking-widest uppercase">Education</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="jd-toggle-education"
                          checked={draft.visibility.education}
                          onChange={(e) => updateDraft((d) => { d.visibility.education = e.target.checked })}
                          className="rounded border-[var(--neon-blue)]/20 bg-background text-[var(--neon-blue)] focus:ring-[var(--neon-blue)]/50 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="jd-toggle-education" className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Show</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="lg:col-span-4">
                <JDLivePreview draft={draft} previewRef={previewRef} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
