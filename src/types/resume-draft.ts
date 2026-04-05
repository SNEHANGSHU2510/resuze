import { NormalizedResumeData } from "@/types/normalized-resume"

export interface ResumeDraftState {
  title: string
  templateSlug: string
  data: NormalizedResumeData
  // Optional visibility toggles to hide certain sections
  visibility: {
    summary: boolean
    education: boolean
    experience: boolean
    projects: boolean
    skills: boolean
  }
}
