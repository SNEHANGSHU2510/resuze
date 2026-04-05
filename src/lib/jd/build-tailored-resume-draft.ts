import { NormalizedResumeData } from "@/types/normalized-resume"
import { ParsedJobDescription } from "@/types/job-description"
import { TailoredResumeState, TailoringDecision } from "@/types/tailored-resume"
import { tailorSummary } from "./tailor-summary"
import { tailorExperience } from "./tailor-experience"
import { tailorProjects } from "./tailor-projects"
import { rankSkillsByRelevance, scoreResumeRelevance } from "./score-resume-relevance"

/**
 * The central tailoring orchestrator.
 * Takes normalized profile data + parsed JD and produces a TailoredResumeState
 * ready for preview and editing.
 *
 * This function is fully deterministic and rule-based.
 * It is designed to be swappable with an LLM-enhanced version in the future.
 */
export function buildTailoredResumeDraft(
  normalizedData: NormalizedResumeData,
  parsedJD: ParsedJobDescription,
  templateSlug: string = "ats-classic"
): TailoredResumeState {
  // Deep clone to ensure we never mutate the source profile
  const data: NormalizedResumeData = JSON.parse(JSON.stringify(normalizedData))
  const decisions: TailoringDecision[] = []

  // 1. Tailor summary
  const tailoredSummary = tailorSummary(data, parsedJD)
  if (tailoredSummary !== data.personal.summary) {
    decisions.push({
      type: "rewrite",
      section: "summary",
      description: "Summary rewritten to align with the target role and highlight relevant expertise."
    })
  }
  data.personal.summary = tailoredSummary

  // 2. Tailor experience order and bullet prioritization
  const tailoredExperience = tailorExperience(data.experience, parsedJD)
  if (data.experience.length > 0) {
    decisions.push({
      type: "reorder",
      section: "experience",
      description: `Experience entries reordered by relevance. Bullets prioritized to match ${parsedJD.must_have_skills.length} must-have skills.`
    })
  }
  data.experience = tailoredExperience

  // 3. Tailor projects
  const tailoredProjects = tailorProjects(data.projects, parsedJD)
  if (data.projects.length > 0) {
    decisions.push({
      type: "reorder",
      section: "projects",
      description: "Projects reordered by JD relevance. Most applicable projects displayed first."
    })
  }
  data.projects = tailoredProjects

  // 4. Reorder skills by relevance
  const rankedSkills = rankSkillsByRelevance(data.skills, parsedJD)
  if (data.skills.length > 0) {
    decisions.push({
      type: "reorder",
      section: "skills",
      description: `Skills prioritized. ${parsedJD.must_have_skills.length} must-have and ${parsedJD.preferred_skills.length} preferred skills elevated.`
    })
  }
  data.skills = rankedSkills

  // 5. Compute a rough match score
  const matchScore = scoreResumeRelevance(data, parsedJD)

  // Build the title
  const title = parsedJD.role_title && parsedJD.company
    ? `${parsedJD.role_title} — ${parsedJD.company}`
    : parsedJD.role_title
      ? `Resume for ${parsedJD.role_title}`
      : "Tailored Resume"

  return {
    title,
    templateSlug,
    data,
    visibility: {
      summary: true,
      education: true,
      experience: true,
      projects: data.projects.length > 0,
      skills: true,
    },
    parsed_jd: parsedJD,
    tailoring_decisions: decisions,
    match_score: matchScore,
  }
}
