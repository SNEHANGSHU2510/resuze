"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TemplateRenderer } from "./template-renderer"
import { NormalizedResumeData } from "@/types/normalized-resume"

interface TemplatePreviewModalProps {
  isOpen: boolean
  slug: string | null
  onClose: () => void
  data: NormalizedResumeData
}

export function TemplatePreviewModal({ isOpen, slug, onClose, data }: TemplatePreviewModalProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen || !slug) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] bg-black border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
            <div>
              <h2 className="text-lg font-bold text-white capitalize tracking-wide">{slug.replace(/-/g, ' ')} Template</h2>
              <p className="text-xs text-muted-foreground">Previewing with your profile data</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Scaled Preview Surface */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 bg-zinc-950 flex justify-center items-start">
            <div className="w-full max-w-[800px] origin-top mx-auto shadow-2xl shadow-black/50">
              <TemplateRenderer slug={slug} data={data} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
