"use client"

import * as React from "react"
import { JDInputState } from "@/types/job-description"
import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import { FileText, Loader2, Sparkles } from "lucide-react"

interface JobDescriptionFormProps {
  onGenerate: (input: JDInputState) => void
  isGenerating: boolean
}

export function JobDescriptionForm({ onGenerate, isGenerating }: JobDescriptionFormProps) {
  const [rawText, setRawText] = React.useState("")
  const [roleTitle, setRoleTitle] = React.useState("")
  const [company, setCompany] = React.useState("")

  const canGenerate = rawText.trim().length > 50

  const handleSubmit = () => {
    if (!canGenerate) return
    onGenerate({
      raw_text: rawText,
      role_title: roleTitle,
      company: company,
    })
  }

  return (
    <GlassPanel className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Target Job Description</h3>
          <p className="text-xs text-muted-foreground">Paste the full job description to align your resume.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Target Role</label>
          <input
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Company</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="e.g. Google"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Job Description</label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={12}
          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y leading-relaxed font-mono"
          placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and any listed tools or technologies..."
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">{rawText.length} characters</span>
          {rawText.length > 0 && rawText.length < 50 && (
            <span className="text-xs text-amber-400">Minimum 50 characters needed</span>
          )}
        </div>
      </div>

      <GlowButton
        onClick={handleSubmit}
        disabled={!canGenerate || isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing & Tailoring...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Tailored Resume
          </>
        )}
      </GlowButton>
    </GlassPanel>
  )
}
