import React from "react"
import { TemplateRegistry } from "@/lib/templates/template-registry"
import { NormalizedResumeData } from "@/types/normalized-resume"

interface TemplateRendererProps {
  slug: string
  data: NormalizedResumeData
}

export function TemplateRenderer({ slug, data }: TemplateRendererProps) {
  const TemplateComponent = TemplateRegistry[slug]

  if (!TemplateComponent) {
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
        <h3 className="font-bold">Template Not Found</h3>
        <p className="text-sm">The template "{slug}" does not exist in the registry.</p>
      </div>
    )
  }

  return <TemplateComponent data={data} />
}
