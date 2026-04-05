import { NormalizedResumeData } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"

/**
 * Scores how well the resume content semantically aligns with the JD role.
 * Uses lexical overlap as a deterministic proxy for semantic similarity.
 * Returns 0-100.
 */
export function scoreRoleRelevance(data: NormalizedResumeData, jd: ParsedJobDescription): number {
  let score = 50 // baseline

  const resumeText = [
    data.personal.summary,
    data.personal.headline,
    ...data.experience.map((e) => `${e.title} ${e.company}`),
    ...data.experience.flatMap((e) => e.bullets),
    ...data.projects.map((p) => `${p.name} ${p.role}`),
    ...data.projects.flatMap((p) => p.bullets),
  ].join(" ").toLowerCase()

  // Role title alignment (+15 max)
  if (jd.role_title) {
    const roleParts = jd.role_title.toLowerCase().split(/\s+/)
    let roleHits = 0
    for (const part of roleParts) {
      if (part.length > 2 && resumeText.includes(part)) roleHits++
    }
    score += Math.round((roleHits / Math.max(1, roleParts.length)) * 15)
  }

  // Responsibility alignment (+20 max)
  if (jd.responsibilities.length > 0) {
    let respHits = 0
    for (const resp of jd.responsibilities) {
      const respWords = resp.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      let wordHits = 0
      for (const word of respWords) {
        if (resumeText.includes(word)) wordHits++
      }
      if (respWords.length > 0 && wordHits / respWords.length > 0.3) {
        respHits++
      }
    }
    const respRatio = respHits / Math.max(1, jd.responsibilities.length)
    score += Math.round(respRatio * 20)
  }

  // Domain focus alignment (+10 max)
  if (jd.domain_focus.length > 0) {
    let domainHits = 0
    for (const domain of jd.domain_focus) {
      if (resumeText.includes(domain.toLowerCase())) domainHits++
    }
    score += Math.round((domainHits / jd.domain_focus.length) * 10)
  }

  // Seniority alignment (+5 max)
  if (jd.seniority_level !== "unknown") {
    const seniorityMarkers: Record<string, string[]> = {
      junior: ["intern", "entry", "junior", "associate"],
      mid: ["mid", "intermediate"],
      senior: ["senior", "sr.", "sr "],
      lead: ["lead", "principal", "staff", "architect"],
      executive: ["director", "vp", "head", "chief", "cto"],
    }
    const markers = seniorityMarkers[jd.seniority_level] || []
    for (const marker of markers) {
      if (resumeText.includes(marker)) {
        score += 5
        break
      }
    }
  }

  return Math.max(0, Math.min(100, score))
}
