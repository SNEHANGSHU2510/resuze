import { NormalizedResumeData } from "@/types/normalized-resume"

/**
 * Extracts all meaningful words and phrases from a resume's normalized data.
 * Returns lowercase arrays for direct comparison.
 */
export function extractResumeKeywords(data: NormalizedResumeData): {
  all_words: string[]
  skill_names: string[]
  bullet_text: string
  full_text: string
} {
  const skill_names = data.skills.map((s) => s.name.toLowerCase())

  const bulletTexts = [
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.flatMap((p) => p.bullets),
  ]

  const allTextParts = [
    data.personal.summary,
    data.personal.headline,
    ...data.experience.map((e) => `${e.title} ${e.company} ${e.description}`),
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.map((p) => `${p.name} ${p.role} ${p.description}`),
    ...data.projects.flatMap((p) => p.bullets),
    ...data.skills.map((s) => s.name),
    ...data.education.map((e) => `${e.degree} ${e.field_of_study} ${e.institution}`),
  ]

  const full_text = allTextParts.join(" ").toLowerCase()

  const all_words = full_text
    .replace(/[^a-z0-9\s\-\.\/\+\#]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)

  return {
    all_words: [...new Set(all_words)],
    skill_names,
    bullet_text: bulletTexts.join(" ").toLowerCase(),
    full_text,
  }
}
