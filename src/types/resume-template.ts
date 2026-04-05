export type ResumeTemplateCategory = "Classic" | "Modern" | "Creative" | "Executive"
export type ATSCompatibility = "ATS Safe" | "Hybrid" | "Visual Premium"
export type LayoutType = "Single Column" | "Two Column"

export interface ResumeTemplate {
  id: string
  name: string
  slug: string
  description: string
  category: ResumeTemplateCategory
  ats_label: ATSCompatibility
  layout: LayoutType
  preview_image_url: string
  recommended_for: string
}
