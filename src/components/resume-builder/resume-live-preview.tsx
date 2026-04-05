"use client"

import * as React from "react"
import { ResumeDraftState } from "@/types/resume-draft"
import { TemplateRenderer } from "@/components/templates/template-renderer"

interface ResumeLivePreviewProps {
  draft: ResumeDraftState
  previewRef?: React.RefObject<HTMLDivElement | null>
}

export function ResumeLivePreview({ draft, previewRef }: ResumeLivePreviewProps) {
  // Strip out sections from data based on visibility before passing to renderer
  const renderData = React.useMemo(() => {
    return {
      ...draft.data,
      personal: {
        ...draft.data.personal,
        summary: draft.visibility.summary ? draft.data.personal.summary : ""
      },
      education: draft.visibility.education ? draft.data.education : [],
      experience: draft.visibility.experience ? draft.data.experience : [],
      projects: draft.visibility.projects ? draft.data.projects : [],
      skills: draft.visibility.skills ? draft.data.skills : [],
    }
  }, [draft])

  return (
    <div className="sticky top-24 w-full h-[calc(100vh-8rem)] overflow-hidden bg-black/40 border border-white/5 shadow-2xl rounded-2xl flex flex-col items-center justify-start pb-8">
      <div className="w-full h-8 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between shrink-0">
         <span className="text-xs font-mono text-muted-foreground">Preview: {draft.templateSlug}</span>
         <span className="flex gap-1">
           <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
           <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
           <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
         </span>
      </div>
      <div className="w-full h-full overflow-auto flex justify-center p-6 custom-scrollbar bg-zinc-950">
        <div ref={previewRef} className="w-full max-w-[800px] shadow-2xl shadow-black/80 origin-top transform transition-transform duration-300">
           <TemplateRenderer slug={draft.templateSlug} data={renderData} />
        </div>
      </div>
    </div>
  )
}
