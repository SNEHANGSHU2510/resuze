"use client"

import * as React from "react"
import { ResumeTemplate } from "@/types/resume-template"
import { NormalizedResumeData } from "@/types/normalized-resume"
import { TEMPLATE_SEED_DATA } from "@/lib/templates/template-registry"
import { TemplateCard } from "./template-card"
import { TemplatePreviewModal } from "./template-preview-modal"
import { motion } from "framer-motion"

interface TemplateGalleryProps {
  normalizedData: NormalizedResumeData
}

export function TemplateGallery({ normalizedData }: TemplateGalleryProps) {
  const [selectedSlug, setSelectedSlug] = React.useState<string>("corporate-modern") // Fallback default
  const [previewSlug, setPreviewSlug] = React.useState<string | null>(null)

  // Future implementation: Synchronize `selectedSlug` with a preferred_template_slug field in Supabase user profiles

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATE_SEED_DATA.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <TemplateCard
              template={template}
              isSelected={selectedSlug === template.slug}
              onSelect={setSelectedSlug}
              onPreview={setPreviewSlug}
            />
          </motion.div>
        ))}
      </div>

      <TemplatePreviewModal 
        isOpen={previewSlug !== null}
        slug={previewSlug}
        onClose={() => setPreviewSlug(null)}
        data={normalizedData}
      />
    </div>
  )
}
