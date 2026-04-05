"use client"

import * as React from "react"
import { TailoredResumeState } from "@/types/tailored-resume"
import { TemplateRenderer } from "@/components/templates/template-renderer"
import { motion, AnimatePresence } from "framer-motion"

interface JDLivePreviewProps {
  draft: TailoredResumeState | null
  previewRef?: React.RefObject<HTMLDivElement | null>
}

export function JDLivePreview({ draft, previewRef }: JDLivePreviewProps) {
  const renderData = React.useMemo(() => {
    if (!draft) return null
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

  if (!draft || !renderData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="sticky top-24 w-full h-[calc(100vh-8rem)] bg-black/20 border border-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl"
      >
        <div className="text-center space-y-4 px-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-transparent flex items-center justify-center mx-auto border border-[var(--neon-cyan)]/20 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
            <span className="text-4xl">🔮</span>
          </div>
          <h3 className="text-xl text-white font-bold tracking-tight">Intelligence Canvas</h3>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            Provide a target role. The AI will synthesize a hyper-optimized document preview here.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-24 w-full h-[calc(100vh-8rem)] overflow-hidden bg-black/40 border border-white/10 shadow-2xl shadow-emerald-500/5 rounded-2xl flex flex-col items-center justify-start backdrop-blur-3xl"
    >
      <div className="w-full h-10 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">Live Render • {draft.templateSlug}</span>
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </span>
      </div>
      <div className="w-full h-full overflow-auto flex justify-center p-8 bg-zinc-950/50">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={draft.match_score + draft.data.personal.summary}
            layout
            initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            ref={previewRef} 
            className="w-full max-w-[800px] shadow-[0_0_50px_rgba(0,0,0,0.5)] origin-top bg-white"
          >
            <TemplateRenderer slug={draft.templateSlug} data={renderData} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
