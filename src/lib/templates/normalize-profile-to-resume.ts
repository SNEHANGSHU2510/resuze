import { NormalizedResumeData } from "@/types/normalized-resume"

export function normalizeProfileToResume(rawProfileData: any): NormalizedResumeData {
  // Gracefully handles raw database objects from Supabase
  const { profile, education, experience, projects, skills } = rawProfileData

  return {
    personal: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      headline: profile?.headline || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      website: profile?.website || "",
      linkedin_url: profile?.linkedin_url || "",
      github_url: profile?.github_url || "",
      summary: profile?.summary || "",
    },
    education: (education || []).map((edu: any) => ({
      id: edu.id || "",
      institution: edu.institution || "",
      degree: edu.degree || "",
      field_of_study: edu.field_of_study || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      current: !!edu.current,
      description: edu.description || "",
    })),
    experience: (experience || []).map((exp: any) => ({
      id: exp.id || "",
      company: exp.company || "",
      title: exp.title || "",
      location: exp.location || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      current: !!exp.current,
      description: exp.description || "",
      bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
    })),
    projects: (projects || []).map((proj: any) => ({
      id: proj.id || "",
      name: proj.name || "",
      role: proj.role || "",
      url: proj.url || "",
      start_date: proj.start_date || "",
      end_date: proj.end_date || "",
      description: proj.description || "",
      bullets: Array.isArray(proj.bullets) ? proj.bullets : [],
    })),
    skills: (skills || []).map((skill: any) => ({
      id: skill.id || "",
      name: skill.name || "",
      category: skill.category || "Core",
      level: skill.level || "",
    })),
  }
}
