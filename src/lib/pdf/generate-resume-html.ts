import { NormalizedResumeData } from "@/types/normalized-resume"
import { ResumeDraftState } from "@/types/resume-draft"

/**
 * Applies visibility rules to resume data and returns the filtered version,
 * exactly like the live preview components do.
 */
export function applyVisibility(draft: ResumeDraftState): NormalizedResumeData {
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
}

/**
 * Generates print-safe inline-style HTML for a resume.
 * This is used for the rendered_html field and as a fallback export source.
 * Templates use Tailwind utility classes which resolve at build time,
 * so the actual DOM output captured by html2canvas contains computed styles.
 */
export function generateResumeHTML(containerElement: HTMLElement): string {
  // Clone the node and strip interactive/UI-only elements  
  const clone = containerElement.cloneNode(true) as HTMLElement

  // Remove any buttons, inputs, or interactive controls
  clone.querySelectorAll("button, input, [data-no-print]").forEach((el) => el.remove())

  return clone.outerHTML
}
