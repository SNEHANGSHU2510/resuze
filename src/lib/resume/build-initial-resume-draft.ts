import { NormalizedResumeData } from "@/types/normalized-resume"
import { ResumeDraftState } from "@/types/resume-draft"

export function buildInitialResumeDraft(
  normalizedProfile: NormalizedResumeData,
  defaultTemplate: string = "corporate-modern"
): ResumeDraftState {
  // Deep clone to ensure we don't accidentally mutate the underlying profile
  const copy = JSON.parse(JSON.stringify(normalizedProfile))

  return {
    title: "Untitled Resume",
    templateSlug: defaultTemplate,
    data: copy,
    visibility: {
      summary: true,
      education: true,
      experience: true,
      projects: true,
      skills: true,
    }
  }
}
