"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import { FileText, Loader2, BarChart3, Search } from "lucide-react"

interface SavedResume {
  id: string
  title: string
  resume_json: any
  created_at: string
}

interface SavedJD {
  id: string
  job_title: string
  company: string | null
  content: string
  parsed_requirements: any
}

interface ATSControlsProps {
  savedResumes: SavedResume[]
  savedJDs: SavedJD[]
  selectedResumeId: string | null
  selectedJDId: string | null
  jdPasteText: string
  onSelectResume: (id: string) => void
  onSelectJD: (id: string) => void
  onPasteJD: (text: string) => void
  onRunAnalysis: () => void
  isAnalyzing: boolean
  hasReport: boolean
}

export function ATSControls({
  savedResumes,
  savedJDs,
  selectedResumeId,
  selectedJDId,
  jdPasteText,
  onSelectResume,
  onSelectJD,
  onPasteJD,
  onRunAnalysis,
  isAnalyzing,
  hasReport,
}: ATSControlsProps) {
  const [jdMode, setJdMode] = React.useState<"saved" | "paste">(savedJDs.length > 0 ? "saved" : "paste")

  const canRun = !!selectedResumeId && (!!selectedJDId || jdPasteText.trim().length > 50)

  return (
    <div className="space-y-6">
      {/* Resume Selection */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Resume</h3>
        </div>
        {savedResumes.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-auto">
            {savedResumes.map((resume) => (
              <button
                key={resume.id}
                onClick={() => onSelectResume(resume.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedResumeId === resume.id
                    ? "bg-primary/10 border-primary/50 text-white"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <span className="text-sm font-medium block truncate">{resume.title}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(resume.created_at).toLocaleDateString()} •{" "}
                  {resume.resume_json?.source === "jd_tailoring" ? "JD Tailored" : "Manual"}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No saved resumes yet. Build one in the Resume Builder first.</p>
        )}
      </GlassPanel>

      {/* JD Selection */}
      <GlassPanel className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Job Description</h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setJdMode("saved")}
              className={`px-2 py-1 text-[10px] rounded ${jdMode === "saved" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}
            >
              Saved
            </button>
            <button
              onClick={() => setJdMode("paste")}
              className={`px-2 py-1 text-[10px] rounded ${jdMode === "paste" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}
            >
              Paste New
            </button>
          </div>
        </div>

        {jdMode === "saved" && savedJDs.length > 0 && (
          <div className="space-y-2 max-h-36 overflow-auto">
            {savedJDs.map((jd) => (
              <button
                key={jd.id}
                onClick={() => onSelectJD(jd.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedJDId === jd.id
                    ? "bg-cyan-400/10 border-cyan-400/50 text-white"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                }`}
              >
                <span className="text-sm font-medium block truncate">{jd.job_title}</span>
                {jd.company && <span className="text-[10px] text-muted-foreground">{jd.company}</span>}
              </button>
            ))}
          </div>
        )}

        {jdMode === "saved" && savedJDs.length === 0 && (
          <p className="text-xs text-muted-foreground mb-2">No saved JDs. Switch to Paste New.</p>
        )}

        {jdMode === "paste" && (
          <textarea
            value={jdPasteText}
            onChange={(e) => onPasteJD(e.target.value)}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/50 resize-y font-mono leading-relaxed"
            placeholder="Paste a job description here (minimum 50 characters)..."
          />
        )}
      </GlassPanel>

      {/* Run Analysis */}
      <GlowButton
        onClick={onRunAnalysis}
        disabled={!canRun || isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Running ATS Analysis...
          </>
        ) : (
          <>
            <BarChart3 className="w-4 h-4 mr-2" />
            {hasReport ? "Re-Run Analysis" : "Run ATS Analysis"}
          </>
        )}
      </GlowButton>
    </div>
  )
}
